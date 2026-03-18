'use client';

import { Card } from '@/components/ui/card';

interface FinanceSummaryProps {
  totalBalance: number;
}

export function FinanceSummary({ totalBalance }: FinanceSummaryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-violet-700 border-0 shadow-2xl shadow-violet-400/30 animate-fade-in relative overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24 blur-3xl"></div>
      
      <div className="relative z-10">
        <p className="text-violet-200 text-sm md:text-base font-medium mb-3 tracking-widest uppercase">Total Saldo</p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-balance drop-shadow-lg">{formatCurrency(totalBalance)}</h1>
        <p className="text-violet-100 text-xs md:text-sm mt-5 font-light">Pantau dan kelola aset finansial Anda dengan percaya diri</p>
      </div>
    </Card>
  );
}
