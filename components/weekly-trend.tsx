'use client';

import { Transaction } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';
import { useMemo } from 'react';

interface WeeklyTrendProps {
  transactions: Transaction[];
}

export function WeeklyTrend({ transactions }: WeeklyTrendProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const weeklyData = useMemo(() => {
    const today = new Date();
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const data = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      const dayTransactions = transactions.filter((t) => {
        const transDate = new Date(t.date);
        return (
          transDate.toDateString() === date.toDateString()
        );
      });

      const income = dayTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: date,
        day: days[date.getDay()],
        income,
        expense,
        net: income - expense,
        dayDate: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric' }),
      });
    }

    return data;
  }, [transactions]);

  const maxValue = Math.max(
    ...weeklyData.map((d) => Math.max(d.income, d.expense)),
    1
  );

  return (
    <Card className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-violet-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Tren 7 Hari Terakhir</h3>

      <div className="space-y-6">
        {/* Chart */}
        <div className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm">
          <div className="flex items-end justify-between gap-2 h-64">
            {weeklyData.map((data, idx) => {
              const incomeHeight = (data.income / maxValue) * 100;
              const expenseHeight = (data.expense / maxValue) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="flex items-end justify-center gap-1 h-full w-full">
                    {/* Income Bar */}
                    {data.income > 0 && (
                      <div
                        className="bg-green-400 rounded-t opacity-75 hover:opacity-100 transition-opacity flex-1 max-w-6"
                        style={{ height: `${Math.max(incomeHeight, 2)}%` }}
                        title={`Pemasukan: ${formatCurrency(data.income)}`}
                      />
                    )}
                    {/* Expense Bar */}
                    {data.expense > 0 && (
                      <div
                        className="bg-red-400 rounded-t opacity-75 hover:opacity-100 transition-opacity flex-1 max-w-6"
                        style={{ height: `${Math.max(expenseHeight, 2)}%` }}
                        title={`Pengeluaran: ${formatCurrency(data.expense)}`}
                      />
                    )}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-2">{data.day}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2 overflow-x-auto">
          {weeklyData.map((data, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3 border border-slate-200 hover:border-violet-300 min-w-full transition-all duration-300 hover:shadow-md">
              <div className="min-w-max">
                <p className="font-semibold text-gray-800">{data.day}</p>
                <p className="text-xs text-gray-500">{data.dayDate}</p>
              </div>
              <div className="flex items-center gap-2 md:gap-6 min-w-max">
                <div className="text-right">
                  <p className="text-xs text-gray-600">Masuk</p>
                  <p className="font-semibold text-green-600 text-sm">{formatCurrency(data.income)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Keluar</p>
                  <p className="font-semibold text-red-600 text-sm">{formatCurrency(data.expense)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">Bersih</p>
                  <p className={`font-semibold text-sm ${data.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatCurrency(data.net)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
