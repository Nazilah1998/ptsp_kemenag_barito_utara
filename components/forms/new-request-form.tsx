'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { parseJsonArray } from '@/lib/utils';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Catalog = any[];

export function NewRequestForm({ catalog }: { catalog: Catalog }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState<string>(String(catalog[0]?.id ?? ''));
  const [serviceItemId, setServiceItemId] = useState<string>(
    String(catalog[0]?.service_items?.[0]?.id ?? '')
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedService = useMemo(
    () => catalog.find((service) => String(service.id) === serviceId),
    [catalog, serviceId]
  );

  const selectedItem = useMemo(
    () => selectedService?.service_items?.find((item: any) => String(item.id) === serviceItemId),
    [selectedService, serviceItemId]
  );

  const handleServiceChange = (value: string) => {
    setServiceId(value);
    const nextService = catalog.find((service) => String(service.id) === value);
    setServiceItemId(String(nextService?.service_items?.[0]?.id ?? ''));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/requests', {
      method: 'POST',
      body: formData
    });

    const result = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(result.error || 'Gagal membuat pengajuan.');
      return;
    }

    router.push(`/dashboard/pengajuan/${result.id}`);
    router.refresh();
  };

  if (!catalog.length) {
    return <p className="text-sm text-slate-500">Belum ada layanan aktif.</p>;
  }

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="service_item_id" value={serviceItemId} />

      <Field label="Pilih Layanan" required>
        <Select value={serviceId} onChange={(e) => handleServiceChange(e.target.value)}>
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

      <div className="grid gap-4 md:grid-cols-2">
        {(selectedItem?.service_form_fields ?? [])
          .sort((a: any, b: any) => a.sort_order - b.sort_order)
          .map((field: any) => {
            const common = {
              name: `answer_${field.id}`,
              required: field.is_required,
              placeholder: field.placeholder || ''
            };

            return (
              <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                <Field label={field.label} required={field.is_required}>
                  {field.type === 'textarea' ? (
                    <Textarea {...common} />
                  ) : field.type === 'select' ? (
                    <Select {...common}>
                      <option value="">Pilih salah satu</option>
                      {parseJsonArray(field.options).map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  ) : field.type === 'date' ? (
                    <Input type="date" {...common} />
                  ) : field.type === 'number' ? (
                    <Input type="number" {...common} />
                  ) : (
                    <Input type="text" {...common} />
                  )}
                </Field>
              </div>
            );
          })}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900">Upload Dokumen Persyaratan</h3>
        {(selectedItem?.service_requirements ?? []).length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {(selectedItem?.service_requirements ?? []).map((requirement: any) => (
              <Field
                key={requirement.id}
                label={requirement.document_name}
                required={requirement.is_required}
                hint={`Format: ${requirement.allowed_extensions || 'pdf,jpg,jpeg,png'} | Maks: ${requirement.max_file_size_mb} MB`}
              >
                <Input
                  type="file"
                  name={`requirement_${requirement.id}`}
                  required={requirement.is_required}
                  accept={(requirement.allowed_extensions || 'pdf,jpg,jpeg,png')
                    .split(',')
                    .map((ext: string) => `.${ext.trim()}`)
                    .join(',')}
                />
              </Field>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Item layanan ini tidak memiliki dokumen wajib.</p>
        )}
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <Button disabled={loading}>{loading ? 'Menyimpan...' : 'Kirim Pengajuan'}</Button>
    </form>
  );
}
