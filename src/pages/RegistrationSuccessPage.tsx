import { useState } from "react";
import { Link } from "react-router-dom"; 
import { CheckCircle, Calendar, Mail, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { downloadRegistrationReceiptPdf } from "../utils/pdfReceipts";

export default function RegistrationSuccessPage() {
  const [params] = useState<URLSearchParams>(() => new URLSearchParams(window.location.search));
  const [ref] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") || params.get("reference");
  });

  const handleDownloadReceipt = () => {
    downloadRegistrationReceiptPdf({
      name: params.get("name") || undefined,
      email: params.get("email") || undefined,
      registrationId: params.get("registrationId") || undefined,
      breakoutSession: params.get("session") || undefined,
      reference: ref || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4 pt-36">
        <div className="max-w-2xl mx-auto text-center">
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
            Thank you for registering for <span className="font-bold text-brand-red">Photizo'25</span>. 
            We've received your payment and your spot is now secured.
          </p>

          {/* Info Card */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-10 mb-10 text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4 uppercase tracking-wider text-xs">
              What Happens Next?
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-red">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Check your Email</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">We've sent a confirmation receipt and your e-ticket to your inbox.</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-brand-orange/10 p-2.5 rounded-2xl mr-4 shrink-0 text-brand-orange">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Mark your Calendar</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Photizo'25 is happening soon! Stay tuned for the event schedule.</p>
                </div>
              </li>

              {ref && (
                <li className="flex items-start">
                  <div className="bg-gray-100 p-2.5 rounded-2xl mr-4 shrink-0 text-gray-600">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Transaction Reference</p>
                    <p className="text-xs font-mono text-gray-500 uppercase mt-0.5">{ref}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <button
              onClick={handleDownloadReceipt}
              className="inline-flex items-center justify-center px-6 py-3.5 border border-brand-red/30 text-brand-red rounded-full bg-white hover:bg-brand-red/5 transition-all text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Receipt
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-white bg-gradient-to-r from-brand-red to-brand-orange hover:shadow-lg hover:shadow-brand-red/25 transition-all text-xs font-bold uppercase tracking-wider shadow-md"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}