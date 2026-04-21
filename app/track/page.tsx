import Link from "next/link";
import { Search, FileClock, ShieldCheck, ArrowRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const admin = createAdminClient();

  let result: any = null;

  if (q.trim()) {
    const { data } = await admin
      .from("service_requests")
      .select(
        `
        id,
        request_number,
        status,
        created_at,
        submitted_at,
        approved_at,
        completed_at,
        rejection_reason,
        revision_note,
        services (name),
        service_items (name)
      `,
      )
      .eq("request_number", q.trim())
      .maybeSingle();

    result = data;
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <section className="ptsp-card relative overflow-hidden p-5 md:p-7">
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#1f4bb7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-40 w-40 rounded-full bg-[#9f8437]/15 blur-3xl" />

        <div className="relative mx-auto max-w-3xl space-y-3 text-center">
          <span className="inline-flex rounded-full border border-[#cddcff] bg-[#edf3ff] px-3 py-1 text-[11px] font-semibold text-[#1f4bb7]">
            Pelacakan Permohonan
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Lacak Status Pengajuan Anda
          </h1>
          <p className="text-sm text-slate-600 md:text-base">
            Masukkan nomor pengajuan untuk melihat status terbaru, catatan
            revisi, dan progres layanan.
          </p>
        </div>

        <form className="relative mx-auto mt-5 grid max-w-3xl gap-2.5 md:mt-6 md:grid-cols-[1fr,auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Contoh: PTSP-2026-0001"
              className="w-full rounded-xl border border-[#ced9f2] bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm transition focus:border-[#1f4bb7]/40"
            />
          </div>
          <button className="rounded-xl bg-[#1f4bb7] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f9a]">
            Lacak Sekarang
          </button>
        </form>
      </section>

      {q.trim() ? (
        result ? (
          <section className="ptsp-card p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nomor Pengajuan
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  {result.request_number}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  {result.services?.name} • {result.service_items?.name}
                </p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            <dl className="mt-5 grid gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 md:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-500">Tanggal Pengajuan</dt>
                <dd className="text-sm font-semibold text-slate-800">
                  {formatDate(result.created_at)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Diterima Sistem</dt>
                <dd className="text-sm font-semibold text-slate-800">
                  {result.submitted_at ? formatDate(result.submitted_at) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Disetujui</dt>
                <dd className="text-sm font-semibold text-slate-800">
                  {result.approved_at ? formatDate(result.approved_at) : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Selesai</dt>
                <dd className="text-sm font-semibold text-slate-800">
                  {result.completed_at ? formatDate(result.completed_at) : "-"}
                </dd>
              </div>
            </dl>

            {result.revision_note ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">Catatan Revisi</p>
                <p className="mt-1">{result.revision_note}</p>
              </div>
            ) : null}

            {result.rejection_reason ? (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <p className="font-semibold">Alasan Penolakan</p>
                <p className="mt-1">{result.rejection_reason}</p>
              </div>
            ) : null}
          </section>
        ) : (
          <section className="ptsp-card p-6 text-center">
            <p className="text-sm text-slate-600">
              Nomor pengajuan{" "}
              <span className="font-semibold text-slate-900">{q}</span> tidak
              ditemukan.
            </p>
          </section>
        )
      ) : null}

      <section className="grid gap-3 md:grid-cols-3">
        <div className="ptsp-card p-4 md:p-5">
          <FileClock className="h-5 w-5 text-[#1f4bb7]" />
          <p className="mt-2.5 text-sm font-bold text-slate-900">
            Status real-time
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Pantau progres tanpa perlu datang ke kantor.
          </p>
        </div>
        <div className="ptsp-card p-4 md:p-5">
          <ShieldCheck className="h-5 w-5 text-[#9f8437]" />
          <p className="mt-2.5 text-sm font-bold text-slate-900">Transparan</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            Semua perubahan status tercatat dan dapat ditinjau.
          </p>
        </div>
        <div className="ptsp-card p-4 md:p-5">
          <ArrowRight className="h-5 w-5 text-emerald-600" />
          <p className="mt-2.5 text-sm font-bold text-slate-900">
            Butuh bantuan?
          </p>
          <Link
            href="/kontak"
            className="mt-1 inline-block text-xs font-semibold text-[#1f4bb7] hover:underline"
          >
            Hubungi layanan bantuan
          </Link>
        </div>
      </section>
    </div>
  );
}
