// src/components/Navbar.jsx

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

/* 🔥 IMPORT LOGO */
import logo from "../assets/images/logo.png"; // apna exact file name likhna

function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { name: "Home", link: "#" },
    { name: "Menu", link: "#menu" },
    { name: "About", link: "#about" },
    { name: "Gallery", link: "#gallery" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-yellow-600/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">

          {/* 🔥 LOGO IMAGE */}
          <a href="#" className="select-none flex items-center">
            <img
              src={logo}
              alt="Gunnu Chinese Logo"
              className="h-16 md:h-20 w-auto object-contain"
            />
          </a>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 text-white font-medium">
            {navLinks.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className="relative hover:text-yellow-500 transition duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-red-700 hover:after:w-full after:transition-all after:duration-300"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          {/* Order Button */}
          <div className="hidden md:block">
            <Link
              to="/order"
              className="px-5 py-2 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 text-white font-semibold hover:scale-105 transition duration-300 shadow-lg inline-block"
            >
              Order Now
            </Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            {open ? <X size={30} /> : <Menu size={30} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-black/95 border-t border-yellow-600/20 overflow-hidden transition-all duration-500 ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <ul className="flex flex-col px-6 py-4 gap-5 text-white font-medium">
          {navLinks.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                onClick={() => setOpen(false)}
                className="block hover:text-yellow-500 transition"
              >
                {item.name}
              </a>
            </li>
          ))}

          <Link
            to="/order"
            className="inline-block mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 text-white font-semibold shadow-lg hover:scale-105 transition duration-300"
          >
            Order Now
          </Link>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;