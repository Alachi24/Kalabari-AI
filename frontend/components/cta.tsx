"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="bg-background py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-secondary/30 border border-accent/30 p-12 sm:p-16">
          {/* Decorative elements */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground text-balance">
              Ready to Build Intelligent Apps?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Join thousands of developers using IntelliAI to power their
              applications. Get started free today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground group"
              >
                Start Building Free
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-secondary text-foreground hover:bg-secondary bg-transparent"
              >
                Schedule a Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-8">
              No credit card required • 5,000 free API calls per month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
