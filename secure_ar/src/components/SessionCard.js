"use client";

import { useSession } from "@/context/SessionContext";
import StatusDot from "./ui/StatusDot";
import CollapsibleCard from "./ui/CollapsibleCard";

function formatExpiry(date) {
  if (!date) return "—";
  const diff = date - Date.now();
  if (diff <= 0) return "Expirado";
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  return `${h}h ${m}m restantes`;
}

export default function SessionCard() {
  const { user, sessionToken, sessionExpiry, sessionState } = useSession();
  const active = sessionState === "authenticated";

  return (
    <CollapsibleCard
      title="Sessão"
      icon={<StatusDot status={active ? "active" : "inactive"} pulse={active} size="md" />}
      headerRight={
        <span className={`text-xs font-bold ml-1 ${active ? "text-emerald-400" : "text-slate-600"}`}>
          {active ? "ATIVA" : "INATIVA"}
        </span>
      }
      accentColor="cyan"
    >
      {user ? (
        <div className="space-y-2 pt-1">
          {/* User row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
              {user.initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.shortName}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>

          {[
            ["Matrícula",  user.matricula],
            ["Clearance",  user.clearanceLevel],
            ["Unidade",    user.unit],
            ["Expira em",  formatExpiry(sessionExpiry)],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between text-xs">
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-300 font-medium text-right max-w-[55%] truncate">{val}</span>
            </div>
          ))}

          {sessionToken && (
            <div className="mt-2 pt-2 border-t border-slate-800">
              <p className="text-xs text-slate-600 mb-1">JWT Token</p>
              <p className="text-xs font-mono text-slate-600 break-all leading-relaxed line-clamp-2">
                {sessionToken.slice(0, 60)}…
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-slate-600 py-3 text-center">Nenhuma sessão ativa</p>
      )}
    </CollapsibleCard>
  );
}
