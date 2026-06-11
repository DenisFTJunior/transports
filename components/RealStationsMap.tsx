"use client";

import L, { DivIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { Station } from "@/types/station";

type RealStationsMapProps = {
  stations: Station[];
  onSelectStation: (station: Station) => void;
};

function createMarkerIcon(hasVacancy: boolean): DivIcon {
  const bgColor = hasVacancy ? "#16a34a" : "#dc2626";

  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:14px;height:14px;border-radius:999px;background:${bgColor};border:2px solid white;box-shadow:0 0 0 1px rgba(15,23,42,0.45);"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export function RealStationsMap({ stations, onSelectStation }: RealStationsMapProps) {
  const [routePositions, setRoutePositions] = useState<[number, number][]>([]);

  const center: [number, number] = stations.length
    ? [stations[0].latitude, stations[0].longitude]
    : [-23.5505, -46.6333];

  const fallbackRoute = useMemo<[number, number][]>(
    () => stations.map((station) => [station.latitude, station.longitude]),
    [stations],
  );

  useEffect(() => {
    let isMounted = true;

    async function loadRoute() {
      if (stations.length < 2) {
        if (isMounted) {
          setRoutePositions(fallbackRoute);
        }
        return;
      }

      const coordinates = stations.map((station) => `${station.longitude},${station.latitude}`).join(";");
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

      try {
        const response = await fetch(routeUrl);

        if (!response.ok) {
          throw new Error("Falha ao carregar rota");
        }

        const data = (await response.json()) as {
          routes?: Array<{ geometry?: { coordinates?: number[][] } }>;
        };

        const geometryCoordinates = data.routes?.[0]?.geometry?.coordinates ?? [];
        const parsedRoute = geometryCoordinates.map(([longitude, latitude]) => [latitude, longitude] as [number, number]);

        if (isMounted) {
          setRoutePositions(parsedRoute.length ? parsedRoute : fallbackRoute);
        }
      } catch {
        if (isMounted) {
          setRoutePositions(fallbackRoute);
        }
      }
    }

    loadRoute();

    return () => {
      isMounted = false;
    };
  }, [fallbackRoute, stations]);

  return (
    <div className="min-h-[70vh] overflow-hidden rounded-2xl border border-border bg-white">
      <MapContainer center={center} zoom={11} className="h-[70vh] w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={routePositions.length ? routePositions : fallbackRoute}
          pathOptions={{ color: "#1e3a8a", weight: 4, opacity: 0.75 }}
        />

        {stations.map((station) => {
          const hasVacancy = station.availableSlots > 0;

          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createMarkerIcon(hasVacancy)}
              eventHandlers={{
                click: () => {
                  if (hasVacancy) {
                    onSelectStation(station);
                  }
                },
              }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{station.name}</p>
                  <p className="text-xs">{station.address}</p>
                  <p className="text-xs">Vagas: {station.availableSlots}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
