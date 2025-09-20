import {
  Card,
  CardContent,
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
  CloudSun,
  Users,
  Boxes,
  Landmark,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardHeader } from './dashboard-header';

const features = [
  {
    title: 'Soil Analysis',
    description: 'Upload soil test results for detailed analysis.',
    href: '/soil-analysis',
    icon: TestTube,
  },
  {
    title: 'Crop Recommendation',
    description: 'Get AI-powered crop suggestions for your land.',
    href: '/crop-recommendation',
    icon: Leaf,
  },
  {
    title: 'Disease Identification',
    description: 'Identify crop diseases by uploading a photo.',
    href: '/disease-identification',
    icon: Scan,
  },
  {
    title: 'Fertilizer Recommendation',
    description: 'Find the best fertilizers for your crops and soil.',
    href: '/fertilizer-recommendation',
    icon: FlaskConical,
  },
  {
    title: 'Location Crop Guidance',
    description: 'Discover suitable crops based on your location.',
    href: '/crop-guidance',
    icon: MapPin,
  },
  {
    title: 'Fair Price Marketplace',
    description: 'Sell your grains and produce at a fair price.',
    href: '/marketplace',
    icon: Store,
  },
  {
    title: 'Marketplace Boost',
    description: 'Optimize your marketplace listings with AI.',
    href: '/marketplace-boost',
    icon: TrendingUp,
  },
  {
    title: 'Weather Forecast',
    description: 'Get real-time weather updates and alerts.',
    href: '/weather',
    icon: CloudSun,
  },
  {
    title: 'Community Forum',
    description: 'Connect with other farmers and share knowledge.',
    href: '/community',
    icon: Users,
  },
  {
    title: 'Inventory Management',
    description: 'Track your farm supplies like seeds and fertilizers.',
    href: '/inventory',
    icon: Boxes,
  },
  {
    title: 'Government Schemes',
    description: 'Find information on subsidies and programs.',
    href: '/schemes',
    icon: Landmark,
  },
];

export default function DashboardPage() {
  return (
    <main className="flex-1 p-4 sm:p-6">
      <DashboardHeader />
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
