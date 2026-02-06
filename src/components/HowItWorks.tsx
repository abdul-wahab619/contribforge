const steps = [
  {
    number: "01",
    title: "Search Repositories",
    description:
      "Browse through curated collections or search for specific technologies you want to work with.",
  },
  {
    number: "02",
    title: "Filter by Preference",
    description:
      "Narrow down results by programming language, difficulty level, or issue type to find perfect matches.",
  },
  {
    number: "03",
    title: "Contribute & Track",
    description:
      "Make your contribution, and watch it automatically appear in your public portfolio.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-surface-elevated/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to start your open source journey today.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary to-primary/50 hidden md:block" />

            <div className="space-y-12">
              {steps.map((step, index) => (
                <div key={step.number} className="relative flex gap-8">
                  {/* Step Number */}
                  <div className="flex-shrink-0 relative z-10">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-card border border-border text-primary font-mono font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow pt-3">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
