interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-label="Progresso de hábitos completados nesse dia"
      aria-valuenow={progress}
      className="h-3 rounded-xl bg-violet-600 w-3/4"
      style={{
        width: `${progress}%`,
      }}
    />
  );
}
