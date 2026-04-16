"use client";

import { SessionProvider } from "@/context/SessionContext";

export default function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
