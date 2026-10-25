import React, { useState } from 'react';
import type {
  BatchData,
  PageView,
  PhysicalIdentificationStatus,
  ReactorStatus,
  ResearchRouteId,
} from '../types.ts';
import {
  confirmPhysicalReceipt,
  assignResearchRoute,
  updateReactorStatus,
  registerEffluentSample,
} from '../utils/batchLogic.ts';

interface OperatorFasilitasViewProps {
  batches: Record<string, BatchData>;
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onNavigate: (view: PageView) => void;
  onUpdateBatch: (batch: BatchData) => void;
  activeTab?: 'penerimaan' | 'reaktor' | 'sampling';
  onTabChange?: (tab: 'penerimaan' | 'reaktor' | 'sampling') => void;
}

export const OperatorFasilitasView: React.FC<OperatorFasilitasViewProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onNavigate,
  onUpdateBatch,
  activeTab: controlledTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'penerimaan' | 'reaktor' | 'sampling'>('penerimaan');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: 'penerimaan' | 'reaktor' | 'sampling') => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [filterQueue, setFilterQueue] = useState<string>('all');

  const batchList = Object.values(batches);
  const activeBatch = batches[selectedBatchId] || batchList[0];

  // Forms
  const [receiptForm, setReceiptForm] = useState({
    confirmedDrug: activeBatch?.confirmedSubstance.includes('Belum')
      ? activeBatch?.reportedSubstance || ''
      : activeBatch?.confirmedSubstance || '',
    status: activeBatch?.identificationStatus || ('Diterima untuk Jalur Penanganan' as PhysicalIdentificationStatus),
    officerName: activeBatch?.confirmedByOfficer.includes('Belum')
      ? 'Apt. Suryani, S.Farm'
      : activeBatch?.confirmedByOfficer || 'Apt. Suryani, S.Farm',
    notes: activeBatch?.sortingNotes || '',
  });

  const [processForm, setProcessForm] = useState({
    route: (activeBatch?.researchRoute !== 'PATH-UNASSIGNED'
      ? activeBatch?.researchRoute
      : 'PATH-A-PARACETAMOL') as ResearchRouteId,
    reactorStatus: activeBatch?.reactorStatus || ('Proses Tercatat Berlangsung' as ReactorStatus),
    officerName: 'Ir. Agus Pratama (Pengelola Operasional)',
    processNotes: 'Parameter aerasi terjaga: DO > 4.0 mg/L, suhu 28-30°C, pH 7.0 ± 0.3.',
  });

  const [sampleForm, setSampleForm] = useState({
    sampleId: activeBatch?.sample.sampleId || `SMP-EF-${activeBatch?.code.replace('BATCH-', '') || '001'}`,
    samplerName: 'Budi Santoso, A.Md.AK (Petugas Sampling)',
    plannedTests: 'Senyawa Induk (HPLC), Produk Transformasi (LC-MS/MS), Toksisitas (Daphnia magna 48h)',
    coldChainTemp: '3.8°C (Rantai Dingin)',
  });

  // Sync forms when selected batch changes
  const handleSelectBatchItem = (batchId: string) => {
    onSelectBatch(batchId);
    const b = batches[batchId];
    if (b) {
      setReceiptForm({
        confirmedDrug: b.confirmedSubstance.includes('Belum') ? b.reportedSubstance : b.confirmedSubstance,
        status: b.identificationStatus,
        officerName: b.confirmedByOfficer.includes('Belum') ? 'Apt. Suryani, S.Farm' : b.confirmedByOfficer,
        notes: b.sortingNotes,
      });

      setProcessForm({
        route: b.researchRoute !== 'PATH-UNASSIGNED' ? b.researchRoute : 'PATH-A-PARACETAMOL',
        reactorStatus: b.reactorStatus,
        officerName: 'Ir. Agus Pratama (Pengelola Operasional)',
        processNotes: 'Parameter aerasi terjaga: DO > 4.0 mg/L, suhu 28-30°C, pH 7.0 ± 0.3.',
      });

      setSampleForm({
        sampleId: b.sample.sampleId || `SMP-EF-${b.code.replace('BATCH-', '')}`,
        samplerName: b.sample.samplerName.includes('Belum') ? 'Budi Santoso, A.Md.AK' : b.sample.samplerName,
        plannedTests: b.sample.plannedTests,
        coldChainTemp: '3.8°C (Rantai Dingin)',
      });
    }
  };

  // Submit Handlers
  const handleSaveReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = confirmPhysicalReceipt(
      activeBatch,
      receiptForm.confirmedDrug,
      receiptForm.status,
      receiptForm.officerName,
      receiptForm.notes
    );
    onUpdateBatch(updated);
    setSuccessMsg(`Pemeriksaan fisik dan pemilahan untuk ${activeBatch.code} berhasil diverifikasi!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSaveProcess = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = assignResearchRoute(activeBatch, processForm.route, processForm.officerName);
    updated = updateReactorStatus(updated, processForm.reactorStatus, processForm.officerName, processForm.processNotes);
    onUpdateBatch(updated);
    setSuccessMsg(`Alokasi jalur reaktor & status operasional untuk ${activeBatch.code} berhasil diperbarui!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleSaveSample = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = registerEffluentSample(
      activeBatch,
      sampleForm.sampleId.trim().toUpperCase(),
      sampleForm.samplerName,
      sampleForm.plannedTests
    );
    onUpdateBatch(updated);
    setSuccessMsg(`Sampel efluen ${sampleForm.sampleId} berhasil didaftarkan dan dikirim ke Lab Uji!`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Filter batches for queue
  const filteredBatches = batchList.filter((b) => {
    if (filterQueue === 'need-inspection') {
      return b.identificationStatus === 'Menunggu Pemeriksaan' || b.identificationStatus === 'Memerlukan Verifikasi Tambahan';
    }
    if (filterQueue === 'in-reactor') {
      return b.reactorStatus === 'Proses Tercatat Berlangsung';
    }
    if (filterQueue === 'ready-sampling') {
      return b.reactorStatus === 'Proses Tercatat Selesai' && b.sample.status !== 'Hasil Tersedia';
    }
    return true;
  });

  // Metric counts
  const needInspectionCount = batchList.filter((b) => b.identificationStatus === 'Menunggu Pemeriksaan').length;
  const inReactorCount = batchList.filter((b) => b.reactorStatus === 'Proses Tercatat Berlangsung').length;
  const inTankCount = batchList.filter((b) => b.holdingTankStatus === 'Menampung Efluen Pascaproses' || b.holdingTankStatus === 'Menunggu Verifikasi Laboratorium').length;

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner Notice */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#404944]">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#003426] text-white uppercase tracking-wider">
            Konsol Operasional
          </span>
          <span>MODUL OPERATOR FASILITAS &amp; PENGELOLA BIOREAKTOR</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#006398] font-semibold">
          <span className="material-symbols-outlined text-[15px]">sensors</span>
          <span>Pemantauan Reaktor Terpisah &amp; Tangki Pascaproses Aktif</span>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">
        {/* Header Console */}
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-1.5 text-[#003426] font-body text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">engineering</span>
                <span>Fasilitas Penerimaan &amp; Pengelolaan Reaktor Riset</span>
              </div>
              <h1 className="font-headline text-[24px] md:text-[30px] font-bold text-[#131b2e] tracking-tight">
                Konsol Petugas Fasilitas &amp; Proses
              </h1>
              <p className="font-body text-[14px] text-[#404944] leading-relaxed">
                Kendali terpadu untuk petugas penerimaan dan pengelola proses: inspeksi fisik sediaan, pemilahan status, alokasi Reaktor Riset A vs B terpisah, pemantauan tangki pascaproses, dan registrasi sampel efluen resmi.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#92400e] uppercase">Antre Skrining</span>
                <span className="font-headline text-[18px] font-bold text-[#92400e]">{needInspectionCount}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#cce5ff] border border-[#b6c4ff] flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#001d31] uppercase">Di Reaktor</span>
                <span className="font-headline text-[18px] font-bold text-[#006398]">{inReactorCount}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#b4efd6] border border-[#003426]/30 flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#002117] uppercase">Di Holding Tank</span>
                <span className="font-headline text-[18px] font-bold text-[#003426]">{inTankCount}</span>
              </div>
            </div>
          </div>

          {/* Success Message Banner */}
          {successMsg && (
            <div className="p-3 rounded-lg bg-[#b4efd6] border border-[#003426] text-[#002117] flex items-center gap-2 text-[12px] font-semibold">
              <span className="material-symbols-outlined text-[18px] text-[#003426]">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Workspace Layout: Left Queue & Right Action Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Batch Queue (4 Columns) */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-4 flex flex-col gap-3 sticky top-24">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <span className="font-headline text-[14px] font-bold text-[#131b2e]">
                Antrean Batch Fasilitas
              </span>
              <span className="text-[11px] font-bold text-[#006398]">
                {filteredBatches.length} Batch
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFilterQueue('all')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterQueue === 'all' ? 'bg-[#003426] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterQueue('need-inspection')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterQueue === 'need-inspection' ? 'bg-[#003426] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Butuh Skrining
              </button>
              <button
                type="button"
                onClick={() => setFilterQueue('in-reactor')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterQueue === 'in-reactor' ? 'bg-[#003426] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Di Reaktor
              </button>
              <button
                type="button"
                onClick={() => setFilterQueue('ready-sampling')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterQueue === 'ready-sampling' ? 'bg-[#003426] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Siap Sampling
              </button>
            </div>

            {/* Batch List Cards */}
            <div className="flex flex-col gap-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredBatches.map((b) => {
                const isSelected = b.code === activeBatch.code;
                return (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => handleSelectBatchItem(b.code)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#ecfdf5] border-[#003426] shadow-xs'
                        : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-data-tabular font-bold text-[12px] text-[#003426]">
                        {b.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.identificationStatus === 'Diterima untuk Jalur Penanganan'
                            ? 'bg-[#b4efd6] text-[#002117]'
                            : b.identificationStatus === 'Dikarantina atau Ditolak'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-[#fffbeb] text-[#92400e]'
                        }`}
                      >
                        {b.identificationStatus}
                      </span>
                    </div>

                    <span className="font-body text-[12px] font-semibold text-[#131b2e] line-clamp-1">
                      {b.reportedSubstance}
                    </span>

                    <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1 border-t border-[#e2e8f0]">
                      <span>{b.dosage}</span>
                      <span className="font-semibold text-[#006398]">{b.reactorStatus}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Operational Actions Panel (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Active Batch Summary Header */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f1f5f9]">
                <div>
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                    Batch Aktif Terpilih:
                  </span>
                  <h3 className="font-headline text-[18px] font-bold text-[#131b2e] font-data-tabular">
                    {activeBatch.code} — {activeBatch.reportedSubstance}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('lacak-laporan')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#f2f3ff] text-[#006398] text-[11px] font-semibold hover:bg-[#eaedff] transition-colors"
                  >
                    <span>Buka Timeline Lengkap</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Titik Kumpul:</span>
                  <strong className="text-[#131b2e] truncate block">{activeBatch.location}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Bentuk Sediaan:</span>
                  <strong className="text-[#131b2e] truncate block">{activeBatch.dosage}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Kondisi Kemasan:</span>
                  <strong className="text-[#131b2e] truncate block">{activeBatch.packagingCondition}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Jalur Riset:</span>
                  <strong className="text-[#006398] truncate block">{activeBatch.researchRoute}</strong>
                </div>
              </div>
            </div>

            {/* Task Tabs: 1. Penerimaan & Pemilahan | 2. Alokasi Reaktor & Tangki | 3. Registrasi Sampling */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] overflow-hidden flex flex-col">
              {/* Tab Navigation */}
              <div className="flex border-b border-[#e2e8f0] bg-[#f8fafc]">
                <button
                  type="button"
                  onClick={() => setActiveTab('penerimaan')}
                  className={`flex-1 py-3 px-4 text-[13px] font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'penerimaan'
                      ? 'border-[#003426] text-[#003426] bg-white'
                      : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  <span>1. Inspeksi Fisik &amp; Pemilahan</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reaktor')}
                  className={`flex-1 py-3 px-4 text-[13px] font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'reaktor'
                      ? 'border-[#003426] text-[#003426] bg-white'
                      : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                  <span>2. Bioreaktor &amp; Tangki</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('sampling')}
                  className={`flex-1 py-3 px-4 text-[13px] font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                    activeTab === 'sampling'
                      ? 'border-[#003426] text-[#003426] bg-white'
                      : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">colorize</span>
                  <span>3. Registrasi Sampling Efluen</span>
                </button>
              </div>

              {/* Tab 1: Penerimaan & Pemilahan Fisik */}
              {activeTab === 'penerimaan' && (
                <form onSubmit={handleSaveReceipt} className="p-5 md:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
                    <span className="text-[12px] font-bold text-[#003426] uppercase">
                      Protokol Skrining Penerimaan &amp; Integritas Fisik (Tahap 2)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        Bahan Aktif Dikonfirmasi Fisik <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={receiptForm.confirmedDrug}
                        onChange={(e) => setReceiptForm({ ...receiptForm, confirmedDrug: e.target.value })}
                        placeholder="Contoh: Parasetamol 500mg, Diklofenak Natrium 50mg"
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] focus:outline-none focus:border-[#003426]"
                        required
                      />
                      <span className="text-[10px] text-[#64748b]">
                        Identifikasi kimia dikonfirmasi langsung oleh petugas farmasi loket.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        Status Pemilahan Resmi <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <select
                        value={receiptForm.status}
                        onChange={(e) =>
                          setReceiptForm({ ...receiptForm, status: e.target.value as PhysicalIdentificationStatus })
                        }
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] bg-white focus:outline-none focus:border-[#003426]"
                      >
                        <option value="Diterima untuk Jalur Penanganan">Diterima untuk Jalur Penanganan</option>
                        <option value="Memerlukan Verifikasi Tambahan">Memerlukan Verifikasi Tambahan</option>
                        <option value="Dikarantina atau Ditolak">Dikarantina atau Ditolak (Limbah B3 Medis)</option>
                        <option value="Menunggu Pemeriksaan">Menunggu Pemeriksaan</option>
                      </select>
                      <span className="text-[10px] text-[#64748b]">
                        Obat campuran atau sediaan rusak tidak boleh dialokasikan ke reaktor biologis standar.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#131b2e]">
                      Catatan Hasil Pemeriksaan &amp; Pemilahan
                    </label>
                    <textarea
                      rows={3}
                      value={receiptForm.notes}
                      onChange={(e) => setReceiptForm({ ...receiptForm, notes: e.target.value })}
                      placeholder="Catat kondisi kemasan sekunder, integritas blister/botol, homogenitas sediaan..."
                      className="border border-[#cbd5e1] rounded p-2.5 text-[13px] focus:outline-none focus:border-[#003426]"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-[#e2e8f0]">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <label className="text-[11px] font-bold text-[#64748b] whitespace-nowrap">Nama Petugas:</label>
                      <input
                        type="text"
                        value={receiptForm.officerName}
                        onChange={(e) => setReceiptForm({ ...receiptForm, officerName: e.target.value })}
                        className="border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[13px] font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Simpan Konfirmasi Penerimaan Fisik</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 2: Bioreaktor & Tangki Pascaproses */}
              {activeTab === 'reaktor' && (
                <form onSubmit={handleSaveProcess} className="p-5 md:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
                    <span className="text-[12px] font-bold text-[#006398] uppercase">
                      Alokasi Jalur Riset Terpisah &amp; Kontrol Bioreaktor (Tahap 4 &amp; 5)
                    </span>
                  </div>

                  {/* Warning: Strict Separation */}
                  <div className="p-3 rounded-lg bg-[#f2f3ff] border border-[#cbd5e1] text-[12px] text-[#002575] flex items-start gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#006398] shrink-0 mt-0.5">info</span>
                    <div>
                      <strong>Ketentuan Pemisahan Jalur Fisik:</strong> Reaktor Riset A (Parasetamol) terhubung secara eksklusif ke <em>Holding Tank A</em>. Reaktor Riset B (Diklofenak) terhubung ke <em>Holding Tank B</em>. Keluaran kedua reaktor tidak boleh dicampur.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        Penetapan Jalur Riset Terpisah <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <select
                        value={processForm.route}
                        onChange={(e) => setProcessForm({ ...processForm, route: e.target.value as ResearchRouteId })}
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] bg-white focus:outline-none"
                      >
                        <option value="PATH-A-PARACETAMOL">Jalur Riset A — Parasetamol (Reaktor Riset A &amp; Holding Tank A)</option>
                        <option value="PATH-B-DICLOFENAC">Jalur Riset B — Diklofenak (Reaktor Riset B &amp; Holding Tank B)</option>
                        <option value="PATH-SPECIAL">Jalur Khusus / Penanganan Limbah B3 Faskes (Non-Biologis)</option>
                      </select>
                      <span className="text-[10px] text-[#64748b]">
                        Strain mikroorganisme kajian: Jalur A (P. moorei KB4), Jalur B (L. portucalensis F11).
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        Status Operasional Bioreaktor <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <select
                        value={processForm.reactorStatus}
                        onChange={(e) => setProcessForm({ ...processForm, reactorStatus: e.target.value as ReactorStatus })}
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] bg-white focus:outline-none"
                      >
                        <option value="Menunggu Penjadwalan">Menunggu Penjadwalan</option>
                        <option value="Menunggu Proses">Menunggu Proses</option>
                        <option value="Proses Tercatat Berlangsung">Proses Tercatat Berlangsung (Aerasi Aktif)</option>
                        <option value="Proses Tercatat Selesai">Proses Tercatat Selesai (Efluen di Holding Tank)</option>
                        <option value="Menunggu Sampling">Menunggu Sampling</option>
                      </select>
                      <span className="text-[10px] text-[#64748b]">
                        Saat proses selesai, efluen dialirkan ke holding tank dan ditahan untuk verifikasi.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#131b2e]">
                      Catatan Kondisi Proses Reaktor (DO, pH, Suhu)
                    </label>
                    <textarea
                      rows={2}
                      value={processForm.processNotes}
                      onChange={(e) => setProcessForm({ ...processForm, processNotes: e.target.value })}
                      className="border border-[#cbd5e1] rounded p-2.5 text-[13px] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-[#e2e8f0]">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <label className="text-[11px] font-bold text-[#64748b] whitespace-nowrap">Operator Reaktor:</label>
                      <input
                        type="text"
                        value={processForm.officerName}
                        onChange={(e) => setProcessForm({ ...processForm, officerName: e.target.value })}
                        className="border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 bg-[#006398] hover:bg-[#004e78] text-white font-body text-[13px] font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">sync</span>
                      <span>Perbarui Reaktor &amp; Tangki Pascaproses</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab 3: Registrasi Sampling Efluen */}
              {activeTab === 'sampling' && (
                <form onSubmit={handleSaveSample} className="p-5 md:p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#f1f5f9]">
                    <span className="text-[12px] font-bold text-[#002575] uppercase">
                      Registrasi &amp; Pengambilan Sampel Efluen Aseptis (Tahap 6)
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[12px] flex flex-col gap-1">
                    <span className="text-[#64748b]">Titik Pengambilan:</span>
                    <strong className="text-[#003426]">{activeBatch.holdingTankId} (Keluaran {activeBatch.reactorId})</strong>
                    <span className="text-[11px] text-[#475569]">
                      Sampel tidak boleh diambil sebelum proses reaktor selesai dicatat dan efluen tertampung homogen.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        ID Sampel Efluen Baru <span className="text-[#ba1a1a]">*</span>
                      </label>
                      <input
                        type="text"
                        value={sampleForm.sampleId}
                        onChange={(e) => setSampleForm({ ...sampleForm, sampleId: e.target.value })}
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] font-data-tabular uppercase focus:outline-none"
                        required
                      />
                      <span className="text-[10px] text-[#64748b]">
                        ID sampel unik yang akan dicocokkan oleh Peneliti Laboratorium.
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-[#131b2e]">
                        Suhu Rantai Dingin (Cold-Chain)
                      </label>
                      <input
                        type="text"
                        value={sampleForm.coldChainTemp}
                        onChange={(e) => setSampleForm({ ...sampleForm, coldChainTemp: e.target.value })}
                        className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] focus:outline-none"
                      />
                      <span className="text-[10px] text-[#64748b]">
                        Suhu pengiriman dingin 2-4°C untuk mencegah biodegradasi lanjutan dalam botol sampel.
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-[#131b2e]">
                      Rencana Pengujian Analitik Laboratorium
                    </label>
                    <input
                      type="text"
                      value={sampleForm.plannedTests}
                      onChange={(e) => setSampleForm({ ...sampleForm, plannedTests: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-2 text-[13px] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-[#e2e8f0]">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <label className="text-[11px] font-bold text-[#64748b] whitespace-nowrap">Petugas Sampling:</label>
                      <input
                        type="text"
                        value={sampleForm.samplerName}
                        onChange={(e) => setSampleForm({ ...sampleForm, samplerName: e.target.value })}
                        className="border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full md:w-auto px-6 py-2.5 bg-[#002575] hover:bg-[#131b2e] text-white font-body text-[13px] font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">send</span>
                      <span>Daftarkan Sampel &amp; Kirim ke Lab</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
