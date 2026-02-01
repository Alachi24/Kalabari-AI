"use client";

import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-8 h-8 text-primary" />
          <span className="text-xl font-semibold text-foreground">LinguaAI</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            Features
          </a>
          <a
            href="#about"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            About
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-foreground hover:bg-secondary text-sm">
            Sign In
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
            Start Translating
          </Button>
        </div>
      </div>
    </header>
  );
}
