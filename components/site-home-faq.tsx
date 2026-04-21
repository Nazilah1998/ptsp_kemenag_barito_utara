"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";

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
            className="overflow-hidden rounded-2xl border border-[#d9e4ff] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.06)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left sm:px-5 sm:py-4"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              aria-expanded={isOpen}
            >
              <span className="flex items-center gap-2.5">
                <span className="rounded-full bg-[#eaf0ff] p-1.5">
                  <CircleHelp className="h-4 w-4 text-[#1f4bb7]" />
                </span>
                <span className="text-sm font-semibold text-slate-800 sm:text-[15px]">
                  {item.q}
                </span>
              </span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#1f4bb7] transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 sm:px-5">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
