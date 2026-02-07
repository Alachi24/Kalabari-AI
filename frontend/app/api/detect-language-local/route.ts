import { NextRequest, NextResponse } from 'next/server';
import { detectLanguageLocal } from '@/lib/ml/local-inference';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    console.log('[v0] Language detection request, text length:', text?.length);

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    // Use local DistilBERT-based detection
    const detectedLanguage = await detectLanguageLocal(text);

    console.log('[v0] Detected language:', detectedLanguage);

    return NextResponse.json(
      {
        detectedLanguage,
        confidence: 0.9,
        model: 'DistilBERT-Multilingual-Local',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Detection API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Detection failed',
      },
      { status: 500 }
    );
  }
}
