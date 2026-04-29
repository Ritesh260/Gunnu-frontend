// src/components/MenuPreview.jsx

import { Star, Flame, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function MenuPreview() {
  const menuItems = [
    {
      name: "Veg Hakka Noodles",
      price: "₹149",
      type: "Veg",
      dot: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80",
      tag: "Best Seller",
    },
    {
      name: "Chicken Fried Rice",
      price: "₹189",
      type: "Non Veg",
      dot: "bg-red-500",
      image:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
      tag: "Hot",
    },
    {
      name: "Steam Momos",
      price: "₹129",
      type: "Veg",
      dot: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?auto=format&fit=crop&w=900&q=80",
      tag: "Popular",
    },
    {
      name: "Chicken Chilli",
      price: "₹219",
      type: "Non Veg",
      dot: "bg-red-500",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80",
      tag: "Chef Special",
    },
    {
      name: "Chilli Paneer",
      price: "₹189",
      type: "Veg",
      dot: "bg-green-500",
      image:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",
      tag: "Top Rated",
    },
    {
      name: "Chicken Noodles",
      price: "₹199",
      type: "Non Veg",
      dot: "bg-red-500",
      image:
        "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=80",
      tag: "Spicy",
    },
  ];

  return (
    <section
      id="menu"
      className="relative bg-black text-white py-24 overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-800/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
            Veg & Non Veg Menu
          </span>

          <h2 className="text-4xl md:text-5xl font-bold">
            Delicious Food Crafted With{" "}
            <span className="text-yellow-500">Passion</span>
          </h2>

          <p className="text-gray-400 mt-5 leading-relaxed">
            Explore our premium veg and non veg Chinese dishes made fresh with
            rich taste and unforgettable flavor.
          </p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-60 w-full object-cover group-hover:scale-110 transition duration-500"
                />

                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs bg-gradient-to-r from-red-800 to-yellow-500 font-semibold">
                  {item.tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{item.name}</h3>

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
                  Fresh ingredients, premium sauces and perfect flavor in every bite.
                </p>

                {/* Buttons */}
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

        {/* Bottom Button */}
        <div className="text-center mt-14">
          <Link
            to="/order"
            className="px-8 py-4 rounded-full border border-yellow-500/30 hover:bg-yellow-500 hover:text-black transition duration-300 font-semibold inline-block"
          >
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default MenuPreview;