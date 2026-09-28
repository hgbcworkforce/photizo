import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { merchandiseItems } from "../data/merchandise";
import { merchandiseAPI } from "../services/apiService";

// Define the charge percentage for transparency
const CHARGE_PERCENTAGE = 0.025; // 2.5%

// Paystack v2 Type Definitions
interface PaystackResponse {
  reference: string;
  status?: string;
  message?: string;
  transaction?: {
    reference?: string;
    status?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  access_code: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackPopInstance {
  openIframe: () => void;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: PaystackConfig) => PaystackPopInstance;
      buildCheckoutUrl: (options: any) => string;
    };
  }
}

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
      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phoneNumber) {
        throw new Error("Please fill in all required fields");
      }

      const payload = {
        ...formData,
        merchandiseId: merchandiseItem.id,
        totalAmount,
      };

      // 1. Persist Order to Node.js backend
      const result = await merchandiseAPI.createOrder(payload);

      // 2. Open Paystack Popup using v2 API
      if (typeof window !== "undefined" && window.PaystackPop) {
        try {
          const handler = window.PaystackPop.setup({
            key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
            email: formData.email,
            amount: Math.round(totalAmount * 100), // Convert to kobo
            access_code: result.accessCode,
            callback: (response: PaystackResponse) => {
              const paymentRef = response.reference || response.transaction?.reference;
              if (paymentRef) {
                navigate(`/merchandise-success?reference=${encodeURIComponent(paymentRef)}`);
              } else {
                navigate('/merchandise-success');
              }
            },
            onClose: () => {
              console.warn("Payment popup closed");
              setIsProcessing(false);
            },
          });
          
          handler.openIframe();
        } catch (paystackError) {
          console.error("Paystack initialization error:", paystackError);
          throw new Error("Failed to initialize payment. Please try again.");
        }
      } else {
        throw new Error("Payment service (Paystack) is not loaded. Please refresh the page and try again.");
      }
    } catch (error) {
      console.error("Order failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not process order. Please try again.";
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  if (!merchandiseItem || !selectedColor) return null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar onNavigate={() => {}} />
      <main className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 pt-36">
        <nav className="text-sm mb-10">
          <ol className="flex items-center space-x-2.5 text-gray-500 font-medium">
            <li><Link to="/merchandise" className="hover:text-brand-red transition-colors">Merchandise</Link></li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-900 font-bold">{merchandiseItem.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Image Gallery */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center aspect-square">
              <img
                src={selectedColor.image}
                className="max-h-[400px] w-auto object-contain rounded-2xl transition-all duration-300 hover:scale-105"
                alt={merchandiseItem.name}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {merchandiseItem.colors.map((c: any) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleColorSelect(c)}
                  className={`w-20 h-20 rounded-2xl p-2 bg-white border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                    selectedColor.name === c.name ? "border-brand-orange scale-105 shadow-md ring-2 ring-brand-orange/20" : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details & Form */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">{merchandiseItem.name}</h1>
              <p className="text-3xl text-brand-red font-black mt-2">₦{unitPrice.toLocaleString()}</p>
            </div>

            <form onSubmit={handleBuyNow} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-md space-y-4">
              <div>
                <input
                  required
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-800 text-sm font-medium transition-all"
                />
              </div>
              <div>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-800 text-sm font-medium transition-all"
                />
              </div>
              <div>
                <input
                  required
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-800 text-sm font-medium transition-all"
                />
              </div>

              <div className="flex gap-4">
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-800 text-sm font-medium bg-white transition-all"
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
                  className="w-28 px-4 py-3.5 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange outline-none text-gray-800 text-sm font-medium transition-all"
                />
              </div>

              {/* Self-Setting Color Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Selected Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  readOnly
                  className="w-full px-4 py-3.5 border border-gray-200 rounded-2xl bg-gray-50 cursor-not-allowed font-bold text-brand-red text-sm"
                />
              </div>

              {/* Pricing Summary */}
              <div className="bg-gray-50 p-5 rounded-2xl space-y-2.5 border border-gray-100">
                <div className="flex justify-between text-gray-700 text-sm font-medium">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Charges (2.5%)</span>
                  <span>₦{charges.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-black text-lg text-gray-900 border-t border-gray-200/80 pt-3 mt-1">
                  <span>Total</span>
                  <span className="text-brand-red">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className={`w-full py-4 rounded-2xl font-bold text-xs text-white uppercase tracking-wider transition-all shadow-md ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg hover:shadow-brand-red/25 cursor-pointer"
                }`}
              >
                {isProcessing ? "Initializing Payment..." : `Proceed to Payment (₦${totalAmount.toLocaleString()})`}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}