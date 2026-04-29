// src/components/Specials.jsx

import {
  Flame,
  Star,
  ShoppingBag,
  Clock3,
} from "lucide-react";

import { Link } from "react-router-dom";

function Specials() {
  const specials = [
    {
      name: "Dragon Chicken",
      price: "₹249",
      type: "Non Veg",
      dot: "bg-red-500",
      image:
        "https://images.unsplash.com/photo-1604908176997-4314edcb7f1c?auto=format&fit=crop&w=900&q=80",
      desc: "Spicy crispy chicken tossed in signature dragon sauce.",
      badge: "Chef Pick",
    },
    {
      name: "Schezwan Noodles",
      price: "₹189",
      type: "Veg",
      dot: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80",
      desc: "Hot & fiery noodles loaded with veggies and bold flavors.",
      badge: "Hot Seller",
    },
    {
      name: "Paneer Chilli Dry",
      price: "₹219",
      type: "Veg",
      dot: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
      desc: "Soft paneer cubes cooked in smoky Indo-Chinese spices.",
      badge: "Popular",
    },
  ];

  return (
    <section
      className="relative py-24 bg-black text-white overflow-hidden"
      id="specials"
    >
      {/* Background Glow */}
      <div className="absolute top-10 left-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            Chef Specials
          </span>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Today’s <span className="text-yellow-500">Special Dishes</span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Taste our premium veg and non veg dishes made with rich sauces,
            authentic spices and fresh ingredients.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {specials.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-yellow-500/30 transition duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                <span className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold">
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-2xl font-semibold">
                    {item.name}
                  </h3>

                  <span className="text-yellow-500 font-bold text-xl">
                    {item.price}
                  </span>
                </div>

                {/* Veg Non Veg Badge */}
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`w-3 h-3 rounded-full ${item.dot}`}
                  ></span>

                  <span className="text-sm text-gray-300">
                    {item.type}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <span className="text-gray-400 text-sm ml-2">(5.0)</span>
                </div>

                <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Tags */}
                <div className="flex items-center gap-4 mt-5 text-sm text-gray-300">
                  <span className="flex items-center gap-1">
                    <Clock3
                      size={16}
                      className="text-red-600"
                    />
                    20 min
                  </span>

                  <span className="flex items-center gap-1">
                    <Flame
                      size={16}
                      className="text-yellow-500"
                    />
                    Fresh Hot
                  </span>
                </div>

                {/* Button */}
                <Link
                  to="/order"
                  className="w-full mt-6 px-5 py-3 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} />
                  Order Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <Link
            to="/order"
            className="px-8 py-4 rounded-full border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition duration-300 font-semibold inline-block"
          >
            Explore More Specials
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Specials;