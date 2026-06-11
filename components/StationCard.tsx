import { Station } from "@/types/station";

type StationCardProps = {
  station: Station;
  onSelect: (station: Station) => void;
};

export function StationCard({ station, onSelect }: StationCardProps) {
  const hasVacancy = station.availableSlots > 0;
  const statusLabel = hasVacancy ? "Com vagas" : "Sem vagas";
  const imageSrc = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${station.imageUrl}`;

  return (
    <button
      type="button"
      onClick={() => onSelect(station)}
      disabled={!hasVacancy}
      className={`w-full rounded-lg border border-border bg-surface p-4 text-left shadow-[0_16px_32px_-22px_rgba(15,23,42,0.85)] transition ${
        hasVacancy
          ? "hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-lg"
          : "cursor-not-allowed opacity-60"
      }`}
    >
      <img
        src={imageSrc}
        alt={`Imagem do ${station.name}`}
        className="mb-3 h-36 w-full rounded-md object-cover"
      />
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-text">{station.name}</h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            hasVacancy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="text-sm text-muted">{station.address}</p>
      <p className="mt-2 text-xs text-gray-700">Distância: {station.distanceKm.toFixed(1)} km</p>
      <p className="mt-2 text-xs text-gray-600">
        Vagas: {station.availableSlots} / {station.totalSlots}
      </p>
    </button>
  );
}
