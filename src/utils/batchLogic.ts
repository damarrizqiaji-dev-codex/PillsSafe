import type {
  BatchData,
  CollectionPoint,
  EffluentSample,
  LabAnalysisResults,
  PhysicalIdentificationStatus,
  ReportFormData,
  ResearchRouteId,
  ReactorStatus,
  ValidationResult,
  VerificationDecisionStatus,
} from '../types.ts';

/**
 * Validates the medicine report form with specific, user-friendly error messages.
 */
export function validateReportForm(form: Partial<ReportFormData>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!form.drugName || form.drugName.trim().length === 0) {
    errors.drugName = 'Nama produk obat atau merk dagang wajib diisi.';
  } else if (form.drugName.trim().length < 2) {
    errors.drugName = 'Nama produk minimal 2 karakter.';
  }

  if (!form.ingredient || form.ingredient.trim().length === 0) {
    errors.ingredient = 'Pilih salah satu kategori bahan aktif yang dilaporkan.';
  }

  if (!form.dosage || form.dosage.trim().length === 0) {
    errors.dosage = 'Pilih bentuk sediaan fisik obat.';
  }

  if (!form.expiryUnknown) {
    if (!form.expiryDate || form.expiryDate.trim().length === 0) {
      errors.expiryDate = 'Isi perkiraan tanggal kedaluwarsa atau centang "Tanggal tidak terbaca".';
    }
  }

  if (typeof form.amount !== 'number' || isNaN(form.amount) || form.amount <= 0) {
    errors.amount = 'Perkiraan jumlah harus berupa angka lebih besar dari 0.';
  }

  if (!form.collectionPoint || form.collectionPoint.trim().length === 0) {
    errors.collectionPoint = 'Pilih titik pengumpulan Bio-Drop tujuan rencana penyerahan.';
  }

  if (!form.userConsent) {
    errors.userConsent = 'Pernyataan tanggung jawab dan pemahaman tata kelola wajib disetujui.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Generates a structured unique batch identifier based on active ingredient category.
 */
export function generateBatchCode(ingredient: string, salt: number = Math.floor(100 + Math.random() * 900)): string {
  let prefix = 'SIM-GEN';
  const lower = (ingredient || '').toLowerCase();
  if (lower.includes('parasetamol') || lower.includes('acetaminophen')) {
    prefix = 'SIM-PCT';
  } else if (lower.includes('diklofenak') || lower.includes('diclofenac') || lower.includes('nsaid')) {
    prefix = 'SIM-DCF';
  } else if (lower.includes('belum') || lower.includes('tidak') || lower.includes('campuran')) {
    prefix = 'SIM-UNK';
  } else {
    prefix = 'SIM-OTH';
  }
  return `BATCH-${prefix}-${salt}`;
}

/**
 * Calculates initial estimated biodegradability suitability score for literature preview.
 */
export function getSuitabilityEstimate(ingredient: string): { score: number; label: string; note: string } {
  const lower = (ingredient || '').toLowerCase();
  if (lower.includes('parasetamol')) {
    return {
      score: 94.2,
      label: 'Kandidat Riset Jalur A',
      note: 'Model kajian literatur katabolisme aromatik strain Pseudomonas moorei KB4',
    };
  }
  if (lower.includes('diklofenak')) {
    return {
      score: 81.5,
      label: 'Kandidat Riset Jalur B',
      note: 'Model kajian literatur strain Labrys portucalensis F11; intermediat dipantau ketat',
    };
  }
  if (lower.includes('lain')) {
    return {
      score: 42.0,
      label: 'Perlu Verifikasi Khusus',
      note: 'Bahan aktif di luar fokus kandidat awal; memerlukan uji kompatibilitas faskes',
    };
  }
  return {
    score: 25.0,
    label: 'Menunggu Pemeriksaan',
    note: 'Identitas kimia belum diverifikasi; wajib skrining organoleptik/spektroskopi fisik',
  };
}

/**
 * Creates a new simulated BatchData instance from user report form.
 * Faithfully follows Tahap 1:
 * - Digital registration DOES NOT claim the physical medication has been received.
 * - Confirmed substance is marked "Menunggu Pemeriksaan Fisik".
 * - Research route is unassigned until physical triage.
 */
export function createSimulatedBatchFromReport(form: ReportFormData, code: string): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const routeCandidate: ResearchRouteId = form.ingredient.includes('Parasetamol')
    ? 'PATH-A-PARACETAMOL'
    : form.ingredient.includes('Diklofenak')
    ? 'PATH-B-DICLOFENAC'
    : 'PATH-UNASSIGNED';

  return {
    code,
    reportedSubstance: form.drugName,
    confirmedSubstance: 'Belum Dikonfirmasi (Menunggu Pemeriksaan Fisik)',
    substanceMeta: `Kategori Dilaporkan: ${form.ingredient} | Sediaan: ${form.dosage}`,
    source: form.wasteSource,
    sourceMeta: `Registrasi Mandiri oleh Penyerah (${dateStr})`,
    location: form.collectionPoint.split('(')[0].trim(),
    locationDetail: 'Rencana Serah Terima Mandiri ke Bio-Drop Terdaftar',
    dosage: `${form.dosage} (${form.amount} ${form.unit})`,
    dosageDetail: `Kondisi kemasan: ${form.packaging}`,
    packagingCondition: form.packaging,
    expiryDateInfo: form.expiryUnknown ? 'Tanggal tidak terbaca pada kemasan fisik' : form.expiryDate,

    identificationStatus: 'Menunggu Pemeriksaan',
    sortingNotes: form.additionalNotes || 'Laporan baru dicatat digital. Menunggu fisik obat diserahkan.',
    confirmedByOfficer: 'Belum Ditugaskan',

    researchRoute: routeCandidate,
    pathwayTitle:
      routeCandidate === 'PATH-A-PARACETAMOL'
        ? 'Kandidat Riset Jalur A (Parasetamol)'
        : routeCandidate === 'PATH-B-DICLOFENAC'
        ? 'Kandidat Riset Jalur B (Diklofenak)'
        : 'Menunggu Pemilahan Teknis',
    pathwayDetail: 'Alokasi reaktor definitif ditentukan setelah pemeriksaan fisik oleh petugas penerimaan',
    reactorId: 'Belum Dialokasikan',
    reactorStatus: 'Menunggu Penjadwalan',
    holdingTankId: 'Belum Dialokasikan',
    holdingTankStatus: 'Kosong',

    sample: {
      sampleId: `SMP-PLN-${code.replace('BATCH-', '')}`,
      batchId: code,
      routeId: routeCandidate,
      reactorOrigin: 'Belum Terhubung',
      tankOrigin: 'Belum Terhubung',
      samplingTimestamp: 'Belum Diambil',
      samplerName: 'Belum Ditugaskan',
      plannedTests: 'Senyawa Induk, Produk Transformasi, dan Uji Toksisitas (Direncanakan)',
      status: 'Belum Diambil',
      storageNotes: 'Menunggu siklus reaktor',
    },

    labAnalysis: {
      hasResults: false,
      parentCompoundName: form.ingredient.includes('Parasetamol') ? 'Parasetamol' : 'Kandidat Bahan Aktif',
      parentCompoundValue: 'Belum ada hasil analisis',
      parentCompoundMethod: 'HPLC-UV / Menunggu Uji',
      parentCompoundStatus: 'Pending',
      lodLoq: 'Menunggu data laboratorium',

      transformationProductsName: form.ingredient.includes('Parasetamol') ? '4-Aminophenol (4-AP)' : 'Metabolit Transformasi',
      transformationProductsValue: 'Belum ada hasil analisis',
      transformationProductsMethod: 'LC-MS/MS / Menunggu Uji',
      transformationProductsStatus: 'Pending',

      toxicityBioassayName: 'Uji Toksisitas Perairan (Bioassay)',
      toxicityBioassayValue: 'Belum ada hasil analisis',
      toxicityBioassayMethod: 'Bioassay Daphnia magna 48-jam',
      toxicityBioassayStatus: 'Pending',

      testingDate: 'Belum Dilakukan',
      labName: 'Menunggu Pengiriman Sampel',
      analystName: 'Belum Ditugaskan',
      rawNotes: 'Belum ada data pengujian laboratorium aktual untuk batch ini.',
    },

    verificationDecision: {
      decision: 'DATA BELUM CUKUP',
      criteriaReference: 'SOP Verifikasi Efluen PillsSafe Rev.2 (Tri-Parameter Compliance)',
      summaryReason: 'Obat baru terdaftar digital; pengumpulan fisik, proses reaktor, dan uji laboratorium belum terlaksana.',
      evidenceReference: 'Menunggu Pelaksanaan Uji Laboratorium',
      decisionDate: `${dateStr}`,
      decisionOfficer: 'Sistem Pencatatan Otomatis (Inisialisasi)',
      followUpActions: 'Penyerahan fisik di dropbox oleh pelapor sesuai lokasi terpilih.',
    },

    timestamp: dateStr,
    timeDetail: `${timeStr} (Pencatatan Mandiri)`,
    badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
    badgeDot: 'bg-amber-500 animate-pulse',
    statusText: 'MENUNGGU PENYERAHAN FISIK & PEMERIKSAAN',
    progressLabel: '1 dari 8 Tahap Selesai (Laporan Digital Terdaftar)',
    stepsDone: 1,
    isSimulation: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Registrasi & Pelaporan Digital',
        date: `${dateStr}, ${timeStr}`,
        actor: 'Pelapor Publik (Mandiri)',
        description: `Laporan mandiri dicatat untuk obat "${form.drugName}". ID batch ${code} diterbitkan. Perhatian: Obat belum diterima secara fisik.`,
        statusLabel: 'Terdaftar Digital',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 2,
        title: 'Pengumpulan & Pemeriksaan Fisik',
        date: 'Menunggu Penyerahan Fisik',
        actor: `Petugas Bio-Drop (${form.collectionPoint.split('(')[0].trim()})`,
        description: 'Penyerahan fisik di titik pengumpulan resmi, pengecekan segel wadah sekunder, dan pencatatan penerimaan fisik.',
        statusLabel: 'Menunggu Penyerahan',
        statusType: 'in-progress',
        isCompleted: false,
      },
      {
        stepNumber: 3,
        title: 'Identifikasi Produk & Pemilahan',
        date: 'Menunggu Pemeriksaan',
        actor: 'Petugas Penerimaan Faskes',
        description: 'Pemeriksaan identitas produk fisik vs data laporan, pengecekan bentuk sediaan, integritas kemasan, dan pemilahan status.',
        statusLabel: 'Menunggu Pemeriksaan',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 4,
        title: 'Penetapan Jalur Riset & Alokasi Reaktor',
        date: 'Menunggu Hasil Pemilahan',
        actor: 'Pengelola Proses Bioreaktor',
        description: 'Penetapan jalur penelitian terpisah (Jalur A: Reaktor A vs Jalur B: Reaktor B) dan penjadwalan siklus.',
        statusLabel: 'Belum Dialokasikan',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 5,
        title: 'Proses Biodegradasi Reaktor & Penampungan',
        date: 'Menunggu Alokasi',
        actor: 'Pengelola Proses Bioreaktor',
        description: 'Pencatatan siklus biodegradasi biologis dalam reaktor terpisah dan pengaliran ke tangki penampung pascaproses (Holding Tank A atau B).',
        statusLabel: 'Belum Dimulai',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 6,
        title: 'Registrasi & Pengambilan Sampel Efluen',
        date: 'Menunggu Siklus Selesai',
        actor: 'Petugas Pengambil Sampel',
        description: 'Pengambilan sampel efluen aseptis dari tangki penampung dan penerbitan ID sampel unik.',
        statusLabel: 'Belum Diambil',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 7,
        title: 'Pencatatan Hasil Analisis Efluen',
        date: 'Menunggu Sampel Laboratorium',
        actor: 'Verifikator Laboratorium',
        description: 'Pencatatan hasil uji analitik tri-parameter: senyawa induk, produk transformasi, dan bioassay toksisitas.',
        statusLabel: 'Belum Ada Hasil Analisis',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 8,
        title: 'Keputusan Verifikasi Keselamatan Efluen',
        date: 'Menunggu Hasil Uji',
        actor: 'Verifikator / Penanggung Jawab Teknis',
        description: 'Penetapan status keputusan verifikasi resmi: Memenuhi Kriteria, Tidak Memenuhi Kriteria, atau Data Belum Cukup.',
        statusLabel: 'Data Belum Cukup',
        statusType: 'pending',
        isCompleted: false,
      },
    ],
  };
}

