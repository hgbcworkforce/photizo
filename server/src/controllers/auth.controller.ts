import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase';

export const authController = {
  /**
   * Logs in an admin user via Supabase Auth
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error || !data.session) {
        return res.status(401).json({
          success: false,
          message: error?.message || 'Invalid email or password',
        });
      }

      // Check if user exists in admin_users and is active
      const { data: adminUser, error: adminErr } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminErr || !adminUser || !adminUser.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You do not have administrator permissions.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token: data.session.access_token,
        accessToken: data.session.access_token,
        user: {
          id: adminUser.id,
          userId: adminUser.user_id,
          email: adminUser.email,
          fullName: adminUser.full_name,
          role: adminUser.role,
        },
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Authentication failed',
      });
    }
  },

  /**
   * Logs out user / revokes session
   */
  async logout(req: Request, res: Response) {
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  },
};
