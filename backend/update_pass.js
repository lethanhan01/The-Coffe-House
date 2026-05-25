const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

supabase.from('users')
  .update({ password_hash: '$2b$10$0Ni7v/3W3wVPESn3zN.ULuf9LVVxaL1KejZZJAKpyQgqB5kZCFXsW' })
  .eq('email', 'binhminh@dokocafe.com')
  .then(console.log);
