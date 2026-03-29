import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { useAuthStore } from "../store/authStore"

const loginSchema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน")
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const navigate = useNavigate()
  const loginAction = useAuthStore((state) => state.loginAction)
  const { register, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "nurse01",
      password: "nurse123"
    }
  })

  const mutation = useMutation({
    mutationFn: loginAction,
    onSuccess: () => navigate("/dashboard")
  })

  return (
    <main className="flex min-h-screen items-center justify-center bg-nimitt-bg px-4 py-8">
      <Card className="grid w-full max-w-5xl gap-0 overflow-hidden p-0 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="bg-[#111110] px-8 py-10 text-white md:px-12 md:py-14">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-white/45">NimittHIS</p>
          <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-tight">
            แพลตฟอร์มติดตามนัดหมายผู้ป่วยสำหรับงานบริการโรงพยาบาลไทย
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/70">
            มองเห็นผู้ป่วยเสี่ยงขาดนัด, ตรวจ timeline ย้อนหลัง, และสรุปภาพรวมการมาตามนัดของแต่ละคลินิกได้ในระบบเดียว
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["เสี่ยงสูง", "คัดลำดับ no-show score"],
              ["Timeline", "ประวัติการติดตามแบบ audit trail"],
              ["Analytics", "สรุปผลตามคลินิกและช่วงเวลา"]
            ].map(([title, detail]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/65">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center px-6 py-10 md:px-10">
          <form className="w-full space-y-5" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
            <div>
              <p className="text-sm font-medium text-nimitt-muted">เข้าสู่ระบบ</p>
              <h2 className="mt-2 text-3xl font-semibold text-nimitt-ink">เริ่มต้นเวรวันนี้</h2>
            </div>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-nimitt-ink">ชื่อผู้ใช้</span>
              <input
                {...register("username")}
                className="w-full rounded-2xl border border-nimitt-border bg-white px-4 py-3 outline-none transition focus:border-nimitt-blue"
              />
              <span className="text-sm text-nimitt-red">{formState.errors.username?.message}</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-nimitt-ink">รหัสผ่าน</span>
              <input
                type="password"
                {...register("password")}
                className="w-full rounded-2xl border border-nimitt-border bg-white px-4 py-3 outline-none transition focus:border-nimitt-blue"
              />
              <span className="text-sm text-nimitt-red">{formState.errors.password?.message}</span>
            </label>

            {mutation.isError ? (
              <div className="rounded-2xl bg-nimitt-red-bg px-4 py-3 text-sm text-nimitt-red">
                เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง
              </div>
            ) : null}

            <Button type="submit" fullWidth disabled={mutation.isPending}>
              {mutation.isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </Button>
          </form>
        </section>
      </Card>
    </main>
  )
}
