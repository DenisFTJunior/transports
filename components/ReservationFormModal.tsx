import { FormEvent, useState } from "react";
import { ReservationFormValues, Station } from "@/types/station";

type ReservationFormModalProps = {
  station: Station;
  maxSpots: number;
  onClose: () => void;
  onSubmitSuccess: (values: ReservationFormValues) => void;
};

const plateRegex = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
const phoneRegex = /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/;

export function ReservationFormModal({ station, maxSpots, onClose, onSubmitSuccess }: ReservationFormModalProps) {
  const [plate, setPlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [phone, setPhone] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [truckSize, setTruckSize] = useState<"Pequeno" | "Médio" | "Grande">("Médio");
  const [isFleet, setIsFleet] = useState(false);
  const [spotsRequested, setSpotsRequested] = useState(1);
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedPlate = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const normalizedPhone = phone.replace(/\s/g, "");

    if (!normalizedPlate || !driverName.trim() || !normalizedPhone.trim() || !scheduledTime) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }

    if (!plateRegex.test(normalizedPlate)) {
      setError("Informe uma placa válida no padrão Mercosul (ex: ABC1D23).");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError("Informe um telefone válido com DDD.");
      return;
    }

    if (!Number.isInteger(spotsRequested) || spotsRequested < 1) {
      setError("Informe uma quantidade válida de vagas.");
      return;
    }

    if (spotsRequested > maxSpots) {
      setError("A quantidade solicitada é maior que o total disponível neste posto.");
      return;
    }

    setError("");
    onSubmitSuccess({
      plate: normalizedPlate,
      driverName: driverName.trim(),
      phone: phone.trim(),
      scheduledTime,
      truckSize,
      isFleet,
      spotsRequested,
    });
  };

  return (
    <div className="fixed inset-0 z-[1250] flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-border bg-surface p-5 shadow-panel sm:max-w-lg sm:rounded-2xl sm:p-6">
        <h3 className="text-xl font-semibold text-text">Reservar vaga em {station.name}</h3>
        <p className="mt-1 text-sm text-muted">Preencha os dados para confirmar a reserva.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="rounded-xl border border-border bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-text">Reserva para frota</p>
                <p className="text-xs text-muted">Permite reservar várias vagas com um responsável.</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={isFleet}
                onClick={() => {
                  setIsFleet((current) => !current);
                  setSpotsRequested(1);
                }}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
                  isFleet ? "bg-gray-700" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    isFleet ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {isFleet && (
              <div className="mt-4">
                <label htmlFor="spotsRequested" className="mb-1 block text-sm font-medium text-text">
                  Quantidade de vagas
                </label>
                <input
                  id="spotsRequested"
                  type="number"
                  min={1}
                  max={maxSpots}
                  value={spotsRequested}
                  onChange={(event) => setSpotsRequested(Number(event.target.value))}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-muted">Máximo disponível neste posto: {maxSpots}</p>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="plate" className="mb-1 block text-sm font-medium text-text">
              Placa
            </label>
            <input
              id="plate"
              type="text"
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
              placeholder="ABC1D23"
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="driverName" className="mb-1 block text-sm font-medium text-text">
              {isFleet ? "Nome do responsável" : "Nome do motorista"}
            </label>
            <input
              id="driverName"
              type="text"
              value={driverName}
              onChange={(event) => setDriverName(event.target.value)}
              placeholder={isFleet ? "Nome do responsável" : "Nome completo"}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="scheduledTime" className="mb-1 block text-sm font-medium text-text">
              Horário da vaga
            </label>
            <input
              id="scheduledTime"
              type="time"
              value={scheduledTime}
              onChange={(event) => setScheduledTime(event.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor="truckSize" className="mb-1 block text-sm font-medium text-text">
              Tamanho do caminhão
            </label>
            <select
              id="truckSize"
              value={truckSize}
              onChange={(event) => setTruckSize(event.target.value as "Pequeno" | "Médio" | "Grande")}
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            >
              <option value="Pequeno">Pequeno</option>
              <option value="Médio">Médio</option>
              <option value="Grande">Grande</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-text">
              Telefone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(11) 91234-5678"
              className="w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-sm font-medium text-gray-700">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-text transition hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Reservar vaga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
