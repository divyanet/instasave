import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ffmpeg-static ships a native binary; keep it external to the bundle.
  serverExternalPackages: ['ffmpeg-static'],
};

export default nextConfig;
