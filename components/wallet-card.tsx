'use client';

import { Wallet } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';

interface WalletCardProps {
  wallet: Wallet;
  onClick?: () => void;
}

export function WalletCard({ wallet, onClick }: WalletCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card
      onClick={onClick}
      className={`p-7 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 shadow-md hover:border-violet-300`}
    >
      <div className="flex items-start justify-between mb-6">
        <h3 className="font-bold text-gray-900 text-xl">{wallet.name}</h3>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-300 to-indigo-300 opacity-15 blur-sm"></div>
      </div>
      <div className="mt-6">
        <p className="text-xs font-semibold text-gray-600 mb-2 tracking-wide">TOTAL SALDO</p>
        <p className={`text-3xl font-bold ${wallet.balance >= 0 ? 'text-violet-700' : 'text-red-600'}`}>
          {formatCurrency(wallet.balance)}
        </p>
      </div>
      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-xs text-gray-500">
          {wallet.balance > 0 ? 'Saldo tersedia' : wallet.balance === 0 ? 'Saldo tidak tersedia' : 'Saldo minus'}
        </p>
      </div>
    </Card>
  );
}
