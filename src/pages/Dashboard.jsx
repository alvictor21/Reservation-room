import { useEffect, useState } from "react";
import { initialRooms } from "../data/initialRooms";
import { hasPermission } from "../utils/permissions";
import AddReservationForm from "../components/AddReservationForm";
import EditReservationForm from "../components/EditReservationForm";

const STATUS_STYLES = {
  Approved: "bg-brand-soft text-brand-dark",
  Pending: "bg-gold-soft text-gold-dark",
  Rejected: "bg-danger-soft text-danger",
};

const TOAST_STYLES = {
  error: "border-danger/30 bg-danger-soft text-danger",
  success: "border-brand/30 bg-brand-soft text-brand-dark",
  info: "border-gold/40 bg-gold-soft text-gold-dark",
};

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "bg-sky-bg text-muted"
      }`}
    >
      {status}
    </span>
  );
}

export default function Dashboard({ session, onLogout }) {
  const { username, role } = session.user;
  const isAdmin = role === "admin";

  const [rooms, setRooms] = useState(initialRooms);
  const [toast, setToast] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  // Hak akses dihitung dari role pada session yang aktif
  const canCreate = hasPermission(role, "create");
  const canUpdate = hasPermission(role, "update");
  const canDelete = hasPermission(role, "delete");
  const showActionColumn = canUpdate || canDelete;

  // Notifikasi hilang otomatis
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (type, message) => setToast({ type, message });

  // Guard: setiap aksi diperiksa permission-nya sebelum dijalankan.
  // Mengembalikan true jika diizinkan.
  const authorize = (action) => {
    if (!hasPermission(role, action)) {
      notify(
        "error",
        `Akses ditolak: role "${role}" tidak memiliki izin ${action}.`
      );
      return false;
    }
    return true;
  };

  // ---------- CREATE ----------
  const openAddForm = () => {
    if (!authorize("create")) return;
    setShowAddForm(true);
  };

  const handleAddSubmit = (values) => {
    if (!authorize("create")) {
      setShowAddForm(false);
      return;
    }
    setRooms((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((r) => r.id)) + 1 : 1;
      return [...prev, { id: nextId, ...values }];
    });
    setShowAddForm(false);
    notify("success", "Data peminjaman berhasil ditambahkan.");
  };

  // ---------- UPDATE ----------
  const openEditForm = (room) => {
    if (!authorize("update")) return;
    setEditingRoom(room);
  };

  const handleEditSubmit = (id, values) => {
    if (!authorize("update")) {
      setEditingRoom(null);
      return;
    }
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...values } : r))
    );
    setEditingRoom(null);
    notify("success", "Data peminjaman berhasil diubah.");
  };

  // ---------- DELETE ----------
  const handleDelete = (room) => {
    if (!authorize("delete")) return;

    const confirmed = window.confirm(
      `Hapus peminjaman "${room.purpose}" oleh ${room.borrower}?`
    );
    if (!confirmed) return;

    setRooms((prev) => prev.filter((r) => r.id !== room.id));
    notify("success", "Data peminjaman berhasil dihapus.");
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-base font-bold text-white">
              R
            </div>
            <h1 className="text-base font-bold sm:text-lg">
              Room Reservation System
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted">{username}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  isAdmin
                    ? "bg-brand-soft text-brand-dark"
                    : "bg-gold-soft text-gold-dark"
                }`}
              >
                {isAdmin ? "Admin" : "User"}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-medium transition-colors hover:bg-sky-bg"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="h-1 bg-gold" />
      </header>

      {/* Konten */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Data Peminjaman Ruangan</h2>
            <p className="text-sm text-muted">{rooms.length} peminjaman</p>
          </div>

          {canCreate && (
            <button
              onClick={openAddForm}
              className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:w-auto"
            >
              + Add Reservation
            </button>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-brand-soft text-xs uppercase tracking-wide text-brand-dark">
                <tr>
                  <th className="px-4 py-3 font-semibold">No</th>
                  <th className="px-4 py-3 font-semibold">Peminjam</th>
                  <th className="px-4 py-3 font-semibold">Ruangan</th>
                  <th className="px-4 py-3 font-semibold">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Jam</th>
                  <th className="px-4 py-3 font-semibold">Tujuan</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  {showActionColumn && (
                    <th className="px-4 py-3 font-semibold">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rooms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showActionColumn ? 8 : 7}
                      className="px-4 py-10 text-center text-muted"
                    >
                      Belum ada data peminjaman.
                    </td>
                  </tr>
                ) : (
                  rooms.map((room, index) => (
                    <tr
                      key={room.id}
                      className="transition-colors hover:bg-sky-bg"
                    >
                      <td className="px-4 py-3 text-muted">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{room.borrower}</td>
                      <td className="px-4 py-3">{room.room}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {formatDate(room.date)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {room.startTime} - {room.endTime}
                      </td>
                      <td className="px-4 py-3">{room.purpose}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={room.status} />
                      </td>
                      {showActionColumn && (
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            {canUpdate && (
                              <button
                                onClick={() => openEditForm(room)}
                                className="rounded-md border border-gold px-2.5 py-1 text-xs font-medium text-gold-dark transition-colors hover:bg-gold-soft"
                              >
                                Edit
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(room)}
                                className="rounded-md border border-danger/40 px-2.5 py-1 text-xs font-medium text-danger transition-colors hover:bg-danger-soft"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-xs text-muted sm:hidden">
          Geser tabel ke samping untuk melihat kolom lainnya.
        </p>
      </main>

      {/* Modal */}
      {showAddForm && canCreate && (
        <AddReservationForm
          onSubmit={handleAddSubmit}
          onClose={() => setShowAddForm(false)}
        />
      )}

      {editingRoom && canUpdate && (
        <EditReservationForm
          room={editingRoom}
          onSubmit={handleEditSubmit}
          onClose={() => setEditingRoom(null)}
        />
      )}

      {/* Notifikasi */}
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-50 sm:left-auto sm:right-6 sm:w-96">
          <div
            role="status"
            className={`rounded-lg border px-4 py-3 text-sm shadow-md ${
              TOAST_STYLES[toast.type]
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}