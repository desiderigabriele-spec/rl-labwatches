/**
 * Filigrana del quadrante: un grande quadrante disegnato a filo d'oro (cerchi, minuteria, numeri romani),
 * appena accennato dietro l'apertura e le intestazioni delle pagine. Solo decorazione.
 */
const GOLD = "#94742a";
const ROMAN = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
const pt = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return [+(Math.sin(a) * r).toFixed(2), +(-Math.cos(a) * r).toFixed(2)];
};

export default function Filigrana({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={`pointer-events-none select-none ${className}`} aria-hidden focusable="false">
      <circle r="96" fill="none" stroke={GOLD} strokeWidth=".6" />
      <circle r="90" fill="none" stroke={GOLD} strokeWidth=".3" />
      <circle r="62" fill="none" stroke={GOLD} strokeWidth=".25" />
      <circle r="1.4" fill={GOLD} />
      {Array.from({ length: 60 }, (_, i) => {
        const hour = i % 5 === 0;
        const [x1, y1] = pt(i * 6, 90);
        const [x2, y2] = pt(i * 6, hour ? 82 : 86.5);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GOLD} strokeWidth={hour ? 1.1 : 0.35} />;
      })}
      {ROMAN.map((r, i) => {
        const [x, y] = pt(i * 30, 72);
        return (
          <text key={r} x={x} y={y + 3} textAnchor="middle" fontFamily="var(--font-cormorant), Georgia, serif" fontSize="9" fill={GOLD}>
            {r}
          </text>
        );
      })}
    </svg>
  );
}
