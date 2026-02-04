import { useEffect, useState } from "react";

const healthcareImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", // Doctor with patient
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80", // Medical team
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=800&q=80", // Healthcare consultation
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&q=80", // Family healthcare
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80", // Medical professional
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&q=80", // Doctor consultation
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=800&q=80", // Healthcare worker
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", // Doctor smiling
];

// Duplicate for seamless loop
const allImages = [...healthcareImages, ...healthcareImages];

export const RollingBanner = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-32 md:h-40 lg:h-48 overflow-hidden bg-background">
      {/* Blue overlay */}
      <div className="absolute inset-0 bg-primary/20 z-10 pointer-events-none" />
      
      {/* Gradient edges for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
      
      {/* Rolling container */}
      <div 
        className={`flex h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          animation: 'scroll-left 40s linear infinite',
        }}
      >
        {allImages.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 h-full aspect-[4/3] mx-1"
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale"
              loading={index < 4 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
