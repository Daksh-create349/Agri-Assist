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

export default function MarketplacePage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Fair Price Marketplace
        </h1>
        <p className="text-muted-foreground">
          Buy and sell grains and produce directly from farmers.
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
                Sold by: {product.seller}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <p className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </p>
              <Button size="sm">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
