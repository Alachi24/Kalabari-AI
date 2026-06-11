import { NextRequest, NextResponse } from 'next/server'
import { callBackend, BackendError } from '@/lib/api/backend'

interface GenerateResponse {
  generatedText: string
  modelUsed: string
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, temperature, maxTokens, model } = await request.json()

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'A non-empty "prompt" is required' },
        { status: 400 },
      )
    }

    const result = await callBackend<GenerateResponse>('/api/v1/generate', {
      body: { prompt, temperature, maxTokens, model },
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    if (error instanceof BackendError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error('Generation API error:', error)
    return NextResponse.json({ error: 'Generation failed. Please try again.' }, { status: 500 })
  }
}
