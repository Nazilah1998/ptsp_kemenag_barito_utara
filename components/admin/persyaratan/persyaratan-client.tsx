"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, Inbox, AlertTriangle, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { 
  createRequirementAction, 
  updateRequirementAction, 
  deleteRequirementAction 
} from "@/lib/actions/admin";

export function PersyaratanClient({ initialRequirements, items }: { initialRequirements: any[], items: any[] }) {
  const [requirements, setRequirements] = useState(initialRequirements);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<any | null>(null);
  const [deletingRequirement, setDeletingRequirement] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({ 
    service_item_id: "", 
    document_name: "", 
    description: "", 
    allowed_extensions: "pdf,jpg,jpeg,png", 
    max_file_size_mb: 5,
    is_required: true 
  });
  
  // Filter state
  const [selectedItemFilter, setSelectedItemFilter] = useState("all");

  useEffect(() => {
    setRequirements(initialRequirements);
  }, [initialRequirements]);

  const filteredRequirements = selectedItemFilter === "all" 
    ? requirements 
    : requirements.filter(req => req.service_item_id.toString() === selectedItemFilter);

  const handleExtensionChange = (ext: string, checked: boolean) => {
    let currentExts = formData.allowed_extensions ? formData.allowed_extensions.split(',').map(e => e.trim()).filter(Boolean) : [];
    if (checked) {
      if (!currentExts.includes(ext)) currentExts.push(ext);
    } else {
      currentExts = currentExts.filter(e => e !== ext);
    }
    setFormData(prev => ({ ...prev, allowed_extensions: currentExts.join(',') }));
  };

  const openEdit = (requirement: any) => {
    setEditingRequirement(requirement);
    setFormData({
      service_item_id: requirement.service_item_id.toString(),
      document_name: requirement.document_name,
      description: requirement.description || "",
      allowed_extensions: requirement.allowed_extensions || "pdf,jpg,jpeg,png",
      max_file_size_mb: requirement.max_file_size_mb || 5,
      is_required: requirement.is_required,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.service_item_id) {
      toast.error("Pilih Item Layanan terlebih dahulu.");
      return;
    }

    const data = new FormData();
    data.append("service_item_id", formData.service_item_id);
    data.append("document_name", formData.document_name);
    data.append("description", formData.description);
    data.append("allowed_extensions", formData.allowed_extensions);
    data.append("max_file_size_mb", formData.max_file_size_mb.toString());
    if (formData.is_required) data.append("is_required", "on");

    startTransition(async () => {
      try {
        if (editingRequirement) {
          data.append("id", editingRequirement.id.toString());
          await updateRequirementAction(data);
          toast.success("Berhasil Memperbarui", { description: "Persyaratan telah diperbarui." });
        } else {
          await createRequirementAction(data);
          toast.success("Berhasil Menambahkan", { description: "Persyaratan baru telah ditambahkan." });
        }
        setIsAddOpen(false);
        setEditingRequirement(null);
        setFormData({ service_item_id: "", document_name: "", description: "", allowed_extensions: "pdf,jpg,jpeg,png", max_file_size_mb: 5, is_required: true });
      } catch (error) {
        toast.error("Gagal menyimpan data.");
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingRequirement) return;
    const data = new FormData();
    data.append("id", deletingRequirement.id.toString());
    startTransition(async () => {
      try {
        await deleteRequirementAction(data);
        toast.success("Persyaratan Dihapus", { description: "Persyaratan berhasil dihapus secara permanen." });
        setDeletingRequirement(null);
      } catch (error) {
        toast.error("Gagal menghapus persyaratan.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total</span>
          <span className="text-sm font-black text-slate-900">{requirements.length} Dokumen</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select 
            value={selectedItemFilter}
            onChange={(e) => setSelectedItemFilter(e.target.value)}
            className="w-full sm:w-[250px] font-medium border-slate-200/80 bg-slate-50"
          >
            <option value="all">Semua Item Layanan</option>
            {(items ?? []).map((item: any) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          
          <button
            onClick={() => {
              setFormData({ 
                service_item_id: selectedItemFilter !== "all" ? selectedItemFilter : "", 
                document_name: "", description: "", allowed_extensions: "pdf,jpg,jpeg,png", max_file_size_mb: 5, is_required: true 
              });
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Tambah Persyaratan
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">Nama Dokumen</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-48">Item Layanan</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-32">Format File</th>
                <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-slate-400 w-24">Wajib</th>
                <th className="px-5 py-3.5 text-right text-xs font-black uppercase tracking-wider text-slate-400 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredRequirements.map((req) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={req.id} 
                    className="group transition-colors duration-150 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900">{req.document_name}</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 line-clamp-1">
                          <div className="w-2 border-t border-slate-300" />
                          {req.description || "Tanpa deskripsi"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 line-clamp-1">
                        {req.service_items?.name || 'Tidak Diketahui'}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center rounded-lg px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 ring-1 ring-blue-200/60 uppercase">
                          {req.allowed_extensions}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">Maks: {req.max_file_size_mb} MB</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 align-middle text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                          req.is_required
                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                            : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                        }`}
                      >
                        {req.is_required ? "YA" : "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(req)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-blue-50 hover:text-[#1f4bb7] hover:border-blue-200 transition-all duration-200 shadow-sm"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingRequirement(req)}
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
              {!filteredRequirements?.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                        <Inbox className="h-8 w-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500">Belum ada persyaratan</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">Klik tombol &quot;Tambah Persyaratan&quot; untuk memulai.</p>
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
        {(isAddOpen || editingRequirement) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => { setIsAddOpen(false); setEditingRequirement(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 border border-slate-200/60"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                <h3 className="text-lg font-black text-slate-800">
                  {editingRequirement ? "Edit Dokumen Persyaratan" : "Tambah Dokumen Persyaratan"}
                </h3>
                <button 
                  onClick={() => { setIsAddOpen(false); setEditingRequirement(null); }}
                  className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-5">
                <Field label="Item Layanan" required>
                  <Select 
                    name="service_item_id" 
                    value={formData.service_item_id}
                    onChange={(e) => setFormData({...formData, service_item_id: e.target.value})}
                    required
                    className="font-medium"
                  >
                    <option value="">-- Pilih Item Layanan --</option>
                    {(items ?? []).map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Nama Dokumen" required hint="Nama dokumen yang harus diupload (misal: Kartu Keluarga)">
                  <Input 
                    name="document_name" 
                    value={formData.document_name}
                    onChange={(e) => setFormData({...formData, document_name: e.target.value})}
                    required 
                    placeholder="Contoh: KTP Asli" 
                    className="font-medium"
                  />
                </Field>

                <Field label="Deskripsi / Keterangan Tambahan">
                  <Textarea 
                    name="description" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Contoh: Harus yang terbaru dan berwarna..." 
                    className="min-h-[100px] resize-none"
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Ekstensi File Diizinkan" required hint="Pilih format file yang boleh diupload">
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["pdf", "jpg", "jpeg", "png", "doc", "docx", "xls", "xlsx"].map(ext => {
                        const currentExts = formData.allowed_extensions ? formData.allowed_extensions.split(',').map(e => e.trim()) : [];
                        const isChecked = currentExts.includes(ext);
                        
                        return (
                          <label key={ext} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer transition-colors ${isChecked ? 'bg-blue-50 border-blue-200 text-[#1f4bb7]' : 'bg-slate-50 border-slate-200/60 text-slate-500 hover:bg-slate-100'}`}>
                            <input 
                              type="checkbox" 
                              className="sr-only"
                              checked={isChecked}
                              onChange={(e) => handleExtensionChange(ext, e.target.checked)}
                            />
                            {ext.toUpperCase()}
                          </label>
                        );
                      })}
                    </div>
                  </Field>

                  <Field label="Maksimal Ukuran File (MB)" required>
                    <Input 
                      type="number"
                      name="max_file_size_mb" 
                      value={formData.max_file_size_mb}
                      onChange={(e) => setFormData({...formData, max_file_size_mb: parseInt(e.target.value) || 1})}
                      required 
                    />
                  </Field>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/60 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        checked={formData.is_required}
                        onChange={(e) => setFormData({...formData, is_required: e.target.checked})}
                        className="peer sr-only" 
                      />
                      <div className="w-10 h-6 bg-slate-300 rounded-full peer-checked:bg-rose-500 transition-colors relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">Wajib Diupload (Required)</p>
                      <p className="text-[11px] text-slate-500">Pemohon tidak bisa mengirim pengajuan jika dokumen ini belum diupload.</p>
                    </div>
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 pt-4 mt-6 -mx-6 px-6 pb-2">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddOpen(false); setEditingRequirement(null); }}
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
        {deletingRequirement && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
              onClick={() => setDeletingRequirement(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden p-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-4 ring-8 ring-rose-50">
                <AlertTriangle className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Hapus Persyaratan?</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 mb-6">
                Anda yakin ingin menghapus persyaratan <span className="font-bold text-slate-800">"{deletingRequirement.document_name}"</span>? Aksi ini tidak dapat dibatalkan.
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
                  onClick={() => setDeletingRequirement(null)}
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
