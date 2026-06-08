interface ProgressBarProps {
  current: number;
  target: number;
}

export default function ProgressBar({ current, target }: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isFull = percentage >= 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>
          {current}/{target}명
        </span>
        <span className={isFull ? "text-green-600 font-medium" : ""}>
          {isFull ? "모집 완료" : `${Math.round(percentage)}%`}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-1.5 rounded-full transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: isFull ? "#059669" : "#1e40af",
          }}
        />
      </div>
    </div>
  );
}
