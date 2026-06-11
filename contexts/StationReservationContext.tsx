"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { stations as initialStations } from "@/data/stations";
import { Station } from "@/types/station";

type StationReservationContextValue = {
  stations: Station[];
  reserveSpots: (stationId: string, spotsRequested: number) => boolean;
};

const StationReservationContext = createContext<StationReservationContextValue | undefined>(undefined);

export function StationReservationProvider({ children }: { children: ReactNode }) {
  const [stations, setStations] = useState<Station[]>(initialStations);

  const reserveSpots = (stationId: string, spotsRequested: number) => {
    let reservationApplied = false;

    setStations((currentStations) =>
      currentStations.map((station) => {
        if (station.id !== stationId) {
          return station;
        }

        if (station.availableSlots < spotsRequested) {
          return station;
        }

        reservationApplied = true;
        return {
          ...station,
          availableSlots: station.availableSlots - spotsRequested,
        };
      }),
    );

    return reservationApplied;
  };

  const value = useMemo(
    () => ({
      stations,
      reserveSpots,
    }),
    [stations],
  );

  return <StationReservationContext.Provider value={value}>{children}</StationReservationContext.Provider>;
}

export function useStationReservations() {
  const context = useContext(StationReservationContext);

  if (!context) {
    throw new Error("useStationReservations deve ser usado dentro de StationReservationProvider.");
  }

  return context;
}
