import { encryptSecret, decryptSecret } from "@/lib/server/crypto"
import { integrationStore } from "@/lib/server/integrations/store"
import { getProviderAdapter } from "@/lib/server/integrations/providers/registry"
import type { LearningProvider, QuestProgressSync } from "@/lib/types/integrations"

export function getConnectionAuthUrl(provider: LearningProvider, userId: string) {
  const state = Buffer.from(JSON.stringify({ userId, t: Date.now() })).toString("base64url")
  const adapter = getProviderAdapter(provider)
  return adapter.getAuthorizeUrl(state)
}

export async function completeConnectionFromCode(params: {
  userId: string
  provider: LearningProvider
  code: string
}) {
  const adapter = getProviderAdapter(params.provider)
  const tokens = await adapter.exchangeCode(params.code)

  return integrationStore.createConnection({
    userId: params.userId,
    provider: params.provider,
    scopes: tokens.scopes,
    expiresAtISO: tokens.expiresAtISO,
    accessToken: encryptSecret(tokens.accessToken),
    refreshToken: tokens.refreshToken ? encryptSecret(tokens.refreshToken) : undefined,
  })
}

export async function listCourses(params: {
  userId: string
  connectionId: string
  query?: string
}) {
  const connection = integrationStore.getConnection(params.userId, params.connectionId)
  if (!connection) {
    throw new Error("Connection not found")
  }

  const tokenRecord = integrationStore.getConnectionToken(params.userId, connection.id)
  if (!tokenRecord) {
    throw new Error("Connection token missing")
  }

  decryptSecret(tokenRecord.accessToken)

  const adapter = getProviderAdapter(connection.provider)
  return adapter.listLearnerCourses({ query: params.query })
}

export async function syncQuestProgress(params: {
  userId: string
  questId: number
}): Promise<QuestProgressSync> {
  const link = integrationStore.getQuestLink(params.userId, params.questId)
  if (!link) {
    throw new Error("Quest is not linked to a provider course")
  }

  const connection = integrationStore.getConnection(params.userId, link.connectionId)
  if (!connection) {
    throw new Error("Linked provider connection not found")
  }

  const tokenRecord = integrationStore.getConnectionToken(params.userId, connection.id)
  if (!tokenRecord) {
    throw new Error("Connection token missing")
  }

  decryptSecret(tokenRecord.accessToken)

  const adapter = getProviderAdapter(link.provider)
  const providerProgress = await adapter.getCourseProgress({ providerCourseId: link.providerCourseId })

  const prev = integrationStore.getProgress(params.userId, params.questId)
  const resolvedProgressPercent = Math.max(prev?.progressPercent ?? 0, providerProgress.progressPercent)

  const synced: QuestProgressSync = {
    questId: params.questId,
    progressPercent: providerProgress.completionState === "completed" ? 100 : resolvedProgressPercent,
    completionState: providerProgress.completionState,
    providerCompletedAtISO: providerProgress.providerCompletedAtISO,
    lastSyncedAtISO: new Date().toISOString(),
    syncSource: link.provider,
    linked: true,
    stale: false,
  }

  return integrationStore.upsertProgress(params.userId, synced)
}

export async function syncProviderForAllUsers(provider: LearningProvider) {
  const run = integrationStore.addSyncRun(provider)
  let processed = 0
  let updated = 0
  let failures = 0

  const users = integrationStore.listUsers()
  for (const userId of users) {
    const links = integrationStore.getLinksForProvider(userId, provider)
    for (const link of links) {
      processed += 1
      try {
        await syncQuestProgress({ userId, questId: link.questId })
        updated += 1
      } catch (error) {
        failures += 1
        integrationStore.addSyncFailure({
          runId: run.id,
          provider,
          connectionId: link.connectionId,
          questId: link.questId,
          message: error instanceof Error ? error.message : "Unknown sync failure",
        })
      }
    }
  }

  integrationStore.completeSyncRun(run.id, {
    processed,
    updated,
    failures,
    status: failures > 0 ? (updated > 0 ? "partial" : "failed") : "ok",
  })

  return { runId: run.id, processed, updated, failures }
}

