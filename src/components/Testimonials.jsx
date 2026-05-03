// src/components/Testimonials.jsx

import { Star, Quote } from "lucide-react";

function Testimonials() {
  const reviews = [
    {
      name: "Ritesh Mali",
      role: "Food Lover",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
      review:
        "Best Chinese food I’ve had in Mumbai. Taste, quantity and quality everything was top class.",
    },
    {
      name: "Khushi Mali",
      role: "Regular Customer",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
      review:
        "Their momos and noodles are absolutely amazing. Fast delivery and always fresh food.",
    },
    {
      name: "Harsh Mali",
      role: "Food Blogger",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
      review:
        "Premium presentation with authentic flavors. Gunnu Chinese Corner is a hidden gem.",
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-24 bg-black text-white overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            Customer Reviews
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            What Our <span className="text-yellow-500">Customers Say</span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Loved by hundreds of food lovers for premium taste, quality service
            and unforgettable dining experience.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {reviews.map((item, index) => (
            <div
              key={index}
              className="relative p-7 rounded-3xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute top-5 right-5 text-yellow-500/30">
                <Quote size={34} />
              </div>

              {/* User */}
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500/30"
                />

                <div>
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.role}</p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mt-5 text-yellow-500">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
              </div>

              {/* Review */}
              <p className="text-gray-300 mt-5 leading-relaxed text-sm">
                "{item.review}"
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16 text-center">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-3xl font-bold text-yellow-500">10K+</h3>
            <p className="text-gray-400 mt-2">Happy Customers</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-3xl font-bold text-yellow-500">4.9★</h3>
            <p className="text-gray-400 mt-2">Average Rating</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h3 className="text-3xl font-bold text-yellow-500">50+</h3>
            <p className="text-gray-400 mt-2">Delicious Items</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;