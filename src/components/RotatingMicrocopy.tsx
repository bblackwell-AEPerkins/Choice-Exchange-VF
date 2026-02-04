import { useState, useEffect } from "react";

const messages = [
  "Broker retains agent of record",
  "Carrier payments automated",
  "Renewals handled without rebuilds",
  "Audit-ready reporting included",
];

export const RotatingMicrocopy = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setIsVisible(true);
      }, 200);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-5 flex items-center justify-center">
      <p
        className={`text-xs text-muted-foreground/50 transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {messages[currentIndex]}
      </p>
    </div>
  );
};
