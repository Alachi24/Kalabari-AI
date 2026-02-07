# LinguaAI - Setup Guide

## Overview

LinguaAI uses Hugging Face translation models to provide accurate, real-time language translation. The app uses the **Helsinki-NLP/Opus-MT** models for high-quality translation between 100+ language pairs.

## Getting Started

### 1. Set Up Hugging Face API Key

To enable real translations, you need a Hugging Face API key:

1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account (if you don't have one)
3. Navigate to your profile → Settings → Access Tokens
4. Click "New token" and create a token with `read` access
5. Copy the token

### 2. Add Environment Variables

Add your Hugging Face API key to your project:

**In v0:**
- Click the **Vars** icon in the left sidebar
- Add a new variable: `HUGGINGFACE_API_KEY` with your token

**Or in `.env.local` (if running locally):**
```
HUGGINGFACE_API_KEY=your_token_here
```

### 3. Supported Language Pairs

The app supports translation between 100+ languages using Helsinki-NLP models:

**Common Language Codes:**
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ja` - Japanese
- `zh` - Chinese
- `ko` - Korean
- `ru` - Russian
- `ar` - Arabic
- `hi` - Hindi
- `pl` - Polish
- `nl` - Dutch
- `tr` - Turkish

## How It Works

### Translation Pipeline

1. **Language Detection**: Uses DistilBERT-based detection to identify source language
2. **Model Selection**: Selects appropriate Helsinki-NLP/Opus-MT model
3. **Translation**: Sends text to Hugging Face Inference API
4. **Response**: Returns translated text with confidence score

### Without API Key (Demo Mode)

If no API key is configured, the app uses a mock translation system that:
- Preserves the text structure
- Adds language attribution
- Allows you to test the UI/UX

## Model Details

**Helsinki-NLP/Opus-MT**
- Optimized for translation quality and speed
- Supports 100+ language pairs
- Trained on parallel corpora
- Average latency: 1-3 seconds

## Troubleshooting

**Translation fails without error:**
- Check that your Hugging Face token is valid
- Verify the model exists for your language pair
- Check the browser console for API response details

**Model not found error:**
- Some language pair combinations may not have dedicated models
- Try a different target language
- Or request on Hugging Face community

**Rate limiting:**
- Free tier has rate limits
- Upgrade to Hugging Face Pro for higher limits

## Cost

- **Free Tier**: 25,000 inference requests/month
- **Pro**: Unlimited requests ($9/month)
- Each translation = 1 request

## Next Steps

- Deploy to Vercel
- Share your app with others
- Explore other Hugging Face models for enhanced features
