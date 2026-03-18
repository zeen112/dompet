'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Transaction {
  id: string;
  walletId: string;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  note: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string;
}

const WALLETS: Wallet[] = [
  { id: 'bca', name: 'BCA', balance: 0, icon: '' },
  { id: 'dana', name: 'Dana', balance: 0, icon: '' },
  { id: 'shopeepay', name: 'ShopeePay', balance: 0, icon: '' },
  { id: 'gopay', name: 'GoPay', balance: 0, icon: '' },
  { id: 'jago', name: 'Jago', balance: 0, icon: '' },
  { id: 'seabank', name: 'Seabank', balance: 0, icon: '' },
];

const STORAGE_KEY = 'finance_app_data';

interface StorageData {
  wallets: Wallet[];
  transactions: Transaction[];
}

export function useFinance() {
  const [wallets, setWallets] = useState<Wallet[]>(WALLETS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: StorageData = JSON.parse(stored);
        setWallets(data.wallets);
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Failed to parse stored data:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save data to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ wallets, transactions }));
    }
  }, [wallets, transactions, isLoaded]);

  const addTransaction = useCallback(
    (walletId: string, type: 'income' | 'expense', amount: number, date: string, note: string) => {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        walletId,
        type,
        amount,
        date,
        note,
        createdAt: new Date().toISOString(),
      };

      setTransactions((prev) => [newTransaction, ...prev]);

      // Update wallet balance
      setWallets((prev) =>
        prev.map((wallet) => {
          if (wallet.id === walletId) {
            const newBalance = type === 'income' ? wallet.balance + amount : wallet.balance - amount;
            return { ...wallet, balance: newBalance };
          }
          return wallet;
        })
      );
    },
    []
  );

  const deleteTransaction = useCallback((transactionId: string) => {
    setTransactions((prev) => {
      const transaction = prev.find((t) => t.id === transactionId);
      if (!transaction) return prev;

      // Revert wallet balance
      setWallets((wallets) =>
        wallets.map((wallet) => {
          if (wallet.id === transaction.walletId) {
            const revertedAmount =
              transaction.type === 'income'
                ? wallet.balance - transaction.amount
                : wallet.balance + transaction.amount;
            return { ...wallet, balance: revertedAmount };
          }
          return wallet;
        })
      );

      return prev.filter((t) => t.id !== transactionId);
    });
  }, []);

  const updateTransaction = useCallback(
    (
      transactionId: string,
      type: 'income' | 'expense',
      amount: number,
      date: string,
      note: string
    ) => {
      setTransactions((prev) => {
        const oldTransaction = prev.find((t) => t.id === transactionId);
        if (!oldTransaction) return prev;

        // Revert old transaction
        setWallets((wallets) =>
          wallets.map((wallet) => {
            if (wallet.id === oldTransaction.walletId) {
              const revertedAmount =
                oldTransaction.type === 'income'
                  ? wallet.balance - oldTransaction.amount
                  : wallet.balance + oldTransaction.amount;
              return { ...wallet, balance: revertedAmount };
            }
            return wallet;
          })
        );

        // Apply new transaction
        setWallets((wallets) =>
          wallets.map((wallet) => {
            if (wallet.id === oldTransaction.walletId) {
              const newBalance =
                type === 'income'
                  ? wallet.balance + amount
                  : wallet.balance - amount;
              return { ...wallet, balance: newBalance };
            }
            return wallet;
          })
        );

        return prev.map((t) =>
          t.id === transactionId
            ? { ...t, type, amount, date, note }
            : t
        );
      });
    },
    []
  );

  const getWalletBalance = useCallback(
    (walletId: string) => {
      return wallets.find((w) => w.id === walletId)?.balance || 0;
    },
    [wallets]
  );

  const getTotalBalance = useCallback(() => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  }, [wallets]);

  const getWalletTransactions = useCallback(
    (walletId: string) => {
      return transactions.filter((t) => t.walletId === walletId);
    },
    [transactions]
  );

  return {
    wallets,
    transactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    getWalletBalance,
    getTotalBalance,
    getWalletTransactions,
  };
}
