import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Mail, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { merchandiseAPI, handleApiError } from "../services/apiService";

export default function MerchandiseSuccessPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState<any>(null);

  const reference =
    searchParams.get("reference") ||
    searchParams.get("ref") ||
    searchParams.get("trxref");

  useEffect(() => {
    let isMounted = true;

    const verifyMerchandisePayment = async () => {
      if (reference) {
        try {
          setStatus("verifying");
          const res = await merchandiseAPI.verifyMerchPayment(reference);

          if (!isMounted) return;

          if (res.success || res.status === "success") {
            const orderData = res.data?.order || res.data;
            setOrder(orderData || null);
            setStatus("success");
          } else {
            // Try fetching order status fallback
            try {
              const statusRes = await merchandiseAPI.getStatus(reference);
              if (statusRes.success && statusRes.data) {
                setOrder(statusRes.data);
                setStatus("success");
                return;
              }
            } catch {
              // Ignore fallback error
            }
            throw new Error((res as any)?.message || "Could not verify merchandise payment with Paystack.");
          }
        } catch (err: any) {
          if (!isMounted) return;
          console.error("Merchandise verification error:", err);
          const apiErr = handleApiError(err);
          setErrorMessage(apiErr.message || "Payment verification failed.");
          setStatus("error");
        }
      } else {
        const itemParam = searchParams.get("item");
        if (itemParam) {
          setOrder({
            itemName: itemParam,
            customerName: searchParams.get("name") || "",
            customerEmail: searchParams.get("email") || "",
            quantity: searchParams.get("quantity") || 1,
            size: searchParams.get("size") || "",
            color: searchParams.get("color") || "",
            totalAmount: searchParams.get("totalPrice") || 0,
          });
        }
        setStatus("success");
      }
    };

    verifyMerchandisePayment();

    return () => {
      isMounted = false;
    };
  }, [reference, searchParams]);

  const customerEmail = order?.customer_email || order?.customerEmail || searchParams.get("email") || "";
  const orderNumber = order?.order_number || order?.orderNumber || reference || "Confirmed";

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4 sm:px-6 lg:px-8 pt-36 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-auto text-center">

          {/* Verification In-Progress */}
          {status === "verifying" && (
            <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-10 sm:p-14 text-center">
              <div className="flex justify-center mb-6">
                <RefreshCw className="h-12 w-12 text-brand-orange animate-spin" />
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
                Verifying Order Payment
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                Please wait while we confirm your merchandise order and send your email receipt...
              </p>
            </div>
          )}

          {/* Verification Error */}
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
                  to="/merchandise"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-slate-900 hover:bg-slate-800 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Return to Store
                </Link>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div>
              <div className="flex justify-center mb-8">
                <div className="rounded-3xl bg-brand-red/10 p-6 border border-brand-red/20 shadow-lg shadow-brand-red/5">
                  <ShoppingBag className="h-14 w-14 text-brand-red" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Merchandise Purchase Complete!
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto font-normal">
                Your order has been received and payment was successful. We will process your merchandise and prepare it for pickup.
              </p>

              {/* Order Info Card */}
              <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6 sm:p-8 mb-8 text-left">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center space-x-2 text-brand-red font-bold text-xs uppercase tracking-wider">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Order Confirmation</span>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
                    Paid & Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Order Code / Ref</p>
                    <p className="text-xl font-mono font-black text-gray-900 mt-1">{orderNumber}</p>
                  </div>

                  {(order?.item_name || order?.itemName) && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Item</p>
                      <p className="text-sm font-semibold text-gray-800 mt-1">
                        {order.item_name || order.itemName} ({order.quantity || 1}x {order.color ? `• ${order.color}` : ""} {order.size ? `• ${order.size}` : ""})
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Pickup Location</p>
                    <p className="text-sm font-semibold text-gray-700 mt-0.5">On-site Conference Accreditation Desk</p>
                  </div>

                  {reference && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment Ref</p>
                      <p className="text-xs font-mono text-gray-600 mt-0.5">{reference}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Steps */}
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
                      <p className="font-bold text-gray-900 text-sm">Order Summary Emailed</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        We've emailed your complete order receipt and pickup instructions {customerEmail ? `to ${customerEmail}` : "to your inbox"}.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start">
                    <div className="bg-brand-orange/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-orange">
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Pickup at Venue</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Present your Order Code at the merchandise booth during Photizo 2026 to collect your package.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                <Link
                  to="/merchandise"
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg hover:shadow-brand-red/25 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full bg-white hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Return Home
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
