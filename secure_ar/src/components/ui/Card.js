export default function Card({ children, className = "", glow = false, hover = false }) {
  return (
    <div
      className={[
        "bg-slate-900 border border-slate-700/50 rounded-xl",
        glow  && "glow-cyan",
        hover && "transition-all duration-200 hover:border-slate-600 hover:glow-cyan",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
