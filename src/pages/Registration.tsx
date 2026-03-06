import { useState, ChangeEvent, FormEvent } from "react";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { registrationAPI } from "../services/apiService"; // Adjusted to use your vetted service
import type { RegistrationData } from "../types/registration";

// Extend window for Paystack script
declare const PaystackPop: any;

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
      // 1. Save data to Node.js backend (Status: Pending)
      const regResult = await registrationAPI.register(formData);

      // 2. Initialize Payment to get access_code from Paystack via backend
      const payResult = await registrationAPI.initializePayment(regResult.attendee.id);

      // 3. Trigger Paystack Popup
      if (typeof PaystackPop !== "undefined") {
        const handler = PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // Use your env variable
          email: formData.email,
          amount: Math.round(totalAmount * 100), // Kobo (205000)
          access_code: payResult.accessCode,
          onClose: () => {
            alert("Payment window closed. Please complete payment to secure your spot.");
            setIsSubmitting(false);
          },
          callback: (response: any) => {
            // 4. Success - Redirect to Success Page
            window.location.href = `/registration-success?ref=${response.reference}`;
          },
        });
        handler.openIframe();
      } else {
        throw new Error("Paystack library not loaded");
      }
    } catch (error: any) {
      console.error("Registration/Payment Error:", error);
      alert(error.message || "An error occurred. Please try again.");
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
    <div className="min-h-screen bg-gray-50">
      <Navbar onNavigate={scrollToSection} />

      <SectionHero
        tag="Register"
        title="Secure your Spot at Photizo'25"
        description="Join us for an inspiring experience of innovation, learning, and networking"
      />

      <main className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
            <div className="mb-8 text-center">
                          <h2 className="text-3xl font-bold text-gray-900 mb-8">Registration Form</h2>

              <p className="text-gray-600">
                  Please fill out all required information to secure your spot.
                </p>
            </div>

            <form onSubmit={handleRegistration} className="space-y-8">
              {/* Personal Info */}

              <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    required
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="+234..."
                  />
                </div>
              </div>
              </div>


              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Attendance Mode *</label>
                  <select required name="attendanceMode" value={formData.attendanceMode} onChange={handleInputChange} className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                    <option value="">Select Attendance Mode</option>
                    <option value="on-site">On Site</option>
                    <option value="online">Online</option>
                  </select>   
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breakout Session *</label>

                <select required name="breakoutSessionChoice" value={formData.breakoutSessionChoice} onChange={handleInputChange} className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                  <option value="">Select Breakout Session</option>
                  <option value="tech">Tech</option>
                  <option value="investment">Investment</option>
                  <option value="fashion">Fashion</option>
                </select>
                </div>
              </div>

              {/* Selections */}
              <div className="grid grid-cols-1 gap-6">
               
      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us? *</label>
                  <select required name="referralSource" value={formData.referralSource} onChange={handleInputChange} className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700">
                  <option value="">How did you hear about us?</option>
                  <option value="church">Church</option>
                  <option value="instagram">Instagram</option>
                  <option value="recommendation_from_friend">Recommendation from a friend</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="facebook">Facebook</option>
                  <option value="flyer">Flyer</option>
                </select>

                </div>
                
              </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expectations (Optional)</label>

              <textarea
                name="expectations"
                value={formData.expectations}
                onChange={handleInputChange}
                placeholder="Expectations (Optional)"
                className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                rows={3}
              />
              </div>

              {/* Summary Box with 2.5% Charges */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Registration Fee</span>
                  <span>₦{BASE_FEE.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Processing Fee (2.5%)</span>
                  <span>₦{processingFee.toLocaleString()}</span>
                </div>
                <div className="border-t border-blue-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">₦{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg text-white font-bold flex items-center justify-center transition-all ${
                  isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 shadow-lg"
                }`}
              >
                {isSubmitting ? "Processing..." : "Register & Pay Now"}
                {!isSubmitting && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}