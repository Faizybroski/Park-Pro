export function DiagonalStripesBg({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 -z-10 ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23f97316' stroke-width='1' stroke-opacity='0.15'%3E%3Cpath d='M0 40L40 0M-10 10L10 -10M30 50L50 30'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
