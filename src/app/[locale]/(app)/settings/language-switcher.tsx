'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

export function LanguageSwitcher() {
  const t = useTranslations('Settings.language');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${value}`);
    router.replace(newPath);
  };

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('selectPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('english')}</SelectItem>
        <SelectItem value="es">{t('spanish')}</SelectItem>
        <SelectItem value="fr">{t('french')}</SelectItem>
        <SelectItem value="de">{t('german')}</SelectItem>
        <SelectItem value="hi">{t('hindi')}</SelectItem>
        <SelectItem value="mr">{t('marathi')}</SelectItem>
        <SelectItem value="ml">{t('malayalam')}</SelectItem>
        <SelectItem value="zh">{t('mandarin')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
