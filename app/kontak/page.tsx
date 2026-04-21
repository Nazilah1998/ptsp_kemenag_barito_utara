import { Mail, Phone, MapPin, Clock3 } from "lucide-react";

const faqItems = [
  {
    q: "Bagaimana cara melacak status layanan?",
    a: "Masuk ke menu Track Layanan lalu masukkan nomor pengajuan Anda.",
  },
  {
    q: "Apakah semua layanan harus melalui akun?",
    a: "Ya, untuk keamanan data dan histori pengajuan, pemohon harus login.",
  },
  {
    q: "Bagaimana jika dokumen saya ditolak?",
    a: "Admin akan memberikan catatan revisi/penolakan yang bisa dilihat di dashboard pemohon.",
  },
];

export default function ContactPage() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="ptsp-card relative overflow-hidden p-6 md:p-8">
        <div className="pointer-events-none absolute -left-16 -top-16 h-44 w-44 rounded-full bg-[#1f4bb7]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-16 h-56 w-56 rounded-full bg-[#9f8437]/15 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-[#cddcff] bg-[#edf3ff] px-3 py-1 text-xs font-semibold text-[#1f4bb7]">
            Kontak PTSP
          </span>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Hubungi Layanan PTSP Kemenag Barito Utara
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            Silakan hubungi kami untuk pertanyaan terkait pengajuan layanan,
            dokumen persyaratan, atau kendala teknis pada portal.
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="ptsp-card space-y-4 p-5 md:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Informasi Kantor
          </h2>
          <div className="space-y-3 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-[#1f4bb7]" /> Jl. Yetro
              Singseng, Muara Teweh, Barito Utara
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#1f4bb7]" /> (0519) 000000
            </p>
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#1f4bb7]" /> ptsp@kemenag.go.id
            </p>
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-[#1f4bb7]" /> Senin - Jumat, 08.00
              - 16.00 WITA
            </p>
          </div>
        </div>

        <div className="ptsp-card p-5 md:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">
            Kanal Pengaduan
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Untuk pelaporan dugaan pelanggaran layanan, gunakan kanal resmi
            Whistle Blowing System (WBS) Kementerian Agama.
          </p>
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <p className="font-semibold">Whistle Blowing System</p>
            <p className="mt-1">
              Laporan Anda akan diproses sesuai mekanisme yang berlaku.
            </p>
          </div>
        </div>
      </section>

      <section className="ptsp-card p-5 md:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">FAQ Singkat</h2>
        <div className="mt-4 space-y-3">
          {faqItems.map((item) => (
            <div
              key={item.q}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <p className="text-sm font-semibold text-slate-900">{item.q}</p>
              <p className="mt-1 text-sm text-slate-600">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
