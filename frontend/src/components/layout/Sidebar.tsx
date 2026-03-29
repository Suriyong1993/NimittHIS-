import { NavLink } from "react-router-dom"

const menu = [
  { to: "/dashboard", label: "แดชบอร์ด" },
  { to: "/appointments", label: "นัดหมาย" },
  { to: "/noshow", label: "ติดตามขาดนัด" },
  { to: "/analytics", label: "วิเคราะห์" }
]

export function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col rounded-[28px] border border-white/40 bg-[#111110] p-5 text-white shadow-panel">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-white/50">NimittHIS</p>
        <h1 className="mt-3 text-2xl font-semibold">ระบบติดตามนัดหมาย</h1>
        <p className="mt-2 text-sm leading-6 text-white/65">Thai hospital operations dashboard สำหรับติดตามการมาตามนัดและกลุ่มเสี่ยง</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-white text-nimitt-ink" : "text-white/75 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        <p className="font-semibold text-white">ระบบเวรเช้า</p>
        <p className="mt-2 leading-6">ตรวจสอบผู้ป่วยเสี่ยงสูงก่อนเริ่มคลินิก และอัปเดตสถานะภายในหน้าเดียว</p>
      </div>
    </aside>
  )
}
