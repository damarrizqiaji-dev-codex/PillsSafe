import React, { useState } from 'react';
import type { PageView, CollectionPoint } from '../types.ts';
import { filterCollectionPoints } from '../utils/batchLogic.ts';
import { ProsedurModal } from '../components/ProsedurModal.tsx';

interface TitikPengumpulanViewProps {
  collectionPoints: CollectionPoint[];
  onNavigate: (view: PageView) => void;
  onSelectLocationForReport: (locationName: string) => void;
}

export const TitikPengumpulanView: React.FC<TitikPengumpulanViewProps> = ({
  collectionPoints,
  onNavigate,
  onSelectLocationForReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProsedurModalOpen, setIsProsedurModalOpen] = useState(false);
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);

  const filteredPoints = filterCollectionPoints(
    collectionPoints,
    searchQuery,
    categoryFilter,
    statusFilter
  );

  const handleSelectLocation = (pt: CollectionPoint) => {
    onSelectLocationForReport(`${pt.name} (Radius ${pt.distanceKm} km)`);
    onNavigate('laporkan-obat');
  };

  return (
    <div className="flex flex-col w-full">
      {/* Simulation Notice Banner */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-2 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-1 text-[11px] font-body">
          <div className="flex items-center gap-2 text-[#404944]">
            <span className="w-2 h-2 rounded-full bg-[#006398] animate-pulse"></span>
            <span className="font-data-tabular uppercase font-bold text-[#006398] tracking-wider">
              RUN-ID: SIM-BD-2024-098
            </span>
            <span className="text-[#cbd5e1]">|</span>
            <span>PREDIKSI KAPASITAS KANTONG: TERVALIDASI SIMULASI</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#002575] font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span className="font-data-tabular">
              DATA SIMULASI UNTUK DEMONSTRASI — STATUS TITIK LOKASI DIPERBARUI SECARA BERKALA
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">
        {/* Title Area */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#b4efd6] text-[#002117] font-body text-[11px] font-semibold uppercase tracking-wide">
                  Direktori Terakreditasi
                </span>
                <span className="text-[#cbd5e1] text-[11px]">•</span>
                <span className="font-body text-[11px] text-[#404944]">
                  Fasilitas Berlisensi Bio-Drop v2.4 (Data Demonstrasi)
                </span>
              </div>
              <h1 className="font-headline text-[24px] md:text-[32px] text-[#003426] font-bold tracking-tight">
                Jaringan Titik Pengumpulan Resmi (Bio-Drop)
              </h1>
              <p className="font-body text-[14px] text-[#404944] max-w-3xl leading-relaxed">
                Temukan lokasi penerimaan resmi terdekat untuk menyerahkan obat kedaluwarsa rumah tangga Anda secara terdokumentasi dan terkendali secara lingkungan.
              </p>
            </div>

            {/* Telemetry Summary Pill */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[#e2e8f0] shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#003426]"></div>
                <div className="flex flex-col">
                  <span className="font-body text-[10px] text-[#64748b]">Unit Terhubung</span>
                  <span className="font-data-tabular text-[13px] text-[#003426] font-bold">14 Titik Aktif</span>
                </div>
              </div>
              <div className="w-px h-8 bg-[#e2e8f0]"></div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#006398]"></div>
                <div className="flex flex-col">
                  <span className="font-body text-[10px] text-[#64748b]">Rerata Kuota</span>
                  <span className="font-data-tabular text-[13px] text-[#006398] font-bold">48.2% Tersedia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Protocol Critical Alert Box */}
          <div className="bg-white rounded-xl p-4 border border-[#e2e8f0] shadow-xs relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ba1a1a]"></div>
            <div className="flex items-start gap-3 pl-1">
              <div className="w-9 h-9 rounded-lg bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-body text-[12px] text-[#ba1a1a] uppercase tracking-wider font-bold">
                    PERINGATAN PROTOKOL FARMAKOVIGILANS LINGKUNGAN
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] font-body text-[10px] font-bold">
                    WAJIB
                  </span>
                </div>
                <p className="font-body text-[13px] text-[#404944] leading-relaxed">
                  Jangan pernah membuang obat ke wastafel, saluran air kloset, selokan terbuka, atau tempat sampah umum. Tindakan tersebut menginfiltrasi senyawa persisten ke dalam air tanah, merusak mikroflora perairan, dan mengakselerasi <strong className="text-[#131b2e] font-semibold">resistensi antimikroba (AMR)</strong>. Serahkan seluruh limbah sediaan ke unit Bio-Drop terdaftar untuk proses netralisasi &amp; peruraian terkontrol.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map Preview & Readiness Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Embedded Map Representation */}
          <div className="lg:col-span-8 bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col gap-3 relative">
            <div className="flex items-center justify-between pb-1 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#003426]">pin_drop</span>
                <span className="font-headline text-[15px] font-bold text-[#003426]">
                  Sebaran Geospasial Bio-Drop
                </span>
                <span className="text-[#64748b] font-data-tabular text-[12px]">(Zona Radius 6.0 KM)</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#f2f3ff] text-[11px] font-semibold text-[#131b2e]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#003426]"></span> Posisi GPS Terkunci
              </span>
            </div>

            {/* Map Canvas Mockup */}
            <div
              className="w-full h-72 rounded-lg relative overflow-hidden bg-cover bg-center shadow-inner flex items-end p-4 border border-[#cbd5e1]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfVnbril3gsx-SrD2LtpFKsR37HQ6KgJNmBAL0IH6_tXf4GJJZjDaLadZuTF-Mf6j8aK8XhIkv3FKqFKM6ZSCDyC_oVUQG34X2u6DzoRGfhy0_585p7dwQuMYeidwFsput5FA3FGDVdpuS6IZ7QNuVVdMadgFubhERrXpceKs5mCHtpSLkpou8ErubUljUvYW8zs1wMD37hABY16EMB3Y4Ztos95nql6_NleEeZmK3RZ-pgeIj6w')",
              }}
            >
              {/* Glass Overlay on Map */}
              <div className="bg-white/95 backdrop-blur-xs rounded-lg p-3 max-w-sm shadow-md border border-[#e2e8f0] flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0f4c3a] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-body text-[11px] text-[#64748b] truncate">Lokasi Anda Terdeteksi</span>
                  <span className="font-headline text-[13px] font-bold text-[#003426] truncate">
                    Wilayah Sukamaju, Sektor Barat
                  </span>
                  <span className="font-data-tabular text-[11px] text-[#006398] font-semibold">
                    Terdekat: 1.2 km (Puskesmas Sukamaju)
                  </span>
                </div>
              </div>

              {/* Legend Pin Floating */}
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded text-[#131b2e] font-body text-[11px] font-semibold shadow-xs border border-[#e2e8f0] flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#003426]"></span> Tersedia
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#006398]"></span> Sibuk
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a]"></span> Penuh
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[#64748b] font-body text-[12px] pt-1">
              <span>Memetakan {filteredPoints.length} titik penerimaan aktif dalam simulasi</span>
              <a href="#daftar-titik" className="text-[#006398] hover:underline flex items-center gap-0.5 font-semibold">
                Lompat ke daftar detail <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
              </a>
            </div>
          </div>

          {/* Rapid Specimen Readiness Checklist Panel */}
          <div className="lg:col-span-4 bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] flex flex-col justify-between shadow-xs">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#003426]">
                <span className="material-symbols-outlined text-[20px]">fact_check</span>
                <h2 className="font-headline text-[16px] font-bold">Cek Kesiapan Sampel</h2>
              </div>
              <p className="font-body text-[12px] text-[#404944] leading-relaxed">
                Sebelum mendatangi dropbox, pastikan kepatuhan fisik wadah obat guna menjaga keselamatan petugas biohazard.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#003426] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-body text-[12px] font-bold text-[#131b2e]">Identitas Label Terbaca</span>
                    <span className="font-body text-[11px] text-[#64748b]">
                      Nama zat aktif atau merek sebaiknya masih dapat diidentifikasi tim teknis.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#003426] shrink-0 mt-0.5">check_circle</span>
                  <div className="flex flex-col">
                    <span className="font-body text-[12px] font-bold text-[#131b2e]">Wadah Cairan Anti-Bocor</span>
                    <span className="font-body text-[11px] text-[#64748b]">
                      Tutup botol sirup dikencangkan &amp; dilapisi kantong sekunder jika retak.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white border border-[#e2e8f0]">
                  <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] shrink-0 mt-0.5">cancel</span>
                  <div className="flex flex-col">
                    <span className="font-body text-[12px] font-bold text-[#ba1a1a]">Bukan Jarum Suntik Terbuka</span>
                    <span className="font-body text-[11px] text-[#64748b]">
                      Limbah benda tajam membutuhkan kotak disposal khusus (B3 Medis Rumah Sakit).
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => onNavigate('laporkan-obat')}
                className="w-full py-2.5 bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[13px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">qr_code_scanner</span>
                <span>Buat ID Tiket Serah Terima</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search Engine & Multi-parameter Filters */}
        <div className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs flex flex-col gap-4" id="daftar-titik">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-[#f1f5f9]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#006398]">tune</span>
              <span className="font-headline text-[16px] font-bold text-[#131b2e]">
                Filter &amp; Penelusuran Fasilitas
              </span>
            </div>
            <span className="font-data-tabular text-[12px] text-[#64748b]">
              Menampilkan {filteredPoints.length} dari {collectionPoints.length} Titik Terkualifikasi
            </span>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[18px] text-[#64748b]">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama fasilitas, kecamatan, kelurahan, atau jalan..."
                className="w-full h-10 pl-9 pr-3 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border border-[#cbd5e1] focus:bg-white focus:outline-none focus:border-[#003426] transition-all"
              />
            </div>

            {/* Filter 1: Sediaan */}
            <div className="md:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border border-[#cbd5e1] focus:bg-white focus:outline-none focus:border-[#003426] transition-all cursor-pointer"
              >
                <option value="all">Semua Kategori Obat</option>
                <option value="analgesic">Hanya Parasetamol &amp; Analgesik</option>
                <option value="nsaid">Menerima Diklofenak (NSAID)</option>
                <option value="solid">Hanya Sediaan Padat (Tablet/Kapsul)</option>
                <option value="liquid">Menerima Sirup / Cairan</option>
              </select>
            </div>

            {/* Filter 2: Status */}
            <div className="md:col-span-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border border-[#cbd5e1] focus:bg-white focus:outline-none focus:border-[#003426] transition-all cursor-pointer"
              >
                <option value="all">Semua Status Operasional</option>
                <option value="open">Buka Hari Ini</option>
                <option value="24h">Layanan 24 Jam</option>
                <option value="lock">Dilengkapi Kunci Segel</option>
                <option value="quota">Kapasitas Longgar (&gt;30%)</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[12px]">
            <span className="font-semibold text-[#64748b] mr-1">Filter Populer:</span>
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === 'lock' ? 'all' : 'lock')}
              className={`px-3 py-1 rounded-full font-body text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                statusFilter === 'lock'
                  ? 'bg-[#003426] text-white border-[#003426]'
                  : 'bg-[#f8fafc] text-[#404944] border-[#cbd5e1] hover:bg-[#f1f5f9]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">lock</span>
              <span>Penguncian Tertutup Otomatis</span>
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter(statusFilter === '24h' ? 'all' : '24h')}
              className={`px-3 py-1 rounded-full font-body text-[11px] font-semibold border transition-colors flex items-center gap-1 ${
                statusFilter === '24h'
                  ? 'bg-[#003426] text-white border-[#003426]'
                  : 'bg-[#f8fafc] text-[#404944] border-[#cbd5e1] hover:bg-[#f1f5f9]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">schedule</span>
              <span>Buka 24 Jam</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }}
              className="px-2.5 py-1 text-[11px] font-semibold text-[#006398] hover:underline ml-auto"
            >
              Reset Filter
            </button>
          </div>
        </div>

        {/* Bio-Drop Cards Grid */}
        {filteredPoints.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-[#e2e8f0] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px] text-[#94a3b8]">location_off</span>
            <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">
              Tidak Ada Titik Bio-Drop yang Cocok
            </h3>
            <p className="font-body text-[13px] text-[#64748b]">
              Coba kurangi kata kunci pencarian atau ubah pilihan filter Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {filteredPoints.map((pt) => (
              <div
                key={pt.id}
                className="bg-white rounded-xl p-5 border border-[#e2e8f0] shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  {/* Top Row: Badge, ID & Distance */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pt.badgeClass}`}>
                          {pt.badgeText}
                        </span>
                        <span className="font-data-tabular text-[11px] text-[#64748b]">{pt.code}</span>
                      </div>
                      <h2 className="font-headline text-[17px] font-bold text-[#003426] leading-snug">
                        {pt.name}
                      </h2>
                      <span className="font-body text-[12px] font-semibold text-[#006398]">{pt.subtitle}</span>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#f2f3ff] text-[#131b2e] font-data-tabular text-[12px] font-bold border border-[#cbd5e1]">
                        <span className="material-symbols-outlined text-[14px] text-[#003426]">navigation</span>
                        {pt.distanceKm} km
                      </span>
                      <span className="font-body text-[11px] text-[#64748b] mt-0.5">{pt.durationEst}</span>
                    </div>
                  </div>

                  {/* Address & Operational Schedule */}
                  <div className="grid grid-cols-1 gap-2 p-3 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#64748b] mt-0.5">location_on</span>
                      <span className="font-body text-[12px] text-[#131b2e]">{pt.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#64748b] mt-0.5">schedule</span>
                      <div className="flex flex-col">
                        <span className="font-body text-[12px] text-[#131b2e] font-semibold">{pt.schedule}</span>
                        <span className="font-body text-[11px] text-[#64748b]">{pt.scheduleNote}</span>
                      </div>
                    </div>
                  </div>

                  {/* Accepted Drugs */}
                  <div className="flex flex-col gap-1.5">
                    <span className="font-body text-[11px] font-bold text-[#64748b] uppercase tracking-wider">
                      Sediaan Obat Diterima:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {pt.acceptedDrugs.map((drug) => (
                        <span
                          key={drug}
                          className="px-2 py-0.5 rounded bg-[#f1f5f9] font-body text-[11px] text-[#131b2e] border border-[#e2e8f0]"
                        >
                          {drug}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center justify-between text-[11px] font-body">
                      <span className="flex items-center gap-1 font-semibold text-[#131b2e]">
                        <span className="w-2 h-2 rounded-full bg-[#003426]"></span>
                        {pt.capacityStatusText}
                      </span>
                      <span className="font-data-tabular font-bold text-[#003426]">{pt.capacityQuotaText}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          pt.capacityPercentage > 80 ? 'bg-[#ba1a1a]' : 'bg-[#003426]'
                        }`}
                        style={{ width: `${pt.capacityPercentage}%` }}
                      ></div>
                    </div>
                    <span className="font-body text-[11px] text-[#64748b]">{pt.capacityWeightText}</span>
                  </div>

                  {/* Facility Highlights */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#64748b]">
                    {pt.highlights.map((hl) => (
                      <span key={hl} className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-[#003426]">check</span>
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#f1f5f9]">
                  <button
                    type="button"
                    onClick={() => handleSelectLocation(pt)}
                    className="flex-1 py-2 bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[12px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_box</span>
                    <span>Pilih Lokasi Ini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsProsedurModalOpen(true)}
                    className="px-3.5 py-2 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#131b2e] border border-[#cbd5e1] font-body text-[12px] font-semibold rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Prosedur</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Partnership / Verification Callout Bar */}
        <div className="bg-[#f8fafc] rounded-xl p-5 border border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#eaedff] flex items-center justify-center text-[#002575] shrink-0">
              <span className="material-symbols-outlined text-[22px]">science</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[15px] font-bold text-[#003426]">
                Ingin Mendaftarkan Fasilitas Kesehatan Anda sebagai Mitra Bio-Drop?
              </span>
              <span className="font-body text-[12px] text-[#64748b]">
                Puskesmas, klinik pratama, dan apotek berizin dapat bergabung dalam jejaring perancangan pilot project farmakovigilans lingkungan.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPartnerModalOpen(true)}
              className="px-3.5 py-2 bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#131b2e] font-body text-[12px] font-semibold rounded transition-colors shadow-xs"
            >
              Unduh Kriteria Teknis
            </button>
            <button
              type="button"
              onClick={() => setPartnerModalOpen(true)}
              className="px-3.5 py-2 bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[12px] font-semibold rounded transition-colors shadow-xs"
            >
              Registrasi Mitra Fasilitas
            </button>
          </div>
        </div>
      </div>

      {/* Prosedur Modal */}
      <ProsedurModal
        isOpen={isProsedurModalOpen}
        onClose={() => setIsProsedurModalOpen(false)}
        onNavigateToReport={() => onNavigate('laporkan-obat')}
      />

      {/* Partner Criteria Modal */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-[#cbd5e1] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-3">
              <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">
                Kemitraan Fasilitas Bio-Drop (Simulasi)
              </h3>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#64748b]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="font-body text-[13px] text-[#475569] leading-relaxed">
              PillsSafe saat ini merupakan <strong>prototype perancangan konsep</strong>. Pendaftaran mitra fasilitas kesehatan fisik (Puskesmas, Apotek, dan Klinik) belum dibuka secara komersial dan masih dalam tahap peninjauan protokol teknis.
            </p>
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[12px] text-[#131b2e] flex flex-col gap-1">
              <strong>Kriteria Minimal Percontohan:</strong>
              <ul className="list-disc pl-4 text-[#475569] space-y-0.5">
                <li>Memiliki izin operasional faskes/apotek aktif dari Kemenkes.</li>
                <li>Tersedia ruang beratap untuk penempatan dropbox bio-secure.</li>
                <li>Petugas farmasi terlatih untuk serah terima B3 medis.</li>
                <li>Tersedia fasilitas rantai dingin (cold-chain 4°C) sementara.</li>
              </ul>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="px-4 py-2 bg-[#003426] text-white rounded font-body text-[12px] font-semibold hover:bg-[#0f4c3a]"
              >
                Saya Memahami
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
