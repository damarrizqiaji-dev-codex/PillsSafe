import React, { useState, useEffect } from 'react';
import type {
  BatchData,
  PageView,
  PhysicalIdentificationStatus,
  ReactorStatus,
  ResearchRouteId,
  UserRole,
  VerificationDecisionStatus,
} from '../types.ts';
import { UnduhRingkasanModal } from '../components/UnduhRingkasanModal.tsx';
import {
  confirmPhysicalReceipt,
  assignResearchRoute,
  updateReactorStatus,
  registerEffluentSample,
  submitLabAnalysis,
  setVerificationDecision,
} from '../utils/batchLogic.ts';

interface LacakLaporanViewProps {
  batches: Record<string, BatchData>;
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onOpenInformasiBantuan: () => void;
  userRole: UserRole;
  onUpdateBatch: (batch: BatchData) => void;
  initialFilter?: string;
  onNavigate?: (view: PageView) => void;
}

export const LacakLaporanView: React.FC<LacakLaporanViewProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onOpenInformasiBantuan,
  userRole,
  onUpdateBatch,
  initialFilter = 'all',
  onNavigate,
}) => {
  const [searchInput, setSearchInput] = useState(selectedBatchId);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [operatorSubTab, setOperatorSubTab] = useState<'penerimaan' | 'proses'>('penerimaan');

  // Officer action form states
  const [receiptForm, setReceiptForm] = useState({
    confirmedDrug: '',
    status: 'Diterima untuk Jalur Penanganan' as PhysicalIdentificationStatus,
    officerName: 'Apt. Suryani, S.Farm',
    notes: '',
  });

  const [processForm, setProcessForm] = useState({
    route: 'PATH-A-PARACETAMOL' as ResearchRouteId,
    reactorStatus: 'Proses Tercatat Berlangsung' as ReactorStatus,
    sampleId: '',
    samplerName: 'Budi Santoso, A.Md.AK',
    plannedTests: 'Senyawa Induk (HPLC), Produk Transformasi (LC-MS/MS), Toksisitas (Daphnia magna 48h)',
    officerName: 'Ir. Agus Pratama',
  });

  const [labForm, setLabForm] = useState({
    parentCompoundValue: '< LOQ (0.010 mg/L)',
    parentCompoundStatus: 'Conforming' as 'Conforming' | 'Non-Conforming' | 'Pending',
    tpsValue: 'Non-Terdeteksi (< LOD 0.005 mg/L)',
    tpsStatus: 'Conforming' as 'Conforming' | 'Non-Conforming' | 'Pending',
    bioassayValue: 'Mortalitas 0% (Non-Toksik)',
    bioassayStatus: 'Conforming' as 'Conforming' | 'Non-Conforming' | 'Pending',
    analystName: 'Dr. Hendra Wibowo, M.Si',
    decision: 'MEMENUHI KRITERIA VERIFIKASI' as VerificationDecisionStatus,
    criteriaRef: 'SOP Verifikasi Efluen PillsSafe Rev.2 (Tri-Parameter Compliance)',
    reason: 'Seluruh 3 parameter uji analitik memenuhi batas ambang acuan keselamatan perairan.',
    actions: 'Efluen dialihkan ke desinfeksi akhir sebelum pelepasan lingkungan terkontrol.',
    officerName: 'Prof. Dr. apt. Rachmat H., Sp.FRS',
  });

  useEffect(() => {
    setSearchInput(selectedBatchId);
    setIsNotFound(false);
  }, [selectedBatchId]);

  const activeBatch = batches[selectedBatchId] || batches['BATCH-SIM-0941'] || Object.values(batches)[0];

  // Sync action form defaults whenever active batch changes
  useEffect(() => {
    if (activeBatch) {
      setReceiptForm({
        confirmedDrug: activeBatch.confirmedSubstance.includes('Belum')
          ? activeBatch.reportedSubstance
          : activeBatch.confirmedSubstance,
        status: activeBatch.identificationStatus,
        officerName: activeBatch.confirmedByOfficer.includes('Belum')
          ? 'Apt. Suryani, S.Farm'
          : activeBatch.confirmedByOfficer,
        notes: activeBatch.sortingNotes,
      });

      setProcessForm({
        route: activeBatch.researchRoute !== 'PATH-UNASSIGNED' ? activeBatch.researchRoute : 'PATH-A-PARACETAMOL',
        reactorStatus: activeBatch.reactorStatus,
        sampleId: activeBatch.sample.sampleId || `SMP-EF-${activeBatch.code.replace('BATCH-', '')}`,
        samplerName: activeBatch.sample.samplerName.includes('Belum')
          ? 'Budi Santoso, A.Md.AK'
          : activeBatch.sample.samplerName,
        plannedTests: activeBatch.sample.plannedTests,
        officerName: 'Ir. Agus Pratama',
      });

      setLabForm({
        parentCompoundValue:
          activeBatch.labAnalysis.parentCompoundValue.includes('Belum')
            ? '< LOQ (0.010 mg/L)'
            : activeBatch.labAnalysis.parentCompoundValue,
        parentCompoundStatus: activeBatch.labAnalysis.parentCompoundStatus,
        tpsValue:
          activeBatch.labAnalysis.transformationProductsValue.includes('Belum')
            ? 'Non-Terdeteksi (< LOD 0.005 mg/L)'
            : activeBatch.labAnalysis.transformationProductsValue,
        tpsStatus: activeBatch.labAnalysis.transformationProductsStatus,
        bioassayValue:
          activeBatch.labAnalysis.toxicityBioassayValue.includes('Belum')
            ? 'Mortalitas 0% (Non-Toksik)'
            : activeBatch.labAnalysis.toxicityBioassayValue,
        bioassayStatus: activeBatch.labAnalysis.toxicityBioassayStatus,
        analystName: activeBatch.labAnalysis.analystName.includes('Belum')
          ? 'Dr. Hendra Wibowo, M.Si'
          : activeBatch.labAnalysis.analystName,
        decision: activeBatch.verificationDecision.decision,
        criteriaRef: activeBatch.verificationDecision.criteriaReference,
        reason: activeBatch.verificationDecision.summaryReason,
        actions: activeBatch.verificationDecision.followUpActions,
        officerName: activeBatch.verificationDecision.decisionOfficer.includes('Otomatis')
          ? 'Prof. Dr. apt. Rachmat H., Sp.FRS'
          : activeBatch.verificationDecision.decisionOfficer,
      });
    }
  }, [activeBatch?.code]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    if (batches[query]) {
      setIsNotFound(false);
      onSelectBatch(query);
    } else {
      setIsNotFound(true);
    }
  };

  const handleSelectChip = (id: string) => {
    setSearchInput(id);
    setIsNotFound(false);
    onSelectBatch(id);
  };

  // Filter batches list
  const allBatchKeys = Object.keys(batches);
  const filteredBatchKeys = allBatchKeys.filter((key) => {
    const b = batches[key];
    if (statusFilter === 'all') return true;
    if (statusFilter === 'waiting-inspection') {
      return b.identificationStatus === 'Menunggu Pemeriksaan' || b.identificationStatus === 'Memerlukan Verifikasi Tambahan';
    }
    if (statusFilter === 'accepted-processing') {
      return b.identificationStatus === 'Diterima untuk Jalur Penanganan';
    }
    if (statusFilter === 'path-a') {
      return b.researchRoute === 'PATH-A-PARACETAMOL';
    }
    if (statusFilter === 'path-b') {
      return b.researchRoute === 'PATH-B-DICLOFENAC';
    }
    if (statusFilter === 'reactor-in-progress') {
      return b.reactorStatus === 'Proses Tercatat Berlangsung';
    }
    if (statusFilter === 'waiting-lab') {
      return b.sample.status === 'Menunggu Analisis' || b.sample.status === 'Analisis Sedang Dilakukan';
    }
    if (statusFilter === 'decision-met') {
      return b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI';
    }
    if (statusFilter === 'decision-not-met') {
      return b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI';
    }
    if (statusFilter === 'decision-insufficient') {
      return b.verificationDecision.decision === 'DATA BELUM CUKUP';
    }
    return true;
  });

  // Action Handlers for Roles
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
    setActionSuccessMsg(`Status penerimaan & pemilahan fisik berhasil disimpan untuk batch ${activeBatch.code}!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleSaveProcess = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = assignResearchRoute(activeBatch, processForm.route, processForm.officerName);
    updated = updateReactorStatus(updated, processForm.reactorStatus, processForm.officerName);
    if (processForm.sampleId.trim().length > 0) {
      updated = registerEffluentSample(
        updated,
        processForm.sampleId.trim().toUpperCase(),
        processForm.samplerName,
        processForm.plannedTests
      );
    }
    onUpdateBatch(updated);
    setActionSuccessMsg(`Status operasional reaktor & sampel efluen berhasil diperbarui untuk batch ${activeBatch.code}!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleSaveLabVerification = (e: React.FormEvent) => {
    e.preventDefault();
    let updated = submitLabAnalysis(activeBatch, {
      parentCompoundValue: labForm.parentCompoundValue,
      parentCompoundStatus: labForm.parentCompoundStatus,
      transformationProductsValue: labForm.tpsValue,
      transformationProductsStatus: labForm.tpsStatus,
      toxicityBioassayValue: labForm.bioassayValue,
      toxicityBioassayStatus: labForm.bioassayStatus,
      analystName: labForm.analystName,
    });
    updated = setVerificationDecision(
      updated,
      labForm.decision,
      labForm.criteriaRef,
      labForm.reason,
      labForm.officerName,
      labForm.actions
    );
    onUpdateBatch(updated);
    setActionSuccessMsg(`Hasil pengujian lab dan Keputusan Verifikasi (${labForm.decision}) resmi diterbitkan!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Simulation Pinned Notice Strip */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#404944]">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#006398] text-white uppercase tracking-wider">
            Audit Trace
          </span>
          <span className="font-data-tabular">
            SYS-ENV-TRACE // BATCH-ID: <span className="text-[#006398] font-bold">{activeBatch.code}</span>
          </span>
          <span className="text-[#cbd5e1] hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1 text-[#131b2e]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003426] animate-pulse"></span>
            Peran Aktif: <strong className="text-[#003426]">{userRole}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#006398] font-body text-[11px] font-semibold">
          <span className="material-symbols-outlined text-[16px]">science</span>
          <span>DATA SIMULASI — UNTUK DEMONSTRASI PROTOTIPE GAGASAN</span>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">
        {/* Hero / Header & Precision Search Terminal */}
        <div className="w-full bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-1.5 text-[#003426] font-body text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">track_changes</span>
                <span>Sistem Pelacakan Rantai Nilai Tertutup Farmasi</span>
              </div>
              <h1 className="font-headline text-[24px] md:text-[30px] font-bold text-[#131b2e] tracking-tight">
                Lacak Status Batch Obat Kedaluwarsa
              </h1>
              <p className="font-body text-[14px] text-[#404944] leading-relaxed">
                Penelusuran batch end-to-end: mulai registrasi, pemilahan identitas fisik, alokasi reaktor terpisah (Path A vs Path B), penampungan pascaproses, sampling efluen, hingga verifikasi laboratorium.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setIsDownloadModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#003426] hover:bg-[#0f4c3a] text-white rounded text-[12px] font-semibold transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">description</span>
                <span>Unduh Dossier Audit</span>
              </button>
            </div>
          </div>

          {/* Search Bar Console */}
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row items-stretch gap-2 bg-[#f8fafc] p-1.5 rounded-lg border border-[#cbd5e1]">
              <div className="flex-1 flex items-center px-3 bg-white rounded border border-[#e2e8f0] gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#64748b]">qr_code_scanner</span>
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Masukkan Kode Batch (Contoh: BATCH-SIM-0941, BATCH-SIM-0942, BATCH-SIM-0943, BATCH-SIM-0944)"
                  className="w-full h-10 bg-transparent font-data-tabular text-[13px] text-[#131b2e] placeholder:text-[#94a3b8] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-10 px-6 bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[13px] font-semibold rounded flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span>Lacak Batch</span>
              </button>
            </div>

            {/* Batch Not Found State */}
            {isNotFound && (
              <div className="p-3.5 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex items-start gap-3 mt-1">
                <span className="material-symbols-outlined text-[20px] text-[#d97706] shrink-0 mt-0.5">info</span>
                <div className="flex flex-col gap-1 text-[12px] text-[#92400e]">
                  <strong className="font-semibold">Kode Batch "{searchInput}" Tidak Ditemukan dalam Simulasi</strong>
                  <p>
                    Silakan periksa kembali kode batch atau pilih salah satu batch demonstrasi yang tersedia di bawah:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {allBatchKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectChip(key)}
                        className="px-2 py-0.5 rounded bg-white border border-[#cbd5e1] font-data-tabular text-[11px] font-bold text-[#006398] hover:bg-[#f1f5f9]"
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Filter & Chips Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-body text-[11px] font-semibold text-[#404944] whitespace-nowrap">
                  Filter Status:
                </span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px] font-semibold text-[#131b2e] focus:outline-none"
                >
                  <option value="all">Semua Status ({allBatchKeys.length})</option>
                  <option value="waiting-inspection">Menunggu Pemeriksaan Fisik</option>
                  <option value="accepted-processing">Diterima untuk Jalur Penanganan</option>
                  <option value="path-a">Jalur Riset A (Parasetamol)</option>
                  <option value="path-b">Jalur Riset B (Diklofenak)</option>
                  <option value="waiting-lab">Menunggu Hasil Analisis Lab</option>
                  <option value="decision-met">Memenuhi Kriteria Verifikasi</option>
                  <option value="decision-not-met">Tidak Memenuhi Kriteria</option>
                  <option value="decision-insufficient">Data Belum Cukup</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-body text-[11px] font-semibold text-[#404944] hidden sm:inline">Pilih Batch:</span>
                {filteredBatchKeys.map((key) => {
                  const b = batches[key];
                  const isSelected = key === activeBatch.code;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectChip(key)}
                      className={`px-2.5 py-1 rounded font-data-tabular text-[11px] flex items-center gap-1.5 transition-all border ${
                        isSelected
                          ? 'bg-[#b4efd6] text-[#002117] border-[#003426] font-bold shadow-xs'
                          : 'bg-[#f8fafc] text-[#404944] border-[#cbd5e1] hover:bg-[#f1f5f9]'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI'
                            ? 'bg-[#003426]'
                            : b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
                            ? 'bg-[#ba1a1a]'
                            : 'bg-[#d97706]'
                        }`}
                      ></span>
                      <span>{key}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </form>
        </div>

        {/* Action Success Alert */}
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-lg bg-[#b4efd6] border border-[#003426] text-[#002117] flex items-center gap-2 text-[13px] font-semibold shadow-xs animate-fade-in">
            <span className="material-symbols-outlined text-[20px] text-[#003426]">check_circle</span>
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Active Batch Dossier & Summary Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Primary Batch Information (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Batch Specimen Master Panel */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#003426] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">inventory_2</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">
                      Spesimen Master Batch
                    </span>
                    <span className="font-headline text-[20px] font-data-tabular text-[#131b2e] font-bold">
                      {activeBatch.code}
                    </span>
                  </div>
                </div>

                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-body text-[12px] font-semibold ${activeBatch.badgeClass}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${activeBatch.badgeDot}`}></span>
                  <span className="tracking-wide uppercase">{activeBatch.statusText}</span>
                </div>
              </div>

              {/* Distinction: Reported Substance vs Confirmed Substance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#f8fafc] p-4 rounded-lg border border-[#e2e8f0]">
                <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#e2e8f0] pb-3 md:pb-0 md:pr-4">
                  <span className="font-body text-[10px] font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#006398]">edit_note</span>
                    Identitas yang Dilaporkan Penyerah (Tahap 1)
                  </span>
                  <span className="font-headline text-[15px] text-[#131b2e] font-bold">
                    {activeBatch.reportedSubstance}
                  </span>
                  <span className="font-data-tabular text-[12px] text-[#006398]">
                    {activeBatch.substanceMeta}
                  </span>
                  <span className="text-[11px] text-[#64748b]">
                    Sumber: {activeBatch.source} ({activeBatch.sourceMeta})
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-body text-[10px] font-bold text-[#003426] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#003426]">verified_user</span>
                    Identitas Dikonfirmasi Petugas Fisik (Tahap 2)
                  </span>
                  <span className="font-headline text-[15px] text-[#003426] font-bold">
                    {activeBatch.confirmedSubstance}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#e2e8f0] text-[#131b2e]">
                      Status: {activeBatch.identificationStatus}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748b]">
                    Pemeriksa: {activeBatch.confirmedByOfficer}
                  </span>
                </div>
              </div>

              {/* Secondary Details Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="flex flex-col p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                  <span className="font-body text-[10px] text-[#64748b] font-semibold uppercase">
                    Titik Pengumpulan
                  </span>
                  <span className="font-body text-[12px] text-[#131b2e] font-semibold truncate mt-1">
                    {activeBatch.location}
                  </span>
                  <span className="text-[10px] text-[#64748b] truncate">{activeBatch.locationDetail}</span>
                </div>

                <div className="flex flex-col p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                  <span className="font-body text-[10px] text-[#64748b] font-semibold uppercase">
                    Bentuk &amp; Jumlah
                  </span>
                  <span className="font-body text-[12px] text-[#131b2e] font-semibold truncate mt-1">
                    {activeBatch.dosage}
                  </span>
                  <span className="text-[10px] text-[#64748b] truncate">{activeBatch.dosageDetail}</span>
                </div>

                <div className="flex flex-col p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                  <span className="font-body text-[10px] text-[#64748b] font-semibold uppercase">
                    Kondisi Kemasan
                  </span>
                  <span className="font-body text-[12px] text-[#131b2e] font-semibold truncate mt-1">
                    {activeBatch.packagingCondition}
                  </span>
                  <span className="text-[10px] text-[#64748b] truncate">Kedaluwarsa: {activeBatch.expiryDateInfo}</span>
                </div>

                <div className="flex flex-col p-2.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
                  <span className="font-body text-[10px] text-[#64748b] font-semibold uppercase">
                    Waktu Lapor Digital
                  </span>
                  <span className="font-body text-[12px] text-[#131b2e] font-semibold truncate mt-1">
                    {activeBatch.timestamp}
                  </span>
                  <span className="text-[10px] text-[#64748b] truncate">{activeBatch.timeDetail}</span>
                </div>
              </div>
            </div>

            {/* Tahap 4 & 5: Strict Reactor & Holding Tank Separation */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#006398] text-[22px]">alt_route</span>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Infrastruktur Riset Terpisah (Tahap 4 &amp; 5)
                  </h2>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f2f3ff] text-[#006398]">
                  Pemisahan Fisik Reaktor A vs B
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Reactor Unit Card */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#006398] uppercase">
                      Reaktor Riset Terpasang
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-[#131b2e] border border-[#cbd5e1]">
                      {activeBatch.reactorStatus}
                    </span>
                  </div>
                  <h4 className="font-headline text-[15px] font-bold text-[#131b2e]">
                    {activeBatch.reactorId}
                  </h4>
                  <p className="text-[12px] text-[#475569] leading-relaxed">
                    {activeBatch.pathwayTitle}: {activeBatch.pathwayDetail}.
                  </p>
                  <div className="mt-auto pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>Rute Riset: <strong>{activeBatch.researchRoute}</strong></span>
                    <span>Siklus Terjadwal</span>
                  </div>
                </div>

                {/* Holding Tank Card */}
                <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#003426] uppercase">
                      Tangki Pascaproses (Holding Tank)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-white text-[11px] font-semibold text-[#131b2e] border border-[#cbd5e1]">
                      {activeBatch.holdingTankStatus}
                    </span>
                  </div>
                  <h4 className="font-headline text-[15px] font-bold text-[#131b2e]">
                    {activeBatch.holdingTankId}
                  </h4>
                  <p className="text-[12px] text-[#475569] leading-relaxed">
                    Material tertampung menunggu hasil sampling efluen dan verifikasi. Tidak otomatis dilepas ke lingkungan sebelum pengujian lengkap tuntas.
                  </p>
                  <div className="mt-auto pt-2 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-[#64748b]">
                    <span>Koneksi Fisik: Eksklusif Reaktor Terkait</span>
                    <span>Tanpa Pencampuran</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tahap 6 & 7: Effluent Sampling & Lab Analysis Results */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f1f5f9] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#002575] text-[22px]">biotech</span>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Sampling &amp; Hasil Analisis Efluen (Tahap 6 &amp; 7)
                  </h2>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748b]">
                  <span>Status Sampel:</span>
                  <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#002575] font-bold">
                    {activeBatch.sample.status}
                  </span>
                </div>
              </div>

              {/* Sample Metadata Strip */}
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 text-[12px]">
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">ID Sampel:</span>
                  <strong className="font-data-tabular text-[#006398]">{activeBatch.sample.sampleId}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">Asal:</span>
                  <span className="text-[#131b2e]">{activeBatch.sample.tankOrigin}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">Petugas Sampling:</span>
                  <span className="text-[#131b2e]">{activeBatch.sample.samplerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748b]">Waktu:</span>
                  <span className="text-[#131b2e]">{activeBatch.sample.samplingTimestamp}</span>
                </div>
              </div>

              {/* Tri-Parameter Analysis Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-[#cbd5e1] text-[11px] font-bold text-[#64748b] uppercase bg-[#f8fafc]">
                      <th className="py-2.5 px-3">Parameter Uji Wajib</th>
                      <th className="py-2.5 px-3">Hasil Analisis Terukur</th>
                      <th className="py-2.5 px-3">Metode Analisis</th>
                      <th className="py-2.5 px-3">Status Kriteria</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#131b2e]">
                        1. Senyawa Induk ({activeBatch.labAnalysis.parentCompoundName})
                      </td>
                      <td className="py-3 px-3 font-data-tabular font-bold text-[#003426]">
                        {activeBatch.labAnalysis.parentCompoundValue}
                      </td>
                      <td className="py-3 px-3 text-[#64748b]">
                        {activeBatch.labAnalysis.parentCompoundMethod}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            activeBatch.labAnalysis.parentCompoundStatus === 'Conforming'
                              ? 'bg-[#b4efd6] text-[#002117]'
                              : activeBatch.labAnalysis.parentCompoundStatus === 'Non-Conforming'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#fffbeb] text-[#92400e]'
                          }`}
                        >
                          {activeBatch.labAnalysis.parentCompoundStatus}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#131b2e]">
                        2. Produk Transformasi ({activeBatch.labAnalysis.transformationProductsName})
                      </td>
                      <td className="py-3 px-3 font-data-tabular font-bold text-[#003426]">
                        {activeBatch.labAnalysis.transformationProductsValue}
                      </td>
                      <td className="py-3 px-3 text-[#64748b]">
                        {activeBatch.labAnalysis.transformationProductsMethod}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            activeBatch.labAnalysis.transformationProductsStatus === 'Conforming'
                              ? 'bg-[#b4efd6] text-[#002117]'
                              : activeBatch.labAnalysis.transformationProductsStatus === 'Non-Conforming'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#fffbeb] text-[#92400e]'
                          }`}
                        >
                          {activeBatch.labAnalysis.transformationProductsStatus}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3 font-semibold text-[#131b2e]">
                        3. Toksisitas Perairan ({activeBatch.labAnalysis.toxicityBioassayName})
                      </td>
                      <td className="py-3 px-3 font-data-tabular font-bold text-[#003426]">
                        {activeBatch.labAnalysis.toxicityBioassayValue}
                      </td>
                      <td className="py-3 px-3 text-[#64748b]">
                        {activeBatch.labAnalysis.toxicityBioassayMethod}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            activeBatch.labAnalysis.toxicityBioassayStatus === 'Conforming'
                              ? 'bg-[#b4efd6] text-[#002117]'
                              : activeBatch.labAnalysis.toxicityBioassayStatus === 'Non-Conforming'
                              ? 'bg-[#ffdad6] text-[#93000a]'
                              : 'bg-[#fffbeb] text-[#92400e]'
                          }`}
                        >
                          {activeBatch.labAnalysis.toxicityBioassayStatus}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#e2e8f0] text-[11px] text-[#64748b]">
                <span>Batas Deteksi (LOD/LOQ): <strong>{activeBatch.labAnalysis.lodLoq}</strong></span>
                <span>Laboratorium: <strong>{activeBatch.labAnalysis.labName}</strong></span>
                <span>Analis: <strong>{activeBatch.labAnalysis.analystName}</strong></span>
              </div>
            </div>

            {/* Tahap 8: Official Verification Decision */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#003426] text-[22px]">verified</span>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Keputusan Verifikasi Keselamatan Efluen (Tahap 8)
                  </h2>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wide ${
                    activeBatch.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI'
                      ? 'bg-[#b4efd6] text-[#002117] border border-[#003426]'
                      : activeBatch.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
                      ? 'bg-[#ffdad6] text-[#93000a] border border-[#ba1a1a]'
                      : 'bg-[#fffbeb] text-[#92400e] border border-[#d97706]'
                  }`}
                >
                  {activeBatch.verificationDecision.decision}
                </span>
              </div>

              <div className="flex flex-col gap-2 bg-[#f8fafc] p-4 rounded-xl border border-[#e2e8f0]">
                <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase">Acuan Penilaian</span>
                  <span className="text-[13px] font-semibold text-[#131b2e]">
                    {activeBatch.verificationDecision.criteriaReference}
                  </span>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-[#e2e8f0]">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase">Ringkasan Alasan Keputusan</span>
                  <p className="text-[13px] text-[#334155] leading-relaxed">
                    {activeBatch.verificationDecision.summaryReason}
                  </p>
                </div>
                <div className="flex flex-col gap-1 pt-2 border-t border-[#e2e8f0]">
                  <span className="text-[11px] font-bold text-[#64748b] uppercase">Catatan Tindak Lanjut</span>
                  <p className="text-[13px] text-[#003426] font-medium">
                    {activeBatch.verificationDecision.followUpActions}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b] pt-1">
                <span>Verifikator: <strong>{activeBatch.verificationDecision.decisionOfficer}</strong></span>
                <span>Tanggal Keputusan: <strong>{activeBatch.verificationDecision.decisionDate}</strong></span>
                <span>Referensi Bukti: <strong>{activeBatch.verificationDecision.evidenceReference}</strong></span>
              </div>
            </div>

            {/* 8-Step Interactive Life-Cycle Audit Timeline */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#003426] text-[22px]">account_tree</span>
                  <h2 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Kronologi 8 Tahap Ekosistem PillsSafe
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-[#64748b]">
                  Progres: {activeBatch.stepsDone} dari 8 Tahap Selesai
                </span>
              </div>

              <div className="flex flex-col gap-4 relative">
                {activeBatch.steps.map((step, idx) => {
                  const isDone = step.isCompleted;
                  return (
                    <div key={step.stepNumber} className="flex items-start gap-3.5 relative">
                      {/* Timeline Stem */}
                      {idx !== activeBatch.steps.length - 1 && (
                        <div
                          className={`absolute top-7 left-[15px] w-0.5 h-full -ml-[1px] ${
                            isDone ? 'bg-[#003426]' : 'bg-[#e2e8f0]'
                          }`}
                        ></div>
                      )}

                      {/* Timeline Dot */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 font-data-tabular text-[12px] font-bold ${
                          isDone
                            ? 'bg-[#003426] text-white shadow-xs'
                            : step.statusType === 'in-progress'
                            ? 'bg-[#006398] text-white animate-pulse'
                            : step.statusType === 'caution'
                            ? 'bg-[#ba1a1a] text-white'
                            : 'bg-[#f1f5f9] text-[#94a3b8] border border-[#cbd5e1]'
                        }`}
                      >
                        {isDone ? (
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        ) : (
                          step.stepNumber
                        )}
                      </div>

                      {/* Timeline Content Card */}
                      <div className="flex-1 bg-[#f8fafc] p-3.5 rounded-xl border border-[#e2e8f0] flex flex-col gap-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-headline text-[14px] font-bold text-[#131b2e]">
                            Tahap {step.stepNumber}: {step.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              step.statusType === 'verified'
                                ? 'bg-[#b4efd6] text-[#002117]'
                                : step.statusType === 'in-progress'
                                ? 'bg-[#cce5ff] text-[#001d31]'
                                : step.statusType === 'caution'
                                ? 'bg-[#ffdad6] text-[#93000a]'
                                : 'bg-[#f1f5f9] text-[#64748b]'
                            }`}
                          >
                            {step.statusLabel}
                          </span>
                        </div>
                        <p className="text-[12px] text-[#475569] leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#e2e8f0] text-[11px] text-[#64748b]">
                          <span>Pelaksana: <strong>{step.actor}</strong></span>
                          <span>Waktu: <strong>{step.date}</strong></span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar / Role-Based Interactive Operations (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Interactive Role Action Panel */}
            <div className="bg-white rounded-xl shadow-xs border-2 border-[#003426] p-5 flex flex-col gap-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[20px] text-[#003426]">badge</span>
                  <span className="font-headline text-[14px] font-bold text-[#131b2e]">
                    Panel Aksi: {userRole}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#b4efd6] text-[#002117] text-[10px] font-bold uppercase">
                  Interaktif
                </span>
              </div>

              {/* ACTION FOR: Petugas */}
              {userRole === 'Petugas' && (
                <div className="flex flex-col gap-3">
                  <div className="flex rounded bg-[#f1f5f9] p-0.5 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setOperatorSubTab('penerimaan')}
                      className={`flex-1 py-1.5 rounded transition-all flex items-center justify-center gap-1 ${
                        operatorSubTab === 'penerimaan'
                          ? 'bg-[#003426] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#131b2e]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">checklist</span>
                      <span>1. Loket &amp; Pemilahan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOperatorSubTab('proses')}
                      className={`flex-1 py-1.5 rounded transition-all flex items-center justify-center gap-1 ${
                        operatorSubTab === 'proses'
                          ? 'bg-[#003426] text-white shadow-xs'
                          : 'text-[#475569] hover:text-[#131b2e]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">tune</span>
                      <span>2. Reaktor &amp; Sampel</span>
                    </button>
                  </div>

                  {operatorSubTab === 'penerimaan' ? (
                    <form onSubmit={handleSaveReceipt} className="flex flex-col gap-3">
                      <p className="text-[12px] text-[#475569]">
                        Periksa fisik obat di loket pengumpulan, konfirmasi zat aktif sebenarnya, dan tentukan jalur penanganan.
                      </p>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Bahan Aktif Dikonfirmasi Fisik</label>
                        <input
                          type="text"
                          value={receiptForm.confirmedDrug}
                          onChange={(e) => setReceiptForm({ ...receiptForm, confirmedDrug: e.target.value })}
                          placeholder="Contoh: Parasetamol 500mg (Utuh)"
                          className="border border-[#cbd5e1] rounded px-3 py-1.5 text-[12px] focus:outline-none focus:border-[#003426]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Status Pemilahan Fisik</label>
                        <select
                          value={receiptForm.status}
                          onChange={(e) => setReceiptForm({ ...receiptForm, status: e.target.value as PhysicalIdentificationStatus })}
                          className="border border-[#cbd5e1] rounded px-2.5 py-1.5 text-[12px] bg-white focus:outline-none"
                        >
                          <option value="Diterima untuk Jalur Penanganan">Diterima untuk Jalur Penanganan</option>
                          <option value="Memerlukan Verifikasi Tambahan">Memerlukan Verifikasi Tambahan</option>
                          <option value="Dikarantina atau Ditolak">Dikarantina atau Ditolak</option>
                          <option value="Menunggu Pemeriksaan">Menunggu Pemeriksaan</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Catatan Hasil Pemilahan</label>
                        <textarea
                          rows={2}
                          value={receiptForm.notes}
                          onChange={(e) => setReceiptForm({ ...receiptForm, notes: e.target.value })}
                          placeholder="Contoh: Kemasan utuh, blister tidak bocor..."
                          className="border border-[#cbd5e1] rounded p-2 text-[12px] focus:outline-none focus:border-[#003426]"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Petugas Penerimaan</label>
                        <input
                          type="text"
                          value={receiptForm.officerName}
                          onChange={(e) => setReceiptForm({ ...receiptForm, officerName: e.target.value })}
                          className="border border-[#cbd5e1] rounded px-3 py-1.5 text-[12px] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-1 py-2 rounded bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">save</span>
                        <span>Simpan Hasil Pemilahan Fisik</span>
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleSaveProcess} className="flex flex-col gap-3">
                      <p className="text-[12px] text-[#475569]">
                        Tetapkan alokasi reaktor terpisah (Path A vs Path B), perbarui status proses, dan daftarkan sampel efluen.
                      </p>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Alokasi Jalur Riset Terpisah</label>
                        <select
                          value={processForm.route}
                          onChange={(e) => setProcessForm({ ...processForm, route: e.target.value as ResearchRouteId })}
                          className="border border-[#cbd5e1] rounded px-2.5 py-1.5 text-[12px] bg-white focus:outline-none"
                        >
                          <option value="PATH-A-PARACETAMOL">Jalur Riset A — Parasetamol (Reaktor A &amp; Holding Tank A)</option>
                          <option value="PATH-B-DICLOFENAC">Jalur Riset B — Diklofenak (Reaktor B &amp; Holding Tank B)</option>
                          <option value="PATH-SPECIAL">Jalur Khusus / Non-Biologis (Limbah Medis B3)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Status Operasional Reaktor</label>
                        <select
                          value={processForm.reactorStatus}
                          onChange={(e) => setProcessForm({ ...processForm, reactorStatus: e.target.value as ReactorStatus })}
                          className="border border-[#cbd5e1] rounded px-2.5 py-1.5 text-[12px] bg-white focus:outline-none"
                        >
                          <option value="Menunggu Proses">Menunggu Proses</option>
                          <option value="Proses Tercatat Berlangsung">Proses Tercatat Berlangsung</option>
                          <option value="Proses Tercatat Selesai">Proses Tercatat Selesai (Efluen di Holding Tank)</option>
                          <option value="Menunggu Sampling">Menunggu Sampling</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">ID Sampel Efluen Pascaproses</label>
                        <input
                          type="text"
                          value={processForm.sampleId}
                          onChange={(e) => setProcessForm({ ...processForm, sampleId: e.target.value })}
                          placeholder="Contoh: SMP-EF-0941-A"
                          className="border border-[#cbd5e1] rounded px-3 py-1.5 text-[12px] focus:outline-none font-data-tabular uppercase"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-bold text-[#334155]">Petugas Sampling</label>
                        <input
                          type="text"
                          value={processForm.samplerName}
                          onChange={(e) => setProcessForm({ ...processForm, samplerName: e.target.value })}
                          className="border border-[#cbd5e1] rounded px-3 py-1.5 text-[12px] focus:outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-1 py-2 rounded bg-[#006398] hover:bg-[#004e78] text-white font-body text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[15px]">sync</span>
                        <span>Perbarui Reaktor &amp; Daftarkan Sampel</span>
                      </button>
                    </form>
                  )}

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('operator-fasilitas')}
                      className="w-full mt-2 py-2 rounded border border-[#003426] text-[#003426] hover:bg-[#ecfdf5] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">engineering</span>
                      <span>Buka Laman Konsol Petugas Fasilitas Lengkap</span>
                    </button>
                  )}
                </div>
              )}

              {/* ACTION FOR: Peneliti */}
              {userRole === 'Peneliti' && (
                <form onSubmit={handleSaveLabVerification} className="flex flex-col gap-3">
                  <p className="text-[12px] text-[#475569]">
                    Masukkan hasil uji instrumental kromatografi, spektrometri massa, dan uji toksisitas hayati, lalu tetapkan keputusan verifikasi resmi.
                  </p>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#334155]">Hasil Senyawa Induk (HPLC)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={labForm.parentCompoundValue}
                        onChange={(e) => setLabForm({ ...labForm, parentCompoundValue: e.target.value })}
                        className="flex-1 border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                      <select
                        value={labForm.parentCompoundStatus}
                        onChange={(e) => setLabForm({ ...labForm, parentCompoundStatus: e.target.value as any })}
                        className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white"
                      >
                        <option value="Conforming">Lolos</option>
                        <option value="Non-Conforming">Gagal</option>
                        <option value="Pending">Antre</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#334155]">Hasil Produk Transformasi (LC-MS)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={labForm.tpsValue}
                        onChange={(e) => setLabForm({ ...labForm, tpsValue: e.target.value })}
                        className="flex-1 border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                      <select
                        value={labForm.tpsStatus}
                        onChange={(e) => setLabForm({ ...labForm, tpsStatus: e.target.value as any })}
                        className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white"
                      >
                        <option value="Conforming">Lolos</option>
                        <option value="Non-Conforming">Gagal</option>
                        <option value="Pending">Antre</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#334155]">Hasil Bioassay Toksisitas (Daphnia)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={labForm.bioassayValue}
                        onChange={(e) => setLabForm({ ...labForm, bioassayValue: e.target.value })}
                        className="flex-1 border border-[#cbd5e1] rounded px-2.5 py-1 text-[12px]"
                      />
                      <select
                        value={labForm.bioassayStatus}
                        onChange={(e) => setLabForm({ ...labForm, bioassayStatus: e.target.value as any })}
                        className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white"
                      >
                        <option value="Conforming">Lolos</option>
                        <option value="Non-Conforming">Gagal</option>
                        <option value="Pending">Antre</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 pt-2 border-t border-[#e2e8f0]">
                    <label className="text-[11px] font-bold text-[#002575]">Keputusan Verifikasi Resmi (3 Status)</label>
                    <select
                      value={labForm.decision}
                      onChange={(e) => setLabForm({ ...labForm, decision: e.target.value as VerificationDecisionStatus })}
                      className="border-2 border-[#002575] rounded px-2.5 py-1.5 text-[12px] bg-white font-bold text-[#002575] focus:outline-none"
                    >
                      <option value="MEMENUHI KRITERIA VERIFIKASI">MEMENUHI KRITERIA VERIFIKASI</option>
                      <option value="TIDAK MEMENUHI KRITERIA VERIFIKASI">TIDAK MEMENUHI KRITERIA VERIFIKASI</option>
                      <option value="DATA BELUM CUKUP">DATA BELUM CUKUP</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#334155]">Ringkasan Alasan Keputusan</label>
                    <textarea
                      rows={2}
                      value={labForm.reason}
                      onChange={(e) => setLabForm({ ...labForm, reason: e.target.value })}
                      className="border border-[#cbd5e1] rounded p-2 text-[12px] focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-bold text-[#334155]">Nama Peneliti / Verifikator</label>
                    <input
                      type="text"
                      value={labForm.officerName}
                      onChange={(e) => setLabForm({ ...labForm, officerName: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 text-[12px] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-1 py-2 rounded bg-[#002575] hover:bg-[#131b2e] text-white font-body text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">verified</span>
                    <span>Terbitkan Keputusan Verifikasi</span>
                  </button>

                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => onNavigate('verifikator-lab')}
                      className="w-full mt-1 py-2 rounded border border-[#002575] text-[#002575] hover:bg-[#eaedff] text-[12px] font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">biotech</span>
                      <span>Buka Laman Portal Peneliti Lab Lengkap</span>
                    </button>
                  )}
                </form>
              )}

              {/* ACTION FOR: Penyerah */}
              {userRole === 'Penyerah' && (
                <div className="flex flex-col gap-3">
                  <p className="text-[12px] text-[#475569] leading-relaxed">
                    Anda sedang berada dalam mode <strong>Penyerah</strong>. Anda dapat melihat perkembangan spesimen obat yang diserahkan secara transparan.
                  </p>
                  <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-1 text-[12px]">
                    <span className="font-bold text-[#003426]">Petunjuk Penyerahan Fisik:</span>
                    <ol className="list-decimal pl-4 flex flex-col gap-1 text-[#475569]">
                      <li>Kemas obat dalam kantong plastik/wadah sekunder tertutup.</li>
                      <li>Tulis kode batch <strong>{activeBatch.code}</strong> pada kantong sekunder.</li>
                      <li>Bawa ke lokasi titik kumpul: <strong>{activeBatch.location}</strong>.</li>
                    </ol>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenInformasiBantuan}
                    className="w-full py-2 rounded bg-[#f2f3ff] text-[#006398] font-semibold text-[12px] hover:bg-[#eaedff] transition-colors"
                  >
                    Buka Panduan SOP Penyerahan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Download Printable Dossier Modal */}
      <UnduhRingkasanModal
        batch={activeBatch}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};
