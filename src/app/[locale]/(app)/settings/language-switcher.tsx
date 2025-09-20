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
    // This regex replaces the current locale in the path with the new one
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${value}`);
    router.replace(newPath);
  };

  return (
    <Select defaultValue={locale} onValueChange={onSelectChange}>
      <SelectTrigger>
        <SelectValue placeholder={t('selectPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{t('english')}</SelectItem>
        <SelectItem value="hi">{t('hindi')}</SelectItem>
        <SelectItem value="mr">{t('marathi')}</SelectItem>
      </SelectContent>
    </Select>
  );
}
