import { MarketplaceBoostForm } from './marketplace-boost-form';

export default function MarketplaceBoostPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Marketplace Offer Boost
        </h1>
        <p className="text-muted-foreground">
          Use AI to analyze and improve the attractiveness of your marketplace listings.
        </p>
      </div>
      <MarketplaceBoostForm />
    </main>
  );
}
