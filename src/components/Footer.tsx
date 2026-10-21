import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f2f3ff] mt-10 border-t border-[#e2e8f0]">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 font-body text-[12px] text-[#404944]">
        <div className="flex items-start md:items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#003426] shrink-0 mt-0.5 md:mt-0">
            verified_user
          </span>
          <p className="max-w-4xl text-[12px] leading-relaxed">
            <strong>PillsSafe adalah platform konseptual pendukung tata kelola data dan pelacakan digital</strong>, bukan jaminan otomatis bahwa obat atau efluen aman tanpa verifikasi laboratorium lengkap. Pengolahan biologis dan pemantauan efluen merupakan model kajian literatur yang memerlukan validasi eksperimental.
          </p>
        </div>
        <div className="flex items-center gap-3 text-right text-[11px] font-semibold whitespace-nowrap self-start md:self-auto">
          <span className="text-[#404944]">Protokol Validasi Lingkungan © 2024–2026</span>
          <span className="inline-block w-2 h-2 rounded-full bg-[#003426]"></span>
          <span className="font-data-tabular text-[#131b2e]">ISO/IEC 17025 Ready (Simulasi)</span>
        </div>
      </div>
    </footer>
  );
};
