import { useState } from "react";
import { Link } from "react-router-dom"; 
import { CheckCircle, Calendar, Mail, Download } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RegistrationSuccessPage() {
  const [ref] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref");
  });
  
  // Logic to grab the payment reference from the URL
  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   setRef(params.get("ref"));
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onNavigate={() => {}} />

      <main className="flex-grow py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon Animation container */}
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Registration Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for registering for <span className="font-semibold text-brand-red">Photizo'25</span>. 
            We've received your payment and your spot is now secured.
          </p>

          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8 text-left">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4">
              What Happens Next?
            </h3>
            
            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                  <Mail className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Check your Email</p>
                  <p className="text-sm text-gray-500">We've sent a confirmation receipt and your e-ticket to your inbox.</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-brand-red/10 p-2 rounded-lg mr-4">
                  <Calendar className="h-5 w-5 text-brand-red" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Mark your Calendar</p>
                  <p className="text-sm text-gray-500">Photizo'25 is happening soon! Stay tuned for the event schedule.</p>
                </div>
              </li>

              {ref && (
                <li className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-4">
                    <Download className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Transaction Reference</p>
                    <p className="text-sm font-mono text-gray-500 uppercase">{ref}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-red/90 hover:bg-brand-red transition-colors shadow-md"
            >
              Return to Homepage
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Print Receipt
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}