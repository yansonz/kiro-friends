'use client';

import { useTranslation } from '@/lib/hooks/useTranslation';

export default function ResultPageContent() {
  const { t } = useTranslation();
  
  return (
    <h3 className="text-base font-bold text-purple-300 mb-3 text-center">
      {t('result.analysis')}
    </h3>
  );
}
