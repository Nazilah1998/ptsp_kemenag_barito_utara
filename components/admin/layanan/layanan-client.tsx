"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, Inbox, GripVertical, AlertTriangle, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { 
  createServiceAction, 
  updateServiceAction, 
  deleteServiceAction, 
  reorderServicesAction 
} from "@/lib/actions/admin";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function LayananClient({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [deletingService, setDeletingService] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", is_active: true });
  
  useEffect(() => {
    setServices(initialServices);
  }, [initialServices]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name: newName,
      slug: slugify(newName),
    }));
  };

  const openEdit = (service: any) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || "",
      is_active: service.is_active,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("slug", formData.slug);
    data.append("description", formData.description);
    if (formData.is_active) data.append("is_active", "on");

    startTransition(async () => {
      try {
        if (editingService) {
          data.append("id", editingService.id.toString());
          await updateServiceAction(data);
          toast.success("Berhasil Memperbarui", { description: "Layanan telah diperbarui." });
        } else {
          await createServiceAction(data);
          toast.success("Berhasil Menambahkan", { description: "Layanan baru telah ditambahkan." });
        }
        setIsAddOpen(false);
        setEditingService(null);
        setFormData({ name: "", slug: "", description: "", is_active: true });
      } catch (error) {
        toast.error("Gagal menyimpan data.");
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingService) return;
    const data = new FormData();
    data.append("id", deletingService.id.toString());
    startTransition(async () => {
      try {
        await deleteServiceAction(data);
        toast.success("Layanan Dihapus", { description: "Layanan berhasil dihapus secara permanen." });
        setDeletingService(null);
      } catch (error) {
        toast.error("Gagal menghapus layanan.");
      }
    });
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newArr = [...services];
    [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
    setServices(newArr);
    saveOrder(newArr);
  };

  const moveDown = (index: number) => {
    if (index === services.length - 1) return;
    const newArr = [...services];
    [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
    setServices(newArr);
    saveOrder(newArr);
  };

  const saveOrder = (orderedServices: any[]) => {
    const ids = orderedServices.map(s => s.id);
    startTransition(async () => {
      try {
        await reorderServicesAction(ids);
        toast.success("Urutan Tersimpan", { description: "Urutan layanan telah disesuaikan." });
      } catch (error) {
        toast.error("Gagal menyimpan urutan.");
      }
    });
  };

  const total = initialServices.length;
  const active = initialServices.filter((s) => s.is_active).length;
  const inactive = total - active;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Summary Stats inline */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
            <span className="text-sm font-black text-slate-900">{total}</span>
          </div>
          <div className="px-4 py-2 rounded-xl border border-emerald-200/80 bg-emerald-50/50 shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Aktif</span>
            <span className="text-sm font-black text-emerald-700">{active}</span>
          </div>
          <div className="px-4 py-2 rounded-xl border border-rose-200/80 bg-rose-50/50 shadow-sm flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Nonaktif</span>
            <span className="text-sm font-black text-rose-700">{inactive}</span>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData({ name: "", slug: "", description: "", is_active: true });
            setIsAddOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Tambah Layanan Baru
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50">
                <th className="px-4 py-3.5 text-center text-xs font-black uppercase tracking-wider text-slate-400 w-16">Urutan</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">Nama Layanan & Slug</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-32">Status</th>
                <th className="px-5 py-3.5 text-right text-xs font-black uppercase tracking-wider text-slate-400 w-48">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {services.map((service, index) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={service.id} 
                    className="group transition-colors duration-150 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 align-middle text-center">
                      <div className="flex flex-col items-center justify-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => moveUp(index)}
                          disabled={index === 0 || isPending}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>
                        </button>
                        <button 
                          onClick={() => moveDown(index)}
                          disabled={index === services.length - 1 || isPending}
                          className="p-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-3 h-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900">{service.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <div className="w-3 border-t border-slate-300" />
                          {service.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                          service.is_active
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60"
                            : "bg-rose-50 text-rose-700 ring-1 ring-rose-200/60"
                        }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${service.is_active ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {service.is_active ? "AKTIF" : "NONAKTIF"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-blue-50 hover:text-[#1f4bb7] hover:border-blue-200 transition-all duration-200 shadow-sm"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingService(service)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-rose-600 bg-white border border-rose-200/60 hover:bg-rose-50 hover:border-rose-300 transition-all duration-200 shadow-sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {!services?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                        <Inbox className="h-8 w-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500">Belum ada layanan</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">Klik tombol &quot;Tambah Layanan&quot; untuk memulai.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FLOATING MODAL: ADD / EDIT */}
      <AnimatePresence>
        {(isAddOpen || editingService) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => { setIsAddOpen(false); setEditingService(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200/60"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-black text-slate-800">
                  {editingService ? "Edit Data Layanan" : "Tambah Layanan Baru"}
                </h3>
                <button 
                  onClick={() => { setIsAddOpen(false); setEditingService(null); }}
                  className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <Field label="Nama Layanan" required>
                  <Input 
                    name="name" 
                    value={formData.name}
                    onChange={handleNameChange}
                    required 
                    placeholder="Masukkan nama layanan..." 
                    className="font-medium"
                  />
                </Field>
                <Field label="Slug URL (Otomatis)" hint="Slug di-generate otomatis dari nama layanan.">
                  <div className="flex items-center">
                    <span className="bg-slate-100 border border-slate-200 border-r-0 rounded-l-lg px-3 py-2 text-sm text-slate-500 font-mono">/</span>
                    <Input 
                      name="slug" 
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      required 
                      className="rounded-l-none font-mono text-sm text-[#1f4bb7]"
                    />
                  </div>
                </Field>
                <Field label="Deskripsi Layanan">
                  <Textarea 
                    name="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Tulis deskripsi singkat..." 
                    className="min-h-[100px] resize-none"
                  />
                </Field>
                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="peer sr-only" 
                      />
                      <div className="w-10 h-6 bg-slate-300 rounded-full peer-checked:bg-emerald-500 transition-colors relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Status Layanan Aktif</p>
                      <p className="text-[11px] text-slate-500">Layanan akan muncul di portal pemohon.</p>
                    </div>
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddOpen(false); setEditingService(null); }}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] hover:shadow-md hover:shadow-blue-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FLOATING MODAL: DELETE CONFIRMATION */}
      <AnimatePresence>
        {deletingService && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
              onClick={() => setDeletingService(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden p-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-4 ring-8 ring-rose-50">
                <AlertTriangle className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Hapus Layanan?</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 mb-6">
                Anda yakin ingin menghapus <span className="font-bold text-slate-800">"{deletingService.name}"</span>? Aksi ini tidak dapat dibatalkan.
              </p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleDelete}
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 hover:shadow-md hover:shadow-rose-600/25 transition-all active:scale-95 disabled:opacity-70"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Ya, Hapus Permanen
                </button>
                <button 
                  onClick={() => setDeletingService(null)}
                  disabled={isPending}
                  className="w-full px-5 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-70"
                >
                  Batal
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
