import React from 'react';
import type { PageView, UserRole } from '../types.ts';

interface RoleSidebarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenJalurPengolahan: () => void;
  onOpenInformasiBantuan: () => void;
  operatorActiveTab?: 'penerimaan' | 'reaktor' | 'sampling';
  onOperatorTabChange?: (tab: 'penerimaan' | 'reaktor' | 'sampling') => void;
  labActiveSection?: 'antrean' | 'analisis' | 'keputusan' | 'dossier';
  onLabSectionChange?: (section: 'antrean' | 'analisis' | 'keputusan' | 'dossier') => void;
  batchCounts?: {
    total: number;
    needInspection: number;
    inReactor: number;
    waitingLab: number;
    verified: number;
  };
}

export const RoleSidebar: React.FC<RoleSidebarProps> = ({
  currentView,
  onNavigate,
  userRole,
  onChangeRole,
  isOpen,
  onCloseMobile,
  isCollapsed,
  onToggleCollapse,
  onOpenJalurPengolahan,
  onOpenInformasiBantuan,
  operatorActiveTab = 'penerimaan',
  onOperatorTabChange,
  labActiveSection = 'antrean',
  onLabSectionChange,
  batchCounts = {
    total: 3,
    needInspection: 1,
    inReactor: 1,
    waitingLab: 1,
    verified: 1,
  },
}) => {
  // Handle role switch
  const handleSwitchRole = (newRole: UserRole) => {
    onChangeRole(newRole);
    if (newRole === 'Pelapor Publik') {
      if (currentView === 'operator-fasilitas' || currentView === 'verifikator-lab') {
        onNavigate('laporkan-obat');
      }
    } else if (newRole === 'Operator Fasilitas') {
      onNavigate('operator-fasilitas');
    } else if (newRole === 'Verifikator Laboratorium') {
      onNavigate('verifikator-lab');
    }
    onCloseMobile();
  };

  // Role Configuration
  const roleMeta = {
    'Pelapor Publik': {
      title: 'Pelapor Publik',
      badge: 'Warga / Penyerah',
      themeBg: 'bg-[#ecfdf5]',
      themeBorder: 'border-[#b4efd6]',
      themeText: 'text-[#003426]',
      themeActiveBtn: 'bg-[#003426] text-white',
      themeActiveSub: 'bg-[#b4efd6] text-[#002117]',
      accentColor: '#003426',
      icon: 'person',
      scopeDesc: 'Akses khusus pelaporan mandiri sediaan obat, pelacakan tiket penyerahan, dan informasi titik kumpul resmi.',
    },
    'Operator Fasilitas': {
      title: 'Operator Fasilitas',
      badge: 'Operasional Fisik',
      themeBg: 'bg-[#ecfdf5]',
      themeBorder: 'border-[#003426]/30',
      themeText: 'text-[#003426]',
      themeActiveBtn: 'bg-[#003426] text-white',
      themeActiveSub: 'bg-[#b4efd6] text-[#002117]',
      accentColor: '#003426',
      icon: 'engineering',
      scopeDesc: 'Akses khusus inspeksi fisik loket, alokasi Reaktor Riset A vs B terpisah, holding tank, dan registrasi sampel.',
    },
    'Verifikator Laboratorium': {
      title: 'Verifikator Lab',
      badge: 'Analis & Sertifikasi',
      themeBg: 'bg-[#eaedff]',
      themeBorder: 'border-[#002575]/30',
      themeText: 'text-[#002575]',
      themeActiveBtn: 'bg-[#002575] text-white',
      themeActiveSub: 'bg-[#cce5ff] text-[#001d31]',
      accentColor: '#002575',
      icon: 'biotech',
      scopeDesc: 'Akses khusus pengujian instrumen (HPLC, LC-MS/MS, Bioassay), audit biosafety, dan penetapan verifikasi efluen.',
    },
  }[userRole];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-[73px] md:top-[85px] left-0 z-40 h-[calc(100vh-73px)] md:h-[calc(100vh-85px)] bg-white border-r border-[#e2e8f0] flex flex-col justify-between transition-all duration-200 shadow-sm shrink-0 overflow-y-auto ${
          isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}`}
        aria-label="Sidebar Navigasi Peran"
      >
        {/* Top: Role Identity & Switcher */}
        <div className="flex flex-col p-4 border-b border-[#e2e8f0] gap-3">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2.5 ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 shadow-xs ${
                  userRole === 'Verifikator Laboratorium' ? 'bg-[#002575] text-white' : 'bg-[#003426] text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{roleMeta.icon}</span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-headline text-[14px] font-bold text-[#131b2e] leading-tight">
                      {roleMeta.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748b]">
                    {roleMeta.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Desktop Collapse Button */}
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden lg:flex w-7 h-7 rounded items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#131b2e] transition-colors"
              title={isCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isCollapsed ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden w-7 h-7 rounded flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Quick Role Switcher */}
          {!isCollapsed && (
            <div className="flex flex-col gap-1.5 bg-[#f8fafc] p-2.5 rounded-lg border border-[#e2e8f0]">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#475569]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                  <span>Ganti Peran Kerja:</span>
                </span>
                <span className="text-[10px] bg-[#e2e8f0] px-1.5 py-0.2 rounded text-[#131b2e] font-semibold">
                  3 Peran
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Pelapor Publik')}
                  className={`px-1.5 py-1 rounded text-[10px] font-bold text-center transition-colors truncate ${
                    userRole === 'Pelapor Publik'
                      ? 'bg-[#003426] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                  title="Pelapor Publik (Warga)"
                >
                  Pelapor
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Operator Fasilitas')}
                  className={`px-1.5 py-1 rounded text-[10px] font-bold text-center transition-colors truncate ${
                    userRole === 'Operator Fasilitas'
                      ? 'bg-[#003426] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                  title="Operator Fasilitas & Reaktor"
                >
                  Operator
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchRole('Verifikator Laboratorium')}
                  className={`px-1.5 py-1 rounded text-[10px] font-bold text-center transition-colors truncate ${
                    userRole === 'Verifikator Laboratorium'
                      ? 'bg-[#002575] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#e2e8f0] hover:bg-[#f1f5f9]'
                  }`}
                  title="Verifikator Laboratorium"
                >
                  Lab
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Middle: Strictly Segregated Role Menu Items */}
        <div className="flex-1 flex flex-col p-3 gap-1 overflow-y-auto">
          {!isCollapsed && (
            <div className="px-2 pt-1 pb-1.5 text-[11px] font-bold uppercase tracking-wider text-[#64748b] flex items-center justify-between">
              <span>Fitur {userRole}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span>
            </div>
          )}

          {/* =========================================================================
              ROLE 1: PELAPOR PUBLIK (WARGA)
              Strictly contains: Lapor Obat, Lacak Tiket Saya, Lokasi Drop Box, Edukasi Beranda
             ========================================================================= */}
          {userRole === 'Pelapor Publik' && (
            <>
              {/* Feature 1: Laporkan Obat */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('laporkan-obat');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'laporkan-obat'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Registrasi / Laporkan Obat Kedaluwarsa"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">edit_note</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Laporkan Obat</span>
                    <span className="text-[10px] opacity-80 leading-tight">Registrasi penyerahan obat</span>
                  </div>
                )}
              </button>

              {/* Feature 2: Lacak Status Laporan / Tiket */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('lacak-laporan');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'lacak-laporan'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Lacak Status Tiket Penyerahan"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">travel_explore</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Lacak Laporan</span>
                    <span className="text-[10px] opacity-80 leading-tight">Cek status penyerahan batch</span>
                  </div>
                )}
              </button>

              {/* Feature 3: Titik Pengumpulan (Drop Box) */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('titik-pengumpulan');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'titik-pengumpulan'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Lokasi Titik Kumpul (Drop Box)"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">location_on</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Titik Pengumpulan</span>
                    <span className="text-[10px] opacity-80 leading-tight">Bio-Drop &amp; jadwal buka</span>
                  </div>
                )}
              </button>

              {/* Feature 4: Panduan & Edukasi Warga */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('beranda');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'beranda'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Beranda & Panduan Edukasi"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">school</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Panduan &amp; Edukasi</span>
                    <span className="text-[10px] opacity-80 leading-tight">SOP pemilahan rumah tangga</span>
                  </div>
                )}
              </button>
            </>
          )}

          {/* =========================================================================
              ROLE 2: OPERATOR FASILITAS (OPERASIONAL FISIK & BIOREAKTOR)
              Strictly contains: Skrining Loket Fisik, Bioreaktor A & B, Registrasi Sampel, Audit Log
             ========================================================================= */}
          {userRole === 'Operator Fasilitas' && (
            <>
              {/* Feature 1: Skrining & Penerimaan Loket */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('operator-fasilitas');
                  if (onOperatorTabChange) onOperatorTabChange('penerimaan');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'operator-fasilitas' && operatorActiveTab === 'penerimaan'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Pemeriksaan Fisik & Pemilahan Loket"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">fact_check</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] leading-tight font-bold">Skrining Loket</span>
                      {batchCounts.needInspection > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#fffbeb] text-[#92400e] font-bold border border-[#fde68a]">
                          {batchCounts.needInspection} antre
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-80 leading-tight">Verifikasi kemasan &amp; zat aktif</span>
                  </div>
                )}
              </button>

              {/* Feature 2: Bioreaktor Riset & Holding Tank */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('operator-fasilitas');
                  if (onOperatorTabChange) onOperatorTabChange('reaktor');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'operator-fasilitas' && operatorActiveTab === 'reaktor'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Operasional Bioreaktor A & B + Holding Tank"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">precision_manufacturing</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] leading-tight font-bold">Bioreaktor Riset</span>
                      {batchCounts.inReactor > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#cce5ff] text-[#001d31] font-bold">
                          {batchCounts.inReactor} proses
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-80 leading-tight">Reaktor A vs B terpisah &amp; tank</span>
                  </div>
                )}
              </button>

              {/* Feature 3: Registrasi Sampel Efluen */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('operator-fasilitas');
                  if (onOperatorTabChange) onOperatorTabChange('sampling');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'operator-fasilitas' && operatorActiveTab === 'sampling'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Registrasi & Penyerahan Sampel Efluen ke Lab"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">science</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Sampling Efluen</span>
                    <span className="text-[10px] opacity-80 leading-tight">Registrasi ID sampel ke lab</span>
                  </div>
                )}
              </button>

              {/* Feature 4: Audit Ketertelusuran Batch */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('lacak-laporan');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'lacak-laporan'
                    ? 'bg-[#003426] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Audit Ketertelusuran & Log Batch Fisik"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">history_edu</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Audit Rantai Batch</span>
                    <span className="text-[10px] opacity-80 leading-tight">Log rantai batch &amp; timeline</span>
                  </div>
                )}
              </button>
            </>
          )}

          {/* =========================================================================
              ROLE 3: VERIFIKATOR LABORATORIUM (ANALISIS & SERTIFIKASI)
              Strictly contains: Antrean Sampel, Input Uji Instrumen, Keputusan 3-Tier, Dossier/CoA
             ========================================================================= */}
          {userRole === 'Verifikator Laboratorium' && (
            <>
              {/* Feature 1: Antrean Sampel Efluen */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('verifikator-lab');
                  if (onLabSectionChange) onLabSectionChange('antrean');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'verifikator-lab' && labActiveSection === 'antrean'
                    ? 'bg-[#002575] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Antrean Sampel Efluen Masuk"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">biotech</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] leading-tight font-bold">Antrean Sampel</span>
                      {batchCounts.waitingLab > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#fffbeb] text-[#92400e] font-bold border border-[#fde68a]">
                          {batchCounts.waitingLab} antre
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-80 leading-tight">Sampel aktif dari holding tank</span>
                  </div>
                )}
              </button>

              {/* Feature 2: Input Hasil Uji Instrumental */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('verifikator-lab');
                  if (onLabSectionChange) onLabSectionChange('analisis');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'verifikator-lab' && labActiveSection === 'analisis'
                    ? 'bg-[#002575] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Input Hasil Kromatografi, MS & Bioassay"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">analytics</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Hasil Uji Instrumen</span>
                    <span className="text-[10px] opacity-80 leading-tight">HPLC-UV, LC-MS/MS, Bioassay</span>
                  </div>
                )}
              </button>

              {/* Feature 3: Penetapan Keputusan Verifikasi */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('verifikator-lab');
                  if (onLabSectionChange) onLabSectionChange('keputusan');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'verifikator-lab' && labActiveSection === 'keputusan'
                    ? 'bg-[#002575] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Penetapan Status Verifikasi 3-Tier"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">gavel</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] leading-tight font-bold">Keputusan Verifikasi</span>
                      {batchCounts.verified > 0 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#b4efd6] text-[#002117] font-bold">
                          {batchCounts.verified} lolos
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] opacity-80 leading-tight">Penilaian 3-tier &amp; rekomendasi</span>
                  </div>
                )}
              </button>

              {/* Feature 4: Dossier & Berita Acara (CoA) */}
              <button
                type="button"
                onClick={() => {
                  onNavigate('verifikator-lab');
                  if (onLabSectionChange) onLabSectionChange('dossier');
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  currentView === 'verifikator-lab' && labActiveSection === 'dossier'
                    ? 'bg-[#002575] text-white shadow-xs font-semibold'
                    : 'text-[#334155] hover:bg-[#f1f5f9] hover:text-[#0f172a]'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title="Dossier Verifikasi & Unduh Sertifikat"
              >
                <span className="material-symbols-outlined text-[20px] shrink-0">assignment_turned_in</span>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] leading-tight font-bold">Dossier &amp; Berita Acara</span>
                    <span className="text-[10px] opacity-80 leading-tight">Cetak sertifikat analitis resmi</span>
                  </div>
                )}
              </button>
            </>
          )}
        </div>

        {/* Bottom: Dedicated Scope Info Card & Fast Help Actions */}
        <div className="p-3 border-t border-[#e2e8f0] flex flex-col gap-2 bg-[#f8fafc]">
          {!isCollapsed && (
            <div className={`p-2.5 rounded-lg border text-[11px] flex flex-col gap-1 ${roleMeta.themeBg} ${roleMeta.themeBorder}`}>
              <div className="flex items-center gap-1.5 font-bold text-[#131b2e]">
                <span className="material-symbols-outlined text-[15px]" style={{ color: roleMeta.accentColor }}>
                  verified_user
                </span>
                <span>Integritas Peran Terisolasi</span>
              </div>
              <p className="text-[10px] text-[#475569] leading-snug">
                {roleMeta.scopeDesc}
              </p>
            </div>
          )}

          {/* Quick Help Link */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={onOpenInformasiBantuan}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-semibold text-[#475569] hover:bg-[#e2e8f0] hover:text-[#131b2e] transition-colors ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Informasi & Bantuan SOP"
            >
              <span className="material-symbols-outlined text-[16px] text-[#006398]">help_outline</span>
              {!isCollapsed && <span>SOP &amp; Standar Regulasi</span>}
            </button>

            {userRole !== 'Pelapor Publik' && (
              <button
                type="button"
                onClick={onOpenJalurPengolahan}
                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-[11px] font-semibold text-[#475569] hover:bg-[#e2e8f0] hover:text-[#131b2e] transition-colors ${
                  isCollapsed ? 'justify-center' : ''
                }`}
                title="Kajian Literatur Biodegradasi"
              >
                <span className="material-symbols-outlined text-[16px] text-[#006398]">science</span>
                {!isCollapsed && <span>Kajian Ilmiah Rute A/B</span>}
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
