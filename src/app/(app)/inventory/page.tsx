'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { AddInventoryItemDialog } from './add-inventory-item-dialog';

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
};

const initialInventoryItems: InventoryItem[] = [
  { id: 1, name: 'Urea Fertilizer', category: 'Fertilizer', quantity: 50, unit: 'kg', status: 'In Stock' },
  { id: 2, name: 'Wheat Seeds (HD-3226)', category: 'Seeds', quantity: 200, unit: 'kg', status: 'In Stock' },
  { id: 3, name: 'Neem Oil Pesticide', category: 'Pesticide', quantity: 5, unit: 'liters', status: 'Low Stock' },
  { id: 4, name: 'Tractor Diesel', category: 'Fuel', quantity: 100, unit: 'liters', status: 'In Stock' },
  { id: 5, name: 'Corn Seeds (Pioneer P3396)', category: 'Seeds', quantity: 0, unit: 'kg', status: 'Out of Stock' },
];

const getStatus = (quantity: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Low Stock';
    return 'In Stock';
}

const getStatusVariant = (status: string) => {
    switch (status) {
        case 'In Stock': return 'default';
        case 'Low Stock': return 'secondary';
        case 'Out of Stock': return 'destructive';
        default: return 'outline';
    }
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddItem = (newItem: Omit<InventoryItem, 'id' | 'status'>) => {
    const fullItem: InventoryItem = {
      ...newItem,
      id: items.length + 1,
      status: getStatus(newItem.quantity),
    };
    setItems(prevItems => [...prevItems, fullItem]);
  };

  return (
    <main className="flex-1 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
            Inventory Management
            </h1>
            <p className="text-muted-foreground">
            Keep track of your seeds, fertilizers, and other supplies.
            </p>
        </div>
        <AddInventoryItemDialog onAddItem={handleAddItem}>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </AddInventoryItemDialog>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
