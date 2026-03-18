'use client';

import { Transaction, Wallet } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';

interface FinanceAnalyticsProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export function FinanceAnalytics({ transactions, wallets }: FinanceAnalyticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // Get current month transactions
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthlyTransactions = transactions.filter((t) => new Date(t.date) >= currentMonthStart);
  const monthlyIncome = monthlyTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const monthlyExpense = monthlyTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Top expense categories
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense' && t.note)
    .reduce(
      (acc, t) => {
        const category = t.note.split('\n')[0];
        acc[category] = (acc[category] || 0) + t.amount;
        return acc;
      },
      {} as Record<string, number>
    );

  const topCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <p className="text-sm text-gray-700 mb-2">Total Pemasukan</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-gray-600 mt-2">Sepanjang waktu</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
          <p className="text-sm text-gray-700 mb-2">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          <p className="text-xs text-gray-600 mt-2">Sepanjang waktu</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">Saldo Bersih</p>
          <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(netBalance)}
          </p>
          <p className="text-xs text-gray-600 mt-2">Sepanjang waktu</p>
        </Card>

        <Card className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
          <p className="text-sm text-gray-700 mb-2">Saldo Total</p>
          <p className="text-2xl font-bold text-violet-600">{formatCurrency(totalBalance)}</p>
          <p className="text-xs text-gray-600 mt-2">Dari semua dompet</p>
        </Card>
      </div>

      {/* Monthly Overview */}
      <Card className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Ringkasan Bulan Ini</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Pemasukan</p>
            <p className="text-2xl font-bold text-green-600 text-balance">{formatCurrency(monthlyIncome)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Pengeluaran</p>
            <p className="text-2xl font-bold text-red-600 text-balance">{formatCurrency(monthlyExpense)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-sm font-medium text-gray-600 mb-2">Sisa Bulan Ini</p>
            <p className={`text-2xl font-bold text-balance ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(monthlyIncome - monthlyExpense)}
            </p>
          </div>
        </div>
      </Card>

      {/* Top Expense Categories */}
      {topCategories.length > 0 && (
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Kategori Pengeluaran Terbesar</h3>
          <div className="space-y-3">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="flex items-center justify-between bg-white rounded-lg p-3 border border-violet-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 truncate max-w-xs">{category}</p>
                </div>
                <p className="font-semibold text-red-600">{formatCurrency(amount)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Statistics */}
      <Card className="p-6 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Statistik</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-2xl font-bold text-gray-800">{transactions.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Transaksi</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-2xl font-bold text-green-600">
              {transactions.filter((t) => t.type === 'income').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pemasukan</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-2xl font-bold text-red-600">
              {transactions.filter((t) => t.type === 'expense').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Pengeluaran</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-violet-100 text-center">
            <p className="text-2xl font-bold text-violet-600">{wallets.length}</p>
            <p className="text-sm text-gray-600 mt-1">Dompet Aktif</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
