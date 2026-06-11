'use server'

import { createClient } from '@/lib/supabase/server'
import { AuthError, SignInData, SignUpData } from '@/lib/types/auth'

export async function signUp(data: SignUpData): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const supabase = await createClient()

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
        },
      },
    })

    if (authError) {
      console.error('Auth signup error:', authError)
      return { success: false, error: { message: authError.message } }
    }

    if (!authData.user) {
      return { success: false, error: { message: 'Failed to create user' } }
    }

    console.log('User signed up successfully:', authData.user.id)
    return { success: true }
  } catch (error) {
    console.error('Unexpected signup error:', error)
    return { success: false, error: { message: 'An unexpected error occurred' } }
  }
}

export async function signIn(data: SignInData): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (authError) {
      console.error('Auth signin error:', authError)
      return { success: false, error: { message: authError.message } }
    }

    if (!authData.user) {
      return { success: false, error: { message: 'Failed to sign in' } }
    }

    console.log('User signed in successfully:', authData.user.id)
    return { success: true }
  } catch (error) {
    console.error('Unexpected signin error:', error)
    return { success: false, error: { message: 'An unexpected error occurred' } }
  }
}

export async function signOut(): Promise<{ success: boolean; error?: AuthError }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Auth signout error:', error)
      return { success: false, error: { message: error.message } }
    }

    console.log('User signed out')
    return { success: true }
  } catch (error) {
    console.error('Unexpected signout error:', error)
    return { success: false, error: { message: 'An unexpected error occurred' } }
  }
}

export async function signInWithOAuth(
  provider: 'google' | 'apple'
): Promise<{ url?: string; error?: AuthError }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (error) {
      console.error('OAuth signin error:', error)
      return { error: { message: error.message } }
    }

    return { url: data.url }
  } catch (error) {
    console.error('Unexpected OAuth signin error:', error)
    return { error: { message: 'An unexpected error occurred' } }
  }
}

export async function getCurrentUser() {
  try {
    const supabase = await createClient()

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    return user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}
