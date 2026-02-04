const healthcareImages = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80",
  "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&q=80",
  "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&q=80",
  "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=600&q=80",
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&q=80",
  "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=600&q=80",
  "https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=600&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
];

export const RollingBanner = () => {
  return (
    <div className="relative w-full h-28 md:h-36 lg:h-44 overflow-hidden bg-muted/30">
      {/* Blue tint overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ backgroundColor: "hsl(217 91% 60% / 0.15)" }}
      />
      
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-20" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-20" />
      
      {/* Scrolling track */}
      <div className="flex h-full animate-banner-scroll">
        {/* First set */}
        {healthcareImages.map((src, i) => (
          <div key={`a-${i}`} className="flex-shrink-0 h-full w-44 md:w-56 lg:w-64 mx-1">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {healthcareImages.map((src, i) => (
          <div key={`b-${i}`} className="flex-shrink-0 h-full w-44 md:w-56 lg:w-64 mx-1">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale opacity-80"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
