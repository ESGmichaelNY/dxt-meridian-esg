import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// For server-side usage with Supabase connection pooling
const getConnectionString = () => {
  // Use direct connection for local development
  if (process.env.NODE_ENV === 'development') {
    return process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@127.0.0.1:54322/postgres'
  }
  
  // Use pooled connection for production
  return process.env.DATABASE_URL ?? ''
}

// Create a singleton instance for server-side usage
let db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!db) {
    const connectionString = getConnectionString()
    const client = postgres(connectionString, { 
      prepare: false,
      max: 1, // Use single connection in serverless environment
    })
    db = drizzle(client, { schema })
  }
  return db
}

// Export typed database instance
export type Database = ReturnType<typeof getDb>