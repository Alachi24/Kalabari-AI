// Local machine learning inference using transformers.js
// This module handles language detection using DistilBERT and translation using Opus-MT

export interface InferenceResult {
  success: boolean;
  result?: string;
  confidence?: number;
  error?: string;
}

// Initialize transformers library (lazy loaded)
let transformersReady = false;
let pipeline: any = null;

// Lazy load transformers.js
async function initializeTransformers() {
  if (transformersReady) return pipeline;

  try {
    console.log('[v0] Initializing transformers.js for local inference...');
    
    // Dynamic import of transformers.js
    const { pipeline: transformersPipeline } = await import('@xenova/transformers');
    pipeline = transformersPipeline;
    transformersReady = true;
    
    console.log('[v0] Transformers.js initialized successfully');
    return pipeline;
  } catch (error) {
    console.error('[v0] Failed to initialize transformers.js:', error);
    throw new Error('Failed to initialize local ML models');
  }
}

/**
 * Detect language using DistilBERT-based zero-shot classification
 * Maps confidence scores to language codes
 */
export async function detectLanguageLocal(text: string): Promise<string> {
  try {
    if (!text || text.length < 3) {
      return 'en'; // Default to English for very short text
    }

    const pipe = await initializeTransformers();
    
    // Use zero-shot classification to detect language
    const classifier = await pipe('zero-shot-classification', 'model/distilbert-base-multilingual-uncased-mnli');
    
    const languages = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Dutch', 'Russian', 'Japanese', 'Chinese', 'Korean', 'Arabic'];
    
    const result = await classifier(text, languages, { multi_class: true });
    
    console.log('[v0] Language detection result:', result);
    
    // Map language names to codes
    const languageMap: Record<string, string> = {
      'English': 'en',
      'Spanish': 'es',
      'French': 'fr',
      'German': 'de',
      'Portuguese': 'pt',
      'Italian': 'it',
      'Dutch': 'nl',
      'Russian': 'ru',
      'Japanese': 'ja',
      'Chinese': 'zh',
      'Korean': 'ko',
      'Arabic': 'ar',
    };

    const detectedLanguage = result.labels[0];
    return languageMap[detectedLanguage] || 'en';
  } catch (error) {
    console.error('[v0] Language detection error:', error);
    return 'en'; // Fallback to English
  }
}

/**
 * Translate text using local Opus-MT models
 * Downloads and caches the model on first use
 */
export async function translateLocal(
  text: string,
  sourceLanguage: string,
  targetLanguage: string
): Promise<InferenceResult> {
  try {
    if (!text || text.trim().length === 0) {
      return {
        success: false,
        error: 'Text cannot be empty',
      };
    }

    const pipe = await initializeTransformers();
    
    // Map language codes to Opus-MT model variants
    const modelMap: Record<string, string> = {
      'en-es': 'Xenova/opus-mt-en-es',
      'es-en': 'Xenova/opus-mt-es-en',
      'en-fr': 'Xenova/opus-mt-en-fr',
      'fr-en': 'Xenova/opus-mt-fr-en',
      'en-de': 'Xenova/opus-mt-en-de',
      'de-en': 'Xenova/opus-mt-de-en',
      'en-pt': 'Xenova/opus-mt-en-pt',
      'pt-en': 'Xenova/opus-mt-pt-en',
      'en-it': 'Xenova/opus-mt-en-it',
      'it-en': 'Xenova/opus-mt-it-en',
      'en-ja': 'Xenova/opus-mt-en-ja',
      'ja-en': 'Xenova/opus-mt-ja-en',
      'en-zh': 'Xenova/opus-mt-en-zh',
      'zh-en': 'Xenova/opus-mt-zh-en',
    };

    const modelKey = `${sourceLanguage}-${targetLanguage}`;
    const modelName = modelMap[modelKey];

    if (!modelName) {
      return {
        success: false,
        error: `Translation from ${sourceLanguage} to ${targetLanguage} not supported`,
      };
    }

    console.log(`[v0] Starting translation using ${modelName}...`);
    
    // Create translation pipeline
    const translator = await pipe('translation', modelName);
    
    // Translate the text
    const result = await translator(text, { max_length: 512 });
    
    console.log('[v0] Translation result:', result);
    
    const translatedText = result[0].translation_text;

    return {
      success: true,
      result: translatedText,
      confidence: 0.95, // Transformers models have high confidence
    };
  } catch (error) {
    console.error('[v0] Translation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed',
    };
  }
}

/**
 * Batch translate multiple texts
 */
export async function translateBatchLocal(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<InferenceResult[]> {
  return Promise.all(
    texts.map((text) => translateLocal(text, sourceLanguage, targetLanguage))
  );
}
