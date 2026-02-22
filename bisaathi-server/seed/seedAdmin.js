require('dotenv').config();
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = 'BIS Admin';

  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email)
    .single();

  if (existing) {
    console.log('Admin already exists — skipping seed');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from('admins')
    .insert([{ name, email, password: hashedPassword }]);

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log(`✅ Admin seeded: ${email}`);
  process.exit(0);
}

seedAdmin();
