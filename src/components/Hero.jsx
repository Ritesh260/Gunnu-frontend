// src/components/Hero.jsx

import {
  ArrowRight,
  Star,
  ShieldCheck,
} from "lucide-react";

import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-screen bg-black text-white flex items-center overflow-hidden pt-24">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80')",
        }}
      ></div>

      {/* Red Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-red-950/40 via-black to-black"></div>

      {/* Golden Blur */}
      <div className="absolute top-32 right-10 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center w-full">

        {/* LEFT SIDE */}
        <div>

          {/* TOP BADGE */}
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-white/5 text-yellow-400 text-sm mb-6 backdrop-blur-md">

            <Star size={16} fill="currentColor" />

            Best Chinese Taste in Town

          </span>

          {/* HEADING */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">

            Welcome to <br />

            <span className="text-yellow-500">
              Gunnu Chinese
            </span>{" "}

            <span className="text-red-700">
              Corner
            </span>

          </h1>

          {/* DESCRIPTION */}
          <p className="mt-6 text-gray-300 text-lg max-w-xl leading-relaxed">

            Experience sizzling noodles, spicy fried rice, crispy momos and
            premium Chinese flavors made fresh every day with love & taste.

          </p>

          {/* TRUST BADGES */}
          <div className="mt-7 flex flex-wrap gap-4">

            {/* FSSAI */}
            <div className="flex items-center gap-2 bg-white/5 border border-green-500/20 px-4 py-3 rounded-2xl backdrop-blur-md">

              <ShieldCheck
                size={18}
                className="text-green-400"
              />

              <span className="text-sm font-medium text-gray-200">
                FSSAI Certified
              </span>

            </div>

            {/* GOVT APPROVED */}
            <div className="flex items-center gap-2 bg-white/5 border border-yellow-500/20 px-4 py-3 rounded-2xl backdrop-blur-md">

              <ShieldCheck
                size={18}
                className="text-yellow-400"
              />

              <span className="text-sm font-medium text-gray-200">
                Govt Approved Food Outlet
              </span>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">

            {/* ORDER BUTTON */}
            <Link
              to="/order"
              className="px-7 py-4 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 shadow-xl flex items-center justify-center gap-2"
            >
              Order Now

              <ArrowRight size={18} />

            </Link>

            {/* MENU BUTTON */}
            <a
              href="#menu"
              className="px-7 py-4 rounded-full border border-yellow-500/40 hover:bg-yellow-500 hover:text-black transition duration-300 font-semibold text-center"
            >
              Explore Menu
            </a>

            {/* CERTIFICATE BUTTON */}
            <a
              href="#certificate"
              className="px-7 py-4 rounded-full bg-white/10 border border-white/20 hover:bg-white hover:text-black transition duration-300 font-semibold text-center backdrop-blur-md"
            >
              View Certificate
            </a>

          </div>

          {/* STATS */}
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">

            <div>
              <h3 className="text-2xl font-bold text-yellow-500">
                10K+
              </h3>

              <p className="text-sm text-gray-400">
                Happy Customers
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-yellow-500">
                50+
              </h3>

              <p className="text-sm text-gray-400">
                Food Items
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-yellow-500">
                5★
              </h3>

              <p className="text-sm text-gray-400">
                Ratings
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">

          {/* GLOW */}
          <div className="absolute w-80 h-80 bg-red-700/20 blur-3xl rounded-full"></div>

          {/* FOOD IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=80"
            alt="Chinese Food"
            className="relative z-10 w-full max-w-lg rounded-3xl shadow-2xl border border-yellow-500/20 hover:scale-105 transition duration-500"
          />

          {/* FLOATING TRUST CARD */}
          <div className="absolute bottom-5 -left-5 sm:left-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-5 py-4 shadow-2xl z-20">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">

                <ShieldCheck
                  className="text-green-400"
                  size={24}
                />

              </div>

              <div>

                <h4 className="font-bold text-white">
                  100% Hygienic
                </h4>

                <p className="text-xs text-gray-300">
                  Govt Certified Food
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;