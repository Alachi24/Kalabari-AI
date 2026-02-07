import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      sourceText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      modelUsed = 'Helsinki-NLP/Opus-MT',
    } = body

    // Validate required fields
    if (!sourceText || !translatedText || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to translation_history table
    const { data, error } = await supabase
      .from('translation_history')
      .insert([
        {
          user_id: user.id,
          source_text: sourceText,
          translated_text: translatedText,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          model_used: modelUsed,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('[v0] Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save translation' },
        { status: 500 }
      )
    }

    console.log('[v0] Translation saved:', data.id)
    return NextResponse.json(
      { success: true, translation: data },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
