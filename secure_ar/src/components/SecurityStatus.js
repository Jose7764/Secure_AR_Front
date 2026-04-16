"use client";

import StatusDot from "./ui/StatusDot";
import CollapsibleCard from "./ui/CollapsibleCard";
import { useSession } from "@/context/SessionContext";

const CHECKS = [
  { key: "device",  label: "Dispositivo Validado",  source: "MDM/UEM", icon: "🥽" },
  { key: "mtls",    label: "mTLS Ativo",             source: "API GW",  icon: "🔒" },
  { key: "session", label: "Sessão JWT Válida",       source: "Auth",    icon: "🎫" },
  { key: "access",  label: "Acesso Autorizado",       source: "IAM",     icon: "✅" },
];

export default function SecurityStatus({ onClose }) {
  const { sessionState, deviceValidated } = useSession();
  const auth = sessionState === "authenticated";

  const statuses = {
    device:  deviceValidated,
    mtls:    deviceValidated,
    session: auth,
    access:  auth,
  };

  const allGreen = Object.values(statuses).every(Boolean);

  const badge = (
    <span
      className={`text-xs font-bold px-2 py-0.5 rounded-full border ml-1 ${
        allGreen
          ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
          : "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
      }`}
    >
      {allGreen ? "SEGURO" : "PARCIAL"}
    </span>
  );

  return (
    <CollapsibleCard
      title="Postura de Segurança"
      onClose={onClose}
      icon="⚡"
      headerRight={badge}
      accentColor="emerald"
    >
      <div className="space-y-3 pt-1">
        {CHECKS.map(({ key, label, source, icon }) => {
          const ok = statuses[key];
          return (
            <div key={key} className="flex items-center gap-3">
              <StatusDot status={ok ? "active" : "inactive"} pulse={ok} />
              <span className="text-lg shrink-0 select-none">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 truncate">{label}</p>
                <p className="text-xs text-slate-600">{source}</p>
              </div>
              <span className={`text-xs font-medium shrink-0 ${ok ? "text-emerald-400" : "text-slate-600"}`}>
                {ok ? "OK" : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}
