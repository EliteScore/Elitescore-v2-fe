import { access, readFile } from "node:fs/promises"
import path from "node:path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const DOWNLOAD_NAME = "glowcart_day_17_25_starter_pack.zip"
const CANDIDATE_PATHS = [
  path.join(process.cwd(), DOWNLOAD_NAME),
  path.join(process.cwd(), "public", DOWNLOAD_NAME),
  path.resolve(process.cwd(), "..", DOWNLOAD_NAME),
]

async function resolveZipPath(): Promise<string | null> {
  for (const p of CANDIDATE_PATHS) {
    try {
      await access(p)
      return p
    } catch {
      // try next path
    }
  }
  return null
}

export async function GET() {
  const zipPath = await resolveZipPath()
  if (!zipPath) {
    return NextResponse.json({ error: "Starter pack not found." }, { status: 404 })
  }

  try {
    const file = await readFile(zipPath)
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${DOWNLOAD_NAME}"`,
        "Cache-Control": "no-store",
      },
    })
  } catch {
    return NextResponse.json({ error: "Unable to read starter pack." }, { status: 500 })
  }
}
