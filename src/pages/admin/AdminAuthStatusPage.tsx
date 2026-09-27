import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { authUtils } from "../../utils/authUtils";
import { CheckCircle2, Shield, ArrowRight, LogOut } from "lucide-react";

export default function AdminAuthStatusPage() {
  const [user, setUser] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: adminData } = await supabase
            .from("admin_users")
            .select("*")
            .eq("user_id", user.id)
            .single();

          setAdminProfile(adminData);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: adminData } = await supabase
          .from("admin_users")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        setAdminProfile(adminData);
      } else {
        setAdminProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      authUtils.logout();
      navigate("/admin/signin");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (user && adminProfile && adminProfile.is_approved && adminProfile.is_active) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
            Welcome, {adminProfile.full_name || "Admin"}!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mb-6">
            Your administrator account is verified and fully authorized.
          </p>

          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="flex items-center justify-center space-x-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <span>Access Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center space-x-2 w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-slate-100">
        <div className="mx-auto w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-4 border border-orange-100">
          <Shield className="w-8 h-8 text-orange-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Photizo Admin Portal
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm mb-8">
          Sign in or register to access the conference management system and attendee records.
        </p>

        <div className="space-y-3">
          <Link
            to="/admin/signin"
            className="flex items-center justify-center space-x-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-sm transition-colors"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/admin/register"
            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3.5 px-4 rounded-xl transition-colors text-center text-xs"
          >
            Register for Admin Access
          </Link>
        </div>
      </div>
    </div>
  );
}
