import { Search, Target, Trophy } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Discover Repositories",
    description:
      "Explore thousands of beginner-friendly open source projects tailored to your skills and interests.",
  },
  {
    icon: Target,
    title: "Find Good First Issues",
    description:
      "Instantly filter and find issues labeled 'good first issue' across popular repositories.",
  },
  {
    icon: Trophy,
    title: "Track Your Progress",
    description:
      "Build and showcase your contributions with a public portfolio that highlights your open source journey.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Everything you need to contribute
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From discovery to tracking, ContribForge provides the tools to make your open source journey seamless.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
