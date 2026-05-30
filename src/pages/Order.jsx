import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    Plus,
    Minus,
    ArrowLeft,
    ShoppingCart,
    Trash2,
    Sparkles,
    Star,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

function Order() {

    const navigate = useNavigate();
    const location = useLocation();

    // ✅ reads the key sent by MenuPreview: state={{ selectedMenuItem: item }}
    const preSelectedItem = location.state?.selectedMenuItem || null;

    const [qty, setQty] = useState(1);
    const [foodType, setFoodType] = useState("Veg");
    const [payment, setPayment] = useState("Cash On Delivery");
    const [selectedUPI, setSelectedUPI] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [landmark, setLandmark] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [addedFlash, setAddedFlash] = useState(false);

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const res = await axios.get("https://gunnu-dashboard.onrender.com/api/menu");
            setMenuItems(res.data);

            if (preSelectedItem) {
                // Determine type from the pre-selected item
                const selectedType =
                    preSelectedItem.type?.toLowerCase().includes("non")
                        ? "Non Veg"
                        : "Veg";

                setFoodType(selectedType);

                const itemsByType = res.data.filter((item) => {
                    const itemType = item.type.toLowerCase();
                    if (selectedType === "Veg") {
                        return itemType.includes("veg") && !itemType.includes("non");
                    }
                    return itemType.includes("non");
                });

                setFilteredItems(itemsByType);
                setSelectedItem(preSelectedItem.name);

                // Auto-add to cart
                setCart([{ ...preSelectedItem, qty: 1 }]);

            } else {
                // Default: show veg items
                const vegItems = res.data.filter((item) => {
                    const itemType = item.type.toLowerCase();
                    return itemType.includes("veg") && !itemType.includes("non");
                });
                setFilteredItems(vegItems);
                if (vegItems.length > 0) setSelectedItem(vegItems[0].name);
            }

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleTypeChange = (type) => {
        setFoodType(type);

        const filtered = menuItems.filter((item) => {
            const itemType = item.type.toLowerCase();
            if (type === "Veg") return itemType.includes("veg") && !itemType.includes("non");
            return itemType.includes("non");
        });

        setFilteredItems(filtered);
        if (filtered.length > 0) setSelectedItem(filtered[0].name);
        setQty(1);
    };

    const currentItem = filteredItems.find((item) => item.name === selectedItem);

    const suggestedItems = filteredItems
        .filter((item) => item.name !== selectedItem)
        .slice(0, 3);

    const increaseQty = () => setQty(qty + 1);
    const decreaseQty = () => { if (qty > 1) setQty(qty - 1); };

    const addToCart = (item = currentItem, quantity = qty) => {
        if (!item) return;

        const existingItem = cart.find((c) => c.name === item.name);

        if (existingItem) {
            setCart(cart.map((c) =>
                c.name === item.name ? { ...c, qty: c.qty + quantity } : c
            ));
        } else {
            setCart([...cart, { ...item, qty: quantity }]);
        }

        if (item.name === currentItem?.name) setQty(1);

        setAddedFlash(true);
        setTimeout(() => setAddedFlash(false), 900);
    };

    const updateCartQty = (name, delta) => {
        setCart(
            cart
                .map((item) => item.name === name ? { ...item, qty: item.qty + delta } : item)
                .filter((item) => item.qty > 0)
        );
    };

    const removeItem = (name) => setCart(cart.filter((item) => item.name !== name));

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cart.length === 0) { alert("Please add items to cart"); return; }
        if (payment === "UPI Payment" && transactionId.trim() === "") {
            alert("Please enter transaction ID"); return;
        }
        setShowModal(true);
    };

    const confirmOrder = () => {
        const orderItems = cart.map(
            (item, index) =>
                `${index + 1}. ${item.name}\nQty: ${item.qty}\nPrice: ₹${item.price * item.qty}`
        ).join("\n\n");

        const message = `
 *NEW ORDER - Gunnu Chinese Corner*

 Name: ${customerName}
 Phone: ${phone}
 Address: ${address}
 Landmark: ${landmark}

 *ORDER ITEMS*

${orderItems}

 Payment Mode: ${payment}
${payment === "UPI Payment" ? `\n UPI App: ${selectedUPI}\n Transaction ID: ${transactionId}` : ""}

 *Grand Total: ₹${total}*
`;

        window.open(`https://wa.me/919839621748?text=${encodeURIComponent(message)}`, "_blank");
        setShowModal(false);
    };

    const resetForm = () => {
        setShowModal(false);
        setCart([]);
        setCustomerName("");
        setPhone("");
        setAddress("");
        setLandmark("");
        setPayment("Cash On Delivery");
        setSelectedUPI("");
        setTransactionId("");
        setPaymentScreenshot(null);
        setQty(1);
    };

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    0%   { opacity: 0; transform: scale(0.94) translateY(10px); }
                    100% { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes ping {
                    0%   { transform: scale(1); opacity: 1; }
                    75%, 100% { transform: scale(1.6); opacity: 0; }
                }

                .order-section { animation: fadeUp 0.5s ease both; }

                .item-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
                .item-card:hover { transform: translateY(-2px); }

                .add-btn {
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.15s ease, opacity 0.15s ease;
                }
                .add-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.15);
                    transform: translateX(-100%);
                    transition: transform 0.35s ease;
                }
                .add-btn:hover::after { transform: translateX(100%); }
                .add-btn:active { transform: scale(0.97); }

                .flash-ring {
                    position: absolute;
                    inset: -3px;
                    border-radius: 14px;
                    border: 2px solid #eab308;
                    animation: ping 0.7s ease forwards;
                    pointer-events: none;
                }

                .cart-row {
                    animation: fadeUp 0.3s ease both;
                    transition: background 0.2s;
                }
                .cart-row:hover { background: rgba(255,255,255,0.04); }

                .suggest-item {
                    transition: background 0.2s, border-color 0.2s;
                    cursor: pointer;
                }
                .suggest-item:hover {
                    background: rgba(234,179,8,0.05);
                    border-color: rgba(234,179,8,0.35) !important;
                }

                .gold-text {
                    background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }

                input, textarea, select {
                    transition: border-color 0.2s;
                }
                input:focus, textarea:focus, select:focus {
                    border-color: rgba(234,179,8,0.4) !important;
                }

                select option { background: #0d0d0d; }
            `}</style>

            <Navbar />

            <section className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-20 px-4 md:px-8">
                <div className="max-w-6xl mx-auto">

                    {/* BACK */}
                    <div className="order-section flex justify-end mb-10">
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full border border-white/10 group-hover:border-white/30 flex items-center justify-center transition-colors">
                                <ArrowLeft size={14} />
                            </span>
                            Back
                        </button>
                    </div>

                    {/* HEADING */}
                    <div className="order-section text-center mb-16" style={{ animationDelay: "0.05s" }}>
                        <div className="inline-flex items-center gap-2 border border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-xs tracking-[0.15em] uppercase px-4 py-2 rounded-full mb-6">
                            <Sparkles size={11} />
                            Place Your Order
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight">
                            Order From{" "}
                            <span className="text-yellow-500">Gunnu</span>
                            <br />
                            <span className="text-red-700">Chinese Corner</span>
                        </h1>

                        <p className="text-gray-600 mt-5 text-sm max-w-sm mx-auto leading-relaxed">
                            Hot & fresh Chinese food delivered straight to your doorstep.
                        </p>
                    </div>

                    {/* MAIN GRID */}
                    <div className="grid lg:grid-cols-[1fr_1fr] gap-6">

                        {/* LEFT COLUMN */}
                        <div className="space-y-4 order-section" style={{ animationDelay: "0.1s" }}>

                            {/* ITEM SELECTOR CARD */}
                            <div className="item-card rounded-2xl overflow-hidden border border-white/[0.07]" style={{ background: "#111" }}>

                                {/* HERO IMAGE */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        key={currentItem?.image}
                                        src={currentItem?.image || "https://via.placeholder.com/600x400/111111/222222?text=..."}
                                        className="w-full h-full object-cover"
                                        style={{ transition: "opacity 0.5s ease" }}
                                        alt={currentItem?.name}
                                    />
                                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #111 0%, rgba(17,17,17,0.3) 50%, transparent 100%)" }} />

                                    {/* VEG/NON-VEG TOGGLE */}
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <button
                                            onClick={() => handleTypeChange("Veg")}
                                            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                            style={{
                                                background: foodType === "Veg" ? "#16a34a" : "rgba(0,0,0,0.5)",
                                                border: foodType === "Veg" ? "none" : "1px solid rgba(255,255,255,0.15)",
                                                backdropFilter: "blur(8px)",
                                            }}
                                        >
                                            🟢 Veg
                                        </button>
                                        <button
                                            onClick={() => handleTypeChange("Non Veg")}
                                            className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                                            style={{
                                                background: foodType === "Non Veg" ? "#b91c1c" : "rgba(0,0,0,0.5)",
                                                border: foodType === "Non Veg" ? "none" : "1px solid rgba(255,255,255,0.15)",
                                                backdropFilter: "blur(8px)",
                                            }}
                                        >
                                            🔴 Non Veg
                                        </button>
                                    </div>

                                    {/* PRICE */}
                                    {currentItem && (
                                        <div
                                            className="absolute bottom-4 right-4 text-black font-bold text-base px-4 py-1.5 rounded-full"
                                            style={{ background: "#eab308" }}
                                        >
                                            ₹{currentItem.price}
                                        </div>
                                    )}
                                </div>

                                {/* ITEM DETAILS */}
                                <div className="p-6">
                                    {loading ? (
                                        <div className="py-8 text-center text-gray-600 text-sm animate-pulse">
                                            Loading menu items...
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <h2 className="text-2xl font-bold">{currentItem?.name}</h2>

                                                <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                                    {currentItem?.description ||
                                                        (foodType === "Veg"
                                                            ? "A classic vegetarian Chinese dish prepared with farm-fresh vegetables, tossed in aromatic sauces."
                                                            : "Tender, juicy non-veg delight wok-tossed in bold Chinese spices for an irresistible flavour.")}
                                                </p>

                                                <div className="flex items-center gap-1 mt-3">
                                                    {[1, 2, 3, 4].map(s => (
                                                        <Star key={s} size={12} fill="#eab308" stroke="none" />
                                                    ))}
                                                    <Star size={12} fill="none" stroke="#374151" />
                                                    <span className="text-xs text-gray-600 ml-1">4.0 · Bestseller</span>
                                                </div>
                                            </div>

                                            {/* DROPDOWN */}
                                            <select
                                                value={selectedItem}
                                                onChange={(e) => { setSelectedItem(e.target.value); setQty(1); }}
                                                className="w-full px-4 py-3 text-sm rounded-xl outline-none"
                                                style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
                                            >
                                                {filteredItems.map((item, i) => (
                                                    <option key={i} value={item.name}>
                                                        {item.name}  —  ₹{item.price}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* QTY + ADD */}
                                            <div className="flex items-center gap-3 mt-4 relative">
                                                {addedFlash && <span className="flash-ring" />}

                                                <div
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                                                    style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)" }}
                                                >
                                                    <button
                                                        onClick={decreaseQty}
                                                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                                        style={{ background: "rgba(255,255,255,0.07)" }}
                                                    >
                                                        <Minus size={13} />
                                                    </button>
                                                    <span className="text-base font-bold w-5 text-center">{qty}</span>
                                                    <button
                                                        onClick={increaseQty}
                                                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                                        style={{ background: "#eab308", color: "black" }}
                                                    >
                                                        <Plus size={13} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => addToCart()}
                                                    className="add-btn flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                                                    style={{ background: "linear-gradient(135deg, #991b1b, #d97706)", color: "white" }}
                                                >
                                                    <ShoppingCart size={16} />
                                                    Add to Cart · ₹{(currentItem?.price || 0) * qty}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* SUGGESTED ITEMS */}
                            {!loading && suggestedItems.length > 0 && (
                                <div
                                    className="rounded-2xl p-5 border border-white/[0.07]"
                                    style={{ background: "#111" }}
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <Sparkles size={13} className="text-yellow-500" />
                                        <span className="text-xs font-semibold tracking-widest uppercase text-gray-500">
                                            You might also like
                                        </span>
                                    </div>

                                    <div className="space-y-2.5">
                                        {suggestedItems.map((item, i) => (
                                            <div
                                                key={i}
                                                className="suggest-item flex items-center gap-3 p-3 rounded-xl border border-white/[0.06]"
                                            >
                                                <img
                                                    src={item.image || "https://via.placeholder.com/80"}
                                                    alt={item.name}
                                                    className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                                                        {item.description || "Wok-tossed with authentic flavours"}
                                                    </p>
                                                    <p className="text-yellow-500 text-sm font-bold mt-0.5">₹{item.price}</p>
                                                </div>
                                                <button
                                                    onClick={() => addToCart(item, 1)}
                                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                                                    style={{ background: "#eab308", color: "black" }}
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN */}
                        <div
                            className="rounded-2xl p-6 border border-white/[0.07] order-section"
                            style={{ background: "#111", animationDelay: "0.15s" }}
                        >

                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ShoppingCart size={17} className="text-yellow-500" />
                                    Your Cart
                                </h3>
                                {totalItems > 0 && (
                                    <span
                                        className="text-xs px-3 py-1 rounded-full text-yellow-600"
                                        style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}
                                    >
                                        {totalItems} item{totalItems > 1 ? "s" : ""}
                                    </span>
                                )}
                            </div>

                            {cart.length === 0 ? (
                                <div
                                    className="flex flex-col items-center justify-center py-10 rounded-xl text-center mb-5"
                                    style={{ border: "1px dashed rgba(255,255,255,0.07)" }}
                                >
                                    <ShoppingCart size={26} className="text-gray-800 mb-3" />
                                    <p className="text-gray-700 text-sm">Cart is empty</p>
                                    <p className="text-gray-800 text-xs mt-1">Add items from the menu</p>
                                </div>
                            ) : (
                                <div className="space-y-2 mb-4">
                                    {cart.map((item, index) => (
                                        <div
                                            key={index}
                                            className="cart-row flex items-center gap-3 p-3 rounded-xl"
                                            style={{ border: "1px solid rgba(255,255,255,0.05)" }}
                                        >
                                            {item.image && (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-11 h-11 rounded-xl object-cover flex-shrink-0"
                                                />
                                            )}

                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate">{item.name}</p>
                                                <p className="text-yellow-500 text-sm font-bold">₹{item.price * item.qty}</p>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    onClick={() => updateCartQty(item.name, -1)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                                    style={{ background: "rgba(255,255,255,0.06)" }}
                                                >
                                                    <Minus size={11} />
                                                </button>
                                                <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                                                <button
                                                    onClick={() => updateCartQty(item.name, 1)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                                                    style={{ background: "rgba(234,179,8,0.15)", color: "#eab308" }}
                                                >
                                                    <Plus size={11} />
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.name)}
                                                    className="w-7 h-7 rounded-full flex items-center justify-center transition-colors ml-0.5"
                                                    style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}
                                                >
                                                    <Trash2 size={11} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div
                                    className="flex items-center justify-between px-4 py-3.5 rounded-xl mb-6"
                                    style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}
                                >
                                    <span className="text-gray-500 text-sm">Grand Total</span>
                                    <span className="text-2xl font-extrabold text-yellow-500">₹{total}</span>
                                </div>
                            )}

                            <div className="mb-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }} />

                            <h2 className="text-lg font-bold mb-5">Delivery Details</h2>

                            <form onSubmit={handleSubmit} className="space-y-3">

                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="text" required value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Full Name"
                                        className="px-4 py-3 text-sm rounded-xl outline-none placeholder:text-gray-700"
                                        style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                    />
                                    <input
                                        type="tel" required value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Phone Number"
                                        className="px-4 py-3 text-sm rounded-xl outline-none placeholder:text-gray-700"
                                        style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                    />
                                </div>

                                <textarea
                                    required rows="3" value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Full Delivery Address"
                                    className="w-full px-4 py-3 text-sm rounded-xl outline-none resize-none placeholder:text-gray-700"
                                    style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                />

                                <input
                                    type="text" value={landmark}
                                    onChange={(e) => setLandmark(e.target.value)}
                                    placeholder="Nearby Landmark (optional)"
                                    className="w-full px-4 py-3 text-sm rounded-xl outline-none placeholder:text-gray-700"
                                    style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                />

                                <select
                                    value={payment}
                                    onChange={(e) => setPayment(e.target.value)}
                                    className="w-full px-4 py-3 text-sm rounded-xl outline-none"
                                    style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                >
                                    <option>Cash On Delivery</option>
                                    <option>UPI Payment</option>
                                </select>

                                {payment === "UPI Payment" && (
                                    <div
                                        className="rounded-xl p-5 space-y-4"
                                        style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.07)" }}
                                    >
                                        <p className="text-sm font-bold">Pay Via UPI</p>

                                        <div className="grid grid-cols-3 gap-2">
                                            {["Google Pay", "PhonePe", "Paytm"].map((app) => (
                                                <button
                                                    key={app}
                                                    type="button"
                                                    onClick={() => setSelectedUPI(app)}
                                                    className="py-2.5 rounded-xl text-xs font-semibold transition-all"
                                                    style={{
                                                        border: selectedUPI === app ? "1px solid #eab308" : "1px solid rgba(255,255,255,0.08)",
                                                        background: selectedUPI === app ? "rgba(234,179,8,0.08)" : "transparent",
                                                        color: selectedUPI === app ? "#eab308" : "#9ca3af",
                                                    }}
                                                >
                                                    {app === "Google Pay" ? "GPay" : app}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="text-center">
                                            <img
                                                src="/qr.png"
                                                alt="QR Code"
                                                className="w-44 h-44 object-cover rounded-2xl mx-auto"
                                                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                                            />
                                            <p className="text-gray-600 text-xs mt-2">Scan using any UPI app</p>
                                        </div>

                                        <div
                                            className="text-center py-3 rounded-xl"
                                            style={{ background: "rgba(234,179,8,0.05)", border: "1px solid rgba(234,179,8,0.15)" }}
                                        >
                                            <p className="text-gray-600 text-xs">UPI ID</p>
                                            <p className="text-yellow-500 font-bold text-sm mt-0.5">gunnuchinese@upi</p>
                                        </div>

                                        <input
                                            type="text" required value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            placeholder="Enter UPI Transaction ID"
                                            className="w-full px-4 py-3 text-sm rounded-xl outline-none placeholder:text-gray-700"
                                            style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)", color: "white" }}
                                        />

                                        <div>
                                            <label className="text-xs text-gray-600 block mb-1.5">Payment Screenshot</label>
                                            <input
                                                type="file" accept="image/*"
                                                onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                                                className="w-full px-4 py-3 text-sm rounded-xl text-gray-500"
                                                style={{ background: "#111", border: "1px solid rgba(255,255,255,0.07)" }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="add-btn w-full py-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mt-2"
                                    style={{ background: "linear-gradient(135deg, #991b1b 0%, #d97706 100%)", color: "white" }}
                                >
                                    Confirm Order{cart.length > 0 ? ` · ₹${total}` : ""}
                                </button>

                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* MODAL */}
            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(12px)" }}
                >
                    <div
                        className="w-full max-w-md rounded-2xl p-8 text-center"
                        style={{
                            background: "#111",
                            border: "1px solid rgba(234,179,8,0.15)",
                            animation: "popIn 0.3s cubic-bezier(0.22,1,0.36,1) both",
                        }}
                    >
                        <div
                            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6"
                            style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>

                        <h2 className="text-4xl font-extrabold">
                            <span className="gold-text">Thank You ✨</span>
                        </h2>

                        <p className="text-yellow-600 text-sm mt-2 font-medium animate-pulse">
                            Your order is ready to confirm
                        </p>

                        <div
                            className="mt-5 rounded-xl p-4 text-left space-y-2"
                            style={{ background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
                        >
                            {cart.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className="text-gray-500">{item.name} × {item.qty}</span>
                                    <span className="text-white font-medium">₹{item.price * item.qty}</span>
                                </div>
                            ))}
                            <div
                                className="flex justify-between text-sm font-bold pt-2 mt-1"
                                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                            >
                                <span className="text-gray-400">Total</span>
                                <span className="text-yellow-500">₹{total}</span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mt-5 leading-relaxed">
                            {payment === "Cash On Delivery"
                                ? <>Click <strong className="text-white">OK</strong> — WhatsApp will open to confirm your order. We'll start preparing right away! 🍜</>
                                : <>Click <strong className="text-white">OK</strong> to open WhatsApp. Share your payment screenshot there for quick verification. 🍜</>}
                        </p>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 rounded-xl text-sm transition-colors"
                                style={{ border: "1px solid rgba(255,255,255,0.08)", color: "white" }}
                                onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                                onMouseOut={e => e.currentTarget.style.background = "transparent"}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmOrder}
                                className="add-btn flex-1 py-3 rounded-xl text-sm font-bold"
                                style={{ background: "linear-gradient(135deg, #991b1b, #d97706)", color: "white" }}
                            >
                                OK, Confirm 
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Order;