insert into public.services (name, slug, description, is_active)
values
  ('Layanan Pendidikan Madrasah', 'layanan-pendidikan-madrasah', 'Layanan administrasi pendidikan madrasah.', true),
  ('Layanan Haji dan Umrah', 'layanan-haji-dan-umrah', 'Layanan administrasi haji dan umrah.', true)
on conflict (slug) do nothing;

insert into public.service_items (service_id, name, slug, description, is_active)
select s.id, x.name, x.slug, x.description, true
from public.services s
join (
  values
    ('layanan-pendidikan-madrasah', 'Rekomendasi Pindah Madrasah', 'rekomendasi-pindah-madrasah', 'Pengajuan rekomendasi pindah madrasah.'),
    ('layanan-pendidikan-madrasah', 'Legalisir Ijazah', 'legalisir-ijazah', 'Permohonan legalisir ijazah.'),
    ('layanan-haji-dan-umrah', 'Surat Keterangan Haji', 'surat-keterangan-haji', 'Permohonan surat keterangan haji.')
) as x(service_slug, name, slug, description)
on s.slug = x.service_slug
on conflict (slug) do nothing;

insert into public.service_form_fields (service_item_id, label, name, type, placeholder, is_required, options, sort_order)
select i.id, x.label, x.name, x.type, x.placeholder, x.is_required, x.options, x.sort_order
from public.service_items i
join (
  values
    ('rekomendasi-pindah-madrasah', 'Nama Siswa', 'nama_siswa', 'text', 'Masukkan nama siswa', true, null, 1),
    ('rekomendasi-pindah-madrasah', 'NISN', 'nisn', 'text', 'Masukkan NISN', true, null, 2),
    ('rekomendasi-pindah-madrasah', 'Alasan Pindah', 'alasan_pindah', 'textarea', 'Tuliskan alasan pindah', true, null, 3),
    ('legalisir-ijazah', 'Nama Alumni', 'nama_alumni', 'text', 'Masukkan nama alumni', true, null, 1),
    ('legalisir-ijazah', 'Tahun Lulus', 'tahun_lulus', 'number', 'Masukkan tahun lulus', true, null, 2),
    ('surat-keterangan-haji', 'Nama Jamaah', 'nama_jamaah', 'text', 'Masukkan nama jamaah', true, null, 1),
    ('surat-keterangan-haji', 'Nomor Porsi', 'nomor_porsi', 'text', 'Masukkan nomor porsi', true, null, 2)
) as x(item_slug, label, name, type, placeholder, is_required, options, sort_order)
on i.slug = x.item_slug
on conflict do nothing;

insert into public.service_requirements (service_item_id, document_name, description, is_required, allowed_extensions, max_file_size_mb)
select i.id, x.document_name, x.description, x.is_required, x.allowed_extensions, x.max_file_size_mb
from public.service_items i
join (
  values
    ('rekomendasi-pindah-madrasah', 'Surat Pengantar Sekolah', 'Surat resmi dari sekolah asal.', true, 'pdf,jpg,jpeg,png', 5),
    ('rekomendasi-pindah-madrasah', 'Kartu Keluarga', 'Upload scan kartu keluarga.', true, 'pdf,jpg,jpeg,png', 5),
    ('legalisir-ijazah', 'Scan Ijazah', 'Ijazah yang akan dilegalisir.', true, 'pdf,jpg,jpeg,png', 5),
    ('surat-keterangan-haji', 'Bukti Pendaftaran Haji', 'Dokumen bukti pendaftaran haji.', true, 'pdf,jpg,jpeg,png', 5)
) as x(item_slug, document_name, description, is_required, allowed_extensions, max_file_size_mb)
on i.slug = x.item_slug
on conflict do nothing;
