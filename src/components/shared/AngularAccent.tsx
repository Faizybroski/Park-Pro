// components/AngularAccent.tsx
type Side = "left" | "right";

interface AngularAccentProps {
  side: Side;
  className?: string;
}

export function AngularAccent({ side, className = "" }: AngularAccentProps) {
  const isRight = side === "right";

  return (
    <div
      className={`pointer-events-none absolute top-0 ${
        isRight ? "-right-32" : "-left-32"
      } h-full w-72 overflow-visible ${className}`}
    >
      <div
        className={`absolute inset-0 bg-orange-100 opacity-60`}
        style={{
          transform: `rotate(${isRight ? "15deg" : "-15deg"})`,
          transformOrigin: isRight ? "top right" : "top left",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
