import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Star,
  Flame,
  ShoppingCart,
} from "lucide-react";

import { Link } from "react-router-dom";

function MenuPreview() {

  const [menuItems, setMenuItems] = useState([]);

  const [loading, setLoading] = useState(true);

  /* =========================
      FETCH MENU ITEMS
  ========================= */
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {

    try {

      const res = await axios.get(
        "https://gunnu-dashboard.onrender.com/api/menu"
      );

      setMenuItems(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <section
      id="menu"
      className="relative bg-black text-white py-24 overflow-hidden"
    >

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

        {/* ================= HEADING ================= */}
        <div className="text-center max-w-3xl mx-auto">

          <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            Veg & Non Veg Menu
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Delicious Food Crafted With{" "}
            <span className="text-yellow-500">
              Passion
            </span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Explore our premium veg and non veg Chinese dishes made fresh with
            rich taste and unforgettable flavor.
          </p>

        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="text-center py-20 text-lg font-semibold">
            Loading Menu...
          </div>
        )}

        {/* ================= EMPTY ================= */}
        {!loading && menuItems.length === 0 && (
          <div className="text-center py-20">

            <h2 className="text-3xl font-bold">
              No Menu Available
            </h2>

            <p className="text-gray-400 mt-3">
              Food items will appear here after adding from dashboard.
            </p>

          </div>
        )}

        {/* ================= MENU CARDS ================= */}
        {!loading && menuItems.length > 0 && (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

            {menuItems.map((item) => (

              <div
                key={item._id}
                className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition duration-300 hover:-translate-y-2"
              >

                {/* IMAGE */}
                <div className="relative overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* TAG */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-red-800 to-yellow-500 font-semibold">
                    {item.tag || "Popular"}
                  </span>

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  {/* NAME + PRICE */}
                  <div className="flex items-center justify-between gap-3">

                    <h3 className="text-xl font-semibold">
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

                    <span className="text-sm text-gray-300 capitalize">
                      {item.type === "veg"
                        ? "Veg"
                        : "Non Veg"}
                    </span>

                  </div>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-3 text-yellow-500">

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <Star
                      size={16}
                      fill="currentColor"
                    />

                    <span className="text-gray-400 text-sm ml-2">
                      ({item.rating || 5.0})
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-400 mt-4 text-sm leading-relaxed line-clamp-3">
                    {item.description ||
                      "Fresh ingredients, premium sauces and perfect flavor in every bite."}
                  </p>

                  {/* BUTTONS */}
                  <div className="flex gap-3 mt-6">

                    <Link
                      to="/order"
                      className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
                    >

                      <ShoppingCart size={18} />

                      Order

                    </Link>

                    <button className="px-4 py-3 rounded-full border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition">

                      <Flame size={18} />

                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* ================= BOTTOM BUTTON ================= */}
        {!loading && menuItems.length > 0 && (
          <div className="text-center mt-14">

            <Link
              to="/order"
              className="px-8 py-4 rounded-full border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition duration-300 font-semibold inline-block"
            >
              Order Now
            </Link>

          </div>
        )}

      </div>
    </section>
  );
}

export default MenuPreview;