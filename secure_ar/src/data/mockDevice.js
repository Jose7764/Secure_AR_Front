export const mockDevice = {
  name: "Magic Leap 2",
  serial: "ML2-PBR-2024-0047",
  model: "ML2-Enterprise",
  firmwareVersion: "1.4.2-corp",
  mdmStatus: "homologado", // 'homologado' | 'bloqueado' | 'nao_conforme'
  certificateStatus: "valid",
  certificateExpiry: "2025-12-31",
  certificateIssuer: "Petrobras Internal CA",
  lastMdmSync: "2024-01-15T08:29:50Z",
  mtlsActive: true,
  encryptionEnabled: true,
  screenLockEnabled: true,
  biometricEnabled: true,
  organization: "Petrobras S.A.",
  location: "REDUC — Duque de Caxias, RJ",
  ipAddress: "10.20.48.112",
  macAddress: "AC:DE:48:00:0A:2F",
};

export const bootSteps = [
  { id: 1, label: "Inicializando sistema operacional",      icon: "⚙" },
  { id: 2, label: "Verificando integridade do firmware",    icon: "🔍" },
  { id: 3, label: "Conectando à rede corporativa",          icon: "📡" },
  { id: 4, label: "Consultando MDM/UEM (MobileIron)",       icon: "🛡" },
  { id: 5, label: "Validando certificado do dispositivo",   icon: "🔐" },
  { id: 6, label: "Estabelecendo canal mTLS",               icon: "🔒" },
  { id: 7, label: "Aplicando políticas de segurança",       icon: "📋" },
];

export const mdmStatusConfig = {
  homologado: {
    label: "HOMOLOGADO",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    description: "Dispositivo em conformidade com as políticas corporativas.",
  },
  bloqueado: {
    label: "BLOQUEADO",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-400",
    description: "Acesso negado. Dispositivo bloqueado pelo MDM.",
  },
  nao_conforme: {
    label: "NÃO CONFORME",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    dot: "bg-yellow-400",
    description: "Dispositivo fora das políticas. Requer intervenção.",
  },
};
