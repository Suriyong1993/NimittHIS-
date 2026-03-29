const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://qtoqckruqcshsknutsdj.supabase.co', 'sb_publishable_1cL_3_8dz0jtnPa84adFYQ_e3ilZMhQ');

async function test() {
  const { data, error } = await supabase.auth.signUp({ 
    email: 'nurse01@nimitthis.com', 
    password: 'nurse123',
    options: {
      data: { role: 'NURSE' }
    }
  });

  const { data: adminData, error: adminError } = await supabase.auth.signUp({
    email: 'admin@nimitthis.com',
    password: 'adminpassword123',
    options: {
      data: { role: 'ADMIN' }
    }
  });
  
  console.log('NURSE RESULT:', data, error);
  console.log('\nADMIN RESULT:', adminData, adminError);
  process.exit(0);
}
test();
