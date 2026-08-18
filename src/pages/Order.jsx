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
    Check,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Order() {
    const navigate = useNavigate();
    const location = useLocation();

    const preSelectedItem =
        location.state?.selectedMenuItem || null;

    // =========================================================
    // STATES
    // =========================================================

    const [menuItems, setMenuItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState("");
    const [foodType, setFoodType] = useState("Veg");

    const [selectedSize, setSelectedSize] = useState("full");
    const [qty, setQty] = useState(1);

    const [cart, setCart] = useState([]);

    const [loading, setLoading] = useState(true);
    const [addedFlash, setAddedFlash] = useState(false);

    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [landmark, setLandmark] = useState("");

    const [payment, setPayment] =
        useState("Cash On Delivery");

    const [selectedUPI, setSelectedUPI] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] =
        useState(null);

    const [showModal, setShowModal] = useState(false);

    // =========================================================
    // PRICE HELPERS
    // =========================================================

    const getFullPrice = (item) => {
        if (!item?.price) return 0;

        if (
            typeof item.price === "object" &&
            item.price !== null
        ) {
            return Number(item.price.full || 0);
        }

        return Number(item.price || 0);
    };

    const getHalfPrice = (item) => {
        if (
            !item?.price ||
            typeof item.price !== "object"
        ) {
            return null;
        }

        if (
            item.price.half === undefined ||
            item.price.half === null ||
            item.price.half === ""
        ) {
            return null;
        }

        const price = Number(item.price.half);

        return Number.isFinite(price) ? price : null;
    };

    const hasHalfPrice = (item) => {
        return getHalfPrice(item) !== null;
    };

    const getPriceBySize = (item, size) => {
        if (!item) return 0;

        if (size === "half") {
            const half = getHalfPrice(item);

            if (half !== null) {
                return half;
            }
        }

        return getFullPrice(item);
    };

    // =========================================================
    // FOOD TYPE FILTER
    // =========================================================

    const filterByFoodType = (items, type) => {
        return items.filter((item) => {
            const itemType =
                String(item?.type || "").toLowerCase();

            if (type === "Veg") {
                return (
                    itemType.includes("veg") &&
                    !itemType.includes("non")
                );
            }

            return itemType.includes("non");
        });
    };

    // =========================================================
    // FETCH MENU
    // =========================================================

    useEffect(() => {
        fetchMenu();
    }, []);

    const fetchMenu = async () => {
        try {
            const response = await axios.get(
                "https://gunnu-dashboard.onrender.com/api/menu"
            );

            const items = Array.isArray(response.data)
                ? response.data
                : [];

            setMenuItems(items);

            let initialType = "Veg";

            if (preSelectedItem) {
                const type =
                    String(
                        preSelectedItem.type || ""
                    ).toLowerCase();

                initialType = type.includes("non")
                    ? "Non Veg"
                    : "Veg";
            }

            setFoodType(initialType);

            const filtered = filterByFoodType(
                items,
                initialType
            );

            setFilteredItems(filtered);

            if (preSelectedItem) {
                const matchingItem = filtered.find(
                    (item) =>
                        item.name ===
                        preSelectedItem.name
                );

                if (matchingItem) {
                    setSelectedItem(
                        matchingItem.name
                    );
                } else if (filtered.length > 0) {
                    setSelectedItem(
                        filtered[0].name
                    );
                }
            } else if (filtered.length > 0) {
                setSelectedItem(filtered[0].name);
            }
        } catch (error) {
            console.error(
                "Failed to fetch menu:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // CURRENT ITEM
    // =========================================================

    const currentItem = useMemo(() => {
        return (
            filteredItems.find(
                (item) =>
                    item.name === selectedItem
            ) || null
        );
    }, [filteredItems, selectedItem]);

    // =========================================================
    // AUTO RESET SIZE WHEN ITEM CHANGES
    // =========================================================

    useEffect(() => {
        if (!currentItem) return;

        // Every new item starts from Full.
        setSelectedSize("full");
        setQty(1);
    }, [selectedItem]);

    // =========================================================
    // FOOD TYPE CHANGE
    // =========================================================

    const handleTypeChange = (type) => {
        setFoodType(type);

        const filtered = filterByFoodType(
            menuItems,
            type
        );

        setFilteredItems(filtered);

        if (filtered.length > 0) {
            setSelectedItem(filtered[0].name);
            setSelectedSize("full");
            setQty(1);
        } else {
            setSelectedItem("");
            setSelectedSize("full");
            setQty(1);
        }
    };

    // =========================================================
    // ITEM CHANGE
    // =========================================================

    const handleItemChange = (name) => {
        setSelectedItem(name);

        // Important:
        // Every selected menu item starts with Full.
        setSelectedSize("full");
        setQty(1);
    };

    // =========================================================
    // SIZE CHANGE
    // =========================================================

    const handleSizeChange = (size) => {
        if (!currentItem) return;

        if (
            size === "half" &&
            !hasHalfPrice(currentItem)
        ) {
            setSelectedSize("full");
            return;
        }

        setSelectedSize(size);
    };

    // =========================================================
    // QUANTITY
    // =========================================================

    const increaseQty = () => {
        setQty((prev) => prev + 1);
    };

    const decreaseQty = () => {
        setQty((prev) =>
            prev > 1 ? prev - 1 : 1
        );
    };

    // =========================================================
    // ADD TO CART
    // =========================================================
    /*
        IMPORTANT LOGIC:

        Triple Rice Full ₹140
        and
        Triple Rice Half ₹120

        are TWO DIFFERENT cart variants.

        Example:

        cart = [
            {
                name: "Triple Rice",
                size: "full",
                unitPrice: 140,
                qty: 1
            },
            {
                name: "Triple Rice",
                size: "half",
                unitPrice: 120,
                qty: 1
            }
        ]

        Agar user sirf Half add karta hai,
        cart mein sirf Half aayega.
    */

    const addToCart = (
        item = currentItem,
        quantity = qty,
        size = selectedSize
    ) => {
        if (!item) return;

        let finalSize = size;

        // Half unavailable -> Full
        if (
            finalSize === "half" &&
            !hasHalfPrice(item)
        ) {
            finalSize = "full";
        }

        const unitPrice = getPriceBySize(
            item,
            finalSize
        );

        if (!unitPrice || quantity <= 0) {
            return;
        }

        const category =
            item.category ||
            item.categoryName ||
            "General";

        const foodItemType =
            item.type ||
            foodType;

        /*
            KEY LOGIC:

            name + size = unique cart variant

            Triple Rice + Full
            Triple Rice + Half

            dono alag rahenge.
        */

        setCart((previousCart) => {
            const existingIndex =
                previousCart.findIndex(
                    (cartItem) =>
                        cartItem.name ===
                            item.name &&
                        cartItem.size ===
                            finalSize
                );

            // Existing same size item
            if (existingIndex !== -1) {
                return previousCart.map(
                    (cartItem, index) => {
                        if (
                            index !==
                            existingIndex
                        ) {
                            return cartItem;
                        }

                        return {
                            ...cartItem,
                            qty:
                                Number(
                                    cartItem.qty
                                ) +
                                Number(quantity),
                        };
                    }
                );
            }

            // New item / different size
            return [
                ...previousCart,
                {
                    id: `${item._id || item.id || item.name}-${finalSize}`,

                    name: item.name,

                    image: item.image || "",

                    description:
                        item.description || "",

                    category,

                    foodType: foodItemType,

                    size: finalSize,

                    unitPrice,

                    qty: Number(quantity),
                },
            ];
        });

        setQty(1);

        setAddedFlash(true);

        setTimeout(() => {
            setAddedFlash(false);
        }, 700);
    };

    // =========================================================
    // CART QUANTITY
    // =========================================================

    const updateCartQty = (
        itemName,
        size,
        delta
    ) => {
        setCart((previousCart) =>
            previousCart
                .map((item) => {
                    if (
                        item.name === itemName &&
                        item.size === size
                    ) {
                        const newQty =
                            Number(item.qty) +
                            Number(delta);

                        return {
                            ...item,
                            qty: newQty,
                        };
                    }

                    return item;
                })
                .filter(
                    (item) =>
                        Number(item.qty) > 0
                )
        );
    };

    // =========================================================
    // REMOVE CART ITEM
    // =========================================================

    const removeItem = (
        itemName,
        size
    ) => {
        setCart((previousCart) =>
            previousCart.filter(
                (item) =>
                    !(
                        item.name === itemName &&
                        item.size === size
                    )
            )
        );
    };

    // =========================================================
    // CART CALCULATIONS
    // =========================================================

    const getCartItemTotal = (item) => {
        return (
            Number(item.unitPrice || 0) *
            Number(item.qty || 0)
        );
    };

    const total = cart.reduce(
        (sum, item) =>
            sum + getCartItemTotal(item),
        0
    );

    const totalItems = cart.reduce(
        (sum, item) =>
            sum + Number(item.qty || 0),
        0
    );

    // =========================================================
    // SUGGESTIONS
    // =========================================================

    const suggestedItems = filteredItems
        .filter(
            (item) =>
                item.name !== selectedItem
        )
        .slice(0, 3);

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert(
                "Please add at least one item to your cart."
            );
            return;
        }

        if (!customerName.trim()) {
            alert("Please enter your name.");
            return;
        }

        if (!phone.trim()) {
            alert(
                "Please enter your phone number."
            );
            return;
        }

        if (!address.trim()) {
            alert(
                "Please enter your delivery address."
            );
            return;
        }

        if (
            payment === "UPI Payment" &&
            !transactionId.trim()
        ) {
            alert(
                "Please enter UPI transaction ID."
            );
            return;
        }

        setShowModal(true);
    };

    // =========================================================
    // WHATSAPP ORDER
    // =========================================================

    const confirmOrder = () => {
        const orderItems = cart
            .map((item, index) => {
                const size =
                    item.size === "half"
                        ? "Half"
                        : "Full";

                return (
                    `${index + 1}. ${item.name}\n` +
                    `Category: ${
                        item.category || "General"
                    }\n` +
                    `Type: ${
                        item.foodType || ""
                    }\n` +
                    `Size: ${size}\n` +
                    `Qty: ${item.qty}\n` +
                    `Unit Price: ₹${item.unitPrice}\n` +
                    `Item Total: ₹${getCartItemTotal(
                        item
                    )}`
                );
            })
            .join("\n\n");

        const message =
            `*NEW ORDER - Gunnu Chinese Corner*\n\n` +

            `*CUSTOMER DETAILS*\n` +
            `Name: ${customerName}\n` +
            `Phone: ${phone}\n` +
            `Address: ${address}\n` +
            `Landmark: ${
                landmark.trim() ||
                "Not provided"
            }\n\n` +

            `*ORDER ITEMS*\n\n` +
            `${orderItems}\n\n` +

            `*ORDER SUMMARY*\n` +
            `Total Items: ${totalItems}\n` +
            `Grand Total: ₹${total}\n\n` +

            `*PAYMENT DETAILS*\n` +
            `Payment Mode: ${payment}\n` +

            (payment === "UPI Payment"
                ? `UPI App: ${
                      selectedUPI ||
                      "Not selected"
                  }\n` +
                  `Transaction ID: ${transactionId}\n`
                : "");

        const whatsappUrl =
            "https://wa.me/919839621748?text=" +
            encodeURIComponent(message);

        window.open(
            whatsappUrl,
            "_blank"
        );

        setShowModal(false);
    };

    // =========================================================
    // RESET
    // =========================================================

    const resetForm = () => {
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
        setSelectedSize("full");

        setShowModal(false);
    };

    // =========================================================
    // RENDER
    // =========================================================

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(16px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes popIn {
                    0% {
                        opacity: 0;
                        transform: scale(.94) translateY(10px);
                    }

                    100% {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }

                    100% {
                        background-position: 200% center;
                    }
                }

                @keyframes ping {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }

                    75%,
                    100% {
                        transform: scale(1.6);
                        opacity: 0;
                    }
                }

                * {
                    box-sizing: border-box;
                }

                .order-section {
                    animation: fadeUp .5s ease both;
                }

                .item-card {
                    transition:
                        transform .25s ease,
                        box-shadow .25s ease;
                }

                .item-card:hover {
                    transform: translateY(-2px);
                }

                .add-btn {
                    position: relative;
                    overflow: hidden;
                    transition:
                        transform .15s ease,
                        opacity .15s ease;
                }

                .add-btn::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,.15);
                    transform: translateX(-100%);
                    transition: transform .35s ease;
                }

                .add-btn:hover::after {
                    transform: translateX(100%);
                }

                .add-btn:active {
                    transform: scale(.97);
                }

                .flash-ring {
                    position: absolute;
                    inset: -3px;
                    border-radius: 14px;
                    border: 2px solid #eab308;
                    animation: ping .7s ease forwards;
                    pointer-events: none;
                }

                .cart-row {
                    animation: fadeUp .3s ease both;
                    transition: background .2s;
                }

                .cart-row:hover {
                    background: rgba(255,255,255,.04);
                }

                .suggest-item {
                    transition:
                        background .2s,
                        border-color .2s;
                    cursor: pointer;
                }

                .suggest-item:hover {
                    background: rgba(234,179,8,.05);
                    border-color:
                        rgba(234,179,8,.35) !important;
                }

                .gold-text {
                    background:
                        linear-gradient(
                            90deg,
                            #f59e0b,
                            #fde68a,
                            #f59e0b
                        );
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }

                input,
                textarea,
                select {
                    transition:
                        border-color .2s,
                        box-shadow .2s;
                    max-width: 100%;
                }

                input:focus,
                textarea:focus,
                select:focus {
                    border-color:
                        rgba(234,179,8,.4) !important;
                    outline: none;
                    box-shadow:
                        0 0 0 2px
                        rgba(234,179,8,.05);
                }

                select option {
                    background: #0d0d0d;
                    color: white;
                }

                .safe-wrap {
                    min-width: 0;
                    overflow-wrap: anywhere;
                }

                @media (max-width: 1024px) {
                    .order-main-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 640px) {
                    .order-title {
                        font-size: clamp(
                            2.3rem,
                            11vw,
                            3.2rem
                        ) !important;
                    }

                    .hero-image {
                        height: 220px !important;
                    }

                    .order-card-padding {
                        padding: 16px !important;
                    }

                    .cart-panel {
                        padding: 16px !important;
                    }

                    .cart-row {
                        align-items: flex-start !important;
                    }

                    .cart-controls {
                        width: 100%;
                        justify-content: flex-end;
                    }

                    .payment-grid {
                        grid-template-columns:
                            repeat(3, minmax(0, 1fr));
                    }
                }

                @media (max-width: 480px) {
                    .hero-image {
                        height: 190px !important;
                    }

                    .qty-add-row {
                        flex-direction: column !important;
                        align-items: stretch !important;
                    }

                    .qty-box {
                        width: 100%;
                        justify-content: center;
                    }

                    .add-cart-button {
                        width: 100%;
                    }

                    .cart-row {
                        flex-wrap: wrap;
                    }

                    .cart-product {
                        width: calc(100% - 58px);
                    }

                    .cart-controls {
                        width: 100%;
                        justify-content: space-between;
                        padding-left: 56px;
                    }

                    .modal-buttons {
                        flex-direction: column;
                    }
                }

                @media (max-width: 360px) {
                    .order-title {
                        font-size: 2.1rem !important;
                    }

                    .food-buttons {
                        gap: 5px !important;
                    }

                    .food-type-btn {
                        padding-left: 9px !important;
                        padding-right: 9px !important;
                    }

                    .hero-price {
                        font-size: 12px !important;
                        padding-left: 10px !important;
                        padding-right: 10px !important;
                    }

                    .size-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .payment-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>

            <Navbar />

            <section
                className="
                    min-h-screen
                    bg-[#0d0d0d]
                    text-white
                    pt-24
                    pb-16
                    px-3
                    sm:px-5
                    md:px-8
                "
            >
                <div className="max-w-6xl mx-auto">

                    {/* =====================================================
                        BACK BUTTON
                    ====================================================== */}

                    <div className="order-section flex justify-end mb-8">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(-1)
                            }
                            className="
                                group
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-gray-500
                                hover:text-white
                                transition-colors
                            "
                        >
                            <span
                                className="
                                    w-8
                                    h-8
                                    rounded-full
                                    border
                                    border-white/10
                                    group-hover:border-white/30
                                    flex
                                    items-center
                                    justify-center
                                "
                            >
                                <ArrowLeft
                                    size={14}
                                />
                            </span>

                            Back
                        </button>
                    </div>

                    {/* =====================================================
                        HEADER
                    ====================================================== */}

                    <div
                        className="
                            order-section
                            text-center
                            mb-10
                            sm:mb-14
                        "
                    >
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                border
                                border-yellow-500/20
                                bg-yellow-500/5
                                text-yellow-500
                                text-[10px]
                                sm:text-xs
                                tracking-[.15em]
                                uppercase
                                px-3
                                sm:px-4
                                py-2
                                rounded-full
                                mb-5
                            "
                        >
                            <Sparkles size={11} />

                            Place Your Order
                        </div>

                        <h1
                            className="
                                order-title
                                text-5xl
                                md:text-7xl
                                font-bold
                                leading-[1.08]
                                tracking-tight
                            "
                        >
                            Order From{" "}

                            <span className="text-yellow-500">
                                Gunnu
                            </span>

                            <br />

                            <span className="text-red-700">
                                Chinese Corner
                            </span>
                        </h1>

                        <p
                            className="
                                text-gray-600
                                mt-4
                                text-xs
                                sm:text-sm
                                max-w-sm
                                mx-auto
                                leading-relaxed
                                px-4
                            "
                        >
                            Hot & fresh Chinese food
                            delivered straight to
                            your doorstep.
                        </p>
                    </div>

                    {/* =====================================================
                        MAIN GRID
                    ====================================================== */}

                    <div
                        className="
                            order-main-grid
                            grid
                            lg:grid-cols-2
                            gap-5
                            lg:gap-6
                            items-start
                        "
                    >

                        {/* =================================================
                            LEFT MENU
                        ================================================== */}

                        <div
                            className="
                                space-y-4
                                order-section
                                min-w-0
                            "
                        >
                            <div
                                className="
                                    item-card
                                    rounded-2xl
                                    overflow-hidden
                                    border
                                    border-white/[.07]
                                "
                                style={{
                                    background: "#111",
                                }}
                            >

                                {/* HERO */}

                                <div
                                    className="
                                        relative
                                        hero-image
                                        h-64
                                        overflow-hidden
                                    "
                                >
                                    <img
                                        key={
                                            currentItem?.image ||
                                            currentItem?.name
                                        }
                                        src={
                                            currentItem?.image ||
                                            "https://via.placeholder.com/600x400/111111/222222?text=Food"
                                        }
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                        "
                                        alt={
                                            currentItem?.name ||
                                            "Food"
                                        }
                                    />

                                    <div
                                        className="
                                            absolute
                                            inset-0
                                        "
                                        style={{
                                            background:
                                                "linear-gradient(to top,#111 0%,rgba(17,17,17,.3) 50%,transparent 100%)",
                                        }}
                                    />

                                    {/* FOOD TYPE */}

                                    <div
                                        className="
                                            food-buttons
                                            absolute
                                            top-4
                                            left-4
                                            flex
                                            flex-wrap
                                            gap-2
                                        "
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleTypeChange(
                                                    "Veg"
                                                )
                                            }
                                            className="
                                                food-type-btn
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-semibold
                                            "
                                            style={{
                                                background:
                                                    foodType ===
                                                    "Veg"
                                                        ? "#16a34a"
                                                        : "rgba(0,0,0,.5)",
                                                border:
                                                    foodType ===
                                                    "Veg"
                                                        ? "none"
                                                        : "1px solid rgba(255,255,255,.15)",
                                                backdropFilter:
                                                    "blur(8px)",
                                            }}
                                        >
                                            🟢 Veg
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleTypeChange(
                                                    "Non Veg"
                                                )
                                            }
                                            className="
                                                food-type-btn
                                                px-3
                                                py-1
                                                rounded-full
                                                text-xs
                                                font-semibold
                                            "
                                            style={{
                                                background:
                                                    foodType ===
                                                    "Non Veg"
                                                        ? "#b91c1c"
                                                        : "rgba(0,0,0,.5)",
                                                border:
                                                    foodType ===
                                                    "Non Veg"
                                                        ? "none"
                                                        : "1px solid rgba(255,255,255,.15)",
                                                backdropFilter:
                                                    "blur(8px)",
                                            }}
                                        >
                                            🔴 Non Veg
                                        </button>
                                    </div>

                                    {/* PRICE */}

                                    {currentItem && (
                                        <div
                                            className="
                                                hero-price
                                                absolute
                                                bottom-4
                                                right-4
                                                text-black
                                                font-bold
                                                text-sm
                                                sm:text-base
                                                px-4
                                                py-1.5
                                                rounded-full
                                            "
                                            style={{
                                                background:
                                                    "#eab308",
                                            }}
                                        >
                                            ₹
                                            {getPriceBySize(
                                                currentItem,
                                                selectedSize
                                            )}

                                            <span className="text-[10px]">
                                                {" "}
                                                /{" "}
                                                {selectedSize ===
                                                "half"
                                                    ? "Half"
                                                    : "Full"}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* DETAILS */}

                                <div
                                    className="
                                        order-card-padding
                                        p-6
                                    "
                                >
                                    {loading ? (
                                        <div
                                            className="
                                                py-8
                                                text-center
                                                text-gray-600
                                                text-sm
                                                animate-pulse
                                            "
                                        >
                                            Loading menu
                                            items...
                                        </div>
                                    ) : (
                                        <>
                                            {/* ITEM INFO */}

                                            <div className="mb-5">
                                                <h2
                                                    className="
                                                        text-xl
                                                        sm:text-2xl
                                                        font-bold
                                                    "
                                                >
                                                    {currentItem?.name ||
                                                        "Select Item"}
                                                </h2>

                                                <p
                                                    className="
                                                        text-gray-500
                                                        text-xs
                                                        sm:text-sm
                                                        mt-2
                                                        leading-relaxed
                                                    "
                                                >
                                                    {currentItem?.description ||
                                                        (
                                                            foodType ===
                                                            "Veg"
                                                                ? "A classic vegetarian Chinese dish prepared with farm-fresh vegetables."
                                                                : "Tender, juicy non-veg delight wok-tossed in bold Chinese spices."
                                                        )}
                                                </p>

                                                {currentItem && (
                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            gap-2
                                                            mt-3
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                text-[10px]
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                bg-white/5
                                                                border
                                                                border-white/10
                                                                text-gray-500
                                                            "
                                                        >
                                                            Category:{" "}
                                                            {currentItem.category ||
                                                                currentItem.categoryName ||
                                                                "General"}
                                                        </span>

                                                        <span
                                                            className="
                                                                text-[10px]
                                                                px-2.5
                                                                py-1
                                                                rounded-full
                                                                bg-white/5
                                                                border
                                                                border-white/10
                                                                text-gray-500
                                                            "
                                                        >
                                                            {currentItem.type ||
                                                                foodType}
                                                        </span>
                                                    </div>
                                                )}

                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-1
                                                        mt-3
                                                    "
                                                >
                                                    {[1, 2, 3, 4].map(
                                                        (
                                                            star
                                                        ) => (
                                                            <Star
                                                                key={
                                                                    star
                                                                }
                                                                size={
                                                                    12
                                                                }
                                                                fill="#eab308"
                                                                stroke="none"
                                                            />
                                                        )
                                                    )}

                                                    <Star
                                                        size={
                                                            12
                                                        }
                                                        fill="none"
                                                        stroke="#374151"
                                                    />

                                                    <span
                                                        className="
                                                            text-xs
                                                            text-gray-600
                                                            ml-1
                                                        "
                                                    >
                                                        4.0 ·
                                                        Bestseller
                                                    </span>
                                                </div>
                                            </div>

                                            {/* ITEM SELECT */}

                                            <select
                                                value={
                                                    selectedItem
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleItemChange(
                                                        e.target.value
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    rounded-xl
                                                "
                                                style={{
                                                    background:
                                                        "#0d0d0d",
                                                    border:
                                                        "1px solid rgba(255,255,255,.08)",
                                                    color:
                                                        "white",
                                                }}
                                            >
                                                {filteredItems.length ===
                                                0 ? (
                                                    <option value="">
                                                        No items
                                                        available
                                                    </option>
                                                ) : (
                                                    filteredItems.map(
                                                        (
                                                            item
                                                        ) => (
                                                            <option
                                                                key={
                                                                    item._id ||
                                                                    item.id ||
                                                                    item.name
                                                                }
                                                                value={
                                                                    item.name
                                                                }
                                                            >
                                                                {
                                                                    item.name
                                                                }{" "}
                                                                — ₹
                                                                {getFullPrice(
                                                                    item
                                                                )}
                                                                {hasHalfPrice(
                                                                    item
                                                                )
                                                                    ? ` / ₹${getHalfPrice(
                                                                          item
                                                                      )}`
                                                                    : ""}
                                                            </option>
                                                        )
                                                    )
                                                )}
                                            </select>

                                            {/* =================================================
                                                FULL / HALF
                                            ================================================== */}

                                            {currentItem && (
                                                <div className="mt-4">
                                                    <p
                                                        className="
                                                            text-xs
                                                            text-gray-600
                                                            uppercase
                                                            tracking-widest
                                                            mb-2
                                                        "
                                                    >
                                                        Choose
                                                        Size
                                                    </p>

                                                    <div
                                                        className="
                                                            size-grid
                                                            grid
                                                            grid-cols-2
                                                            gap-2
                                                        "
                                                    >
                                                        {/* FULL */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleSizeChange(
                                                                    "full"
                                                                )
                                                            }
                                                            className="
                                                                relative
                                                                rounded-xl
                                                                p-3
                                                                text-left
                                                                transition-all
                                                            "
                                                            style={{
                                                                background:
                                                                    selectedSize ===
                                                                    "full"
                                                                        ? "rgba(234,179,8,.1)"
                                                                        : "#0d0d0d",
                                                                border:
                                                                    selectedSize ===
                                                                    "full"
                                                                        ? "1px solid #eab308"
                                                                        : "1px solid rgba(255,255,255,.08)",
                                                            }}
                                                        >
                                                            {selectedSize ===
                                                                "full" && (
                                                                <span
                                                                    className="
                                                                        absolute
                                                                        top-2
                                                                        right-2
                                                                        text-yellow-500
                                                                    "
                                                                >
                                                                    <Check
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </span>
                                                            )}

                                                            <span
                                                                className="
                                                                    block
                                                                    text-xs
                                                                    text-gray-500
                                                                "
                                                            >
                                                                Full
                                                            </span>

                                                            <span
                                                                className="
                                                                    block
                                                                    text-base
                                                                    font-bold
                                                                    text-yellow-500
                                                                    mt-1
                                                                "
                                                            >
                                                                ₹
                                                                {getFullPrice(
                                                                    currentItem
                                                                )}
                                                            </span>
                                                        </button>

                                                        {/* HALF */}

                                                        {hasHalfPrice(
                                                            currentItem
                                                        ) ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSizeChange(
                                                                        "half"
                                                                    )
                                                                }
                                                                className="
                                                                    relative
                                                                    rounded-xl
                                                                    p-3
                                                                    text-left
                                                                    transition-all
                                                                "
                                                                style={{
                                                                    background:
                                                                        selectedSize ===
                                                                        "half"
                                                                            ? "rgba(234,179,8,.1)"
                                                                            : "#0d0d0d",
                                                                    border:
                                                                        selectedSize ===
                                                                        "half"
                                                                            ? "1px solid #eab308"
                                                                            : "1px solid rgba(255,255,255,.08)",
                                                                }}
                                                            >
                                                                {selectedSize ===
                                                                    "half" && (
                                                                    <span
                                                                        className="
                                                                            absolute
                                                                            top-2
                                                                            right-2
                                                                            text-yellow-500
                                                                        "
                                                                    >
                                                                        <Check
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                    </span>
                                                                )}

                                                                <span
                                                                    className="
                                                                        block
                                                                        text-xs
                                                                        text-gray-500
                                                                    "
                                                                >
                                                                    Half
                                                                </span>

                                                                <span
                                                                    className="
                                                                        block
                                                                        text-base
                                                                        font-bold
                                                                        text-yellow-500
                                                                        mt-1
                                                                    "
                                                                >
                                                                    ₹
                                                                    {getHalfPrice(
                                                                        currentItem
                                                                    )}
                                                                </span>
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            )}

                                            {/* QTY + ADD */}

                                            <div
                                                className="
                                                    qty-add-row
                                                    flex
                                                    items-center
                                                    gap-3
                                                    mt-4
                                                    relative
                                                "
                                            >
                                                {addedFlash && (
                                                    <span className="flash-ring" />
                                                )}

                                                <div
                                                    className="
                                                        qty-box
                                                        flex
                                                        items-center
                                                        gap-3
                                                        px-4
                                                        py-3
                                                        rounded-xl
                                                        flex-shrink-0
                                                    "
                                                    style={{
                                                        background:
                                                            "#0d0d0d",
                                                        border:
                                                            "1px solid rgba(255,255,255,.08)",
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            decreaseQty
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                        style={{
                                                            background:
                                                                "rgba(255,255,255,.07)",
                                                        }}
                                                    >
                                                        <Minus
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>

                                                    <span
                                                        className="
                                                            text-base
                                                            font-bold
                                                            w-5
                                                            text-center
                                                        "
                                                    >
                                                        {
                                                            qty
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            increaseQty
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                        style={{
                                                            background:
                                                                "#eab308",
                                                            color:
                                                                "black",
                                                        }}
                                                    >
                                                        <Plus
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart()
                                                    }
                                                    className="
                                                        add-btn
                                                        add-cart-button
                                                        flex-1
                                                        flex
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        py-3
                                                        rounded-xl
                                                        text-sm
                                                        font-bold
                                                        min-w-0
                                                    "
                                                    style={{
                                                        background:
                                                            "linear-gradient(135deg,#991b1b,#d97706)",
                                                        color:
                                                            "white",
                                                    }}
                                                >
                                                    <ShoppingCart
                                                        size={
                                                            16
                                                        }
                                                    />

                                                    <span className="truncate">
                                                        Add to
                                                        Cart · ₹
                                                        {getPriceBySize(
                                                            currentItem,
                                                            selectedSize
                                                        ) *
                                                            qty}
                                                    </span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* =================================================
                                SUGGESTIONS
                            ================================================== */}

                            {!loading &&
                                suggestedItems.length >
                                    0 && (
                                    <div
                                        className="
                                            rounded-2xl
                                            p-4
                                            sm:p-5
                                            border
                                            border-white/[.07]
                                        "
                                        style={{
                                            background:
                                                "#111",
                                        }}
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-2
                                                mb-4
                                            "
                                        >
                                            <Sparkles
                                                size={
                                                    13
                                                }
                                                className="text-yellow-500"
                                            />

                                            <span
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    tracking-widest
                                                    uppercase
                                                    text-gray-500
                                                "
                                            >
                                                You might
                                                also like
                                            </span>
                                        </div>

                                        <div className="space-y-2.5">
                                            {suggestedItems.map(
                                                (
                                                    item
                                                ) => (
                                                    <div
                                                        key={
                                                            item._id ||
                                                            item.id ||
                                                            item.name
                                                        }
                                                        className="
                                                            suggest-item
                                                            flex
                                                            items-center
                                                            gap-3
                                                            p-3
                                                            rounded-xl
                                                            border
                                                            border-white/[.06]
                                                        "
                                                    >
                                                        <img
                                                            src={
                                                                item.image ||
                                                                "https://via.placeholder.com/80"
                                                            }
                                                            alt={
                                                                item.name
                                                            }
                                                            className="
                                                                w-12
                                                                h-12
                                                                rounded-xl
                                                                object-cover
                                                                flex-shrink-0
                                                            "
                                                        />

                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold truncate">
                                                                {
                                                                    item.name
                                                                }
                                                            </p>

                                                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                                                                {item.description ||
                                                                    "Wok-tossed with authentic flavours"}
                                                            </p>

                                                            <p className="text-yellow-500 text-sm font-bold mt-0.5">
                                                                ₹
                                                                {getFullPrice(
                                                                    item
                                                                )}
                                                            </p>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                addToCart(
                                                                    item,
                                                                    1,
                                                                    "full"
                                                                )
                                                            }
                                                            className="
                                                                w-8
                                                                h-8
                                                                rounded-full
                                                                flex
                                                                items-center
                                                                justify-center
                                                                flex-shrink-0
                                                            "
                                                            style={{
                                                                background:
                                                                    "#eab308",
                                                                color:
                                                                    "black",
                                                            }}
                                                        >
                                                            <Plus
                                                                size={
                                                                    14
                                                                }
                                                            />
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* =================================================
                            RIGHT CART
                        ================================================== */}

                        <div
                            className="
                                cart-panel
                                rounded-2xl
                                p-4
                                sm:p-6
                                border
                                border-white/[.07]
                                order-section
                                min-w-0
                            "
                            style={{
                                background:
                                    "#111",
                                animationDelay:
                                    ".15s",
                            }}
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                    mb-5
                                "
                            >
                                <h3
                                    className="
                                        text-lg
                                        font-bold
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <ShoppingCart
                                        size={17}
                                        className="text-yellow-500"
                                    />

                                    Your Cart
                                </h3>

                                {totalItems > 0 && (
                                    <span
                                        className="
                                            text-xs
                                            px-3
                                            py-1
                                            rounded-full
                                            text-yellow-600
                                            flex-shrink-0
                                        "
                                        style={{
                                            background:
                                                "rgba(234,179,8,.1)",
                                            border:
                                                "1px solid rgba(234,179,8,.2)",
                                        }}
                                    >
                                        {totalItems}{" "}
                                        item
                                        {totalItems !==
                                        1
                                            ? "s"
                                            : ""}
                                    </span>
                                )}
                            </div>

                            {/* EMPTY */}

                            {cart.length === 0 ? (
                                <div
                                    className="
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                        py-10
                                        rounded-xl
                                        text-center
                                        mb-5
                                    "
                                    style={{
                                        border:
                                            "1px dashed rgba(255,255,255,.07)",
                                    }}
                                >
                                    <ShoppingCart
                                        size={26}
                                        className="text-gray-800 mb-3"
                                    />

                                    <p className="text-gray-700 text-sm">
                                        Cart is empty
                                    </p>

                                    <p className="text-gray-800 text-xs mt-1">
                                        Add items from
                                        the menu
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 mb-4">
                                    {cart.map(
                                        (
                                            item,
                                            index
                                        ) => (
                                            <div
                                                key={`${item.name}-${item.size}-${index}`}
                                                className="
                                                    cart-row
                                                    flex
                                                    items-center
                                                    gap-2
                                                    sm:gap-3
                                                    p-3
                                                    rounded-xl
                                                "
                                                style={{
                                                    border:
                                                        "1px solid rgba(255,255,255,.05)",
                                                }}
                                            >
                                                {item.image ? (
                                                    <img
                                                        src={
                                                            item.image
                                                        }
                                                        alt={
                                                            item.name
                                                        }
                                                        className="
                                                            w-11
                                                            h-11
                                                            rounded-xl
                                                            object-cover
                                                            flex-shrink-0
                                                        "
                                                    />
                                                ) : (
                                                    <div
                                                        className="
                                                            w-11
                                                            h-11
                                                            rounded-xl
                                                            flex-shrink-0
                                                        "
                                                        style={{
                                                            background:
                                                                "#0d0d0d",
                                                        }}
                                                    />
                                                )}

                                                <div
                                                    className="
                                                        cart-product
                                                        flex-1
                                                        min-w-0
                                                    "
                                                >
                                                    <p
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            truncate
                                                        "
                                                    >
                                                        {
                                                            item.name
                                                        }
                                                    </p>

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            gap-1.5
                                                            mt-1
                                                        "
                                                    >
                                                        <span
                                                            className="
                                                                text-[10px]
                                                                px-2
                                                                py-0.5
                                                                rounded-full
                                                                bg-yellow-500/10
                                                                text-yellow-500
                                                            "
                                                        >
                                                            {item.size ===
                                                            "half"
                                                                ? "Half"
                                                                : "Full"}
                                                        </span>

                                                        <span
                                                            className="
                                                                text-[10px]
                                                                px-2
                                                                py-0.5
                                                                rounded-full
                                                                bg-white/5
                                                                text-gray-500
                                                            "
                                                        >
                                                            ₹
                                                            {
                                                                item.unitPrice
                                                            }
                                                        </span>

                                                        <span
                                                            className="
                                                                text-[10px]
                                                                px-2
                                                                py-0.5
                                                                rounded-full
                                                                bg-white/5
                                                                text-gray-500
                                                            "
                                                        >
                                                            {
                                                                item.category
                                                            }
                                                        </span>
                                                    </div>

                                                    <p
                                                        className="
                                                            text-yellow-500
                                                            text-sm
                                                            font-bold
                                                            mt-1
                                                        "
                                                    >
                                                        ₹
                                                        {getCartItemTotal(
                                                            item
                                                        )}
                                                    </p>
                                                </div>

                                                {/* CONTROLS */}

                                                <div
                                                    className="
                                                        cart-controls
                                                        flex
                                                        items-center
                                                        gap-1
                                                        flex-shrink-0
                                                    "
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateCartQty(
                                                                item.name,
                                                                item.size,
                                                                -1
                                                            )
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-gray-400
                                                            hover:text-white
                                                        "
                                                        style={{
                                                            background:
                                                                "rgba(255,255,255,.06)",
                                                        }}
                                                    >
                                                        <Minus
                                                            size={
                                                                11
                                                            }
                                                        />
                                                    </button>

                                                    <span
                                                        className="
                                                            text-sm
                                                            font-bold
                                                            w-5
                                                            text-center
                                                        "
                                                    >
                                                        {
                                                            item.qty
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateCartQty(
                                                                item.name,
                                                                item.size,
                                                                1
                                                            )
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                        "
                                                        style={{
                                                            background:
                                                                "rgba(234,179,8,.15)",
                                                            color:
                                                                "#eab308",
                                                        }}
                                                    >
                                                        <Plus
                                                            size={
                                                                11
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            removeItem(
                                                                item.name,
                                                                item.size
                                                            )
                                                        }
                                                        className="
                                                            w-7
                                                            h-7
                                                            rounded-full
                                                            flex
                                                            items-center
                                                            justify-center
                                                            ml-0.5
                                                        "
                                                        style={{
                                                            background:
                                                                "rgba(239,68,68,.08)",
                                                            color:
                                                                "#ef4444",
                                                        }}
                                                    >
                                                        <Trash2
                                                            size={
                                                                11
                                                            }
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* TOTAL */}

                            {cart.length > 0 && (
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        gap-3
                                        px-4
                                        py-3.5
                                        rounded-xl
                                        mb-6
                                    "
                                    style={{
                                        background:
                                            "rgba(234,179,8,.05)",
                                        border:
                                            "1px solid rgba(234,179,8,.15)",
                                    }}
                                >
                                    <span className="text-gray-500 text-sm">
                                        Grand Total
                                    </span>

                                    <span className="text-2xl font-extrabold text-yellow-500">
                                        ₹{total}
                                    </span>
                                </div>
                            )}

                            <div
                                className="mb-6"
                                style={{
                                    borderTop:
                                        "1px solid rgba(255,255,255,.05)",
                                }}
                            />

                            {/* =================================================
                                DELIVERY DETAILS
                            ================================================== */}

                            <h2 className="text-lg font-bold mb-5">
                                Delivery Details
                            </h2>

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="space-y-3"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        required
                                        value={
                                            customerName
                                        }
                                        onChange={(e) =>
                                            setCustomerName(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Full Name"
                                        className="
                                            px-4
                                            py-3
                                            text-sm
                                            rounded-xl
                                            w-full
                                        "
                                        style={{
                                            background:
                                                "#0d0d0d",
                                            border:
                                                "1px solid rgba(255,255,255,.07)",
                                            color:
                                                "white",
                                        }}
                                    />

                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Phone Number"
                                        className="
                                            px-4
                                            py-3
                                            text-sm
                                            rounded-xl
                                            w-full
                                        "
                                        style={{
                                            background:
                                                "#0d0d0d",
                                            border:
                                                "1px solid rgba(255,255,255,.07)",
                                            color:
                                                "white",
                                        }}
                                    />
                                </div>

                                <textarea
                                    required
                                    rows="3"
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Full Delivery Address"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        text-sm
                                        rounded-xl
                                        resize-none
                                    "
                                    style={{
                                        background:
                                            "#0d0d0d",
                                        border:
                                            "1px solid rgba(255,255,255,.07)",
                                        color:
                                            "white",
                                    }}
                                />

                                <input
                                    type="text"
                                    value={landmark}
                                    onChange={(e) =>
                                        setLandmark(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Nearby Landmark (optional)"
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        text-sm
                                        rounded-xl
                                    "
                                    style={{
                                        background:
                                            "#0d0d0d",
                                        border:
                                            "1px solid rgba(255,255,255,.07)",
                                        color:
                                            "white",
                                    }}
                                />

                                {/* PAYMENT */}

                                <select
                                    value={payment}
                                    onChange={(e) =>
                                        setPayment(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        w-full
                                        px-4
                                        py-3
                                        text-sm
                                        rounded-xl
                                    "
                                    style={{
                                        background:
                                            "#0d0d0d",
                                        border:
                                            "1px solid rgba(255,255,255,.07)",
                                        color:
                                            "white",
                                    }}
                                >
                                    <option>
                                        Cash On Delivery
                                    </option>

                                    <option>
                                        UPI Payment
                                    </option>
                                </select>

                                {/* =================================================
                                    UPI
                                ================================================== */}

                                {payment ===
                                    "UPI Payment" && (
                                    <div
                                        className="
                                            rounded-xl
                                            p-4
                                            sm:p-5
                                            space-y-4
                                        "
                                        style={{
                                            background:
                                                "#0d0d0d",
                                            border:
                                                "1px solid rgba(255,255,255,.07)",
                                        }}
                                    >
                                        <p className="text-sm font-bold">
                                            Pay Via UPI
                                        </p>

                                        <div
                                            className="
                                                payment-grid
                                                grid
                                                grid-cols-3
                                                gap-2
                                            "
                                        >
                                            {[
                                                "Google Pay",
                                                "PhonePe",
                                                "Paytm",
                                            ].map(
                                                (
                                                    app
                                                ) => (
                                                    <button
                                                        type="button"
                                                        key={
                                                            app
                                                        }
                                                        onClick={() =>
                                                            setSelectedUPI(
                                                                app
                                                            )
                                                        }
                                                        className="
                                                            py-2.5
                                                            rounded-xl
                                                            text-xs
                                                            font-semibold
                                                            min-w-0
                                                        "
                                                        style={{
                                                            border:
                                                                selectedUPI ===
                                                                app
                                                                    ? "1px solid #eab308"
                                                                    : "1px solid rgba(255,255,255,.08)",
                                                            background:
                                                                selectedUPI ===
                                                                app
                                                                    ? "rgba(234,179,8,.08)"
                                                                    : "transparent",
                                                            color:
                                                                selectedUPI ===
                                                                app
                                                                    ? "#eab308"
                                                                    : "#9ca3af",
                                                        }}
                                                    >
                                                        {app ===
                                                        "Google Pay"
                                                            ? "GPay"
                                                            : app}
                                                    </button>
                                                )
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <img
                                                src="/qr.png"
                                                alt="QR Code"
                                                className="
                                                    w-40
                                                    h-40
                                                    sm:w-44
                                                    sm:h-44
                                                    object-cover
                                                    rounded-2xl
                                                    mx-auto
                                                "
                                            />

                                            <p className="text-gray-600 text-xs mt-2">
                                                Scan using
                                                any UPI
                                                app
                                            </p>
                                        </div>

                                        <div
                                            className="
                                                text-center
                                                py-3
                                                rounded-xl
                                            "
                                            style={{
                                                background:
                                                    "rgba(234,179,8,.05)",
                                                border:
                                                    "1px solid rgba(234,179,8,.15)",
                                            }}
                                        >
                                            <p className="text-gray-600 text-xs">
                                                UPI ID
                                            </p>

                                            <p className="text-yellow-500 font-bold text-sm mt-0.5 break-all">
                                                gunnuchinese@upi
                                            </p>
                                        </div>

                                        <input
                                            type="text"
                                            required
                                            value={
                                                transactionId
                                            }
                                            onChange={(e) =>
                                                setTransactionId(
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter UPI Transaction ID"
                                            className="
                                                w-full
                                                px-4
                                                py-3
                                                text-sm
                                                rounded-xl
                                            "
                                            style={{
                                                background:
                                                    "#111",
                                                border:
                                                    "1px solid rgba(255,255,255,.07)",
                                                color:
                                                    "white",
                                            }}
                                        />

                                        <div>
                                            <label
                                                className="
                                                    text-xs
                                                    text-gray-600
                                                    block
                                                    mb-1.5
                                                "
                                            >
                                                Payment
                                                Screenshot
                                            </label>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setPaymentScreenshot(
                                                        e
                                                            .target
                                                            .files?.[0] ||
                                                        null
                                                    )
                                                }
                                                className="
                                                    w-full
                                                    px-4
                                                    py-3
                                                    text-sm
                                                    rounded-xl
                                                    text-gray-500
                                                "
                                                style={{
                                                    background:
                                                        "#111",
                                                    border:
                                                        "1px solid rgba(255,255,255,.07)",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* CONFIRM */}

                                <button
                                    type="submit"
                                    className="
                                        add-btn
                                        w-full
                                        py-4
                                        rounded-xl
                                        text-sm
                                        font-bold
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        mt-2
                                    "
                                    style={{
                                        background:
                                            "linear-gradient(135deg,#991b1b 0%,#d97706 100%)",
                                        color:
                                            "white",
                                    }}
                                >
                                    Confirm Order

                                    {cart.length > 0 &&
                                        ` · ₹${total}`}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* =============================================================
                CONFIRMATION MODAL
            ============================================================== */}

            {showModal && (
                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        px-3
                        sm:px-4
                        py-4
                    "
                    style={{
                        background:
                            "rgba(0,0,0,.88)",
                        backdropFilter:
                            "blur(12px)",
                    }}
                >
                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            p-5
                            sm:p-8
                            text-center
                            max-h-[90vh]
                            overflow-y-auto
                        "
                        style={{
                            background:
                                "#111",
                            border:
                                "1px solid rgba(234,179,8,.15)",
                            animation:
                                "popIn .3s cubic-bezier(.22,1,.36,1) both",
                        }}
                    >
                        <div
                            className="
                                w-14
                                h-14
                                sm:w-16
                                sm:h-16
                                mx-auto
                                rounded-full
                                flex
                                items-center
                                justify-center
                                mb-5
                            "
                            style={{
                                background:
                                    "linear-gradient(135deg,#16a34a,#15803d)",
                            }}
                        >
                            <Check
                                className="text-white"
                                size={30}
                                strokeWidth={3}
                            />
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-extrabold">
                            <span className="gold-text">
                                Thank You ✨
                            </span>
                        </h2>

                        <p className="text-yellow-600 text-sm mt-2 font-medium">
                            Your order is ready
                            to confirm
                        </p>

                        {/* ORDER SUMMARY */}

                        <div
                            className="
                                mt-5
                                rounded-xl
                                p-4
                                text-left
                                space-y-3
                            "
                            style={{
                                background:
                                    "#0d0d0d",
                                border:
                                    "1px solid rgba(255,255,255,.06)",
                            }}
                        >
                            {cart.map(
                                (
                                    item,
                                    index
                                ) => (
                                    <div
                                        key={`${item.name}-${item.size}-${index}`}
                                        className="
                                            border-b
                                            border-white/5
                                            pb-3
                                            last:border-0
                                            last:pb-0
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                justify-between
                                                gap-3
                                            "
                                        >
                                            <div className="min-w-0">
                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-300
                                                        font-medium
                                                        truncate
                                                    "
                                                >
                                                    {
                                                        item.name
                                                    }
                                                </p>

                                                <p className="text-[10px] text-gray-600 mt-1">
                                                    Category:{" "}
                                                    {
                                                        item.category
                                                    }
                                                </p>

                                                <p className="text-[10px] text-gray-600 mt-1">
                                                    {item.size ===
                                                    "half"
                                                        ? "Half"
                                                        : "Full"}{" "}
                                                    ×{" "}
                                                    {
                                                        item.qty
                                                    }{" "}
                                                    @ ₹
                                                    {
                                                        item.unitPrice
                                                    }
                                                </p>
                                            </div>

                                            <span
                                                className="
                                                    text-white
                                                    font-medium
                                                    text-sm
                                                    flex-shrink-0
                                                "
                                            >
                                                ₹
                                                {getCartItemTotal(
                                                    item
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                )
                            )}

                            <div
                                className="
                                    flex
                                    justify-between
                                    text-sm
                                    font-bold
                                    pt-2
                                "
                                style={{
                                    borderTop:
                                        "1px solid rgba(255,255,255,.06)",
                                }}
                            >
                                <span className="text-gray-400">
                                    Total
                                </span>

                                <span className="text-yellow-500">
                                    ₹{total}
                                </span>
                            </div>
                        </div>

                        <p className="text-gray-500 text-xs sm:text-sm mt-5 leading-relaxed">
                            {payment ===
                            "Cash On Delivery"
                                ? (
                                      <>
                                          Click{" "}
                                          <strong className="text-white">
                                              OK
                                          </strong>{" "}
                                          — WhatsApp
                                          will open
                                          to confirm
                                          your order.
                                          We'll start
                                          preparing
                                          right away! 🍜
                                      </>
                                  )
                                : (
                                      <>
                                          Click{" "}
                                          <strong className="text-white">
                                              OK
                                          </strong>{" "}
                                          to open
                                          WhatsApp.
                                          Share your
                                          payment
                                          screenshot
                                          there for
                                          verification.
                                          🍜
                                      </>
                                  )}
                        </p>

                        <div
                            className="
                                modal-buttons
                                flex
                                gap-3
                                mt-6
                            "
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    setShowModal(
                                        false
                                    )
                                }
                                className="
                                    flex-1
                                    py-3
                                    rounded-xl
                                    text-sm
                                "
                                style={{
                                    border:
                                        "1px solid rgba(255,255,255,.08)",
                                    color:
                                        "white",
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    confirmOrder
                                }
                                className="
                                    add-btn
                                    flex-1
                                    py-3
                                    rounded-xl
                                    text-sm
                                    font-bold
                                "
                                style={{
                                    background:
                                        "linear-gradient(135deg,#991b1b,#d97706)",
                                    color:
                                        "white",
                                }}
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