import dotenv from 'dotenv';
dotenv.config();

import { supabaseAdmin } from '../config/supabase';

async function createOrUpdateAdmin() {
  const email = (process.argv[2] || process.env.ADMIN_EMAIL || 'admin@photizo.org').trim().toLowerCase();
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'PhotizoAdminSecure2026!';
  const fullName = process.argv[4] || 'Photizo Super Admin';

  console.log(`\n⚡ Setting up Admin User for Photizo Conference...`);
  console.log(`📧 Target Email: ${email}`);

  try {
    // 1. Check if user already exists in Supabase Auth
    const { data: listData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    
    if (listErr) {
      throw new Error(`Failed to list users from Supabase: ${listErr.message}`);
    }

    const existingUser = listData.users.find((u) => u.email?.toLowerCase() === email);
    let userId: string;

    if (existingUser) {
      console.log(`🔄 User exists in Supabase Auth (${existingUser.id}). Updating password and confirming email...`);
      const { data: updated, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName },
        }
      );

      if (updateErr) {
        throw new Error(`Failed to update user: ${updateErr.message}`);
      }

      userId = updated.user.id;
      console.log(`✅ Supabase Auth password updated.`);
    } else {
      console.log(`✨ Creating new user in Supabase Auth via Admin API...`);
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName },
      });

      if (createErr) {
        throw new Error(`Failed to create user: ${createErr.message}`);
      }

      userId = created.user.id;
      console.log(`✅ Supabase Auth user created with ID: ${userId}`);
    }

    // 2. Upsert into public.admin_users table
    console.log(`🛡️ Configuring administrator privileges in public.admin_users...`);
    const { error: dbErr } = await supabaseAdmin.from('admin_users').upsert(
      {
        user_id: userId,
        email,
        full_name: fullName,
        role: 'superadmin',
        is_approved: true,
        is_active: true,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

    if (dbErr) {
      throw new Error(`Failed to update admin_users table: ${dbErr.message}`);
    }

    // 3. Test verification of signInWithPassword
    console.log(`🧪 Testing sign in with credentials...`);
    const { data: authTest, error: testErr } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (testErr || !authTest.session) {
      console.warn(`⚠️ Note: signInWithPassword test returned:`, testErr?.message || 'No session');
    } else {
      console.log(`🎉 Sign in test SUCCEEDED! JWT Token received.`);
    }

    console.log(`\n======================================================`);
    console.log(`✅ SUPERADMIN READY FOR LOGIN:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     superadmin`);
    console.log(`======================================================\n`);
  } catch (error: any) {
    console.error(`❌ Admin setup failed:`, error.message || error);
    process.exit(1);
  }
}

createOrUpdateAdmin();
