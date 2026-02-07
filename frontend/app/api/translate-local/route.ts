import { NextRequest, NextResponse } from 'next/server';
import { translateLocal, detectLanguageLocal } from '@/lib/ml/local-inference';

export async function POST(request: NextRequest) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    console.log('[v0] Translation request:', {
      textLength: text?.length,
      sourceLanguage,
      targetLanguage,
    });

    // Validate input
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Text is required and must be a string' },
        { status: 400 }
      );
    }

    if (!sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Source and target languages are required' },
        { status: 400 }
      );
    }

    // Use local inference for translation
    const result = await translateLocal(text, sourceLanguage, targetLanguage);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Translation failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        translatedText: result.result,
        sourceLanguage,
        targetLanguage,
        model: 'Opus-MT-Local',
        confidence: result.confidence,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Translation API error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
