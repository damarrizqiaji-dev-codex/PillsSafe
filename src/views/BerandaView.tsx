import React from 'react';
import type { BatchData, PageView, UserRole } from '../types.ts';
import { computeDashboardMetrics } from '../utils/batchLogic.ts';

interface BerandaViewProps {
  batches: Record<string, BatchData>;
  onNavigate: (view: PageView) => void;
  onSelectBatchToTrack: (batchId: string) => void;
  onOpenJalurPengolahan: () => void;
  onOpenInformasiBantuan: () => void;
  onChangeRole: (role: UserRole) => void;
}

export const BerandaView: React.FC<BerandaViewProps> = ({
  batches,
  onNavigate,
  onSelectBatchToTrack,
  onOpenJalurPengolahan,
  onOpenInformasiBantuan,
  onChangeRole,
}) => {
  const metrics = computeDashboardMetrics(batches);
  const batchList = Object.values(batches);

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner Notice */}
      <div className="relative w-full overflow-hidden bg-white px-4 md:px-6 py-8 md:py-12 border-b border-[#e2e8f0]">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#b4efd6]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-[#cce5ff]/40 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Context Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#003426] text-white font-body text-[11px] font-semibold shadow-xs tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b4efd6] animate-pulse"></span>
              Prototipe Tata Kelola Digital &amp; Pelacakan Batch
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eaedff] text-[#131b2e] font-data-tabular text-[12px]">
              <span className="material-symbols-outlined text-[14px] text-[#006398]">science</span>
              Status: Model Demonstrasi Simulasi (Data Terverifikasi Lab Wajib)
            </span>
          </div>

          {/* Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 flex flex-col gap-4">
              <h1 className="font-headline text-[26px] sm:text-[32px] md:text-[38px] text-[#003426] tracking-tight leading-tight font-bold">
                Pengelolaan Obat Kedaluwarsa yang Terarah dan Terlacak
              </h1>
              <p className="font-headline text-[16px] sm:text-[18px] text-[#213d8d] font-semibold leading-snug">
                "Tata Kelola Digital Obat Kedaluwarsa: Identifikasi, Pemilahan, Dua Jalur Riset Terpisah, dan Verifikasi Keselamatan Efluen"
              </p>
              <p className="font-body text-[14px] sm:text-[15px] text-[#404944] max-w-3xl leading-relaxed">
                PillsSafe adalah konsep platform digital untuk membantu tata kelola obat kedaluwarsa dari rumah tangga melalui pelaporan mandiri, identifikasi fisik, pemilahan, penelusuran batch, pemantauan dua jalur reaktor terpisah (Parasetamol dan Diklofenak), hingga verifikasi keselamatan efluen berbasis data uji laboratorium yang terpercaya.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('laporkan-obat')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#003426] text-white font-body text-[14px] font-semibold shadow-md hover:bg-[#0f4c3a] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">assignment_add</span>
                  <span>Laporkan Obat Kedaluwarsa</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('lacak-laporan')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded bg-[#006398] text-white font-body text-[14px] font-semibold shadow-sm hover:bg-[#004e78] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">track_changes</span>
                  <span>Lacak Status Batch</span>
                </button>
                <a
                  href="#ekosistem-alur"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded bg-[#f2f3ff] text-[#006398] font-body text-[14px] font-semibold hover:bg-[#eaedff] transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">account_tree</span>
                  <span>Alur 8 Tahap Ekosistem</span>
                </a>
              </div>
            </div>

            {/* Live Dashboard Telemetry Card */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="bg-[#f8fafc] rounded-xl p-4 border border-[#e2e8f0] shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-[#e2e8f0]">
                  <span className="font-body text-[11px] font-semibold text-[#404944] uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006398]"></span>
                    Dashboard Ringkasan Batch
                  </span>
                  <span className="font-data-tabular text-[10px] text-[#006398] font-bold px-2 py-0.5 rounded bg-white border border-[#cbd5e1]">
                    DATA DEMO
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Total Laporan Penerimaan</span>
                    <span className="font-headline text-[16px] text-[#003426] font-bold">
                      {metrics.total} <span className="text-[12px] font-normal text-[#64748b]">Batch</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Menunggu Identifikasi Fisik</span>
                    <span className="font-headline text-[14px] text-[#d97706] font-bold">
                      {metrics.awaitingInspection} <span className="text-[11px] font-normal">Batch</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Diterima untuk Jalur Riset</span>
                    <span className="font-headline text-[14px] text-[#003426] font-bold">
                      {metrics.acceptedForProcessing} <span className="text-[11px] font-normal">Batch</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Jalur Riset A (Parasetamol)</span>
                    <span className="font-headline text-[14px] text-[#006398] font-bold">
                      {metrics.routePathA} <span className="text-[11px] font-normal">Batch</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Jalur Riset B (Diklofenak)</span>
                    <span className="font-headline text-[14px] text-[#002575] font-bold">
                      {metrics.routePathB} <span className="text-[11px] font-normal">Batch</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#e2e8f0]">
                    <span className="font-body text-[12px] text-[#404944]">Memenuhi Kriteria Verifikasi</span>
                    <span className="font-headline text-[14px] text-[#003426] font-bold">
                      {metrics.decisionMet} <span className="text-[11px] font-normal text-[#003426]">Lolos</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#404944]">Data Belum Cukup</span>
                    <span className="font-headline text-[14px] text-[#d97706] font-bold">
                      {metrics.decisionInsufficient} <span className="text-[11px] font-normal">Menunggu Uji</span>
                    </span>
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-[#e2e8f0] flex justify-between items-center text-[11px] text-[#64748b]">
                  <span>Pemisahan Reaktor Fisik:</span>
                  <span className="text-[#003426] font-bold">Eksklusif Terpisah (A ≠ B)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Bento Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('lacak-laporan')}
              className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex items-start gap-3.5 hover:bg-[#f1f5f9] transition-all text-left shadow-xs group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#b4efd6] flex items-center justify-center text-[#002117] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Total Terdaftar
                </span>
                <span className="font-headline text-[20px] text-[#003426] font-bold">
                  {metrics.total} Batch
                </span>
                <span className="font-body text-[11px] text-[#404944]">
                  {metrics.acceptedForProcessing} diterima, {metrics.quarantinedOrRejected} karantina
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lacak-laporan')}
              className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex items-start gap-3.5 hover:bg-[#f1f5f9] transition-all text-left shadow-xs group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#cce5ff] flex items-center justify-center text-[#001d31] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">biotech</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Dua Jalur Riset
                </span>
                <span className="font-headline text-[20px] text-[#006398] font-bold">
                  Path A &amp; B
                </span>
                <span className="font-body text-[11px] text-[#404944]">
                  Reaktor A &amp; B terpisah secara fisik
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lacak-laporan')}
              className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex items-start gap-3.5 hover:bg-[#f1f5f9] transition-all text-left shadow-xs group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#002575] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">science</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Uji Tri-Parameter
                </span>
                <span className="font-headline text-[20px] text-[#002575] font-bold">
                  3 Parameter
                </span>
                <span className="font-body text-[11px] text-[#404944]">
                  Senyawa Induk, TPs, &amp; Toksisitas Bioassay
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('lacak-laporan')}
              className="bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0] flex items-start gap-3.5 hover:bg-[#f1f5f9] transition-all text-left shadow-xs group"
            >
              <div className="w-11 h-11 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#93000a] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Keputusan Verifikasi
                </span>
                <span className="font-headline text-[20px] text-[#131b2e] font-bold">
                  3 Status Baku
                </span>
                <span className="font-body text-[11px] text-[#404944]">
                  Memenuhi / Tidak Memenuhi / Belum Cukup
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Institutional Warning Notice */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-4 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl p-4 shadow-xs border border-[#e2e8f0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[22px]">policy</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-[15px] font-bold text-[#131b2e]">
                    Peringatan Kelembagaan &amp; Batasan Regulasi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#93000a] font-body text-[10px] font-bold uppercase">
                    Wajib Dipatuhi
                  </span>
                </div>
                <p className="font-body text-[13px] text-[#404944] leading-relaxed">
                  <strong>PillsSafe adalah platform pendukung tata kelola data dan pelacakan digital</strong>, bukan fasilitas fisik dan bukan pengganti uji laboratorium resmi. Biodegradasi adalah pendekatan yang sedang dikaji; penurunan konsentrasi senyawa induk <em>tidak otomatis membuktikan produk transformasinya aman</em>.{' '}
                  <span className="text-[#ba1a1a] font-semibold">
                    Dilarang membuang obat kedaluwarsa ke wastafel, toilet, saluran pembuangan, atau tempat sampah umum!
                  </span>
                </p>
              </div>
            </div>
            <div className="shrink-0 flex items-center">
              <button
                type="button"
                onClick={onOpenInformasiBantuan}
                className="inline-flex items-center gap-1.5 text-[#006398] font-body text-[13px] font-semibold px-3.5 py-2 rounded bg-[#f2f3ff] hover:bg-[#eaedff] transition-colors whitespace-nowrap"
              >
                <span>Baca SOP &amp; Glosarium</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Role Direct Entry Section (Pelapor + 2 Peran Khusus) */}
      <div className="w-full bg-white px-4 md:px-6 py-10 md:py-12 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <div>
              <span className="font-body text-[11px] font-bold text-[#006398] uppercase tracking-widest">
                Struktur Peran Sederhana &amp; Terfokus
              </span>
              <h2 className="font-headline text-[24px] text-[#003426] font-bold">
                Pintu Masuk 3 Peran Ekosistem PillsSafe
              </h2>
              <p className="font-body text-[14px] text-[#404944]">
                Semua tanggung jawab teknis selain pelapor disederhanakan menjadi 2 peran operasional khusus dengan laman instrumen masing-masing.
              </p>
            </div>
            <span className="font-data-tabular text-[12px] text-[#404944] px-3 py-1 bg-[#f2f3ff] rounded border border-[#e2e8f0]">
              Mode Simulasi Terintegrasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Role 1: Penyerah */}
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] flex flex-col justify-between hover:bg-[#f1f5f9] transition-all shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#b4efd6] flex items-center justify-center text-[#002117]">
                    <span className="material-symbols-outlined text-[22px]">person</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#003426] px-2 py-0.5 rounded bg-white border border-[#cbd5e1]">
                    Warga &amp; Penyerah
                  </span>
                </div>
                <div>
                  <h4 className="font-headline text-[17px] font-bold text-[#131b2e]">1. Penyerah</h4>
                  <p className="font-body text-[12px] text-[#64748b] mt-0.5">Penyerahan Mandiri Rumah Tangga</p>
                </div>
                <p className="font-body text-[13px] text-[#404944] leading-relaxed">
                  Menyerahkan obat kedaluwarsa secara mandiri, mencatat bentuk sediaan, kondisi kemasan, memilih lokasi Bio-Drop resmi, dan memantau tiket batch pelacakan.
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] text-[11px] text-[#475569] flex flex-col gap-1">
                  <span>&bull; Formulir intake dengan panduan penyerahan sekunder</span>
                  <span>&bull; Direktori titik pengumpulan Bio-Drop puskesmas/apotek</span>
                  <span>&bull; Pelacakan transparan 8 tahap siklus</span>
                </div>
              </div>
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => {
                    onChangeRole('Penyerah');
                    onNavigate('laporkan-obat');
                  }}
                  className="w-full py-2.5 rounded bg-[#003426] text-white font-body text-[13px] font-semibold hover:bg-[#0f4c3a] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_document</span>
                  <span>Mulai Serahkan Obat</span>
                </button>
              </div>
            </div>

            {/* Role 2: Petugas */}
            <div className="bg-[#f8fafc] rounded-xl p-5 border-2 border-[#003426] flex flex-col justify-between hover:bg-[#f1f5f9] transition-all shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#cce5ff] flex items-center justify-center text-[#001d31]">
                    <span className="material-symbols-outlined text-[22px]">engineering</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#006398] px-2 py-0.5 rounded bg-white border border-[#cbd5e1]">
                    Penerimaan &amp; Proses Reaktor
                  </span>
                </div>
                <div>
                  <h4 className="font-headline text-[17px] font-bold text-[#131b2e]">2. Petugas</h4>
                  <p className="font-body text-[12px] text-[#006398] font-semibold mt-0.5">Laman Khusus: Konsol Petugas Fasilitas</p>
                </div>
                <p className="font-body text-[13px] text-[#404944] leading-relaxed">
                  Mengelola pemeriksaan fisik di loket, pemilahan sediaan, alokasi Reaktor Riset A vs B terpisah, pemantauan tangki pascaproses, dan registrasi sampel efluen aseptis.
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] text-[11px] text-[#475569] flex flex-col gap-1">
                  <span>&bull; Skrining fisik &amp; konfirmasi zat aktif loket</span>
                  <span>&bull; Kontrol Reaktor A (Parasetamol) &amp; Reaktor B (Diklofenak)</span>
                  <span>&bull; Pengambilan sampel rantai dingin dari holding tank</span>
                </div>
              </div>
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => {
                    onChangeRole('Petugas');
                    onNavigate('operator-fasilitas');
                  }}
                  className="w-full py-2.5 rounded bg-[#006398] text-white font-body text-[13px] font-semibold hover:bg-[#004e78] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Buka Konsol Petugas</span>
                </button>
              </div>
            </div>

            {/* Role 3: Peneliti */}
            <div className="bg-[#f8fafc] rounded-xl p-5 border-2 border-[#002575] flex flex-col justify-between hover:bg-[#f1f5f9] transition-all shadow-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#002575]">
                    <span className="material-symbols-outlined text-[22px]">biotech</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#002575] px-2 py-0.5 rounded bg-white border border-[#cbd5e1]">
                    Analisis Lab &amp; Kepatuhan
                  </span>
                </div>
                <div>
                  <h4 className="font-headline text-[17px] font-bold text-[#131b2e]">3. Peneliti</h4>
                  <p className="font-body text-[12px] text-[#002575] font-semibold mt-0.5">Laman Khusus: Portal Peneliti Lab</p>
                </div>
                <p className="font-body text-[13px] text-[#404944] leading-relaxed">
                  Memeriksa sampel efluen, menginput hasil uji kromatografi HPLC, spektrometri massa LC-MS/MS, dan bioassay toksisitas, serta menerbitkan Keputusan Verifikasi Resmi.
                </p>
                <div className="p-2.5 rounded-lg bg-white border border-[#e2e8f0] text-[11px] text-[#475569] flex flex-col gap-1">
                  <span>&bull; Uji tri-parameter efluen (Senyawa Induk, TPs, Bioassay)</span>
                  <span>&bull; Penerbitan 3 status baku keputusan verifikasi</span>
                  <span>&bull; Otorisasi Sertifikat Analisis (CoA) &amp; audit dossier</span>
                </div>
              </div>
              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => {
                    onChangeRole('Peneliti');
                    onNavigate('verifikator-lab');
                  }}
                  className="w-full py-2.5 rounded bg-[#002575] text-white font-body text-[13px] font-semibold hover:bg-[#131b2e] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Buka Portal Peneliti</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alur 8 Tahap Ekosistem PillsSafe */}
      <div className="w-full bg-[#f8fafc] px-4 md:px-6 py-10 md:py-12 border-b border-[#e2e8f0]" id="ekosistem-alur">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="font-body text-[11px] font-bold text-[#003426] uppercase tracking-widest">
                Arsitektur Rantai Nilai Tertutup
              </span>
              <h2 className="font-headline text-[24px] text-[#003426] font-bold">
                Alur 8 Tahap Ekosistem PillsSafe
              </h2>
              <p className="font-body text-[14px] text-[#404944]">
                Setiap laporan dan spesimen dipantau secara berurutan dari penerimaan hingga keputusan verifikasi keselamatan efluen.
              </p>
            </div>
            <div className="flex items-center gap-2 font-body text-[12px] font-semibold text-[#404944]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#003426]"></span>
              Alur Terstruktur Tanpa Klaim Tanpa Uji
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#003426] px-2 py-0.5 rounded bg-[#b4efd6]">
                  TAHAP 01
                </span>
                <span className="material-symbols-outlined text-[#003426] text-[22px]">app_registration</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Registrasi &amp; Pelaporan</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Pencatatan data obat, perkiraan jumlah, kondisi kemasan, dan pemilihan titik Bio-Drop. Penerbitan ID batch digital (obat belum diterima fisik).
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">qr_code_2</span> Output: Tiket Batch Digital
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#003426] px-2 py-0.5 rounded bg-[#b4efd6]">
                  TAHAP 02
                </span>
                <span className="material-symbols-outlined text-[#003426] text-[22px]">move_to_inbox</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Pengumpulan &amp; Fisik</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Penyerahan fisik di Bio-Drop puskesmas/apotek resmi. Petugas memeriksa segel wadah sekunder dan mengonfirmasi penerimaan fisik.
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">pin_drop</span> Output: Konfirmasi Serah Terima
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#003426] px-2 py-0.5 rounded bg-[#b4efd6]">
                  TAHAP 03
                </span>
                <span className="material-symbols-outlined text-[#003426] text-[22px]">checklist</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Identifikasi &amp; Pemilahan</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Pemeriksaan zat aktif fisik vs klaim pelapor, bentuk sediaan, serta status pemilahan (diterima, butuh verifikasi, atau dikarantina/ditolak).
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">fact_check</span> Output: Status Pemilahan Resmi
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#006398] px-2 py-0.5 rounded bg-[#cce5ff]">
                  TAHAP 04
                </span>
                <span className="material-symbols-outlined text-[#006398] text-[22px]">alt_route</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Penetapan Jalur Riset</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Alokasi ke reaktor riset terpisah: Path A (Parasetamol) ke Reaktor A atau Path B (Diklofenak) ke Reaktor B. Tanpa pencampuran kedua jalur.
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">call_split</span> Output: Alokasi Reaktor Eksklusif
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#006398] px-2 py-0.5 rounded bg-[#cce5ff]">
                  TAHAP 05
                </span>
                <span className="material-symbols-outlined text-[#006398] text-[22px]">dew_point</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Reaktor &amp; Tangki Pascaproses</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Pencatatan siklus biodegradasi. Efluen keluaran dialirkan ke tangki penampung terpisah (Holding Tank A atau B) dan ditahan untuk verifikasi.
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">inventory</span> Output: Holding Tank A / B
              </div>
            </div>

            {/* Step 6 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#002575] px-2 py-0.5 rounded bg-[#dce1ff]">
                  TAHAP 06
                </span>
                <span className="material-symbols-outlined text-[#002575] text-[22px]">colorize</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Sampling Efluen Terdaftar</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Pengambilan sampel efluen pascaproses secara aseptis dari holding tank, penerbitan ID sampel unik, dan pengiriman dengan rantai dingin.
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">label</span> Output: ID Sampel Efluen
              </div>
            </div>

            {/* Step 7 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#002575] px-2 py-0.5 rounded bg-[#dce1ff]">
                  TAHAP 07
                </span>
                <span className="material-symbols-outlined text-[#002575] text-[22px]">biotech</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Hasil Analisis Efluen</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Pencatatan hasil uji 3 parameter: senyawa induk (HPLC), produk transformasi (LC-MS/MS), dan bioassay toksisitas (Daphnia magna 48h).
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">table_chart</span> Output: Data Analitis Terverifikasi
              </div>
            </div>

            {/* Step 8 */}
            <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-data-tabular text-[12px] font-bold text-[#003426] px-2 py-0.5 rounded bg-[#b4efd6]">
                  TAHAP 08
                </span>
                <span className="material-symbols-outlined text-[#003426] text-[22px]">verified</span>
              </div>
              <h4 className="font-headline text-[15px] font-bold text-[#131b2e] pt-1">Keputusan Verifikasi</h4>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Penetapan 3 status baku: Memenuhi Kriteria Verifikasi, Tidak Memenuhi Kriteria, atau Data Belum Cukup, disertai alasan dan tindakan lanjutan.
              </p>
              <div className="mt-auto pt-2 text-[11px] text-[#64748b] flex items-center gap-1 border-t border-[#f1f5f9]">
                <span className="material-symbols-outlined text-[14px]">gavel</span> Output: Status Keputusan Resmi
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Research Routes Detailed Focus */}
      <div className="w-full bg-white px-4 md:px-6 py-10 md:py-12 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="font-body text-[11px] font-bold text-[#006398] uppercase tracking-widest">
                Kajian Literatur Terarah
              </span>
              <h2 className="font-headline text-[24px] text-[#003426] font-bold">
                Dua Jalur Riset Biodegradasi Terpisah
              </h2>
              <p className="font-body text-[14px] text-[#404944]">
                Karakteristik kimia analgesik dan NSAID memerlukan jalur reaktor, mikroorganisme, dan pemantauan metabolit yang berbeda.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenJalurPengolahan}
              className="inline-flex items-center gap-1.5 text-[#006398] font-body text-[13px] font-semibold hover:underline"
            >
              <span>Pelajari Rincian Ilmiah</span>
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pathway A */}
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#cbd5e1] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-[#b4efd6] text-[#002117] text-[11px] font-bold">
                  JALUR RISET A — REAKTOR A
                </span>
                <span className="text-[11px] text-[#64748b] font-data-tabular">CAS: 103-90-2</span>
              </div>
              <h3 className="font-headline text-[18px] font-bold text-[#003426]">
                Parasetamol (Acetaminophen)
              </h3>
              <p className="text-[12px] text-[#475569] leading-relaxed">
                Senyawa analgesik dan antipiretik. Model kajian literatur meneliti katabolisme aerobik cincin aromatik menggunakan strain mikroba pengurai (seperti <em>Pseudomonas moorei</em> KB4).
              </p>
              <div className="p-3 rounded-lg bg-white border border-[#e2e8f0] flex flex-col gap-1 text-[11px] text-[#334155]">
                <span>Infrastruktur: <strong>Reaktor Riset A &rarr; Holding Tank A</strong></span>
                <span>Fokus Pemantauan: <strong>4-Aminophenol (4-AP) &amp; Hidrokuinon</strong></span>
                <span>Uji Keamanan: <strong>Bioassay Daphnia magna 48-jam</strong></span>
              </div>
            </div>

            {/* Pathway B */}
            <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#cbd5e1] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-[#cce5ff] text-[#001d31] text-[11px] font-bold">
                  JALUR RISET B — REAKTOR B
                </span>
                <span className="text-[11px] text-[#64748b] font-data-tabular">CAS: 15307-79-6</span>
              </div>
              <h3 className="font-headline text-[18px] font-bold text-[#006398]">
                Diklofenak Natrium (NSAID)
              </h3>
              <p className="text-[12px] text-[#475569] leading-relaxed">
                Obat antiinflamasi non-steroid turunan asam fenilasetat. Model kajian literatur meneliti biodegradasi kometabolik menggunakan mikroorganisme toleran (seperti <em>Labrys portucalensis</em> F11).
              </p>
              <div className="p-3 rounded-lg bg-white border border-[#e2e8f0] flex flex-col gap-1 text-[11px] text-[#334155]">
                <span>Infrastruktur: <strong>Reaktor Riset B &rarr; Holding Tank B</strong></span>
                <span>Fokus Pemantauan: <strong>Metabolit terhidroksilasi &amp; senyawa terklorinasi</strong></span>
                <span>Uji Keamanan: <strong>Toksisitas akut mikrofauna perairan</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Active Batches Table (Demonstration Data) */}
      <div className="w-full bg-[#f8fafc] px-4 md:px-6 py-10 md:py-12 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="font-body text-[11px] font-bold text-[#003426] uppercase tracking-widest">
                Buku Besar Pelacakan Digital
              </span>
              <h2 className="font-headline text-[24px] text-[#003426] font-bold">
                Daftar Status Batch Efluen Terdaftar
              </h2>
              <p className="font-body text-[14px] text-[#404944]">
                Pilih salah satu batch untuk membuka halaman detail, timeline 8 tahap, dan panel verifikasi laboratorium.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-[#eaedff] text-[#002575] font-data-tabular text-[11px] font-semibold">
              Label: DATA DEMO AKTIF
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-[#cbd5e1] text-[11px] font-bold text-[#64748b] uppercase bg-[#f8fafc]">
                    <th className="py-3 px-4">Kode Batch</th>
                    <th className="py-3 px-4">Bahan Aktif</th>
                    <th className="py-3 px-4">Jalur &amp; Reaktor</th>
                    <th className="py-3 px-4">Holding Tank</th>
                    <th className="py-3 px-4">Status Verifikasi</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {batchList.map((b) => (
                    <tr key={b.code} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="py-3.5 px-4 font-data-tabular font-bold text-[#003426]">
                        {b.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#131b2e]">{b.reportedSubstance}</span>
                          <span className="text-[11px] text-[#64748b]">{b.confirmedSubstance}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#006398]">{b.reactorId}</span>
                          <span className="text-[11px] text-[#64748b]">{b.reactorStatus}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#475569]">
                        {b.holdingTankId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                            b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI'
                              ? 'bg-[#b4efd6] text-[#002117]'
                              : b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#fffbeb] text-[#92400e]'
                          }`}
                        >
                          {b.verificationDecision.decision}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectBatchToTrack(b.code);
                            onNavigate('lacak-laporan');
                          }}
                          className="px-3 py-1.5 rounded bg-[#003426] hover:bg-[#0f4c3a] text-white text-[11px] font-semibold transition-colors"
                        >
                          Lacak Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
