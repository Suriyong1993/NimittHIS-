// seed-quick.mjs - ESM script
async function main() {
  const url = 'https://qtoqckruqcshsknutsdj.supabase.co/auth/v1/admin/users';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0b3Fja3J1cWNzaHNrbnV0c2RqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDc3ODY3OCwiZXhwIjoyMDkwMzU0Njc4fQ.y4kKcxU5GTYsZqvjpT9D57TxLjIsgBAdCVAH9FF_PNE';
  const headers = { 'apikey': key, 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' };

  // Create admin user
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'admin@nimitthis.com',
      password: 'admin123',
      user_metadata: { first_name: 'Admin', last_name: 'HIS', role: 'ADMIN' },
      email_confirm: true
    })
  });
  const data = await res.json();
  console.log('Admin:', res.status, JSON.stringify(data).substring(0, 200));

  // Create nurse user
  const res2 = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      email: 'nurse01@nimitthis.com',
      password: 'nurse123',
      user_metadata: { first_name: 'Nurse', last_name: 'Demo', role: 'NURSE' },
      email_confirm: true
    })
  });
  const data2 = await res2.json();
  console.log('Nurse:', res2.status, JSON.stringify(data2).substring(0, 200));
}
main();
