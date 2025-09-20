import Image from 'next/image';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { products } from '@/lib/marketplace-data';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function MarketplacePage() {
  const t = useTranslations('Marketplace');
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden flex flex-col">
            <CardHeader className="p-0">
              <div className="relative aspect-[3/2] w-full">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.imageHint}
                />
              </div>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <CardTitle className="mb-1 text-lg font-semibold font-headline">
                {product.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t('soldBy')}: {product.seller}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <p className="text-xl font-bold text-primary">
                Rs {product.price.toFixed(2)}
              </p>
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                {t('addToCartButton')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
