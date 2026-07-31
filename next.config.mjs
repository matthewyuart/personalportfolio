import { fileURLToPath } from "url";
import { dirname } from "path";

const projectRoot = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // pin tracing to THIS project — a stray ~/package-lock.json otherwise makes
  // Next infer the home dir as the workspace root (breaks dev HMR + deploys)
  outputFileTracingRoot: projectRoot,
  // serve AVIF where supported (smaller than WebP), WebP otherwise
  images: { formats: ["image/avif", "image/webp"] },
  // clean URLs for the static experiment apps in public/play/
  // (each app's index.html carries a <base> tag so relative assets resolve)
  async rewrites() {
    return ["oscillon", "hypercycles", "cultcube"].map((name) => ({
      source: `/play/${name}`,
      destination: `/play/${name}/index.html`,
    }));
  },
  // /work index merged into the home sections; /studio folded back into /play
  async redirects() {
    return [
      { source: "/work", destination: "/#projects", permanent: false },
      { source: "/studio", destination: "/play", permanent: false },
    ];
  },
};

export default nextConfig;
