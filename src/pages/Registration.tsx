import React, { useState } from "react";
import { ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SectionHero from "../components/SectionHero";
import { registrationAPI } from "../services/apiService";

const REGISTRATION_TYPES = [
  {
    value: "student",
    label: "Student",
    price: 1000,
    description: "Full conference admission for students (₦1,000).",
  },
  {
    value: "professional",
    label: "Professional",
    price: 2000,
    description: "Full conference admission for working professionals (₦2,000).",
  },
];

const GENDER_OPTIONS = [
  { value: "", label: "Select Gender" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const AGE_RANGE_OPTIONS = [
  { value: "", label: "Select Age Range" },
  { value: "15-20", label: "15 - 20" },
  { value: "21-25", label: "21 - 25" },
  { value: "26-30", label: "26 - 30" },
  { value: "31-40", label: "31 - 40" },
  { value: "40+", label: "40+" },
];

const REFERRAL_OPTIONS = [
  { value: "", label: "Select Referral Source" },
  { value: "church", label: "Church" },
  { value: "instagram", label: "Instagram" },
  { value: "recommendation_from_friend", label: "Friend Recommendation" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "flyer", label: "Flyer / Banner" },
];

const BREAKOUT_OPTIONS = [
  { value: "", label: "Select Breakout Session" },
  { value: "Art", label: "Art & Entertainment" },
  { value: "Business", label: "Business & Entrepreneurship" },
  { value: "Education", label: "Education & Academics" },
  { value: "Family", label: "Family & Relationships" },
  { value: "Media", label: "Media & Communications" },
  { value: "Politics", label: "Politics & Governance" },
  { value: "Religion", label: "Religion & Ministry" },
];

const ATTENDANCE_MODES = [
  { value: "On-site", label: "On-site", description: "In-person at HGBC, Ogbomoso" },
  { value: "Online", label: "Online", description: "Live interactive streaming" },
];

export default function Registration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    ageRange: "",
    attendanceMode: "On-site",
    referralSource: "",
    breakoutSessionChoice: "",
    expectations: "",
    registrationType: "student",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTypeObj =
    REGISTRATION_TYPES.find((t) => t.value === formData.registrationType) ||
    REGISTRATION_TYPES[0];
  const currentPrice = selectedTypeObj.price;
  const paystackFee = currentPrice > 0 ? Math.round(currentPrice * 0.015 + 100) : 0;
  const chargedPrice = currentPrice + paystackFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.ageRange) newErrors.ageRange = "Age range is required";
    if (!formData.attendanceMode) newErrors.attendanceMode = "Please select how you want to attend";
    if (!formData.referralSource) newErrors.referralSource = "Please select how you heard about Photizo";
    if (!formData.breakoutSessionChoice) newErrors.breakoutSessionChoice = "Please select a breakout session";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        ...formData,
        phoneNumber: formData.phone,
        amount: chargedPrice,
        callbackUrl: `${window.location.origin}/registration-success`,
      };

      const result = await registrationAPI.initiate(payload);

      if (result.success && result.data) {
        if (result.data.authorizationUrl) {
          // Paid registration -> Redirect to Paystack Checkout
          sessionStorage.setItem("lastRegistration", JSON.stringify(result.data));
          window.location.href = result.data.authorizationUrl;
        } else {
          setIsSuccess(true);
          setRegistrationNumber(
            result.data.registration?.registrationNumber ||
            result.data.registrationNumber ||
            "PHOTIZO-2026-CONFIRMED"
          );
        }
      } else {
        setErrorMessage(result.message || "Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Registration initiation error:", err);
      const message =
        err?.response?.data?.message || err?.message || "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
    } finally {
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
        title="Secure your Spot at Photizo'26"
        description="Join us for an inspiring experience of innovation, learning, and networking"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isSuccess ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-base text-slate-600 mb-6">
              Welcome to Photizo Conference 2026. We look forward to having you!
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 inline-block text-left max-w-md w-full">
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Your Registration Number
              </p>
              <p className="text-2xl font-mono font-extrabold text-slate-900 mt-1">
                {registrationNumber}
              </p>
              <p className="text-xs text-slate-500 mt-2">
                A confirmation email has been dispatched to {formData.email}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between text-xs text-slate-600">
                <span>Attendance Mode:</span>
                <span className="font-bold text-slate-900">{formData.attendanceMode}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              Personal & Conference Details
            </h2>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Select Registration Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {REGISTRATION_TYPES.map((type) => {
                    const isSelected = formData.registrationType === type.value;
                    return (
                      <div
                        key={type.value}
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, registrationType: type.value }))
                        }
                        className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? "border-orange-600 bg-orange-50/50 shadow-sm"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-extrabold text-slate-900 text-base">
                                {type.label}
                              </span>
                              {type.value === "student" && (
                                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-full bg-orange-100 text-orange-700">
                                  Subsidized
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{type.description}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-orange-600 bg-orange-600" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-baseline justify-between">
                          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            Pass Fee
                          </span>
                          <span className="text-lg font-mono font-black text-slate-900">
                            ₦{type.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                    placeholder="e.g. John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                    placeholder="e.g. Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                    placeholder="+234 800 000 0000"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Gender and Age Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                  >
                    {GENDER_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Age Range *
                  </label>
                  <select
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                  >
                    {AGE_RANGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.ageRange && (
                    <p className="text-red-500 text-xs mt-1">{errors.ageRange}</p>
                  )}
                </div>
              </div>

              {/* Attendance Mode (On-site vs Online) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  How do you want to attend? *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ATTENDANCE_MODES.map((opt) => {
                    const isSelected = formData.attendanceMode === opt.value;
                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, attendanceMode: opt.value }));
                          if (errors.attendanceMode) {
                            setErrors((prev) => ({ ...prev, attendanceMode: "" }));
                          }
                        }}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "border-orange-600 bg-orange-50/50 shadow-xs"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                              isSelected ? "border-orange-600 bg-orange-600" : "border-slate-300"
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{opt.label}</span>
                            <p className="text-[11px] text-slate-500">{opt.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {errors.attendanceMode && (
                  <p className="text-red-500 text-xs mt-1">{errors.attendanceMode}</p>
                )}
              </div>

              {/* Referral Source & Breakout Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    How did you hear about Photizo? *
                  </label>
                  <select
                    name="referralSource"
                    value={formData.referralSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                  >
                    {REFERRAL_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.referralSource && (
                    <p className="text-red-500 text-xs mt-1">{errors.referralSource}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Breakout Session Choice *
                  </label>
                  <select
                    name="breakoutSessionChoice"
                    value={formData.breakoutSessionChoice}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                  >
                    {BREAKOUT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {errors.breakoutSessionChoice && (
                    <p className="text-red-500 text-xs mt-1">{errors.breakoutSessionChoice}</p>
                  )}
                </div>
              </div>

              {/* Expectations */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Expectations (Optional)
                </label>
                <textarea
                  name="expectations"
                  rows={3}
                  value={formData.expectations}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white"
                  placeholder="What do you hope to gain from Photizo 2026?"
                />
              </div>

              {/* Pricing & Fee Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>{selectedTypeObj.label} Admission Pass</span>
                  <span className="font-semibold text-slate-900 font-mono">
                    ₦{currentPrice.toLocaleString()}
                  </span>
                </div>
                {paystackFee > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Paystack Gateway Processing Fee</span>
                    <span className="font-mono">₦{paystackFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Payable</span>
                  <span className="font-mono text-base font-extrabold text-orange-600">
                    ₦{chargedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-brand-red to-brand-orange text-white font-bold py-3.5 px-8 rounded-xl transition-colors flex items-center justify-center space-x-2 text-base disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <span>Processing Registration...</span>
                  ) : (
                    <>
                      <span>Proceed to Payment (₦{chargedPrice.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <div className="mt-3 flex items-center justify-center space-x-1.5 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Secured by Paystack • Supports <strong>OPay</strong>, <strong>Cards</strong>,{" "}
                    <strong>Bank Transfer</strong> & <strong>USSD</strong>
                  </span>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}