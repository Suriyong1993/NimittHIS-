import path from "node:path"
import type { NextConfig } from "next"

const rootPath = path.join(__dirname, "..")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: rootPath,
  turbopack: {
    root: rootPath
  }
}

export default nextConfig