/**
 * Updates batch state when Physical Acceptance & Sorting is performed (Tahap 2).
 */
export function confirmPhysicalReceipt(
  batch: BatchData,
  confirmedDrug: string,
  identificationStatus: PhysicalIdentificationStatus,
  officerName: string,
  notes: string
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 2) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: officerName,
        statusLabel: 'Fisik Diterima & Tercatat',
        statusType: 'verified' as const,
        isCompleted: true,
      };
    }
    if (step.stepNumber === 3) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: officerName,
        statusLabel: identificationStatus,
        statusType:
          identificationStatus === 'Diterima untuk Jalur Penanganan'
            ? ('verified' as const)
            : identificationStatus === 'Dikarantina atau Ditolak'
            ? ('caution' as const)
            : ('in-progress' as const),
        description: `Pemeriksaan fisik oleh ${officerName}. Identitas terkonfirmasi: ${confirmedDrug}. Catatan pemilahan: ${notes}`,
        isCompleted: identificationStatus === 'Diterima untuk Jalur Penanganan',
      };
    }
    return step;
  });

  return {
    ...batch,
    confirmedSubstance: confirmedDrug,
    identificationStatus,
    sortingNotes: notes,
    confirmedByOfficer: officerName,
    stepsDone: Math.max(batch.stepsDone, identificationStatus === 'Diterima untuk Jalur Penanganan' ? 3 : 2),
    statusText:
      identificationStatus === 'Diterima untuk Jalur Penanganan'
        ? 'LOLOS IDENTIFIKASI — SIAP ALOKASI REAKTOR'
        : identificationStatus === 'Dikarantina atau Ditolak'
        ? 'DIKARANTINA / DITOLAK UNTUK JALUR BIOLOGIS'
        : 'MEMERLUKAN VERIFIKASI TAMBAHAN',
    badgeClass:
      identificationStatus === 'Diterima untuk Jalur Penanganan'
        ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
        : identificationStatus === 'Dikarantina atau Ditolak'
        ? 'bg-rose-100 text-rose-900 border border-rose-300'
        : 'bg-amber-100 text-amber-900 border border-amber-300',
    steps: updatedSteps,
  };
}

/**
 * Assigns research route and sets up strict Reactor & Holding Tank linkage (Tahap 4 & 5).
 */
export function assignResearchRoute(
  batch: BatchData,
  route: ResearchRouteId,
  officerName: string
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const isPathA = route === 'PATH-A-PARACETAMOL';
  const isPathB = route === 'PATH-B-DICLOFENAC';

  const reactorId = isPathA ? 'Reaktor Riset A (P. moorei KB4)' : isPathB ? 'Reaktor Riset B (L. portucalensis F11)' : 'Unit Khusus';
  const holdingTankId = isPathA ? 'Holding Tank A (Post-Process A)' : isPathB ? 'Holding Tank B (Post-Process B)' : 'Holding Tank Khusus';
  const pathwayTitle = isPathA ? 'Jalur Riset A — Parasetamol (Kajian Literatur)' : isPathB ? 'Jalur Riset B — Diklofenak (Kajian Literatur)' : 'Jalur Khusus / Penanganan Non-Biologis';

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 4) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: officerName,
        statusLabel: `Teralokasi ke ${reactorId}`,
        statusType: 'verified' as const,
        description: `Batch resmi dialokasikan ke ${pathwayTitle}. Jalur fisik reaktor dan tangki penampung dipisahkan secara ketat.`,
        isCompleted: true,
      };
    }
    if (step.stepNumber === 5) {
      return {
        ...step,
        statusLabel: 'Menunggu Proses Berlangsung',
        statusType: 'in-progress' as const,
      };
    }
    return step;
  });

  return {
    ...batch,
    researchRoute: route,
    pathwayTitle,
    reactorId,
    reactorStatus: 'Menunggu Proses',
    holdingTankId,
    holdingTankStatus: 'Menampung Efluen Pascaproses',
    stepsDone: Math.max(batch.stepsDone, 4),
    statusText: `TERALOKASI KE ${reactorId.toUpperCase()}`,
    steps: updatedSteps,
  };
}

/**
 * Updates reactor operation status (Tahap 5).
 */
