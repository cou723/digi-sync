/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 空のオブジェクト渡すことでnpmパッケージがfsモジュールに依存しないようにします
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },
  i18n,
};

module.exports = nextConfig;
