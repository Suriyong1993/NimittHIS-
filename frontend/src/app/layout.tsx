import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Rajdhani, Sarabun } from "next/font/google"

import "./globals.css"

import { Providers } from "./providers"

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  weight: ["300", "400", "500", "600", "700"]
})

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "NimittHIS — MindCare",
  description: "ระบบติดตามนัดหมายและสุขภาพจิตผู้ป่วยสำหรับโรงพยาบาลไทย"
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${rajdhani.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


