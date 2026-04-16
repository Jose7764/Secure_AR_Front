"use client";

import Badge from "./ui/Badge";
import StatusDot from "./ui/StatusDot";
import CollapsibleCard from "./ui/CollapsibleCard";
import { mockDevice, mdmStatusConfig } from "@/data/mockDevice";

export default function DeviceStatusCard() {
  const cfg = mdmStatusConfig[mockDevice.mdmStatus];
  const mdmVariant =
    mockDevice.mdmStatus === "homologado" ? "success" :
    mockDevice.mdmStatus === "bloqueado"  ? "danger"  : "warning";

  return (
    <CollapsibleCard
      title="Dispositivo"
      icon="🥽"
      headerRight={<Badge variant={mdmVariant} dot className="ml-1">{cfg.label}</Badge>}
      accentColor="indigo"
      defaultCollapsed
    >
      <div className="space-y-2 pt-1">
        {/* Detail rows */}
        {[
          ["Modelo",      mockDevice.name,              ""],
          ["Serial",      mockDevice.serial,            "font-mono text-xs"],
          ["Firmware",    mockDevice.firmwareVersion,    ""],
          ["Organização", mockDevice.organization,       ""],
          ["Localização", mockDevice.location,           ""],
          ["Emissor Cert",mockDevice.certificateIssuer, "text-xs"],
        ].map(([label, val, extra]) => (
          <div key={label} className="flex justify-between items-start gap-2">
            <span className="text-xs text-slate-500 shrink-0">{label}</span>
            <span className={`text-xs text-slate-300 text-right ${extra}`}>{val}</span>
          </div>
        ))}

        {/* Status indicators */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          {[
            { label: "mTLS",          active: mockDevice.mtlsActive,        texts: ["Ativo",       "Inativo"] },
            { label: "Criptografia",  active: mockDevice.encryptionEnabled,  texts: ["Habilitada",  "Desabilitada"] },
            { label: "Biometria",     active: mockDevice.biometricEnabled,   texts: ["Configurada", "Não configurada"] },
            { label: "Bloqueio auto", active: mockDevice.screenLockEnabled,  texts: ["Habilitado",  "Desabilitado"] },
          ].map(({ label, active, texts }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusDot status={active ? "active" : "inactive"} pulse={active} />
                <span className="text-xs text-slate-400">{label}</span>
              </div>
              <span className={`text-xs ${active ? "text-emerald-400" : "text-red-400"}`}>
                {active ? texts[0] : texts[1]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </CollapsibleCard>
  );
}
