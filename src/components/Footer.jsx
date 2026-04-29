// src/components/Footer.jsx

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock3,
  ChevronRight,
  Heart,
} from "lucide-react";

function Footer() {
  return (
    <footer className="relative bg-black text-white border-t border-yellow-500/20 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 py-16">

        {/* Top Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Gunnu{" "}
              <span className="text-yellow-500">Chinese</span>{" "}
              <span className="text-red-700">Corner</span>
            </h2>

            <p className="text-gray-400 mt-4 leading-relaxed">
              Serving delicious Chinese food with premium taste, sizzling
              freshness and unforgettable flavor.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-red-700 transition duration-300"
              >
                <Globe size={18} />
              </a>

              <a
                href="#"
                className="p-3 rounded-full bg-white/5 hover:bg-yellow-500 hover:text-black transition duration-300"
              >
                <Heart size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-gray-300">
              {["Home", "Menu", "About", "Gallery", "Contact"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center gap-2 hover:text-yellow-500 transition duration-300"
                    >
                      <ChevronRight size={16} />
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-5">
              Contact Us
            </h3>

            <div className="space-y-4 text-gray-300">
              <p className="flex gap-3">
                <MapPin size={18} className="text-red-600 mt-1" />
                Mumbai, Maharashtra
              </p>

              <p className="flex gap-3">
                <Phone size={18} className="text-red-600 mt-1" />
                +91 98765 43210
              </p>

              <p className="flex gap-3">
                <Mail size={18} className="text-red-600 mt-1" />
                gunnuchinese@gmail.com
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="text-xl font-semibold text-yellow-500 mb-5">
              Opening Hours
            </h3>

            <div className="space-y-4 text-gray-300">
              <p className="flex gap-3">
                <Clock3 size={18} className="text-red-600 mt-1" />
                Mon - Fri: 10 AM - 11 PM
              </p>

              <p className="flex gap-3">
                <Clock3 size={18} className="text-red-600 mt-1" />
                Sat - Sun: 11 AM - 12 AM
              </p>
            </div>

            <button className="mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 shadow-lg">
              Order Now
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>© 2026 Gunnu Chinese Corner. All Rights Reserved.</p>

          <p>Designed with ❤️ for a premium food experience</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;