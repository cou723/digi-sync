/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // 空のオブジェクト渡すことでnpmパッケージがfsモジュールに依存しないようにします
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  },

}

module.exports = nextConfig
