import { ReservationFormValues, Station } from "@/types/station";

type SuccessModalProps = {
  station: Station;
  reservationCode: string;
  values: ReservationFormValues;
  onClose: () => void;
};

export function SuccessModal({ station, reservationCode, values, onClose }: SuccessModalProps) {
  const personLabel = values.isFleet ? "Responsável" : "Motorista";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    reservationCode,
  )}`;

  return (
    <div className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-panel">
        <h3 className="text-xl font-semibold text-text">Reserva confirmada</h3>
        <p className="mt-2 text-sm text-muted">{station.name}</p>

        <div className="mt-6 rounded-xl border border-gray-300 bg-gray-100 p-4">
          <p className="text-xs uppercase tracking-wider text-gray-600">Código da vaga</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{reservationCode}</p>
          <img src={qrCodeUrl} alt="QR code da reserva" className="mx-auto mt-3 h-36 w-36 rounded-md border border-gray-300 bg-white p-1" />
        </div>

        <p className="mt-4 text-sm text-gray-700">
          {personLabel}: {values.driverName}
        </p>
        <p className="text-sm text-gray-700">Placa: {values.plate}</p>
        <p className="text-sm text-gray-700">Telefone: {values.phone}</p>
        <p className="text-sm text-gray-700">Horário da vaga: {values.scheduledTime}</p>
        <p className="text-sm text-gray-700">Tamanho do caminhão: {values.truckSize}</p>
        <p className="text-sm text-gray-700">Vagas reservadas: {values.spotsRequested}</p>

        <p className="mt-5 text-sm font-medium text-gray-800">
          {values.isFleet ? "Responsável" : "Motorista"}, salve este código para validação no posto.
        </p>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
