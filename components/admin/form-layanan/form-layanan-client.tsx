"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, Pencil, Trash2, Inbox, AlertTriangle, Check, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { 
  createFieldAction, 
  updateFieldAction, 
  deleteFieldAction 
} from "@/lib/actions/admin";

function generateFieldName(label: string) {
  return label
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\_]+/g, '')
    .replace(/\_\_+/g, '_');
}

export function FormLayananClient({ initialFields, items }: { initialFields: any[], items: any[] }) {
  const [fields, setFields] = useState(initialFields);
  const [isPending, startTransition] = useTransition();

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingField, setEditingField] = useState<any | null>(null);
  const [deletingField, setDeletingField] = useState<any | null>(null);

  // Form states
  const [formData, setFormData] = useState({ 
    service_item_id: "", 
    label: "", 
    name: "", 
    type: "text", 
    placeholder: "",
    options: "",
    sort_order: 0,
    is_required: true 
  });
  
  // Filter state
  const [selectedItemFilter, setSelectedItemFilter] = useState("all");

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const filteredFields = selectedItemFilter === "all" 
    ? fields 
    : fields.filter(field => field.service_item_id.toString() === selectedItemFilter);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setFormData((prev) => ({
      ...prev,
      label: newLabel,
      name: generateFieldName(newLabel),
    }));
  };

  const openEdit = (field: any) => {
    setEditingField(field);
    setFormData({
      service_item_id: field.service_item_id.toString(),
      label: field.label,
      name: field.name,
      type: field.type,
      placeholder: field.placeholder || "",
      options: field.options || "",
      sort_order: field.sort_order || 0,
      is_required: field.is_required,
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
    data.append("label", formData.label);
    data.append("name", formData.name);
    data.append("type", formData.type);
    data.append("placeholder", formData.placeholder);
    data.append("options", formData.options);
    data.append("sort_order", formData.sort_order.toString());
    if (formData.is_required) data.append("is_required", "on");

    startTransition(async () => {
      try {
        if (editingField) {
          data.append("id", editingField.id.toString());
          await updateFieldAction(data);
          toast.success("Berhasil Memperbarui", { description: "Field form telah diperbarui." });
        } else {
          await createFieldAction(data);
          toast.success("Berhasil Menambahkan", { description: "Field form baru telah ditambahkan." });
        }
        setIsAddOpen(false);
        setEditingField(null);
        setFormData({ service_item_id: "", label: "", name: "", type: "text", placeholder: "", options: "", sort_order: 0, is_required: true });
      } catch (error) {
        toast.error("Gagal menyimpan data.");
      }
    });
  };

  const handleDelete = async () => {
    if (!deletingField) return;
    const data = new FormData();
    data.append("id", deletingField.id.toString());
    startTransition(async () => {
      try {
        await deleteFieldAction(data);
        toast.success("Field Dihapus", { description: "Field form berhasil dihapus secara permanen." });
        setDeletingField(null);
      } catch (error) {
        toast.error("Gagal menghapus field form.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="px-4 py-2 rounded-xl border border-slate-200/80 bg-white shadow-sm flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Field</span>
          <span className="text-sm font-black text-slate-900">{fields.length}</span>
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
                label: "", name: "", type: "text", placeholder: "", options: "", sort_order: 0, is_required: true 
              });
              setIsAddOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1f4bb7] to-[#2557c9] px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-blue-500/20 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Tambah Field
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/50">
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-16">No</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400">Label & Nama Field</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-48">Item Layanan</th>
                <th className="px-5 py-3.5 text-left text-xs font-black uppercase tracking-wider text-slate-400 w-32">Tipe</th>
                <th className="px-5 py-3.5 text-center text-xs font-black uppercase tracking-wider text-slate-400 w-24">Wajib</th>
                <th className="px-5 py-3.5 text-right text-xs font-black uppercase tracking-wider text-slate-400 w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence>
                {filteredFields.map((field) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={field.id} 
                    className="group transition-colors duration-150 hover:bg-slate-50/50"
                  >
                    <td className="px-5 py-4 align-middle">
                      <span className="font-mono text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                        {field.sort_order}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900">{field.label}</span>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <div className="w-2 border-t border-slate-300" />
                          {field.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200/60 line-clamp-1">
                        {field.service_items?.name || 'Tidak Diketahui'}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <span className="inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 ring-1 ring-blue-200/60 uppercase">
                        {field.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold ${
                          field.is_required
                            ? "bg-rose-50 text-rose-600 ring-1 ring-rose-200"
                            : "bg-slate-100 text-slate-400 ring-1 ring-slate-200"
                        }`}
                      >
                        {field.is_required ? "YA" : "-"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(field)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 hover:bg-blue-50 hover:text-[#1f4bb7] hover:border-blue-200 transition-all duration-200 shadow-sm"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => setDeletingField(field)}
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
              {!filteredFields?.length && (
                <tr>
                  <td colSpan={6} className="px-5 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50">
                        <Inbox className="h-8 w-8 text-slate-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-500">Belum ada field layanan</p>
                        <p className="mt-1 text-xs font-medium text-slate-400">Klik tombol &quot;Tambah Field&quot; untuk memulai.</p>
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
        {(isAddOpen || editingField) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
              onClick={() => { setIsAddOpen(false); setEditingField(null); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl z-50 border border-slate-200/60"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10">
                <h3 className="text-lg font-black text-slate-800">
                  {editingField ? "Edit Field Layanan" : "Tambah Field Baru"}
                </h3>
                <button 
                  onClick={() => { setIsAddOpen(false); setEditingField(null); }}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Label Field" required hint="Label yang terlihat oleh pengguna.">
                    <Input 
                      name="label" 
                      value={formData.label}
                      onChange={handleLabelChange}
                      required 
                      placeholder="Contoh: Nama Lengkap" 
                      className="font-medium"
                    />
                  </Field>

                  <Field label="Nama Field (Variabel)" hint="Digenerate otomatis, dilarang ada spasi.">
                    <Input 
                      name="name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required 
                      className="font-mono text-sm text-[#1f4bb7] bg-slate-50"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Tipe Field" required>
                    <Select 
                      name="type" 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      required
                    >
                      <option value="text">Text Pendek (text)</option>
                      <option value="textarea">Teks Panjang (textarea)</option>
                      <option value="number">Angka (number)</option>
                      <option value="date">Tanggal (date)</option>
                      <option value="select">Dropdown (select)</option>
                    </Select>
                  </Field>

                  <Field label="Urutan Tampil (Sort Order)">
                    <Input 
                      type="number"
                      name="sort_order" 
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})}
                      required 
                    />
                  </Field>
                </div>

                <Field label="Placeholder (Opsional)" hint="Teks bayangan di dalam kolom input.">
                  <Input 
                    name="placeholder" 
                    value={formData.placeholder}
                    onChange={(e) => setFormData({...formData, placeholder: e.target.value})}
                    placeholder="Contoh: Masukkan nama lengkap Anda..." 
                  />
                </Field>

                {formData.type === "select" && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-4 bg-amber-50 rounded-xl border border-amber-200/60">
                    <Field label="Opsi Dropdown (JSON)" hint='Wajib jika tipe Select. Contoh format: ["Islam", "Katolik", "Protestan"]'>
                      <Input 
                        name="options" 
                        value={formData.options}
                        onChange={(e) => setFormData({...formData, options: e.target.value})}
                        placeholder='["Opsi 1", "Opsi 2"]' 
                        className="font-mono text-sm"
                        required={formData.type === "select"}
                      />
                    </Field>
                  </motion.div>
                )}

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
                      <p className="text-sm font-bold text-slate-700">Wajib Diisi (Required)</p>
                      <p className="text-[11px] text-slate-500">Pemohon tidak bisa melanjutkan jika kolom ini kosong.</p>
                    </div>
                  </label>
                </div>
                
                <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-white border-t border-slate-100 pt-4 mt-6 -mx-6 px-6 pb-2">
                  <button 
                    type="button" 
                    onClick={() => { setIsAddOpen(false); setEditingField(null); }}
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
        {deletingField && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
              onClick={() => setDeletingField(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-[60] overflow-hidden p-6 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 mb-4 ring-8 ring-rose-50">
                <AlertTriangle className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Hapus Field?</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 mb-6">
                Anda yakin ingin menghapus field <span className="font-bold text-slate-800">"{deletingField.label}"</span>? Aksi ini tidak dapat dibatalkan.
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
                  onClick={() => setDeletingField(null)}
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
