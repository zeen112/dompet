'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Wallet } from '@/hooks/use-finance';
import { AlertDialog } from '@/components/alert-dialog';
import { AmountDisplay } from '@/components/amount-display';

interface TransactionFormProps {
  wallets: Wallet[];
  onAddTransaction: (
    walletId: string,
    type: 'income' | 'expense',
    amount: number,
    date: string,
    note: string
  ) => void;
}

export function TransactionForm({ wallets, onAddTransaction }: TransactionFormProps) {
  const [selectedWallet, setSelectedWallet] = useState(wallets[0]?.id || '');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [amountDisplay, setAmountDisplay] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAlert, setShowAlert] = useState(false);

  const formatNumberDisplay = (value: string) => {
    // Remove all non-digit characters except comma for decimal
    const parts = value.split(',');
    const integerPart = parts[0].replace(/\D/g, '');
    const decimalPart = parts[1] ? parts[1].replace(/\D/g, '').slice(0, 2) : '';
    
    if (!integerPart) return '';
    
    // Format integer part with thousands separator
    const formattedInteger = new Intl.NumberFormat('id-ID').format(parseInt(integerPart));
    
    // Combine with decimal part
    return decimalPart ? `${formattedInteger},${decimalPart}` : formattedInteger;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits and comma
    const cleanValue = value.replace(/[^\d,]/g, '');
    
    // Split by comma to handle decimal
    const parts = cleanValue.split(',');
    let numericValue = parts[0].replace(/,/g, '');
    
    // Convert to proper numeric value (with decimal)
    if (parts[1]) {
      numericValue = numericValue + '.' + parts[1].slice(0, 2);
    }
    
    setAmount(numericValue);
    setAmountDisplay(formatNumberDisplay(cleanValue));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedWallet) {
      newErrors.wallet = 'Pilih dompet terlebih dahulu';
    }
    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Jumlah harus lebih dari 0';
    }
    if (!date) {
      newErrors.date = 'Tanggal harus dipilih';
    }
    if (type === 'expense' && !note.trim()) {
      newErrors.note = 'Catatan pengeluaran wajib diisi';
    }

    // Check if wallet is empty for expenses
    const selectedWalletData = wallets.find((w) => w.id === selectedWallet);
    if (type === 'expense' && selectedWalletData && selectedWalletData.balance <= 0) {
      setShowAlert(true);
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onAddTransaction(selectedWallet, type, parseFloat(amount), date, note);

    setAmount('');
    setAmountDisplay('');
    setNote('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('expense');
    setErrors({});
  };

  const selectedWalletData = wallets.find((w) => w.id === selectedWallet);

  return (
    <>
      <AlertDialog
        isOpen={showAlert}
        title="Dompet Kosong"
        description={`Dompet ${selectedWalletData?.name} tidak memiliki saldo cukup untuk melakukan pengeluaran. Silakan tambahkan pemasukan terlebih dahulu atau pilih dompet lain.`}
        onClose={() => setShowAlert(false)}
      />
      <Card className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-violet-50 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Transaksi</h2>
          <p className="text-gray-600 text-sm mt-1">Kelola pemasukan dan pengeluaran Anda dengan mudah</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Pilih Dompet</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 font-medium hover:border-slate-400"
          >
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
          {errors.wallet && <p className="text-red-500 text-sm mt-2">{errors.wallet}</p>}
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tipe Transaksi</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setNote('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                type === 'income'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white border border-green-300 text-green-600 hover:bg-green-50'
              }`}
            >
              + Pemasukan
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                type === 'expense'
                  ? 'bg-red-500 text-white shadow-md'
                  : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              - Pengeluaran
            </button>
          </div>
        </div>

        {/* Amount Display */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Jumlah Nominal</label>
          <AmountDisplay amount={amount} amountDisplay={amountDisplay} />
          {errors.amount && <p className="text-red-500 text-sm mt-3">{errors.amount}</p>}
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Input Nominal</label>
          <Input
            type="text"
            inputMode="numeric"
            value={amountDisplay}
            onChange={handleAmountChange}
            placeholder="Ketik nominal (Rp)"
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 text-lg font-semibold hover:border-slate-400"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Tanggal Transaksi</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 hover:border-slate-400"
          />
          {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
        </div>

        {/* Note - Only show for expenses */}
        {type === 'expense' && (
          <div className="animate-slide-up">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Catatan Pengeluaran <span className="text-red-500 font-bold">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Apa pengeluaran ini untuk? (Wajib diisi)"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all duration-300 resize-none hover:border-slate-400"
              rows={3}
            />
            {errors.note && <p className="text-red-500 text-sm mt-2">{errors.note}</p>}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold py-4 rounded-xl transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl text-lg"
        >
          Simpan Transaksi
        </Button>
      </form>
    </Card>
    </>
  );
}
