import React, { useState, useEffect } from 'react';
import type { PageView, UserRole, BatchData, ReportFormData } from './types.ts';
import { INITIAL_BATCHES, INITIAL_COLLECTION_POINTS, createSimulatedBatchFromReport } from './utils/batchLogic.ts';
import { Header } from './components/Header.tsx';
import { RoleSidebar } from './components/RoleSidebar.tsx';
import { Footer } from './components/Footer.tsx';
import { JalurPengolahanModal } from './components/JalurPengolahanModal.tsx';
import { InformasiBantuanModal } from './components/InformasiBantuanModal.tsx';
import { BerandaView } from './views/BerandaView.tsx';
import { LaporkanObatView } from './views/LaporkanObatView.tsx';
import { LacakLaporanView } from './views/LacakLaporanView.tsx';
import { TitikPengumpulanView } from './views/TitikPengumpulanView.tsx';
import { OperatorFasilitasView } from './views/OperatorFasilitasView.tsx';
import { VerifikatorLabView } from './views/VerifikatorLabView.tsx';

const STORAGE_KEY_BATCHES = 'pillssafe_batches_store_v2';
const STORAGE_KEY_ROLE = 'pillssafe_user_role_v2';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('beranda');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole;
      if (savedRole && ['Pelapor Publik', 'Operator Fasilitas', 'Verifikator Laboratorium'].includes(savedRole)) {
        return savedRole;
      }
    } catch (e) {
      // Ignore
    }
    return 'Pelapor Publik';
  });

  const [selectedBatchId, setSelectedBatchId] = useState<string>('BATCH-SIM-0941');
  const [selectedLocationForReport, setSelectedLocationForReport] = useState<string>('');

  // Sidebar navigation states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sub-navigation targets for dedicated role views
  const [operatorActiveTab, setOperatorActiveTab] = useState<'penerimaan' | 'reaktor' | 'sampling'>('penerimaan');
  const [labActiveSection, setLabActiveSection] = useState<'antrean' | 'analisis' | 'keputusan' | 'dossier'>('antrean');

  // Modals
  const [isJalurModalOpen, setIsJalurModalOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Batches state with local storage fallback
  const [batches, setBatches] = useState<Record<string, BatchData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BATCHES);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_BATCHES, ...parsed };
      }
    } catch (e) {
      // Ignore parse error
    }
    return INITIAL_BATCHES;
  });

  // Save custom batches on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BATCHES, JSON.stringify(batches));
    } catch (e) {
      // Ignore quota errors
    }
  }, [batches]);

  // Save role on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, userRole);
    } catch (e) {
      // Ignore
    }
  }, [userRole]);

  // Support ?view= and ?batch= query parameters for quick testing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as PageView;
    if (
      viewParam &&
      [
        'beranda',
        'laporkan-obat',
        'lacak-laporan',
        'titik-pengumpulan',
        'operator-fasilitas',
        'verifikator-lab',
      ].includes(viewParam)
    ) {
      setCurrentView(viewParam);
      // Automatically sync appropriate role if entering dedicated views directly
      if (viewParam === 'operator-fasilitas') {
        setUserRole('Operator Fasilitas');
      } else if (viewParam === 'verifikator-lab') {
        setUserRole('Verifikator Laboratorium');
      }
    }
    const batchParam = params.get('batch');
    if (batchParam && batches[batchParam]) {
      setSelectedBatchId(batchParam);
    }
  }, []);

  const handleNavigate = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'Pelapor Publik') {
      if (currentView === 'operator-fasilitas' || currentView === 'verifikator-lab') {
        setCurrentView('laporkan-obat');
      }
    } else if (newRole === 'Operator Fasilitas') {
      setCurrentView('operator-fasilitas');
    } else if (newRole === 'Verifikator Laboratorium') {
      setCurrentView('verifikator-lab');
    }
  };

  const handleSelectBatchToTrack = (batchId: string) => {
    setSelectedBatchId(batchId);
    setCurrentView('lacak-laporan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitNewReport = (form: ReportFormData, code: string) => {
    const newBatch = createSimulatedBatchFromReport(form, code);
    setBatches((prev) => ({
      ...prev,
      [code]: newBatch,
    }));
    setSelectedBatchId(code);
  };

  const handleUpdateBatch = (updatedBatch: BatchData) => {
    setBatches((prev) => ({
      ...prev,
      [updatedBatch.code]: updatedBatch,
    }));
  };

  const handleSelectLocationForReport = (locationName: string) => {
    setSelectedLocationForReport(locationName);
    setCurrentView('laporkan-obat');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compute metrics for sidebar status badges
  const batchList = Object.values(batches);
  const batchCounts = {
    total: batchList.length,
    needInspection: batchList.filter(
      (b) => b.identificationStatus === 'Menunggu Pemeriksaan' || b.identificationStatus === 'Memerlukan Verifikasi Tambahan'
    ).length,
    inReactor: batchList.filter((b) => b.reactorStatus === 'Proses Tercatat Berlangsung').length,
    waitingLab: batchList.filter((b) => !b.labAnalysis.hasResults).length,
    verified: batchList.filter((b) => b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI').length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] font-body selection:bg-[#003426] selection:text-white">
      {/* Fixed Clean Navigation Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        onChangeRole={handleRoleChange}
        onOpenJalurPengolahan={() => setIsJalurModalOpen(true)}
        onOpenInformasiBantuan={() => setIsInfoModalOpen(true)}
        notificationCount={3}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Container with Isolated Role Sidebar on the Left */}
      <div className="flex flex-1 pt-[73px] md:pt-[85px] w-full min-h-[calc(100vh-85px)]">
        {/* Dedicated Role Sidebar */}
        <RoleSidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          userRole={userRole}
          onChangeRole={handleRoleChange}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onOpenJalurPengolahan={() => setIsJalurModalOpen(true)}
          onOpenInformasiBantuan={() => setIsInfoModalOpen(true)}
          operatorActiveTab={operatorActiveTab}
          onOperatorTabChange={setOperatorActiveTab}
          labActiveSection={labActiveSection}
          onLabSectionChange={setLabActiveSection}
          batchCounts={batchCounts}
        />

        {/* Dynamic Workspace Container */}
        <div className="flex-1 flex flex-col justify-between w-full min-w-0 overflow-x-hidden">
          <main className="w-full flex-1">
            {currentView === 'beranda' && (
              <BerandaView
                batches={batches}
                onNavigate={handleNavigate}
                onSelectBatchToTrack={handleSelectBatchToTrack}
                onOpenJalurPengolahan={() => setIsJalurModalOpen(true)}
                onOpenInformasiBantuan={() => setIsInfoModalOpen(true)}
                onChangeRole={handleRoleChange}
              />
            )}

            {currentView === 'laporkan-obat' && (
              <LaporkanObatView
                onNavigate={handleNavigate}
                onSubmitReport={handleSubmitNewReport}
                initialSelectedCollectionPoint={selectedLocationForReport}
                onSelectBatchToTrack={handleSelectBatchToTrack}
              />
            )}

            {currentView === 'lacak-laporan' && (
              <LacakLaporanView
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelectBatch={setSelectedBatchId}
                onOpenInformasiBantuan={() => setIsInfoModalOpen(true)}
                userRole={userRole}
                onUpdateBatch={handleUpdateBatch}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'titik-pengumpulan' && (
              <TitikPengumpulanView
                collectionPoints={INITIAL_COLLECTION_POINTS}
                onNavigate={handleNavigate}
                onSelectLocationForReport={handleSelectLocationForReport}
              />
            )}

            {currentView === 'operator-fasilitas' && (
              <OperatorFasilitasView
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelectBatch={setSelectedBatchId}
                onNavigate={handleNavigate}
                onUpdateBatch={handleUpdateBatch}
                activeTab={operatorActiveTab}
                onTabChange={setOperatorActiveTab}
              />
            )}

            {currentView === 'verifikator-lab' && (
              <VerifikatorLabView
                batches={batches}
                selectedBatchId={selectedBatchId}
                onSelectBatch={setSelectedBatchId}
                onNavigate={handleNavigate}
                onUpdateBatch={handleUpdateBatch}
                activeSection={labActiveSection}
                onSectionChange={setLabActiveSection}
              />
            )}
          </main>

          {/* Global Regulatory Footer */}
          <Footer />
        </div>
      </div>

      {/* Educational & Compliance Modals */}
      <JalurPengolahanModal
        isOpen={isJalurModalOpen}
        onClose={() => setIsJalurModalOpen(false)}
        onNavigateToReport={() => {
          setIsJalurModalOpen(false);
          handleNavigate('laporkan-obat');
        }}
      />

      <InformasiBantuanModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
