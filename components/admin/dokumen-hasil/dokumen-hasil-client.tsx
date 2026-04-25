"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Search,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileDigit,
  Download,
  ExternalLink,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export function DokumenHasilClient({
  requests,
  urlMap,
  services,
}: {
  requests: any[];
  urlMap: Record<string, string | null>;
  services: { id: string; name: string }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      (r.request_number || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (r.profiles?.full_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (r.services?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesService = serviceFilter
      ? r.services?.id === serviceFilter
      : true;

    return matchesSearch && matchesService;
  });

  const totalPages = Math.ceil(filteredRequests.length / PER_PAGE);
  const paginatedRequests = filteredRequests.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setPage(1);
  };

  const handleFilterChange = (svc: string) => {
    setServiceFilter(svc);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari no permohonan, nama pemohon..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#1f4bb7] focus:ring-[#1f4bb7]/20"
          />
        </div>
        <div className="w-full sm:w-64 shrink-0 relative">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={serviceFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full h-11 pl-9 pr-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 shadow-sm focus:border-[#1f4bb7] focus:ring-2 focus:ring-[#1f4bb7]/20 appearance-none outline-none transition-all cursor-pointer hover:border-slate-300 truncate bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
          >
            <option value="">Semua Layanan</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {paginatedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-4">
              <FileDigit className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-slate-700">
              Tidak ada dokumen ditemukan
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Coba gunakan kata kunci pencarian yang lain.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedRequests.map((request: any) => {
              const fileUrl = urlMap[request.id];
              const isGenerated = !!request.generated_documents?.[0];
              const docDate = isGenerated
                ? formatDate(request.generated_documents[0].generated_at)
                : null;

              return (
                <div
                  key={request.id}
                  className="p-5 transition-colors hover:bg-slate-50/50 flex flex-col md:flex-row gap-5 md:items-center justify-between"
                >
                  {/* Info Permohonan */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm border ${
                        isGenerated
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : "bg-slate-50 text-slate-400 border-slate-100"
                      }`}
                    >
                      {isGenerated ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Clock className="h-6 w-6" />
                      )}
                    </div>
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 truncate">
                          {request.request_number}
                        </span>
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            request.status === "selesai"
                              ? "bg-emerald-100 text-emerald-700"
                              : request.status === "diproses"
                                ? "bg-blue-100 text-blue-700"
                                : request.status === "ditolak"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {request.profiles?.full_name || "Tanpa Nama"}
                      </p>
                      <p className="text-xs text-slate-500 truncate max-w-md">
                        {request.services?.name || "Layanan tidak diketahui"}
                      </p>
                      {isGenerated && (
                        <p className="text-[11px] font-medium text-emerald-600 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Diperbarui: {docDate}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 shrink-0 ml-16 md:ml-0">
                    {request.generated_documents?.[0]?.file_path ===
                    "EXPIRED" ? (
                      <span className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                        <AlertCircle className="h-4 w-4" />
                        Kadaluarsa
                      </span>
                    ) : fileUrl ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-all shadow-sm active:scale-95"
                      >
                        <Download className="h-4 w-4" />
                        Unduh
                      </a>
                    ) : (
                      <button
                        disabled
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Belum Ada
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3">
            <span className="text-xs text-slate-500 font-medium">
              Menampilkan{" "}
              {Math.min((page - 1) * PER_PAGE + 1, filteredRequests.length)} -{" "}
              {Math.min(page * PER_PAGE, filteredRequests.length)} dari{" "}
              {filteredRequests.length}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
