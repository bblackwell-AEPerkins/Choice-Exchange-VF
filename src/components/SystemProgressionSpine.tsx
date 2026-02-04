const steps = ["Configure", "Enroll", "Pay", "Report", "Renew"];

export const SystemProgressionSpine = () => {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center gap-2 md:gap-3">
          <span className="text-xs text-muted-foreground/60 font-medium tracking-wide">
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className="w-4 md:w-6 h-px bg-border/60" />
          )}
        </div>
      ))}
    </div>
  );
};
