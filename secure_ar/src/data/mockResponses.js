export const FORBIDDEN_KEYWORDS = [
  "senha", "credencial", "token de acesso", "chave secreta",
  "dado pessoal", "cpf", "rg", "hack", "invasão", "exploit",
  "vulnerabilidade", "bypass", "contornar", "ataque", "invadir",
  "acesso indevido", "driblar", "burlar",
];

export const AI_RESPONSES = {
  producao: {
    text: `A produção atual da **REDUC** está em **142.000 bbl/dia**, operando a **94%** da capacidade instalada.

- Unidade U-201: manutenção programada nos próximos 3 dias
- Índice de eficiência energética: **+2,3%** acima da meta mensal
- Produção acumulada no mês: **4,26 M bbl** (104% da meta)

Os dados foram recuperados do SIGOPE em tempo real.`,
    sources: ["SIGOPE — Sistema de Gestão de Operações", "Relatório Operacional Jan/2024"],
    confidence: 0.97,
    category: "Operacional",
  },
  manutencao: {
    text: `Há **3 ordens de manutenção abertas** na sua área de responsabilidade:

1. **OS-2024-0892** — Troca de válvula V-312 *(Urgente — prazo: hoje)*
2. **OS-2024-0901** — Inspeção do compressor C-104 *(Programada — 18/01)*
3. **OS-2024-0914** — Calibração de instrumentos UTI-3 *(Rotina — 22/01)*

Tempo médio de atendimento da equipe: **2,4 horas**. Nenhuma ordem em atraso.`,
    sources: ["SAP PM — Plant Maintenance", "CMMS Petrobras"],
    confidence: 0.95,
    category: "Manutenção",
  },
  seguranca: {
    text: `**Status de segurança e SSO — REDUC:**

- Dias sem acidente com afastamento: **347 dias** 🏆
- Incidentes registrados no mês: **0**
- Nível de risco operacional atual: **Baixo**
- Próximo drill de emergência: **22/01/2024 às 14h**
- Conformidade de EPIs na área: **98,4%**

APR da UDA aprovada para o turno atual. Todos os procedimentos em vigor.`,
    sources: ["SGSSO — Gestão de SSO", "Safety Report Jan/2024"],
    confidence: 0.98,
    category: "Segurança",
  },
  relatorio: {
    text: `O **relatório operacional de Janeiro/2024** está disponível.

| Indicador       | Resultado | Meta  | Variação |
|-----------------|-----------|-------|----------|
| Produção        | 4,26 M bbl | 4,09 M bbl | +4,1% |
| Disponibilidade | 97,8%     | 96,5% | +1,3 p.p. |
| MTBF médio      | 1.842 h   | 1.800 h | +2,3% |
| OEE             | 91,4%     | 90,0% | +1,4 p.p. |

O relatório completo foi enviado para **c.mendes@petrobras.com.br**.`,
    sources: ["BI Petrobras", "Relatório Gerencial Jan/2024"],
    confidence: 0.96,
    category: "Relatórios",
  },
  default: {
    text: `Consultei as bases de dados corporativas autorizadas para o seu perfil (**Nível 3 — Confidencial**).

A consulta foi processada com sucesso através dos filtros de segurança DLP e sanitização de contexto. Os dados apresentados estão em conformidade com as políticas de acesso PBR-SEC-2024.

Para consultas mais específicas, informe o código da instalação, número da OS ou o período desejado.`,
    sources: ["Base de Conhecimento Corporativo", "Políticas PBR-SEC-2024"],
    confidence: 0.88,
    category: "Geral",
  },
};

/**
 * Returns the appropriate mock response for a given query string.
 * Returns { forbidden: true } if the query contains blocked keywords.
 */
export function getResponse(query) {
  const lower = query.toLowerCase();

  for (const kw of FORBIDDEN_KEYWORDS) {
    if (lower.includes(kw)) return { forbidden: true };
  }

  if (lower.match(/produ[cç]/))                          return AI_RESPONSES.producao;
  if (lower.match(/manut|ordem|os-|\bos\b|compressor/)) return AI_RESPONSES.manutencao;
  if (lower.match(/seguran|acidente|epi|sso|risco/))    return AI_RESPONSES.seguranca;
  if (lower.match(/relat|report|meta|indicador|kpi/))   return AI_RESPONSES.relatorio;

  return AI_RESPONSES.default;
}

export const PIPELINE_STEPS = [
  { id: "device",    label: "Dispositivo validado",       source: "MDM/UEM" },
  { id: "cert",      label: "Certificado verificado",     source: "PKI" },
  { id: "jwt",       label: "JWT validado",               source: "Auth Service" },
  { id: "ratelimit", label: "Rate limit OK",              source: "API Gateway" },
  { id: "authz",     label: "Autorização aprovada",       source: "IAM" },
  { id: "dlp",       label: "Filtro DLP",                 source: "DLP Engine" },
  { id: "sanitize",  label: "Sanitização de prompt",      source: "AI Gateway" },
  { id: "ai",        label: "IA processando",             source: "LLM Service" },
  { id: "response",  label: "Resposta segura entregue",   source: "AI Gateway" },
];
