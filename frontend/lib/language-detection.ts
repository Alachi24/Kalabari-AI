// Language detection using a simple heuristic approach
// Maps language codes to names and native names

export const LANGUAGE_MAP: Record<string, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  es: { name: 'Spanish', nativeName: 'Español' },
  fr: { name: 'French', nativeName: 'Français' },
  de: { name: 'German', nativeName: 'Deutsch' },
  it: { name: 'Italian', nativeName: 'Italiano' },
  pt: { name: 'Portuguese', nativeName: 'Português' },
  nl: { name: 'Dutch', nativeName: 'Nederlands' },
  ru: { name: 'Russian', nativeName: 'Русский' },
  ja: { name: 'Japanese', nativeName: '日本語' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ko: { name: 'Korean', nativeName: '한국어' },
  ar: { name: 'Arabic', nativeName: 'العربية' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  tr: { name: 'Turkish', nativeName: 'Türkçe' },
  pl: { name: 'Polish', nativeName: 'Polski' },
  sv: { name: 'Swedish', nativeName: 'Svenska' },
  no: { name: 'Norwegian', nativeName: 'Norsk' },
  da: { name: 'Danish', nativeName: 'Dansk' },
  fi: { name: 'Finnish', nativeName: 'Suomi' },
  el: { name: 'Greek', nativeName: 'Ελληνικά' },
  th: { name: 'Thai', nativeName: 'ไทย' },
  vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  id: { name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  ms: { name: 'Malay', nativeName: 'Bahasa Melayu' },
  tl: { name: 'Tagalog', nativeName: 'Tagalog' },
  uk: { name: 'Ukrainian', nativeName: 'Українська' },
  cs: { name: 'Czech', nativeName: 'Čeština' },
  hu: { name: 'Hungarian', nativeName: 'Magyar' },
  ro: { name: 'Romanian', nativeName: 'Română' },
  sk: { name: 'Slovak', nativeName: 'Slovenčina' },
  bg: { name: 'Bulgarian', nativeName: 'Български' },
  hr: { name: 'Croatian', nativeName: 'Hrvatski' },
};

// Common language indicators based on character sets and word patterns
const LANGUAGE_INDICATORS = {
  en: { patterns: /\b(the|is|and|or|in|to|for|of|a|an)\b/i, score: 0 },
  es: { patterns: /\b(el|la|y|o|en|para|de|un|una)\b/i, score: 0 },
  fr: { patterns: /\b(le|la|et|ou|dans|pour|de|un|une)\b/i, score: 0 },
  de: { patterns: /\b(der|die|das|und|oder|in|zu|von|ein|eine)\b/i, score: 0 },
  it: { patterns: /\b(il|la|e|o|in|per|di|un|una)\b/i, score: 0 },
  pt: { patterns: /\b(o|a|e|ou|em|para|de|um|uma)\b/i, score: 0 },
  ru: { patterns: /[а-яё]/i, score: 0 },
  ja: { patterns: /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/, score: 0 },
  zh: { patterns: /[\u4E00-\u9FFF]/, score: 0 },
  ko: { patterns: /[\uAC00-\uD7AF]/, score: 0 },
  ar: { patterns: /[\u0600-\u06FF]/, score: 0 },
  th: { patterns: /[\u0E00-\u0E7F]/, score: 0 },
};

/**
 * Detect language from text using pattern matching and heuristics
 * Falls back to API call for more accurate detection using DistilBERT
 */
export async function detectLanguage(text: string): Promise<string> {
  if (!text || text.trim().length < 2) {
    return 'en'; // Default to English for empty text
  }

  // Try client-side detection first
  const clientDetected = detectLanguageClient(text);
  if (clientDetected && clientDetected !== 'unknown') {
    return clientDetected;
  }

  // Fall back to server-side DistilBERT detection
  try {
    const response = await fetch('/api/detect-language', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.language || 'en';
    }
  } catch (error) {
    console.error('[v0] Language detection API error:', error);
  }

  return 'en'; // Default to English
}

/**
 * Client-side language detection using character sets and word patterns
 */
function detectLanguageClient(text: string): string {
  const lowerText = text.toLowerCase();

  // Check for non-Latin scripts
  if (/[\u4E00-\u9FFF]/.test(text)) {
    return 'zh'; // Chinese
  }
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) {
    return 'ja'; // Japanese
  }
  if (/[\uAC00-\uD7AF]/.test(text)) {
    return 'ko'; // Korean
  }
  if (/[\u0600-\u06FF]/.test(text)) {
    return 'ar'; // Arabic
  }
  if (/[\u0E00-\u0E7F]/.test(text)) {
    return 'th'; // Thai
  }
  if (/[а-яё]/i.test(text)) {
    return 'ru'; // Russian
  }

  // Score European languages based on common words
  const scores: Record<string, number> = {};

  for (const [lang, { patterns }] of Object.entries(LANGUAGE_INDICATORS)) {
    const matches = lowerText.match(patterns);
    scores[lang] = (matches || []).length;
  }

  // Find language with highest score
  const detected = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  );

  return detected[1] > 0 ? detected[0] : 'unknown';
}

/**
 * Get language name from code
 */
export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code]?.name || code.toUpperCase();
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): Array<{
  code: string;
  name: string;
  nativeName: string;
}> {
  return Object.entries(LANGUAGE_MAP).map(([code, { name, nativeName }]) => ({
    code,
    name,
    nativeName,
  }));
}
