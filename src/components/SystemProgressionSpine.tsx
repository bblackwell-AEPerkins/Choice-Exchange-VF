import { useState, useEffect } from "react";

const steps = ["Configure", "Enroll", "Pay", "Report", "Renew"];

export const SystemProgressionSpine = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-3 md:gap-4">
          <div className="relative">
            {/* Background square that pops */}
            <div 
              className={`absolute inset-0 -inset-x-2 -inset-y-1 rounded transition-all duration-300 ${
                index === activeIndex 
                  ? "bg-primary/[0.12] scale-100 opacity-100" 
                  : "bg-transparent scale-90 opacity-0"
              }`}
            />
            <span 
              className={`relative text-xs font-medium tracking-wide transition-all duration-300 ${
                index === activeIndex 
                  ? "text-primary" 
                  : "text-muted-foreground/50"
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div 
              className={`w-4 md:w-6 h-px transition-colors duration-300 ${
                index < activeIndex ? "bg-primary/[0.35]" : "bg-border/40"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
