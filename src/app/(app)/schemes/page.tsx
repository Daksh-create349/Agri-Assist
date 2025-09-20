import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

const schemes = [
  {
    id: 'pm-kisan',
    title: 'PM-KISAN Scheme',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'An income support scheme for all landholding farmer families. The scheme provides a financial benefit of ₹6000 per year.',
    tags: ['Income Support', 'All Farmers'],
    link: '#',
  },
  {
    id: 'pmfby',
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'A crop insurance scheme to provide comprehensive insurance cover against failure of the crop thus helping in stabilising the income of the farmers.',
    tags: ['Crop Insurance', 'Risk Management'],
    link: '#',
  },
  {
    id: 'kcc',
    title: 'Kisan Credit Card (KCC)',
    ministry: 'Ministry of Finance',
    description: 'Provides farmers with timely access to credit for their cultivation and other needs.',
    tags: ['Credit', 'Financial Aid'],
    link: '#',
  },
];

export default function SchemesPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Government Schemes
        </h1>
        <p className="text-muted-foreground">
          Information on subsidies, insurance, and other programs for farmers.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {schemes.map((scheme) => (
          <AccordionItem value={scheme.id} key={scheme.id}>
            <AccordionTrigger>
              <div className="text-left">
                <p className="text-lg font-semibold">{scheme.title}</p>
                <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p>{scheme.description}</p>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        {scheme.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                    </div>
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        Official Link <ExternalLink className="h-4 w-4" />
                    </a>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  );
}
