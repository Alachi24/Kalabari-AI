'use client';

import { Zap, Globe, Lock, Sparkles, FileText, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Translation',
      description: 'Get results in real-time with our high-speed translation engine.',
    },
    {
      icon: Globe,
      title: 'Nigerian Languages',
      description:
        'Support for Nigerian languages plus English, Spanish, and French.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Accuracy',
      description:
        'Context-aware translations that understand meaning, not just words.',
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description:
        'Your translations are encrypted and never stored without consent.',
    },
    {
      icon: FileText,
      title: 'Document Translation',
      description:
        'Translate PDFs, Word documents, and other file formats instantly.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description:
        'Share translations and work together with your team seamlessly.',
    },
  ];

  return (
    <section id="features" className="bg-background py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-balance animate-slide-up">
            Powerful Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance animate-fade-in stagger-1">
            Everything you need for accurate, fast, and reliable translations
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group p-6 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 hover:-translate-y-1 animate-slide-up stagger-${i + 1}`}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
