# Local Machine Learning Models Setup

This document explains how to set up local Hugging Face models for language detection and translation using Transformers.js.

## Overview

The app uses two local ML models:
1. **DistilBERT** - For language detection via zero-shot classification
2. **Opus-MT** - For translation (English ↔ Spanish, French, German, etc.)

Both models run entirely on your machine using Transformers.js, meaning no API keys are needed and translations happen offline.

## Installation

### 1. Install Transformers.js

Add the Transformers.js library to your project:

```bash
npm install @xenova/transformers
```

Or using yarn:

```bash
yarn add @xenova/transformers
```

### 2. How It Works

- **Client-side caching**: Models are downloaded on first use and cached in the browser's IndexedDB
- **Server-side inference**: API routes handle model inference on the server
- **Lazy loading**: Models are loaded only when needed to reduce initial bundle size

## Supported Language Pairs

The following translation pairs are currently supported:

- English ↔ Spanish (en-es, es-en)
- English ↔ French (en-fr, fr-en)
- English ↔ German (en-de, de-en)
- English ↔ Portuguese (en-pt, pt-en)
- English ↔ Italian (en-it, it-en)
- English ↔ Japanese (en-ja, ja-en)
- English ↔ Chinese (en-zh, zh-en)

To add more language pairs, update the `modelMap` in `/lib/ml/local-inference.ts`.

## API Endpoints

### Translate (Local)
**POST** `/api/translate-local`

Request body:
```json
{
  "text": "Hello, how are you?",
  "sourceLanguage": "en",
  "targetLanguage": "es"
}
```

Response:
```json
{
  "translatedText": "Hola, ¿cómo estás?",
  "sourceLanguage": "en",
  "targetLanguage": "es",
  "model": "Opus-MT-Local",
  "confidence": 0.95
}
```

### Detect Language (Local)
**POST** `/api/detect-language-local`

Request body:
```json
{
  "text": "Hola, ¿cómo estás?"
}
```

Response:
```json
{
  "detectedLanguage": "es",
  "confidence": 0.9,
  "model": "DistilBERT-Multilingual-Local"
}
```

## Performance Considerations

### First-Time Model Loading
- Models are ~150-300MB each
- First translation request takes 30-60 seconds as models download and initialize
- Subsequent requests are instant (< 1 second)

### Optimization Tips
1. **Preload models** by triggering a dummy translation on app startup
2. **Use Web Workers** (future enhancement) to prevent UI blocking
3. **Implement loading states** to show progress during model initialization

### Reducing Bundle Size
- Models load asynchronously and are cached by the browser
- You can remove support for language pairs you don't need in `modelMap`

## Troubleshooting

### Models not loading?
Check browser console for CORS errors. Models are fetched from Hugging Face CDN.

### Translation is slow?
This is expected for the first request. Subsequent translations should be instant.

### Out of memory errors?
Consider running on a machine with at least 4GB RAM. Model inference requires loading the entire model into memory.

## Environment Variables

No environment variables are required for local models. The app works completely offline after the initial model download.

## File Structure

```
/lib/ml/
  └── local-inference.ts          # Core ML inference functions
/app/api/
  ├── translate-local/route.ts    # Translation API endpoint
  └── detect-language-local/      # Language detection API endpoint
```

## Adding Custom Models

To use different models, modify `/lib/ml/local-inference.ts`:

```typescript
const modelMap: Record<string, string> = {
  'en-es': 'Your-Model-Name', // Change model here
  // ...
};
```

Find available models at [Xenova's HuggingFace repo](https://huggingface.co/Xenova)

## Migration to Cloud API (Optional)

If you later want to switch to cloud APIs:

1. Keep the same API endpoints (`/api/translate-local`, `/api/detect-language-local`)
2. Update the implementations to call external APIs instead
3. No frontend code changes needed
