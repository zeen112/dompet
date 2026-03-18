'use client';

import { useState, useMemo } from 'react';
import { useFinance } from '@/hooks/use-finance';
import { FinanceSummary } from '@/components/finance-summary';
import { WalletCard } from '@/components/wallet-card';
import { TransactionForm } from '@/components/transaction-form';
import { TransactionHistoryFiltered } from '@/components/transaction-history-filtered';
import { WalletDistributionChart } from '@/components/wallet-distribution-chart';
import { FinanceAnalytics } from '@/components/finance-analytics';
import { BudgetTracker } from '@/components/budget-tracker';
import { WeeklyTrend } from '@/components/weekly-trend';

export default function Home() {
  const { wallets, transactions, isLoaded, addTransaction, deleteTransaction } =
    useFinance();
  const [activeTab, setActiveTab] = useState<'overview' | 'add' | 'analytics' | 'history'>('overview');

  // Calculate total balance directly from all wallets (like SUM in Excel)
  const totalBalance = useMemo(() => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  }, [wallets]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-violet-50 to-slate-100">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <p className="text-gray-600 font-medium">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-slate-100">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="mb-8 animate-fade-in">
          <FinanceSummary totalBalance={totalBalance} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-8 flex-wrap overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '📊 Ringkasan' },
            { id: 'add', label: '➕ Tambah Transaksi' },
            { id: 'analytics', label: '📈 Analitik' },
            { id: 'history', label: '📜 Riwayat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-300/50 scale-105'
                  : 'bg-white text-gray-600 border border-slate-200 hover:border-violet-300 hover:shadow-md hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8 animate-fade-in">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Distribusi Saldo</h2>
                <WalletDistributionChart wallets={wallets} />
              </div>

              {/* Wallets Grid */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Daftar Dompet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wallets.map((wallet) => (
                    <div key={wallet.id} className="animate-fade-in">
                      <WalletCard wallet={wallet} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              {transactions.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Transaksi Terbaru</h2>
                  <TransactionHistoryFiltered
                    transactions={transactions.slice(0, 5)}
                    wallets={wallets}
                    onDelete={deleteTransaction}
                  />
                </div>
              )}
            </>
          )}

          {/* Add Transaction Tab */}
          {activeTab === 'add' && (
            <div className="max-w-2xl">
              <TransactionForm wallets={wallets} onAddTransaction={addTransaction} />
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <BudgetTracker transactions={transactions} wallets={wallets} />
              <WeeklyTrend transactions={transactions} />
              <FinanceAnalytics transactions={transactions} wallets={wallets} />
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <TransactionHistoryFiltered transactions={transactions} wallets={wallets} onDelete={deleteTransaction} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-50 to-violet-50 border-t border-slate-200 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2024 Pencatat Keuangan. Kelola keuangan Anda dengan bijak.</p>
        </div>
      </footer>
    </main>
  );
}
