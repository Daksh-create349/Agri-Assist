'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Droplets, Leaf, FlaskConical, Thermometer } from 'lucide-react';

type SoilData = {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
};

const initialData: SoilData = {
  ph: 6.8,
  nitrogen: 25,
  phosphorus: 50,
  potassium: 150,
  temperature: 22,
};

const metrics = [
    { key: 'ph' as keyof SoilData, label: 'pH Level', icon: FlaskConical, unit: '' },
    { key: 'nitrogen' as keyof SoilData, label: 'Nitrogen', icon: Leaf, unit: 'ppm' },
    { key: 'phosphorus' as keyof SoilData, label: 'Phosphorus', icon: Flame, unit: 'ppm' },
    { key: 'potassium' as keyof SoilData, label: 'Potassium', icon: Droplets, unit: 'ppm' },
    { key: 'temperature' as keyof SoilData, label: 'Soil Temperature', icon: Thermometer, unit: '°C' },
];

export function MyPollClient() {
  const [data, setData] = useState<SoilData>(initialData);
  const [status, setStatus] = useState<'connecting' | 'live' | 'disconnected'>('connecting');

  useEffect(() => {
    const connectTimeout = setTimeout(() => setStatus('live'), 2000);

    const interval = setInterval(() => {
      setData((prevData) => ({
        ph: parseFloat((prevData.ph + (Math.random() - 0.5) * 0.1).toFixed(2)),
        nitrogen: Math.max(0, prevData.nitrogen + (Math.random() - 0.5) * 2),
        phosphorus: Math.max(0, prevData.phosphorus + (Math.random() - 0.5) * 4),
        potassium: Math.max(0, prevData.potassium + (Math.random() - 0.5) * 10),
        temperature: parseFloat((prevData.temperature + (Math.random() - 0.5) * 0.5).toFixed(1)),
      }));
    }, 3000); // Update every 3 seconds

    return () => {
      clearTimeout(connectTimeout);
      clearInterval(interval);
    };
  }, []);

  const getStatusBadge = () => {
    switch (status) {
      case 'connecting':
        return <Badge variant="secondary">Connecting...</Badge>;
      case 'live':
        return <Badge className="bg-green-500 text-white hover:bg-green-500/90">Live</Badge>;
      case 'disconnected':
        return <Badge variant="destructive">Disconnected</Badge>;
    }
  };

  return (
    <div>
        <div className="mb-4 flex items-center gap-4">
            <h2 className="text-xl font-semibold">Sensor Status</h2>
            {getStatusBadge()}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data[metric.key].toFixed(metric.unit ? 0 : 1)} {metric.unit}
              </div>
              <p className="text-xs text-muted-foreground">
                Real-time measurement from sensor
              </p>
            </CardContent>
          </Card>
        ))}
         <Card className="sm:col-span-2 lg:col-span-1">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Device Info</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-sm text-muted-foreground space-y-2">
                    <p><span className="font-semibold text-foreground">Model:</span> AgriSensor Pro v1.2</p>
                    <p><span className="font-semibold text-foreground">Serial:</span> AS-9876-XYZ-001</p>
                    <p><span className="font-semibold text-foreground">Last Sync:</span> {new Date().toLocaleTimeString()}</p>
                </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
