import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function createClient(): SupabaseClient {
  if (client) return client

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    // Return a dummy client that won't crash during SSR/build
    return new Proxy({} as SupabaseClient, {
      get: () => () => ({ data: null, error: null }),
    }) as SupabaseClient
  }

  client = createBrowserClient(url, key)
  return client
}
