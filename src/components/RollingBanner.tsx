const healthcareImages = [
  "https://images.unsplash.com/photo-1581056771107-24ca5f033842?w=600&q=80", // Happy doctor with patient
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80", // Friendly doctor smiling
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&q=80", // Doctor consulting patient
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=600&q=80", // Happy family with baby
  "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=600&q=80", // Caring nurse with patient
  "https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=80", // Doctor high-fiving child
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=600&q=80", // Happy healthcare worker
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80", // Smiling doctor portrait
];

export const RollingBanner = () => {
  return (
    <div className="relative w-full py-4 bg-background overflow-hidden">
      {/* Floating frame container - softer shadow */}
      <div 
        className="relative mx-auto max-w-6xl h-28 md:h-36 lg:h-44 rounded-xl overflow-hidden shadow-lg"
      >
        {/* Subtle inner shadow for depth */}
        <div 
          className="absolute inset-0 z-30 pointer-events-none rounded-xl"
          style={{
            boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 8px rgba(0, 0, 0, 0.08)"
          }}
        />
        
        {/* Blue tint overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-primary/15" />
        
        {/* Softer vignette edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background/80 to-transparent z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background/80 to-transparent z-20" />
        
        {/* Scrolling track */}
        <div className="flex h-full animate-banner-scroll">
          {/* First set */}
          {healthcareImages.map((src, i) => (
            <div key={`a-${i}`} className="flex-shrink-0 h-full w-44 md:w-56 lg:w-64 mx-0.5">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale brightness-90 contrast-105"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {healthcareImages.map((src, i) => (
            <div key={`b-${i}`} className="flex-shrink-0 h-full w-44 md:w-56 lg:w-64 mx-0.5">
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover grayscale brightness-90 contrast-105"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
