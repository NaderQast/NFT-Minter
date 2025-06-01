// next.config.js
import i18nConfig from "./next-i18next.config.js";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...i18nConfig,
};

export default nextConfig;
