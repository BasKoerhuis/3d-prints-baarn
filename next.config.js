/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Exclude ssh2 and ssh2-sftp-client from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        ssh2: false,
        'ssh2-sftp-client': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig