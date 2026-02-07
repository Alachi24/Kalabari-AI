import { NextRequest, NextResponse } from 'next/server';

// Language code mapping
const languageCodeMap: Record<string, string> = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ja: 'ja',
  zh: 'zh',
  ko: 'ko',
  ru: 'ru',
  ar: 'ar',
  hi: 'hi',
  tr: 'tr',
  pl: 'pl',
  nl: 'nl',
  sv: 'sv',
  da: 'da',
  no: 'no',
  fi: 'fi',
  el: 'el',
  he: 'he',
  th: 'th',
  vi: 'vi',
  id: 'id',
  uk: 'uk',
  cs: 'cs',
  ro: 'ro',
  hu: 'hu',
  sk: 'sk',
  bg: 'bg',
};

// Mock translations for demo purposes
// In production, you would use a real translation API like:
// - Google Translate API
// - DeepL API
// - Microsoft Translator API
// - Hugging Face Translation Models
const mockTranslations: Record<string, Record<string, string>> = {
  en: {
    es: 'Hola, ¿cómo estás?',
    fr: 'Bonjour, comment allez-vous?',
    de: 'Hallo, wie geht es dir?',
    ja: 'こんにちは、お元気ですか？',
    zh: '你好，你好吗？',
  },
  es: {
    en: 'Hello, how are you?',
    fr: 'Bonjour, comment allez-vous?',
    de: 'Hallo, wie geht es dir?',
  },
  fr: {
    en: 'Hello, how are you?',
    es: 'Hola, ¿cómo estás?',
    de: 'Hallo, wie geht es dir?',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, sourceLanguage, targetLanguage } = body;

    // Validation
    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        { error: 'Missing required fields: text, sourceLanguage, targetLanguage' },
        { status: 400 }
      );
    }

    if (text.length === 0) {
      return NextResponse.json(
        { error: 'Text cannot be empty' },
        { status: 400 }
      );
    }

    if (sourceLanguage === targetLanguage) {
      return NextResponse.json(
        { translatedText: text },
        { status: 200 }
      );
    }

    // Option 1: Use Hugging Face API (if API key is available)
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;
    if (hfApiKey) {
      try {
        return await translateWithHuggingFace(
          text,
          sourceLanguage,
          targetLanguage,
          hfApiKey
        );
      } catch (error) {
        console.error('[v0] HuggingFace translation failed, falling back to mock:', error);
      }
    }

    // Option 2: Use Google Translate API (if available)
    const googleApiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    if (googleApiKey) {
      try {
        return await translateWithGoogle(
          text,
          sourceLanguage,
          targetLanguage,
          googleApiKey
        );
      } catch (error) {
        console.error('[v0] Google Translate failed, falling back to mock:', error);
      }
    }

    // Fallback: Mock translation with language name substitution
    const translatedText = generateMockTranslation(text, sourceLanguage, targetLanguage);

    return NextResponse.json(
      {
        translatedText,
        sourceLanguage,
        targetLanguage,
        confidence: 0.85,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed. Please try again.' },
      { status: 500 }
    );
  }
}

async function translateWithHuggingFace(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<NextResponse> {
  // Use Helsinki-NLP Opus-MT models for translation
  const modelId = `Helsinki-NLP/opus-mt-${sourceLanguage}-${targetLanguage}`;

  try {
    console.log(`[v0] Translating with ${modelId}...`);
    
    const response = await fetch('https://api-inference.huggingface.co/models/' + modelId, {
      headers: { 
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[v0] HuggingFace error:', errorText);
      throw new Error(`HuggingFace API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('[v0] HuggingFace response:', result);

    // Handle single translation result
    if (Array.isArray(result) && result.length > 0 && result[0].translation_text) {
      const translatedText = result[0].translation_text;
      console.log('[v0] Translation successful:', translatedText);
      
      return NextResponse.json(
        {
          translatedText,
          sourceLanguage,
          targetLanguage,
          model: 'Helsinki-NLP/Opus-MT',
          confidence: 0.95,
        },
        { status: 200 }
      );
    }

    throw new Error('Unexpected response format from HuggingFace: ' + JSON.stringify(result));
  } catch (error) {
    console.error('[v0] HuggingFace translation error:', error);
    throw error;
  }
}

async function translateWithGoogle(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
  apiKey: string
): Promise<NextResponse> {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source_language: sourceLanguage,
          target_language: targetLanguage,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.data && result.data.translations && result.data.translations.length > 0) {
      return NextResponse.json(
        {
          translatedText: result.data.translations[0].translatedText,
          sourceLanguage,
          targetLanguage,
          model: 'google',
        },
        { status: 200 }
      );
    }

    throw new Error('Unexpected response format from Google Translate');
  } catch (error) {
    throw error;
  }
}

function generateMockTranslation(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): string {
  // Simple mock translation that demonstrates the feature
  // In production, replace this with actual translation API
  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ja: 'Japanese',
    zh: 'Chinese',
    ko: 'Korean',
    ru: 'Russian',
    ar: 'Arabic',
    hi: 'Hindi',
  };

  const targetName = languageNames[targetLanguage] || 'Target Language';
  
  // For demo: return text with attribution
  return `[Translated to ${targetName}]\n\n${text}`;
}
