import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateReportForm,
  generateBatchCode,
  getSuitabilityEstimate,
  createSimulatedBatchFromReport,
  confirmPhysicalReceipt,
  assignResearchRoute,
  updateReactorStatus,
  registerEffluentSample,
  submitLabAnalysis,
  setVerificationDecision,
  computeDashboardMetrics,
  filterCollectionPoints,
  INITIAL_BATCHES,
  INITIAL_COLLECTION_POINTS,
} from './batchLogic.ts';
import type { ReportFormData } from '../types.ts';

test('validateReportForm catches missing required fields with clear messages', () => {
  const emptyResult = validateReportForm({});
  assert.equal(emptyResult.isValid, false);
  assert.ok(emptyResult.errors.drugName);
  assert.ok(emptyResult.errors.ingredient);
  assert.ok(emptyResult.errors.dosage);
  assert.ok(emptyResult.errors.expiryDate);
  assert.ok(emptyResult.errors.amount);
  assert.ok(emptyResult.errors.collectionPoint);
  assert.ok(emptyResult.errors.userConsent);
});

test('validateReportForm accepts valid data and honors expiryUnknown', () => {
  const validData: ReportFormData = {
    drugName: 'Parasetamol Generic 500mg',
    ingredient: 'Parasetamol (Acetaminophen)',
    dosage: 'Tablet',
    expiryDate: '',
    expiryUnknown: true,
    amount: 10,
    unit: 'tablet',
    packaging: 'Blister Utuh',
    wasteSource: 'Rumah Tangga Mandiri',
    collectionPoint: 'Bio-Drop Puskesmas Sukamaju',
    additionalNotes: 'Sisa pengobatan flu',
    userConsent: true,
  };

  const result = validateReportForm(validData);
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('generateBatchCode creates prefixed identifiers', () => {
  const pctCode = generateBatchCode('Parasetamol (Acetaminophen)', 123);
  assert.equal(pctCode, 'BATCH-SIM-PCT-123');

  const dcfCode = generateBatchCode('Diklofenak Natrium', 456);
  assert.equal(dcfCode, 'BATCH-SIM-DCF-456');

  const othCode = generateBatchCode('Vitamin C', 789);
  assert.equal(othCode, 'BATCH-SIM-OTH-789');
});

test('createSimulatedBatchFromReport starts at Step 1 and does NOT claim physical receipt', () => {
  const validData: ReportFormData = {
    drugName: 'Panadol 500mg',
    ingredient: 'Parasetamol (Acetaminophen)',
    dosage: 'Kaplet',
    expiryDate: '2025-05-01',
    expiryUnknown: false,
    amount: 5,
    unit: 'butir',
    packaging: 'Strip',
    wasteSource: 'Rumah Tangga',
    collectionPoint: 'Bio-Drop Puskesmas Sukamaju',
    additionalNotes: '',
    userConsent: true,
  };

  const batch = createSimulatedBatchFromReport(validData, 'BATCH-SIM-PCT-999');
  assert.equal(batch.code, 'BATCH-SIM-PCT-999');
  assert.equal(batch.reportedSubstance, 'Panadol 500mg');
  assert.ok(batch.confirmedSubstance.includes('Belum Dikonfirmasi'));
  assert.equal(batch.identificationStatus, 'Menunggu Pemeriksaan');
  assert.equal(batch.stepsDone, 1);
  assert.equal(batch.labAnalysis.hasResults, false);
  assert.equal(batch.verificationDecision.decision, 'DATA BELUM CUKUP');
});

test('confirmPhysicalReceipt updates physical identification and confirmed substance', () => {
  const initial = INITIAL_BATCHES['BATCH-SIM-0944'];
  const updated = confirmPhysicalReceipt(
    initial,
    'Ibuprofen Suspensi 100mg/5ml Terverifikasi',
    'Diterima untuk Jalur Penanganan',
    'Apt. Rina, S.Farm',
    'Kemasan botol terverifikasi utuh dan isi sesuai label'
  );

  assert.equal(updated.identificationStatus, 'Diterima untuk Jalur Penanganan');
  assert.equal(updated.confirmedSubstance, 'Ibuprofen Suspensi 100mg/5ml Terverifikasi');
  assert.equal(updated.confirmedByOfficer, 'Apt. Rina, S.Farm');
  assert.ok(updated.stepsDone >= 3);
});

test('assignResearchRoute enforces separate reactors and holding tanks for Path A and Path B', () => {
  const baseBatch = INITIAL_BATCHES['BATCH-SIM-0944'];

  const pathA = assignResearchRoute(baseBatch, 'PATH-A-PARACETAMOL', 'Ir. Agus Pratama');
  assert.equal(pathA.researchRoute, 'PATH-A-PARACETAMOL');
  assert.ok(pathA.reactorId.includes('Reaktor Riset A'));
  assert.ok(pathA.holdingTankId.includes('Holding Tank A'));

  const pathB = assignResearchRoute(baseBatch, 'PATH-B-DICLOFENAC', 'Ir. Agus Pratama');
  assert.equal(pathB.researchRoute, 'PATH-B-DICLOFENAC');
  assert.ok(pathB.reactorId.includes('Reaktor Riset B'));
  assert.ok(pathB.holdingTankId.includes('Holding Tank B'));
  assert.notEqual(pathA.reactorId, pathB.reactorId);
  assert.notEqual(pathA.holdingTankId, pathB.holdingTankId);
});

test('registerEffluentSample connects sample to batch and tank', () => {
  const initial = INITIAL_BATCHES['BATCH-SIM-0942'];
  const sampled = registerEffluentSample(
    initial,
    'SMP-EF-TEST-01',
    'Budi Santoso',
    'HPLC & Bioassay Toksisitas'
  );

  assert.equal(sampled.sample.sampleId, 'SMP-EF-TEST-01');
  assert.equal(sampled.sample.status, 'Telah Diambil');
  assert.equal(sampled.sample.tankOrigin, initial.holdingTankId);
  assert.ok(sampled.stepsDone >= 6);
});

test('submitLabAnalysis and setVerificationDecision enforce official decisions', () => {
  const initial = INITIAL_BATCHES['BATCH-SIM-0942'];
  const withLab = submitLabAnalysis(initial, {
    parentCompoundValue: '< LOQ (0.010 mg/L)',
    parentCompoundStatus: 'Conforming',
    transformationProductsValue: 'Non-Terdeteksi',
    transformationProductsStatus: 'Conforming',
    toxicityBioassayValue: 'Mortalitas 0%',
    toxicityBioassayStatus: 'Conforming',
    analystName: 'Dr. Hendra Wibowo',
  });

  assert.equal(withLab.labAnalysis.hasResults, true);
  assert.equal(withLab.sample.status, 'Hasil Tersedia');

  const verified = setVerificationDecision(
    withLab,
    'MEMENUHI KRITERIA VERIFIKASI',
    'SOP PillsSafe Rev.2',
    'Semua 3 kriteria terpenuhi',
    'Prof. Rachmat H.',
    'Pelepasan efluen ke instalasi desinfeksi akhir'
  );

  assert.equal(verified.verificationDecision.decision, 'MEMENUHI KRITERIA VERIFIKASI');
  assert.equal(verified.stepsDone, 8);
  assert.ok(verified.statusText.includes('MEMENUHI KRITERIA VERIFIKASI'));
});

test('computeDashboardMetrics calculates accurate stats across batches', () => {
  const metrics = computeDashboardMetrics(INITIAL_BATCHES);
  assert.equal(metrics.total, 4);
  assert.ok(metrics.routePathA >= 1);
  assert.ok(metrics.routePathB >= 1);
  assert.ok(metrics.decisionMet >= 1);
  assert.ok(metrics.decisionNotMet >= 1);
  assert.ok(metrics.decisionInsufficient >= 1);
});

test('filterCollectionPoints filters accurately by search query, category, and status', () => {
  const all = filterCollectionPoints(INITIAL_COLLECTION_POINTS, '', 'all', 'all');
  assert.equal(all.length, INITIAL_COLLECTION_POINTS.length);

  const queryMatch = filterCollectionPoints(INITIAL_COLLECTION_POINTS, 'Sukamaju', 'all', 'all');
  assert.ok(queryMatch.length >= 1);
  assert.ok(queryMatch[0].name.includes('Sukamaju'));

  const open24h = filterCollectionPoints(INITIAL_COLLECTION_POINTS, '', 'all', '24h');
  assert.ok(open24h.length >= 1);
  assert.ok(open24h.every((p) => p.is24h));
});
