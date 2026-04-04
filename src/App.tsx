import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Speakers from "./pages/Speakers";
import Registration from "./pages/Registration";
import Merchandise from "./pages/Merchandise";
import MerchandiseDetails from "./pages/MerchandiseDetails";
import NotFound from "./pages/NotFound";

// Payment Pages
import RegistrationSuccessPage from "./pages/RegistrationSuccessPage";
import MerchandiseSuccessPage from "./pages/MerchandiseSuccessPage";

// import PaymentCallback from "./pages/PaymentCallback";
// import PaymentSuccess from './pages/PaymentSuccess';


// Dashboard Pages
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import AdminAttendees from "./pages/admin/AdminAttendees";
// import AdminPaymentSummary from "./pages/admin/AdminPaymentSummary";
// import AdminAuth from "./pages/admin/AdminAuth";
// import AdminRegister from "./pages/admin/AdminRegister";
// import AdminSignIn from "./pages/admin/AdminSignIn";

import "./index.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/speakers" element={<Speakers />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/merchandisedetails/:id" element={<MerchandiseDetails />} />
          <Route path="/registration-success" element={<RegistrationSuccessPage />} />
          <Route path="/merchandise-success" element={<MerchandiseSuccessPage />} />
          {/* <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/signin" element={<AdminSignIn />} />
          <Route path="/admin/attendees" element={<AdminAttendees />} />
          <Route path="/admin/payments" element={<AdminPaymentSummary />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
