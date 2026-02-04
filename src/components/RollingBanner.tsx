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
    <div className="relative w-full py-6 bg-background overflow-hidden">
      {/* Floating frame container */}
      <div 
        className="relative mx-auto max-w-6xl h-32 md:h-40 lg:h-48 rounded-xl overflow-hidden"
        style={{
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(0, 0, 0, 0.05),
            inset 0 2px 4px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
      >
        {/* Inner shadow for depth */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none rounded-xl"
          style={{
            boxShadow: "inset 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 -4px 20px rgba(0, 0, 0, 0.2)"
          }}
        />
        
        {/* Blue tint overlay (theme token) */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-primary/20" />
        
        {/* Vignette edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-black/50 to-transparent z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-black/50 to-transparent z-20" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/30 to-transparent z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/30 to-transparent z-20" />
        
        {/* Scrolling track - pushed back */}
        <div className="flex h-full animate-banner-scroll" style={{ transform: "translateZ(-10px)" }}>
          {/* First set */}
          {healthcareImages.map((src, i) => (
            <div key={`a-${i}`} className="flex-shrink-0 h-full w-48 md:w-60 lg:w-72 mx-0.5">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale brightness-75"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {healthcareImages.map((src, i) => (
            <div key={`b-${i}`} className="flex-shrink-0 h-full w-48 md:w-60 lg:w-72 mx-0.5">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale brightness-75"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
