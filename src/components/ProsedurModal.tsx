import React from 'react';

interface ProsedurModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReport: () => void;
}

export const ProsedurModal: React.FC<ProsedurModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReport,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#003426] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">assignment_turned_in</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#006398] tracking-wider">
                SOP-ENV-PHARMA-04
              </span>
              <h2 className="font-headline text-[18px] md:text-[20px] font-bold text-[#131b2e]">
                Prosedur 4 Langkah Serah Terima Mandiri
              </h2>
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
        <div className="p-4 md:p-6 flex flex-col gap-4 text-[#131b2e]">
          <p className="font-body text-[13px] text-[#475569] leading-relaxed">
            Ikuti 4 langkah terstandarisasi ini sebelum mendatangi unit Bio-Drop agar keselamatan petugas terjamin dan penelusuran spesimen obat tercatat secara valid:
          </p>

          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#003426] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                1
              </span>
              <div>
                <h3 className="font-headline text-[14px] font-bold text-[#131b2e]">
                  Pertahankan Kemasan Primer
                </h3>
                <p className="font-body text-[12px] text-[#475569] mt-0.5 leading-relaxed">
                  Jangan pernah melepaskan butiran tablet atau kapsul satu per satu ke dalam wadah terbuka. Biarkan tetap dalam strip/blister aslinya agar batch pabrikan dan tanggal kedaluwarsa tetap teridentifikasi.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#003426] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                2
              </span>
              <div>
                <h3 className="font-headline text-[14px] font-bold text-[#131b2e]">
                  Masukkan ke Wadah Sekunder Tertutup
                </h3>
                <p className="font-body text-[12px] text-[#475569] mt-0.5 leading-relaxed">
                  Satukan seluruh obat ke dalam kantong kertas tebal atau amplop tertutup. Untuk sediaan sirup, pastikan tutup botol terkunci rapat dan tidak bocor sebelum dimasukkan.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#006398] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                3
              </span>
              <div>
                <h3 className="font-headline text-[14px] font-bold text-[#131b2e]">
                  Tuliskan Kode Laporan PillsSafe
                </h3>
                <p className="font-body text-[12px] text-[#475569] mt-0.5 leading-relaxed">
                  Tuliskan nomor batch unik (misal: <code>BATCH-SIM-PCT-089</code>) pada bagian luar wadah sekunder atau tunjukkan kode QR dari peramban Anda ke barcode scanner Bio-Drop.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#0f4c3a] text-white flex items-center justify-center font-bold text-[13px] shrink-0 mt-0.5">
                4
              </span>
              <div>
                <h3 className="font-headline text-[14px] font-bold text-[#131b2e]">
                  Pemindaian &amp; Validasi Masuk
                </h3>
                <p className="font-body text-[12px] text-[#475569] mt-0.5 leading-relaxed">
                  Petugas pos penerimaan atau sensor scanner memindai spesimen Anda, mengunci wadah ke dalam kompartemen bio-secure, dan memperbarui status pelacakan di sistem digital.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-white border border-[#cbd5e1] text-[#131b2e] font-body text-[12px] font-semibold hover:bg-[#f1f5f9] transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToReport();
            }}
            className="px-4 py-2 rounded bg-[#003426] text-white font-body text-[12px] font-semibold hover:bg-[#0f4c3a] transition-colors flex items-center gap-1.5"
          >
            <span>Buat Laporan Sekarang</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
