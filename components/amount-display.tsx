'use client';

interface AmountDisplayProps {
  amount: string;
  amountDisplay: string;
}

export function AmountDisplay({ amount, amountDisplay }: AmountDisplayProps) {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-2xl p-6 border border-violet-200 transition-all duration-300">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-gray-700">Rp</span>
          <span className="text-4xl md:text-5xl font-bold text-violet-700 tabular-nums">
            {amountDisplay || '0'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          {amount ? `Total nominal: ${amountDisplay}` : 'Masukkan nominal'}
        </p>
      </div>
    </div>
  );
}
