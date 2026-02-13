import crypto from "node:crypto"

const DEFAULT_KEY = "dev-only-key-change-me-dev-only-key!"

function getKey() {
  const raw = process.env.INTEGRATION_TOKEN_ENC_KEY || DEFAULT_KEY
  return crypto.createHash("sha256").update(raw).digest()
}

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()])
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`
}

export function decryptSecret(payload: string) {
  const [ivHex, encryptedHex] = payload.split(":")
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload")
  }

  const iv = Buffer.from(ivHex, "hex")
  const encrypted = Buffer.from(encryptedHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString("utf8")
}

export function randomId(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`
}

