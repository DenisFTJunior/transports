"use client";

import { StationReservationProvider } from "@/contexts/StationReservationContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <StationReservationProvider>{children}</StationReservationProvider>;
}
