import { useEffect } from "react";

export const ROOM_OPTIONS = [
  "Lab Komputer",
  "Lab Jaringan",
  "Ruang Seminar",
  "Ruang Kelas A",
  "Ruang Kelas B",
  "Aula Fakultas",
];

export const STATUS_OPTIONS = ["Pending", "Approved", "Rejected"];

export const EMPTY_FORM = {
  borrower: "",
  room: "",
  date: "",
  startTime: "",
  endTime: "",
  purpose: "",
  status: "Pending",
};

/**
 * Validasi form reservasi. Mengembalikan object error per field.
 * Object kosong berarti valid.
 */
export function validateReservation(values) {
  const errors = {};

  if (!values.borrower.trim()) errors.borrower = "Nama peminjam wajib diisi.";
  if (!values.room) errors.room = "Nama ruangan wajib dipilih.";
  if (!values.date) errors.date = "Tanggal wajib diisi.";
  if (!values.startTime) errors.startTime = "Jam mulai wajib diisi.";
  if (!values.endTime) errors.endTime = "Jam selesai wajib diisi.";
  if (!values.purpose.trim()) errors.purpose = "Tujuan peminjaman wajib diisi.";
  if (!values.status) errors.status = "Status wajib dipilih.";

  // Format HH:MM bisa dibandingkan sebagai string
  if (
    values.startTime &&
    values.endTime &&
    values.endTime <= values.startTime
  ) {
    errors.endTime = "Jam selesai harus lebih besar dari jam mulai.";
  }

  return errors;
}

export function Modal({ title, onClose, children }) {
  // Tutup dengan tombol Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-line bg-white shadow-lg sm:rounded-2xl"
      >
        <div className="h-1.5 shrink-0 bg-gold" />
        <div className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-md px-2 py-1 text-xl leading-none text-muted transition-colors hover:bg-sky-bg"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border bg-sky-bg px-3.5 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2";

function Field({ label, name, error, children }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ReservationFields({ values, errors, onChange }) {
  const cls = (name) =>
    `${inputClass} ${
      errors[name]
        ? "border-danger focus:ring-danger/30"
        : "border-line focus:border-brand focus:ring-brand/30"
    }`;

  const bind = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: (e) => onChange(name, e.target.value),
    className: cls(name),
  });

  return (
    <div className="space-y-4">
      <Field label="Nama Peminjam" name="borrower" error={errors.borrower}>
        <input type="text" placeholder="Contoh: Andi Pratama" {...bind("borrower")} />
      </Field>

      <Field label="Nama Ruangan" name="room" error={errors.room}>
        <select {...bind("room")}>
          <option value="">Pilih ruangan</option>
          {ROOM_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Tanggal" name="date" error={errors.date}>
        <input type="date" {...bind("date")} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Jam Mulai" name="startTime" error={errors.startTime}>
          <input type="time" {...bind("startTime")} />
        </Field>
        <Field label="Jam Selesai" name="endTime" error={errors.endTime}>
          <input type="time" {...bind("endTime")} />
        </Field>
      </div>

      <Field label="Tujuan Peminjaman" name="purpose" error={errors.purpose}>
        <input type="text" placeholder="Contoh: Rapat Organisasi" {...bind("purpose")} />
      </Field>

      <Field label="Status Peminjaman" name="status" error={errors.status}>
        <select {...bind("status")}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

export function FormActions({ onCancel, submitLabel }) {
  return (
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium transition-colors hover:bg-sky-bg"
      >
        Batal
      </button>
      <button
        type="submit"
        className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        {submitLabel}
      </button>
    </div>
  );
}