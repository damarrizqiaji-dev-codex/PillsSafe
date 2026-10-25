import React, { useState } from 'react';
import type {
  BatchData,
  PageView,
  VerificationDecisionStatus,
} from '../types.ts';
import { submitLabAnalysis, setVerificationDecision } from '../utils/batchLogic.ts';
import { UnduhRingkasanModal } from '../components/UnduhRingkasanModal.tsx';

interface VerifikatorLabViewProps {
  batches: Record<string, BatchData>;
  selectedBatchId: string;
  onSelectBatch: (id: string) => void;
  onNavigate: (view: PageView) => void;
  onUpdateBatch: (batch: BatchData) => void;
  activeSection?: 'antrean' | 'analisis' | 'keputusan' | 'dossier';
  onSectionChange?: (section: 'antrean' | 'analisis' | 'keputusan' | 'dossier') => void;
}

export const VerifikatorLabView: React.FC<VerifikatorLabViewProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  onNavigate,
  onUpdateBatch,
  activeSection,
  onSectionChange,
}) => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Trigger dossier modal when selected via sidebar
  React.useEffect(() => {
    if (activeSection === 'dossier') {
      setIsDossierOpen(true);
    } else if (activeSection === 'keputusan') {
      const el = document.getElementById('keputusan-verifikasi-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (activeSection === 'analisis') {
      const el = document.getElementById('analisis-instrumen-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSection]);

  const batchList = Object.values(batches);
  const activeBatch = batches[selectedBatchId] || batchList[0];

  // Lab analysis & verification form
  const [labForm, setLabForm] = useState({
    parentName: activeBatch?.labAnalysis.parentCompoundName || 'Senyawa Induk',
    parentValue: activeBatch?.labAnalysis.parentCompoundValue.includes('Belum')
      ? '< LOQ (0.010 mg/L)'
      : activeBatch?.labAnalysis.parentCompoundValue || '< LOQ (0.010 mg/L)',
    parentMethod: activeBatch?.labAnalysis.parentCompoundMethod || 'HPLC-UV (Fase Terbalik C18, Deteksi 243 nm)',
    parentStatus: activeBatch?.labAnalysis.parentCompoundStatus || 'Conforming',
    lodLoq: activeBatch?.labAnalysis.lodLoq || 'LOD: 0.003 mg/L | LOQ: 0.010 mg/L',

    tpsName: activeBatch?.labAnalysis.transformationProductsName || 'Produk Transformasi / Intermediat',
    tpsValue: activeBatch?.labAnalysis.transformationProductsValue.includes('Belum')
      ? 'Non-Terdeteksi (< LOD 0.005 mg/L)'
      : activeBatch?.labAnalysis.transformationProductsValue || 'Non-Terdeteksi (< LOD 0.005 mg/L)',
    tpsMethod: activeBatch?.labAnalysis.transformationProductsMethod || 'LC-MS/MS (ESI Positif, MRM Mode)',
    tpsStatus: activeBatch?.labAnalysis.transformationProductsStatus || 'Conforming',

    bioassayName: activeBatch?.labAnalysis.toxicityBioassayName || 'Uji Toksisitas Akut Daphnia magna',
    bioassayValue: activeBatch?.labAnalysis.toxicityBioassayValue.includes('Belum')
      ? 'Mortalitas 0% (48 Jam)'
      : activeBatch?.labAnalysis.toxicityBioassayValue || 'Mortalitas 0% (48 Jam)',
    bioassayMethod: activeBatch?.labAnalysis.toxicityBioassayMethod || 'OECD Guideline 202',
    bioassayStatus: activeBatch?.labAnalysis.toxicityBioassayStatus || 'Conforming',

    labName: activeBatch?.labAnalysis.labName.includes('Menunggu')
      ? 'Laboratorium Analitik Farmakologi & Lingkungan Terpadu'
      : activeBatch?.labAnalysis.labName || 'Laboratorium Analitik Farmakologi Lingkungan',
    analystName: activeBatch?.labAnalysis.analystName.includes('Belum')
      ? 'Dr. Hendra Wibowo, M.Si (Analis Instrumental)'
      : activeBatch?.labAnalysis.analystName || 'Dr. Hendra Wibowo, M.Si',

    decision: activeBatch?.verificationDecision.decision || ('MEMENUHI KRITERIA VERIFIKASI' as VerificationDecisionStatus),
    criteriaRef: activeBatch?.verificationDecision.criteriaReference || 'SOP Verifikasi Efluen PillsSafe Rev.2 (Tri-Parameter Tri-Fold)',
    reason: activeBatch?.verificationDecision.summaryReason || 'Seluruh kriteria uji analitik terpenuhi: senyawa induk terurai di bawah batas kuantifikasi, produk transformasi non-terdeteksi, dan bioassay non-toksik.',
    actions: activeBatch?.verificationDecision.followUpActions || 'Efluen pada tangki penampung dapat dialihkan ke unit desinfeksi akhir efluen non-toksik.',
    officerName: activeBatch?.verificationDecision.decisionOfficer.includes('Otomatis')
      ? 'Prof. Dr. apt. Rachmat H., Sp.FRS (Verifikator Laboratorium)'
      : activeBatch?.verificationDecision.decisionOfficer || 'Prof. Dr. apt. Rachmat H., Sp.FRS',
  });

  const handleSelectBatchItem = (batchId: string) => {
    onSelectBatch(batchId);
    const b = batches[batchId];
    if (b) {
      setLabForm({
        parentName: b.labAnalysis.parentCompoundName,
        parentValue: b.labAnalysis.parentCompoundValue.includes('Belum')
          ? '< LOQ (0.010 mg/L)'
          : b.labAnalysis.parentCompoundValue,
        parentMethod: b.labAnalysis.parentCompoundMethod,
        parentStatus: b.labAnalysis.parentCompoundStatus,
        lodLoq: b.labAnalysis.lodLoq,

        tpsName: b.labAnalysis.transformationProductsName,
        tpsValue: b.labAnalysis.transformationProductsValue.includes('Belum')
          ? 'Non-Terdeteksi (< LOD 0.005 mg/L)'
          : b.labAnalysis.transformationProductsValue,
        tpsMethod: b.labAnalysis.transformationProductsMethod,
        tpsStatus: b.labAnalysis.transformationProductsStatus,

        bioassayName: b.labAnalysis.toxicityBioassayName,
        bioassayValue: b.labAnalysis.toxicityBioassayValue.includes('Belum')
          ? 'Mortalitas 0% (48 Jam)'
          : b.labAnalysis.toxicityBioassayValue,
        bioassayMethod: b.labAnalysis.toxicityBioassayMethod,
        bioassayStatus: b.labAnalysis.toxicityBioassayStatus,

        labName: b.labAnalysis.labName.includes('Menunggu')
          ? 'Laboratorium Analitik Farmakologi Lingkungan Terpadu'
          : b.labAnalysis.labName,
        analystName: b.labAnalysis.analystName.includes('Belum')
          ? 'Dr. Hendra Wibowo, M.Si (Analis Instrumental)'
          : b.labAnalysis.analystName,

        decision: b.verificationDecision.decision,
        criteriaRef: b.verificationDecision.criteriaReference,
        reason: b.verificationDecision.summaryReason,
        actions: b.verificationDecision.followUpActions,
        officerName: b.verificationDecision.decisionOfficer.includes('Otomatis')
          ? 'Prof. Dr. apt. Rachmat H., Sp.FRS (Verifikator Laboratorium)'
          : b.verificationDecision.decisionOfficer,
      });
    }
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();

    // Check consistency: cannot declare MEMENUHI if any parameter is Non-Conforming
    if (
      labForm.decision === 'MEMENUHI KRITERIA VERIFIKASI' &&
      (labForm.parentStatus === 'Non-Conforming' ||
        labForm.tpsStatus === 'Non-Conforming' ||
        labForm.bioassayStatus === 'Non-Conforming')
    ) {
      alert(
        'Inkonsistensi Ilmiah: Keputusan "MEMENUHI KRITERIA VERIFIKASI" tidak dapat diterbitkan bila terdapat parameter uji yang gagal (Non-Conforming). Silakan ubah keputusan menjadi "TIDAK MEMENUHI KRITERIA VERIFIKASI".'
      );
      return;
    }

    let updated = submitLabAnalysis(activeBatch, {
      parentCompoundName: labForm.parentName,
      parentCompoundValue: labForm.parentValue,
      parentCompoundMethod: labForm.parentMethod,
      parentCompoundStatus: labForm.parentStatus,
      lodLoq: labForm.lodLoq,

      transformationProductsName: labForm.tpsName,
      transformationProductsValue: labForm.tpsValue,
      transformationProductsMethod: labForm.tpsMethod,
      transformationProductsStatus: labForm.tpsStatus,

      toxicityBioassayName: labForm.bioassayName,
      toxicityBioassayValue: labForm.bioassayValue,
      toxicityBioassayMethod: labForm.bioassayMethod,
      toxicityBioassayStatus: labForm.bioassayStatus,

      labName: labForm.labName,
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
    setSuccessMsg(
      `Hasil analitis instrumental & Keputusan Verifikasi Resmi (${labForm.decision}) berhasil diterbitkan untuk ${activeBatch.code}!`
    );
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Filter batches for lab queue
  const filteredBatches = batchList.filter((b) => {
    if (filterStatus === 'waiting-results') {
      return !b.labAnalysis.hasResults;
    }
    if (filterStatus === 'decision-met') {
      return b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI';
    }
    if (filterStatus === 'decision-not-met') {
      return b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI';
    }
    if (filterStatus === 'decision-insufficient') {
      return b.verificationDecision.decision === 'DATA BELUM CUKUP';
    }
    return true;
  });

  const waitingLabCount = batchList.filter((b) => !b.labAnalysis.hasResults).length;
  const verifiedCount = batchList.filter((b) => b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI').length;
  const rejectedCount = batchList.filter((b) => b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI').length;

  return (
    <div className="flex flex-col w-full">
      {/* Top Banner Notice */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-2 flex flex-wrap items-center justify-between gap-2 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#404944]">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-[#002575] text-white uppercase tracking-wider">
            Portal Verifikasi
          </span>
          <span>MODUL VERIFIKATOR LABORATORIUM &amp; ANALISIS BIOSAFETY EFLUEN</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#006398] font-semibold">
          <span className="material-symbols-outlined text-[15px]">verified</span>
          <span>Pemeriksaan 3 Parameter Wajib: Senyawa Induk, TPs, &amp; Bioassay</span>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 flex flex-col gap-6">
        {/* Header Console */}
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-1 max-w-2xl">
              <div className="flex items-center gap-1.5 text-[#002575] font-body text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[18px]">biotech</span>
                <span>Laboratorium Validasi Lingkungan &amp; Sertifikasi Efluen</span>
              </div>
              <h1 className="font-headline text-[24px] md:text-[30px] font-bold text-[#131b2e] tracking-tight">
                Portal Peneliti Laboratorium
              </h1>
              <p className="font-body text-[14px] text-[#404944] leading-relaxed">
                Pencatatan data analitis instrumen kromatografi (HPLC-UV), spektrometri massa (LC-MS/MS), dan uji toksisitas hayati (*Daphnia magna* 48h), serta penerbitan Keputusan Verifikasi Resmi berbasis kriteria ilmiah yang ketat.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#92400e] uppercase">Belum Diuji</span>
                <span className="font-headline text-[18px] font-bold text-[#92400e]">{waitingLabCount}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#b4efd6] border border-[#003426]/30 flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#002117] uppercase">Lolos Kriteria</span>
                <span className="font-headline text-[18px] font-bold text-[#003426]">{verifiedCount}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 flex flex-col items-center">
                <span className="text-[10px] font-bold text-[#93000a] uppercase">Gagal / Ditolak</span>
                <span className="font-headline text-[18px] font-bold text-[#ba1a1a]">{rejectedCount}</span>
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

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Lab Samples Queue (4 Columns) */}
          <div className="lg:col-span-4 bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-4 flex flex-col gap-3 sticky top-24">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <span className="font-headline text-[14px] font-bold text-[#131b2e]">
                Antrean Sampel Efluen
              </span>
              <span className="text-[11px] font-bold text-[#002575]">
                {filteredBatches.length} Sampel
              </span>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => setFilterStatus('all')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterStatus === 'all' ? 'bg-[#002575] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('waiting-results')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterStatus === 'waiting-results' ? 'bg-[#002575] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Belum Uji
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('decision-met')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterStatus === 'decision-met' ? 'bg-[#002575] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Lolos
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus('decision-not-met')}
                className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                  filterStatus === 'decision-not-met' ? 'bg-[#002575] text-white' : 'bg-[#f1f5f9] text-[#475569]'
                }`}
              >
                Gagal
              </button>
            </div>

            {/* Sample Cards */}
            <div className="flex flex-col gap-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredBatches.map((b) => {
                const isSelected = b.code === activeBatch.code;
                return (
                  <button
                    key={b.code}
                    type="button"
                    onClick={() => handleSelectBatchItem(b.code)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                      isSelected
                        ? 'bg-[#eaedff] border-[#002575] shadow-xs'
                        : 'bg-[#f8fafc] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-data-tabular font-bold text-[12px] text-[#002575]">
                        {b.sample.sampleId || b.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI'
                            ? 'bg-[#b4efd6] text-[#002117]'
                            : b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
                            ? 'bg-[#ffdad6] text-[#93000a]'
                            : 'bg-[#fffbeb] text-[#92400e]'
                        }`}
                      >
                        {b.verificationDecision.decision}
                      </span>
                    </div>

                    <span className="font-body text-[12px] font-semibold text-[#131b2e] line-clamp-1">
                      Batch: {b.code} ({b.reportedSubstance.split('(')[0].trim()})
                    </span>

                    <div className="flex items-center justify-between text-[11px] text-[#64748b] pt-1 border-t border-[#e2e8f0]">
                      <span>{b.holdingTankId.split('(')[0].trim()}</span>
                      <span className="font-semibold text-[#003426]">
                        {b.labAnalysis.hasResults ? 'Hasil Uji Ada' : 'Menunggu Uji'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Lab Analysis & Verification Form (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Active Specimen Dossier Strip */}
            <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#f1f5f9]">
                <div>
                  <span className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider block">
                    Sampel Terpilih untuk Pengujian:
                  </span>
                  <h3 className="font-headline text-[18px] font-bold text-[#131b2e] font-data-tabular">
                    {activeBatch.sample.sampleId} // Batch: {activeBatch.code}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDossierOpen(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#002575] hover:bg-[#131b2e] text-white text-[11px] font-semibold transition-colors shadow-xs"
                  >
                    <span className="material-symbols-outlined text-[15px]">description</span>
                    <span>Cetak Dossier / CoA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('lacak-laporan')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#f2f3ff] text-[#006398] text-[11px] font-semibold hover:bg-[#eaedff] transition-colors"
                  >
                    <span>Lacak Status</span>
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[12px]">
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Zat Terkonfirmasi:</span>
                  <strong className="text-[#003426] truncate block">{activeBatch.confirmedSubstance}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Tangki Asal:</span>
                  <strong className="text-[#131b2e] truncate block">{activeBatch.holdingTankId}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Petugas Sampling:</span>
                  <strong className="text-[#131b2e] truncate block">{activeBatch.sample.samplerName}</strong>
                </div>
                <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0]">
                  <span className="text-[10px] text-[#64748b] block">Waktu Sampling:</span>
                  <strong className="text-[#006398] truncate block">{activeBatch.sample.samplingTimestamp}</strong>
                </div>
              </div>
            </div>

            {/* Laboratory Input & Official Verification Form */}
            <form onSubmit={handleSaveVerification} className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-5 md:p-6 flex flex-col gap-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#f1f5f9]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#002575] text-[22px]">science</span>
                  <h3 className="font-headline text-[16px] font-bold text-[#131b2e]">
                    Formulir Uji Analitis Instrumental &amp; Bioassay Toksisitas (Tahap 7)
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#002575] text-[11px] font-bold">
                  Standar ISO/IEC 17025
                </span>
              </div>

              {/* Scientific Notice */}
              <div className="p-3 rounded-lg bg-[#fffbeb] border border-[#fde68a] text-[12px] text-[#92400e] leading-relaxed">
                <strong>Prinsip Ilmiah:</strong> Penurunan konsentrasi senyawa induk <em>tidak otomatis</em> membuktikan seluruh produk transformasinya aman. Verifikasi keselamatan efluen wajib membuktikan ketiga parameter di bawah memenuhi kriteria batas deteksi dan batas toksisitas perairan.
              </div>

              {/* 1. Senyawa Induk */}
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#003426] uppercase">
                    1. Analisis Senyawa Induk (Parent Compound)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748b]">Status Kriteria:</span>
                    <select
                      value={labForm.parentStatus}
                      onChange={(e) => setLabForm({ ...labForm, parentStatus: e.target.value as any })}
                      className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white font-bold"
                    >
                      <option value="Conforming">Conforming (Lolos Ambang)</option>
                      <option value="Non-Conforming">Non-Conforming (Melebihi Ambang)</option>
                      <option value="Pending">Pending (Dalam Proses Uji)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Hasil Kuantitatif Terukur</label>
                    <input
                      type="text"
                      value={labForm.parentValue}
                      onChange={(e) => setLabForm({ ...labForm, parentValue: e.target.value })}
                      placeholder="Contoh: < LOQ (0.010 mg/L) atau 0.004 mg/L"
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 font-data-tabular focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Batas Deteksi (LOD / LOQ)</label>
                    <input
                      type="text"
                      value={labForm.lodLoq}
                      onChange={(e) => setLabForm({ ...labForm, lodLoq: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px]">
                  <label className="font-bold text-[#334155]">Metode Analisis Instrumental</label>
                  <input
                    type="text"
                    value={labForm.parentMethod}
                    onChange={(e) => setLabForm({ ...labForm, parentMethod: e.target.value })}
                    className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* 2. Produk Transformasi */}
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#006398] uppercase">
                    2. Analisis Produk Transformasi (Transformation Products / TPs)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748b]">Status Kriteria:</span>
                    <select
                      value={labForm.tpsStatus}
                      onChange={(e) => setLabForm({ ...labForm, tpsStatus: e.target.value as any })}
                      className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white font-bold"
                    >
                      <option value="Conforming">Conforming (Bebas Metabolit Toksik)</option>
                      <option value="Non-Conforming">Non-Conforming (Ada Akumulasi TPs)</option>
                      <option value="Pending">Pending (Dalam Proses Uji)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Senyawa yang Dipantau</label>
                    <input
                      type="text"
                      value={labForm.tpsName}
                      onChange={(e) => setLabForm({ ...labForm, tpsName: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Hasil Kuantitatif / Kualitatif</label>
                    <input
                      type="text"
                      value={labForm.tpsValue}
                      onChange={(e) => setLabForm({ ...labForm, tpsValue: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 font-data-tabular focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px]">
                  <label className="font-bold text-[#334155]">Metode Spektrometri Massa</label>
                  <input
                    type="text"
                    value={labForm.tpsMethod}
                    onChange={(e) => setLabForm({ ...labForm, tpsMethod: e.target.value })}
                    className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Toksisitas Bioassay */}
              <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#002575] uppercase">
                    3. Uji Hayati Toksisitas Perairan (Bioassay)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#64748b]">Status Kriteria:</span>
                    <select
                      value={labForm.bioassayStatus}
                      onChange={(e) => setLabForm({ ...labForm, bioassayStatus: e.target.value as any })}
                      className="border border-[#cbd5e1] rounded px-2 py-1 text-[11px] bg-white font-bold"
                    >
                      <option value="Conforming">Conforming (Non-Toksik Signifikan)</option>
                      <option value="Non-Conforming">Non-Conforming (Toksik / Mortalitas Tinggi)</option>
                      <option value="Pending">Pending (Dalam Inkubasi)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Organisme Uji</label>
                    <input
                      type="text"
                      value={labForm.bioassayName}
                      onChange={(e) => setLabForm({ ...labForm, bioassayName: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Hasil Mortalitas Fauna</label>
                    <input
                      type="text"
                      value={labForm.bioassayValue}
                      onChange={(e) => setLabForm({ ...labForm, bioassayValue: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 font-data-tabular focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px]">
                  <label className="font-bold text-[#334155]">Protokol Uji Toksisitas</label>
                  <input
                    type="text"
                    value={labForm.bioassayMethod}
                    onChange={(e) => setLabForm({ ...labForm, bioassayMethod: e.target.value })}
                    className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION: Keputusan Verifikasi Resmi (Tahap 8) */}
              <div id="keputusan-verifikasi-section" className="p-4 rounded-xl bg-[#ecfdf5] border-2 border-[#003426] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#003426]/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#003426] text-[22px]">gavel</span>
                    <h4 className="font-headline text-[15px] font-bold text-[#003426]">
                      Penetapan Keputusan Verifikasi Resmi (Tahap 8)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-[#003426] uppercase">
                    3 Status Baku
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold text-[#003426]">
                    Status Keputusan Verifikasi <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <select
                    value={labForm.decision}
                    onChange={(e) => setLabForm({ ...labForm, decision: e.target.value as VerificationDecisionStatus })}
                    className="border-2 border-[#003426] rounded px-3 py-2 text-[13px] bg-white font-bold text-[#003426] focus:outline-none shadow-xs"
                  >
                    <option value="MEMENUHI KRITERIA VERIFIKASI">MEMENUHI KRITERIA VERIFIKASI</option>
                    <option value="TIDAK MEMENUHI KRITERIA VERIFIKASI">TIDAK MEMENUHI KRITERIA VERIFIKASI</option>
                    <option value="DATA BELUM CUKUP">DATA BELUM CUKUP</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Acuan Kriteria / Standar Regulasi</label>
                    <input
                      type="text"
                      value={labForm.criteriaRef}
                      onChange={(e) => setLabForm({ ...labForm, criteriaRef: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Tindak Lanjut Material Efluen</label>
                    <input
                      type="text"
                      value={labForm.actions}
                      onChange={(e) => setLabForm({ ...labForm, actions: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-[12px]">
                  <label className="font-bold text-[#334155]">Ringkasan Alasan Keputusan Laboratorium</label>
                  <textarea
                    rows={2}
                    value={labForm.reason}
                    onChange={(e) => setLabForm({ ...labForm, reason: e.target.value })}
                    className="border border-[#cbd5e1] rounded p-2.5 text-[12px] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12px]">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Laboratorium Penguji</label>
                    <input
                      type="text"
                      value={labForm.labName}
                      onChange={(e) => setLabForm({ ...labForm, labName: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-[#334155]">Nama Peneliti / Verifikator Laboratorium</label>
                    <input
                      type="text"
                      value={labForm.officerName}
                      onChange={(e) => setLabForm({ ...labForm, officerName: e.target.value })}
                      className="border border-[#cbd5e1] rounded px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 rounded bg-[#003426] hover:bg-[#0f4c3a] text-white font-body text-[14px] font-bold shadow-md transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <span>Otorisasi &amp; Simpan Keputusan Verifikasi Resmi</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Dossier Modal */}
      <UnduhRingkasanModal
        batch={activeBatch}
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
      />
    </div>
  );
};
