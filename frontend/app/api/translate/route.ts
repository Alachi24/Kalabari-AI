import { NextRequest, NextResponse } from 'next/server'
import { callBackend, BackendError } from '@/lib/api/backend'

interface TranslateResponse {
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  modelUsed: string
}

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage, model } = await request.json()

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLanguage, targetLanguage' },
        { status: 400 },
      )
    }

    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({ translatedText: text, sourceLanguage, targetLanguage }, { status: 200 })
    }

    const result = await callBackend<TranslateResponse>('/api/v1/translate', {
      body: { text, sourceLanguage, targetLanguage, model },
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Translation API error:', error)
    return NextResponse.json({ error: 'Translation failed. Please try again.' }, { status: 500 })
  }
}
