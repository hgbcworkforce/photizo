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
import Dashboard from "./pages/dashboard/Dashboard";

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
      {/* <Route path="/payment-success" element={<PaymentSuccess />} /> */}
          {/* <Route path="/payment/callback" element={<PaymentCallback />} /> */}
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
