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


// Dashboard Pages
import Admin from "./pages/Admin";

import "./index.css";
import AdminGuard from "./components/AdminGuard";

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
          <Route path="*" element={<NotFound />} />

          {/* Admin route — no Navbar/Footer */}
        <Route path="/dashboard" element={
          <AdminGuard>
            <Admin />
          </AdminGuard>
        } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
