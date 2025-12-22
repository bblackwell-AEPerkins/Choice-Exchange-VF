import { Shield, Award, Lock, Building2, Star, Users } from "lucide-react";

const trustBadges = [
  {
    icon: Shield,
    title: "HIPAA Compliant",
    description: "Your health data is protected",
  },
  {
    icon: Award,
    title: "Licensed Nationwide",
    description: "Operating in all 50 states",
  },
  {
    icon: Lock,
    title: "SOC 2 Certified",
    description: "Enterprise-grade security",
  },
  {
    icon: Building2,
    title: "IRS Approved",
    description: "ICHRA compliance guaranteed",
  },
];

const testimonials = [
  {
    quote: "Choice Exchange transformed how we offer benefits. Our employees love having real choice, and we've cut admin time by 80%.",
    author: "Sarah Chen",
    role: "HR Director, TechStart Inc.",
    rating: 5,
  },
  {
    quote: "Finally, a platform that shows me exactly what I'm paying for. I found a plan that saved me $200/month with better coverage.",
    author: "Michael Rodriguez",
    role: "Individual Member",
    rating: 5,
  },
  {
    quote: "The transparent pricing changed everything. We can now budget healthcare costs with confidence and give employees flexibility.",
    author: "Jennifer Williams",
    role: "CEO, GrowthLabs",
    rating: 5,
  },
];

export const TrustIndicators = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
          {trustBadges.map((badge) => (
            <div 
              key={badge.title}
              className="flex flex-col items-center text-center p-4"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <badge.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {badge.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 text-primary mb-4">
              <Users className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Trusted by Thousands</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold">
              What our members say
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber fill-amber" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground text-sm">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
