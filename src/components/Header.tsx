import React, { useState } from 'react';
import type { PageView, UserRole } from '../types.ts';

interface HeaderProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  userRole: UserRole;
  onChangeRole: (role: UserRole) => void;
  onOpenJalurPengolahan: () => void;
  onOpenInformasiBantuan: () => void;
  notificationCount: number;
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onChangeRole,
  onOpenJalurPengolahan,
  onOpenInformasiBantuan,
  notificationCount,
  onToggleSidebar,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Batch BATCH-SIM-0941 Lulus Uji Efluen',
      time: '15 menit lalu',
      desc: 'Simulasi pengujian 3 parameter efluen terpenuhi. Siap ditinjau.',
    },
    {
      id: 'notif-2',
      title: 'Jadwal Sanitasi Bio-Drop Sukamaju',
      time: '1 jam lalu',
      desc: 'Pembersihan berkala wadah dropbox berlangsung pukul 12.00-13.00 WIB.',
    },
    {
      id: 'notif-3',
      title: 'Peringatan Regulasi Limbah Farmasi',
      time: 'Hari ini',
      desc: 'Dilarang membuang obat ke wastafel atau saluran air rumah tangga.',
    },
  ];

  // Role visual badges & titles
  const roleDisplay = {
    'Penyerah': {
      label: 'Penyerah',
      badge: 'Warga / Publik',
      bgClass: 'bg-[#ecfdf5] border-[#b4efd6] text-[#003426]',
      dotClass: 'bg-[#10b981]',
    },
    'Petugas': {
      label: 'Petugas',
      badge: 'Fasilitas & Reaktor',
      bgClass: 'bg-[#ecfdf5] border-[#003426]/30 text-[#003426]',
      dotClass: 'bg-[#003426]',
    },
    'Peneliti': {
      label: 'Peneliti',
      badge: 'Laboratorium & Verifikasi',
      bgClass: 'bg-[#eaedff] border-[#002575]/30 text-[#002575]',
      dotClass: 'bg-[#002575]',
    },
  }[userRole];

  // View titles
  const viewTitles: Record<PageView, string> = {
    'beranda': 'Panduan & Beranda',
    'laporkan-obat': 'Laporkan Obat',
    'lacak-laporan': 'Lacak Laporan',
    'titik-pengumpulan': 'Titik Pengumpulan',
    'operator-fasilitas': 'Konsol Petugas Fasilitas',
    'verifikator-lab': 'Portal Peneliti Lab',
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#ffffff] shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e2e8f0]">
      {/* Simulation Notice Strip */}
      <div className="w-full bg-[#f2f3ff] px-4 md:px-6 py-1 flex items-center justify-between text-[#404944] font-body text-[11px] font-semibold border-b border-[#e2e8f0]">
        <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="material-symbols-outlined text-[14px] text-[#006398]">info</span>
          <span className="tracking-wide uppercase">
            DATA SIMULASI — UNTUK DEMONSTRASI PROTOTIPE GAGASAN | JALUR BIODEGRADASI &amp; PENGUJIAN MEMERLUKAN VALIDASI TEKNIS
          </span>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#eaedff] text-[#131b2e] font-data-tabular text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#003426] animate-pulse"></span>
            Simulasi Aktif
          </span>
          <span className="text-[#bfc9c3]">|</span>
          <span className="text-[11px] text-[#404944]">PillsSafe v1.3</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="h-14 md:h-16 w-full px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle + Brand */}
        <div className="flex items-center gap-3">
          {/* Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#404944] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors border border-[#e2e8f0]"
            aria-label="Buka / Tutup Menu Sidebar"
            title="Buka / Tutup Sidebar Navigasi"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Brand Logo */}
          <button
            onClick={() => {
              if (userRole === 'Penyerah') {
                onNavigate('laporkan-obat');
              } else if (userRole === 'Petugas') {
                onNavigate('operator-fasilitas');
              } else {
                onNavigate('verifikator-lab');
              }
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            aria-label="PillsSafe Logo"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-[#003426] text-white flex items-center justify-center shadow-xs shrink-0 group-hover:bg-[#0f4c3a] transition-colors">
              <span className="material-symbols-outlined text-[20px] md:text-[22px]">medication_liquid</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-headline text-[17px] md:text-[19px] text-[#003426] font-bold leading-none tracking-tight">
                  PillsSafe
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#f1f5f9] text-[#64748b]">
                  Tata Kelola
                </span>
              </div>
              <span className="font-body text-[10px] text-[#64748b] font-semibold tracking-wider uppercase hidden sm:block">
                Eco-Pharmacovigilance
              </span>
            </div>
          </button>

          {/* Contextual Workspace Badge */}
          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-[#e2e8f0] text-[12px]">
            <span className="text-[#64748b] font-medium">Laman Aktif:</span>
            <span className="font-bold text-[#131b2e] bg-[#f8fafc] px-2.5 py-1 rounded border border-[#e2e8f0]">
              {viewTitles[currentView] || currentView}
            </span>
          </div>
        </div>

        {/* Right Tools & Role Switcher */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Role Switcher with explicit active styling */}
          <div className={`flex items-center rounded-lg px-2 py-1 gap-1.5 border shadow-2xs ${roleDisplay.bgClass}`}>
            <span className={`w-2 h-2 rounded-full ${roleDisplay.dotClass} shrink-0`}></span>
            <label
              htmlFor="header-role-switcher"
              className="hidden lg:inline text-[11px] font-bold whitespace-nowrap"
            >
              Peran:
            </label>
            <select
              id="header-role-switcher"
              value={userRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                onChangeRole(newRole);
                if (newRole === 'Penyerah' && (currentView === 'operator-fasilitas' || currentView === 'verifikator-lab')) {
                  onNavigate('laporkan-obat');
                } else if (newRole === 'Petugas' && currentView !== 'operator-fasilitas') {
                  onNavigate('operator-fasilitas');
                } else if (newRole === 'Peneliti' && currentView !== 'verifikator-lab') {
                  onNavigate('verifikator-lab');
                }
              }}
              className="bg-white font-body text-[11px] md:text-[12px] font-bold text-[#131b2e] rounded px-2 py-1 focus:outline-none cursor-pointer border border-[#cbd5e1] max-w-[130px] sm:max-w-none shadow-2xs"
            >
              <option value="Penyerah">Penyerah (Warga)</option>
              <option value="Petugas">Petugas (Fasilitas)</option>
              <option value="Peneliti">Peneliti (Laboratorium)</option>
            </select>
          </div>

          {/* SOP / Help Button */}
          <button
            type="button"
            onClick={onOpenInformasiBantuan}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#e2e8f0] text-[12px] font-semibold text-[#404944] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors"
            title="Buka SOP & Informasi Bantuan"
          >
            <span className="material-symbols-outlined text-[16px] text-[#006398]">help_outline</span>
            <span className="hidden md:inline">SOP</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifikasi Simulasi"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-lg text-[#404944] hover:bg-[#f2f3ff] hover:text-[#131b2e] transition-colors relative border border-[#e2e8f0]"
            >
              <span className="material-symbols-outlined text-[19px]">notifications</span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#e2e8f0] p-3 z-50 flex flex-col gap-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                  <span className="font-headline text-[13px] font-bold text-[#131b2e]">
                    Notifikasi Sistem
                  </span>
                  <span className="font-data-tabular text-[11px] text-[#006398]">{notifications.length} Info</span>
                </div>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] transition-colors text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-[12px] font-semibold text-[#003426]">{n.title}</span>
                        <span className="text-[10px] text-[#94a3b8]">{n.time}</span>
                      </div>
                      <p className="font-body text-[11px] text-[#475569] mt-0.5 leading-tight">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-full text-center py-1 text-[11px] font-semibold text-[#006398] hover:underline pt-1"
                >
                  Tutup Notifikasi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
