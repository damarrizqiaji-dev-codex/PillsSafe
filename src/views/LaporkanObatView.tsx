import React, { useState, useEffect } from 'react';
import type { PageView, ReportFormData } from '../types.ts';
import { validateReportForm, generateBatchCode, getSuitabilityEstimate } from '../utils/batchLogic.ts';

interface LaporkanObatViewProps {
  onNavigate: (view: PageView) => void;
  onSubmitReport: (form: ReportFormData, code: string) => void;
  initialSelectedCollectionPoint?: string;
  onSelectBatchToTrack: (batchId: string) => void;
}

export const LaporkanObatView: React.FC<LaporkanObatViewProps> = ({
  onNavigate,
  onSubmitReport,
  initialSelectedCollectionPoint,
  onSelectBatchToTrack,
}) => {
  const [formData, setFormData] = useState<ReportFormData>({
    drugName: '',
    ingredient: 'Parasetamol',
    dosage: 'Tablet',
    expiryDate: '',
    expiryUnknown: false,
    amount: 2,
    unit: 'Tablet / Kapsul',
    packaging: 'Utuh dalam blister / strip asli',
    wasteSource: 'Rumah Tangga Mandiri',
    collectionPoint: initialSelectedCollectionPoint || 'Bio-Drop Puskesmas Sukamaju (Radius 1.2 km)',
    additionalNotes: '',
    userConsent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState<string | null>(null);

  // Sync if initial location changed from external click
  useEffect(() => {
    if (initialSelectedCollectionPoint) {
      setFormData((prev) => ({
        ...prev,
        collectionPoint: initialSelectedCollectionPoint,
      }));
    }
  }, [initialSelectedCollectionPoint]);

  const suitability = getSuitabilityEstimate(formData.ingredient);

  const handleInputChange = (field: keyof ReportFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleExpiryUnknownToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      expiryUnknown: checked,
      expiryDate: checked ? '' : prev.expiryDate,
    }));
    if (errors.expiryDate) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.expiryDate;
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateReportForm(formData);

    if (!result.isValid) {
      setErrors(result.errors);
      // Scroll to the first error
      const firstErrorKey = Object.keys(result.errors)[0];
      const el = document.getElementById(firstErrorKey);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
      return;
    }

    setIsSubmitting(true);
    // Simulate brief generation step
    setTimeout(() => {
      const code = generateBatchCode(formData.ingredient);
      setGeneratedBatch(code);
      onSubmitReport(formData, code);
      setIsSubmitting(false);
    }, 600);
  };

  const handleResetForm = () => {
    setFormData({
      drugName: '',
      ingredient: 'Parasetamol',
      dosage: 'Tablet',
      expiryDate: '',
      expiryUnknown: false,
      amount: 2,
      unit: 'Tablet / Kapsul',
      packaging: 'Utuh dalam blister / strip asli',
      wasteSource: 'Rumah Tangga Mandiri',
      collectionPoint: 'Bio-Drop Puskesmas Sukamaju (Radius 1.2 km)',
      additionalNotes: '',
      userConsent: false,
    });
    setErrors({});
    setGeneratedBatch(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[#404944] font-body text-[12px]">
        <button
          onClick={() => onNavigate('beranda')}
          className="hover:text-[#003426] transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">home</span>
          Beranda
        </button>
        <span className="text-[#bfc9c3]">/</span>
        <span className="text-[#131b2e] font-semibold">Laporkan Obat Kedaluwarsa</span>
      </nav>

      {/* Header Section */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-body text-[11px] font-semibold mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006398]"></span>
          FORMULIR INTAKE PELAPOR PUBLIK • v2.4 (SIMULASI)
        </div>
        <h1 className="font-headline text-[26px] md:text-[32px] text-[#003426] font-bold tracking-tight">
          Registrasi &amp; Pelaporan Obat Kedaluwarsa
        </h1>
        <p className="font-body text-[14px] text-[#404944] mt-1 max-w-3xl leading-relaxed">
          Laporkan obat kedaluwarsa untuk mendapatkan kode batch pelacakan dan arahan penyerahan ke titik pengumpulan berlisensi lingkungan.
        </p>
      </div>

      {/* Mandatory Eco-Warning Callout */}
      <div className="rounded-xl bg-[#f2f3ff] p-4 border border-[#e2e8f0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded bg-[#ffdad6] text-[#93000a] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[20px]">warning</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-headline text-[14px] font-bold text-[#131b2e]">
                Pemberitahuan Protokol Lingkungan
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] text-white font-body text-[10px] uppercase font-bold tracking-wider">
                Krusial
              </span>
            </div>
            <p className="font-body text-[12px] text-[#404944] mt-1 leading-relaxed">
              Laporan Anda akan dicatat sebagai calon batch. Obat belum tentu langsung masuk jalur biodegradasi sebelum lolos skrining awal oleh petugas.{' '}
              <strong className="text-[#ba1a1a] font-semibold">
                Obat kedaluwarsa dilarang keras dibuang ke saluran air atau tempat sampah domestik biasa
              </strong>{' '}
              guna mencegah resistensi mikroba &amp; kontaminasi akifer air tanah.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 font-data-tabular text-[12px] px-3 py-1.5 rounded bg-white border border-[#cbd5e1] text-[#131b2e]">
          <span className="material-symbols-outlined text-[16px] text-[#003426]">eco</span>
          <span>Eco-Risk Control</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Fields (8 Cols) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <form id="medicineReportForm" onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Bagian 1: Identifikasi Obat */}
            <div className="rounded-xl bg-white p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded bg-[#003426] text-white flex items-center justify-center font-headline text-[14px] font-bold">
                    1
                  </span>
                  <div>
                    <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                      Identifikasi Obat &amp; Komposisi
                    </h2>
                    <p className="font-body text-[12px] text-[#64748b]">
                      Tentukan zat aktif untuk klasifikasi penanganan limbah farmasi.
                    </p>
                  </div>
                </div>
                <span className="font-body text-[11px] font-semibold text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-0.5 rounded">
                  * Wajib Diisi
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {/* Nama Obat */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-1" htmlFor="drugName">
                    Nama Obat / Merk Dagang <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="drugName"
                      type="text"
                      value={formData.drugName}
                      onChange={(e) => handleInputChange('drugName', e.target.value)}
                      placeholder="Contoh: Panadol 500mg, Voltaren 50mg, Bodrex, Amoxicillin 500mg"
                      className={`w-full h-10 px-3 pl-10 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border transition-all focus:bg-white focus:outline-none ${
                        errors.drugName ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#cbd5e1] focus:border-[#003426]'
                      }`}
                    />
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[18px]">
                      medication
                    </span>
                  </div>
                  {errors.drugName && (
                    <span className="text-[#ba1a1a] text-[11px] font-semibold mt-1 block flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">error</span>
                      {errors.drugName}
                    </span>
                  )}
                  <span className="font-body text-[11px] text-[#64748b] mt-1 block">
                    Tuliskan nama persis seperti tertera pada kemasan strip, botol, atau blister.
                  </span>
                </div>

                {/* Kategori Bahan Aktif */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-2">
                    Kategori Bahan Aktif (Karakterisasi Ilmiah) <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" id="ingredient">
                    {/* Parasetamol */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.ingredient === 'Parasetamol'
                          ? 'bg-[#ecfdf5] border-[#003426]'
                          : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ingredient"
                        value="Parasetamol"
                        checked={formData.ingredient === 'Parasetamol'}
                        onChange={() => handleInputChange('ingredient', 'Parasetamol')}
                        className="mt-1 accent-[#003426] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-body text-[13px] font-semibold text-[#131b2e]">Parasetamol</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#b4efd6] text-[#002117] font-body text-[10px] font-bold">
                            Kandidat Kajian Biodegradasi
                          </span>
                        </div>
                        <span className="font-body text-[11px] text-[#64748b] leading-tight mt-0.5">
                          Analgesik &amp; Antipiretik — sedang dikaji dalam model biotransformasi mikrobiologis
                        </span>
                      </div>
                    </label>

                    {/* Diklofenak */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.ingredient === 'Diklofenak'
                          ? 'bg-[#f0f9ff] border-[#006398]'
                          : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ingredient"
                        value="Diklofenak"
                        checked={formData.ingredient === 'Diklofenak'}
                        onChange={() => handleInputChange('ingredient', 'Diklofenak')}
                        className="mt-1 accent-[#006398] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-body text-[13px] font-semibold text-[#131b2e]">Diklofenak (NSAID)</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#cce5ff] text-[#001d31] font-body text-[10px] font-bold">
                            Kandidat Terpantau
                          </span>
                        </div>
                        <span className="font-body text-[11px] text-[#64748b] leading-tight mt-0.5">
                          Antiinflamasi nonsteroid — memerlukan penilaian produk transformasi khusus
                        </span>
                      </div>
                    </label>

                    {/* Obat Lainnya */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.ingredient === 'Obat Lainnya'
                          ? 'bg-[#f8fafc] border-[#131b2e]'
                          : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ingredient"
                        value="Obat Lainnya"
                        checked={formData.ingredient === 'Obat Lainnya'}
                        onChange={() => handleInputChange('ingredient', 'Obat Lainnya')}
                        className="mt-1 accent-[#131b2e] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-body text-[13px] font-semibold text-[#131b2e]">Bahan Aktif Lain</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#e2e8f0] text-[#131b2e] font-body text-[10px] font-bold">
                            Penilaian Lanjutan
                          </span>
                        </div>
                        <span className="font-body text-[11px] text-[#64748b] leading-tight mt-0.5">
                          Antibiotik / Hormon / Belum memiliki model biodegradasi awal terverifikasi
                        </span>
                      </div>
                    </label>

                    {/* Belum Diketahui */}
                    <label
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.ingredient === 'Belum Diketahui / Tidak Tertera'
                          ? 'bg-[#f8fafc] border-[#ba1a1a]'
                          : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ingredient"
                        value="Belum Diketahui / Tidak Tertera"
                        checked={formData.ingredient === 'Belum Diketahui / Tidak Tertera'}
                        onChange={() => handleInputChange('ingredient', 'Belum Diketahui / Tidak Tertera')}
                        className="mt-1 accent-[#ba1a1a] w-4 h-4"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                          <span className="font-body text-[13px] font-semibold text-[#131b2e]">Bahan Aktif Tidak Diketahui</span>
                          <span className="px-1.5 py-0.2 rounded bg-[#ffdad6] text-[#93000a] font-body text-[10px] font-bold">
                            Perlu Verifikasi
                          </span>
                        </div>
                        <span className="font-body text-[11px] text-[#64748b] leading-tight mt-0.5">
                          Memerlukan verifikasi spektroskopi petugas saat diterima di titik kumpul
                        </span>
                      </div>
                    </label>
                  </div>
                  {errors.ingredient && (
                    <span className="text-[#ba1a1a] text-[11px] font-semibold mt-1 block">
                      {errors.ingredient}
                    </span>
                  )}
                </div>

                {/* Bentuk Sediaan Fisik */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-2">
                    Bentuk Sediaan Fisik <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2" id="dosage">
                    {['Tablet', 'Kapsul', 'Sirup / Cairan', 'Salep / Krim', 'Lainnya'].map((dos) => (
                      <button
                        key={dos}
                        type="button"
                        onClick={() => handleInputChange('dosage', dos)}
                        className={`px-3 py-1.5 rounded font-body text-[12px] font-semibold flex items-center gap-1.5 transition-all border ${
                          formData.dosage === dos
                            ? 'bg-[#003426] text-white border-[#003426] shadow-xs'
                            : 'bg-[#f8fafc] text-[#404944] border-[#cbd5e1] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {dos === 'Tablet'
                            ? 'pill'
                            : dos === 'Kapsul'
                            ? 'hevc'
                            : dos === 'Sirup / Cairan'
                            ? 'fluid_med'
                            : dos === 'Salep / Krim'
                            ? 'clean_hands'
                            : 'category'}
                        </span>
                        {dos}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tanggal Kedaluwarsa & Jumlah Fisik */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Tanggal Kedaluwarsa */}
                  <div>
                    <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-1" htmlFor="expiryDate">
                      Tanggal Kedaluwarsa (EXP) <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="expiryDate"
                        type="date"
                        disabled={formData.expiryUnknown}
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className={`w-full h-10 px-3 pl-10 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border transition-all ${
                          formData.expiryUnknown
                            ? 'opacity-50 cursor-not-allowed bg-[#f1f5f9]'
                            : 'focus:bg-white focus:outline-none'
                        } ${
                          errors.expiryDate ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#cbd5e1] focus:border-[#003426]'
                        }`}
                      />
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[18px]">
                        calendar_today
                      </span>
                    </div>
                    {errors.expiryDate && (
                      <span className="text-[#ba1a1a] text-[11px] font-semibold mt-1 block flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">error</span>
                        {errors.expiryDate}
                      </span>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        id="expiryUnknown"
                        type="checkbox"
                        checked={formData.expiryUnknown}
                        onChange={(e) => handleExpiryUnknownToggle(e.target.checked)}
                        className="w-4 h-4 accent-[#003426] rounded cursor-pointer"
                      />
                      <label htmlFor="expiryUnknown" className="font-body text-[11px] font-semibold text-[#404944] cursor-pointer">
                        Tanggal tidak terbaca / kemasan robek
                      </label>
                    </div>
                  </div>

                  {/* Perkiraan Jumlah */}
                  <div>
                    <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-1" htmlFor="amount">
                      Perkiraan Kuantitas &amp; Satuan <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="amount"
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount', parseInt(e.target.value) || 0)}
                        className={`w-24 h-10 px-3 text-center rounded bg-[#f8fafc] text-[#131b2e] font-data-tabular text-[13px] border transition-all focus:bg-white focus:outline-none ${
                          errors.amount ? 'border-[#ba1a1a] ring-1 ring-[#ba1a1a]' : 'border-[#cbd5e1] focus:border-[#003426]'
                        }`}
                      />
                      <select
                        value={formData.unit}
                        onChange={(e) => handleInputChange('unit', e.target.value)}
                        className="flex-1 h-10 px-3 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border border-[#cbd5e1] focus:bg-white focus:outline-none focus:border-[#003426] transition-all cursor-pointer"
                      >
                        <option value="Tablet / Kapsul">Butir / Tablet</option>
                        <option value="Strip">Strip (Blister)</option>
                        <option value="Botol">Botol Kemasan</option>
                        <option value="Tube">Tube Salep</option>
                        <option value="Sachet">Sachet</option>
                        <option value="Ampul / Vial">Ampul / Vial</option>
                      </select>
                    </div>
                    {errors.amount && (
                      <span className="text-[#ba1a1a] text-[11px] font-semibold mt-1 block">
                        {errors.amount}
                      </span>
                    )}
                    <span className="font-body text-[11px] text-[#64748b] mt-1 block">
                      Contoh: 2 strip atau 20 butir tablet.
                    </span>
                  </div>
                </div>

                {/* Kondisi Kemasan */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-1">
                    Kondisi Kemasan Fisik <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Utuh dalam blister / strip asli',
                      'Kemasan terbuka / robek / lembap',
                      'Botol cairan masih tersegel rapat',
                      'Butiran lepas tanpa kemasan awal',
                    ].map((pack) => (
                      <label
                        key={pack}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          formData.packaging === pack
                            ? 'bg-[#ecfdf5] border-[#003426]'
                            : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="packaging"
                          value={pack}
                          checked={formData.packaging === pack}
                          onChange={() => handleInputChange('packaging', pack)}
                          className="accent-[#003426] w-4 h-4"
                        />
                        <span className="font-body text-[12px] text-[#131b2e]">{pack}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 2: Sumber & Penyerahan */}
            <div className="rounded-xl bg-white p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#f1f5f9]">
                <span className="w-7 h-7 rounded bg-[#003426] text-white flex items-center justify-center font-headline text-[14px] font-bold">
                  2
                </span>
                <div>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Sumber &amp; Rencana Penyerahan
                  </h2>
                  <p className="font-body text-[12px] text-[#64748b]">
                    Pilih titik serah terima aman terdekat dari domisili Anda.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {/* Sumber Asal */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-2">
                    Sumber Asal Limbah
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Rumah Tangga Mandiri', 'Fasilitas Pengumpulan Komunitas / RT-RW'].map((src) => (
                      <label key={src} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="wasteSource"
                          value={src}
                          checked={formData.wasteSource === src}
                          onChange={() => handleInputChange('wasteSource', src)}
                          className="accent-[#003426] w-4 h-4"
                        />
                        <span className="font-body text-[13px] text-[#131b2e]">{src}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Dropdown Titik Pengumpulan */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-body text-[13px] font-semibold text-[#131b2e]" htmlFor="collectionPoint">
                      Titik Pengumpulan / Dropbox Terdaftar <span className="text-[#ba1a1a]">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => onNavigate('titik-pengumpulan')}
                      className="text-[11px] font-semibold text-[#006398] hover:underline flex items-center gap-0.5"
                    >
                      <span>Lihat peta direktori</span>
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      id="collectionPoint"
                      value={formData.collectionPoint}
                      onChange={(e) => handleInputChange('collectionPoint', e.target.value)}
                      className={`w-full h-10 px-3 pl-10 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border transition-all focus:bg-white focus:outline-none ${
                        errors.collectionPoint ? 'border-[#ba1a1a]' : 'border-[#cbd5e1] focus:border-[#003426]'
                      }`}
                    >
                      <option value="Bio-Drop Puskesmas Sukamaju (Radius 1.2 km)">
                        Bio-Drop Puskesmas Sukamaju (Radius 1.2 km) - Jl. Sejahtera No. 12 (Lokasi Contoh)
                      </option>
                      <option value="Bio-Drop Farmasi RSUD Peduli Sehat (Radius 3.5 km)">
                        Bio-Drop Farmasi RSUD Peduli Sehat (Radius 3.5 km) - Loket Farmasi 24 Jam (Lokasi Contoh)
                      </option>
                      <option value="Bio-Drop Kimia Farma Mitra Lestari (Radius 4.1 km)">
                        Bio-Drop Kimia Farma Mitra Lestari (Radius 4.1 km) - Jl. Sudirman No. 88 (Lokasi Contoh)
                      </option>
                      <option value="Bio-Drop Depo Komunitas Hijau (Radius 5.8 km)">
                        Bio-Drop Depo Komunitas Hijau (Radius 5.8 km) - Pos Binaan RW 05 (Lokasi Contoh)
                      </option>
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#64748b] text-[18px]">
                      pin_drop
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[#64748b] font-body text-[11px]">
                    <span className="material-symbols-outlined text-[15px] text-[#006398]">schedule</span>
                    <span>Jam operasional dropbox tertera di direktori. Dilengkapi kunci segel keamanan.</span>
                  </div>
                </div>

                {/* Catatan Tambahan */}
                <div>
                  <label className="block font-body text-[13px] font-semibold text-[#131b2e] mb-1" htmlFor="additionalNotes">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    id="additionalNotes"
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                    placeholder="Misal: Disimpan di kotak kering suhu ruang, sisa resep batuk pilek keluarga..."
                    className="w-full p-3 rounded bg-[#f8fafc] text-[#131b2e] font-body text-[13px] border border-[#cbd5e1] focus:bg-white focus:outline-none focus:border-[#003426] transition-all"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Bagian 3: Pernyataan & Persetujuan */}
            <div className="rounded-xl bg-white p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
              <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-[#f1f5f9]">
                <span className="w-7 h-7 rounded bg-[#003426] text-white flex items-center justify-center font-headline text-[14px] font-bold">
                  3
                </span>
                <div>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Pernyataan &amp; Deklarasi Tanggung Jawab
                  </h2>
                  <p className="font-body text-[12px] text-[#64748b]">
                    Prinsip pelaporan sukarela tanpa pelacakan data pribadi berlebih.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="userConsent"
                    type="checkbox"
                    checked={formData.userConsent}
                    onChange={(e) => handleInputChange('userConsent', e.target.checked)}
                    className="mt-1 w-5 h-5 accent-[#003426] rounded shrink-0 cursor-pointer"
                  />
                  <span className="font-body text-[13px] text-[#131b2e] leading-relaxed">
                    Saya mengonfirmasi bahwa data obat kedaluwarsa dilaporkan dengan sebenarnya, tidak dicampur dengan limbah B3 bahan kimia keras non-obat, dan memahami sepenuhnya bahwa{' '}
                    <strong className="text-[#003426] font-semibold">
                      penanganan akhir serta kelolosan pengolahan bergantung pada skrining fisik petugas titik pengumpulan
                    </strong>
                    .
                  </span>
                </label>
              </div>
              {errors.userConsent && (
                <span className="text-[#ba1a1a] text-[11px] font-semibold mt-2 block flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.userConsent}
                </span>
              )}

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#f1f5f9]">
                <div className="flex items-center gap-2 text-[#64748b] font-body text-[11px]">
                  <span className="material-symbols-outlined text-[16px] text-[#003426]">lock</span>
                  <span>Protokol Perlindungan Privasi: Nol penyimpanan identitas pribadi KTP/NIK.</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded bg-[#003426] text-white font-body text-[13px] font-semibold hover:bg-[#0f4c3a] transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Menerbitkan Batch Simulasi...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Laporan &amp; Buat Batch</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Visual Instructions */}
          <div className="rounded-xl bg-white p-5 md:p-6 border border-[#e2e8f0] shadow-xs">
            <h3 className="font-headline text-[15px] font-bold text-[#131b2e] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#006398]">inventory_2</span>
              Pedoman Standar Pengemasan Mandiri Sebelum Penyerahan
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <span className="font-data-tabular text-[11px] font-bold text-[#006398]">LANGKAH 01</span>
                  <h4 className="font-headline text-[14px] font-bold text-[#131b2e] mt-1">Jangan Lepas Kemasan</h4>
                  <p className="font-body text-[12px] text-[#64748b] mt-1 leading-relaxed">
                    Biarkan tablet atau kapsul tetap pada strip aslinya agar barcode &amp; batch pabrikan terbaca.
                  </p>
                </div>
                <div className="mt-3 text-[#006398] flex items-center gap-1 font-body text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> Integritas Identitas
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <span className="font-data-tabular text-[11px] font-bold text-[#006398]">LANGKAH 02</span>
                  <h4 className="font-headline text-[14px] font-bold text-[#131b2e] mt-1">Wadah Sekunder Kering</h4>
                  <p className="font-body text-[12px] text-[#64748b] mt-1 leading-relaxed">
                    Masukkan ke dalam kantong kertas ramah lingkungan atau amplop bertuliskan nomor batch.
                  </p>
                </div>
                <div className="mt-3 text-[#006398] flex items-center gap-1 font-body text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> Anti-Rembes Cairan
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col justify-between">
                <div>
                  <span className="font-data-tabular text-[11px] font-bold text-[#006398]">LANGKAH 03</span>
                  <h4 className="font-headline text-[14px] font-bold text-[#131b2e] mt-1">Serahkan ke Petugas / Box</h4>
                  <p className="font-body text-[12px] text-[#64748b] mt-1 leading-relaxed">
                    Tunjukkan kode batch unik kepada petugas pos serah terima atau pindai kode di unit dropbox.
                  </p>
                </div>
                <div className="mt-3 text-[#006398] flex items-center gap-1 font-body text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> Pelacakan Aktif
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Live Summary & Audit Panel */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Live Summary Card */}
          <div className="rounded-xl bg-white p-5 border border-[#e2e8f0] shadow-xs">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#f1f5f9]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006398]"></span>
                <h3 className="font-headline text-[15px] font-bold text-[#131b2e]">Pratinjau Calon Batch</h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#006398] font-data-tabular text-[11px]">
                Real-time Sync
              </span>
            </div>

            {/* Simulation Badge */}
            <div className="p-2.5 rounded-lg bg-[#f8fafc] text-[#64748b] mb-4 flex items-center gap-2 border border-[#e2e8f0]">
              <span className="material-symbols-outlined text-[16px] text-[#006398]">model_training</span>
              <div className="font-body text-[11px]">
                <strong className="text-[#131b2e]">DATA SIMULASI:</strong> Disimpan di memori sesi peramban lokal.
              </div>
            </div>

            {/* Dynamic Specs Shelf */}
            <div className="flex flex-col gap-2 text-[12px] font-body">
              <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-[#f8fafc]">
                <span className="text-[#64748b]">Status Rencana:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fffbeb] text-[#92400e] text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#d97706]"></span>
                  Menunggu Skrining
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5">
                <span className="text-[#64748b]">Nama Sampel:</span>
                <span className="font-semibold text-[#131b2e] max-w-[180px] truncate text-right">
                  {formData.drugName.trim() || 'Panadol 500mg'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 bg-[#f8fafc] rounded">
                <span className="text-[#64748b]">Kategori Zat Aktif:</span>
                <span className="font-semibold text-[#003426] text-right">{formData.ingredient}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5">
                <span className="text-[#64748b]">Bentuk Sediaan:</span>
                <span className="font-semibold text-[#131b2e] text-right">{formData.dosage}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5 bg-[#f8fafc] rounded">
                <span className="text-[#64748b]">Estimasi Kuantitas:</span>
                <span className="font-data-tabular font-bold text-[#131b2e] text-right">
                  {formData.amount} {formData.unit}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2.5">
                <span className="text-[#64748b]">Status Expired (EXP):</span>
                <span className="font-data-tabular text-[#131b2e] text-right">
                  {formData.expiryUnknown ? 'Tidak Terbaca / Unknown' : formData.expiryDate || 'Belum Diatur'}
                </span>
              </div>
              <div className="flex flex-col py-2 px-2.5 bg-[#f8fafc] rounded gap-1">
                <span className="text-[#64748b] text-[11px]">Titik Penyerahan Terpilih:</span>
                <span className="font-semibold text-[#131b2e] text-[12px] leading-tight">
                  {formData.collectionPoint.split('(')[0].trim()}
                </span>
              </div>
            </div>

            {/* Suitability Metric Gauge */}
            <div className="mt-4 p-3.5 rounded-lg bg-[#f2f3ff] border border-[#b6c4ff] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider">
                  Kesesuaian Biodegradasi Awal
                </span>
                <span className="font-headline text-[18px] text-[#003426] font-bold">
                  {suitability.score}%
                </span>
                <span className="font-body text-[10px] text-[#64748b] leading-tight max-w-[190px]">
                  {suitability.note}
                </span>
              </div>
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#cbd5e1] font-data-tabular text-[12px] font-bold text-[#003426]">
                {Math.round(suitability.score)}%
              </div>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="mt-4 w-full py-2.5 rounded bg-[#003426] text-white font-body text-[13px] font-semibold hover:bg-[#0f4c3a] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>Kirim Laporan &amp; Buat Batch</span>
            </button>
          </div>

          {/* Success Card */}
          {generatedBatch && (
            <div className="rounded-xl bg-white p-5 border-l-4 border-l-[#003426] border border-[#e2e8f0] shadow-md flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#003426] text-[24px]">verified</span>
                <span className="font-headline text-[15px] font-bold text-[#131b2e]">
                  Laporan Berhasil Dibuat!
                </span>
              </div>
              <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                Kode batch simulasi telah diterbitkan oleh sistem. Data ini tersimpan di memori lokal peramban Anda.
              </p>
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#64748b] tracking-wider block">
                  Nomor Registrasi Batch Anda
                </span>
                <span className="font-data-tabular text-[18px] font-bold text-[#003426] tracking-wider">
                  {generatedBatch}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-[12px] text-[#475569]">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#003426] shrink-0 mt-0.5">event</span>
                  <span>
                    <strong>Batas Penyerahan:</strong> 5 hari kerja (sebelum 25 Okt 2026)
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#003426] shrink-0 mt-0.5">qr_code_2</span>
                  <span>Tuliskan kode ini pada wadah sekunder atau tunjukkan saat serah terima.</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => onSelectBatchToTrack(generatedBatch)}
                  className="w-full py-2.5 rounded bg-[#006398] text-white font-body text-[13px] font-semibold hover:bg-[#00476e] transition-colors text-center flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">query_stats</span>
                  <span>Lacak Status Batch Ini Sekarang</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-1.5 rounded bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9] text-[12px] font-semibold text-center border border-[#e2e8f0]"
                >
                  Buat Laporan Obat Lain
                </button>
              </div>
            </div>
          )}

          {/* Help & FAQ Mini Box */}
          <div className="rounded-xl bg-[#f8fafc] p-4 border border-[#e2e8f0]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="material-symbols-outlined text-[#006398] text-[20px]">help_outline</span>
              <h4 className="font-body text-[13px] font-bold text-[#131b2e]">Butuh Bantuan Pelaporan?</h4>
            </div>
            <p className="font-body text-[12px] text-[#475569] leading-relaxed">
              Jika ragu apakah obat tergolong B3 medis kritis atau narkotika/psikotropika, hubungi pos farmasi terdekat. Obat psikotropika wajib dikembalikan ke apotek asal sesuai perundang-undangan khusus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
