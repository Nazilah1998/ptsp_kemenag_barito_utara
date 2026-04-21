import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

import { Field } from "@/components/ui/field";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, Plus, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  createFieldAction,
  deleteFieldAction,
  updateFieldAction,
} from "@/lib/actions/admin";

export default async function AdminFormFieldsPage() {
  await requireAdmin();
  const admin = createAdminClient();
  const [{ data: items }, { data: fields }] = await Promise.all([
    admin.from("service_items").select("id, name").order("name"),
    admin
      .from("service_form_fields")
      .select("*, service_items(name)")
      .order("service_item_id")
      .order("sort_order"),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Form Layanan"
        description="Atur field form dinamis yang digunakan oleh tiap item layanan."
        icon={FormInput}
      />

      {/* ===== CARD: TAMBAH FIELD BARU ===== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <Plus className="h-4 w-4 text-[#1f4bb7]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Tambah Field Baru
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Isi form di bawah untuk menambah field baru
            </p>
          </div>
        </div>
        <div className="p-5">
          <form
            action={createFieldAction}
            className="grid gap-4 md:grid-cols-2"
          >
            <Field label="Item Layanan">
              <Select name="service_item_id" required>
                <option value="">Pilih item layanan</option>
                {(items ?? []).map((item: any) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Label">
              <Input name="label" required />
            </Field>
            <Field label="Nama Field">
              <Input name="name" required />
            </Field>
            <Field label="Tipe">
              <Select name="type" defaultValue="text">
                <option value="text">text</option>
                <option value="textarea">textarea</option>
                <option value="number">number</option>
                <option value="date">date</option>
                <option value="select">select</option>
              </Select>
            </Field>
            <Field label="Placeholder">
              <Input name="placeholder" />
            </Field>
            <Field label="Opsi Select" hint='Contoh JSON: ["Islam","Katolik"]'>
              <Input name="options" />
            </Field>
            <Field label="Urutan">
              <Input type="number" name="sort_order" defaultValue={0} />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_required" defaultChecked />
              Wajib diisi
            </label>
            <div className="md:col-span-2">
              <Button type="submit">Simpan Field</Button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== CARD: DAFTAR FIELD ===== */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-5 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50">
            <List className="h-4 w-4 text-[#1f4bb7]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Daftar Field
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit atau hapus field yang sudah ada
            </p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          {(fields ?? []).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">
              Belum ada field. Tambahkan field baru di atas.
            </p>
          )}
          {(fields ?? []).map((field: any) => (
            <div
              key={field.id}
              className="rounded-xl border border-slate-200 p-4"
            >
              <form
                action={updateFieldAction}
                className="grid gap-3 md:grid-cols-2"
              >
                <input type="hidden" name="id" value={field.id} />
                <Field label="Item Layanan">
                  <Select
                    name="service_item_id"
                    defaultValue={String(field.service_item_id)}
                  >
                    {(items ?? []).map((item: any) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Label">
                  <Input name="label" defaultValue={field.label} />
                </Field>
                <Field label="Nama Field">
                  <Input name="name" defaultValue={field.name} />
                </Field>
                <Field label="Tipe">
                  <Select name="type" defaultValue={field.type}>
                    <option value="text">text</option>
                    <option value="textarea">textarea</option>
                    <option value="number">number</option>
                    <option value="date">date</option>
                    <option value="select">select</option>
                  </Select>
                </Field>
                <Field label="Placeholder">
                  <Input
                    name="placeholder"
                    defaultValue={field.placeholder || ""}
                  />
                </Field>
                <Field label="Opsi Select">
                  <Input name="options" defaultValue={field.options || ""} />
                </Field>
                <Field label="Urutan">
                  <Input
                    type="number"
                    name="sort_order"
                    defaultValue={field.sort_order}
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="is_required"
                    defaultChecked={field.is_required}
                  />
                  Wajib
                </label>
                <div className="flex gap-2">
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
              <form action={deleteFieldAction} className="mt-3">
                <input type="hidden" name="id" value={field.id} />
                <Button type="submit" variant="danger">
                  Hapus
                </Button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
