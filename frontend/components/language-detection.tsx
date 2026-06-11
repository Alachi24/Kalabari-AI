'use client';

import { Button } from '@/components/ui/button';
import { ScanSearch, Loader } from 'lucide-react';
import { useState } from 'react';
import { getLanguageName } from '@/lib/language-detection';

interface DetectionResult {
  detectedLanguage: string;
  languageName?: string;
  confidence: number;
}

export function LanguageDetection() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  const handleDetect = async () => {
    if (!text.trim()) {
      alert('Please enter text to detect');
      return;
    }

    setIsDetecting(true);
    setResult(null);
    try {
      // Detection is served by the backend AI gateway.
      const response = await fetch('/api/detect-language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Detection failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Detection error:', error);
      alert('Language detection failed. Please try again.');
    } finally {
      setIsDetecting(false);
    }
  };

  const confidencePct = result ? Math.round(result.confidence * 100) : 0;

  return (
    <section className="relative overflow-hidden bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Detect a Language
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Paste any text and identify which Nigerian or world language it is written in
          </p>
        </div>

        {/* Detection Interface */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-scale-in hover:shadow-md transition-shadow duration-300">
          <div className="p-6">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to detect its language..."
              className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
            />
            <div className="mt-3 text-xs text-muted-foreground">
              {text.length} characters
            </div>

            {/* Result */}
            {result && (
              <div className="mt-6 border border-border rounded-lg p-4 animate-slide-up">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Detected language
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {confidencePct}% confidence
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground mb-3">
                  {result.languageName || getLanguageName(result.detectedLanguage)}
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${confidencePct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Detect Button */}
          <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Powered by advanced AI models
            </div>
            <Button
              onClick={handleDetect}
              disabled={isDetecting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover-lift group"
            >
              {isDetecting ? (
                <>
                  <Loader className="mr-2 w-4 h-4 animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  Detect
                  <ScanSearch className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
