/**
 * Live smoke test: https://elitescore-v2-fe.vercel.app
 * 1) Auth (same API as the login form) + localStorage session
 * 2) Open an enrolled (or first) challenge
 * 3) Proof modal: Link + Text + file upload (2 files) + Submit
 *
 * Run (PowerShell):
 *   $env:E2E_EMAIL="..."; $env:E2E_PASSWORD="..."; node scripts/live-proof-e2e.mjs
 */
import { chromium } from "playwright"
import { writeFileSync, mkdirSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const BASE = "https://elitescore-v2-fe.vercel.app"
const email = process.env.E2E_EMAIL
const password = process.env.E2E_PASSWORD

if (!email || !password) {
  console.error("Set E2E_EMAIL and E2E_PASSWORD in the environment.")
  process.exit(1)
}

const tmp = join(__dirname, ".e2e-tmp")
mkdirSync(tmp, { recursive: true })
const samplePng = join(tmp, "pixel.png")
const pngB64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
writeFileSync(samplePng, Buffer.from(pngB64, "base64"))
const sampleTxt = join(tmp, "proof-snippet.txt")
writeFileSync(
  sampleTxt,
  "E2E: proof file — see also https://github.com/octocat/Hello-World",
  "utf8",
)

const AUTH = "https://elitescore-auth-jh8f8.ondigitalocean.app"

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()

const log = (msg) => console.log(`[e2e] ${msg}`)

async function loginViaApi() {
  const res = await fetch(`${AUTH}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Auth API ${res.status}: ${t.slice(0, 200)}`)
  }
  return res.json()
}

try {
  log("Session via auth API…")
  const data = await loginViaApi()
  if (!data?.access_token) {
    throw new Error("No access_token in auth response")
  }
  await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 60000 })
  await page.evaluate(
    ({ access_token, refresh_token, user_id, em }) => {
      localStorage.setItem("elitescore_access_token", access_token)
      if (refresh_token) {
        localStorage.setItem("elitescore_refresh_token", String(refresh_token))
      }
      if (user_id) {
        localStorage.setItem("elitescore_user_id", String(user_id))
      }
      localStorage.setItem("elitescore_logged_in", "true")
      localStorage.setItem("elitescore_email", em)
    },
    {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user_id: data.user_id,
      em: email,
    },
  )
  log("localStorage session primed")

  const authHeaders = {
    Authorization: `Bearer ${data.access_token}`,
    "x-user-id": String(data.user_id),
    "Content-Type": "application/json",
  }

  const challengesRes = await fetch(`${BASE}/api/challenges`, { headers: authHeaders })
  const templates = challengesRes.ok ? await challengesRes.json() : []
  const firstTemplateId =
    Array.isArray(templates) && templates[0]?.id != null ? String(templates[0].id) : null

  const myRes = await fetch(`${BASE}/api/challenges/my`, { headers: authHeaders })
  const myPayload = myRes.ok ? await myRes.json() : null
  const activeEnrollment =
    myPayload && Array.isArray(myPayload) ? myPayload.find((e) => String(e?.status).toLowerCase() === "active") : null
  let goTemplateId = activeEnrollment?.challengeTemplateId != null ? String(activeEnrollment.challengeTemplateId) : null

  if (!goTemplateId && firstTemplateId) {
    const specEmail = email.includes("@") ? email.replace(/@/, "+e2e@") : "friend@example.com"
    log(`No active enrollment; trying join ${firstTemplateId} (spectator ${specEmail})…`)
    const joinRes = await fetch(`${BASE}/api/challenges/${firstTemplateId}/join`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ spectatorEmail: specEmail }),
    })
    const jt = await joinRes.text()
    if (!joinRes.ok) {
      log(`Join ${joinRes.status}: ${jt.slice(0, 500)}`)
    } else {
      log("Join OK")
    }
    goTemplateId = firstTemplateId
  }

  if (!goTemplateId) {
    log("No template id. Stop.")
    process.exit(2)
  }

  log(`Challenge page /challenges/${goTemplateId}`)
  await page.goto(`${BASE}/challenges/${goTemplateId}`, { waitUntil: "domcontentloaded", timeout: 60000 })
  const uploadBtn = page.getByRole("button", { name: "Upload Proof" })
  await uploadBtn.waitFor({ state: "visible", timeout: 20000 })
  if (await uploadBtn.isDisabled()) {
    log("Upload Proof disabled (day locked or missed) — could not test submit.")
    process.exit(3)
  }
  await uploadBtn.click()
  const proofDialog = page.locator('[role="dialog"][aria-labelledby="proof-modal-title"]')

  await proofDialog.getByRole("button", { name: "Link" }).click()
  await proofDialog.locator("#proof-link").fill("https://github.com/octocat/Hello-World")
  log("Link + GitHub URL")

  await proofDialog.getByRole("button", { name: "Text" }).click()
  await proofDialog.locator("#proof-text").fill("Live check: text + link + file upload (png, txt) for today.")

  // Third mode is "Upload" (same DOM in all viewports)
  await page.evaluate(() => {
    const d = document.querySelector('[role="dialog"][aria-labelledby="proof-modal-title"]')
    if (!d) {
      return
    }
    const p = Array.from(d.querySelectorAll("p")).find((n) => n.textContent?.trim() === "Proof type")
    const grid = p?.parentElement?.querySelector("[class*=\"grid-cols-3\"]")
    const buttons = grid ? Array.from(grid.querySelectorAll("button")) : []
    if (buttons[2]) {
      ;(buttons[2]).click()
    }
  })
  await new Promise((r) => setTimeout(r, 500))

  try {
    await proofDialog.locator("#proof-files").waitFor({ state: "attached", timeout: 12000 })
    await proofDialog.locator("#proof-files").setInputFiles([samplePng, sampleTxt])
    log("Attached png + txt")
  } catch {
    log("File input did not appear — submitting with link + text only.")
  }

  await proofDialog.getByRole("button", { name: "Submit", exact: true }).click()

  await page
    .getByText(
      /Uploading to secure storage|Uploading files|Submitting|Processing|accepted|rejected|AI feedback|verdict|Could not submit|not configured|NEXT_PUBLIC_SUPABASE/i,
    )
    .first()
    .waitFor({ state: "visible", timeout: 120000 })

  const alert = page.locator('[role="alert"]')
  if (await alert.first().isVisible().catch(() => false)) {
    const t = await alert.first().innerText()
    log(`role=alert: ${t.replace(/\s+/g, " ").trim().slice(0, 400)}`)
  }
  const html = await page.content()
  if (/File upload is not configured|NEXT_PUBLIC_SUPABASE_URL/i.test(html)) {
    log("Result: file upload path blocked — set NEXT_PUBLIC_SUPABASE_* on Vercel to match .env.local.")
    process.exit(4)
  }
  log("Done (see network tab for POST /api/.../proofs and Supabase if files were used).")
} finally {
  await browser.close()
}
