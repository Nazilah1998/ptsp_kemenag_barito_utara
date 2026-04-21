"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Apa itu PTSP Kemenag?",
    a: "PTSP Kemenag adalah layanan terpadu satu pintu untuk mempermudah masyarakat mengakses berbagai layanan Kementerian Agama secara online, cepat, dan transparan.",
  },
  {
    q: "Bagaimana cara mendaftar akun baru?",
    a: "Pilih menu Daftar, isi data akun dengan lengkap, lalu lakukan verifikasi. Setelah aktif, Anda dapat login dan mengajukan layanan.",
  },
  {
    q: "Apa syarat dokumen yang dikirim?",
    a: "Syarat dokumen mengikuti item layanan yang dipilih. Pastikan format file dan ukuran maksimum sesuai ketentuan pada form pengajuan.",
  },
  {
    q: "Bagaimana cara melacak status layanan?",
    a: "Gunakan halaman Lacak Permohonan dengan kode pelacakan atau pantau langsung dari dashboard pada menu riwayat pengajuan.",
  },
];

export function SiteHomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.q}
            className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
              isOpen
                ? "border-[#1f4bb7]/30 bg-white shadow-[0_8px_24px_rgba(31,75,183,0.1)]"
                : "border-slate-200 bg-white shadow-sm hover:border-[#1f4bb7]/20 hover:shadow-md"
            }`}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    isOpen ? "bg-[#1f4bb7] text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <HelpCircle className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-slate-800 sm:text-[15px]">
                  {item.q}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 flex-shrink-0 transition-all duration-300 ${
                  isOpen ? "rotate-180 text-[#1f4bb7]" : "text-slate-400"
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 px-5 py-4">
                  <p className="text-sm leading-relaxed text-slate-600">{item.a}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
