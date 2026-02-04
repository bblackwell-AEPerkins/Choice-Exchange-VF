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
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      {/* Full-width scrolling track - more transparent */}
      <div className="flex h-64 md:h-80 lg:h-96 animate-banner-scroll opacity-30">
        {/* First set */}
        {healthcareImages.map((src, i) => (
          <div key={`a-${i}`} className="flex-shrink-0 h-full w-56 md:w-72 lg:w-80 mx-1">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale"
            />
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {healthcareImages.map((src, i) => (
          <div key={`b-${i}`} className="flex-shrink-0 h-full w-56 md:w-72 lg:w-80 mx-1">
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover grayscale"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
