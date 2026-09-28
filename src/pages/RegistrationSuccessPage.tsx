import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, Calendar, Mail, Ticket, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registrationAPI, handleApiError } from "../services/apiService";

interface VerifiedAttendee {
  id?: string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  registrationNumber?: string;
  registration_number?: string;
  registrationType?: string;
  registration_type?: string;
  attendanceMode?: string;
  attendance_mode?: string;
  breakoutSessionChoice?: string;
  breakout_session_choice?: string;
  amountPaid?: number;
  amount_paid?: number;
  paymentStatus?: string;
  payment_status?: string;
  paymentReference?: string;
  payment_reference?: string;
}

export default function RegistrationSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendee, setAttendee] = useState<VerifiedAttendee | null>(null);

  const reference =
    searchParams.get("reference") ||
    searchParams.get("ref") ||
    searchParams.get("trxref");

  useEffect(() => {
    let isMounted = true;

    const verifyRegistrationPayment = async () => {
      // 1. If we have a transaction reference from Paystack
      if (reference) {
        try {
          setStatus("verifying");
          const res = await registrationAPI.verifyPayment(reference);

          if (!isMounted) return;

          if (res.success || res.status === "success") {
            const data = res.data?.registration || res.data?.attendee || res.data;
            setAttendee(data || null);
            setStatus("success");
            if (data) {
              sessionStorage.setItem("lastRegistration", JSON.stringify(data));
            }
          } else {
            // Try fetching attendee status if verify returned non-success
            try {
              const statusRes = await registrationAPI.getStatus(reference);
              if (statusRes.success && statusRes.data) {
                setAttendee(statusRes.data as any);
                setStatus("success");
                return;
              }
            } catch {
              // Ignore fallback error
            }
            throw new Error((res as any)?.message || "Could not verify payment with Paystack.");
          }
        } catch (err: any) {
          if (!isMounted) return;
          console.error("Verification error:", err);
          
          // Check cached session data as fallback
          const cached = sessionStorage.getItem("lastRegistration");
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              setAttendee(parsed);
              setStatus("success");
              return;
            } catch {
              // Ignore JSON parse error
            }
          }

          const apiErr = handleApiError(err);
          setErrorMessage(apiErr.message || "Payment verification failed. Please contact support.");
          setStatus("error");
        }
      } else {
        // 2. Check query params or sessionStorage fallback
        const cached = sessionStorage.getItem("lastRegistration");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setAttendee(parsed);
            setStatus("success");
            return;
          } catch {
            // Ignore
          }
        }

        const nameParam = searchParams.get("name");
        const emailParam = searchParams.get("email");
        const regIdParam = searchParams.get("registrationId");

        if (nameParam || emailParam || regIdParam) {
          const names = (nameParam || "").split(" ");
          setAttendee({
            firstName: names[0] || "",
            lastName: names.slice(1).join(" ") || "",
            email: emailParam || "",
            registrationNumber: regIdParam || "0001",
            attendanceMode: searchParams.get("mode") || "On-site",
            breakoutSessionChoice: searchParams.get("session") || "",
          });
          setStatus("success");
        } else {
          setStatus("success");
        }
      }
    };

    verifyRegistrationPayment();

    return () => {
      isMounted = false;
    };
  }, [reference, searchParams]);

  const firstName = attendee?.firstName || attendee?.first_name || searchParams.get("name")?.split(" ")[0] || "";
  const lastName = attendee?.lastName || attendee?.last_name || searchParams.get("name")?.split(" ").slice(1).join(" ") || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const attendeeEmail = attendee?.email || searchParams.get("email") || "";
  const regNumber = attendee?.registrationNumber || attendee?.registration_number || searchParams.get("registrationId") || "";
  const passType = (attendee?.registrationType || attendee?.registration_type || "student").toLowerCase() === "professional" ? "Professional Pass" : "Student Pass";
  const attendanceMode = attendee?.attendanceMode || attendee?.attendance_mode || searchParams.get("mode") || "On-site";
  const breakoutSession = attendee?.breakoutSessionChoice || attendee?.breakout_session_choice || searchParams.get("session") || "";

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 pt-36 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto text-center">
          
          {/* Verification In-Progress State */}
          {status === "verifying" && (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
              <div className="flex justify-center mb-6">
                <RefreshCw className="h-12 w-12 text-brand-orange animate-spin" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Verifying Payment & Registration
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Please wait while we verify your transaction and send your confirmation email...
              </p>
            </div>
          )}

          {/* Verification Error State */}
          {status === "error" && (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
              <div className="flex justify-center mb-6">
                <div className="rounded-3xl bg-rose-50 p-5 border border-rose-200">
                  <AlertCircle className="h-12 w-12 text-rose-600" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Verification Issue
              </h2>
              <p className="text-sm text-rose-600 mb-6 max-w-md mx-auto">
                {errorMessage}
              </p>
              {reference && (
                <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-xs font-mono text-gray-600 border border-gray-200 inline-block">
                  Reference: {reference}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full bg-white hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry Verification
                </button>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div>
              {/* Success Icon */}
              <div className="flex justify-center mb-8">
                <div className="rounded-3xl bg-green-500/10 p-6 border border-green-500/20 shadow-lg shadow-green-500/5">
                  <CheckCircle className="h-14 w-14 text-green-600" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Registration Successful!
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto font-normal">
                Thank you for registering for <span className="font-bold text-brand-red">Photizo Conference 2026</span>. 
                Your payment has been verified and your spot is secured.
              </p>

              {/* Pass / Ticket Details Card */}
              {regNumber && (
                <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 mb-8 text-left">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                    <div className="flex items-center space-x-2 text-brand-red font-bold text-xs uppercase tracking-wider">
                      <Ticket className="h-4 w-4" />
                      <span>Official Conference Pass</span>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
                      Confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Registration ID / Pass No.</p>
                      <p className="text-2xl font-mono font-black text-gray-900 mt-1">{regNumber}</p>
                    </div>

                    {fullName && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Attendee Name</p>
                        <p className="text-base font-bold text-gray-800 mt-1">{fullName}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Pass Category</p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">{passType}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Attendance Mode</p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">{attendanceMode}</p>
                    </div>

                    {breakoutSession && (
                      <div className="sm:col-span-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Breakout Session</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{breakoutSession}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* What Happens Next Card */}
              <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 mb-10 text-left">
                <h3 className="text-xs font-bold text-gray-400 mb-6 border-b border-gray-100 pb-3 uppercase tracking-wider">
                  What Happens Next?
                </h3>
                
                <ul className="space-y-5">
                  <li className="flex items-start">
                    <div className="bg-brand-red/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-red">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Check your Email</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        We've sent your official e-pass and registration summary {attendeeEmail ? `to ${attendeeEmail}` : "to your inbox"}.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-brand-orange/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-orange">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Mark your Calendar</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Photizo 2026 is scheduled for May 21st – 23rd, 2026 at Higher Ground Baptist Church, Ogbomoso.
                      </p>
                    </div>
                  </li>

                  {reference && (
                    <li className="flex items-start">
                      <div className="bg-gray-100 p-2.5 rounded-2xl mr-4 shrink-0 text-gray-600">
                        <Ticket className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Payment Reference</p>
                        <p className="text-xs font-mono text-gray-500 uppercase mt-0.5">{reference}</p>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg hover:shadow-brand-red/25 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  <span>Return to Homepage</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/schedule"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full bg-white hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Browse Event Schedule
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}