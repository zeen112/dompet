'use client';

import { Transaction, Wallet } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TransactionHistoryFilteredProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onDelete: (id: string) => void;
}

export function TransactionHistoryFiltered({ transactions, wallets, onDelete }: TransactionHistoryFilteredProps) {
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || '');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getWalletName = (walletId: string) => {
    return wallets.find((w) => w.id === walletId)?.name || 'Unknown';
  };

  const filteredTransactions = selectedWalletId
    ? transactions.filter((t) => t.walletId === selectedWalletId)
    : transactions;

  const incomeTotal = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseTotal = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Card className="rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Riwayat Transaksi</h2>
        </div>

        {/* Wallet Filter Dropdown */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter Dompet</label>
          <select
            value={selectedWalletId}
            onChange={(e) => setSelectedWalletId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-violet-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium"
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <p className="text-sm text-gray-600 mb-1">Pemasukan</p>
            <p className="text-lg font-bold text-green-600">{formatCurrency(incomeTotal)}</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-red-200">
            <p className="text-sm text-gray-600 mb-1">Pengeluaran</p>
            <p className="text-lg font-bold text-red-600">{formatCurrency(expenseTotal)}</p>
          </div>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Belum ada transaksi untuk dompet ini</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-white rounded-xl p-4 border border-violet-100 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-800">
                            {getWalletName(transaction.walletId)}
                          </p>
                          <p
                            className={`font-bold text-lg ${
                              transaction.type === 'income'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {formatDate(transaction.date)}
                        </p>
                        {transaction.note && (
                          <button
                            onClick={() =>
                              setExpandedId(
                                expandedId === transaction.id ? null : transaction.id
                              )
                            }
                            className="text-sm text-violet-600 hover:text-violet-700 underline transition-colors"
                          >
                            {expandedId === transaction.id ? 'Sembunyikan' : 'Lihat'} catatan
                          </button>
                        )}
                        {expandedId === transaction.id && transaction.note && (
                          <div className="mt-3 p-3 bg-violet-50 rounded-lg border border-violet-200">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                              {transaction.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (
                          window.confirm('Yakin ingin menghapus transaksi ini?')
                        ) {
                          onDelete(transaction.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors ml-2"
                      title="Hapus transaksi"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
}
