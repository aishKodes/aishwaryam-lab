import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/math/class10/ap/gauss-sum/sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/math/class10/ap/gauss-sum",
          },
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
    ];
  },
};

export default nextConfig;
