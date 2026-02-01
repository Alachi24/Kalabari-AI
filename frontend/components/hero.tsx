'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export function Hero() {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');

  const handleTranslate = () => {
    // Placeholder translation logic
    setTranslatedText('Translated text would appear here...');
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
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                English
              </label>
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
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                Spanish
              </label>
              <textarea
                value={translatedText}
                readOnly
                placeholder="Translation will appear here..."
                className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none"
              />
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Copy
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Translate
              <ArrowRight className="ml-2 w-4 h-4" />
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
