'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';
import { detectLanguage, getLanguageName, getAvailableLanguages } from '@/lib/language-detection';

export function Hero() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [isDetecting, setIsDetecting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [languages] = useState(getAvailableLanguages());

  // Auto-detect language when source text changes (using local DistilBERT)
  useEffect(() => {
    if (sourceText.length > 0) {
      const detectAsync = async () => {
        setIsDetecting(true);
        try {
          // Use local DistilBERT-based detection
          const response = await fetch('/api/detect-language-local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: sourceText }),
          });

          if (response.ok) {
            const data = await response.json();
            setSourceLanguage(data.detectedLanguage);
            console.log('[v0] Language detected:', data.detectedLanguage);
          }
        } catch (error) {
          console.error('[v0] Detection error:', error);
        } finally {
          setIsDetecting(false);
        }
      };

      const timer = setTimeout(detectAsync, 500); // Debounce detection
      return () => clearTimeout(timer);
    }
  }, [sourceText]);

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      alert('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    try {
      // Use local inference API powered by Transformers.js
      const response = await fetch('/api/translate-local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      setTranslatedText(data.translatedText);
      console.log('[v0] Translation successful with model:', data.model);
    } catch (error) {
      console.error('[v0] Translation error:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    if (translatedText) {
      try {
        await navigator.clipboard.writeText(translatedText);
        alert('Translation copied to clipboard');
      } catch (error) {
        console.error('[v0] Copy failed:', error);
      }
    }
  };

  const handleSaveTranslation = async () => {
    if (!translatedText) {
      alert('Please translate text first');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/translations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText,
          translatedText,
          sourceLanguage,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          alert('Please sign in to save translations');
          window.location.href = '/auth/login';
          return;
        }
        throw new Error(errorData.error || 'Failed to save translation');
      }

      alert('Translation saved to your history');
    } catch (error) {
      console.error('[v0] Save error:', error);
      alert('Failed to save translation');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance">
            Break Language Barriers Instantly
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Translate text, documents, and conversations with AI-powered accuracy in 100+ languages
          </p>
        </div>

        {/* Translation Interface */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-border">
            {/* Source Language */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-muted-foreground">
                  {getLanguageName(sourceLanguage)}
                </label>
                {isDetecting && <Loader className="w-4 h-4 animate-spin text-primary" />}
              </div>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="mb-3 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="mt-3 text-xs text-muted-foreground">
                {sourceText.length} characters
              </div>
            </div>

            {/* Target Language */}
            <div className="p-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Translate to
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="mb-3 w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!translatedText}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Copy
                </Button>
                <Button
                  onClick={handleSaveTranslation}
                  disabled={!translatedText || isSaving}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>

          {/* Translation Button */}
          <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Powered by advanced AI models
            </div>
            <Button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTranslating ? (
                <>
                  <Loader className="mr-2 w-4 h-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  Translate
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">Instant Results</div>
            <div className="text-xs text-muted-foreground">Get translations in milliseconds</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">100+ Languages</div>
            <div className="text-xs text-muted-foreground">Support for all major languages</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-medium text-foreground mb-1">High Accuracy</div>
            <div className="text-xs text-muted-foreground">Context-aware AI translations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
