import { useNavigate } from "react-router-dom"

import { useAuthStore } from "../../store/authStore"
import { Button } from "../ui/Button"

export function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  return (
    <header className="flex items-center justify-between gap-4 rounded-[28px] border border-nimitt-border bg-white/85 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-sm text-nimitt-muted">สถานะระบบ</p>
        <h2 className="text-xl font-semibold text-nimitt-ink">พร้อมติดตามผู้ป่วยประจำวัน</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-nimitt-blue-bg px-4 py-2 text-right">
          <p className="text-xs text-nimitt-muted">ผู้ใช้งาน</p>
          <p className="text-sm font-semibold text-nimitt-ink">
            {user?.firstName} {user?.lastName}
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await logout()
            navigate("/login")
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </header>
  )
}
