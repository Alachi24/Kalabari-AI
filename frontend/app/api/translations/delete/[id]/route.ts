import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Verify the translation belongs to the user
    const { data: translation } = await supabase
      .from('translation_history')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!translation || translation.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Translation not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete the translation
    const { error } = await supabase
      .from('translation_history')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to delete translation' },
        { status: 500 }
      )
    }

    console.log('[v0] Translation deleted:', id)
    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
