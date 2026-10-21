import React, { useState } from 'react';

interface InformasiBantuanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InformasiBantuanModal: React.FC<InformasiBantuanModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'kamus' | 'faq' | 'regulasi'>('kamus');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#cbd5e1] flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-6 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-[#006398] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">menu_book</span>
            </div>
            <div>
              <h2 className="font-headline text-[18px] md:text-[20px] font-bold text-[#131b2e]">
                Pusat Informasi &amp; Bantuan Teknis
              </h2>
              <p className="font-body text-[12px] text-[#475569]">
                Kamus ambang batas efluen, panduan regulasi limbah farmasi, dan FAQ pengguna.
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

        {/* Tabs Bar */}
        <div className="flex border-b border-[#e2e8f0] bg-[#f8fafc] px-4 md:px-6 gap-2">
          <button
            onClick={() => setActiveTab('kamus')}
            className={`py-3 px-3 font-body text-[13px] font-semibold border-b-2 transition-colors ${
              activeTab === 'kamus'
                ? 'border-[#006398] text-[#006398]'
                : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
            }`}
          >
            Kamus Ambang Batas
          </button>
          <button
            onClick={() => setActiveTab('regulasi')}
            className={`py-3 px-3 font-body text-[13px] font-semibold border-b-2 transition-colors ${
              activeTab === 'regulasi'
                ? 'border-[#006398] text-[#006398]'
                : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
            }`}
          >
            Peringatan Regulasi
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`py-3 px-3 font-body text-[13px] font-semibold border-b-2 transition-colors ${
              activeTab === 'faq'
                ? 'border-[#006398] text-[#006398]'
                : 'border-transparent text-[#64748b] hover:text-[#131b2e]'
            }`}
          >
            Tanya Jawab (FAQ)
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex flex-col gap-4 text-[#131b2e]">
          {activeTab === 'kamus' && (
            <div className="flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="font-headline text-[14px] font-bold text-[#003426] block mb-0.5">
                  LOD (Limit of Detection) &amp; LOQ (Limit of Quantification)
                </span>
                <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                  <strong>LOD</strong> adalah konsentrasi analit terendah dalam sampel yang dapat dideteksi secara andal tetapi belum tentu dapat dikuantifikasi secara presisi. Sedangkan <strong>LOQ</strong> adalah batas konsentrasi terendah di mana analit dapat dikuantifikasi dengan akurasi dan presisi yang dapat diterima laboratorium terakreditasi. Pelepasan efluen mensyaratkan konsentrasi senyawa induk di bawah LOQ.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="font-headline text-[14px] font-bold text-[#006398] block mb-0.5">
                  TPs (Transformation Products / Produk Transformasi)
                </span>
                <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                  Senyawa baru yang terbentuk selama proses degradasi kimia, fotolisis, atau biologis senyawa obat induk. Beberapa produk transformasi (misalnya <em>4-aminophenol</em> dari parasetamol atau intermediat terhalogenasi dari diklofenak) dapat memiliki toksisitas setara atau lebih tinggi daripada molekul aslinya. Oleh karena itu, pengujian ketiadaan TPs adalah syarat mutlak keselamatan efluen.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="font-headline text-[14px] font-bold text-[#002575] block mb-0.5">
                  Bioassay Toksisitas (Daphnia magna 48 Jam)
                </span>
                <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                  Uji biologis ekotoksikologi standar menggunakan krustasea air tawar mikroskopis (<em>Daphnia magna</em>). Bertujuan untuk mendeteksi apakah efluen pasca-olahan menimbulkan dampak letal atau penghambatan mobilitas biologis organisme akuatik dalam paparan 48 jam.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="font-headline text-[14px] font-bold text-[#ba1a1a] block mb-0.5">
                  AMR (Antimicrobial Resistance / Resistensi Antimikroba)
                </span>
                <p className="font-body text-[12px] text-[#475569] leading-relaxed">
                  Kondisi di mana mikroorganisme (bakteri, jamur) bermutasi dan kebal terhadap obat antibiotik akibat paparan konsentrasi sub-letal obat di lingkungan air dan tanah. Pembuangan obat sembarangan merupakan salah satu pemicu utama penyebaran gen resistensi ini.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'regulasi' && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-[#ffdad6]/60 border border-[#ba1a1a]/30 flex items-start gap-3">
                <span className="material-symbols-outlined text-[24px] text-[#ba1a1a] shrink-0 mt-0.5">
                  dangerous
                </span>
                <div className="flex flex-col gap-1 text-[12px] text-[#93000a] leading-relaxed">
                  <strong className="text-[13px] uppercase font-bold tracking-wider">
                    Larangan Keras Pembuangan Domestik
                  </strong>
                  <p>
                    Obat kedaluwarsa <strong>TIDAK BOLEH</strong> dibuang ke kloset, wastafel, selokan umum, tempat sampah terbuka, atau dikubur ke dalam tanah! Tindakan tersebut mencemari air minum, merusak biota perairan, dan melanggar ketentuan pengelolaan limbah farmasi.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-[12px] text-[#475569] leading-relaxed">
                <h4 className="font-bold text-[#131b2e] mb-1">Pedoman Umum Penanganan di Rumah Tangga:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pertahankan obat dalam kemasan blister/strip/botol aslinya jika memungkinkan.</li>
                  <li>Keluarkan obat dari kotak kardus luar (kardus dapat didaur ulang sebagai limbah kertas).</li>
                  <li>Kumpulkan dalam wadah sekunder (kantong kertas atau plastik tertutup).</li>
                  <li>Daftarkan laporan melalui PillsSafe untuk mendapatkan kode batch pelacakan.</li>
                  <li>Serahkan ke unit Bio-Drop terdekat sesuai jadwal operasional.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="flex flex-col gap-3 text-[12px]">
              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-[#003426] block mb-1">Apakah PillsSafe adalah fasilitas fisik yang sudah aktif?</strong>
                <p className="text-[#475569] leading-relaxed">
                  PillsSafe saat ini merupakan <strong>prototype konseptual dan simulasi tata kelola digital</strong>. Titik pengumpulan, kode batch, dan bioreaktor dalam antarmuka ini disajikan sebagai representasi perancangan sistem, bukan fasilitas operasional nyata.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-[#003426] block mb-1">Apakah obat narkotika atau psikotropika dapat diserahkan ke Bio-Drop?</strong>
                <p className="text-[#475569] leading-relaxed">
                  Tidak. Obat golongan narkotika dan psikotropika tunduk pada regulasi khusus dan wajib dikembalikan ke apotek atau rumah sakit penerbit resep asal sesuai ketentuan perundang-undangan farmasi.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#f8fafc] border border-[#e2e8f0]">
                <strong className="text-[#003426] block mb-1">Bagaimana jika tanggal kedaluwarsa pada kemasan sudah tidak terbaca?</strong>
                <p className="text-[#475569] leading-relaxed">
                  Centang opsi <em>"Tanggal tidak terbaca / kemasan robek"</em> pada formulir pelaporan. Obat akan diberi status khusus untuk skrining spektroskopi awal oleh petugas saat diterima di titik kumpul.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-[#006398] text-white font-body text-[12px] font-semibold hover:bg-[#00476e] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
