import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  turbopack: {
    // Fix: tell Turbopack the real project root (avoids picking up a parent package-lock.json)
    root: __dirname,
  },
};

export default nextConfig;
