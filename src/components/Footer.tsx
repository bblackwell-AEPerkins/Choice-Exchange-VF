import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactPopover } from "@/components/ContactPopover";

const footerLinks = {
  solutions: {
    title: "Solutions",
    links: [
      { name: "For Individuals", path: "/individual" },
      { name: "For Employers", path: "/employer" },
      { name: "For Brokers", path: "/broker" },
      { name: "Compare Plans", path: "/compare-ichra" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "ICHRA Guide", path: "/ichra" },
      { name: "Browse Plans", path: "/plans" },
      { name: "Healthcare FAQ", path: "/support" },
      { name: "Get Support", path: "/support" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", path: "/support" },
      { name: "Contact", path: "/support" },
      { name: "For Employers", path: "/employer" },
      { name: "For Brokers", path: "/broker" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", path: "/support" },
      { name: "Terms of Service", path: "/support" },
      { name: "HIPAA Compliance", path: "/support" },
    ],
  },
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 text-center lg:text-left">
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold mb-3 md:mb-4">
                Ready to transform your healthcare?
              </h2>
              <p className="text-secondary-foreground/70 text-sm md:text-lg max-w-xl mx-auto lg:mx-0">
                Join thousands who've found clarity in healthcare choice.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full sm:w-auto">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto" asChild>
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 w-full sm:w-auto" asChild>
                <Link to="/compare-ichra">
                  Explore Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-3 md:mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">CX</span>
              </div>
              <span className="font-display font-bold text-xl">
                Choice<span className="text-primary">Exchange</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 mb-4 md:mb-6 max-w-xs text-sm">
              Transparent healthcare, powered by choice. ICHRA, group plans, and personalized care.
            </p>
            <div className="space-y-2 text-sm text-secondary-foreground/60">
              <a href="mailto:hello@choiceexchange.com" className="flex items-center gap-2 hover:text-secondary-foreground transition-colors">
                <Mail className="h-4 w-4" />
                <span>hello@choiceexchange.com</span>
              </a>
              <ContactPopover>
                <button className="flex items-center gap-2 hover:text-secondary-foreground transition-colors cursor-pointer">
                  <Phone className="h-4 w-4" />
                  <span>1-800-CHOICE</span>
                </button>
              </ContactPopover>
            </div>
          </div>

          {/* Link Columns - 2x2 grid on mobile */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">{section.title}</h4>
              <ul className="space-y-1.5 md:space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors text-xs md:text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-secondary-foreground/10 mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs md:text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Choice Exchange. All rights reserved.
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <span className="text-xs md:text-sm text-secondary-foreground/60">SOC 2 Certified</span>
            <span className="text-xs md:text-sm text-secondary-foreground/60">HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