export function updateReactorStatus(
  batch: BatchData,
  reactorStatus: ReactorStatus,
  officerName: string,
  notes?: string
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const isFinished = reactorStatus === 'Proses Tercatat Selesai';

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 5) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: officerName,
        statusLabel: reactorStatus,
        statusType: isFinished ? ('verified' as const) : ('in-progress' as const),
        description: `Status operasional reaktor: ${reactorStatus}. ${notes || 'Kondisi aerasi & suhu dicatat telemetri.'}`,
        isCompleted: isFinished,
      };
    }
    if (step.stepNumber === 6 && isFinished) {
      return {
        ...step,
        statusLabel: 'Siap Pengambilan Sampel',
        statusType: 'in-progress' as const,
      };
    }
    return step;
  });

  return {
    ...batch,
    reactorStatus,
    holdingTankStatus: isFinished ? 'Menunggu Verifikasi Laboratorium' : 'Menampung Efluen Pascaproses',
    stepsDone: Math.max(batch.stepsDone, isFinished ? 5 : 4),
    statusText: `REAKTOR: ${reactorStatus.toUpperCase()}`,
    steps: updatedSteps,
  };
}

/**
 * Registers an effluent sample strictly tied to batch, route, reactor, and tank (Tahap 6).
 */
export function registerEffluentSample(
  batch: BatchData,
  sampleId: string,
  samplerName: string,
  plannedTests: string
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const newSample: EffluentSample = {
    sampleId,
    batchId: batch.code,
    routeId: batch.researchRoute,
    reactorOrigin: batch.reactorId,
    tankOrigin: batch.holdingTankId,
    samplingTimestamp: `${dateStr}, ${timeStr}`,
    samplerName,
    plannedTests,
    status: 'Telah Diambil',
    storageNotes: 'Pengambilan aseptis, rantai dingin 4°C terjaga',
  };

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 6) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: samplerName,
        statusLabel: `Sampel ${sampleId} Telah Diambil`,
        statusType: 'verified' as const,
        description: `Sampel diambil dari ${batch.holdingTankId}. Rencana uji: ${plannedTests}. Rantai dingin 4°C.`,
        isCompleted: true,
      };
    }
    if (step.stepNumber === 7) {
      return {
        ...step,
        statusLabel: 'Menunggu Hasil Uji Laboratorium',
        statusType: 'in-progress' as const,
      };
    }
    return step;
  });

  return {
    ...batch,
    sample: newSample,
    stepsDone: Math.max(batch.stepsDone, 6),
    statusText: `SAMPEL ${sampleId} DALAM PENANGANAN LAB`,
    steps: updatedSteps,
  };
}

/**
 * Records laboratory analytical results (Tahap 7).
 */
export function submitLabAnalysis(
  batch: BatchData,
  analysisData: Partial<LabAnalysisResults>
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const mergedLab: LabAnalysisResults = {
    ...batch.labAnalysis,
    ...analysisData,
    hasResults: true,
    testingDate: analysisData.testingDate || `${dateStr}, ${timeStr}`,
  };

  const sampleUpdated: EffluentSample = {
    ...batch.sample,
    status: 'Hasil Tersedia',
  };

  const allConforming =
    mergedLab.parentCompoundStatus === 'Conforming' &&
    mergedLab.transformationProductsStatus === 'Conforming' &&
    mergedLab.toxicityBioassayStatus === 'Conforming';

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 7) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: mergedLab.analystName || 'Analis Laboratorium',
        statusLabel: allConforming ? 'Hasil Uji Lengkap (Sesuai Kriteria)' : 'Hasil Uji Tersedia (Ada Deviasi)',
        statusType: allConforming ? ('verified' as const) : ('caution' as const),
        description: `Hasil analisis: ${mergedLab.parentCompoundName} (${mergedLab.parentCompoundValue}), ${mergedLab.transformationProductsName} (${mergedLab.transformationProductsValue}), dan Bioassay (${mergedLab.toxicityBioassayValue}).`,
        isCompleted: true,
      };
    }
    if (step.stepNumber === 8) {
      return {
        ...step,
        statusLabel: 'Siap Keputusan Verifikasi',
        statusType: 'in-progress' as const,
      };
    }
    return step;
  });

  return {
    ...batch,
    sample: sampleUpdated,
    labAnalysis: mergedLab,
    stepsDone: Math.max(batch.stepsDone, 7),
    statusText: 'HASIL ANALISIS LAB TERSEDIA — SIAP VERIFIKASI',
    steps: updatedSteps,
  };
}

/**
 * Sets the final verification decision with 3 official statuses (Tahap 8).
 */
export function setVerificationDecision(
  batch: BatchData,
  decision: VerificationDecisionStatus,
  criteriaReference: string,
  summaryReason: string,
  decisionOfficer: string,
  followUpActions: string
): BatchData {
  const dateNow = new Date();
  const dateStr = dateNow.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateNow.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

  const isVerified = decision === 'MEMENUHI KRITERIA VERIFIKASI';
  const isFailed = decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI';

  const updatedSteps = batch.steps.map((step) => {
    if (step.stepNumber === 8) {
      return {
        ...step,
        date: `${dateStr}, ${timeStr}`,
        actor: decisionOfficer,
        statusLabel: `Keputusan: ${decision}`,
        statusType: isVerified ? ('verified' as const) : isFailed ? ('caution' as const) : ('in-progress' as const),
        description: `Berdasarkan ${criteriaReference}: ${summaryReason}. Tindak lanjut: ${followUpActions}.`,
        isCompleted: isVerified || isFailed,
      };
    }
    return step;
  });

  return {
    ...batch,
    verificationDecision: {
      decision,
      criteriaReference,
      summaryReason,
      evidenceReference: batch.sample.sampleId ? `Sampel ${batch.sample.sampleId}` : 'Dokumentasi Audit Lab',
      decisionDate: `${dateStr}, ${timeStr}`,
      decisionOfficer,
      followUpActions,
    },
    holdingTankStatus: isVerified
      ? 'Verifikasi Selesai - Arsip'
      : isFailed
      ? 'Verifikasi Gagal - Tertahan'
      : 'Menunggu Verifikasi Laboratorium',
    stepsDone: isVerified ? 8 : isFailed ? 8 : 7,
    statusText: `KEPUTUSAN: ${decision}`,
    badgeClass: isVerified
      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
      : isFailed
      ? 'bg-rose-100 text-rose-900 border border-rose-300'
      : 'bg-amber-100 text-amber-900 border border-amber-300',
    badgeDot: isVerified ? 'bg-emerald-600' : isFailed ? 'bg-rose-600' : 'bg-amber-500 animate-pulse',
    steps: updatedSteps,
  };
}

/**
 * Filter collection points by query, category, and operational status.
 */
export function filterCollectionPoints(
  points: CollectionPoint[],
  query: string,
  category: string,
  status: string
): CollectionPoint[] {
  const q = query.trim().toLowerCase();

  return points.filter((pt) => {
    if (q) {
      const matchName = pt.name.toLowerCase().includes(q);
      const matchAddress = pt.address.toLowerCase().includes(q);
      const matchSubtitle = pt.subtitle.toLowerCase().includes(q);
      const matchDrugs = pt.acceptedDrugs.some((d) => d.toLowerCase().includes(q));
      if (!matchName && !matchAddress && !matchSubtitle && !matchDrugs) {
        return false;
      }
    }

    if (category !== 'all') {
      if (!pt.categoryTags.includes(category as any)) {
        return false;
      }
    }

    if (status !== 'all') {
      if (status === 'open' && !pt.isOpen) return false;
      if (status === '24h' && !pt.is24h) return false;
      if (status === 'lock' && !pt.hasLock) return false;
      if (status === 'quota' && pt.capacityPercentage > 70) return false;
    }

    return true;
  });
}

/**
 * Calculates comprehensive real-time dashboard metrics across all batches.
 */
export function computeDashboardMetrics(batches: Record<string, BatchData>) {
  const list = Object.values(batches);
  const total = list.length;

  let awaitingInspection = 0;
  let acceptedForProcessing = 0;
  let quarantinedOrRejected = 0;

  let routePathA = 0;
  let routePathB = 0;
  let routeUnassigned = 0;

  let reactorInProgress = 0;
  let reactorFinished = 0;

  let samplesAwaitingAnalysis = 0;
  let labResultsAvailable = 0;

  let decisionMet = 0;
  let decisionNotMet = 0;
  let decisionInsufficient = 0;

  for (const b of list) {
    if (b.identificationStatus === 'Menunggu Pemeriksaan' || b.identificationStatus === 'Memerlukan Verifikasi Tambahan') {
      awaitingInspection++;
    } else if (b.identificationStatus === 'Diterima untuk Jalur Penanganan') {
      acceptedForProcessing++;
    } else if (b.identificationStatus === 'Dikarantina atau Ditolak') {
      quarantinedOrRejected++;
    }

    if (b.researchRoute === 'PATH-A-PARACETAMOL') routePathA++;
    else if (b.researchRoute === 'PATH-B-DICLOFENAC') routePathB++;
    else routeUnassigned++;

    if (b.reactorStatus === 'Proses Tercatat Berlangsung') reactorInProgress++;
    if (b.reactorStatus === 'Proses Tercatat Selesai') reactorFinished++;

    if (b.sample.status === 'Menunggu Analisis' || b.sample.status === 'Analisis Sedang Dilakukan') {
      samplesAwaitingAnalysis++;
    }
    if (b.labAnalysis.hasResults) {
      labResultsAvailable++;
    }

    if (b.verificationDecision.decision === 'MEMENUHI KRITERIA VERIFIKASI') decisionMet++;
    else if (b.verificationDecision.decision === 'TIDAK MEMENUHI KRITERIA VERIFIKASI') decisionNotMet++;
    else decisionInsufficient++;
  }

  return {
    total,
    awaitingInspection,
    acceptedForProcessing,
    quarantinedOrRejected,
    routePathA,
    routePathB,
    routeUnassigned,
    reactorInProgress,
    reactorFinished,
    samplesAwaitingAnalysis,
    labResultsAvailable,
    decisionMet,
    decisionNotMet,
    decisionInsufficient,
  };
}

