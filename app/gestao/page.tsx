"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useStationReservations } from "@/contexts/StationReservationContext";

function generateReservationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  const token = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `GEST-${token}`;
}

export default function GestaoPage() {
  const { stations, reserveSpots } = useStationReservations();

  const [stationId, setStationId] = useState(stations[0]?.id ?? "");
  const [spotsRequested, setSpotsRequested] = useState(1);
  const [responsible, setResponsible] = useState("");
  const [error, setError] = useState("");
  const [successCode, setSuccessCode] = useState("");

  const selectedStation = useMemo(
    () => stations.find((station) => station.id === stationId) ?? null,
    [stationId, stations],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedStation) {
      setError("Selecione um posto para continuar.");
      return;
    }

    if (!responsible.trim()) {
      setError("Informe o responsável pela reserva.");
      return;
    }

    if (!Number.isInteger(spotsRequested) || spotsRequested < 1) {
      setError("A quantidade de vagas deve ser de no mínimo 1.");
      return;
    }

    const reservationApplied = reserveSpots(selectedStation.id, spotsRequested);

    if (!reservationApplied) {
      setError("Quantidade solicitada maior que vagas disponíveis.");
      return;
    }

    setError("");
    setSuccessCode(generateReservationCode());
    setResponsible("");
    setSpotsRequested(1);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted">Gestão</p>
          <h1 className="mt-2 text-3xl font-bold text-text">Reserva manual de vagas</h1>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-gray-100"
        >
          Voltar para início
        </Link>
      </div>

      <section className="rounded-2xl border border-border bg-surface p-6 shadow-panel">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="station" className="mb-1 block text-sm font-medium text-text">
              Posto afiliado
            </label>
            <select
              id="station"
              value={stationId}
              onChange={(event) => setStationId(event.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name} - vagas disponíveis: {station.availableSlots}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="spotsRequested" className="mb-1 block text-sm font-medium text-text">
              Quantidade de vagas
            </label>
            <input
              id="spotsRequested"
              type="number"
              min={1}
              value={spotsRequested}
              onChange={(event) => setSpotsRequested(Number(event.target.value))}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="responsible" className="mb-1 block text-sm font-medium text-text">
              Responsável pela reserva
            </label>
            <input
              id="responsible"
              type="text"
              value={responsible}
              onChange={(event) => setResponsible(event.target.value)}
              placeholder="Nome do responsável"
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm font-medium text-gray-700">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Reservar manualmente
            </button>
          </div>
        </form>

        {successCode && (
          <div className="mt-6 rounded-xl border border-gray-300 bg-gray-100 p-4">
            <p className="text-sm font-medium text-gray-800">Reserva manual confirmada.</p>
            <p className="mt-1 text-sm text-gray-700">Código da operação: {successCode}</p>
          </div>
        )}
      </section>
    </main>
  );
}
