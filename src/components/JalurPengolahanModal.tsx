import React from 'react';

interface JalurPengolahanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport?: () => void;
}

export const JalurPengolahanModal: React.FC<JalurPengolahanModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#002575] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">alt_route</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline text-[18px] md:text-[20px] font-bold text-[#131b2e]">
                  Arsitektur Jalur Pengolahan &amp; Kajian Biodegradasi
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#002575] font-body text-[11px] font-semibold">
                  Kajian Literatur
                </span>
              </div>
              <p className="font-body text-[12px] text-[#475569]">
                Model biotransformasi mikrobiologis dan verifikasi keselamatan efluen farmakovigilans lingkungan.
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

        {/* Body */}
        <div className="p-4 md:p-6 flex flex-col gap-6 text-[#131b2e]">
          {/* Institutional Integrity Notice */}
          <div className="p-3.5 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex items-start gap-3">
            <span className="material-symbols-outlined text-[22px] text-[#d97706] shrink-0 mt-0.5">
              science
            </span>
            <div className="text-[12px] leading-relaxed text-[#92400e]">
              <strong>Keterangan Status Ilmiah:</strong> Biodegradasi adalah pendekatan riset yang sedang dikaji, bukan proses yang otomatis terbukti berhasil atau aman. Penurunan konsentrasi senyawa induk semata <strong>TIDAK OTOMATIS</strong> membuktikan bahwa seluruh produk transformasinya aman. Verifikasi keselamatan efluen wajib menguji ketiadaan metabolit berbahaya dan uji hayati non-toksik sebelum dianggap layak buang.
            </div>
          </div>

          {/* 2 Candidate Pathways */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Jalur A: Parasetamol */}
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#b4efd6] text-[#002117] font-body text-[11px] font-semibold">
                  Jalur Kandidat A (Model)
                </span>
                <span className="font-body text-[11px] text-[#0f4c3a] font-bold">Analgesik &amp; Antipiretik</span>
              </div>
              <h3 className="font-headline text-[16px] font-bold text-[#003426]">
                Parasetamol (Acetaminophen)
              </h3>
              <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                Senyawa analgesik paling masif ditemukan dalam aliran limbah domestik perkotaan. Pada model konseptual, sediaan blister parasetamol dipilah untuk perlakuan reaktor aerobik terarah.
              </p>
              <div className="p-3 rounded-lg bg-white border border-[#cbd5e1] text-[12px] flex flex-col gap-1.5">
                <span className="font-semibold text-[#003426] text-[11px] uppercase tracking-wider">
                  Kandidat Isolat Terpilih (Kajian Literatur):
                </span>
                <div className="font-body text-[12px] italic text-[#131b2e]">
                  • Pseudomonas moorei (Strain KB4)
                  <br />
                  • Pseudomonas stutzeri (Strain CSW02)
                </div>
                <p className="font-body text-[11px] text-[#475569] mt-1">
                  <strong>Jalur Katabolisme:</strong> Deasetilasi menjadi <em>4-aminophenol</em>, dilanjutkan pemecahan cincin aromatik. Memerlukan aerasi kontinu (DO &gt; 4.0 mg/L) agar tidak terakumulasi intermediat persisten.
                </p>
              </div>
              <div className="flex justify-between items-center text-[11px] font-data-tabular text-[#475569] pt-1">
                <span>Target Retensi Simulasi: 48–72 Jam</span>
                <span className="text-[#0f4c3a] font-semibold">Target Degradasi: &gt; 98.5% (HPLC)</span>
              </div>
            </div>

            {/* Jalur B: Diklofenak */}
            <div className="p-4 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-[#cce5ff] text-[#001d31] font-body text-[11px] font-semibold">
                  Jalur Kandidat B (Model)
                </span>
                <span className="font-body text-[11px] text-[#006398] font-bold">Antiinflamasi Nonsteroid</span>
              </div>
              <h3 className="font-headline text-[16px] font-bold text-[#006398]">
                Diklofenak Natrium / Kalium
              </h3>
              <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                Senyawa rekalsitran dengan toksisitas tinggi terhadap organisme perairan. Memerlukan penanganan enzimatis khusus karena adanya gugus klorin pada struktur difenilamina.
              </p>
              <div className="p-3 rounded-lg bg-white border border-[#cbd5e1] text-[12px] flex flex-col gap-1.5">
                <span className="font-semibold text-[#006398] text-[11px] uppercase tracking-wider">
                  Kandidat Isolat Terpilih (Kajian Literatur):
                </span>
                <div className="font-body text-[12px] italic text-[#131b2e]">
                  • Labrys portucalensis (Strain F11)
                  <br />
                  • Achromobacter spanius (Strain S11)
                </div>
                <p className="font-body text-[11px] text-[#475569] mt-1">
                  <strong>Jalur Katabolisme:</strong> Hidroksilasi cincin aromatik menjadi <em>4'-hydroxydiclofenac</em> dan <em>5-hydroxydiclofenac</em>. Menuntut pemantauan ketat terhadap residu terhalogenasi.
                </p>
              </div>
              <div className="flex justify-between items-center text-[11px] font-data-tabular text-[#475569] pt-1">
                <span>Target Retensi Simulasi: 96–120 Jam</span>
                <span className="text-[#006398] font-semibold">Target Degradasi: &gt; 92.0% (LC-MS)</span>
              </div>
            </div>
          </div>

          {/* Tri-Parameter Verification Protocol */}
          <div className="p-4 rounded-xl bg-[#eaedff] border border-[#b6c4ff] flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-[#002575]">verified</span>
              <h4 className="font-headline text-[15px] font-bold text-[#002575]">
                Protokol 3 Parameter Verifikasi Keselamatan Efluen
              </h4>
            </div>
            <p className="font-body text-[12px] text-[#131b2e] leading-relaxed">
              Sebelum cairan hasil reaktor dapat dipertimbangkan aman untuk dilepaskan, sistem PillsSafe mensyaratkan kelengkapan bukti tiga pilar analitis:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-white border border-[#cbd5e1] flex flex-col gap-1">
                <span className="font-body text-[11px] font-semibold text-[#003426] uppercase">1. Senyawa Induk</span>
                <span className="font-data-tabular text-[12px] font-bold text-[#131b2e]">HPLC &lt; LOQ</span>
                <p className="text-[11px] text-[#475569]">Konsentrasi molekul awal harus tereliminasi di bawah limit kuantisasi instrumen.</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#cbd5e1] flex flex-col gap-1">
                <span className="font-body text-[11px] font-semibold text-[#006398] uppercase">2. Produk Transformasi</span>
                <span className="font-data-tabular text-[12px] font-bold text-[#131b2e]">LC-MS/MS TPs Check</span>
                <p className="text-[11px] text-[#475569]">Memastikan senyawa antara/metabolit reaktif (seperti 4-AP) telah termineralisasi.</p>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#cbd5e1] flex flex-col gap-1">
                <span className="font-body text-[11px] font-semibold text-[#002575] uppercase">3. Uji Hayati Bioassay</span>
                <span className="font-data-tabular text-[12px] font-bold text-[#131b2e]">Daphnia magna 48 Jam</span>
                <p className="text-[11px] text-[#475569]">Uji mortalitas mikrofauna perairan untuk membuktikan efluen tidak toksik secara biologis.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#64748b]">
            Didasarkan pada kompilasi literatur biosains farmakovigilans lingkungan.
          </span>
          <div className="flex items-center gap-2">
            {onNavigateToReport && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToReport();
                }}
                className="px-4 py-2 rounded bg-[#0f4c3a] text-white font-body text-[12px] font-semibold hover:bg-[#003426] transition-colors"
              >
                Laporkan Obat Kedaluwarsa
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-white border border-[#cbd5e1] text-[#131b2e] font-body text-[12px] font-semibold hover:bg-[#f1f5f9] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
