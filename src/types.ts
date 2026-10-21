export type PageView =
  | 'beranda'
  | 'laporkan-obat'
  | 'lacak-laporan'
  | 'titik-pengumpulan'
  | 'operator-fasilitas'
  | 'verifikator-lab';

export type UserRole =
  | 'Pelapor Publik'
  | 'Operator Fasilitas'
  | 'Verifikator Laboratorium';

export type PhysicalIdentificationStatus =
  | 'Menunggu Pemeriksaan'
  | 'Teridentifikasi'
  | 'Memerlukan Verifikasi Tambahan'
  | 'Diterima untuk Jalur Penanganan'
  | 'Dikarantina atau Ditolak';

export type ResearchRouteId = 'PATH-A-PARACETAMOL' | 'PATH-B-DICLOFENAC' | 'PATH-UNASSIGNED' | 'PATH-SPECIAL';

export type ReactorStatus =
  | 'Menunggu Penjadwalan'
  | 'Menunggu Proses'
  | 'Proses Tercatat Berlangsung'
  | 'Proses Tercatat Selesai'
  | 'Menunggu Sampling'
  | 'Menunggu Hasil Analisis';

export type HoldingTankStatus =
  | 'Kosong'
  | 'Menampung Efluen Pascaproses'
  | 'Menunggu Verifikasi Laboratorium'
  | 'Verifikasi Selesai - Arsip'
  | 'Verifikasi Gagal - Tertahan';

export type SampleStatus =
  | 'Belum Diambil'
  | 'Telah Diambil'
  | 'Menunggu Analisis'
  | 'Analisis Sedang Dilakukan'
  | 'Hasil Tersedia'
  | 'Perlu Pengujian Ulang'
  | 'Sampel Tidak Valid';

export type VerificationDecisionStatus =
  | 'MEMENUHI KRITERIA VERIFIKASI'
  | 'TIDAK MEMENUHI KRITERIA VERIFIKASI'
  | 'DATA BELUM CUKUP';

export interface BatchStep {
  stepNumber: number;
  title: string;
  date: string;
  actor: string;
  description: string;
  statusLabel: string;
  statusType: 'verified' | 'in-progress' | 'pending' | 'caution';
  metaInfo?: string;
  isCompleted: boolean;
}

export interface EffluentSample {
  sampleId: string;
  batchId: string;
  routeId: ResearchRouteId;
  reactorOrigin: string; // e.g. "Bioreaktor A (P. moorei KB4)" or "Bioreaktor B (L. portucalensis F11)"
  tankOrigin: string;    // e.g. "Holding Tank A" or "Holding Tank B"
  samplingTimestamp: string;
  samplerName: string;
  plannedTests: string;  // e.g. "Senyawa Induk (HPLC), Produk Transformasi (LC-MS/MS), Toksisitas (D. magna)"
  status: SampleStatus;
  storageNotes?: string;
}

export interface LabAnalysisResults {
  hasResults: boolean;
  parentCompoundName: string;
  parentCompoundValue: string; // e.g. "< LOQ (0.010 mg/L)" or "Belum ada hasil analisis"
  parentCompoundMethod: string;
  parentCompoundStatus: 'Conforming' | 'Non-Conforming' | 'Pending';
  lodLoq: string;

  transformationProductsName: string;
  transformationProductsValue: string; // e.g. "4-Aminophenol: Non-Terdeteksi"
  transformationProductsMethod: string;
  transformationProductsStatus: 'Conforming' | 'Non-Conforming' | 'Pending';

  toxicityBioassayName: string;
  toxicityBioassayValue: string; // e.g. "Daphnia magna 48-jam mortalitas 0%"
  toxicityBioassayMethod: string;
  toxicityBioassayStatus: 'Conforming' | 'Non-Conforming' | 'Pending';

  testingDate: string;
  labName: string;
  analystName: string;
  rawNotes?: string;
}

export interface VerificationDecision {
  decision: VerificationDecisionStatus;
  criteriaReference: string;
  summaryReason: string;
  evidenceReference: string;
  decisionDate: string;
  decisionOfficer: string;
  followUpActions: string;
}

export interface BatchData {
  code: string;
  // Reported vs Confirmed Identities (Tahap 1 & 2)
  reportedSubstance: string;
  confirmedSubstance: string;
  substanceMeta: string;
  source: string;
  sourceMeta: string;
  location: string;
  locationDetail: string;
  dosage: string;
  dosageDetail: string;
  packagingCondition: string;
  expiryDateInfo: string;

  // Sorting & Physical Identification Status (Tahap 2)
  identificationStatus: PhysicalIdentificationStatus;
  sortingNotes: string;
  confirmedByOfficer: string;

  // Research Route & Reactor/Tank linkage (Tahap 4 & 5)
  researchRoute: ResearchRouteId;
  pathwayTitle: string;
  pathwayDetail: string;
  reactorId: string;       // "Reactor A" or "Reactor B"
  reactorStatus: ReactorStatus;
  holdingTankId: string;   // "Holding Tank A" or "Holding Tank B"
  holdingTankStatus: HoldingTankStatus;

  // Effluent Sampling (Tahap 6)
  sample: EffluentSample;

  // Lab Analysis Results (Tahap 7)
  labAnalysis: LabAnalysisResults;

  // Verification Decision (Tahap 8)
  verificationDecision: VerificationDecision;

  // High-level metadata & timeline
  timestamp: string;
  timeDetail: string;
  badgeClass: string;
  badgeDot: string;
  statusText: string;
  progressLabel: string;
  stepsDone: number;
  isSimulation: boolean;
  steps: BatchStep[];
}

export interface ReportFormData {
  drugName: string;
  ingredient: string;
  dosage: string;
  expiryDate: string;
  expiryUnknown: boolean;
  amount: number;
  unit: string;
  packaging: string;
  wasteSource: string;
  collectionPoint: string;
  additionalNotes: string;
  userConsent: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface CollectionPoint {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  badgeText: string;
  badgeClass: string;
  distanceKm: number;
  durationEst: string;
  address: string;
  schedule: string;
  scheduleNote: string;
  acceptedDrugs: string[];
  capacityStatusText: string;
  capacityPercentage: number;
  capacityQuotaText: string;
  capacityWeightText: string;
  highlights: string[];
  categoryTags: ('all' | 'analgesic' | 'nsaid' | 'solid' | 'liquid')[];
  isOpen: boolean;
  is24h: boolean;
  hasLock: boolean;
  hasColdStorage: boolean;
  isDemo: boolean;
}
