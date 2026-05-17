import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    Plus,
    Minus,
    ArrowLeft,
    ShoppingCart,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function Order() {

    const navigate = useNavigate();

    /* =========================
        STATES
    ========================= */

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

    /* =========================
        FETCH MENU
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

            const vegItems = res.data.filter((item) => {

                const itemType = item.type.toLowerCase();

                return (
                    itemType.includes("veg") &&
                    !itemType.includes("non")
                );
            });

            setFilteredItems(vegItems);

            if (vegItems.length > 0) {
                setSelectedItem(vegItems[0].name);
            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    /* =========================
        FOOD TYPE CHANGE
    ========================= */

    const handleTypeChange = (type) => {

        setFoodType(type);

        const filtered = menuItems.filter((item) => {

            const itemType = item.type.toLowerCase();

            if (type === "Veg") {

                return (
                    itemType.includes("veg") &&
                    !itemType.includes("non")
                );
            }

            return itemType.includes("non");
        });

        setFilteredItems(filtered);

        if (filtered.length > 0) {
            setSelectedItem(filtered[0].name);
        }

        setQty(1);
    };

    /* =========================
        CURRENT ITEM
    ========================= */

    const currentItem = filteredItems.find(
        (item) => item.name === selectedItem
    );

    /* =========================
        QUANTITY
    ========================= */

    const increaseQty = () => {
        setQty(qty + 1);
    };

    const decreaseQty = () => {

        if (qty > 1) {
            setQty(qty - 1);
        }
    };

    /* =========================
        ADD TO CART
    ========================= */

    const addToCart = () => {

        if (!currentItem) return;

        const existingItem = cart.find(
            (item) => item.name === currentItem.name
        );

        if (existingItem) {

            const updatedCart = cart.map((item) =>
                item.name === currentItem.name
                    ? {
                        ...item,
                        qty: item.qty + qty,
                    }
                    : item
            );

            setCart(updatedCart);

        } else {

            setCart([
                ...cart,
                {
                    ...currentItem,
                    qty,
                },
            ]);
        }

        setQty(1);
    };

    /* =========================
        REMOVE ITEM
    ========================= */

    const removeItem = (name) => {

        const updatedCart = cart.filter(
            (item) => item.name !== name
        );

        setCart(updatedCart);
    };

    /* =========================
        TOTAL
    ========================= */

    const total = cart.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
    );

    /* =========================
        SUBMIT
    ========================= */

    const handleSubmit = (e) => {

        e.preventDefault();

        if (cart.length === 0) {
            alert("Please add items to cart");
            return;
        }

        if (
            payment === "UPI Payment" &&
            transactionId.trim() === ""
        ) {
            alert("Please enter transaction ID");
            return;
        }

        setShowModal(true);
    };

    /* =========================
        CONFIRM ORDER
    ========================= */

    const confirmOrder = () => {

        const orderItems = cart.map(
            (item, index) =>
                `${index + 1}. ${item.name}
Qty: ${item.qty}
Price: ₹${item.price * item.qty}`
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

${payment === "UPI Payment"
                ? `
 UPI App: ${selectedUPI}

 Transaction ID: ${transactionId}
`
                : ""
            }

 *Grand Total: ₹${total}*
`;

        const whatsappNumber = "919839621748";

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappURL, "_blank");

        setShowModal(false);
    };

    return (
        <>
            <Navbar />

            <section className="min-h-screen bg-black text-white py-24 px-6">

                <div className="max-w-7xl mx-auto">

                    {/* BACK BUTTON */}

                    <div className="flex justify-end mb-8">

                        <button
                            onClick={() => navigate(-1)}
                            className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500 flex items-center gap-2 transition"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>

                    </div>

                    {/* HEADING */}

                    <div className="text-center max-w-3xl mx-auto">

                        <span className="px-4 py-2 rounded-full border border-yellow-500/30 text-yellow-400 bg-white/5 text-sm">
                            Place Your Order
                        </span>

                        <h1 className="text-4xl md:text-6xl font-bold mt-5">

                            Order From{" "}

                            <span className="text-yellow-500">
                                Gunnu Chinese
                            </span>{" "}

                            <span className="text-red-700">
                                Corner
                            </span>

                        </h1>

                        <p className="text-gray-400 mt-5">
                            Premium Veg & Non Veg Chinese food delivered hot & fresh.
                        </p>

                    </div>

                    {/* MAIN GRID */}

                    <div className="grid lg:grid-cols-2 gap-10 mt-16">

                        {/* LEFT SIDE */}

                        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">

                            <img
                                key={currentItem?.image}
                                src={
                                    currentItem?.image ||
                                    "https://via.placeholder.com/600x400"
                                }
                                className="w-full h-80 object-cover transition-all duration-500"
                                alt={currentItem?.name}
                            />

                            <div className="p-8">

                                {/* FOOD TYPE */}

                                <div className="flex gap-3 mb-5">

                                    <button
                                        onClick={() => handleTypeChange("Veg")}
                                        className={`px-4 py-2 rounded-full text-sm transition ${foodType === "Veg"
                                            ? "bg-green-600"
                                            : "bg-white/5"
                                            }`}
                                    >
                                        Veg
                                    </button>

                                    <button
                                        onClick={() => handleTypeChange("Non Veg")}
                                        className={`px-4 py-2 rounded-full text-sm transition ${foodType === "Non Veg"
                                            ? "bg-red-700"
                                            : "bg-white/5"
                                            }`}
                                    >
                                        Non Veg
                                    </button>

                                </div>

                                {/* LOADING */}

                                {loading ? (

                                    <div className="text-center py-10">
                                        Loading Menu...
                                    </div>

                                ) : (

                                    <>

                                        <h2 className="text-3xl font-bold">
                                            {currentItem?.name}
                                        </h2>

                                        {/* DROPDOWN */}

                                        <select
                                            value={selectedItem}
                                            onChange={(e) =>
                                                setSelectedItem(e.target.value)
                                            }
                                            className="w-full mt-5 px-5 py-4 rounded-2xl bg-black border border-white/10"
                                        >

                                            {filteredItems.map((item, i) => (

                                                <option
                                                    key={i}
                                                    value={item.name}
                                                >
                                                    {item.name}
                                                </option>

                                            ))}

                                        </select>

                                        {/* PRICE */}

                                        <div className="mt-6 flex justify-between items-center">

                                            <span className="text-yellow-500 text-3xl font-bold">
                                                ₹{currentItem?.price}
                                            </span>

                                            {/* QTY */}

                                            <div className="flex items-center gap-5">

                                                <button
                                                    onClick={decreaseQty}
                                                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
                                                >
                                                    <Minus size={18} />
                                                </button>

                                                <span className="text-xl font-bold">
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

                                        {/* ADD TO CART */}

                                        <button
                                            onClick={addToCart}
                                            className="w-full mt-6 bg-gradient-to-r from-red-800 to-yellow-500 text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition flex items-center justify-center gap-2"
                                        >

                                            <ShoppingCart size={20} />

                                            Add To Cart

                                        </button>

                                    </>
                                )}

                            </div>

                        </div>

                        {/* RIGHT SIDE */}

                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

                            {/* CART */}

                            <div className="mb-8">

                                <h3 className="text-2xl font-bold mb-5">
                                    Your Cart
                                </h3>

                                {cart.length === 0 ? (

                                    <p className="text-gray-400">
                                        No items added yet.
                                    </p>

                                ) : (

                                    <div className="space-y-4">

                                        {cart.map((item, index) => (

                                            <div
                                                key={index}
                                                className="bg-black border border-white/10 rounded-xl p-4 flex justify-between items-center"
                                            >

                                                <div>

                                                    <h4 className="font-semibold">
                                                        {item.name}
                                                    </h4>

                                                    <p className="text-sm text-gray-400">
                                                        Qty: {item.qty}
                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <span className="text-yellow-500 font-bold block">
                                                        ₹{item.price * item.qty}
                                                    </span>

                                                    <button
                                                        onClick={() => removeItem(item.name)}
                                                        className="text-red-500 text-sm mt-2"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </div>

                            {/* TOTAL */}

                            <div className="flex justify-between items-center border-t border-white/10 pt-5 mb-8">

                                <span className="text-lg text-gray-300">
                                    Grand Total
                                </span>

                                <span className="text-3xl font-bold text-yellow-500">
                                    ₹{total}
                                </span>

                            </div>

                            {/* FORM */}

                            <h2 className="text-3xl font-bold mb-8">
                                Delivery Details
                            </h2>

                            <form
                                onSubmit={handleSubmit}
                                className="space-y-5"
                            >

                                <input
                                    type="text"
                                    required
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(e.target.value)
                                    }
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                    placeholder="Full Name"
                                />

                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) =>
                                        setPhone(e.target.value)
                                    }
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                    placeholder="Phone Number"
                                />

                                <textarea
                                    required
                                    rows="4"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(e.target.value)
                                    }
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                    placeholder="Full Delivery Address"
                                />

                                <input
                                    type="text"
                                    value={landmark}
                                    onChange={(e) =>
                                        setLandmark(e.target.value)
                                    }
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                    placeholder="Nearby Landmark"
                                />

                                {/* PAYMENT */}

                                <select
                                    value={payment}
                                    onChange={(e) =>
                                        setPayment(e.target.value)
                                    }
                                    className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                >

                                    <option>
                                        Cash On Delivery
                                    </option>

                                    <option>
                                        UPI Payment
                                    </option>

                                </select>

                                {/* UPI SECTION */}

                                {payment === "UPI Payment" && (

                                    <div className="bg-black border border-white/10 rounded-2xl p-5 space-y-5">

                                        <h3 className="text-xl font-bold">
                                            Pay Using UPI
                                        </h3>

                                        {/* APPS */}

                                        <div className="grid grid-cols-3 gap-3">

                                            <button
                                                type="button"
                                                onClick={() => setSelectedUPI("Google Pay")}
                                                className={`p-3 rounded-xl border ${selectedUPI === "Google Pay"
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : "border-white/10"
                                                    }`}
                                            >
                                                GPay
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedUPI("PhonePe")}
                                                className={`p-3 rounded-xl border ${selectedUPI === "PhonePe"
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : "border-white/10"
                                                    }`}
                                            >
                                                PhonePe
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setSelectedUPI("Paytm")}
                                                className={`p-3 rounded-xl border ${selectedUPI === "Paytm"
                                                    ? "border-yellow-500 bg-yellow-500/10"
                                                    : "border-white/10"
                                                    }`}
                                            >
                                                Paytm
                                            </button>

                                        </div>

                                        {/* QR */}

                                        <div className="text-center">

                                            <img
                                                src="/qr.png"
                                                alt="QR"
                                                className="w-52 h-52 object-cover rounded-2xl mx-auto border border-white/10"
                                            />

                                            <p className="text-gray-400 mt-3 text-sm">
                                                Scan & Pay Using Any UPI App
                                            </p>

                                        </div>

                                        {/* UPI ID */}

                                        <div className="bg-white/5 p-4 rounded-xl text-center">

                                            <p className="text-gray-400 text-sm">
                                                UPI ID
                                            </p>

                                            <h4 className="text-lg font-bold text-yellow-500 mt-1">
                                                gunnuchinese@upi
                                            </h4>

                                        </div>

                                        {/* TRANSACTION */}

                                        <input
                                            type="text"
                                            required
                                            value={transactionId}
                                            onChange={(e) =>
                                                setTransactionId(e.target.value)
                                            }
                                            className="w-full p-4 bg-black border border-white/10 rounded-xl outline-none"
                                            placeholder="Enter UPI Transaction ID"
                                        />

                                        {/* SCREENSHOT */}

                                        <div>

                                            <label className="block mb-2 text-sm text-gray-400">
                                                Upload Payment Screenshot
                                            </label>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setPaymentScreenshot(e.target.files[0])
                                                }
                                                className="w-full p-3 bg-black border border-white/10 rounded-xl"
                                            />

                                        </div>

                                    </div>

                                )}

                                {/* BUTTON */}

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-red-800 to-yellow-500 text-white p-4 rounded-xl font-bold hover:scale-[1.02] transition"
                                >
                                    Confirm Order ₹{total}
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </section>

            {/* MODAL */}

            {showModal && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-5">

                    <div className="w-full max-w-lg bg-[#111] border border-yellow-500/20 rounded-3xl p-8 text-center animate-[popup_.3s_ease]">

                        {/* TICK ICON */}

                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-bounce">

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="w-12 h-12 text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>

                        </div>

                        {/* TITLE */}

                        <h2 className="text-4xl md:text-5xl font-extrabold mt-6 overflow-hidden">

                            <span className="inline-block bg-gradient-to-r from-yellow-400 via-white to-yellow-500 bg-clip-text text-transparent animate-[thankyou_2s_linear_infinite] bg-[length:200%_auto]">

                                Thank You ✨

                            </span>

                        </h2>

                        {/* SUBTITLE */}

                        <p className="text-yellow-500 mt-3 text-lg font-medium animate-pulse">

                            Your Order Is Ready To Confirm

                        </p>

                        {/* MESSAGE */}

                        {payment === "Cash On Delivery" ? (

                            <>

                                <p className="text-yellow-500 mt-3 text-lg font-medium animate-pulse">

                                    Your Order Is Being Prepared 🍜

                                </p>

                                <p className="text-gray-300 leading-relaxed mt-6 text-[15px]">

                                    Thank you for ordering from
                                    <span className="text-yellow-500 font-semibold">
                                        {" "}Gunnu Chinese Corner
                                    </span> ✨

                                    <br /><br />

                                    Your order request has been received successfully.

                                    <br /><br />

                                    After clicking
                                    <span className="text-yellow-500 font-semibold">
                                        {" "}OK
                                    </span>,
                                    WhatsApp will open for quick order confirmation.

                                </p>

                            </>

                        ) : (

                            <>

                                <p className="text-yellow-500 mt-3 text-lg font-medium animate-pulse">

                                    Payment Verification Required 💳

                                </p>

                                <p className="text-gray-300 leading-relaxed mt-6 text-[15px]">

                                    WhatsApp will open after clicking
                                    <span className="text-yellow-500 font-semibold">
                                        {" "}OK
                                    </span>.

                                    <br /><br />

                                    If payment is completed, kindly upload your payment screenshot in WhatsApp for verification.

                                    <br /><br />

                                    This helps us confirm genuine orders quickly and start preparing your food without delay 🍜✨

                                </p>

                            </>

                        )}

                        {/* BUTTONS */}

                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={() => {
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
                                }}
                                className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/10 transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmOrder}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-800 to-yellow-500 font-bold hover:scale-105 transition"
                            >
                                OK
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