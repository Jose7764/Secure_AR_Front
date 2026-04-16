const COLORS = {
  active:     "bg-emerald-400",
  inactive:   "bg-slate-600",
  warning:    "bg-yellow-400",
  danger:     "bg-red-400",
  processing: "bg-cyan-400",
};

export default function StatusDot({ status = "inactive", pulse = false, size = "sm" }) {
  const color = COLORS[status] ?? COLORS.inactive;
  const dim = size === "md" ? "h-3 w-3" : "h-2 w-2";

  return (
    <span className={`relative flex ${dim}`}>
      {pulse && status === "active" && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${color} opacity-60`}
        />
      )}
      <span className={`relative inline-flex rounded-full ${dim} ${color}`} />
    </span>
  );
}
