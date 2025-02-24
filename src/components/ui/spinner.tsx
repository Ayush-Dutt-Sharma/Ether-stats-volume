export function Spinner({ size = 24, className }: { size?: number; className?: string }) {
    return (
      <div
        className={`animate-spin rounded-full border-4 border-gray-300 border-t-primary ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }
  