type PickMarkProps = {
  size?: number;
  className?: string;
};

export default function PickMark({ size = 28, className }: PickMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={size}
      height={size}
      role="img"
      aria-label="Pick logo"
      className={className}
    >
      <path
        fill="currentColor"
        d="M128 28C176 28 214 60 214 104C214 156 178 203 136 224C131 227 125 227 120 224C78 203 42 156 42 104C42 60 80 28 128 28Z"
      />
      <text
        x="128"
        y="145"
        fill="#FFFFFF"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily='var(--font-sora), "Sora", "Inter", sans-serif'
        fontSize="119"
        fontWeight="600"
        letterSpacing="-0.04em"
      >
        P
      </text>
    </svg>
  );
}
