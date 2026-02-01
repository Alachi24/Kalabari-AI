"use client";

export function Stats() {
  const stats = [
    {
      value: "10M+",
      label: "API Calls Daily",
      description: "Trusted by enterprise",
    },
    {
      value: "99.99%",
      label: "Uptime SLA",
      description: "Mission-critical reliability",
    },
    {
      value: "2ms",
      label: "Average Latency",
      description: "Lightning-fast responses",
    },
    {
      value: "50+",
      label: "AI Models",
      description: "Constantly updated",
    },
  ];

  return (
    <section className="bg-background border-y border-secondary/30 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
