import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { merchandiseItems } from "../data/merchandise";
import { merchandiseAPI } from "../services/apiService";

// Define the charge percentage for transparency
const CHARGE_PERCENTAGE = 0.025; // 2.5%

declare const PaystackPop: any;

export default function MerchandiseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Unified Form State ---
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    color: "",
    size: "",
    quantity: 1,
  });

  // --- UI States ---
  const [merchandiseItem, setMerchandiseItem] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Load Item Data ---
  useEffect(() => {
    const item = merchandiseItems.find((p) => p.id === id);
    if (item) {
      setMerchandiseItem(item);
      setSelectedColor(item.colors[0]);
      
      // Initialize form with default selections
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        color: item.colors[0].name,
        size: item.sizes[0],
        quantity: 1
      });
    } else {
      navigate("/merchandise");
    }
  }, [id, navigate]);

  // --- Handlers ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Math.max(1, parseInt(value) || 1) : value,
    }));
  };

  const handleColorSelect = (color: any) => {
    setSelectedColor(color);
    setFormData((prev) => ({ ...prev, color: color.name }));
  };

  // --- Pricing Calculation ---
  const unitPrice = merchandiseItem
    ? parseFloat(merchandiseItem.price.replace(/[^0-9.-]+/g, ""))
    : 0;
  const subtotal = unitPrice * formData.quantity;
  const charges = subtotal * CHARGE_PERCENTAGE;
  const totalAmount = subtotal + charges;

  const handleBuyNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const payload = {
        ...formData,
        merchandiseId: merchandiseItem.id,
        totalAmount,
      };

      // 1. Persist Order to Node.js backend
      const result = await merchandiseAPI.createOrder(payload);

      // 2. Open Paystack Popup
      if (typeof PaystackPop !== "undefined") {
        const handler = PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email: formData.email,
          amount: Math.round(totalAmount * 100), // Kobo
          access_code: result.accessCode,
          callback: (response: any) => {
            navigate(`/registration-success?ref=${response.reference}&type=merch`);
          },
          onClose: () => setIsProcessing(false),
        });
        handler.openIframe();
      } else {
        throw new Error("Paystack not loaded");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("Could not process order. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!merchandiseItem || !selectedColor) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={() => {}} />
      <main className="max-w-7xl mx-auto py-20 px-4 pt-32">
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2 text-gray-500">
            <li><Link to="/merchandise" className="hover:text-brand-red">Merchandise</Link></li>
            <li>/</li>
            <li className="text-gray-900 font-medium">{merchandiseItem.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <img
              src={selectedColor.image}
              className="w-full rounded-2xl shadow-lg transition-all duration-300"
              alt={merchandiseItem.name}
            />
            <div className="flex gap-2">
              {merchandiseItem.colors.map((c: any) => (
                <img
                  key={c.name}
                  src={c.image}
                  onClick={() => handleColorSelect(c)}
                  className={`w-20 h-20 rounded-lg cursor-pointer border-2 transition-all ${
                    selectedColor.name === c.name ? "border-brand-red scale-105" : "border-transparent opacity-70"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Details & Form */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">{merchandiseItem.name}</h1>
            <p className="text-2xl text-brand-red font-bold">₦{unitPrice.toLocaleString()}</p>

            <form onSubmit={handleBuyNow} className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <input
                required
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-700"
              />
              <input
                required
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-700"
              />
              <input
                required
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-700"
              />

              <div className="flex gap-4">
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-700"
                >
                  {merchandiseItem.sizes.map((s: string) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-24 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-red outline-none text-gray-700"
                />
              </div>

              {/* Self-Setting Color Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Selected Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  readOnly
                  className="w-full p-3 border rounded-lg bg-gray-50 cursor-not-allowed font-semibold text-brand-red"
                />
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Charges (2.5%)</span>
                  <span>₦{charges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                disabled={isProcessing}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  isProcessing ? "bg-gray-400" : "bg-brand-red/90 hover:bg-brand-red shadow-lg"
                }`}
              >
                {isProcessing ? "Initializing Payment..." : "Pay with Paystack"}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}