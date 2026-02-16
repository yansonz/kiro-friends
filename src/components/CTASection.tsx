'use client';

// CTA 전환 영역 컴포넌트
// 결과 페이지 하단에 표시되는 Kiro 다운로드, 커뮤니티 링크, 추천 기능 영역
// Req 10.1: 결과 페이지 하단 CTA 영역
// Req 10.2: Kiro 다운로드 / 더 알아보기 버튼
// Req 10.3: 사용자모임 링크
// Req 10.4: 캐릭터별 추천 Kiro 기능 목록

import type { CharacterProfile } from '@/lib/types';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { trackCTAClick } from '@/lib/analytics';

interface CTASectionProps {
  character: CharacterProfile;
}

export default function CTASection({ character }: CTASectionProps) {
  const { t, locale } = useTranslation();
  
  return (
    <section
      className="bg-gray-900/80 border border-purple-900/40 rounded-2xl p-4
                 shadow-xl shadow-purple-950/10"
      data-testid="cta-section"
    >
      {/* Kiro 다운로드 / 더 알아보기 버튼 (Req 10.2) - 터치 친화적 크기 */}
      <div className="flex flex-col gap-2.5 mb-5" data-testid="cta-buttons">
        <a
          href="https://kiro.dev"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick('download_kiro', 'cta_section', { character: character.slug })}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3
                     min-h-[48px] bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl
                     transition-colors duration-200 text-center text-sm"
          data-testid="cta-download"
        >
          {t('cta.download')}
        </a>
        <a
          href="https://kiro.dev"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick('learn_more', 'cta_section', { character: character.slug })}
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3
                     min-h-[48px] bg-gray-800 hover:bg-gray-700 text-purple-200 font-bold rounded-xl
                     border border-purple-800/40 transition-colors duration-200 text-center text-sm"
          data-testid="cta-learn-more"
        >
          {t('cta.learnMore')}
        </a>
      </div>

      {/* 사용자모임 링크 (Req 10.3) */}
      <div
        className="flex flex-col gap-2 items-center justify-center text-xs"
        data-testid="cta-community-links"
      >
        <a
          href="https://kiro.awskr.org?utm_source=kiro-friends&utm_medium=result-page&utm_campaign=personality-test"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick('kiro_community', 'cta_section', { character: character.slug })}
          className="text-purple-400 hover:text-purple-300 underline underline-offset-4
                     transition-colors duration-200"
          data-testid="cta-kiro-community"
        >
          {t('cta.kiroKr')}
        </a>
        <a
          href="https://www.awskr.org?utm_source=kiro-friends&utm_medium=result-page&utm_campaign=personality-test"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick('aws_community', 'cta_section', { character: character.slug })}
          className="text-purple-400 hover:text-purple-300 underline underline-offset-4
                     transition-colors duration-200"
          data-testid="cta-aws-community"
        >
          {t('cta.awsKr')}
        </a>
        
        {/* 크레딧 */}
        <div className="text-purple-400 text-xs">
          <a
            href="https://www.linkedin.com/in/yanso"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('developer_credit', 'cta_section', { character: character.slug })}
            className="hover:text-purple-300 underline underline-offset-4 transition-colors duration-200"
          >
            {t('cta.developer')}
          </a>
          {' | '}
          <a
            href={`https://yanlog.yanbert.com/${locale === 'ja' ? 'en' : locale}/blog/kiro-friends-introduction-20260217/?utm_source=kiro-friends&utm_medium=result-page&utm_campaign=dev-blog`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick('dev_blog', 'cta_section', { character: character.slug })}
            className="hover:text-purple-300 underline underline-offset-4 transition-colors duration-200"
          >
            {t('cta.devBlog')}
          </a>
        </div>
        <a
          href="https://www.linkedin.com/in/jiyeon-choi-47ab9623a"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackCTAClick('character_designer_credit', 'cta_section', { character: character.slug })}
          className="text-purple-400 hover:text-purple-300 underline underline-offset-4
                     transition-colors duration-200"
        >
          {t('cta.character')}
        </a>
      </div>
    </section>
  );
}
