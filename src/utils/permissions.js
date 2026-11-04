// Definisi RBAC: role -> daftar aksi yang diizinkan
const permissions = {
  admin: ["create", "read", "update", "delete"],
  user: ["create", "read"],
};

export function hasPermission(role, action) {
  return permissions[role]?.includes(action) ?? false;
}