import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { registrationAPI } from "../services/apiService";
import { getBackendVerifyUrl } from "../services/apiService";
import type { RegistrationData } from "../types/registration";

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

export default function Registration() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    attendanceMode: "",
    referralSource: "",
    breakoutSessionChoice: "",
    expectations: "",
  });

  // --- Pricing Logic ---
  const BASE_FEE = 2000;
  const CHARGE_PERCENTAGE = 0.025; // 2.5%
  const processingFee = BASE_FEE * CHARGE_PERCENTAGE;
  const totalAmount = BASE_FEE + processingFee;

  // --- Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Trim whitespace and transform values to match backend expectations
      const payload = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        attendanceMode: formData.attendanceMode === "physical" ? "physical" : "virtual",
        breakoutSessionChoice: formData.breakoutSessionChoice.charAt(0).toUpperCase() + formData.breakoutSessionChoice.slice(1),
        referralSource: formData.referralSource.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        expectations: formData.expectations || "No specific expectations",
      };

      // 1. Save data to Node.js backend (Status: Pending)
      const regResult = await registrationAPI.register(payload);

      // 2. Initialize Payment to get access_code from Paystack via backend
      const payResult = await registrationAPI.initializePayment(regResult.attendee.id);

      if (!payResult.accessCode) {
        throw new Error("Payment initialization failed: no access code received");
      }

      // 3. Trigger Paystack Popup using v2 API
      if (typeof window !== "undefined" && window.PaystackPop) {
        try {
          const handler = window.PaystackPop.setup({
            key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
            email: formData.email,
            amount: Math.round(totalAmount * 100), // Convert to kobo (205000)
            access_code: payResult.accessCode,
            onClose: () => {
              alert("Payment window closed. Please complete payment to secure your spot.");
              setIsSubmitting(false);
            },
            // 4. Handle successful payment - redirect to backend for verification
            callback: (response: PaystackResponse) => {
              window.location.href = getBackendVerifyUrl(response.reference);
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
    } catch (error: unknown) {
      console.error("Registration/Payment Error:", error);
      const message = error instanceof Error ? error.message : "An error occurred. Please try again.";
      alert(message);
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar onNavigate={scrollToSection} />

      <SectionHero
        tag="Register"
        title="Secure your Spot at Photizo'25"
        description="Join us for an inspiring experience of innovation, learning, and networking"
      />

      <main className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-xl border border-gray-100 p-8 sm:p-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Registration Form</h2>
              <p className="text-gray-500 text-sm sm:text-base font-normal">
                Please fill out all required information to secure your spot.
              </p>
            </div>  

            <form onSubmit={handleRegistration} className="space-y-8">
              {/* Personal Info */}
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-xs text-brand-orange mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">First Name *</label>
                    <input
                      required
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                      placeholder="First Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Last Name *</label>
                    <input
                      required
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                      placeholder="Last Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone *</label>
                    <input
                      required
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                      placeholder="+234..."
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Select Attendance Mode *</label>
                  <select 
                    required 
                    name="attendanceMode" 
                    value={formData.attendanceMode} 
                    onChange={handleInputChange} 
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                  >
                    <option value="">Select Attendance Mode</option>
                    <option value="physical">Physical (On Site)</option>
                    <option value="virtual">Virtual (Online)</option>
                  </select>   
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Breakout Session *</label>
                  <select 
                    required 
                    name="breakoutSessionChoice" 
                    value={formData.breakoutSessionChoice} 
                    onChange={handleInputChange} 
                    className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                  >
                    <option value="">Select Breakout Session</option>
                    <option value="art">Art</option>
                    <option value="business">Business</option>
                    <option value="education">Education</option>
                    <option value="family">Family</option>
                    <option value="media">Media</option>
                    <option value="politics">Politics</option>
                    <option value="religion">Religion</option>
                  </select>
                </div>
              </div>

              {/* Selections */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">How did you hear about us? *</label>
                <select 
                  required 
                  name="referralSource" 
                  value={formData.referralSource} 
                  onChange={handleInputChange} 
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium"
                >
                  <option value="">How did you hear about us?</option>
                  <option value="church">Church</option>
                  <option value="instagram">Instagram</option>
                  <option value="recommendation_from_friend">Recommendation from a friend</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="flyer">Flyer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Expectations (Optional)</label>
                <textarea
                  name="expectations"
                  value={formData.expectations}
                  onChange={handleInputChange}
                  placeholder="Expectations (Optional)"
                  className="block w-full px-4 py-3.5 border border-gray-200 rounded-2xl text-sm leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange text-gray-800 transition-all font-medium resize-none"
                  rows={3}
                />
              </div>

              {/* Summary Box */}
              <div className="bg-gradient-to-br from-brand-red/5 to-brand-orange/5 border border-brand-red/20 rounded-2xl p-6 space-y-3">
                <div className="flex justify-between text-gray-700 text-sm font-medium">
                  <span>Registration Fee</span>
                  <span>₦{BASE_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-500 text-xs">
                  <span>Processing Fee (2.5%)</span>
                  <span>₦{processingFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-brand-red/15 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-base">Total Amount</span>
                  <span className="text-2xl font-black text-brand-red">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-full text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-xl hover:shadow-brand-red/30 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-brand-red/20"
                }`}
              >
                {isSubmitting ? "Processing..." : "Register & Pay Now"}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}