import { Phone, Mail } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface ContactPopoverProps {
  children: React.ReactNode;
}

export const ContactPopover = ({ children }: ContactPopoverProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4" align="center" sideOffset={8}>
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground text-sm">Contact Us</h4>
          <div className="space-y-2">
            <a 
              href="tel:1-800-246-423" 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  1-800-CHOICE
                </p>
                <p className="text-xs text-muted-foreground">Mon-Fri 8am-8pm EST</p>
              </div>
            </a>
            <a 
              href="mailto:hello@choiceexchange.com" 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
            >
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  hello@choiceexchange.com
                </p>
                <p className="text-xs text-muted-foreground">We respond within 24hrs</p>
              </div>
            </a>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};