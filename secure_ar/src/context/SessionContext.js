"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { mockUser } from "@/data/mockUser";
import { initialLogs, nextLogId } from "@/data/mockLogs";

const SessionContext = createContext(null);

// sessionState: 'unauthenticated' | 'authenticated' | 'locked'
export function SessionProvider({ children }) {
  const [sessionState, setSessionState] = useState("unauthenticated");
  const [user, setUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [logs, setLogs] = useState(initialLogs);
  const [deviceValidated, setDeviceValidated] = useState(false);

  const addLog = useCallback(
    (event, description, status = "success", source = "Sistema") => {
      setLogs((prev) => [
        {
          id: nextLogId(),
          timestamp: new Date().toISOString(),
          event,
          description,
          status,
          source,
          user: user?.email ?? null,
        },
        ...prev,
      ]);
    },
    [user]
  );

  const validateDevice = useCallback(() => {
    setDeviceValidated(true);
    // logs already seeded via initialLogs for the boot flow
  }, []);

  const login = useCallback(
    (username) => {
      const expiry = new Date(Date.now() + 4 * 60 * 60 * 1000);
      const token =
        "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.mock." +
        btoa(JSON.stringify({ sub: username, exp: expiry.getTime() }));

      setUser(mockUser);
      setSessionToken(token);
      setSessionExpiry(expiry);
      setSessionState("authenticated");
      setDeviceValidated(true);

      setLogs((prev) => [
        {
          id: nextLogId(),
          timestamp: new Date().toISOString(),
          event: "SESSION_CREATED",
          description: `Sessão JWT criada — expira às ${expiry.toLocaleTimeString("pt-BR")}`,
          status: "success",
          source: "Auth Service",
          user: mockUser.email,
        },
        {
          id: nextLogId(),
          timestamp: new Date().toISOString(),
          event: "ACCESS_GRANTED",
          description: "Acesso ao assistente de IA autorizado",
          status: "success",
          source: "Authorization Service",
          user: mockUser.email,
        },
        ...prev,
      ]);
    },
    []
  );

  const logout = useCallback(() => {
    addLog("SESSION_TERMINATED", "Sessão encerrada pelo usuário", "info", "Auth Service");
    setUser(null);
    setSessionToken(null);
    setSessionExpiry(null);
    setSessionState("unauthenticated");
    setDeviceValidated(false);
  }, [addLog]);

  const lockSession = useCallback(() => {
    setSessionState("locked");
    addLog("SESSION_LOCKED", "Dispositivo removido — sessão bloqueada automaticamente", "warning", "MDM/UEM");
  }, [addLog]);

  const unlockSession = useCallback(() => {
    setSessionState("authenticated");
    addLog("SESSION_UNLOCKED", "Sessão desbloqueada via PIN rápido", "success", "Auth Service");
  }, [addLog]);

  const logQuery = useCallback(
    (query, blocked) => {
      if (blocked) {
        addLog("DLP_BLOCKED", `Consulta bloqueada por política DLP: "${query.slice(0, 40)}..."`, "error", "DLP Engine");
        addLog("ACCESS_DENIED", "Acesso negado por política de segurança", "error", "Authorization Service");
      } else {
        addLog("QUERY_SENT", `Consulta enviada: "${query.slice(0, 50)}${query.length > 50 ? "..." : ""}"`, "info", "AI Gateway");
        addLog("AI_RESPONSE", "Resposta segura entregue ao usuário", "success", "AI Gateway");
      }
    },
    [addLog]
  );

  return (
    <SessionContext.Provider
      value={{
        sessionState,
        user,
        sessionToken,
        sessionExpiry,
        logs,
        deviceValidated,
        validateDevice,
        login,
        logout,
        lockSession,
        unlockSession,
        logQuery,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
