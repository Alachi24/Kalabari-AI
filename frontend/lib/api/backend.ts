// Server-side client for the Spring AI backend (the "BFF" boundary).
//
// The browser never calls the backend directly — it calls Next.js route handlers,
// which call the backend server-to-server using this helper. That keeps the backend
// URL server-only and gives us one place to attach auth and handle errors.

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:8080'

export class BackendError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'BackendError'
  }
}

interface BackendRequestOptions {
  method?: 'GET' | 'POST' | 'DELETE'
  body?: unknown
  /** Supabase access token to forward as a Bearer credential for authenticated endpoints. */
  accessToken?: string
}

/**
 * Call a backend endpoint (path starting with `/api/v1/...`) and return the parsed JSON.
 * Throws {@link BackendError} for non-2xx responses so callers can map the status.
 */
export async function callBackend<T>(
  path: string,
  { method = 'POST', body, accessToken }: BackendRequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`

  let response: Response
  try {
    response = await fetch(`${BACKEND_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })
  } catch (cause) {
    throw new BackendError('Unable to reach the translation service', 502)
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new BackendError(detail || `Backend request failed (${response.status})`, response.status)
  }

  // 204 No Content (e.g. delete) has no body to parse.
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
