import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OrderHeader from "../components/order/OrderHeader";
import MenuItemCard from "../components/order/MenuItemCard";
import Suggestions from "../components/order/Suggestions";
import CartPanel from "../components/order/CartPanel";
import DeliveryForm from "../components/order/DeliveryForm";
import OrderConfirmationModal from "../components/order/OrderConfirmationModal";
import "./Order.css";

function Order() {
    const navigate = useNavigate();
    const location = useLocation();
    const preSelectedItem = location.state?.selectedMenuItem || null;
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
    const [payment, setPayment] = useState("Cash On Delivery");
    const [selectedUPI, setSelectedUPI] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const getFullPrice = (item) => {
        if (!item?.price) return 0;
        return typeof item.price === "object" ? Number(item.price.full || 0) : Number(item.price || 0);
    };
    const getHalfPrice = (item) => {
        if (!item?.price || typeof item.price !== "object" || item.price.half === undefined || item.price.half === null || item.price.half === "") return null;
        const price = Number(item.price.half);
        return Number.isFinite(price) ? price : null;
    };
    const hasHalfPrice = (item) => getHalfPrice(item) !== null;
    const getPriceBySize = (item, size) => size === "half" && hasHalfPrice(item) ? getHalfPrice(item) : getFullPrice(item);
    const filterByFoodType = (items, type) => items.filter((item) => {
        const itemType = String(item?.type || "").toLowerCase();
        return type === "Veg" ? itemType.includes("veg") && !itemType.includes("non") : itemType.includes("non");
    });

    const fetchMenu = async () => {
        try {
            const response = await axios.get("https://gunnu-dashboard.onrender.com/api/menu");
            const items = Array.isArray(response.data) ? response.data : [];
            setMenuItems(items);
            const initialType = preSelectedItem && String(preSelectedItem.type || "").toLowerCase().includes("non") ? "Non Veg" : "Veg";
            const filtered = filterByFoodType(items, initialType);
            setFoodType(initialType); setFilteredItems(filtered);
            const match = preSelectedItem && filtered.find((item) => item.name === preSelectedItem.name);
            setSelectedItem(match?.name || filtered[0]?.name || "");
        } catch (error) {
            console.error("Failed to fetch menu:", error);
        } finally { setLoading(false); }
    };
    // Menu loading is an external data synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchMenu(); }, []);

    const currentItem = useMemo(() => filteredItems.find((item) => item.name === selectedItem) || null, [filteredItems, selectedItem]);
    const handleTypeChange = (type) => { const filtered = filterByFoodType(menuItems, type); setFoodType(type); setFilteredItems(filtered); setSelectedItem(filtered[0]?.name || ""); setSelectedSize("full"); setQty(1); };
    const handleItemChange = (name) => { setSelectedItem(name); setSelectedSize("full"); setQty(1); };
    const handleSizeChange = (size) => { if (!currentItem) return; setSelectedSize(size === "half" && !hasHalfPrice(currentItem) ? "full" : size); };
    const increaseQty = () => setQty((previous) => previous + 1);
    const decreaseQty = () => setQty((previous) => previous > 1 ? previous - 1 : 1);
    const addToCart = (item = currentItem, quantity = qty, size = selectedSize) => {
        if (!item) return;
        const finalSize = size === "half" && !hasHalfPrice(item) ? "full" : size;
        const unitPrice = getPriceBySize(item, finalSize);
        if (!unitPrice || quantity <= 0) return;
        const category = item.category || item.categoryName || "General";
        setCart((previous) => {
            const existingIndex = previous.findIndex((cartItem) => cartItem.name === item.name && cartItem.size === finalSize);
            if (existingIndex !== -1) return previous.map((cartItem, index) => index === existingIndex ? { ...cartItem, qty: Number(cartItem.qty) + Number(quantity) } : cartItem);
            return [...previous, { id: `${item._id || item.id || item.name}-${finalSize}`, name: item.name, image: item.image || "", description: item.description || "", category, foodType: item.type || foodType, size: finalSize, unitPrice, qty: Number(quantity) }];
        });
        setQty(1); setAddedFlash(true); setTimeout(() => setAddedFlash(false), 700);
    };
    const updateCartQty = (itemName, size, delta) => setCart((previous) => previous.map((item) => item.name === itemName && item.size === size ? { ...item, qty: Number(item.qty) + Number(delta) } : item).filter((item) => Number(item.qty) > 0));
    const removeItem = (itemName, size) => setCart((previous) => previous.filter((item) => !(item.name === itemName && item.size === size)));
    const getCartItemTotal = (item) => Number(item.unitPrice || 0) * Number(item.qty || 0);
    const total = cart.reduce((sum, item) => sum + getCartItemTotal(item), 0);
    const totalItems = cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    const suggestedItems = filteredItems.filter((item) => item.name !== selectedItem).slice(0, 3);
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!cart.length) return alert("Please add at least one item to your cart.");
        if (!customerName.trim()) return alert("Please enter your name.");
        if (!phone.trim()) return alert("Please enter your phone number.");
        if (!address.trim()) return alert("Please enter your delivery address.");
        if (payment === "UPI Payment" && !transactionId.trim()) return alert("Please enter UPI transaction ID.");
        setShowModal(true);
    };
    const confirmOrder = () => {
        const orderItems = cart.map((item, index) => `${index + 1}. ${item.name}\nCategory: ${item.category || "General"}\nType: ${item.foodType || ""}\nSize: ${item.size === "half" ? "Half" : "Full"}\nQty: ${item.qty}\nUnit Price: ₹${item.unitPrice}\nItem Total: ₹${getCartItemTotal(item)}`).join("\n\n");
        const message = `*NEW ORDER - Gunnu Chinese Corner*\n\n*CUSTOMER DETAILS*\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\nLandmark: ${landmark.trim() || "Not provided"}\n\n*ORDER ITEMS*\n\n${orderItems}\n\n*ORDER SUMMARY*\nTotal Items: ${totalItems}\nGrand Total: ₹${total}\n\n*PAYMENT DETAILS*\nPayment Mode: ${payment}${payment === "UPI Payment" ? `\nUPI App: ${selectedUPI || "Not selected"}\nTransaction ID: ${transactionId}\n` : ""}`;
        window.open(`https://wa.me/919839621748?text=${encodeURIComponent(message)}`, "_blank");
        setShowModal(false);
    };

    return <><Navbar /><section className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-16 px-3 sm:px-5 md:px-8"><div className="max-w-6xl mx-auto"><OrderHeader onBack={() => navigate(-1)} /><div className="order-main-grid grid lg:grid-cols-2 gap-5 lg:gap-6 items-start"><div className="space-y-4 order-section min-w-0"><MenuItemCard {...{ currentItem, loading, foodType, selectedItem, filteredItems, selectedSize, qty, addedFlash, getFullPrice, getHalfPrice, hasHalfPrice, getPriceBySize, handleTypeChange, handleItemChange, handleSizeChange, increaseQty, decreaseQty, addToCart }} /><Suggestions items={suggestedItems} getFullPrice={getFullPrice} onAdd={addToCart} loading={loading} /></div><CartPanel cart={cart} total={total} totalItems={totalItems} getCartItemTotal={getCartItemTotal} updateCartQty={updateCartQty} removeItem={removeItem}><DeliveryForm {...{ customerName, phone, address, landmark, payment, selectedUPI, transactionId, paymentScreenshot, cart, total, handleSubmit, setCustomerName, setPhone, setAddress, setLandmark, setPayment, setSelectedUPI, setTransactionId, setPaymentScreenshot }} /></CartPanel></div></div></section><OrderConfirmationModal show={showModal} cart={cart} total={total} payment={payment} getCartItemTotal={getCartItemTotal} onCancel={() => setShowModal(false)} onConfirm={confirmOrder} /><Footer /></>;
}

export default Order;

