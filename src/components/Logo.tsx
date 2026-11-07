// Logo provvisorio (testuale). Sostituire con il logo reale in /public/logo.svg.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className="font-display text-2xl font-semibold tracking-wide gold-text">RL</span>
      <span className="text-[0.62rem] tracking-[0.38em] uppercase text-ivory/80">Lab Watches</span>
    </span>
  );
}
