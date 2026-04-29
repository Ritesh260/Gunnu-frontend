// src/pages/Order.jsx

import {
  ShoppingBag,
  Plus,
  Minus,
  Truck,
  CreditCard,
  ArrowLeft,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Order() {
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [foodType, setFoodType] = useState("Veg");
  const [payment, setPayment] = useState("Cash On Delivery");

  const menu = {
    Veg: [
      { name: "Veg Hakka Noodles", price: 149 },
      { name: "Paneer Chilli", price: 189 },
      { name: "Veg Fried Rice", price: 139 },
      { name: "Veg Manchurian", price: 169 },
    ],

    "Non Veg": [
      { name: "Chicken Noodles", price: 199 },
      { name: "Dragon Chicken", price: 249 },
      { name: "Chicken Fried Rice", price: 189 },
      { name: "Chicken Chilli", price: 219 },
    ],
  };

  const [selectedItem, setSelectedItem] = useState(menu["Veg"][0].name);

  const currentItem = menu[foodType].find(
    (item) => item.name === selectedItem
  );

  const total = currentItem.price * qty;

  const increaseQty = () => setQty(qty + 1);

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleTypeChange = (type) => {
    setFoodType(type);
    setSelectedItem(menu[type][0].name);
    setQty(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Order Confirmed Successfully 🎉");
  };

  return (
    <section className="min-h-screen bg-black text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500 flex items-center gap-2 transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm">
            Place Your Order
          </span>

          <h1 className="text-4xl md:text-6xl font-bold mt-5">
            Order From{" "}
            <span className="text-yellow-500">Gunnu Chinese</span>{" "}
            <span className="text-red-700">Corner</span>
          </h1>

          <p className="text-gray-400 mt-5">
            Premium Veg & Non Veg Chinese food delivered hot & fresh.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-10 mt-16">

          {/* Left Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80"
              alt="Food"
              className="w-full h-80 object-cover"
            />

            <div className="p-8">
              <div className="flex items-center gap-3 mb-5">
                <button
                  onClick={() => handleTypeChange("Veg")}
                  className={`px-4 py-2 rounded-full text-sm ${
                    foodType === "Veg"
                      ? "bg-green-600"
                      : "bg-white/5"
                  }`}
                >
                  Veg
                </button>

                <button
                  onClick={() => handleTypeChange("Non Veg")}
                  className={`px-4 py-2 rounded-full text-sm ${
                    foodType === "Non Veg"
                      ? "bg-red-700"
                      : "bg-white/5"
                  }`}
                >
                  Non Veg
                </button>
              </div>

              <h2 className="text-3xl font-bold">
                {currentItem.name}
              </h2>

              <p className="text-gray-400 mt-4">
                Fresh ingredients, rich sauces and premium Chinese taste.
              </p>

              {/* Select Item */}
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full mt-5 px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              >
                {menu[foodType].map((item, index) => (
                  <option key={index}>{item.name}</option>
                ))}
              </select>

              {/* Price + Qty */}
              <div className="mt-6 flex items-center justify-between">
                <span className="text-3xl font-bold text-yellow-500">
                  ₹{currentItem.price}
                </span>

                <div className="flex items-center gap-4">
                  <button
                    onClick={decreaseQty}
                    className="w-10 h-10 rounded-full bg-red-800 flex items-center justify-center"
                  >
                    <Minus size={18} />
                  </button>

                  <span className="text-xl font-semibold">
                    {qty}
                  </span>

                  <button
                    onClick={increaseQty}
                    className="w-10 h-10 rounded-full bg-yellow-500 text-black flex items-center justify-center"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
            <h2 className="text-3xl font-bold mb-8">
              Delivery Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              />

              <input
                type="text"
                placeholder="Phone Number"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              />

              <textarea
                rows="4"
                placeholder="Delivery Address"
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none resize-none"
              ></textarea>

              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-yellow-500 outline-none"
              >
                <option>Cash On Delivery</option>
                <option>UPI Payment</option>
                <option>Card Payment</option>
              </select>

              <div className="space-y-3 text-gray-300 text-sm">
                <p className="flex gap-2 items-center">
                  <Truck size={16} className="text-yellow-500" />
                  Delivery in 25-30 mins
                </p>

                <p className="flex gap-2 items-center">
                  <CreditCard size={16} className="text-yellow-500" />
                  Safe & Secure Payment
                </p>
              </div>

              <button
                type="submit"
                className="w-full mt-4 px-6 py-4 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Confirm Order ₹{total}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Order;