"use client";

import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CTO, TechVentures",
      content:
        "IntelliAI reduced our AI infrastructure costs by 60% while improving latency. The API is intuitive and their support is exceptional.",
      rating: 5,
    },
    {
      name: "Marcus Johnson",
      role: "Lead Engineer, DataFlow",
      content:
        "The model variety and quality are unmatched. We switched from three different providers to just IntelliAI.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "Product Manager, CloudScale",
      content:
        "Their real-time monitoring dashboards gave us the insights we needed to optimize our AI products. Highly recommended.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="bg-background py-20 border-y border-secondary/30"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-balance">
            Loved by Teams Worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            See what developers and leaders are saying about IntelliAI.
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-8 rounded-xl bg-secondary/30 border border-secondary/50"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
