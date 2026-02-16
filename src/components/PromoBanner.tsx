'use client';

import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';
import { trackCTAClick } from '@/lib/analytics';

export default function PromoBanner() {
  const { locale } = useI18n();

  // 언어별 배너 이미지 및 링크 매핑
  const bannerConfig = {
    ko: {
      src: '/banner_kr_awssummit_seoul_cfp.png',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLSde7BugZlyg45QIzzvjb5qKl_4WYO07YwQODtuMyNQzmseBjw/viewform',
      alt: 'AWS Summit Seoul CFP',
      eventName: 'aws_summit_seoul_cfp',
    },
    en: {
      src: '/banner_en_awssummit_global.png',
      url: 'https://aws.amazon.com/events/summits',
      alt: 'AWS Summits',
      eventName: 'aws_summits_global',
    },
    ja: {
      src: '/banner_jp_awsjawsday2026.png',
      url: 'https://jawsdays2026.jaws-ug.jp',
      alt: 'JAWS DAYS 2026',
      eventName: 'jaws_days_2026',
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
