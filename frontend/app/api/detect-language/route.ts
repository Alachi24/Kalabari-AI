import { NextRequest, NextResponse } from 'next/server';

/**
 * Language detection using zero-shot classification with DistilBERT
 * Maps detected labels to language codes
 */
const LANGUAGE_LABELS: Record<string, string> = {
  'english': 'en',
  'spanish': 'es',
  'french': 'fr',
  'german': 'de',
  'italian': 'it',
  'portuguese': 'pt',
  'dutch': 'nl',
  'russian': 'ru',
  'japanese': 'ja',
  'chinese': 'zh',
  'korean': 'ko',
  'arabic': 'ar',
  'hindi': 'hi',
  'turkish': 'tr',
  'polish': 'pl',
  'swedish': 'sv',
  'norwegian': 'no',
  'danish': 'da',
  'finnish': 'fi',
  'greek': 'el',
  'thai': 'th',
  'vietnamese': 'vi',
  'indonesian': 'id',
  'malay': 'ms',
  'tagalog': 'tl',
  'ukrainian': 'uk',
  'czech': 'cs',
  'hungarian': 'hu',
  'romanian': 'ro',
  'slovak': 'sk',
  'bulgarian': 'bg',
  'croatian': 'hr',
};

/**
 * Detect language using Hugging Face Inference API with DistilBERT
 * Falls back to pattern-based detection if API is unavailable
 */
export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text input' }, { status: 400 });
    }

    // Try using Hugging Face Inference API with DistilBERT for zero-shot classification
    const hfApiKey = process.env.HUGGINGFACE_API_KEY;

    if (hfApiKey) {
      try {
        const languageList = Object.keys(LANGUAGE_LABELS).join(', ');

        const response = await fetch(
          'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
          {
            headers: { Authorization: `Bearer ${hfApiKey}` },
            method: 'POST',
            body: JSON.stringify({
              inputs: text,
              parameters: {
                candidate_labels: languageList,
                multi_class: false,
              },
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const topLabel = result.labels?.[0]?.toLowerCase();
          const detectedLanguage = LANGUAGE_LABELS[topLabel] || 'en';

          return NextResponse.json(
            { language: detectedLanguage, confidence: result.scores?.[0] || 0.5 },
            { status: 200 }
          );
        }
      } catch (error) {
        console.error('[v0] Hugging Face API error:', error);
        // Fall through to simple detection
      }
    }

    // Fallback: Use simple pattern-based detection
    const detectedLanguage = simpleLanguageDetection(text);

    return NextResponse.json(
      { language: detectedLanguage, confidence: 0.5, method: 'pattern-based' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Language detection error:', error);
    return NextResponse.json(
      { error: 'Language detection failed', language: 'en' },
      { status: 200 }
    );
  }
}

/**
 * Simple pattern-based language detection fallback
 */
function simpleLanguageDetection(text: string): string {
  const lowerText = text.toLowerCase();

  // Check for non-Latin scripts
  if (/[\u4E00-\u9FFF]/.test(text)) return 'zh';
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return 'ja';
  if (/[\uAC00-\uD7AF]/.test(text)) return 'ko';
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  if (/[\u0E00-\u0E7F]/.test(text)) return 'th';
  if (/[а-яё]/i.test(text)) return 'ru';

  // Common words for European languages
  const patterns: Record<string, RegExp> = {
    en: /\b(the|is|and|or|in|to|for|of|a|an|have|has|been)\b/i,
    es: /\b(el|la|y|o|en|para|de|un|una|está|son|tienen)\b/i,
    fr: /\b(le|la|et|ou|dans|pour|de|un|une|est|sont|ont)\b/i,
    de: /\b(der|die|das|und|oder|in|zu|von|ein|eine|ist|sind|haben)\b/i,
    it: /\b(il|la|e|o|in|per|di|un|una|è|sono|hanno)\b/i,
    pt: /\b(o|a|e|ou|em|para|de|um|uma|é|são|têm)\b/i,
  };

  let maxScore = 0;
  let detectedLang = 'en';

  for (const [lang, pattern] of Object.entries(patterns)) {
    const matches = lowerText.match(pattern);
    const score = (matches || []).length;

    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  }

  return detectedLang;
}
