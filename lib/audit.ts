import clientPromise from "@/lib/mongodb"

type AuditEvent = {
  type: string
  actorId?: string
  actorEmail?: string
  resource?: string
  resourceId?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  ip?: string | null
}

export async function writeAudit(event: Omit<AuditEvent, "createdAt">) {
  try {
    const client = await clientPromise
    const db = client.db("devnovate_blog")
    await db.collection("audit_logs").insertOne({ ...event, createdAt: new Date() })
  } catch (err) {
    // Best-effort: never block request flow on audit failure
  }
}


