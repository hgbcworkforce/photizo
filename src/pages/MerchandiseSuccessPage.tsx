import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { downloadMerchandiseReceiptPdf } from "../utils/pdfReceipts";

export default function MerchandiseSuccessPage() {
  const [params] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));
  const [ref] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") || params.get("reference");
  });

  const handleDownloadReceipt = () => {
    downloadMerchandiseReceiptPdf({
      name: params.get("name") || undefined,
      email: params.get("email") || undefined,
      item: params.get("item") || undefined,
      quantity: params.get("quantity") || undefined,
      size: params.get("size") || undefined,
      color: params.get("color") || undefined,
      totalPrice: params.get("totalPrice") || undefined,
      reference: ref || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4 pt-36">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="rounded-3xl bg-brand-red/10 p-6 border border-brand-red/20 shadow-lg shadow-brand-red/5">
              <ShoppingBag className="h-14 w-14 text-brand-red" />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Merchandise Purchase Complete!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-xl mx-auto font-normal">
            Your order has been received and payment was successful. We will process your merchandise and contact you with shipping details.
          </p>

          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-10 mb-10 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 uppercase tracking-wider text-xs">
              What happens next?
            </h3>

            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-red">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Order Reference</p>
                  <p className="text-xs font-mono text-gray-500 uppercase mt-0.5">{ref ?? "Not available"}</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-brand-orange/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-orange">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Order Confirmation</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">We will email you an order summary and delivery details shortly.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={handleDownloadReceipt}
              className="inline-flex items-center justify-center px-6 py-3.5 border border-brand-red/30 text-brand-red rounded-full bg-white hover:bg-brand-red/5 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Receipt
            </button>
            <Link
              to="/merchandise"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg hover:shadow-brand-red/25 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3.5 border border-gray-200 text-gray-700 rounded-full bg-white hover:bg-gray-50 transition-all text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
