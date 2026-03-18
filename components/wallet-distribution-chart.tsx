'use client';

import { Wallet } from '@/hooks/use-finance';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WalletDistributionChartProps {
  wallets: Wallet[];
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f3e8ff'];

export function WalletDistributionChart({ wallets }: WalletDistributionChartProps) {
  const data = wallets
    .filter((w) => w.balance > 0)
    .map((wallet) => ({
      name: wallet.name,
      value: wallet.balance,
    }));

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-gray-500">
        <p>Tidak ada saldo di dompet manapun</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const renderCustomLabel = ({ value, x, y }: any) => {
    const text = `${formatCurrency(value)}`;
    return (
      <text
        x={x}
        y={y}
        fill="#374151"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {text}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={450}>
      <PieChart>
        <Pie
          data={data}
          cx="45%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={90}
          fill="#8b5cf6"
          dataKey="value"
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => formatCurrency(value)}
          contentStyle={{
            backgroundColor: '#f8f7ff',
            border: '1px solid #ddd6fe',
            borderRadius: '8px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => value}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
