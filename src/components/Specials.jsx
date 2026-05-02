// src/components/Specials.jsx

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Flame,
  Star,
  ShoppingBag,
  Clock3,
} from "lucide-react";

import { Link } from "react-router-dom";

function Specials() {

  const [specials, setSpecials] = useState([]);

  /* FETCH SPECIALS */
  const fetchSpecials = async () => {
    try {

      const res = await axios.get(
        "https://gunnu-dashboard.onrender.com/api/special"
      );

      setSpecials(res.data.specials || []);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, []);

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

        {/* EMPTY */}
        {specials.length === 0 && (
          <div className="text-center text-gray-500 mt-16">
            No Specials Available
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {specials.map((item) => (

            <div
              key={item._id}
              className="group rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-yellow-500/30 transition duration-300 hover:-translate-y-2"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">

                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* BADGE */}
                <span className="absolute top-4 left-4 px-3 py-1 text-xs rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold">
                  {item.badge || "Popular"}
                </span>

              </div>

              {/* CONTENT */}
              <div className="p-6">

                {/* TITLE */}
                <div className="flex justify-between items-center gap-4">

                  <h3 className="text-2xl font-semibold">
                    {item.name}
                  </h3>

                  <span className="text-yellow-500 font-bold text-xl">
                    ₹{item.price}
                  </span>

                </div>

                {/* TYPE */}
                <div className="flex items-center gap-2 mt-3">

                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.type === "veg"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>

                  <span className="text-sm text-gray-300">
                    {item.type === "veg"
                      ? "Veg"
                      : "Non Veg"}
                  </span>

                </div>

                {/* RATING */}
                <div className="flex items-center gap-1 mt-3 text-yellow-500">

                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />

                  <span className="text-gray-400 text-sm ml-2">
                    ({item.rating || 5}.0)
                  </span>

                </div>

                {/* DESC */}
                <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* TAGS */}
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

                {/* BUTTON */}
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

        {/* CTA */}
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