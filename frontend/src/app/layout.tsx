import type { ReactNode } from "react"
import type { Metadata } from "next"
import { IBM_Plex_Mono, Sarabun } from "next/font/google"

import "./globals.css"

import { Providers } from "./providers"

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  variable: "--font-thai",
  weight: ["300", "400", "500", "600", "700"]
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"]
})

export const metadata: Metadata = {
  title: "NimittHIS",
  description: "ระบบติดตามนัดหมายผู้ป่วยสำหรับโรงพยาบาลไทย"
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th" className={`${sarabun.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
