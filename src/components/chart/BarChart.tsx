import clsx from 'clsx';

interface BarChartProps {
  total: number;
  value: number;
  height?: string;
}
export default function BarChart({ total, value, height }: BarChartProps) {
  const valuePercentage = (value / total) * 100;
  const valueBarWidth = `${valuePercentage ? valuePercentage : 0}%`;
  return (
    <div className="relative w-full">
      <div
        style={{ width: valueBarWidth }}
        className={clsx('absolute bg-primary w-full z-20', height || 'h-0.5')}
      />
      <div
        className={clsx('absolute bg-dark-400 w-full z-10', height || 'h-0.5')}
      />
    </div>
  );
}
