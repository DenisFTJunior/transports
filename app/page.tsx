"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ReservationFormModal } from "@/components/ReservationFormModal";
import { StationCard } from "@/components/StationCard";
import { StationSelectionModal } from "@/components/StationSelectionModal";
import { SuccessModal } from "@/components/SuccessModal";
import { useStationReservations } from "@/contexts/StationReservationContext";
import { ReservationFormValues, Station } from "@/types/station";

const DynamicRealStationsMap = dynamic(
  () => import("@/components/RealStationsMap").then((module) => module.RealStationsMap),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[70vh] animate-pulse rounded-2xl border border-border bg-gray-100" aria-hidden />
    ),
  },
);

function generateReservationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  const token = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `VAGA-${token}`;
}

export default function HomePage() {
  const { stations, reserveSpots } = useStationReservations();
  const [viewMode, setViewMode] = useState<"cards" | "map">("cards");
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [reservationData, setReservationData] = useState<ReservationFormValues | null>(null);
  const [reservationError, setReservationError] = useState("");

  const selectedStation = selectedStationId
    ? (stations.find((station) => station.id === selectedStationId) ?? null)
    : null;
  const sortedStations = useMemo(
    () => [...stations].sort((a, b) => a.distanceKm - b.distanceKm),
    [stations],
  );
  const handleStationSelect = (station: Station) => {
    setSelectedStationId(station.id);
    setShowReservationForm(false);
    setShowSuccessModal(false);
    setReservationError("");
  };

  const handleCloseAllModals = () => {
    setSelectedStationId(null);
    setShowReservationForm(false);
    setShowSuccessModal(false);
    setReservationData(null);
    setReservationCode("");
    setReservationError("");
  };

  const handleOpenReservation = () => {
    setReservationError("");
    setShowReservationForm(true);
  };

  const handleReservationSuccess = (values: ReservationFormValues) => {
    if (!selectedStation) {
      setReservationError("Posto não encontrado para reserva.");
      return;
    }

    const reservationApplied = reserveSpots(selectedStation.id, values.spotsRequested);

    if (!reservationApplied) {
      setReservationError("Não foi possível reservar: vagas insuficientes no momento.");
      return;
    }

    setReservationError("");
    setReservationData(values);
    setReservationCode(generateReservationCode());
    setShowReservationForm(false);
    setShowSuccessModal(true);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Postos afiliados</p>
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-xl border border-border bg-white p-1">
              <button
                type="button"
                onClick={() => setViewMode("cards")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  viewMode === "cards" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Cards
              </button>
              <button
                type="button"
                onClick={() => setViewMode("map")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  viewMode === "map" ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Mapa
              </button>
            </div>
            <Link
              href="/gestao"
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-gray-100"
            >
              Ir para gestão
            </Link>
          </div>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-text sm:text-4xl">Reserva de vaga</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted sm:text-base">
          Escolha um posto afiliado para verificar disponibilidade e, quando houver vagas, reserve sua posição.
        </p>
        {reservationError && <p className="mt-3 text-sm font-medium text-gray-700">{reservationError}</p>}
      </header>

      {viewMode === "cards" ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedStations.map((station) => (
            <StationCard key={station.id} station={station} onSelect={handleStationSelect} />
          ))}
        </section>
      ) : (
        <section className="space-y-3">
          <DynamicRealStationsMap stations={sortedStations} onSelectStation={handleStationSelect} />
          <div className="max-h-[35vh] overflow-y-auto rounded-2xl border border-border bg-surface p-4 shadow-[0_-10px_22px_-18px_rgba(15,23,42,0.7)]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-text">Postos no mapa</p>
              <p className="text-xs text-muted">Toque para selecionar</p>
            </div>
            <div className="space-y-2">
              {sortedStations.map((station) => (
                <button
                  key={`map-list-${station.id}`}
                  type="button"
                  disabled={station.availableSlots === 0}
                  onClick={() => handleStationSelect(station)}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                    station.availableSlots > 0
                      ? "border-gray-200 bg-white hover:bg-gray-50"
                      : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-70"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-text">{station.name}</p>
                    <p className="text-xs text-muted">{station.distanceKm.toFixed(1)} km</p>
                  </div>
                  <span className="text-xs font-semibold text-gray-700">Vagas: {station.availableSlots}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {selectedStation && !showReservationForm && !showSuccessModal && (
        <StationSelectionModal
          station={selectedStation}
          onClose={handleCloseAllModals}
          onReserve={handleOpenReservation}
        />
      )}

      {selectedStation && showReservationForm && (
        <ReservationFormModal
          station={selectedStation}
          maxSpots={selectedStation.availableSlots}
          onClose={handleCloseAllModals}
          onSubmitSuccess={handleReservationSuccess}
        />
      )}

      {selectedStation && showSuccessModal && reservationData && (
        <SuccessModal
          station={selectedStation}
          reservationCode={reservationCode}
          values={reservationData}
          onClose={handleCloseAllModals}
        />
      )}
    </main>
  );
}
