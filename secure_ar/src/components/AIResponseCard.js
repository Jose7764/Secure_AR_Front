"use client";

export default function AIResponseCard({ query, response }) {
  if (!response) return null;

  return (
    <div className="space-y-3 animate-fade-in-up">
      {/* User query bubble */}
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5">
          <p className="text-sm text-cyan-100">{query}</p>
        </div>
      </div>

      {/* AI response bubble */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-sm">🤖</span>
        </div>

        <div className="flex-1 space-y-2">
          {/* Response content */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3">
            <div className="prose prose-sm prose-invert max-w-none">
              {response.text.split("\n").map((line, i) => {
                // Bold markers **text**
                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                return (
                  <p key={i} className={`text-sm text-slate-200 leading-relaxed ${i > 0 && line === "" ? "mt-2" : ""}`}>
                    {parts.map((part, j) =>
                      part.startsWith("**") && part.endsWith("**") ? (
                        <strong key={j} className="text-slate-100 font-semibold">
                          {part.slice(2, -2)}
                        </strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Metadata row */}
          <div className="flex flex-wrap items-center gap-3 px-1">
            {/* Confidence */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500">Confiança</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-3 rounded-sm ${
                      i < Math.round(response.confidence * 5)
                        ? "bg-emerald-500"
                        : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-emerald-400">
                {Math.round(response.confidence * 100)}%
              </span>
            </div>

            {/* Category */}
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              {response.category}
            </span>

            {/* DLP cleared badge */}
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <svg className="w-3 h-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Filtrado pelo DLP
            </span>
          </div>

          {/* Sources */}
          {response.sources?.length > 0 && (
            <div className="px-1">
              <p className="text-xs text-slate-500 mb-1">Fontes consultadas:</p>
              <div className="flex flex-wrap gap-1.5">
                {response.sources.map((src, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400"
                  >
                    {src}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
