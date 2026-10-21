import React, { useState } from 'react';
import type { BatchData } from '../types.ts';

interface UnduhRingkasanModalProps {
  batch: BatchData;
  isOpen: boolean;
  onClose: () => void;
}

export const UnduhRingkasanModal: React.FC<UnduhRingkasanModalProps> = ({ batch, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    const text = `
=== LEMBAR RINGKASAN AUDIT PELACAKAN BATCH (DATA SIMULASI) ===
Platform: PillsSafe Eco-Pharmacovigilance Platform (Simulasi)
Kode Batch: ${batch.code}
Status Sistem: ${batch.statusText}

1. DATA REGISTRASI & IDENTIFIKASI FISIK:
- Nama Produk Dilaporkan: ${batch.reportedSubstance}
- Bahan Aktif Dikonfirmasi: ${batch.confirmedSubstance}
- Asal Penyerahan: ${batch.source} (${batch.sourceMeta})
- Lokasi Pengumpulan: ${batch.location}
- Bentuk Sediaan: ${batch.dosage}
- Kondisi Kemasan: ${batch.packagingCondition}
- Status Pemilahan: ${batch.identificationStatus} (Petugas: ${batch.confirmedByOfficer})
- Catatan Pemilahan: ${batch.sortingNotes}

2. JALUR RISET & INFRASTRUKTUR FISIK:
- Jalur Riset: ${batch.pathwayTitle}
- Unit Reaktor: ${batch.reactorId} (Status: ${batch.reactorStatus})
- Tangki Pascaproses: ${batch.holdingTankId} (Status: ${batch.holdingTankStatus})

3. SAMPLING & ANALISIS LABORATORIUM:
- ID Sampel Efluen: ${batch.sample.sampleId} (Petugas: ${batch.sample.samplerName}, ${batch.sample.samplingTimestamp})
- Senyawa Induk: ${batch.labAnalysis.parentCompoundName} = ${batch.labAnalysis.parentCompoundValue} [${batch.labAnalysis.parentCompoundMethod}]
- Produk Transformasi: ${batch.labAnalysis.transformationProductsName} = ${batch.labAnalysis.transformationProductsValue} [${batch.labAnalysis.transformationProductsMethod}]
- Bioassay Toksisitas: ${batch.labAnalysis.toxicityBioassayName} = ${batch.labAnalysis.toxicityBioassayValue} [${batch.labAnalysis.toxicityBioassayMethod}]
- Batas Deteksi (LOD/LOQ): ${batch.labAnalysis.lodLoq}
- Analis & Lab: ${batch.labAnalysis.analystName} (${batch.labAnalysis.labName})

4. KEPUTUSAN VERIFIKASI RESMI:
- Status Keputusan: ${batch.verificationDecision.decision}
- Acuan Kriteria: ${batch.verificationDecision.criteriaReference}
- Ringkasan Alasan: ${batch.verificationDecision.summaryReason}
- Verifikator: ${batch.verificationDecision.decisionOfficer} (${batch.verificationDecision.decisionDate})
- Tindak Lanjut: ${batch.verificationDecision.followUpActions}

Catatan Kepatuhan Regulasi:
Dokumen ini merupakan keluaran demonstrasi prototipe digital PillsSafe. Pelepasan efluen aktual mensyaratkan lembar uji resmi laboratorium terakreditasi ISO/IEC 17025.
=== AKHIR DOKUMEN ===
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] flex flex-col print:border-none print:shadow-none print:max-h-none">
        {/* Header */}
        <div className="p-4 md:p-6 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#003426] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">description</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-[16px] md:text-[18px] font-bold text-[#131b2e]">
                  Dossier Pelacakan &amp; Verifikasi Efluen
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#006398] font-body text-[11px] font-semibold">
                  Dokumen Simulasi
                </span>
              </div>
              <p className="font-body text-[12px] text-[#475569]">
                Arsip digital pelacakan spesimen untuk dokumentasi audit rantai pengawasan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f1f5f9] hover:bg-[#e2e8f0] flex items-center justify-center text-[#475569] transition-colors"
            aria-label="Tutup Modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 md:p-8 flex flex-col gap-5 text-[#131b2e] bg-white">
          {/* Institutional Header */}
          <div className="border-b-2 border-[#003426] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#006398] block">
                SISTEM TATA KELOLA FARMAKOVIGILANS LINGKUNGAN
              </span>
              <h1 className="font-headline text-[22px] font-bold text-[#003426] leading-tight">
                PillsSafe Environmental Audit Dossier
              </h1>
              <span className="text-[11px] text-[#64748b]">
                Standar Protokol Verifikasi 8 Tahap (Rantai Pengawasan Tertutup)
              </span>
            </div>
            <div className="p-2 rounded bg-[#f8fafc] border border-[#e2e8f0] text-right font-data-tabular text-[11px]">
              <span className="text-[#64748b] block">Kode Arsip:</span>
              <strong className="text-[#003426] text-[13px]">{batch.code}</strong>
            </div>
          </div>

          {/* Watermark Notice */}
          <div className="p-2 rounded bg-[#f2f3ff] border border-[#b6c4ff] text-[11px] text-[#002575] font-semibold text-center uppercase tracking-wider">
            DATA SIMULASI — UNTUK DEMONSTRASI PROTOTIPE GAGASAN TATA KELOLA PILLSAFE
          </div>

          {/* Key Specimen Data */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col">
              <span className="text-[#64748b] text-[11px]">Identitas Dilaporkan vs Dikonfirmasi:</span>
              <strong className="text-[13px] text-[#131b2e]">{batch.reportedSubstance}</strong>
              <span className="text-[#006398] text-[11px] font-medium mt-0.5">
                Konfirmasi: {batch.confirmedSubstance}
              </span>
              <span className="text-[10px] text-[#64748b] mt-1">Status: {batch.identificationStatus}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col">
              <span className="text-[#64748b] text-[11px]">Sumber &amp; Lokasi Pengumpulan:</span>
              <strong className="text-[13px] text-[#131b2e]">{batch.source}</strong>
              <span className="text-[#64748b] text-[11px]">{batch.location}</span>
              <span className="text-[10px] text-[#64748b] mt-1">Kondisi: {batch.packagingCondition}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col">
              <span className="text-[#64748b] text-[11px]">Jalur Riset &amp; Reaktor Terpisah:</span>
              <strong className="text-[13px] text-[#131b2e]">{batch.pathwayTitle}</strong>
              <span className="text-[#006398] text-[11px]">{batch.reactorId}</span>
              <span className="text-[10px] text-[#64748b]">Pascaproses: {batch.holdingTankId}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex flex-col">
              <span className="text-[#64748b] text-[11px]">Sampel Efluen Pascaproses:</span>
              <strong className="text-[13px] text-[#131b2e]">{batch.sample.sampleId}</strong>
              <span className="text-[#64748b] text-[11px]">Petugas: {batch.sample.samplerName}</span>
              <span className="text-[10px] text-[#64748b]">Waktu: {batch.sample.samplingTimestamp}</span>
            </div>
          </div>

          {/* Laboratory Analysis Box */}
          <div className="p-4 rounded-xl border border-[#cbd5e1] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
              <span className="font-headline text-[13px] font-bold text-[#003426]">
                Hasil Pengujian 3 Parameter Efluen (Simulasi)
              </span>
              <span className="font-data-tabular text-[11px] text-[#64748b]">
                {batch.labAnalysis.labName}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[12px]">
              <div className="p-2.5 rounded bg-[#f8fafc]">
                <span className="text-[#64748b] text-[10px] block font-bold">1. SENYAWA INDUK</span>
                <span className="font-bold text-[#003426] font-data-tabular block">
                  {batch.labAnalysis.parentCompoundValue}
                </span>
                <span className="text-[11px] text-[#475569]">
                  {batch.labAnalysis.parentCompoundMethod}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#f8fafc]">
                <span className="text-[#64748b] text-[10px] block font-bold">2. PRODUK TRANSFORMASI</span>
                <span className="font-bold text-[#003426] font-data-tabular block">
                  {batch.labAnalysis.transformationProductsValue}
                </span>
                <span className="text-[11px] text-[#475569]">
                  {batch.labAnalysis.transformationProductsMethod}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#f8fafc]">
                <span className="text-[#64748b] text-[10px] block font-bold">3. BIOASSAY TOKSISITAS</span>
                <span className="font-bold text-[#003426] font-data-tabular block">
                  {batch.labAnalysis.toxicityBioassayValue}
                </span>
                <span className="text-[11px] text-[#475569]">
                  {batch.labAnalysis.toxicityBioassayMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Decision Box */}
          <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#cbd5e1] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[13px] font-bold text-[#131b2e]">
                Keputusan Verifikasi Resmi
              </span>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  batch.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI'
                    ? 'bg-[#b4efd6] text-[#002117]'
                    : batch.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
                    ? 'bg-[#ffdad6] text-[#93000a]'
                    : 'bg-[#fffbeb] text-[#92400e]'
                }`}
              >
                {batch.verificationDecision.decision}
              </span>
            </div>
            <p className="text-[12px] text-[#334155] leading-relaxed">
              <strong>Dasar Keputusan:</strong> {batch.verificationDecision.summaryReason}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#64748b] pt-1 border-t border-[#e2e8f0]">
              <span>Verifikator: {batch.verificationDecision.decisionOfficer}</span>
              <span>Tanggal: {batch.verificationDecision.decisionDate}</span>
              <span>Tindak Lanjut: {batch.verificationDecision.followUpActions}</span>
            </div>
          </div>

          {/* Institutional Sign-off in Print */}
          <div className="pt-4 border-t border-[#cbd5e1] grid grid-cols-2 gap-8 text-[11px] text-[#64748b]">
            <div>
              <p>Dicetak melalui platform PillsSafe Eco-Pharmacovigilance.</p>
              <p className="text-[#94a3b8] mt-1">Audit Trail ID: PS-TRC-{batch.code}</p>
            </div>
            <div className="text-right">
              <p>Otorisasi Digital (Simulasi):</p>
              <p className="font-bold text-[#003426] mt-4 underline decoration-[#003426]">
                {batch.verificationDecision.decisionOfficer}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="p-4 md:p-6 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3 sticky bottom-0 bg-white print:hidden">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-white border border-[#cbd5e1] hover:bg-[#f1f5f9] text-[#131b2e] font-body text-[12px] font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              <span>{copied ? 'Disalin ke Papan Klip!' : 'Salin Teks Ringkasan'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[#006398] hover:bg-[#004e78] text-white font-body text-[12px] font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#003426] text-white font-body text-[12px] font-semibold hover:bg-[#0f4c3a] transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
