import { Github, Heart, Users } from "lucide-react";

const stats = [
  { icon: Github, value: "100%", label: "Open Source" },
  { icon: Users, value: "Community", label: "Driven" },
  { icon: Heart, value: "Free", label: "Forever" },
];

export function Community() {
  return (
    <section id="community" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Section Header */}
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built by the community,{" "}
            <span className="text-gradient">for the community</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            ContribForge is an open source project powered by developers who believe in 
            making open source contributions accessible to everyone.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-8 mb-12">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Contributors Display */}
          <div className="flex flex-col items-center">
            <div className="flex -space-x-3 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 border-2 border-background flex items-center justify-center text-xs font-medium text-primary-foreground"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-card border-2 border-border flex items-center justify-center text-xs font-medium text-muted-foreground">
                +99
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Join our growing community of contributors
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
