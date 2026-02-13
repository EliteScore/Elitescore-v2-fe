import {
  type LearningProvider,
  type ProviderConnection,
  type ProviderCourse,
  type QuestCourseLink,
  type QuestProgressSync,
  type SyncFailure,
  type SyncRun,
} from "@/lib/types/integrations"
import { randomId } from "@/lib/server/crypto"

type TokenRecord = {
  accessToken: string
  refreshToken?: string
}

type UserStore = {
  connections: ProviderConnection[]
  tokens: Record<string, TokenRecord>
  links: QuestCourseLink[]
  progress: Record<number, QuestProgressSync>
}

const db = new Map<string, UserStore>()
const syncRuns: SyncRun[] = []
const syncFailures: SyncFailure[] = []

function getUserStore(userId: string): UserStore {
  const existing = db.get(userId)
  if (existing) return existing

  const created: UserStore = {
    connections: [],
    tokens: {},
    links: [],
    progress: {},
  }
  db.set(userId, created)
  return created
}

export const integrationStore = {
  createConnection(params: {
    userId: string
    provider: LearningProvider
    scopes: string[]
    accessToken: string
    refreshToken?: string
    expiresAtISO?: string
  }) {
    const store = getUserStore(params.userId)
    const now = new Date().toISOString()

    const duplicate = store.connections.find((item) => item.provider === params.provider)
    if (duplicate) {
      duplicate.updatedAtISO = now
      duplicate.status = "active"
      duplicate.scopes = params.scopes
      duplicate.expiresAtISO = params.expiresAtISO
      store.tokens[duplicate.id] = { accessToken: params.accessToken, refreshToken: params.refreshToken }
      return duplicate
    }

    const connection: ProviderConnection = {
      id: randomId("conn"),
      userId: params.userId,
      provider: params.provider,
      status: "active",
      scopes: params.scopes,
      expiresAtISO: params.expiresAtISO,
      createdAtISO: now,
      updatedAtISO: now,
    }

    store.connections.push(connection)
    store.tokens[connection.id] = { accessToken: params.accessToken, refreshToken: params.refreshToken }
    return connection
  },

  getConnections(userId: string) {
    return [...getUserStore(userId).connections]
  },

  getConnection(userId: string, connectionId: string) {
    return getUserStore(userId).connections.find((item) => item.id === connectionId)
  },

  deleteConnection(userId: string, connectionId: string) {
    const store = getUserStore(userId)
    store.connections = store.connections.filter((item) => item.id !== connectionId)
    delete store.tokens[connectionId]
    const linkedQuestIds = new Set(
      store.links.filter((link) => link.connectionId === connectionId).map((link) => link.questId)
    )
    store.links = store.links.filter((item) => item.connectionId !== connectionId)
    for (const questId of linkedQuestIds) {
      store.progress[questId] = {
        questId,
        progressPercent: store.progress[questId]?.progressPercent ?? 0,
        completionState: store.progress[questId]?.completionState ?? "not_started",
        lastSyncedAtISO: store.progress[questId]?.lastSyncedAtISO,
        syncSource: store.progress[questId]?.syncSource,
        linked: false,
        stale: true,
      }
    }
  },

  getConnectionToken(userId: string, connectionId: string) {
    const store = getUserStore(userId)
    return store.tokens[connectionId]
  },

  upsertQuestLink(userId: string, nextLink: Omit<QuestCourseLink, "createdAtISO">) {
    const store = getUserStore(userId)
    const now = new Date().toISOString()
    const existingIndex = store.links.findIndex((item) => item.questId === nextLink.questId)

    const full: QuestCourseLink = {
      ...nextLink,
      createdAtISO: existingIndex >= 0 ? store.links[existingIndex].createdAtISO : now,
    }

    if (existingIndex >= 0) {
      store.links[existingIndex] = full
    } else {
      store.links.push(full)
    }

    if (!store.progress[nextLink.questId]) {
      store.progress[nextLink.questId] = {
        questId: nextLink.questId,
        progressPercent: 0,
        completionState: "not_started",
        linked: true,
      }
    }

    return full
  },

  removeQuestLink(userId: string, questId: number) {
    const store = getUserStore(userId)
    store.links = store.links.filter((item) => item.questId !== questId)
    if (store.progress[questId]) {
      store.progress[questId] = {
        ...store.progress[questId],
        linked: false,
        stale: true,
      }
    }
  },

  getQuestLink(userId: string, questId: number) {
    return getUserStore(userId).links.find((item) => item.questId === questId)
  },

  getLinksForProvider(userId: string, provider: LearningProvider) {
    const store = getUserStore(userId)
    return store.links.filter((item) => item.provider === provider)
  },

  upsertProgress(userId: string, progress: QuestProgressSync) {
    const store = getUserStore(userId)
    store.progress[progress.questId] = progress
    return progress
  },

  getProgress(userId: string, questId: number) {
    return getUserStore(userId).progress[questId]
  },

  getProgressBulk(userId: string, questIds: number[]) {
    const store = getUserStore(userId)
    return questIds.map((questId) => {
      const link = store.links.find((item) => item.questId === questId)
      return {
      questId,
      progressPercent: store.progress[questId]?.progressPercent ?? 0,
      completionState: store.progress[questId]?.completionState ?? "not_started",
      providerCompletedAtISO: store.progress[questId]?.providerCompletedAtISO,
      lastSyncedAtISO: store.progress[questId]?.lastSyncedAtISO,
      syncSource: store.progress[questId]?.syncSource,
      linked: Boolean(link),
      stale: store.progress[questId]?.stale ?? false,
      connectionId: link?.connectionId,
      providerCourseId: link?.providerCourseId,
      }
    })
  },

  addSyncRun(provider: LearningProvider) {
    const run: SyncRun = {
      id: randomId("run"),
      provider,
      startedAtISO: new Date().toISOString(),
      status: "ok",
      processed: 0,
      updated: 0,
      failures: 0,
    }
    syncRuns.push(run)
    return run
  },

  completeSyncRun(runId: string, update: Partial<SyncRun>) {
    const run = syncRuns.find((item) => item.id === runId)
    if (!run) return
    Object.assign(run, update)
    if (!run.finishedAtISO) {
      run.finishedAtISO = new Date().toISOString()
    }
  },

  addSyncFailure(item: Omit<SyncFailure, "id" | "createdAtISO">) {
    syncFailures.push({
      id: randomId("sync_fail"),
      createdAtISO: new Date().toISOString(),
      ...item,
    })
  },

  listUsers() {
    return [...db.keys()]
  },

  listSyncFailures() {
    return [...syncFailures]
  },

  listCourses(_userId: string, provider: LearningProvider): ProviderCourse[] {
    if (provider === "udemy_business") {
      return [
        {
          providerCourseId: "udemy-1001",
          title: "Python for Software Engineers",
          providerUrl: "https://business.udemy.com/course/python-for-software-engineers",
          thumbnailUrl: "https://picsum.photos/seed/udemy1/128/72",
        },
        {
          providerCourseId: "udemy-1002",
          title: "Advanced SQL Performance Tuning",
          providerUrl: "https://business.udemy.com/course/advanced-sql-performance-tuning",
          thumbnailUrl: "https://picsum.photos/seed/udemy2/128/72",
        },
      ]
    }

    return [
      {
        providerCourseId: "coursera-2001",
        title: "Machine Learning Foundations",
        providerUrl: "https://www.coursera.org/learn/machine-learning-foundations",
        thumbnailUrl: "https://picsum.photos/seed/coursera1/128/72",
      },
      {
        providerCourseId: "coursera-2002",
        title: "Career Growth with LinkedIn Strategy",
        providerUrl: "https://www.coursera.org/learn/career-growth-linkedin",
        thumbnailUrl: "https://picsum.photos/seed/coursera2/128/72",
      },
    ]
  },
}

