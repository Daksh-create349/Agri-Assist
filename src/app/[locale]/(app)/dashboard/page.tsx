import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChevronRight,
  FlaskConical,
  Leaf,
  MapPin,
  Scan,
  Store,
  TestTube,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  const features = [
    {
      title: t('features.soilAnalysis.title'),
      description: t('features.soilAnalysis.description'),
      href: '/soil-analysis',
      icon: TestTube,
    },
    {
      title: t('features.cropRecommendation.title'),
      description: t('features.cropRecommendation.description'),
      href: '/crop-recommendation',
      icon: Leaf,
    },
    {
      title: t('features.diseaseIdentification.title'),
      description: t('features.diseaseIdentification.description'),
      href: '/disease-identification',
      icon: Scan,
    },
    {
      title: t('features.fertilizerRecommendation.title'),
      description: t('features.fertilizerRecommendation.description'),
      href: '/fertilizer-recommendation',
      icon: FlaskConical,
    },
    {
      title: t('features.locationCropGuidance.title'),
      description: t('features.locationCropGuidance.description'),
      href: '/crop-guidance',
      icon: MapPin,
    },
    {
      title: t('features.fairPriceMarketplace.title'),
      description: t('features.fairPriceMarketplace.description'),
      href: '/marketplace',
      icon: Store,
    },
    {
      title: t('features.marketplaceBoost.title'),
      description: t('features.marketplaceBoost.description'),
      href: '/marketplace-boost',
      icon: TrendingUp,
    },
  ];

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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold font-headline">
                  {feature.title}
                </CardTitle>
                <feature.icon className="h-6 w-6 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
              <div className="flex items-center justify-end p-4 pt-0">
                 <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
