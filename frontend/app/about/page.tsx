import React from "react"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/header';

export const metadata = {
  title: 'LinguaAI - About',
  description: 'Learn more about LinguaAI and our mission to bridge language barriers for Nigerian languages.',
}

export default function AboutPage() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <Header />
      <main>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3 text-balance">
            About LinguaAI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl text-balance animate-fade-in stagger-1">
            Bridging language barriers with AI-powered translation for Nigerian languages and beyond.
          </p>
        </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <div className="mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl">
            LinguaAI is dedicated to preserving and promoting Nigerian languages through cutting-edge AI technology. 
            We believe that language should never be a barrier to knowledge, opportunity, or connection. 
            By building accurate translation models for Nigerian languages alongside major world languages, 
            we aim to empower millions of speakers across Nigeria and the diaspora.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-6 animate-slide-up stagger-1 hover-lift">
            <h3 className="text-xl font-semibold text-foreground mb-3">Nigerian Language Focus</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Supporting Hausa, Yoruba, Igbo, Nigerian Pidgin, Fulfulde, Kanuri, Ibibio, Tiv, Edo, Urhobo, 
              Izon, Nupe, Ebira, Itsekiri, Kalabari, and more.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 animate-slide-up stagger-2 hover-lift">
            <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Leveraging state-of-the-art machine learning models to deliver accurate, context-aware translations 
              that understand nuance and cultural context.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 animate-slide-up stagger-3 hover-lift">
            <h3 className="text-xl font-semibold text-foreground mb-3">Community Driven</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Built with contributions from linguists, native speakers, and developers who share a passion 
              for language preservation and accessibility.
            </p>
          </div>
        </div>

        {/* Story */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-16 animate-fade-in stagger-4 hover:shadow-md transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-foreground mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              LinguaAI was born from a simple observation: while global language translation has seen remarkable 
              advances, Nigerian languages have been largely left behind. With over 500 languages spoken in Nigeria, 
              millions of people lack access to accurate translation tools for their native tongues.
            </p>
            <p>
              Our team brings together expertise in natural language processing, African linguistics, and 
              software engineering to build translation models that truly understand Nigerian languages. 
              We work closely with native speakers and language experts to ensure accuracy and cultural relevance.
            </p>
            <p>
              Today, LinguaAI supports translation between 15 Nigerian languages and major world languages, 
              with ongoing efforts to expand coverage and improve accuracy. We are committed to open-source 
              principles and community collaboration.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="text-center animate-fade-in stagger-5">
          <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you are a linguist, developer, or native speaker, your contributions can help us 
            build better language technology for Nigerian languages.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground hover-lift">
              <Link href="/contribute">Contribute</Link>
            </Button>
            <Button asChild variant="outline" className="hover-lift">
              <Link href="/">Try Translation</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
}
