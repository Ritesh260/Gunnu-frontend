// src/components/Gallery.jsx

import { Search, Camera } from "lucide-react";

function Gallery() {
  const images = [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1604908176997-4314edcb7f1c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80",
  ];

  return (
    <section
      id="gallery"
      className="relative py-24 bg-black text-white overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            <Camera size={16} />
            Our Gallery
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Delicious Moments &{" "}
            <span className="text-yellow-500">Premium Taste</span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Explore our restaurant vibes, premium dishes and happy food moments
            captured fresh from Gunnu Chinese Corner.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-3xl border border-white/10 hover:border-yellow-500/30 transition duration-300"
            >
              <img
                src={img}
                alt="Gallery"
                className="w-full h-72 object-cover group-hover:scale-110 transition duration-500"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center shadow-xl">
                  <Search size={22} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 shadow-lg">
            Visit Our Restaurant
          </button>
        </div>
      </div>
    </section>
  );
}

export default Gallery;