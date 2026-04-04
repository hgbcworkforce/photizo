import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MerchandiseSuccessPage() {
  const [ref] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-brand-red/10 p-6">
              <ShoppingBag className="h-16 w-16 text-brand-red" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Merchandise Purchase Complete!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your order has been received and payment was successful. We will process your merchandise and contact you with shipping details.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4">
              What happens next?
            </h3>

            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                  <Download className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Reference</p>
                  <p className="text-sm font-mono text-gray-500 uppercase">{ref ?? "Not available"}</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                  <CheckCircle className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Order Confirmation</p>
                  <p className="text-sm text-gray-500">We will email you an order summary and delivery details shortly.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/merchandise"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-red/90 hover:bg-brand-red transition-colors shadow-md"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-brand-red text-brand-red rounded-lg bg-white hover:bg-gray-100 transition-colors shadow-sm"
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
