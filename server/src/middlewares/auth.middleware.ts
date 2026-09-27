import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';

export interface AuthenticatedRequest extends Request {
  user?: any;
  adminProfile?: {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
  };
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Missing or malformed authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session. Please log in again.',
      });
    }

    // Verify admin role in admin_users table
    const { data: adminUser, error: adminErr } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (adminErr || !adminUser || !adminUser.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Access forbidden. Administrator privileges are required to access this endpoint.',
      });
    }

    req.user = user;
    req.adminProfile = {
      id: adminUser.id,
      userId: adminUser.user_id,
      email: adminUser.email,
      fullName: adminUser.full_name,
      role: adminUser.role,
      isActive: adminUser.is_active,
    };

    next();
  } catch (err: any) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal authentication error.',
    });
  }
}
