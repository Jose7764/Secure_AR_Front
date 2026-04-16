const VARIANTS = {
  default: "bg-slate-800 text-slate-300 border-slate-700",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  danger:  "bg-red-500/10   text-red-400   border-red-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  info:    "bg-cyan-500/10  text-cyan-400  border-cyan-500/30",
  primary: "bg-blue-500/10  text-blue-400  border-blue-500/30",
  purple:  "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

export default function Badge({ variant = "default", children, className = "", dot = false }) {
  const variantClass = VARIANTS[variant] ?? VARIANTS.default;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantClass} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "success" ? "bg-emerald-400" :
            variant === "danger"  ? "bg-red-400"     :
            variant === "warning" ? "bg-yellow-400"  :
            variant === "info"    ? "bg-cyan-400"    :
            "bg-slate-400"
          }`}
        />
      )}
      {children}
    </span>
  );
}
