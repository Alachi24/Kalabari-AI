'use client';

import React from "react"

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Upload, Download, Users, Target, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export default function ContributePage() {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleFileUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadStatus('uploading');
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;

    if (!file) {
      setUploadStatus('error');
      setMessage('Please select a file to upload');
      return;
    }

    try {
      const response = await fetch('/api/dataset/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        setMessage('Thank you! Your dataset contribution has been received.');
        e.currentTarget.reset();
        setTimeout(() => setUploadStatus('idle'), 3000);
      } else {
        const error = await response.json();
        setUploadStatus('error');
        setMessage(error.error || 'Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('[v0] Upload error:', error);
      setUploadStatus('error');
      setMessage('Upload failed. Please try again.');
    }
  };

  const downloadAssets = (filename: string) => {
    const link = document.createElement('a');
    link.href = `/assets/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="bg-background min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
            Contribute to LinguaAI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-balance">
            Help improve our translation models by contributing translation datasets and cultural knowledge. Together, we're building better language technology.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card border border-border rounded-xl p-6">
            <Users className="w-8 h-8 text-primary mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">1,250+</div>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Target className="w-8 h-8 text-primary mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">50K+</div>
            <p className="text-sm text-muted-foreground">Translation Pairs</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            <Upload className="w-8 h-8 text-primary mb-4" />
            <div className="text-3xl font-bold text-foreground mb-2">100+</div>
            <p className="text-sm text-muted-foreground">Language Pairs</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Upload Section */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Upload className="w-6 h-6 text-primary" />
                Upload Dataset
              </h2>
              <p className="text-muted-foreground mb-6">
                Share parallel texts, translations, and linguistic data to help us improve our models.
              </p>

              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">
                    Dataset Format (CSV, JSON, or TXT)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      name="file"
                      accept=".csv,.json,.txt"
                      className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Max 50MB. Include source and target language columns.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Data Type
                  </label>
                  <select
                    name="dataType"
                    defaultValue="general"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Translations</option>
                    <option value="technical">Technical Terms</option>
                    <option value="domain">Domain Specific</option>
                    <option value="cultural">Cultural Context</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Language Pairs (e.g., en-es, fr-de)
                  </label>
                  <input
                    type="text"
                    name="languagePairs"
                    placeholder="en-es, en-fr, en-de"
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Status Messages */}
                {uploadStatus === 'success' && (
                  <div className="flex gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{message}</p>
                    </div>
                  </div>
                )}

                {uploadStatus === 'error' && (
                  <div className="flex gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{message}</p>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={uploadStatus === 'uploading'}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload Dataset'}
                </Button>
              </form>
            </div>
          </div>

          {/* Download Assets Section */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <Download className="w-6 h-6 text-primary" />
                Download Assets
              </h2>
              <p className="text-muted-foreground mb-6">
                Get templates, guidelines, and resources for contributing quality datasets.
              </p>

              <div className="space-y-3">
                {/* Template Assets */}
                <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">CSV Template</p>
                        <p className="text-xs text-muted-foreground">Format for structured data</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadAssets('template-csv.csv')}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                    >
                      Download
                    </Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">JSON Template</p>
                        <p className="text-xs text-muted-foreground">For complex data structures</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadAssets('template-json.json')}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                    >
                      Download
                    </Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Contribution Guide</p>
                        <p className="text-xs text-muted-foreground">Standards and best practices</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadAssets('contribution-guide.pdf')}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                    >
                      Download
                    </Button>
                  </div>
                </div>

                <div className="border border-border rounded-lg p-4 hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground">Data Quality Checklist</p>
                        <p className="text-xs text-muted-foreground">Ensure your data meets standards</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => downloadAssets('quality-checklist.txt')}
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Contribution Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                Data Quality
              </h3>
              <p className="text-muted-foreground text-sm">
                Ensure translations are accurate, contextually appropriate, and free of typos or grammatical errors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                Format Consistency
              </h3>
              <p className="text-muted-foreground text-sm">
                Follow our templates and ensure consistent formatting across your entire dataset.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                Cultural Context
              </h3>
              <p className="text-muted-foreground text-sm">
                Include cultural nuances and context-specific translations that improve model understanding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                Licensing
              </h3>
              <p className="text-muted-foreground text-sm">
                Confirm you have rights to share the data and agree to our open-source license.
              </p>
            </div>
          </div>
        </div>

        {/* Recognition Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Top Contributors</h2>
          <p className="text-muted-foreground mb-8">
            We recognize and credit all community contributors in our dataset documentation.
          </p>
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link href="/contributors">View All Contributors</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
