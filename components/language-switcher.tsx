'use client';

import React from 'react';
import { useLanguage } from '@/components/language-provider';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      type="button"
      className={className}
      data-testid="language-switcher"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'ar' ? 'English' : 'Arabic'}`}
      title={`Switch to ${language === 'ar' ? 'English' : 'Arabic'}`}
    >
      {language === 'ar' ? 'EN' : 'AR'}
    </Button>
  );
}