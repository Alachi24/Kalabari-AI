import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Check if environment variables are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are not set, just return the response without auth checks
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[v0] Supabase environment variables not configured. Skipping auth checks.')
    return supabaseResponse
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // This refreshes a user's auth token
  const { data: { user } } = await supabase.auth.getUser()

  // If user is not authenticated and trying to access protected routes
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    // Redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (user && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}
