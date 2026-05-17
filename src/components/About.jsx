// src/components/About.jsx

import {
    UtensilsCrossed,
    ChefHat,
    Truck,
    Star,
    Quote,
} from "lucide-react";

import { Link } from "react-router-dom";

function About() {
    const features = [
        {
            icon: <ChefHat size={22} />,
            title: "Expert Chefs",
            desc: "Authentic taste crafted by experienced kitchen experts.",
        },
        {
            icon: <UtensilsCrossed size={22} />,
            title: "Fresh Ingredients",
            desc: "Daily fresh vegetables, sauces and premium quality ingredients.",
        },
        {
            icon: <Truck size={22} />,
            title: "Fast Delivery",
            desc: "Hot & fresh food delivered quickly to your doorstep.",
        },
        {
            icon: <Star size={22} />,
            title: "Loved By Customers",
            desc: "Trusted for taste, hygiene and satisfying portions.",
        },
    ];

    return (
        <section
            id="about"
            className="relative bg-black text-white py-24 overflow-hidden"
        >
            {/* Glow Effects */}
            <div className="absolute top-10 left-0 w-72 h-72 bg-red-800/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-yellow-500/10 blur-3xl rounded-full"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10">

                {/* Top Grid */}
                <div className="grid lg:grid-cols-2 gap-14 items-center">

                    {/* Left Image */}
                    <div className="relative">
                        <img
                            src="/image.png"
                            alt="Restaurant"
                            className="rounded-3xl shadow-2xl w-full h-[520px] object-cover border border-yellow-500/20"
                        />

                        <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-red-800 to-yellow-500 px-6 py-4 rounded-2xl shadow-xl">
                            <h3 className="text-2xl font-bold">10+</h3>
                            <p className="text-sm">Years Experience</p>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div>
                        <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
                            About Us
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Welcome to{" "}
                            <span className="text-yellow-500">
                                Gunnu Chinese
                            </span>{" "}
                            <span className="text-red-700">Corner</span>
                        </h2>

                        <p className="text-gray-300 mt-6 text-lg leading-relaxed">
                            We proudly serve premium veg & non veg Chinese dishes
                            with rich flavors, fresh ingredients and unforgettable
                            taste.
                        </p>

                        <p className="text-gray-400 mt-4 leading-relaxed">
                            From noodles and fried rice to sizzling starters,
                            every plate is made with passion and perfection.
                        </p>

                        {/* Features */}
                        <div className="grid sm:grid-cols-2 gap-5 mt-10">
                            {features.map((item, index) => (
                                <div
                                    key={index}
                                    className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 transition"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 flex items-center justify-center mb-4">
                                        {item.icon}
                                    </div>

                                    <h3 className="font-semibold text-lg">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <Link
                            to="/order"
                            className="inline-block mt-10 px-8 py-4 rounded-full bg-gradient-to-r from-red-800 to-yellow-500 font-semibold hover:scale-105 transition shadow-lg"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>

                {/* Founder Section */}
                <div className="mt-24 grid lg:grid-cols-2 gap-10 items-center">

                    {/* Founder Image */}
                    <div className="relative">
                        <img
                            src="/owner.jpeg" alt="Founder"
                            className="rounded-3xl w-full h-[450px] object-cover border border-yellow-500/20"
                        />

                        <div className="absolute top-5 left-5 bg-black/70 px-4 py-2 rounded-full border border-yellow-500/30 text-sm text-yellow-400">
                            Founder & Owner
                        </div>
                    </div>

                    {/* Founder Content */}
                    <div>
                        <span className="inline-block px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm mb-5">
                            Meet The Founder
                        </span>

                        <h3 className="text-4xl font-bold">
                            Mr. <span className="text-yellow-500">Rakesh Saini</span>
                        </h3>

                        <p className="text-gray-300 mt-6 leading-relaxed text-lg">
                            The vision behind Gunnu Chinese Corner was simple —
                            serve delicious Chinese food with premium quality,
                            hygienic preparation and affordable pricing.
                        </p>

                        <div className="mt-6 p-6 rounded-3xl bg-white/5 border border-white/10">
                            <Quote className="text-yellow-500 mb-3" size={24} />

                            <p className="text-gray-300 italic leading-relaxed">
                                “Every customer should leave with a smile,
                                satisfied taste and a reason to come back again.”
                            </p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-yellow-500">
                                    1000+
                                </p>
                                <p className="text-sm text-gray-400">
                                    Happy Customers
                                </p>
                            </div>

                            <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                                <p className="text-2xl font-bold text-yellow-500">
                                    10+
                                </p>
                                <p className="text-sm text-gray-400">
                                    Years Service
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;