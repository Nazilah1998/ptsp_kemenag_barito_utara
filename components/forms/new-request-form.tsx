"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { parseJsonArray } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { compressImageToUnder } from "@/lib/image-compression";

type Catalog = any[];

export function NewRequestForm({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string>(
    String(catalog[0]?.id ?? ""),
  );
  const [serviceItemId, setServiceItemId] = useState<string>(
    String(catalog[0]?.service_items?.[0]?.id ?? ""),
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => catalog.find((service) => String(service.id) === serviceId),
    [catalog, serviceId],
  );

  const selectedItem = useMemo(
    () =>
      selectedService?.service_items?.find(
        (item: any) => String(item.id) === serviceItemId,
      ),
    [selectedService, serviceItemId],
  );

  const handleServiceChange = (value: string) => {
    setServiceId(value);
    const nextService = catalog.find((service) => String(service.id) === value);
    setServiceItemId(String(nextService?.service_items?.[0]?.id ?? ""));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const rawFormData = new FormData(event.currentTarget);
    const finalFormData = new FormData();

    const entries = Array.from(rawFormData.entries());
    
    // Kompresi semua file gambar secara paralel
    await Promise.all(
      entries.map(async ([key, value]) => {
        if (value instanceof File && value.size > 0 && value.type.startsWith("image/")) {
          // Kompres file agar ukurannya diusahakan di bawah 100kb
          const compressedFile = await compressImageToUnder(value, 100);
          finalFormData.append(key, compressedFile);
        } else {
          finalFormData.append(key, value);
        }
      })
    );

    const response = await fetch("/api/requests", {
      method: "POST",
      body: finalFormData,
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(result.error || "Gagal membuat pengajuan.");
      return;
    }

    router.push(`/dashboard/pengajuan/${result.id}`);
    router.refresh();
  };

  if (!catalog.length) {
    return <p className="text-sm text-slate-500">Belum ada layanan aktif.</p>;
  }

  return (
    <form className="space-y-5 sm:space-y-6" onSubmit={onSubmit}>
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="service_item_id" value={serviceItemId} />

      <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4bb7]">
            Langkah 1
          </p>
          <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
            Pilih Layanan
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Tentukan unit layanan dan item layanan yang ingin diajukan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Pilih Layanan" required>
            <Select
              value={serviceId}
              onChange={(e) => handleServiceChange(e.target.value)}
            >
              {catalog.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Pilih Item Layanan" required>
            <Select
              name="service_item_select"
              value={serviceItemId}
              onChange={(e) => setServiceItemId(e.target.value)}
            >
              {(selectedService?.service_items ?? []).map((item: any) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4bb7]">
            Langkah 2
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
            Isi Data Formulir
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Lengkapi data sesuai kebutuhan item layanan yang dipilih.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {(selectedItem?.service_form_fields ?? [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((field: any) => {
              const common = {
                name: `answer_${field.id}`,
                required: field.is_required,
                placeholder: field.placeholder || "",
              };

              return (
                <div
                  key={field.id}
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <Field label={field.label} required={field.is_required}>
                    {field.type === "textarea" ? (
                      <Textarea {...common} />
                    ) : field.type === "select" ? (
                      <Select {...common}>
                        <option value="">Pilih salah satu</option>
                        {parseJsonArray(field.options).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </Select>
                    ) : field.type === "date" ? (
                      <Input type="date" {...common} />
                    ) : field.type === "number" ? (
                      <Input type="number" {...common} />
                    ) : (
                      <Input type="text" {...common} />
                    )}
                  </Field>
                </div>
              );
            })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#1f4bb7]">
            Langkah 3
          </p>
          <h3 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
            Upload Dokumen Persyaratan
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            Unggah dokumen dengan format dan ukuran sesuai ketentuan.
          </p>
        </div>

        {(selectedItem?.service_requirements ?? []).length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(selectedItem?.service_requirements ?? []).map(
              (requirement: any) => (
                <div
                  key={requirement.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4"
                >
                  <Field
                    label={requirement.document_name}
                    required={requirement.is_required}
                    hint={`Format: ${requirement.allowed_extensions || "pdf,jpg,jpeg,png"} | Maks: ${requirement.max_file_size_mb} MB`}
                  >
                    <Input
                      type="file"
                      name={`requirement_${requirement.id}`}
                      required={requirement.is_required}
                      accept={(
                        requirement.allowed_extensions || "pdf,jpg,jpeg,png"
                      )
                        .split(",")
                        .map((ext: string) => `.${ext.trim()}`)
                        .join(",")}
                    />
                  </Field>
                </div>
              ),
            )}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            Item layanan ini tidak memiliki dokumen wajib.
          </p>
        )}
      </section>

      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <div className="sticky bottom-3 z-10 rounded-2xl border border-blue-200 bg-white/95 p-3 shadow-sm backdrop-blur sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
        <Button className="h-11 w-full sm:w-auto" disabled={loading}>
          {loading ? "Menyimpan..." : "Kirim Pengajuan"}
        </Button>
      </div>
    </form>
  );
}