/**
 * Initial four representative simulation batches.
 * Fully compliant with master prompt:
 * - BATCH-SIM-0941: Path A (Paracetamol), Reactor A, Holding Tank A, Sample A, Complete Lab, "MEMENUHI KRITERIA VERIFIKASI"
 * - BATCH-SIM-0942: Path B (Diclofenac), Reactor B, Holding Tank B, Sample B, "DATA BELUM CUKUP" (Under testing)
 * - BATCH-SIM-0943: Multi-component mixture, Quarantined / Secondary triage, "TIDAK MEMENUHI KRITERIA VERIFIKASI" (Ditolak jalur biologis)
 * - BATCH-SIM-0944: Ibuprofen Liquid, Newly registered, "Menunggu Pemeriksaan Fisik", "DATA BELUM CUKUP"
 */
export const INITIAL_BATCHES: Record<string, BatchData> = {
  'BATCH-SIM-0941': {
    code: 'BATCH-SIM-0941',
    reportedSubstance: 'Parasetamol (Acetaminophen)',
    confirmedSubstance: 'Parasetamol 500mg (Dikonfirmasi Petugas)',
    substanceMeta: 'CAS Registry: 103-90-2 | Formulasi Analgesik-Antipiretik (Data Demonstrasi)',
    source: 'Rumah Tangga Mandiri',
    sourceMeta: 'Nomor Registrasi Publik Simulasi: #PS-8821',
    location: 'Bio-Drop Puskesmas Sukamaju',
    locationDetail: 'Puskesmas Sukamaju Zona B-4 (Lokasi Contoh Demonstrasi)',
    dosage: 'Tablet 500mg',
    dosageDetail: '18 Butir dlm Blister Utuh',
    packagingCondition: 'Blister aluminium primer utuh, tidak rusak',
    expiryDateInfo: 'Sep 2024 (Kedaluwarsa tercatat produsen)',

    identificationStatus: 'Diterima untuk Jalur Penanganan',
    sortingNotes: 'Kondisi kemasan blister primer utuh; sediaan padat homogen sesuai label produsen.',
    confirmedByOfficer: 'Apt. Suryani, S.Farm (Petugas Penerimaan)',

    researchRoute: 'PATH-A-PARACETAMOL',
    pathwayTitle: 'Jalur Riset A — Parasetamol (Kajian Literatur)',
    pathwayDetail: 'Kajian pemodelan biologis strain Pseudomonas moorei KB4',
    reactorId: 'Reaktor Riset A (P. moorei KB4)',
    reactorStatus: 'Proses Tercatat Selesai',
    holdingTankId: 'Holding Tank A (Post-Process A)',
    holdingTankStatus: 'Verifikasi Selesai - Arsip',

    sample: {
      sampleId: 'SMP-EF-0941-A',
      batchId: 'BATCH-SIM-0941',
      routeId: 'PATH-A-PARACETAMOL',
      reactorOrigin: 'Reaktor Riset A (P. moorei KB4)',
      tankOrigin: 'Holding Tank A (Post-Process A)',
      samplingTimestamp: '18 Okt 2024, 16:00 WIB',
      samplerName: 'Budi Santoso, A.Md.AK (Petugas Sampling)',
      plannedTests: 'Senyawa Induk (HPLC), Produk Transformasi 4-AP (LC-MS/MS), Toksisitas (D. magna)',
      status: 'Hasil Tersedia',
      storageNotes: 'Pengambilan aseptis pada outlet katup Holding Tank A; rantai dingin 3.8°C.',
    },

    labAnalysis: {
      hasResults: true,
      parentCompoundName: 'Parasetamol (Senyawa Induk)',
      parentCompoundValue: '< LOQ (0.010 mg/L)',
      parentCompoundMethod: 'HPLC-UV (Fase Terbalik C18, Deteksi 243 nm)',
      parentCompoundStatus: 'Conforming',
      lodLoq: 'LOD: 0.003 mg/L | LOQ: 0.010 mg/L',

      transformationProductsName: '4-Aminophenol (4-AP) & Intermediat Aromatik',
      transformationProductsValue: 'Non-Terdeteksi (< LOD 0.005 mg/L)',
      transformationProductsMethod: 'LC-MS/MS (ESI Positif, MRM Mode)',
      transformationProductsStatus: 'Conforming',

      toxicityBioassayName: 'Bioassay Daphnia magna (Uji Akut 48 Jam)',
      toxicityBioassayValue: 'Mortalitas 0% (Tidak Toksik Signifikan)',
      toxicityBioassayMethod: 'OECD Guideline 202 (Kultur Terakreditasi)',
      toxicityBioassayStatus: 'Conforming',

      testingDate: '20 Okt 2024, 14:30 WIB',
      labName: 'Lab Farmakologi Lingkungan Terpadu (Simulasi)',
      analystName: 'Dr. Hendra Wibowo, M.Si (Analis Laboratorium)',
      rawNotes: 'Seluruh parameter memenuhi kriteria batas deteksi literatur; tidak ada akumulasi metabolit aromatik beracun.',
    },

    verificationDecision: {
      decision: 'MEMENUHI KRITERIA VERIFIKASI',
      criteriaReference: 'SOP Verifikasi Efluen PillsSafe Rev.2 (Tri-Parameter Tri-Fold Verification)',
      summaryReason:
        'Senyawa induk terurai di bawah batas kuantifikasi HPLC (< 0.010 mg/L), produk transformasi 4-AP non-terdeteksi, dan bioassay Daphnia magna 48 jam menunjukkan mortalitas 0%.',
      evidenceReference: 'Sertifikat Analisis: CoA-SIM-EF-0941-REV0',
      decisionDate: '21 Okt 2024, 11:00 WIB',
      decisionOfficer: 'Prof. Dr. apt. Rachmat H., Sp.FRS (Verifikator Laboratorium)',
      followUpActions: 'Material pada Holding Tank A dapat dialihkan ke desinfeksi akhir efluen non-toksik.',
    },

    timestamp: '12 Okt 2024',
    timeDetail: '09:30 WIB',
    badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
    badgeDot: 'bg-emerald-600',
    statusText: 'MEMENUHI KRITERIA VERIFIKASI (SIMULASI TUNTAS)',
    progressLabel: '8 dari 8 Tahap Tuntas (Skenario Ideal Demonstrasi)',
    stepsDone: 8,
    isSimulation: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Registrasi & Pelaporan Digital',
        date: '12 Okt 2024, 09:30 WIB',
        actor: 'Pelapor Publik (Mandiri)',
        description: 'Laporan registrasi batch dicatat mandiri melalui portal publik PillsSafe. Kode spesimen digital diterbitkan.',
        statusLabel: 'Terdaftar Digital',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 2,
        title: 'Pengumpulan & Pemeriksaan Fisik',
        date: '13 Okt 2024, 14:15 WIB',
        actor: 'Petugas Bio-Drop (Puskesmas Sukamaju)',
        description: 'Diterima di loket Bio-Drop resmi. Segel wadah sekunder diverifikasi dan dicatat dalam logbook serah terima.',
        statusLabel: 'Fisik Diterima & Terverifikasi',
        statusType: 'verified',
        metaInfo: 'Log ID: BD-SKM-884',
        isCompleted: true,
      },
      {
        stepNumber: 3,
        title: 'Identifikasi Produk & Pemilahan',
        date: '14 Okt 2024, 10:00 WIB',
        actor: 'Apt. Suryani, S.Farm (Petugas Penerimaan)',
        description: 'Pemeriksaan organoleptik blister utuh, verifikasi tanggal kedaluwarsa produsen (Sep 2024), kesesuaian sediaan analgesik padat.',
        statusLabel: 'Diterima untuk Jalur Penanganan',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 4,
        title: 'Penetapan Jalur Riset & Alokasi Reaktor',
        date: '15 Okt 2024, 08:30 WIB',
        actor: 'Ir. Agus Pratama (Pengelola Proses)',
        description: 'Spesimen batch dialokasikan secara eksklusif ke Reaktor Riset A (Jalur A - Parasetamol). Reaktor terpisah dari Jalur B.',
        statusLabel: 'Alokasi: Reaktor Riset A // Chamber 02',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 5,
        title: 'Proses Biodegradasi Reaktor & Penampungan',
        date: '15–18 Okt 2024 (Siklus 72 Jam)',
        actor: 'Ir. Agus Pratama (Pengelola Proses)',
        description: 'Proses aerasi reaktor selesai 72 jam. Hasil dialirkan ke Holding Tank A. DO > 4.2 mg/L, pH 7.1 ± 0.2, suhu 28.4°C.',
        statusLabel: 'Proses Tercatat Selesai -> Holding Tank A',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 6,
        title: 'Registrasi & Pengambilan Sampel Efluen',
        date: '18 Okt 2024, 16:00 WIB',
        actor: 'Budi Santoso, A.Md.AK (Petugas Sampling)',
        description: 'Pengambilan sampel aseptis pada outlet Holding Tank A. Diterbitkan ID Sampel: SMP-EF-0941-A dengan rantai dingin (3.8°C).',
        statusLabel: 'Sampel SMP-EF-0941-A Telah Diambil',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 7,
        title: 'Pencatatan Hasil Analisis Efluen',
        date: '19–20 Okt 2024',
        actor: 'Dr. Hendra Wibowo, M.Si (Analis Laboratorium)',
        description: 'Pengujian tri-parameter tuntas: HPLC senyawa induk < LOQ (0.010 mg/L), metabolit 4-AP non-terdeteksi, bioassay D. magna mortalitas 0%.',
        statusLabel: 'Seluruh Parameter Memenuhi Batas Acuan',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 8,
        title: 'Keputusan Verifikasi Keselamatan Efluen',
        date: '21 Okt 2024, 11:00 WIB',
        actor: 'Prof. Dr. apt. Rachmat H., Sp.FRS (Verifikator)',
        description: 'Berdasarkan bukti laboratorium CoA-SIM-EF-0941-REV0, material dinyatakan MEMENUHI KRITERIA VERIFIKASI.',
        statusLabel: 'KEPUTUSAN: MEMENUHI KRITERIA VERIFIKASI',
        statusType: 'verified',
        metaInfo: 'SK-VAL-2024-0941',
        isCompleted: true,
      },
    ],
  },

  'BATCH-SIM-0942': {
    code: 'BATCH-SIM-0942',
    reportedSubstance: 'Diklofenak Natrium (NSAID)',
    confirmedSubstance: 'Diklofenak Natrium 50mg (Dikonfirmasi Petugas)',
    substanceMeta: 'CAS Registry: 15307-79-6 | Anti-inflamasi Non-Steroid (Data Demonstrasi)',
    source: 'Klinik Pratama Sehat (Faskes)',
    sourceMeta: 'Nomor Registrasi Faskes Simulasi: #FK-3102',
    location: 'Bio-Drop Farmasi RSUD Peduli Sehat',
    locationDetail: 'Loket Farmasi Rawat Jalan (Contoh Demonstrasi)',
    dosage: 'Tablet Enterik 50mg',
    dosageDetail: '30 Tablet dlm Strip',
    packagingCondition: 'Strip utuh, tersegel foil pabrik',
    expiryDateInfo: 'Agu 2024 (Kedaluwarsa tercatat)',

    identificationStatus: 'Diterima untuk Jalur Penanganan',
    sortingNotes: 'Strip salut enterik utuh, identifikasi kimia faskes terkonfirmasi.',
    confirmedByOfficer: 'Apt. Dewi Lestari, S.Farm',

    researchRoute: 'PATH-B-DICLOFENAC',
    pathwayTitle: 'Jalur Riset B — Diklofenak (Kajian Literatur)',
    pathwayDetail: 'Kajian pemodelan biodegradasi strain Labrys portucalensis F11',
    reactorId: 'Reaktor Riset B (L. portucalensis F11)',
    reactorStatus: 'Proses Tercatat Selesai',
    holdingTankId: 'Holding Tank B (Post-Process B)',
    holdingTankStatus: 'Menunggu Verifikasi Laboratorium',

    sample: {
      sampleId: 'SMP-EF-0942-B',
      batchId: 'BATCH-SIM-0942',
      routeId: 'PATH-B-DICLOFENAC',
      reactorOrigin: 'Reaktor Riset B (L. portucalensis F11)',
      tankOrigin: 'Holding Tank B (Post-Process B)',
      samplingTimestamp: '21 Okt 2024, 09:30 WIB',
      samplerName: 'Rian Hidayat, S.Si',
      plannedTests: 'LC-MS/MS Metabolit Terklorinasi, Bioassay Daphnia magna 48-jam',
      status: 'Menunggu Analisis',
      storageNotes: 'Disimpan di lemari pendingin sampel lab -20°C',
    },

    labAnalysis: {
      hasResults: false,
      parentCompoundName: 'Diklofenak Natrium',
      parentCompoundValue: 'Belum ada hasil analisis (Sedang Antrean Uji)',
      parentCompoundMethod: 'LC-MS/MS / Dalam Proses',
      parentCompoundStatus: 'Pending',
      lodLoq: 'LOD estimasi: 0.005 mg/L | LOQ estimasi: 0.020 mg/L',

      transformationProductsName: 'Intermediat Hidroksilasi & Senyawa Terklorinasi',
      transformationProductsValue: 'Belum ada hasil analisis',
      transformationProductsMethod: 'High-Resolution Mass Spectrometry (HRMS)',
      transformationProductsStatus: 'Pending',

      toxicityBioassayName: 'Uji Toksisitas Akut Daphnia magna',
      toxicityBioassayValue: 'Belum ada hasil analisis (Inkubasi Sedang Berjalan)',
      toxicityBioassayMethod: 'OECD Guideline 202',
      toxicityBioassayStatus: 'Pending',

      testingDate: 'Dijadwalkan Hari Ini',
      labName: 'Lab Toksikologi Lingkungan Pusat',
      analystName: 'Menunggu Verifikator',
      rawNotes: 'Sampel sedang dalam proses ekstraksi fase padat (SPE); hasil kuantitatif belum diterbitkan.',
    },

    verificationDecision: {
      decision: 'DATA BELUM CUKUP',
      criteriaReference: 'SOP Verifikasi Efluen PillsSafe Rev.2 (Persyaratan Data Tri-Parameter)',
      summaryReason:
        'Proses pada Reaktor B telah selesai dan efluen ditampung di Holding Tank B, namun hasil analisis instrumental senyawa induk dan bioassay toksisitas belum selesai.',
      evidenceReference: 'Tiket Lab: LAB-TKT-0942 (In Progress)',
      decisionDate: '21 Okt 2024',
      decisionOfficer: 'Sistem Verifikasi Laboratorium PillsSafe',
      followUpActions: 'Menunggu penginputan hasil LC-MS/MS dan bioassay oleh verifikator laboratorium.',
    },

    timestamp: '17 Okt 2024',
    timeDetail: '11:15 WIB',
    badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
    badgeDot: 'bg-amber-600 animate-pulse',
    statusText: 'HOLDING TANK B — MENUNGGU HASIL ANALISIS LAB',
    progressLabel: '6 dari 8 Tahap — Sampel Terdaftar di Lab',
    stepsDone: 6,
    isSimulation: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Registrasi & Pelaporan Digital',
        date: '17 Okt 2024, 11:15 WIB',
        actor: 'Petugas Faskes Mitra',
        description: 'Laporan registrasi batch diklofenak didaftarkan.',
        statusLabel: 'Terdaftar Digital',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 2,
        title: 'Pengumpulan & Pemeriksaan Fisik',
        date: '17 Okt 2024, 15:30 WIB',
        actor: 'Petugas Bio-Drop RSUD Peduli Sehat',
        description: 'Diterima dalam kontainer bersegel khusus.',
        statusLabel: 'Fisik Diterima & Terverifikasi',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 3,
        title: 'Identifikasi Produk & Pemilahan',
        date: '18 Okt 2024, 09:00 WIB',
        actor: 'Apt. Dewi Lestari, S.Farm',
        description: 'Pemeriksaan integritas strip enterik dan verifikasi beban aktif 50mg.',
        statusLabel: 'Diterima untuk Jalur Penanganan',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 4,
        title: 'Penetapan Jalur Riset & Alokasi Reaktor',
        date: '18 Okt 2024, 14:00 WIB',
        actor: 'Ir. Agus Pratama (Pengelola Proses)',
        description: 'Dialokasikan secara terpisah ke Reaktor Riset B (Jalur B - Diklofenak).',
        statusLabel: 'Alokasi: Reaktor Riset B',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 5,
        title: 'Proses Biodegradasi Reaktor & Penampungan',
        date: '18–21 Okt 2024 (Siklus 96 Jam)',
        actor: 'Ir. Agus Pratama (Pengelola Proses)',
        description: 'Siklus reaktor selesai dicatat. Efluen dialirkan ke Holding Tank B terpisah.',
        statusLabel: 'Siklus Selesai -> Holding Tank B',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 6,
        title: 'Registrasi & Pengambilan Sampel Efluen',
        date: '21 Okt 2024, 09:30 WIB',
        actor: 'Rian Hidayat, S.Si',
        description: 'Sampel efluen SMP-EF-0942-B diambil dari Holding Tank B dan dikirim ke lab.',
        statusLabel: 'Sampel SMP-EF-0942-B Terdaftar',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 7,
        title: 'Pencatatan Hasil Analisis Efluen',
        date: 'Sedang Berjalan',
        actor: 'Verifikator Laboratorium',
        description: 'Analisis instrumental dan bioassay toksisitas sedang dalam proses.',
        statusLabel: 'Belum Ada Hasil Analisis',
        statusType: 'in-progress',
        isCompleted: false,
      },
      {
        stepNumber: 8,
        title: 'Keputusan Verifikasi Keselamatan Efluen',
        date: 'Menunggu Hasil Uji',
        actor: 'Verifikator Laboratorium',
        description: 'Keputusan verifikasi belum dapat dibuat sebelum data analitis lengkap tersedia.',
        statusLabel: 'DATA BELUM CUKUP',
        statusType: 'pending',
        isCompleted: false,
      },
    ],
  },

  'BATCH-SIM-0943': {
    code: 'BATCH-SIM-0943',
    reportedSubstance: 'Kandidat Campuran Multi-Komponen',
    confirmedSubstance: 'Sediaan Campuran Tanpa Label Jelas + Sirup Terbuka',
    substanceMeta: 'Sediaan Campuran Batuk-Pilek (Data Demonstrasi)',
    source: 'Apotek Mandiri Sukses',
    sourceMeta: 'Nomor Registrasi Apotek Simulasi: #AP-5590',
    location: 'Bio-Drop Depo Komunitas Hijau',
    locationDetail: 'Gudang Transisi Z-2 (Contoh Demonstrasi)',
    dosage: 'Sirup 60ml & Kapsul Lepas',
    dosageDetail: '4 Botol + 20 Butir Tanpa Kemasan Asli',
    packagingCondition: 'Kemasan sekunder rusak, segel primer botol terbuka',
    expiryDateInfo: 'Tidak terbaca pada kemasan fisik',

    identificationStatus: 'Dikarantina atau Ditolak',
    sortingNotes:
      'Interferensi multi-senyawa tidak dapat diproses bioreaktor biologis standar; risiko tinggi keracunan kultur mikroba. Ditolak dari alur biologis.',
    confirmedByOfficer: 'Apt. Bambang Irawan, S.Farm',

    researchRoute: 'PATH-SPECIAL',
    pathwayTitle: 'Evaluasi Khusus / Penanganan Non-Biologis (Limbah B3)',
    pathwayDetail: 'Dialihkan dari bioreaktor riset ke jalur insinerasi fasilitas limbah medis berizin',
    reactorId: 'Tidak Dialokasikan ke Bioreaktor',
    reactorStatus: 'Menunggu Penjadwalan',
    holdingTankId: 'Tangki Karantina Khusus',
    holdingTankStatus: 'Verifikasi Gagal - Tertahan',

    sample: {
      sampleId: 'SMP-EF-0943-QUAR',
      batchId: 'BATCH-SIM-0943',
      routeId: 'PATH-SPECIAL',
      reactorOrigin: 'Tangki Karantina',
      tankOrigin: 'Tangki Karantina Khusus',
      samplingTimestamp: '20 Okt 2024, 15:00 WIB',
      samplerName: 'Petugas Karantina Bahan Berbahaya',
      plannedTests: 'Skrining Kualitatif Bahaya Kimia & Toksisitas',
      status: 'Hasil Tersedia',
      storageNotes: 'Isolasi wadah tahan korosi',
    },

    labAnalysis: {
      hasResults: true,
      parentCompoundName: 'Campuran Multi-Komponen Kompleks',
      parentCompoundValue: 'Interferensi Matriks Tinggi (> Ambang Batas Aman Biologis)',
      parentCompoundMethod: 'Skrining Spektroskopi FTIR',
      parentCompoundStatus: 'Non-Conforming',
      lodLoq: 'Tidak memenuhi spesifikasi monokultur biologis',

      transformationProductsName: 'Intermediat Campuran Tidak Teridentifikasi',
      transformationProductsValue: 'Residu Senyawa Kompleks Terdeteksi',
      transformationProductsMethod: 'GC-MS Skrining Luas',
      transformationProductsStatus: 'Non-Conforming',

      toxicityBioassayName: 'Uji Penghambatan Pertumbuhan Mikroba / Bioassay',
      toxicityBioassayValue: 'Penghambatan Mikroba Signifikan (> 65% Inhibisi)',
      toxicityBioassayMethod: 'In Vitro Microbial Toxicity Test',
      toxicityBioassayStatus: 'Non-Conforming',

      testingDate: '20 Okt 2024, 16:30 WIB',
      labName: 'Laboratorium Pengendalian Mutu & Toksikologi',
      analystName: 'Nurul Hidayati, M.Sc',
      rawNotes: 'Matriks sirup mengandung pengawet dan eksipien antimikroba yang mematikan kultur mikroorganisme pengurai.',
    },

    verificationDecision: {
      decision: 'TIDAK MEMENUHI KRITERIA VERIFIKASI',
      criteriaReference: 'Kriteria Kelayakan Biodegradasi Bioreaktor PillsSafe Bagian 4.2',
      summaryReason:
        'Sediaan campuran memiliki interferensi antimikroba tinggi dan toksisitas akut mikroorganisme (>65% inhibisi). Tidak memenuhi kriteria untuk jalur biologis maupun pelepasan lingkungan.',
      evidenceReference: 'Laporan Audit Karantina: AUD-SIM-0943-HOLD',
      decisionDate: '20 Okt 2024, 17:00 WIB',
      decisionOfficer: 'Dr. apt. Rachmat H., Sp.FRS (Verifikator)',
      followUpActions:
        'Material dialihkan secara formal ke fasilitas pengolahan limbah B3 berizin (pirolisis suhu tinggi/insinerasi berizin). Dilarang dilepas ke saluran efluen.',
    },

    timestamp: '19 Okt 2024',
    timeDetail: '16:45 WIB',
    badgeClass: 'bg-rose-100 text-rose-900 border border-rose-300',
    badgeDot: 'bg-rose-600',
    statusText: 'TIDAK MEMENUHI KRITERIA VERIFIKASI (DIALIHKAN KE B3)',
    progressLabel: '3 dari 8 Tahap — Dikarantina pada Skrining',
    stepsDone: 3,
    isSimulation: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Registrasi & Pelaporan Digital',
        date: '19 Okt 2024, 16:45 WIB',
        actor: 'Pelapor Publik',
        description: 'Laporan sediaan campuran dicatat.',
        statusLabel: 'Terdaftar Digital',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 2,
        title: 'Pengumpulan & Pemeriksaan Fisik',
        date: '20 Okt 2024, 10:15 WIB',
        actor: 'Petugas Depo Komunitas',
        description: 'Diterima dengan catatan kemasan sekunder rusak dan sediaan terbuka.',
        statusLabel: 'Fisik Diterima dengan Catatan',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 3,
        title: 'Identifikasi Produk & Pemilahan',
        date: '20 Okt 2024, 14:00 WIB',
        actor: 'Apt. Bambang Irawan, S.Farm',
        description: 'Skrining mendeteksi interferensi multi-matriks dan botol terbuka tanpa segel.',
        statusLabel: 'Dikarantina atau Ditolak',
        statusType: 'caution',
        metaInfo: 'Status: Ditolak dari Jalur Biologis',
        isCompleted: true,
      },
      {
        stepNumber: 4,
        title: 'Penetapan Jalur Riset & Alokasi Reaktor',
        date: '20 Okt 2024, 14:30 WIB',
        actor: 'Pengelola Fasilitas B3',
        description: 'Ditolak dari Reaktor A maupun Reaktor B; dialokasikan ke jalur penanganan limbah B3 faskes resmi.',
        statusLabel: 'Dialihkan ke Jalur Non-Biologis',
        statusType: 'caution',
        isCompleted: true,
      },
      {
        stepNumber: 5,
        title: 'Proses Biodegradasi Reaktor & Penampungan',
        date: 'Ditiadakan',
        actor: 'Sistem',
        description: 'Tidak diinjeksikan ke bioreaktor untuk melindungi kultur mikroba.',
        statusLabel: 'Dibatalkan',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 6,
        title: 'Registrasi & Pengambilan Sampel Efluen',
        date: '20 Okt 2024, 15:00 WIB',
        actor: 'Petugas Karantina',
        description: 'Sampel uji toksisitas pendukung audit SMP-EF-0943-QUAR diambil dari wadah karantina.',
        statusLabel: 'Sampel Karantina Diambil',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 7,
        title: 'Pencatatan Hasil Analisis Efluen',
        date: '20 Okt 2024, 16:30 WIB',
        actor: 'Nurul Hidayati, M.Sc',
        description: 'Hasil menunjukkan toksisitas mikroba tinggi (>65% inhibisi) dan interferensi kimia.',
        statusLabel: 'Tidak Sesuai Baku Mutu Biologis',
        statusType: 'caution',
        isCompleted: true,
      },
      {
        stepNumber: 8,
        title: 'Keputusan Verifikasi Keselamatan Efluen',
        date: '20 Okt 2024, 17:00 WIB',
        actor: 'Dr. apt. Rachmat H., Sp.FRS',
        description: 'Keputusan resmi: TIDAK MEMENUHI KRITERIA VERIFIKASI. Wajib dialihkan ke insinerasi limbah medis B3.',
        statusLabel: 'KEPUTUSAN: TIDAK MEMENUHI KRITERIA',
        statusType: 'caution',
        isCompleted: true,
      },
    ],
  },

  'BATCH-SIM-0944': {
    code: 'BATCH-SIM-0944',
    reportedSubstance: 'Ibuprofen Sirup Suspensi 100mg/5ml',
    confirmedSubstance: 'Belum Dikonfirmasi (Menunggu Pemeriksaan Fisik)',
    substanceMeta: 'CAS Registry: 15687-27-1 | NSAID Cair Rumah Tangga (Data Demonstrasi)',
    source: 'Ibu Rumah Tangga (Warga Mandiri)',
    sourceMeta: 'Nomor Registrasi Mandiri: #PS-9012',
    location: 'Bio-Drop Puskesmas Sukamaju',
    locationDetail: 'Dropbox Puskesmas Sukamaju Zona B-4',
    dosage: 'Sirup Botol 60ml',
    dosageDetail: '1 Botol Terbuka Sebagian',
    packagingCondition: 'Botol kaca dengan tutup bersegel plastik rumah tangga',
    expiryDateInfo: 'Jan 2024 (Tercantum pada label botol)',

    identificationStatus: 'Menunggu Pemeriksaan',
    sortingNotes: 'Obat diserahkan mandiri di dropbox. Menunggu pengecekan fisik oleh petugas penerimaan faskes.',
    confirmedByOfficer: 'Belum Ditugaskan',

    researchRoute: 'PATH-UNASSIGNED',
    pathwayTitle: 'Menunggu Hasil Pemeriksaan Fisik & Pemilahan',
    pathwayDetail: 'Sediaan sirup memerlukan pengecekan kadar gula eksipien sebelum penentuan jalur',
    reactorId: 'Belum Dialokasikan',
    reactorStatus: 'Menunggu Penjadwalan',
    holdingTankId: 'Belum Dialokasikan',
    holdingTankStatus: 'Kosong',

    sample: {
      sampleId: 'SMP-PLN-0944',
      batchId: 'BATCH-SIM-0944',
      routeId: 'PATH-UNASSIGNED',
      reactorOrigin: 'Belum Terhubung',
      tankOrigin: 'Belum Terhubung',
      samplingTimestamp: 'Belum Diambil',
      samplerName: 'Belum Ditugaskan',
      plannedTests: 'Senyawa Induk & Uji Kompatibilitas Efluen',
      status: 'Belum Diambil',
      storageNotes: 'Menunggu pemeriksaan fisik',
    },

    labAnalysis: {
      hasResults: false,
      parentCompoundName: 'Ibuprofen',
      parentCompoundValue: 'Belum ada hasil analisis',
      parentCompoundMethod: 'HPLC / Menunggu Uji',
      parentCompoundStatus: 'Pending',
      lodLoq: 'Menunggu sampel',

      transformationProductsName: 'Metabolit Hidroksilasi',
      transformationProductsValue: 'Belum ada hasil analisis',
      transformationProductsMethod: 'LC-MS/MS / Menunggu Uji',
      transformationProductsStatus: 'Pending',

      toxicityBioassayName: 'Bioassay Toksisitas Lingkungan',
      toxicityBioassayValue: 'Belum ada hasil analisis',
      toxicityBioassayMethod: 'Daphnia magna 48-jam',
      toxicityBioassayStatus: 'Pending',

      testingDate: 'Belum Dilakukan',
      labName: 'Menunggu Alokasi Lab',
      analystName: 'Belum Ditugaskan',
      rawNotes: 'Belum ada hasil pengujian laboratorium untuk batch ini.',
    },

    verificationDecision: {
      decision: 'DATA BELUM CUKUP',
      criteriaReference: 'SOP Verifikasi Efluen PillsSafe Rev.2',
      summaryReason: 'Batch baru berada pada tahap penyerahan fisik dan menunggu identifikasi petugas.',
      evidenceReference: 'Menunggu Pemeriksaan Fisik',
      decisionDate: '20 Okt 2024',
      decisionOfficer: 'Sistem Pencatatan Otomatis',
      followUpActions: 'Pemeriksaan fisik sediaan oleh petugas penerimaan puskesmas.',
    },

    timestamp: '20 Okt 2024',
    timeDetail: '08:15 WIB',
    badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
    badgeDot: 'bg-amber-500 animate-pulse',
    statusText: 'MENUNGGU PEMERIKSAAN FISIK & PEMILAHAN',
    progressLabel: '2 dari 8 Tahap — Menunggu Skrining Petugas',
    stepsDone: 2,
    isSimulation: true,
    steps: [
      {
        stepNumber: 1,
        title: 'Registrasi & Pelaporan Digital',
        date: '20 Okt 2024, 08:15 WIB',
        actor: 'Pelapor Publik (Mandiri)',
        description: 'Laporan registrasi sirup ibuprofen dicatat via PillsSafe Web.',
        statusLabel: 'Terdaftar Digital',
        statusType: 'verified',
        isCompleted: true,
      },
      {
        stepNumber: 2,
        title: 'Pengumpulan & Pemeriksaan Fisik',
        date: '20 Okt 2024, 10:30 WIB',
        actor: 'Petugas Bio-Drop Puskesmas Sukamaju',
        description: 'Wadah diterima di loket dropbox. Menunggu antrean pemeriksaan isi dan integritas.',
        statusLabel: 'Diterima Fisik (Antre Skrining)',
        statusType: 'in-progress',
        isCompleted: false,
      },
      {
        stepNumber: 3,
        title: 'Identifikasi Produk & Pemilahan',
        date: 'Menunggu Giliran',
        actor: 'Petugas Penerimaan Faskes',
        description: 'Pemeriksaan kesesuaian label dengan sediaan sirup fisik.',
        statusLabel: 'Menunggu Pemeriksaan',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 4,
        title: 'Penetapan Jalur Riset & Alokasi Reaktor',
        date: 'Menunggu Hasil Pemilahan',
        actor: 'Pengelola Proses Bioreaktor',
        description: 'Penetapan jalur penanganan setelah kelayakan fisik disetujui.',
        statusLabel: 'Belum Dialokasikan',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 5,
        title: 'Proses Biodegradasi Reaktor & Penampungan',
        date: 'Menunggu Alokasi',
        actor: 'Pengelola Proses Bioreaktor',
        description: 'Pencatatan siklus reaktor dan pengaliran ke tangki penampung.',
        statusLabel: 'Belum Dimulai',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 6,
        title: 'Registrasi & Pengambilan Sampel Efluen',
        date: 'Menunggu Siklus',
        actor: 'Petugas Sampling',
        description: 'Pengambilan sampel efluen pascaproses.',
        statusLabel: 'Belum Diambil',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 7,
        title: 'Pencatatan Hasil Analisis Efluen',
        date: 'Menunggu Sampel',
        actor: 'Verifikator Laboratorium',
        description: 'Analisis instrumental senyawa induk, transformasi, dan uji toksisitas.',
        statusLabel: 'Belum Ada Hasil Analisis',
        statusType: 'pending',
        isCompleted: false,
      },
      {
        stepNumber: 8,
        title: 'Keputusan Verifikasi Keselamatan Efluen',
        date: 'Menunggu Hasil Uji',
        actor: 'Verifikator Laboratorium',
        description: 'Keputusan verifikasi keselamatan efluen.',
        statusLabel: 'DATA BELUM CUKUP',
        statusType: 'pending',
        isCompleted: false,
      },
    ],
  },
};

