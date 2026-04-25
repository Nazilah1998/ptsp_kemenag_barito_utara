import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock3,
  MessageCircle,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ArrowRight,
  Search,
} from "lucide-react";

const faqItems = [
  {
    q: "Bagaimana cara melacak status layanan?",
    a: "Masuk ke menu Lacak Layanan lalu masukkan nomor pengajuan yang Anda terima saat mendaftar. Status akan diperbarui secara real-time.",
  },
  {
    q: "Apakah semua layanan harus melalui akun?",
    a: "Ya, untuk menjaga keamanan data pribadi dan memudahkan pelacakan histori pengajuan, seluruh pemohon wajib login terlebih dahulu.",
  },
  {
    q: "Bagaimana jika dokumen saya ditolak?",
    a: "Petugas akan memberikan catatan revisi atau alasan penolakan yang bisa Anda lihat di dashboard pemohon. Anda dapat memperbaiki dan mengirim ulang dokumen.",
  },
  {
    q: "Berapa lama proses pengajuan berlangsung?",
    a: "Durasi proses bergantung pada jenis layanan. Anda dapat memantau progres secara langsung melalui menu Lacak Layanan.",
  },
];

const contactInfo = [
  {
    icon: MapPin,
    label: "Alamat Kantor",
    value: "Jl. Yetro Singseng, Muara Teweh, Barito Utara, Kalimantan Tengah",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "(0519) 000000",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Mail,
    label: "Email",
    value: "ptsp@kemenag.go.id",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Clock3,
    label: "Jam Operasional",
    value: "Senin – Jumat, 08.00 – 16.00 WITA",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export default function ContactPage() {
  return (
    <div className="w-full overflow-hidden">
      {/* Immersive Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d2d8a] via-[#1f4bb7] to-[#1a53c8] pt-12 pb-24 md:pt-16 md:pb-32">
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#5eeaa5]/20 blur-[100px]" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 sm:px-10 lg:px-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md mb-4">
            <MessageCircle className="h-4 w-4 text-[#5eeaa5]" />
            Kontak PTSP
          </span>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl md:text-6xl drop-shadow-sm">
            Hubungi Kami
          </h1>
          <p className="mt-4 text-base leading-relaxed text-blue-100/90 sm:text-lg max-w-2xl mx-auto">
            Silakan hubungi kami untuk pertanyaan terkait pengajuan layanan,
            dokumen persyaratan, atau kendala teknis pada portal PTSP.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative -mt-16 mb-24 px-6 sm:px-10 lg:px-12">
        <div className="mx-auto w-full max-w-5xl space-y-8">
          {/* Contact Info Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="rounded-[2rem] bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg}`}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900 leading-relaxed">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Two Column: Kanal Pengaduan + Quick Links */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Kanal Pengaduan */}
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
                  <ShieldAlert className="h-6 w-6 text-rose-600" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Kanal Pengaduan
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 mb-6">
                Untuk pelaporan dugaan pelanggaran layanan atau penyimpangan
                prosedur, gunakan kanal resmi Whistle Blowing System (WBS)
                Kementerian Agama.
              </p>
              <div className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-amber-100/50 p-5">
                <p className="font-bold text-amber-900 text-sm">
                  Whistle Blowing System (WBS)
                </p>
                <p className="mt-1 text-xs text-amber-800/80">
                  Laporan Anda akan dijaga kerahasiaannya dan diproses sesuai
                  mekanisme yang berlaku.
                </p>
                <a
                  href="https://wbs.kemenag.go.id"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-amber-700 hover:-translate-y-0.5 shadow-md"
                >
                  Buka WBS Kemenag
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-[2rem] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <ArrowRight className="h-6 w-6 text-[#1f4bb7]" />
                </div>
                <h2 className="text-xl font-black text-slate-900">
                  Akses Cepat
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 mb-6">
                Gunakan tautan di bawah ini untuk navigasi langsung ke fitur
                utama portal PTSP.
              </p>
              <div className="space-y-3">
                <Link
                  href="/track"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-[#1f4bb7]/20 hover:bg-[#1f4bb7]/5"
                >
                  <div className="flex items-center gap-3">
                    <Search className="h-5 w-5 text-[#1f4bb7]" />
                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#1f4bb7]">
                      Lacak Pengajuan
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1f4bb7]" />
                </Link>
                <Link
                  href="/layanan"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-[#1f4bb7]/20 hover:bg-[#1f4bb7]/5"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#1f4bb7]">
                      Katalog Layanan
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1f4bb7]" />
                </Link>
                <Link
                  href="/dashboard/pengajuan/baru"
                  className="group flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-[#1f4bb7]/20 hover:bg-[#1f4bb7]/5"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-bold text-slate-800 group-hover:text-[#1f4bb7]">
                      Ajukan Permohonan Baru
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-[#1f4bb7]" />
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="rounded-[2rem] bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f4bb7]/10">
                <HelpCircle className="h-6 w-6 text-[#1f4bb7]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Pertanyaan Umum (FAQ)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Jawaban atas pertanyaan yang paling sering diajukan
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {faqItems.map((item, idx) => (
                <div
                  key={item.q}
                  className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-5 transition-colors hover:border-[#1f4bb7]/20 hover:bg-[#1f4bb7]/5"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#1f4bb7]/10 text-xs font-black text-[#1f4bb7]">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 group-hover:text-[#1f4bb7] transition-colors">
                        {item.q}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
