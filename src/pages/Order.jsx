import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
        <>
            <Navbar />

            <section className="min-h-screen bg-black text-white py-24 px-6">
                <div className="max-w-7xl mx-auto">

                    {/* Back Button */}
                    <div className="flex justify-end mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500 flex items-center gap-2 transition"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                    </div>

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

                    {/* Rest UI */}
                    <div className="grid lg:grid-cols-2 gap-10 mt-16">

                        {/* LEFT */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=900&q=80"
                                className="w-full h-80 object-cover"
                                alt=""
                            />

                            <div className="p-8">
                                <div className="flex gap-3 mb-5">
                                    <button
                                        onClick={() => handleTypeChange("Veg")}
                                        className={`px-4 py-2 rounded-full text-sm ${
                                            foodType === "Veg" ? "bg-green-600" : "bg-white/5"
                                        }`}
                                    >
                                        Veg
                                    </button>

                                    <button
                                        onClick={() => handleTypeChange("Non Veg")}
                                        className={`px-4 py-2 rounded-full text-sm ${
                                            foodType === "Non Veg" ? "bg-red-700" : "bg-white/5"
                                        }`}
                                    >
                                        Non Veg
                                    </button>
                                </div>

                                <h2 className="text-3xl font-bold">{currentItem.name}</h2>

                                <select
                                    value={selectedItem}
                                    onChange={(e) => setSelectedItem(e.target.value)}
                                    className="w-full mt-5 px-5 py-4 rounded-2xl bg-black border border-white/10"
                                >
                                    {menu[foodType].map((item, i) => (
                                        <option key={i}>{item.name}</option>
                                    ))}
                                </select>

                                <div className="mt-6 flex justify-between items-center">
                                    <span className="text-yellow-500 text-3xl font-bold">
                                        ₹{currentItem.price}
                                    </span>

                                    <div className="flex gap-4">
                                        <button onClick={decreaseQty}>
                                            <Minus />
                                        </button>

                                        <span>{qty}</span>

                                        <button onClick={increaseQty}>
                                            <Plus />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                            <h2 className="text-3xl font-bold mb-8">
                                Delivery Details
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <input className="w-full p-4 bg-black border rounded-xl" placeholder="Name" />
                                <input className="w-full p-4 bg-black border rounded-xl" placeholder="Phone" />
                                <textarea className="w-full p-4 bg-black border rounded-xl" placeholder="Address" />

                                <button className="w-full bg-yellow-500 text-black p-4 rounded-xl font-bold">
                                    Confirm Order ₹{total}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

export default Order;