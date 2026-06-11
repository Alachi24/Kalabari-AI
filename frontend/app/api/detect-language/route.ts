import { NextRequest, NextResponse } from 'next/server'
import { callBackend, BackendError } from '@/lib/api/backend'

interface DetectResponse {
  language: string
  languageName: string
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required and must be a string' }, { status: 400 })
    }

    const result = await callBackend<DetectResponse>('/api/v1/detect', { body: { text } })

    // Normalize to the shape the client expects.
    return NextResponse.json(
      {
        detectedLanguage: result.language,
        languageName: result.languageName,
        confidence: result.confidence,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Language detection error:', error)
    return NextResponse.json({ error: 'Language detection failed' }, { status: 500 })
  }
}
