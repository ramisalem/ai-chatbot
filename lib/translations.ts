import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import arMessages from '@/messages/ar.json';
import enMessages from '@/messages/en.json';

type Messages = typeof arMessages;

export function useTranslations() {
  const pathname = usePathname();
  
  const currentLocale = useMemo(() => {
    return pathname.split('/')[1] || 'ar';
  }, [pathname]);

  const messages: Messages = useMemo(() => {
    return currentLocale === 'ar' ? arMessages : enMessages;
  }, [currentLocale]);

  const t = useMemo(() => {
    return (key: string): string => {
      const keys = key.split('.');
      let value: any = messages;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          return key; // Return key if translation not found
        }
      }

      return typeof value === 'string' ? value : key;
    };
  }, [messages]);

  return { t, locale: currentLocale };
}
