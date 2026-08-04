export function BrandMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="brand-mark"
    >
      <rect x="2" y="10" width="5" height="12" rx="1.5" fill="var(--violet-400)" />
      <rect x="9.5" y="4" width="5" height="18" rx="1.5" fill="var(--magenta-400)" />
      <rect x="17" y="13" width="5" height="9" rx="1.5" fill="var(--amber-400)" />
    </svg>
  );
}