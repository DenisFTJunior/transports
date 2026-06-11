import { Station } from "@/types/station";

type StationSelectionModalProps = {
  station: Station;
  onClose: () => void;
  onReserve: () => void;
};

export function StationSelectionModal({ station, onClose, onReserve }: StationSelectionModalProps) {
  const hasVacancy = station.availableSlots > 0;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-panel">
        <h3 className="text-xl font-semibold text-text">{station.name}</h3>
        <p className="mt-2 text-sm text-muted">{station.address}</p>

        {!hasVacancy ? (
          <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
            Sem vagas no momento.
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-gray-300 bg-gray-100 p-4 text-sm text-gray-800">
            Há {station.availableSlots} vagas disponíveis para reservar vaga.
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-gray-100"
          >
            Fechar
          </button>
          {hasVacancy && (
            <button
              type="button"
              onClick={onReserve}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Reservar vaga
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
