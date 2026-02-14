import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 정적 사이트 빌드를 위한 설정 (S3 + CloudFront 배포용)
  output: 'export',
  // 정적 export에서는 이미지 최적화 비활성화
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
