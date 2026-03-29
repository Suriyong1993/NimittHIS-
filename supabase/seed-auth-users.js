#!/usr/bin/env node
/**
 * Supabase Demo Auth Users Seed Script
 *
 * สร้าง demo users ใน Supabase Auth สำหรับ dev/staging
 * ห้ามรันใน production
 *
 * Usage (ต้องมี SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY ใน root .env):
 *   node supabase/seed-auth-users.js
 *
 *   หรือใช้ dotenv-cli:
 *   npx dotenv -e .env -- node supabase/seed-auth-users.js
 */

const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") })

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ กรุณาตั้งค่าใน .env ก่อน:")
  console.error("   SUPABASE_URL=https://xxx.supabase.co")
  console.error("   SUPABASE_SERVICE_ROLE_KEY=eyJ... (service_role key จาก Supabase Dashboard → API)")
  process.exit(1)
}

// Demo users — ใช้ email เพราะ Supabase Auth ต้องการ email
const DEMO_USERS = [
  {
    email: "nurse01@hospital.demo",
    password: "nurse123",
    user_metadata: { first_name: "Nurse", last_name: "Demo", role: "NURSE", username: "nurse01" }
  },
  {
    email: "doctor01@hospital.demo",
    password: "doctor123",
    user_metadata: { first_name: "Doctor", last_name: "Demo", role: "DOCTOR", username: "doctor01" }
  },
  {
    email: "manager01@hospital.demo",
    password: "mgr123",
    user_metadata: { first_name: "Manager", last_name: "Demo", role: "MANAGER", username: "manager01" }
  },
  {
    email: "admin01@hospital.demo",
    password: "admin123",
    user_metadata: { first_name: "Admin", last_name: "Demo", role: "ADMIN", username: "admin01" }
  }
]

async function seedAuthUsers() {
  // import dynamically so script works even if @supabase/supabase-js not installed globally
  let createClient
  try {
    const pkg = require("@supabase/supabase-js")
    createClient = pkg.createClient
  } catch {
    // try from backend node_modules
    const pkg = require(path.resolve(__dirname, "..", "backend", "node_modules", "@supabase", "supabase-js"))
    createClient = pkg.createClient
  }

  // ต้องใช้ service_role key (admin) สร้าง user โดยไม่ต้องยืนยัน email
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  console.log("🌱 Seeding Supabase Auth demo users...\n")

  for (const user of DEMO_USERS) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: user.password,
      user_metadata: user.user_metadata,
      email_confirm: true
    })

    if (error) {
      const isExisting = error.message.includes("already") || error.code === "email_exists"
      if (isExisting) {
        console.log(`⚠️  ${user.email} — มีอยู่แล้ว (ข้าม)`)
      } else {
        console.error(`❌ ${user.email} — Error: ${error.message}`)
      }
    } else {
      console.log(`✅ ${user.email} (${user.user_metadata.role}) — สร้างสำเร็จ id=${data.user?.id}`)
    }
  }

  console.log("\n✨ เสร็จแล้ว! Demo users สำหรับ Login:")
  console.log("─────────────────────────────────────────────────")
  for (const u of DEMO_USERS) {
    console.log(`  ${u.user_metadata.role.padEnd(8)} │ email: ${u.email.padEnd(28)} │ password: ${u.password}`)
  }
  console.log("─────────────────────────────────────────────────")
}

seedAuthUsers().catch((err) => {
  console.error("Fatal:", err)
  process.exit(1)
})
