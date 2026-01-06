import { Link } from "react-router-dom";
import { ArrowRight, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactPopover } from "@/components/ContactPopover";

const footerLinks = {
  solutions: {
    title: "Solutions",
    links: [
      { name: "For Individuals", path: "/auth" },
      { name: "For Employers", path: "/employer" },
      { name: "Provider Network", path: "/providers" },
      { name: "Compare Plans", path: "/compare-ichra" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "ICHRA Guide", path: "/compare-ichra" },
      { name: "Healthcare FAQ", path: "/" },
      { name: "Pricing Calculator", path: "/" },
      { name: "Blog", path: "/" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", path: "/" },
      { name: "Careers", path: "/" },
      { name: "Contact", path: "/" },
      { name: "Press", path: "/" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", path: "/" },
      { name: "Terms of Service", path: "/" },
      { name: "HIPAA Compliance", path: "/" },
    ],
  },
};

export const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      {/* CTA Section */}
      <div className="border-b border-secondary-foreground/10">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to transform your healthcare experience?
              </h2>
              <p className="text-secondary-foreground/70 text-lg max-w-xl">
                Join thousands of individuals and employers who've found clarity in healthcare choice.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                <Link to="/auth">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10" asChild>
                <Link to="/compare-ichra">
                  Explore Plans
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">CX</span>
              </div>
              <span className="font-display font-bold text-xl">
                Choice<span className="text-primary">Exchange</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 mb-6 max-w-xs">
              Transparent healthcare, powered by choice. ICHRA, group plans, and personalized care—all in one place.
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

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-secondary-foreground/60 hover:text-secondary-foreground transition-colors text-sm"
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
        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-secondary-foreground/60">
            © {new Date().getFullYear()} Choice Exchange. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-secondary-foreground/60">SOC 2 Certified</span>
            <span className="text-sm text-secondary-foreground/60">HIPAA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
