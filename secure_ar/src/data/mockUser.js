export const mockUser = {
  id: "usr-4892",
  name: "Carlos Eduardo Mendes",
  shortName: "Carlos Mendes",
  initials: "CE",
  role: "Engenheiro de Operações Sr.",
  department: "Operações & Refinamento",
  matricula: "PBR-ENG-004892",
  clearanceLevel: "Nível 3 — Confidencial",
  email: "c.mendes@petrobras.com.br",
  phone: "+55 21 3333-0047",
  permissions: [
    "consulta_operacional",
    "relatorios_gerenciais",
    "ordens_manutencao",
    "dashboard_producao",
    "logs_auditoria_proprios",
  ],
  lastLogin: "2024-01-14T18:22:00Z",
  unit: "REDUC",
};

export const mockCredentials = {
  username: "c.mendes",
  // accepts any non-empty password in the prototype
  mfaCode: "123456",
  pin: "1234",
};
