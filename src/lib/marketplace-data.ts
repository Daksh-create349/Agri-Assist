import type { Product } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium Wheat',
    seller: 'Green Valley Farms',
    price: 250,
    currency: 'USD',
    imageUrl: getImage('wheat')?.imageUrl || '',
    imageHint: getImage('wheat')?.imageHint || '',
  },
  {
    id: '2',
    name: 'Organic Corn',
    seller: 'Sunshine Acres',
    price: 300,
    currency: 'USD',
    imageUrl: getImage('corn')?.imageUrl || '',
    imageHint: getImage('corn')?.imageHint || '',
  },
  {
    id: '3',
    name: 'Jasmine Rice',
    seller: 'Paddy Fields Cooperative',
    price: 450,
    currency: 'USD',
    imageUrl: getImage('rice')?.imageUrl || '',
    imageHint: getImage('rice')?.imageHint || '',
  },
  {
    id: '4',
    name: 'Non-GMO Soybeans',
    seller: 'Heartland Organics',
    price: 320,
    currency: 'USD',
    imageUrl: getImage('soybeans')?.imageUrl || '',
    imageHint: getImage('soybeans')?.imageHint || '',
  },
  {
    id: '5',
    name: 'Golden Barley',
    seller: 'Mountain View Grains',
    price: 280,
    currency: 'USD',
    imageUrl: getImage('barley')?.imageUrl || '',
    imageHint: getImage('barley')?.imageHint || '',
  },
  {
    id: '6',
    name: 'Roma Tomatoes',
    seller: 'Sunrise Produce',
    price: 180,
    currency: 'USD',
    imageUrl: getImage('tomatoes')?.imageUrl || '',
    imageHint: getImage('tomatoes')?.imageHint || '',
  },
];
