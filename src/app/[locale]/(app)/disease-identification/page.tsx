import { DiseaseIdentificationForm } from './disease-identification-form';
import { useTranslations } from 'next-intl';

export default function DiseaseIdentificationPage() {
  const t = useTranslations('DiseaseIdentification');
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {t('title')}
        </h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>
      <DiseaseIdentificationForm />
    </main>
  );
}
