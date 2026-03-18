'use client';

import { Transaction, Wallet } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';
import { useState, useMemo } from 'react';

interface BudgetTrackerProps {
  transactions: Transaction[];
  wallets: Wallet[];
}

export function BudgetTracker({ transactions, wallets }: BudgetTrackerProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get current month transactions
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const monthlyTransactions = transactions.filter(
    (t) => new Date(t.date) >= currentMonthStart && new Date(t.date) <= currentMonthEnd
  );

  const monthlyExpense = useMemo(
    () =>
      monthlyTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const monthlyIncome = useMemo(
    () =>
      monthlyTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  // Estimate budget (60% of monthly income)
  const suggestedMonthlyBudget = Math.round(monthlyIncome * 0.6);
  const budgetUtilization = suggestedMonthlyBudget > 0 ? (monthlyExpense / suggestedMonthlyBudget) * 100 : 0;

  const getDaysLeft = () => {
    const daysInMonth = currentMonthEnd.getDate();
    const today = new Date().getDate();
    return daysInMonth - today;
  };

  const getAverageDailyExpense = () => {
    const daysUsed = new Date().getDate();
    return daysUsed > 0 ? monthlyExpense / daysUsed : 0;
  };

  const getProjectedMonthlyExpense = () => {
    const daysInMonth = currentMonthEnd.getDate();
    return getAverageDailyExpense() * daysInMonth;
  };

  const getStatusColor = () => {
    if (budgetUtilization > 100) return 'text-red-600';
    if (budgetUtilization > 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const getStatusBgColor = () => {
    if (budgetUtilization > 100) return 'bg-red-100 border-red-300';
    if (budgetUtilization > 80) return 'bg-orange-100 border-orange-300';
    return 'bg-green-100 border-green-300';
  };

  const getProgressBarColor = () => {
    if (budgetUtilization > 100) return 'bg-red-500';
    if (budgetUtilization > 80) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-6">
      {/* Budget Status */}
      <Card className={`p-6 rounded-2xl border-2 ${getStatusBgColor()}`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Status Anggaran Bulan Ini</p>
            <p className={`text-3xl font-bold ${getStatusColor()}`}>
              {budgetUtilization.toFixed(0)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Pengeluaran / Anggaran</p>
            <p className="text-lg font-semibold text-gray-800">
              {formatCurrency(monthlyExpense)} / {formatCurrency(suggestedMonthlyBudget)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
          />
        </div>
      </Card>

      {/* Budget Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Metrics */}
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Metrik Saat Ini</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Pengeluaran Hari Ini</p>
              <p className="font-semibold text-gray-800">{formatCurrency(getAverageDailyExpense())}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Rata-rata Harian</p>
              <p className="font-semibold text-gray-800">{formatCurrency(getAverageDailyExpense())}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Hari Tersisa</p>
              <p className="font-semibold text-gray-800">{getDaysLeft()} hari</p>
            </div>
          </div>
        </Card>

        {/* Projections */}
        <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Proyeksi Bulanan</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Pengeluaran Proyeksi</p>
              <p className={`font-semibold ${getProjectedMonthlyExpense() > suggestedMonthlyBudget ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(getProjectedMonthlyExpense())}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Target Anggaran</p>
              <p className="font-semibold text-gray-800">{formatCurrency(suggestedMonthlyBudget)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-700">Selisih Proyeksi</p>
              <p className={`font-semibold ${suggestedMonthlyBudget - getProjectedMonthlyExpense() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(suggestedMonthlyBudget - getProjectedMonthlyExpense())}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4">💡 Rekomendasi</h3>
        <div className="space-y-2">
          {budgetUtilization > 100 && (
            <p className="text-sm text-gray-700">
              ⚠️ Anda telah melampaui anggaran bulanan. Pertimbangkan untuk mengurangi pengeluaran di minggu-minggu mendatang.
            </p>
          )}
          {budgetUtilization > 80 && budgetUtilization <= 100 && (
            <p className="text-sm text-gray-700">
              ⚠️ Anda sudah menggunakan 80% dari anggaran. Hati-hati dengan pengeluaran di sisa bulan ini.
            </p>
          )}
          {getProjectedMonthlyExpense() > suggestedMonthlyBudget && (
            <p className="text-sm text-gray-700">
              📉 Berdasarkan pengeluaran saat ini, Anda mungkin akan melampaui anggaran. Pertimbangkan untuk berhemat.
            </p>
          )}
          {budgetUtilization <= 80 && getProjectedMonthlyExpense() <= suggestedMonthlyBudget && (
            <p className="text-sm text-gray-700">
              ✅ Pengeluaran Anda masih terkontrol. Lanjutkan kebiasaan pengeluaran yang bijak!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
