"use client";

import { useState, useTransition } from "react";
import { Users, Shield, Crown, UserCheck, Pencil, Inbox, Check, X, Loader2, ChevronLeft, ChevronRight, Search, Eye, EyeOff, Building2, Phone, Clock, CheckCircle2, XCircle, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateUserRoleAction } from "@/lib/actions/admin";
import { verifyPetugasAction, rejectPetugasAction, updatePetugasAction } from "@/lib/actions/register-petugas";
import { formatDate } from "@/lib/utils";
import { isSuperAdmin, isAdminRole } from "@/lib/constants";
import { UserPermissionsModal } from "./user-permissions-manager";

function RoleBadge({ role, email }: { role: string; email?: string }) {
  const isSuper = isSuperAdmin(email);
  if (isSuper) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200 shadow-sm shadow-amber-100">
        <Crown className="h-3 w-3" />
        Super Admin
      </span>
    );
  }
  if (role === "admin_ptsp") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
        <Shield className="h-3 w-3" />
        Admin PTSP
      </span>
    );
  }
  if (role === "kasubag_tu") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <Shield className="h-3 w-3" />
        Kasubag TU
      </span>
    );
  }
  if (role === "kepala_kantor") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <Crown className="h-3 w-3" />
        Kepala Kantor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold bg-slate-50 text-slate-600 border border-slate-200">
      <Users className="h-3 w-3" />
      Pemohon
    </span>
  );
}

