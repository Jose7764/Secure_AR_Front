const TRACK = "bg-slate-800 rounded-full overflow-hidden";

const FILL = {
  primary: "bg-cyan-500",
  success: "bg-emerald-500",
  warning: "bg-yellow-500",
  danger:  "bg-red-500",
  purple:  "bg-purple-500",
};

export default function ProgressBar({
  value = 0,
  max = 100,
  variant = "primary",
  height = "h-1.5",
  label = "",
  showPercent = false,
  animate = false,
}) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const fill = FILL[variant] ?? FILL.primary;

  return (
    <div className="w-full">
      {(label || showPercent) && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{label}</span>
          {showPercent && <span>{pct}%</span>}
        </div>
      )}
      <div className={`w-full ${TRACK} ${height}`}>
        <div
          className={`${height} rounded-full ${fill} ${animate ? "transition-all duration-700 ease-out" : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