/**
 * Initial 5 realistic Bio-Drop collection points with accurate operating specifications.
 */
export const INITIAL_COLLECTION_POINTS: CollectionPoint[] = [
  {
    id: 'bio-drop-1',
    code: 'BD-JKT-01',
    name: 'Bio-Drop Puskesmas Sukamaju',
    subtitle: 'Fasilitas Kesehatan Tingkat Pertama (FKTP)',
    badgeText: 'Pusat Rujukan Publik',
    badgeClass: 'bg-[#b4efd6] text-[#002117]',
    distanceKm: 0.8,
    durationEst: '8 mnt berkendara',
    address: 'Jl. Pemuda No. 42, Sukamaju, Jakarta Timur',
    schedule: 'Senin - Sabtu: 08.00 - 15.00 WIB',
    scheduleNote: 'Tersedia loket penerimaan farmasi di lantai 1 dekat apotek rawat jalan.',
    acceptedDrugs: [
      'Tablet/Kapsul Utuh dalam Blister',
      'Sirup/Cairan dalam Botol Asli',
      'Salep & Gel dalam Tube',
      'Analgesik & NSAID',
    ],
    capacityStatusText: 'Kapasitas Normal (Tersedia)',
    capacityPercentage: 42,
    capacityQuotaText: '21.0 / 50.0 kg',
    capacityWeightText: '50 kg Kuota Maksimal',
    highlights: ['Wadah Dropbox Bersegel ISO', 'Petugas Farmasi Bersertifikat', 'Timbangan Terkalibrasi'],
    categoryTags: ['all', 'analgesic', 'nsaid', 'solid', 'liquid'],
    isOpen: true,
    is24h: false,
    hasLock: true,
    hasColdStorage: true,
    isDemo: true,
  },
  {
    id: 'bio-drop-2',
    code: 'BD-JKT-02',
    name: 'Bio-Drop Farmasi RSUD Peduli Sehat',
    subtitle: 'Fasilitas Kesehatan Rujukan Tingkat Lanjutan',
    badgeText: 'Kapasitas Besar & Dingin',
    badgeClass: 'bg-[#eaedff] text-[#002575]',
    distanceKm: 2.4,
    durationEst: '15 mnt berkendara',
    address: 'Jl. Kesehatan Raya No. 101, Cawang, Jakarta Timur',
    schedule: 'Setiap Hari (24 Jam Melalui IGD / Farmasi)',
    scheduleNote: 'Menerima sediaan khusus dan limbah sitotoksik/B3 medis dengan pelaporan formal faskes.',
    acceptedDrugs: [
      'Semua Bentuk Sediaan Padat',
      'Obat Cair & Suspensi',
      'Antibiotik & NSAID',
      'Obat Keras Bersyarat',
    ],
    capacityStatusText: 'Kapasitas 68% (Mendekati Batas Mingguan)',
    capacityPercentage: 68,
    capacityQuotaText: '102.0 / 150.0 kg',
    capacityWeightText: '150 kg Kuota Maksimal',
    highlights: ['Penerimaan 24 Jam IGD', 'Penyimpanan Suhu Dingin 2-8°C', 'Dekat Instalasi Pengolahan Limbah'],
    categoryTags: ['all', 'analgesic', 'nsaid', 'solid', 'liquid'],
    isOpen: true,
    is24h: true,
    hasLock: true,
    hasColdStorage: true,
    isDemo: true,
  },
  {
    id: 'bio-drop-3',
    code: 'BD-JKT-03',
    name: 'Bio-Drop Apotek Kimia Farma Matraman',
    subtitle: 'Apotek Jaringan Komersial & Program Sosial',
    badgeText: 'Titik Transit Publik',
    badgeClass: 'bg-[#e2e8f0] text-[#131b2e]',
    distanceKm: 3.1,
    durationEst: '20 mnt berkendara',
    address: 'Jl. Matraman Raya No. 55, Matraman, Jakarta Timur',
    schedule: 'Senin - Minggu: 07.00 - 22.00 WIB',
    scheduleNote: 'Wadah kotak pengumpulan terletak tepat di samping kasir farmasi.',
    acceptedDrugs: [
      'Parasetamol & Analgesik Bebas',
      'Vitamin & Suplemen Kedaluwarsa',
      'Tablet & Kapsul Strip',
    ],
    capacityStatusText: 'Kapasitas Tersedia (84% Kosong)',
    capacityPercentage: 16,
    capacityQuotaText: '4.8 / 30.0 kg',
    capacityWeightText: '30 kg Kuota Kotak',
    highlights: ['Akses Mudah Halte Busway', 'Konsultasi Apoteker Langsung', 'Stiker Kode Batang Serah Terima'],
    categoryTags: ['all', 'analgesic', 'solid'],
    isOpen: true,
    is24h: false,
    hasLock: true,
    hasColdStorage: false,
    isDemo: true,
  },
  {
    id: 'bio-drop-4',
    code: 'BD-JKT-04',
    name: 'Bio-Drop Depo Komunitas Hijau',
    subtitle: 'Bank Sampah & Drop Point Lingkungan RT/RW',
    badgeText: 'Pemberdayaan Komunitas',
    badgeClass: 'bg-[#f2f3ff] text-[#404944]',
    distanceKm: 1.5,
    durationEst: '10 mnt berkendara',
    address: 'Balai Warga RW 08, Kelurahan Rawamangun, Jakarta Timur',
    schedule: 'Rabu & Sabtu: 09.00 - 12.00 WIB',
    scheduleNote: 'Hanya melayani penerimaan obat sediaan padat rumah tangga kering pada jadwal piket kader.',
    acceptedDrugs: [
      'Tablet & Kapsul Non-Narkotika',
      'Blister & Strip Kering',
      'Kemasan Luar Kardus / Brosur',
    ],
    capacityStatusText: 'Kapasitas 85% (Jadwal Pengangkutan Besok)',
    capacityPercentage: 85,
    capacityQuotaText: '17.0 / 20.0 kg',
    capacityWeightText: '20 kg Kuota Depo',
    highlights: ['Edukasi Pemilahan Sampah', 'Integrasi Bank Sampah Warga', 'Pengangkutan Terjadwal Mingguan'],
    categoryTags: ['all', 'analgesic', 'solid'],
    isOpen: true,
    is24h: false,
    hasLock: false,
    hasColdStorage: false,
    isDemo: true,
  },
  {
    id: 'bio-drop-5',
    code: 'BD-JKT-05',
    name: 'Bio-Drop Apotek K-24 Rawamangun',
    subtitle: 'Apotek Mandiri 24 Jam',
    badgeText: 'Siaga 24 Jam',
    badgeClass: 'bg-[#eaedff] text-[#002575]',
    distanceKm: 2.0,
    durationEst: '12 mnt berkendara',
    address: 'Jl. Balai Pustaka Timur No. 12, Rawamangun, Jakarta Timur',
    schedule: 'Buka 24 Jam Setiap Hari',
    scheduleNote: 'Penyerahan dapat dilakukan kapan saja dengan menyerahkan paket ke petugas kasir.',
    acceptedDrugs: [
      'Analgesik & Antipiretik',
      'NSAID (Diklofenak, Asam Mefenamat)',
      'Antibiotik Sisa Tersegel',
    ],
    capacityStatusText: 'Kapasitas Normal (35% Terisi)',
    capacityPercentage: 35,
    capacityQuotaText: '10.5 / 30.0 kg',
    capacityWeightText: '30 kg Kuota Kotak',
    highlights: ['Siaga Nonstop 24 Jam', 'Area Parkir Luas', 'Dukungan Formulir Digital'],
    categoryTags: ['all', 'analgesic', 'nsaid', 'solid'],
    isOpen: true,
    is24h: true,
    hasLock: true,
    hasColdStorage: false,
    isDemo: true,
  },
];
