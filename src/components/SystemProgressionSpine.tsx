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
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2 md:gap-3">
          <span 
            className={`text-xs font-medium tracking-wide transition-all duration-500 ${
              index === activeIndex 
                ? "text-foreground scale-105" 
                : "text-muted-foreground/50"
            }`}
          >
            {step}
          </span>
          {index < steps.length - 1 && (
            <div 
              className={`w-4 md:w-6 h-px transition-colors duration-500 ${
                index < activeIndex ? "bg-primary/40" : "bg-border/50"
              }`} 
            />
          )}
        </div>
      ))}
    </div>
  );
};
