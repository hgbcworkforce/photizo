import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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

// Dashboard & Admin Auth Pages (Matching BISUM)
import Admin from "./pages/Admin";
import AdminSignInPage from "./pages/admin/AdminSignInPage";
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import AdminAuthStatusPage from "./pages/admin/AdminAuthStatusPage";
import AdminGuard from "./components/AdminGuard";

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

          {/* Admin Authentication Routes (Identical to BISUM) */}
          <Route path="/admin/signin" element={<AdminSignInPage />} />
          <Route path="/admin/register" element={<AdminRegisterPage />} />
          <Route path="/admin/auth" element={<AdminAuthStatusPage />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/dashboard"
            element={
              <AdminGuard>
                <Admin />
              </AdminGuard>
            }
          />
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
