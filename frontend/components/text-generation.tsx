'use client';

import { Button } from '@/components/ui/button';
import { Sparkles, Loader } from 'lucide-react';
import { useState } from 'react';

export function TextGeneration() {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    try {
      // Generation is served by the backend AI gateway.
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data = await response.json();
      setGeneratedText(data.generatedText);
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedText('Generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedText) {
      try {
        await navigator.clipboard.writeText(generatedText);
        alert('Generated text copied to clipboard');
      } catch (error) {
        console.error('Copy failed:', error);
      }
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            Generate Text with AI
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            Write a prompt and let the AI compose text in Nigerian and major world languages
          </p>
        </div>

        {/* Generation Interface */}
        <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden animate-scale-in hover:shadow-md transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x md:divide-border">
            {/* Prompt */}
            <div className="p-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Write a short greeting in Yoruba..."
                className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition-shadow duration-200"
              />
              <div className="mt-3 text-xs text-muted-foreground">
                {prompt.length} characters
              </div>
            </div>

            {/* Output */}
            <div className="p-6">
              <label className="text-sm font-medium text-muted-foreground mb-3 block">
                Generated text
              </label>
              <textarea
                value={generatedText}
                readOnly
                placeholder="Generated text will appear here..."
                className="w-full h-40 bg-background border border-border rounded-lg p-4 text-foreground placeholder-muted-foreground resize-none focus:outline-none"
              />
              <div className="mt-3 flex gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={!generatedText}
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="border-t border-border bg-muted/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Powered by advanced AI models
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover-lift group"
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate
                  <Sparkles className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