/* ─── Password Cell (reusable) ─────────────────────────────────── */
function PasswordCell({ password, canView }: { password?: string; canView: boolean }) {
  const [visible, setVisible] = useState(false);
  if (!canView) return <span className="text-slate-300 text-xs italic">—</span>;
  if (!password) return <span className="text-slate-400 text-xs italic">Tidak tersedia</span>;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-sm text-slate-700 font-mono tabular-nums tracking-wide select-all">
        {visible ? password : "••••••••"}
      </span>
      <button
        type="button"
        onClick={() => setVisible(v => !v)}
        className="p-1 rounded-md text-slate-400 hover:text-[#1f4bb7] hover:bg-blue-50 transition-colors"
        title={visible ? "Sembunyikan" : "Tampilkan"}
      >
        {visible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function UserTable({ 
  users, 
  title, 
  subtitle, 
  icon: Icon, 
  iconColor, 
  emptyText,
  showRoleChange,
  viewerIsSuperAdmin,
  onUserUpdated,
  onOpenPermissions,
  perPage = 10 
}: { 
  users: any[]; 
  title: string; 
  subtitle: string; 
  icon: React.ElementType; 
  iconColor: string; 
  emptyText: string;
  showRoleChange: boolean;
  viewerIsSuperAdmin: boolean;
  onUserUpdated?: (userId: string, data: Record<string, any>) => void;
  onOpenPermissions?: (user: any) => void;
  perPage?: number;
}) {
  const PER_PAGE = perPage;
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editForm, setEditForm] = useState({ email: "", phone: "", unit_kerja: "", role: "", newPassword: "" });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = searchQuery
    ? users.filter(u =>
        (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page when search changes
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);
    setEditForm({
      email: user.email || "",
      phone: user.phone || "",
      unit_kerja: user.unit_kerja || "",
      role: user.role || "admin_ptsp",
      newPassword: "",
    });
    setShowNewPassword(false);
  };

  const handleSaveEdit = () => {
    if (!editingUser) return;
    startTransition(async () => {
      try {
        const result = await updatePetugasAction({
          userId: editingUser.id,
          email: editForm.email,
          originalEmail: editingUser.email,
          phone: editForm.phone,
          unit_kerja: editForm.unit_kerja,
          role: editForm.role,
          newPassword: editForm.newPassword || undefined,
        });
        if (result.error && !result.success) {
          toast.error("Gagal menyimpan", { description: result.error });
        } else {
          if ((result as any).warning) {
            toast.success("Data Profil Tersimpan!", {
              description: (result as any).warning,
              icon: <CheckCircle2 className="h-5 w-5 text-amber-500" />,
            });
          } else {
            toast.success("Data Berhasil Diperbarui!", {
              description: `Data ${editingUser.full_name || editingUser.email} telah diperbarui.`,
              icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            });
          }
          // Update local state di parent
          onUserUpdated?.(editingUser.id, {
            email: editForm.email,
            phone: editForm.phone,
            unit_kerja: editForm.unit_kerja,
            role: editForm.role,
            ...(editForm.newPassword ? { plain_password: editForm.newPassword } : {}),
          });
          setEditingUser(null);
        }
      } catch {
        toast.error("Terjadi kesalahan saat menyimpan data.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">{title}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
            {filteredUsers.length} pengguna
          </div>
          {users.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari pengguna..."
                className="rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 w-44 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 bg-slate-50/50">
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-12">#</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Nama Lengkap</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-40">No Telepon / WA</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Unit Kerja</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-36">Role Petugas</th>
              {viewerIsSuperAdmin && (
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-40">Password</th>
              )}
              {showRoleChange && (
                <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400 w-28">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {paginatedUsers.map((user, idx) => {
                const isSuper = isSuperAdmin(user.email);
                return (
                  <motion.tr
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={user.id}
                    className="group transition-colors duration-150 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-3.5 text-xs text-slate-400 tabular-nums">
                      {(page - 1) * PER_PAGE + idx + 1}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-bold text-sm select-none ${
                          isSuper
                            ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-sm shadow-amber-200"
                            : "bg-gradient-to-br from-[#1f4bb7]/10 to-[#2d5bcf]/20 text-[#1f4bb7]"
                        }`}>
                          {(user.full_name || user.email || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {user.full_name || <span className="italic text-slate-400">Tanpa nama</span>}
                          </p>
                          {isSuper && (
                            <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                              <Crown className="h-2.5 w-2.5" /> Pemilik Sistem
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-700 font-medium tabular-nums">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {user.phone || <span className="text-slate-400 italic text-xs">—</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {user.unit_kerja ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          <Building2 className="h-3 w-3" />
                          {user.unit_kerja}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Belum diisi</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={user.role} email={user.email} />
                    </td>
                    {viewerIsSuperAdmin && (
                      <td className="px-5 py-3.5">
                        <PasswordCell password={user.plain_password} canView={viewerIsSuperAdmin} />
                      </td>
                    )}
                    {showRoleChange && (
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {isSuper ? (
                            <span className="text-[10px] font-semibold text-slate-400 italic">Terkunci</span>
                          ) : (
                            <>
                              {viewerIsSuperAdmin && onOpenPermissions && (
                                <button
                                  onClick={() => onOpenPermissions(user)}
                                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 shadow-sm"
                                  title="Atur Hak Akses Menu"
                                >
                                  <KeyRound className="h-3 w-3" />
                                  Akses
                                </button>
                              )}
                              <button
                                onClick={() => openEditModal(user)}
                                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-blue-50 hover:text-[#1f4bb7] hover:border-blue-200 transition-all duration-200 shadow-sm"
                              >
                                <Pencil className="h-3 w-3" />
                                Edit Data
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                );
              })}
            </AnimatePresence>
            {!paginatedUsers.length && (
              <tr>
                <td colSpan={viewerIsSuperAdmin ? (showRoleChange ? 8 : 7) : (showRoleChange ? 7 : 6)} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                      <Inbox className="h-7 w-7 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500">{emptyText}</p>
                      {searchQuery && (
                        <p className="mt-1 text-xs text-slate-400">Coba ubah kata kunci pencarian.</p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Halaman <span className="font-bold text-slate-700">{page}</span> dari{" "}
            <span className="font-bold text-slate-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[28px] h-7 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                  p === page
                    ? "bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Data Petugas Modal */}
      <AnimatePresence>
        {editingUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => setEditingUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#1f4bb7]/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f4bb7]/10 text-[#1f4bb7]">
                    <Pencil className="h-4 w-4" />
                  </div>
                  <h3 className="text-lg font-black text-slate-800">Edit Data Petugas</h3>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* User Info Card */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1f4bb7]/10 to-[#2d5bcf]/20 text-[#1f4bb7] font-bold text-sm">
                    {(editingUser.full_name || editingUser.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{editingUser.full_name || "Tanpa Nama"}</p>
                    <p className="text-xs text-slate-500 truncate">{editingUser.email}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <UserCheck className="h-3 w-3" /> Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@contoh.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* No Telepon / WA */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Phone className="h-3 w-3" /> No Telepon / WA
                  </label>
                  <input
                    type="text"
                    value={editForm.phone}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="08xxxxxxxxxx"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Unit Kerja */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Building2 className="h-3 w-3" /> Unit Kerja
                  </label>
                  <select
                    value={editForm.unit_kerja}
                    onChange={(e) => setEditForm(prev => ({ ...prev, unit_kerja: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Pilih Unit Kerja</option>
                    {["Kepala Kantor", "Sub Bagian Tata Usaha", "Seksi Pendidikan Madrasah", "Seksi Pendidikan Agama Islam", "Seksi Pendidikan Diniyah & Pondok Pesantren", "Seksi Bimbingan Masyarakat Islam", "Seksi Bimbingan Masyarakat Kristen & Katolik", "Penyelenggara Zakat dan Wakaf", "Penyelenggara Hindu"].map(uk => (
                      <option key={uk} value={uk}>{uk}</option>
                    ))}
                  </select>
                </div>

                {/* Role Petugas */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> Role Petugas
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: "admin_ptsp", label: "Admin PTSP", icon: Shield, color: "blue" },
                      { value: "kasubag_tu", label: "Kasubag TU", icon: Shield, color: "purple" },
                      { value: "kepala_kantor", label: "Kepala Kantor", icon: Crown, color: "emerald" },
                    ].map((r) => {
                      const RIcon = r.icon;
                      const isSelected = editForm.role === r.value;
                      const colorMap: Record<string, { active: string; icon: string; text: string }> = {
                        blue: { active: "border-[#1f4bb7] bg-blue-50/70 shadow-blue-100", icon: "bg-blue-100 text-[#1f4bb7]", text: "text-[#1f4bb7]" },
                        purple: { active: "border-purple-500 bg-purple-50/70 shadow-purple-100", icon: "bg-purple-100 text-purple-600", text: "text-purple-700" },
                        emerald: { active: "border-emerald-500 bg-emerald-50/70 shadow-emerald-100", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-700" },
                      };
                      const c = colorMap[r.color];
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setEditForm(prev => ({ ...prev, role: r.value }))}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-center ${
                            isSelected ? `${c.active} shadow-sm` : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            isSelected ? c.icon : "bg-slate-100 text-slate-400"
                          }`}>
                            <RIcon className="h-4 w-4" />
                          </div>
                          <p className={`text-[11px] font-bold leading-tight ${isSelected ? c.text : "text-slate-600"}`}>{r.label}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Eye className="h-3 w-3" /> Ubah Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Kosongkan jika tidak ingin mengubah"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-10 text-sm text-slate-700 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-[#1f4bb7] hover:bg-blue-50 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  {editForm.newPassword && editForm.newPassword.length < 8 && (
                    <p className="text-[11px] text-red-500 font-medium">Password minimal 8 karakter</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isPending || (editForm.newPassword !== "" && editForm.newPassword.length < 8)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] hover:shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Pending Verification Card ────────────────────────────────── */
function PendingUserCard({ user, onVerify, onReject }: { user: any; onVerify: (id: string) => void; onReject: (id: string) => void }) {
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject" | null>(null);

  const handleAction = (action: "approve" | "reject") => {
    startTransition(async () => {
      if (action === "approve") {
        const result = await verifyPetugasAction(user.id);
        if (result.error) {
          toast.error("Gagal memverifikasi", { description: result.error });
        } else {
          toast.success("Petugas Diverifikasi!", {
            description: `${user.full_name || user.email} berhasil diaktifkan sebagai petugas.`,
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
          });
          onVerify(user.id);
        }
      } else {
        const result = await rejectPetugasAction(user.id);
        if (result.error) {
          toast.error("Gagal menolak", { description: result.error });
        } else {
          toast.success("Pendaftaran Ditolak", {
            description: `Akun ${user.full_name || user.email} telah dihapus dari sistem.`,
            icon: <XCircle className="h-5 w-5 text-red-500" />,
          });
          onReject(user.id);
        }
      }
      setConfirmAction(null);
    });
  };

  return (
    <div className="px-5 py-4 hover:bg-orange-50/50 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* User Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black text-sm shadow-sm">
            {(user.full_name || user.email || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-900 truncate">{user.full_name || "Tanpa Nama"}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {user.phone && (
            <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-white border border-orange-200 text-slate-600">
              <Phone className="h-3 w-3 text-orange-400" /> {user.phone}
            </span>
          )}
          {user.unit_kerja && (
            <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-white border border-orange-200 text-slate-600">
              <Building2 className="h-3 w-3 text-orange-400" /> {user.unit_kerja}
            </span>
          )}
          <RoleBadge role={user.role} />
          <span className="inline-flex items-center gap-1 rounded-lg px-2 py-1 bg-orange-100 text-orange-700 font-semibold">
            <Clock className="h-3 w-3" /> {formatDate(user.created_at)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait">
            {confirmAction === null ? (
              <motion.div key="buttons" className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <button
                  type="button"
                  onClick={() => setConfirmAction("approve")}
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm hover:shadow-md hover:shadow-emerald-500/25 transition-all active:scale-95 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Terima
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction("reject")}
                  disabled={isPending}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 transition-all active:scale-95 disabled:opacity-50"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Tolak
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <span className={`text-xs font-bold ${confirmAction === "approve" ? "text-emerald-700" : "text-red-700"}`}>
                  {confirmAction === "approve" ? "Terima petugas ini?" : "Tolak & hapus akun?"}
                </span>
                <button
                  type="button"
                  onClick={() => handleAction(confirmAction)}
                  disabled={isPending}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all active:scale-95 disabled:opacity-50 ${
                    confirmAction === "approve"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                  Ya
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction(null)}
                  disabled={isPending}
                  className="flex items-center px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
                >
                  Batal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function PenggunaClient({ initialUsers, currentEmail }: { initialUsers: any[]; currentEmail?: string }) {
  const [users, setUsers] = useState(initialUsers);
  const viewerIsSuperAdmin = isSuperAdmin(currentEmail);

  // Super admin (hardcoded email)
  const superAdmin = users.find(u => isSuperAdmin(u.email));
  // Petugas yang BELUM diverifikasi
  const pendingUsers = users.filter(u => isAdminRole(u.role) && !isSuperAdmin(u.email) && u.is_verified === false);
  // Admin / Petugas yang SUDAH diverifikasi
  const adminUsers = users.filter(u => isAdminRole(u.role) && !isSuperAdmin(u.email) && u.is_verified !== false);
  // Pemohon
  const pemohonUsers = users.filter(u => !isAdminRole(u.role) && !isSuperAdmin(u.email));

  const stats = {
    total: users.length,
    super_admin: superAdmin ? 1 : 0,
    admin: adminUsers.length,
    user: pemohonUsers.length,
    pending: pendingUsers.length,
  };

  const [permissionsUser, setPermissionsUser] = useState<any | null>(null);

  // Handle approve/reject — update local state immediately
  const handleVerify = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_verified: true } : u));
    // Also optionally open permissions modal right after verify?
    // Wait, the state doesn't have the full user object in handleVerify directly.
  };
  const handleReject = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleSavePermissions = (userId: string, perms: string[]) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, permissions: perms } : u));
  };

  return (
    <div className="space-y-6">
      <UserPermissionsModal 
        user={permissionsUser} 
        isOpen={!!permissionsUser} 
        onClose={() => setPermissionsUser(null)} 
        onSave={handleSavePermissions}
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Pengguna", value: stats.total, icon: Users, color: "bg-slate-100 text-slate-600" },
          { label: "Super Admin", value: stats.super_admin, icon: Crown, color: "bg-amber-100 text-amber-600" },
          { label: "Admin / Petugas", value: stats.admin, icon: UserCheck, color: "bg-blue-100 text-blue-600" },
          { label: "Pemohon", value: stats.user, icon: Users, color: "bg-emerald-100 text-emerald-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">{card.label}</p>
                <p className="mt-1 text-3xl font-black text-slate-900 tabular-nums tracking-tight">{card.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.color} transition-transform duration-300 group-hover:scale-110`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-gradient-to-r from-[#1f4bb7] to-[#2d5bcf] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ))}
      </div>

      {/* Super Admin Section */}
      {superAdmin && (
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/50 to-yellow-50/30 shadow-sm overflow-hidden">
          <div className="border-b border-amber-100 px-5 py-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-amber-800">Super Admin</h3>
              <p className="text-[11px] text-amber-600/70 mt-0.5">Pemilik sistem dengan hak akses tertinggi. Tidak dapat diubah.</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-white font-black text-base shadow-sm shadow-amber-200">
                {(superAdmin.full_name || superAdmin.email || "S").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-black text-slate-900">{superAdmin.full_name || "Super Admin"}</p>
                <p className="text-xs text-slate-500 mt-0.5">{superAdmin.email}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Terdaftar</p>
                <p className="text-xs text-slate-600 mt-0.5">{formatDate(superAdmin.created_at)}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 shadow-sm">
                <Crown className="h-3.5 w-3.5" />
                Super Admin
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─── Pending Verification Section ─────────────────────── */}
      {viewerIsSuperAdmin && pendingUsers.length > 0 && (
        <div className="overflow-hidden rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50/80 to-amber-50/50 shadow-sm">
          <div className="border-b border-orange-200 px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Clock className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white shadow-sm animate-pulse">
                  {pendingUsers.length}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-black text-orange-800">Menunggu Verifikasi</h3>
                <p className="text-[11px] text-orange-600/70 mt-0.5">Petugas baru yang mendaftar dan menunggu persetujuan Anda.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-orange-100">
            {pendingUsers.map((user) => (
              <PendingUserCard
                key={user.id}
                user={user}
                onVerify={handleVerify}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      )}

      {/* Admin / Petugas Table */}
      <UserTable
        users={adminUsers}
        title="Daftar Admin / Petugas"
        subtitle="Pengguna dengan hak akses mengelola pengajuan dan sistem."
        icon={Shield}
        iconColor="bg-blue-100 text-[#1f4bb7]"
        emptyText="Belum ada admin / petugas terdaftar."
        showRoleChange={true}
        viewerIsSuperAdmin={viewerIsSuperAdmin}
        onUserUpdated={(userId, data) => {
          setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
        }}
        onOpenPermissions={(user) => setPermissionsUser(user)}
        perPage={5}
      />

      {/* Pemohon Table */}
      <PemohonTable
        users={pemohonUsers}
        viewerIsSuperAdmin={viewerIsSuperAdmin}
      />
    </div>
  );
}

/* ─── Tabel khusus Pemohon ─────────────────────────────────── */
function PemohonTable({ users, viewerIsSuperAdmin }: { users: any[]; viewerIsSuperAdmin: boolean }) {
  const PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [newRole, setNewRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = searchQuery
    ? users.filter(u =>
        (u.full_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.address || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users;

  const totalPages = Math.ceil(filteredUsers.length / PER_PAGE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleSaveRole = () => {
    if (!editingUser || !newRole) return;
    const data = new FormData();
    data.append("id", editingUser.id);
    data.append("role", newRole);
    startTransition(async () => {
      try {
        await updateUserRoleAction(data);
        toast.success("Role Berhasil Diubah", {
          description: `${editingUser.full_name || editingUser.phone} sekarang menjadi ${isAdminRole(newRole) ? "Petugas" : "Pemohon"}.`,
        });
        setEditingUser(null);
      } catch {
        toast.error("Gagal mengubah role pengguna.");
      }
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white px-5 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-800">Daftar Pemohon</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Pengguna yang mengajukan layanan melalui PTSP.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-lg bg-emerald-50 text-xs font-bold text-emerald-600 border border-emerald-200/60">
            {filteredUsers.length} pemohon
          </div>
          {users.length > 5 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Cari nama / no HP..."
                className="rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-700 w-48 transition-all focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/10 outline-none placeholder:text-slate-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200/60 bg-slate-50/50">
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-12">#</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-44">Nama</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-36">No HP / WA</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">Alamat</th>
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-28">Role</th>
              {viewerIsSuperAdmin && (
                <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-40">Password</th>
              )}
              <th className="px-5 py-3 text-left text-[10px] font-black uppercase tracking-wider text-slate-400 w-36">Terdaftar</th>
              <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-wider text-slate-400 w-28">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence>
              {paginatedUsers.map((user, idx) => (
                <motion.tr
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={user.id}
                  className="group transition-colors duration-150 hover:bg-slate-50/50"
                >
                  <td className="px-5 py-3.5 text-xs text-slate-400 tabular-nums">
                    {(page - 1) * PER_PAGE + idx + 1}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold text-xs select-none">
                        {(user.full_name || "P").charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 truncate">
                        {user.full_name || <span className="italic text-slate-400">Tanpa nama</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 text-sm text-slate-700 font-medium tabular-nums">
                      {user.phone || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm text-slate-600 line-clamp-2 leading-snug" title={user.address || ""}>
                      {user.address || <span className="text-slate-400 italic">Belum diisi</span>}
                    </p>
                  </td>
                  <td className="px-5 py-3.5">
                    <RoleBadge role={user.role} email={user.email} />
                  </td>
                  {viewerIsSuperAdmin && (
                    <td className="px-5 py-3.5">
                      <PasswordCell password={user.plain_password} canView={viewerIsSuperAdmin} />
                    </td>
                  )}
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setNewRole(user.role);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-blue-50 hover:text-[#1f4bb7] hover:border-blue-200 transition-all duration-200 shadow-sm"
                      >
                        <Pencil className="h-3 w-3" />
                        Ubah Role
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            {!paginatedUsers.length && (
              <tr>
                <td colSpan={viewerIsSuperAdmin ? 8 : 7} className="px-5 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50">
                      <Inbox className="h-7 w-7 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-500">Belum ada pemohon terdaftar.</p>
                      {searchQuery && (
                        <p className="mt-1 text-xs text-slate-400">Coba ubah kata kunci pencarian.</p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Halaman <span className="font-bold text-slate-700">{page}</span> dari{" "}
            <span className="font-bold text-slate-700">{totalPages}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`min-w-[28px] h-7 rounded-lg text-[11px] font-bold transition-all duration-200 ${
                  p === page
                    ? "bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-600 hover:bg-slate-200/60"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      <AnimatePresence>
        {editingUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => setEditingUser(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800">Ubah Role Pengguna</h3>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-bold text-sm">
                    {(editingUser.full_name || "P").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{editingUser.full_name || "Tanpa Nama"}</p>
                    <p className="text-xs text-slate-500 truncate">{editingUser.phone || editingUser.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Pilih Role Baru</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewRole("admin_ptsp")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        newRole === "admin_ptsp"
                          ? "border-[#1f4bb7] bg-blue-50/50 shadow-sm shadow-blue-100"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        newRole === "admin_ptsp" ? "bg-blue-100 text-[#1f4bb7]" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Shield className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${newRole === "admin_ptsp" ? "text-[#1f4bb7]" : "text-slate-700"}`}>Admin PTSP</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Kelola pengajuan</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewRole("user")}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        newRole === "user"
                          ? "border-emerald-500 bg-emerald-50/50 shadow-sm shadow-emerald-100"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        newRole === "user" ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                      }`}>
                        <Users className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${newRole === "user" ? "text-emerald-700" : "text-slate-700"}`}>Pemohon</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Ajukan layanan</p>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveRole}
                    disabled={isPending || newRole === editingUser.role}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] hover:shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
