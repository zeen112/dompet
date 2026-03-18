'use client';

import { Transaction, Wallet } from '@/hooks/use-finance';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  wallets: Wallet[];
  onDelete: (id: string) => void;
}

export function TransactionHistory({ transactions, wallets, onDelete }: TransactionHistoryProps) {
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

  if (transactions.length === 0) {
    return (
      <Card className="p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 text-center">
        <p className="text-gray-600">Belum ada transaksi</p>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl bg-gradient-to-br from-violet-50 to-violet-100 border border-violet-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Riwayat Transaksi</h2>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl p-4 border border-violet-100 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start flex-1">
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
      </div>
    </Card>
  );
}
