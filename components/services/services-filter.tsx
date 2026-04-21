"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Layers3,
  ListTree,
  Search,
  ShieldCheck,
} from "lucide-react";

type ServiceItem = {
  id: number;
  name: string;
};

type Service = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  service_items?: ServiceItem[];
};

function normalize(text: string) {
  return text.toLowerCase().trim();
}

export function ServicesFilter({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");

  const filteredServices = useMemo(() => {
    const keyword = normalize(query);
    if (!keyword) return services;

    return services.filter((service) => {
      const haystack = [
        service.name,
        service.description || "",
        ...(service.service_items ?? []).map((item) => item.name),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [query, services]);

  return (
    <>
      <section className="ptsp-card p-3 sm:p-4">
        <div className="grid gap-2 sm:grid-cols-[1fr,170px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari unit kerja / layanan / item..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm text-slate-700 shadow-sm transition focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/20"
            />
          </label>

          <button
            type="button"
            onClick={() => setQuery("")}
            className="h-11 rounded-xl bg-[#1f4bb7] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f9a]"
          >
            Tampilkan Semua
          </button>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <p className="text-slate-600">
            Menampilkan{" "}
            <span className="font-bold text-slate-800">
              {filteredServices.length}
            </span>{" "}
            dari{" "}
            <span className="font-bold text-slate-800">{services.length}</span>{" "}
            unit layanan
          </p>
          {query ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eaf0ff] px-2.5 py-1 text-[11px] font-semibold text-[#1f4bb7]">
              kata kunci: “{query}”
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              semua layanan
            </span>
          )}
        </div>
      </section>

      {!filteredServices.length ? (
        <section className="ptsp-card p-6 text-center sm:p-8">
          <p className="text-sm font-semibold text-slate-800 sm:text-base">
            Tidak ada layanan yang cocok dengan pencarian.
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Coba kata kunci lain atau tampilkan semua layanan.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#1f4bb7] px-4 text-sm font-semibold text-white hover:bg-[#183f9a]"
          >
            Reset Pencarian
          </button>
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredServices.map((service, idx) => (
            <article
              key={service.id}
              className="ptsp-card group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-1 w-full bg-linear-to-r from-[#1f4bb7] via-[#2d7fff] to-[#00a2b8]" />
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e8efff] px-2.5 py-1 text-[11px] font-semibold text-[#1f4bb7]">
                    <ShieldCheck className="h-3 w-3" />
                    Unit {idx + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                    <Layers3 className="h-3 w-3" />
                    {service.service_items?.length ?? 0} item
                  </span>
                </div>

                <h2 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">
                  {service.name}
                </h2>

                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {service.description ||
                    "Layanan tersedia untuk pengajuan online."}
                </p>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                  <Building2 className="h-3.5 w-3.5 text-[#1f4bb7]" />
                  Kementerian Agama Barito Utara
                </div>

                <div className="mt-4 space-y-2">
                  {(service.service_items ?? []).length ? (
                    (service.service_items ?? []).slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
                      >
                        <ListTree className="mt-0.5 h-4 w-4 shrink-0 text-[#1f4bb7]" />
                        <p className="line-clamp-1 text-sm font-medium text-slate-700">
                          {item.name}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      Belum ada item layanan.
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-1">
                  <Link
                    href={`/layanan/${service.slug}`}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-[#1f4bb7] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#183f9a]"
                  >
                    Detail Layanan
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </>
  );
}
