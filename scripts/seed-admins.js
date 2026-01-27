const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const admins = [
  { email: 'believe@gmail.com', password: 'Sudum@2025', fullName: 'Believe Admin' },
  { email: 'theodore@mail.com', password: 'Sudum@2025', fullName: 'Theodore Admin' },
  { email: 'sudum@gmail.com', password: 'Sudum@2025', fullName: 'Dr. Sudum Admin' },
];

async function seedAdmins() {
  console.log('Starting admin seeding...');
  
  for (const admin of admins) {
    console.log(`Creating admin: ${admin.email}`);
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: admin.email,
      password: admin.password,
      email_confirm: true,
      user_metadata: { 
        full_name: admin.fullName,
        role: 'admin'
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`User ${admin.email} already exists, updating profile role...`);
        // Find user ID first
        const { data: users, error: listError } = await supabase.auth.admin.listUsers();
        const existingUser = users?.users.find(u => u.email === admin.email);
        
        if (existingUser) {
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({ 
              id: existingUser.id, 
              full_name: admin.fullName, 
              role: 'admin' 
            });
          if (profileError) console.error(`Error updating profile for ${admin.email}:`, profileError);
        }
      } else {
        console.error(`Error creating ${admin.email}:`, error.message);
      }
    } else {
      console.log(`Successfully created ${admin.email}`);
      // The trigger should handle profile creation, but let's be sure
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: data.user.id, 
          full_name: admin.fullName, 
          role: 'admin' 
        });
      if (profileError) console.error(`Error ensuring profile for ${admin.email}:`, profileError);
    }
  }
  
  console.log('Seeding finished.');
}

seedAdmins();
