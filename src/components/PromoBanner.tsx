'use client';

import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';
import { trackCTAClick } from '@/lib/analytics';

export default function PromoBanner() {
  const { locale } = useI18n();

  // 언어별 배너 이미지 및 링크 매핑
  const bannerConfig = {
    ko: {
      src: '/banner_aws_reinvent.png',
      url: 'https://aws.amazon.com/events/reinvent/',
      alt: 'AWS re:Invent',
      eventName: 'aws_reinvent',
    },
    en: {
      src: '/banner_aws_reinvent.png',
      url: 'https://aws.amazon.com/events/reinvent/',
      alt: 'AWS re:Invent',
      eventName: 'aws_reinvent',
    },
    ja: {
      src: '/banner_aws_reinvent.png',
      url: 'https://aws.amazon.com/events/reinvent/',
      alt: 'AWS re:Invent',
      eventName: 'aws_reinvent',
    },
  };

  const config = bannerConfig[locale];

  const handleBannerClick = () => {
    trackCTAClick('promo_banner', 'result_page', {
      banner_type: config.eventName,
      language: locale,
      destination_url: config.url,
    });
  };

  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleBannerClick}
      className="block w-full overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
    >
      <Image
        src={config.src}
        alt={config.alt}
        width={1200}
        height={300}
        className="w-full h-auto object-cover"
        priority={false}
      />
    </a>
  );
}
