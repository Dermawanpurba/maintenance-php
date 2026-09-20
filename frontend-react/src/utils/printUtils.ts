import { WorkOrder, Equipment, FARRecord, SwabRecord, PcrItem, DailyHM } from '../types';

/**
 * Print Work Order SPK (Surat Perintah Kerja)
 */
export function printWorkOrderSPK(wo: WorkOrder) {
  let partsList: any[] = [];
  try {
    if (typeof wo.parts_json === 'string') {
      partsList = JSON.parse(wo.parts_json || '[]');
    } else if (Array.isArray(wo.parts_json)) {
      partsList = wo.parts_json;
    }
  } catch (e) {
    partsList = [];
  }

  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak SPK');
    return;
  }

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>SPK - ${wo.no_wo || 'Work Order'}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: 'Arial', sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 12px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 18px; margin: 0; font-weight: bold; color: #0f172a; text-transform: uppercase; }
        .logo-title h2 { font-size: 12px; margin: 2px 0 0 0; color: #64748b; font-weight: normal; }
        .doc-badge { text-align: right; }
        .doc-badge .spk-title { font-size: 14px; font-weight: bold; color: #2563eb; letter-spacing: 1px; }
        .doc-badge .wo-no { font-size: 16px; font-weight: 800; color: #0f172a; font-family: monospace; }
        .section-title { font-weight: bold; font-size: 11px; text-transform: uppercase; background-color: #f1f5f9; padding: 4px 8px; border-left: 4px solid #2563eb; margin: 12px 0 6px 0; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        table.meta-table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
        table.meta-table td { padding: 4px 6px; font-size: 11px; }
        table.meta-table td.label { width: 35%; color: #64748b; font-weight: 600; }
        table.meta-table td.val { font-weight: bold; color: #0f172a; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 6px; margin-bottom: 15px; }
        table.data-table th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px; text-align: left; font-size: 10px; text-transform: uppercase; color: #475569; }
        table.data-table td { border: 1px solid #cbd5e1; padding: 6px; font-size: 11px; }
        .box { border: 1px solid #cbd5e1; border-radius: 4px; padding: 8px; font-size: 11px; background: #fff; min-height: 40px; margin-bottom: 10px; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin-top: 30px; text-align: center; }
        .sig-box { border-top: 1px solid #94a3b8; padding-top: 6px; margin-top: 50px; font-weight: bold; font-size: 11px; }
        .sig-role { font-size: 10px; color: #64748b; font-weight: normal; }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px 15px; margin-bottom:20px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:#1d4ed8;">Pratinjau Cetak Surat Perintah Kerja (SPK)</span>
        <button onclick="window.print()" style="background:#2563eb; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer;">Cetak Sekarang (Print / PDF)</button>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>PT. BENAMAKMUR SELARAS SEJAHTERA</h1>
          <h2>Plant & Maintenance Department — Mining Heavy Equipment Division</h2>
        </div>
        <div class="doc-badge">
          <div class="spk-title">SURAT PERINTAH KERJA (SPK)</div>
          <div class="wo-no">${wo.no_wo || '-'}</div>
        </div>
      </div>

      <div class="grid-2">
        <div>
          <div class="section-title">Informasi Unit Alat Berat</div>
          <table class="meta-table">
            <tr><td class="label">Nomor Lambung:</td><td class="val">${wo.equip_no || '-'}</td></tr>
            <tr><td class="label">Brand / Merk:</td><td class="val">${wo.brand || '-'}</td></tr>
            <tr><td class="label">Model / Tipe:</td><td class="val">${wo.unit_type || '-'}</td></tr>
            <tr><td class="label">Hour Meter (HM):</td><td class="val">${Number(wo.hm_km || 0).toLocaleString()} Hours</td></tr>
            <tr><td class="label">Status Servis:</td><td class="val" style="color:${wo.status === 'Closed' ? '#16a34a' : '#dc2626'}">${wo.status || 'Open'}</td></tr>
          </table>
        </div>

        <div>
          <div class="section-title">Jadwal & Klasifikasi Perbaikan</div>
          <table class="meta-table">
            <tr><td class="label">Klasifikasi:</td><td class="val">${wo.sch_unsch || 'UNSCHEDULED'}</td></tr>
            <tr><td class="label">Layanan / PM:</td><td class="val">${wo.pm_service || 'Corrective Maintenance'}</td></tr>
            <tr><td class="label">Waktu Rusak (B/D):</td><td class="val">${wo.tgl_rusak || '-'} ${wo.jam_rusak || ''}</td></tr>
            <tr><td class="label">Target Selesai (RFU):</td><td class="val">${wo.tgl_selesai || '-'} ${wo.jam_selesai || ''}</td></tr>
            <tr><td class="label">Leader Mekanik / PIC:</td><td class="val">${wo.tech || 'Tim Workshop'}</td></tr>
          </table>
        </div>
      </div>

      <div class="section-title">Deskripsi Kendala & Gejala Kerusakan</div>
      <div class="box">${wo.kendala || 'Tidak ada deskripsi kendala tercatat.'}</div>

      ${wo.failure_reason ? `
        <div class="section-title">Akar Masalah (Root Cause Analysis) / Alasan Kerusakan</div>
        <div class="box">${wo.failure_reason}</div>
      ` : ''}

      <div class="section-title">Penggunaan Suku Cadang & Pelumas (Spareparts & Consumables)</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th style="width: 140px;">Part Number</th>
            <th>Nama Barang / Deskripsi Sparepart</th>
            <th style="width: 60px; text-align: right;">Qty</th>
            <th style="width: 60px;">Satuan</th>
          </tr>
        </thead>
        <tbody>
          ${partsList.length > 0 ? partsList.map((p, idx) => `
            <tr>
              <td style="text-align: center;">${idx + 1}</td>
              <td style="font-family: monospace; font-weight: bold;">${p.part_number || p.code || '-'}</td>
              <td>${p.part_name || p.desc || p.name || '-'}</td>
              <td style="text-align: right; font-weight: bold;">${p.qty || 1}</td>
              <td>${p.uom || 'Pcs'}</td>
            </tr>
          `).join('') : `
            <tr>
              <td colspan="5" style="text-align: center; color: #94a3b8; padding: 12px;">Tidak ada suku cadang yang dialokasikan</td>
            </tr>
          `}
        </tbody>
      </table>

      <div class="section-title">Tindakan Perbaikan & Catatan Mekanik</div>
      <div class="box" style="min-height: 50px;">${wo.action_log || 'Pemeriksaan komponen, penggantian sparepart sesuai spesifikasi pabrikan, serta pengetesan fungsi operasional sistem.'}</div>

      <div style="margin-top: 15px; font-size: 10px; color: #64748b;">
        * Dokumen ini sah dan diterbitkan secara digital oleh WOSys Plant Maintenance System pada tanggal ${todayStr}.
      </div>

      <div class="signatures">
        <div>
          <div class="sig-role">Pelapor / Operator</div>
          <div class="sig-box">${wo.reported_by || 'Operator Lapangan'}</div>
        </div>
        <div>
          <div class="sig-role">Leader Mekanik / PIC</div>
          <div class="sig-box">${wo.tech || 'Leader Mekanik'}</div>
        </div>
        <div>
          <div class="sig-role">Supervisor / Dept Head</div>
          <div class="sig-box">Plant Head Supervisor</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print Executive Plant Management Summary Report
 */
export function printExecutiveReport(
  kpi: { pa: number; rfu: number; rwn: number; bd: number; totalHours: number; downtimeHours: number },
  equipments: Equipment[],
  workOrders: WorkOrder[],
  dateRange: { start: string; end: string }
) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak resume eksekutif');
    return;
  }

  const breakdownUnits = equipments.filter(e => (e.status || '').toUpperCase() === 'B/D');
  const activeWOs = workOrders.filter(w => (w.status || '').toUpperCase() !== 'CLOSED');

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Resume Eksekutif Plant - ${todayStr}</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: 'Arial', sans-serif; color: #1e293b; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 18px; margin: 0; font-weight: 800; color: #0f172a; }
        .logo-title h2 { font-size: 12px; margin: 2px 0 0 0; color: #475569; }
        .kpi-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
        .kpi-card { border: 1px solid #cbd5e1; border-radius: 8px; padding: 12px; text-align: center; background: #f8fafc; }
        .kpi-card.highlight { background: #0f172a; color: white; border-color: #0f172a; }
        .kpi-val { font-size: 24px; font-weight: 800; margin: 4px 0; }
        .kpi-title { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; }
        .kpi-card.highlight .kpi-title { color: #94a3b8; }
        .section-title { font-weight: bold; font-size: 12px; text-transform: uppercase; background: #f1f5f9; padding: 6px 10px; border-left: 4px solid #2563eb; margin: 15px 0 8px 0; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.data-table th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10px; text-transform: uppercase; text-align: left; }
        table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 11px; }
        .status-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 9px; }
        .status-bd { background: #fee2e2; color: #991b1b; }
        .status-rfu { background: #dcfce7; color: #166534; }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#eff6ff; border:1px solid #bfdbfe; padding:10px 15px; margin-bottom:20px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:#1d4ed8;">Pratinjau Resume Eksekutif Manajemen Plant</span>
        <button onclick="window.print()" style="background:#2563eb; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer;">Cetak Laporan (Print / PDF)</button>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>RESUME EKSEKUTIF KESIAPAN ALAT BERAT & PERFORMA PLANT</h1>
          <h2>PT. BENAMAKMUR SELARAS SEJAHTERA — Mining Operation Site</h2>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569;">
          <div>Periode Analisis: <strong>${dateRange.start} s/d ${dateRange.end}</strong></div>
          <div>Tanggal Cetak: <strong>${todayStr}</strong></div>
        </div>
      </div>

      <div class="kpi-cards">
        <div class="kpi-card highlight">
          <div class="kpi-title">Physical Availability (PA)</div>
          <div class="kpi-val" style="color: ${kpi.pa >= 88 ? '#4ade80' : '#f87171'}">${kpi.pa.toFixed(1)}%</div>
          <div style="font-size: 10px; color: #94a3b8;">Target Minimum: 88.0%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Kesiapan Armada (Fleet)</div>
          <div class="kpi-val" style="color: #16a34a;">${kpi.rfu} <span style="font-size: 14px; font-weight: normal; color: #64748b;">/ ${equipments.length} Unit</span></div>
          <div style="font-size: 10px; color: #64748b;">RFU: ${kpi.rfu} | RWN: ${kpi.rwn} | B/D: ${kpi.bd}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Downtime Breakdown Terakumulasi</div>
          <div class="kpi-val" style="color: #dc2626;">${Math.round(kpi.downtimeHours).toLocaleString()} <span style="font-size: 14px; font-weight: normal; color: #64748b;">Jam</span></div>
          <div style="font-size: 10px; color: #64748b;">Lost Time Operasional Site</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Work Order Aktif / Antrean</div>
          <div class="kpi-val" style="color: #2563eb;">${activeWOs.length} <span style="font-size: 14px; font-weight: normal; color: #64748b;">Kasus</span></div>
          <div style="font-size: 10px; color: #64748b;">Dalam Pengerjaan Workshop</div>
        </div>
      </div>

      <div class="section-title">Daftar Kritis Unit Breakdown (B/D) & Antrean Servis Aktif</div>
      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px;">No</th>
            <th style="width: 100px;">No Lambung</th>
            <th style="width: 140px;">Model / Tipe Alat</th>
            <th style="width: 120px;">No. Work Order</th>
            <th style="width: 90px;">Tgl B/D</th>
            <th>Kendala Kerusakan Utama</th>
            <th style="width: 120px;">Leader Mekanik</th>
            <th style="width: 90px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${breakdownUnits.length > 0 ? breakdownUnits.map((eq, idx) => {
            const wo = (workOrders.find(w => (w.equip_no === eq.equip_no || w.no_unit === eq.no_unit) && w.status !== 'Closed') || {}) as Partial<WorkOrder>;
            return `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td style="font-weight: bold; color: #0f172a;">${eq.equip_no || eq.no_unit || '-'}</td>
                <td>${eq.model || eq.tipe || '-'}</td>
                <td style="font-family: monospace; font-weight: bold;">${wo.no_wo || '-'}</td>
                <td>${wo.tgl_rusak || '-'}</td>
                <td>${wo.kendala || 'Unit Breakdown dalam proses evaluasi teknisi workshop'}</td>
                <td>${wo.tech || 'Tim Mekanik'}</td>
                <td><span class="status-badge status-bd">BREAKDOWN</span></td>
              </tr>
            `;
          }).join('') : `
            <tr>
              <td colspan="8" style="text-align: center; color: #16a34a; font-weight: bold; padding: 15px;">
                Semua armada dalam kondisi prima (Zero Breakdown).
              </td>
            </tr>
          `}
        </tbody>
      </table>

      <div style="display: flex; justify-content: space-between; margin-top: 40px; text-align: center;">
        <div style="width: 200px;">
          <div style="font-size: 10px; color: #64748b;">Disiapkan Oleh:</div>
          <div style="border-top: 1px solid #94a3b8; margin-top: 45px; font-weight: bold;">Planner Plant / Maintenance</div>
        </div>
        <div style="width: 200px;">
          <div style="font-size: 10px; color: #64748b;">Diperiksa Oleh:</div>
          <div style="border-top: 1px solid #94a3b8; margin-top: 45px; font-weight: bold;">Supervisor Workshop Site</div>
        </div>
        <div style="width: 200px;">
          <div style="font-size: 10px; color: #64748b;">Disetujui Oleh:</div>
          <div style="border-top: 1px solid #94a3b8; margin-top: 45px; font-weight: bold;">Dept Head Plant & Logistik</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

export const printExecutiveSummary = printExecutiveReport;

/**
 * Print Failure Analysis Report (FAR) Form with 5-Why RCA and Official Approval Signatures
 */
export function printFARDocument(far: FARRecord, equipment?: Equipment) {
  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak dokumen Failure Analysis (FAR)');
    return;
  }

  const rawId = String(far.far_number || far.item_id || far.id || '');
  const farNumber = rawId.startsWith('FAR-') ? rawId : (rawId ? `FAR-${rawId}` : 'FAR-OFFICIAL');
  const unitNo = far.equip_no || far.no_unit || equipment?.equip_no || equipment?.no_unit || '-';
  const unitModel = equipment?.model || equipment?.type || equipment?.brand || '-';
  const unitHm = equipment?.last_hm ? `${Number(equipment.last_hm).toLocaleString()} Hours` : (equipment?.hm_km ? `${Number(equipment.hm_km).toLocaleString()} Hours` : '-');
  const incidentDate = far.incident_date || far.tanggal || new Date().toISOString().split('T')[0];
  const compName = far.damage_part || far.component || far.component_name || '-';
  const failureMode = far.failure_mode || 'MECHANICAL BREAKDOWN / COMPONENT FAILURE';
  const investigator = far.pic || far.leader || far.lead_investigator || 'Hariadi (Reliability Team)';

  // Parse 5-Why steps
  let whySteps: string[] = [];
  if (Array.isArray(far.five_why_json)) {
    whySteps = far.five_why_json;
  } else if (typeof far.five_why_json === 'string') {
    try {
      const parsed = JSON.parse(far.five_why_json);
      if (Array.isArray(parsed)) whySteps = parsed;
    } catch (e) {
      // ignore
    }
  }

  if (whySteps.length === 0) {
    const rawWhy = [far.why1, far.why2, far.why3, far.why4, far.why5].filter(Boolean) as string[];
    if (rawWhy.length > 0) {
      whySteps = rawWhy;
    } else if (far.root_cause && far.root_cause.includes('->')) {
      whySteps = far.root_cause.split('->').map(s => s.trim());
    } else if (far.root_cause) {
      whySteps = [far.root_cause];
    }
  }

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Laporan FAR - ${farNumber}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm 15mm; }
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11.5px; line-height: 1.45; }
        .header { border-bottom: 2.5px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 17px; margin: 0; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .logo-title h2 { font-size: 11px; margin: 3px 0 0 0; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .doc-badge { text-align: right; }
        .doc-badge .badge-tag { display: inline-block; background: #dc2626; color: white; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .doc-badge .far-no { font-size: 17px; font-weight: 800; color: #0f172a; font-family: monospace; margin-top: 4px; }
        .section-header { font-weight: 800; font-size: 11px; text-transform: uppercase; background-color: #f1f5f9; padding: 6px 10px; border-left: 4px solid #dc2626; margin: 14px 0 8px 0; letter-spacing: 0.5px; color: #1e293b; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px; }
        table.meta-table { width: 100%; border-collapse: collapse; }
        table.meta-table td { padding: 4px 6px; font-size: 11px; vertical-align: top; border-bottom: 1px dashed #e2e8f0; }
        table.meta-table td.lbl { width: 40%; color: #64748b; font-weight: 600; }
        table.meta-table td.val { font-weight: 700; color: #0f172a; }
        .content-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-size: 11.5px; background: #fff; min-height: 40px; margin-bottom: 8px; line-height: 1.5; color: #1e293b; }
        .content-box.corrective { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
        .content-box.preventive { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
        .why-container { border: 1px solid #fed7aa; background: #fffaf5; border-radius: 6px; padding: 10px 12px; margin-bottom: 10px; }
        .why-step { display: flex; align-items: flex-start; gap: 10px; padding: 5px 0; border-bottom: 1px dashed #fdba74; }
        .why-step:last-child { border-bottom: none; font-weight: bold; color: #9a3412; }
        .why-num { background: #ea580c; color: white; border-radius: 4px; padding: 2px 7px; font-size: 10px; font-weight: 800; font-family: monospace; white-space: nowrap; }
        .why-text { font-size: 11px; flex: 1; color: #1f2937; }
        .root-cause-banner { background: #fef2f2; border: 1.5px solid #f87171; border-radius: 6px; padding: 8px 12px; margin-top: 8px; color: #991b1b; font-weight: 700; font-size: 11.5px; }
        .signatures-container { margin-top: 25px; page-break-inside: avoid; }
        .signatures-title { text-align: center; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; text-align: center; }
        .sig-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 8px 12px 8px; background: #fafafa; }
        .sig-role { font-size: 9.5px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .sig-dept { font-size: 10.5px; font-weight: 700; color: #0f172a; margin-top: 2px; }
        .sig-space { height: 58px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 10px; font-style: italic; border-bottom: 1px solid #94a3b8; margin: 8px 15px 8px 15px; }
        .sig-name { font-size: 11px; font-weight: 800; color: #0f172a; }
        .sig-date { font-size: 9.5px; color: #64748b; margin-top: 2px; }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0 !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef2f2; border:1px solid #fecaca; padding:10px 16px; margin-bottom:18px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:bold; color:#b91c1c; font-size:13px;">Pratinjau Cetak Failure Analysis Report (FAR)</span>
          <span style="color:#7f1d1d; font-size:11px; margin-left:8px;">Format Dokumen Resmi Site Tambang dengan Tanda Tangan Approval</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.print()" style="background:#dc2626; color:white; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer; box-shadow:0 2px 4px rgba(220,38,38,0.25);">Cetak Dokumen (Print / PDF)</button>
          <button onclick="window.close()" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 14px; border-radius:6px; font-weight:600; font-size:12px; cursor:pointer;">Tutup</button>
        </div>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>PT. BENAMAKMUR SELARAS SEJAHTERA</h1>
          <h2>Plant & Maintenance Department — Mining Heavy Equipment Division</h2>
        </div>
        <div class="doc-badge">
          <div class="badge-tag">Failure Analysis Report</div>
          <div class="far-no">${farNumber}</div>
        </div>
      </div>

      <div class="section-header">1. Identifikasi Unit & Ringkasan Kerusakan</div>
      <div class="meta-grid">
        <table class="meta-table">
          <tr><td class="lbl">No. Lambung Unit:</td><td class="val" style="color:#dc2626; font-size:13px;">${unitNo}</td></tr>
          <tr><td class="lbl">Model & Tipe Unit:</td><td class="val">${unitModel}</td></tr>
          <tr><td class="lbl">Hour Meter (HM):</td><td class="val">${unitHm}</td></tr>
          <tr><td class="lbl">Lokasi Operasi / Pit:</td><td class="val">${equipment?.lokasi || equipment?.site || 'Mining Operation Site'}</td></tr>
        </table>
        <table class="meta-table">
          <tr><td class="lbl">Tanggal Kejadian:</td><td class="val">${incidentDate}</td></tr>
          <tr><td class="lbl">Komponen Rusak:</td><td class="val" style="color:#0f172a;">${compName}</td></tr>
          <tr><td class="lbl">Mode Kegagalan:</td><td class="val"><span style="background:#fee2e2; color:#991b1b; padding:2px 6px; border-radius:3px; font-size:10px;">${failureMode}</span></td></tr>
          <tr><td class="lbl">Investigator / PIC:</td><td class="val">${investigator}</td></tr>
        </table>
      </div>

      <div class="section-header">2. Investigasi 5-Why Root Cause Analysis (RCA)</div>
      <div class="why-container">
        ${whySteps.length > 0 ? whySteps.map((step, idx) => `
          <div class="why-step">
            <span class="why-num">WHY ${idx + 1}</span>
            <span class="why-text">${step}</span>
          </div>
        `).join('') : `
          <div class="why-step">
            <span class="why-num">WHY 1</span>
            <span class="why-text">${compName} mengalami kerusakan operasional mendadak.</span>
          </div>
          <div class="why-step">
            <span class="why-num">WHY 2</span>
            <span class="why-text">Terjadinya beban kerja berlebih (overstress/overheating) pada komponen saat beroperasi.</span>
          </div>
          <div class="why-step">
            <span class="why-num">WHY 3</span>
            <span class="why-text">Sirkulasi pelumasan atau sistem pendingin tidak bekerja optimal.</span>
          </div>
          <div class="why-step">
            <span class="why-num">WHY 4</span>
            <span class="why-text">Inspeksi harian atau jadwal pembersihan berkala terhambat operasional.</span>
          </div>
          <div class="why-step">
            <span class="why-num">WHY 5</span>
            <span class="why-text">${far.root_cause || 'Akar masalah sistemik: perlunya penguatan kontrol kepatuhan jadwal maintenance harian.'}</span>
          </div>
        `}
        <div class="root-cause-banner">
          Akar Masalah Akhir (Root Cause): ${far.root_cause || whySteps[whySteps.length - 1] || 'Kegagalan mekanikal akibat akumulasi keausan dan keterlambatan deteksi dini.'}
        </div>
      </div>

      <div class="section-header">3. Tindakan Korektif (Immediate Corrective Action)</div>
      <div class="content-box corrective">
        ${far.corrective_action || '1. Penggantian komponen rusak dengan suku cadang genuine pabrikan baru.\n2. Flushing sistem pelumasan dan penggantian filter elemen.\n3. Running test dan uji fungsi parameter operasional (suhu, tekanan kerja, vibrasi).'}
      </div>

      <div class="section-header">4. Tindakan Pencegahan Sistemik (Preventive & Predictive Action)</div>
      <div class="content-box preventive">
        ${far.preventive_action || '1. Penyesuaian interval inspeksi P2H dan Scheduled Oil Sampling (SOS) setiap 250 jam.\n2. Sosialisasi SOP pengoperasian normal kepada seluruh operator fleet.\n3. Audit berkala kondisi kebersihan komponen pendingin unit di pit tambang.'}
      </div>

      <div style="font-size:10px; color:#64748b; margin-top:10px; display:flex; justify-content:space-between;">
        <span>* Laporan FAR ini dibuat berdasarkan investigasi teknis dan observasi lapangan secara objektif.</span>
        <span>Dicetak pada: ${todayStr}</span>
      </div>

      <!-- LEMBAR PENGESAHAN & TANDA TANGAN APPROVAL -->
      <div class="signatures-container">
        <div class="signatures-title">LEMBAR PENGESAHAN & TANDA TANGAN APPROVAL</div>
        <div class="signatures">
          <div class="sig-card">
            <div class="sig-role">Diselidiki & Dibuat Oleh:</div>
            <div class="sig-dept">Lead Investigator / Mekanik Leader</div>
            <div class="sig-space">[ Tanda Tangan & Tanggal ]</div>
            <div class="sig-name">${investigator}</div>
            <div class="sig-date">Tgl: ${incidentDate}</div>
          </div>
          <div class="sig-card">
            <div class="sig-role">Diperiksa & Diverifikasi:</div>
            <div class="sig-dept">Maintenance Planner / Workshop Spv</div>
            <div class="sig-space">[ Tanda Tangan & Tanggal ]</div>
            <div class="sig-name">${far.supervisor || 'Workshop Supervisor'}</div>
            <div class="sig-date">Tgl: .......................................</div>
          </div>
          <div class="sig-card">
            <div class="sig-role">Disetujui Oleh:</div>
            <div class="sig-dept">Plant Superintendent / Dept Head</div>
            <div class="sig-space">[ Tanda Tangan & Stempel Resmi ]</div>
            <div class="sig-name">${far.approved_by || 'Plant Superintendent'}</div>
            <div class="sig-date">Tgl: .......................................</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print Rekapitulasi Laporan FAR Periode Berjalan with Approval Signatures
 */
export function printFARSummaryReport(fars: FARRecord[]) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak rekapitulasi FAR');
    return;
  }

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Rekapitulasi Failure Analysis Report - ${todayStr}</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 17px; margin: 0; font-weight: 800; color: #0f172a; }
        .logo-title h2 { font-size: 11px; margin: 2px 0 0 0; color: #475569; font-weight: 600; text-transform: uppercase; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.data-table th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10px; text-transform: uppercase; text-align: left; color: #475569; }
        table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10.5px; vertical-align: top; }
        .far-badge { font-family: monospace; font-weight: bold; color: #dc2626; }
        .unit-badge { font-weight: bold; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-block; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 35px; text-align: center; page-break-inside: avoid; }
        .sig-box { border-top: 1px solid #94a3b8; padding-top: 6px; margin-top: 45px; font-weight: bold; font-size: 11px; }
        .sig-role { font-size: 10px; color: #64748b; font-weight: normal; }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0 !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fef2f2; border:1px solid #fecaca; padding:10px 15px; margin-bottom:18px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:bold; color:#b91c1c;">Pratinjau Rekapitulasi Laporan Failure Analysis (FAR)</span>
          <span style="color:#7f1d1d; font-size:11px; margin-left:8px;">Total ${fars.length} Kasus Investigasi Terdata</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.print()" style="background:#dc2626; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer;">Cetak Rekap (Print / PDF)</button>
          <button onclick="window.close()" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 14px; border-radius:4px; font-weight:600; cursor:pointer;">Tutup</button>
        </div>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>REKAPITULASI LAPORAN FAILURE ANALYSIS (FAR)</h1>
          <h2>PT. BENAMAKMUR SELARAS SEJAHTERA — Plant & Maintenance Reliability Division</h2>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569;">
          <div>Total Laporan: <strong>${fars.length} Kasus</strong></div>
          <div>Tanggal Cetak: <strong>${todayStr}</strong></div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 25px; text-align: center;">No</th>
            <th style="width: 90px;">No. FAR</th>
            <th style="width: 80px;">Tanggal</th>
            <th style="width: 85px;">No Lambung</th>
            <th style="width: 140px;">Komponen Gagal</th>
            <th>Akar Masalah (RCA)</th>
            <th>Tindakan Korektif</th>
            <th style="width: 120px;">Investigator</th>
          </tr>
        </thead>
        <tbody>
          ${fars.length > 0 ? fars.map((f, idx) => {
            const rawId = String(f.far_number || f.item_id || f.id || '');
            const farNo = rawId.startsWith('FAR-') ? rawId : (rawId ? `FAR-${rawId}` : '-');
            const unit = f.equip_no || f.no_unit || '-';
            const comp = f.damage_part || f.component || f.component_name || '-';
            const date = f.incident_date || f.tanggal || '-';
            const rca = f.root_cause || '-';
            const corrective = f.corrective_action || '-';
            const inv = f.pic || f.leader || f.lead_investigator || '-';
            return `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td class="far-badge">${farNo}</td>
                <td>${date}</td>
                <td><span class="unit-badge">${unit}</span></td>
                <td style="font-weight: bold; color: #0f172a;">${comp}</td>
                <td>${rca}</td>
                <td style="color: #15803d;">${corrective}</td>
                <td>${inv}</td>
              </tr>
            `;
          }).join('') : `
            <tr>
              <td colspan="8" style="text-align: center; color: #94a3b8; padding: 16px;">Tidak ada data laporan investigasi FAR tercatat.</td>
            </tr>
          `}
        </tbody>
      </table>

      <!-- LEMBAR TANDA TANGAN APPROVAL REKAP -->
      <div class="signatures">
        <div>
          <div class="sig-role">Disusun Oleh:</div>
          <div class="sig-box">Reliability / Maintenance Planner</div>
        </div>
        <div>
          <div class="sig-role">Diperiksa Oleh:</div>
          <div class="sig-box">Workshop Supervisor</div>
        </div>
        <div>
          <div class="sig-role">Disetujui Oleh:</div>
          <div class="sig-box">Plant Superintendent / Dept Head</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print Official Berita Acara Swab Component Form with Approval Signatures
 */
export function printSwabDocument(swab: SwabRecord, donorEq?: Equipment, recipientEq?: Equipment) {
  const printWindow = window.open('', '_blank', 'width=950,height=850');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak Berita Acara Swab Komponen');
    return;
  }

  const rawId = String(swab.item_id || swab.id || Date.now().toString().slice(-4));
  const docNo = rawId.startsWith('SWAB-') || rawId.startsWith('BA-') ? rawId : `BA-SWAB-${rawId}`;
  const isActive = (swab.status || '').toLowerCase() === 'active';
  const statusLabel = isActive ? 'AKTIF TERPASANG' : 'SUDAH DIKEMBALIKAN (RESTORED)';
  const statusBg = isActive ? '#fee2e2' : '#dcfce7';
  const statusColor = isActive ? '#991b1b' : '#166534';

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const pic = swab.pic || swab.authorized_by || swab.mechanic || 'Foreman Workshop';

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Berita Acara Swab Komponen - ${docNo}</title>
      <style>
        @page { size: A4 portrait; margin: 12mm 15mm; }
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11.5px; line-height: 1.45; }
        .header { border-bottom: 2.5px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 17px; margin: 0; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
        .logo-title h2 { font-size: 11px; margin: 3px 0 0 0; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .doc-badge { text-align: right; }
        .doc-badge .badge-tag { display: inline-block; background: #db2777; color: white; padding: 3px 10px; border-radius: 4px; font-size: 10px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .doc-badge .doc-no { font-size: 16px; font-weight: 800; color: #0f172a; font-family: monospace; margin-top: 4px; }
        .section-header { font-weight: 800; font-size: 11px; text-transform: uppercase; background-color: #f1f5f9; padding: 6px 10px; border-left: 4px solid #db2777; margin: 14px 0 8px 0; letter-spacing: 0.5px; color: #1e293b; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 10px; }
        .unit-card { border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; background: #fafafa; }
        .unit-card.donor { border-color: #fde047; background: #fffdf0; }
        .unit-card.recipient { border-color: #86efac; background: #f0fdf4; }
        .unit-title { font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
        .unit-title.donor { color: #854d0e; }
        .unit-title.recipient { color: #166534; }
        table.meta-table { width: 100%; border-collapse: collapse; }
        table.meta-table td { padding: 4px 6px; font-size: 11px; border-bottom: 1px dashed #e2e8f0; }
        table.meta-table td.lbl { width: 42%; color: #64748b; font-weight: 600; }
        table.meta-table td.val { font-weight: 700; color: #0f172a; }
        .content-box { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-size: 11.5px; background: #fff; min-height: 40px; margin-bottom: 8px; line-height: 1.5; color: #1e293b; }
        .status-pill { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
        .signatures-container { margin-top: 25px; page-break-inside: avoid; }
        .signatures-title { text-align: center; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; text-align: center; }
        .sig-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 8px 12px 8px; background: #fafafa; }
        .sig-role { font-size: 9.5px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .sig-dept { font-size: 10.5px; font-weight: 700; color: #0f172a; margin-top: 2px; }
        .sig-space { height: 58px; display: flex; align-items: center; justify-content: center; color: #cbd5e1; font-size: 10px; font-style: italic; border-bottom: 1px solid #94a3b8; margin: 8px 15px 8px 15px; }
        .sig-name { font-size: 11px; font-weight: 800; color: #0f172a; }
        .sig-date { font-size: 9.5px; color: #64748b; margin-top: 2px; }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0 !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fdf2f8; border:1px solid #fbcfe8; padding:10px 16px; margin-bottom:18px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:bold; color:#be185d; font-size:13px;">Pratinjau Berita Acara Kanibalisasi / Swab Component</span>
          <span style="color:#831843; font-size:11px; margin-left:8px;">Dokumen Pengesahan Resmi Pemindahan Suku Cadang Antar Unit</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.print()" style="background:#db2777; color:white; border:none; padding:8px 18px; border-radius:6px; font-weight:bold; font-size:12px; cursor:pointer; box-shadow:0 2px 4px rgba(219,39,119,0.25);">Cetak Dokumen (Print / PDF)</button>
          <button onclick="window.close()" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 14px; border-radius:6px; font-weight:600; font-size:12px; cursor:pointer;">Tutup</button>
        </div>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>PT. BENAMAKMUR SELARAS SEJAHTERA</h1>
          <h2>Plant & Maintenance Department — Mining Heavy Equipment Division</h2>
        </div>
        <div class="doc-badge">
          <div class="badge-tag">Berita Acara Kanibalisasi Part</div>
          <div class="doc-no">${docNo}</div>
        </div>
      </div>

      <div class="section-header">1. Informasi Komponen & Status Swab</div>
      <table class="meta-table" style="margin-bottom:12px;">
        <tr>
          <td class="lbl" style="width:25%;">Nama Komponen / Part:</td>
          <td class="val" style="width:35%; font-size:13px; color:#db2777;">${swab.component_name}</td>
          <td class="lbl" style="width:20%;">Tanggal Pemindahan:</td>
          <td class="val" style="width:20%;">${swab.tanggal}</td>
        </tr>
        <tr>
          <td class="lbl">Status Kanibalisasi:</td>
          <td class="val"><span class="status-pill" style="background:${statusBg}; color:${statusColor};">${statusLabel}</span></td>
          <td class="lbl">Target Restorasi:</td>
          <td class="val">${swab.restoration_date || swab.target_date || 'Maksimal 7 Hari Kerja'}</td>
        </tr>
      </table>

      <div class="section-header">2. Perbandingan Unit Donor (Asal) dan Unit Tujuan (Penerima)</div>
      <div class="grid-2">
        <div class="unit-card donor">
          <div class="unit-title donor">
            <span>UNIT DONOR (ASAL PART)</span>
            <span style="font-size:9px; background:#fef08a; color:#854d0e; padding:2px 6px; border-radius:3px;">SUMBER PART</span>
          </div>
          <table class="meta-table">
            <tr><td class="lbl">No. Lambung:</td><td class="val" style="color:#854d0e; font-size:13px;">${swab.donor_unit}</td></tr>
            <tr><td class="lbl">Tipe / Model:</td><td class="val">${donorEq?.model || donorEq?.type || '-'}</td></tr>
            <tr><td class="lbl">Status Unit Asal:</td><td class="val">${donorEq?.status || 'Standby / Breakdown'}</td></tr>
            <tr><td class="lbl">Lokasi Unit:</td><td class="val">${donorEq?.lokasi || donorEq?.site || 'Workshop Site'}</td></tr>
          </table>
        </div>

        <div class="unit-card recipient">
          <div class="unit-title recipient">
            <span>UNIT PENERIMA (TUJUAN)</span>
            <span style="font-size:9px; background:#bbf7d0; color:#166534; padding:2px 6px; border-radius:3px;">PRIORITAS PRODUKSI</span>
          </div>
          <table class="meta-table">
            <tr><td class="lbl">No. Lambung:</td><td class="val" style="color:#166534; font-size:13px;">${swab.recipient_unit || swab.target_unit || '-'}</td></tr>
            <tr><td class="lbl">Tipe / Model:</td><td class="val">${recipientEq?.model || recipientEq?.type || '-'}</td></tr>
            <tr><td class="lbl">Status Target:</td><td class="val">${recipientEq?.status || 'Ready for Production'}</td></tr>
            <tr><td class="lbl">Lokasi Operasi:</td><td class="val">${recipientEq?.lokasi || recipientEq?.site || 'Pit / Hauling Road'}</td></tr>
          </table>
        </div>
      </div>

      <div class="section-header">3. Alasan & Justifikasi Kebutuhan Mendesak</div>
      <div class="content-box">
        ${swab.reason || 'Pemindahan komponen ini dilakukan demi menjaga kesinambungan ritase produksi batubara di pit dan menghindari antrean operasional kapal loading, sembari menunggu suku cadang resmi tiba dari pemasok.'}
      </div>

      <div class="section-header">4. Komitmen Restorasi & Pengadaan Suku Cadang Pengganti</div>
      <div class="content-box" style="background:#fafafa;">
        1. Tim Logistik Plant telah menerbitkan dokumen Purchase Requisition (PR) untuk pengadaan unit part baru pengganti.<br>
        2. Segera setelah suku cadang baru tiba di gudang site, komponen pada Unit Donor (<strong>${swab.donor_unit}</strong>) wajib dipasang kembali dan ditest fungsi hingga status RFU.<br>
        3. Segala perubahan nomor seri komponen dicatat pada kartu historis pemeliharaan masing-masing unit.
      </div>

      <div style="font-size:10px; color:#64748b; margin-top:10px; display:flex; justify-content:space-between;">
        <span>* Berita acara ini memiliki kekuatan hukum operasional internal PT. Benamakmur Selaras Sejahtera.</span>
        <span>Dicetak pada: ${todayStr}</span>
      </div>

      <!-- LEMBAR PENGESAHAN & TANDA TANGAN APPROVAL -->
      <div class="signatures-container">
        <div class="signatures-title">LEMBAR PENGESAHAN & TANDA TANGAN APPROVAL SWAB</div>
        <div class="signatures">
          <div class="sig-card">
            <div class="sig-role">Teknisi Pelaksana:</div>
            <div class="sig-dept">Mekanik / Lead Hand Workshop</div>
            <div class="sig-space">[ Tanda Tangan & Tanggal ]</div>
            <div class="sig-name">${pic}</div>
            <div class="sig-date">Tgl: ${swab.tanggal}</div>
          </div>
          <div class="sig-card">
            <div class="sig-role">Diperiksa & Diverifikasi:</div>
            <div class="sig-dept">Foreman / Supervisor Workshop</div>
            <div class="sig-space">[ Tanda Tangan & Tanggal ]</div>
            <div class="sig-name">${swab.supervisor || 'Foreman Workshop'}</div>
            <div class="sig-date">Tgl: .......................................</div>
          </div>
          <div class="sig-card">
            <div class="sig-role">Disetujui & Diotorisasi:</div>
            <div class="sig-dept">Plant Superintendent / Dept Head</div>
            <div class="sig-space">[ Tanda Tangan & Stempel Resmi ]</div>
            <div class="sig-name">${swab.approved_by || 'Plant Superintendent'}</div>
            <div class="sig-date">Tgl: .......................................</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print Rekapitulasi Kanibalisasi / Swab Components with Approval Signatures
 */
export function printSwabSummaryReport(swabs: SwabRecord[]) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak rekapitulasi Swab Komponen');
    return;
  }

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const activeCount = swabs.filter(s => (s.status || '').toLowerCase() === 'active').length;
  const restoredCount = swabs.length - activeCount;

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Rekapitulasi Swab Komponen - ${todayStr}</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: 'Plus Jakarta Sans', Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 17px; margin: 0; font-weight: 800; color: #0f172a; }
        .logo-title h2 { font-size: 11px; margin: 2px 0 0 0; color: #475569; font-weight: 600; text-transform: uppercase; }
        .stats-banner { display: flex; gap: 15px; margin-bottom: 15px; }
        .stat-item { padding: 6px 12px; border-radius: 6px; border: 1px solid #cbd5e1; background: #f8fafc; font-size: 11px; }
        table.data-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table.data-table th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10px; text-transform: uppercase; text-align: left; color: #475569; }
        table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10.5px; vertical-align: middle; }
        .donor-badge { background: #fef9c3; color: #854d0e; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #fef08a; }
        .recipient-badge { background: #dcfce7; color: #166534; font-weight: bold; padding: 2px 6px; border-radius: 4px; border: 1px solid #bbf7d0; }
        .status-badge { font-weight: 800; font-size: 9.5px; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; }
        .status-active { background: #fee2e2; color: #991b1b; }
        .status-restored { background: #dcfce7; color: #166534; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 35px; text-align: center; page-break-inside: avoid; }
        .sig-box { border-top: 1px solid #94a3b8; padding-top: 6px; margin-top: 45px; font-weight: bold; font-size: 11px; }
        .sig-role { font-size: 10px; color: #64748b; font-weight: normal; }
        @media print {
          .no-print { display: none !important; }
          body { padding: 0 !important; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fdf2f8; border:1px solid #fbcfe8; padding:10px 15px; margin-bottom:18px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <span style="font-weight:bold; color:#be185d;">Pratinjau Rekapitulasi Kanibalisasi / Swab Komponen</span>
          <span style="color:#831843; font-size:11px; margin-left:8px;">Total ${swabs.length} Catatan Pemindahan Part</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="window.print()" style="background:#db2777; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer;">Cetak Rekap (Print / PDF)</button>
          <button onclick="window.close()" style="background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:8px 14px; border-radius:4px; font-weight:600; cursor:pointer;">Tutup</button>
        </div>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>REKAPITULASI KANIBALISASI & PEMINDAHAN KOMPONEN (SWAB)</h1>
          <h2>PT. BENAMAKMUR SELARAS SEJAHTERA — Plant & Maintenance Heavy Equipment Division</h2>
        </div>
        <div style="text-align: right; font-size: 11px; color: #475569;">
          <div>Tanggal Cetak: <strong>${todayStr}</strong></div>
        </div>
      </div>

      <div class="stats-banner">
        <div class="stat-item">Total Swab Tercatat: <strong>${swabs.length} Item</strong></div>
        <div class="stat-item" style="border-color:#f87171; background:#fef2f2; color:#991b1b;">Aktif Terpasang: <strong>${activeCount} Part</strong></div>
        <div class="stat-item" style="border-color:#86efac; background:#f0fdf4; color:#166534;">Sudah Dikembalikan: <strong>${restoredCount} Part</strong></div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 25px; text-align: center;">No</th>
            <th style="width: 80px;">Tanggal</th>
            <th style="width: 150px;">Nama Komponen</th>
            <th style="width: 100px;">Unit Donor (Asal)</th>
            <th style="width: 100px;">Unit Tujuan (Penerima)</th>
            <th>Alasan Kanibalisasi</th>
            <th style="width: 110px;">Status</th>
            <th style="width: 120px;">PIC / Otorisasi</th>
          </tr>
        </thead>
        <tbody>
          ${swabs.length > 0 ? swabs.map((s, idx) => {
            const isActive = (s.status || '').toLowerCase() === 'active';
            return `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td>${s.tanggal}</td>
                <td style="font-weight: bold; color: #0f172a;">${s.component_name}</td>
                <td><span class="donor-badge">${s.donor_unit}</span></td>
                <td><span class="recipient-badge">${s.recipient_unit || (s as any).target_unit || '-'}</span></td>
                <td>${s.reason || '-'}</td>
                <td>
                  <span class="status-badge ${isActive ? 'status-active' : 'status-restored'}">
                    ${isActive ? 'Aktif Terpasang' : 'Sudah Dikembalikan'}
                  </span>
                </td>
                <td>${s.pic || (s as any).authorized_by || '-'}</td>
              </tr>
            `;
          }).join('') : `
            <tr>
              <td colspan="8" style="text-align: center; color: #94a3b8; padding: 16px;">Tidak ada data catatan swab komponen.</td>
            </tr>
          `}
        </tbody>
      </table>

      <!-- LEMBAR TANDA TANGAN APPROVAL REKAP -->
      <div class="signatures">
        <div>
          <div class="sig-role">Disusun Oleh:</div>
          <div class="sig-box">Foreman Workshop Site</div>
        </div>
        <div>
          <div class="sig-role">Diperiksa Oleh:</div>
          <div class="sig-box">Maintenance Planner / Supervisor</div>
        </div>
        <div>
          <div class="sig-role">Disetujui Oleh:</div>
          <div class="sig-box">Plant Superintendent / Dept Head</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Print Plan Component Replacement (PCR) Register & Schedule Report
 */
export function printPcrSummaryReport(
  pcrList: PcrItem[],
  equipments: Equipment[] = [],
  dailyHms: DailyHM[] = []
) {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Harap izinkan popup browser untuk mencetak Laporan PCR');
    return;
  }

  const todayStr = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const totalItems = pcrList.length;
  let criticalCount = 0;
  let warningCount = 0;
  let totalEstCost = 0;

  pcrList.forEach(p => {
    const remain = Number(p.remaining_hm ?? 10000);
    if (remain <= 500) criticalCount++;
    else if (remain <= 1500) warningCount++;
    totalEstCost += Number(p.estimated_cost ?? 0);
  });

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>PCR Register & Schedule Report - PT ALAM JAYA</title>
      <style>
        @page { size: A4 landscape; margin: 12mm; }
        body { font-family: 'Arial', sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; }
        .header { border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
        .logo-title h1 { font-size: 16px; margin: 0; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
        .logo-title h2 { font-size: 13px; margin: 3px 0 0 0; color: #ea580c; font-weight: 800; }
        .logo-title p { font-size: 10px; margin: 2px 0 0 0; color: #64748b; }
        .doc-badge { text-align: right; }
        .doc-badge .doc-title { font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; }
        .doc-badge .doc-sub { font-size: 10px; color: #64748b; margin-top: 2px; }
        .kpi-container { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
        .kpi-card { border: 1px solid #cbd5e1; border-radius: 6px; padding: 8px 12px; background: #f8fafc; }
        .kpi-title { font-size: 9px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
        .kpi-val { font-size: 16px; font-weight: 800; color: #0f172a; }
        .kpi-sub { font-size: 9px; color: #94a3b8; }
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 8px; margin-bottom: 20px; }
        table.data-table th { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 6px 8px; text-align: left; font-size: 9px; text-transform: uppercase; color: #475569; font-weight: 800; }
        table.data-table td { border: 1px solid #cbd5e1; padding: 6px 8px; font-size: 10px; vertical-align: middle; }
        .unit-badge { font-weight: 800; font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; }
        .status-badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 8.5px; font-weight: 800; text-transform: uppercase; text-align: center; }
        .status-critical { background: #fee2e2; color: #991b1b; border: 1px solid #f87171; }
        .status-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .status-monitoring { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
        .status-scheduled { background: #e0e7ff; color: #3730a3; border: 1px solid #a5b4fc; }
        .signatures { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 30px; text-align: center; page-break-inside: avoid; }
        .sig-box { border-top: 1px solid #94a3b8; padding-top: 6px; margin-top: 50px; font-weight: bold; font-size: 10px; }
        .sig-role { font-size: 9px; color: #64748b; font-weight: bold; text-transform: uppercase; }
        @media print {
          .no-print { display: none; }
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="background:#fff7ed; border:1px solid #fed7aa; padding:10px 15px; margin-bottom:20px; border-radius:6px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:bold; color:#c2410c;">Pratinjau Cetak Plan Component Replacement (PCR) Register</span>
        <button onclick="window.print()" style="background:#ea580c; color:white; border:none; padding:8px 16px; border-radius:4px; font-weight:bold; cursor:pointer;">Cetak Sekarang (Print / PDF)</button>
      </div>

      <div class="header">
        <div class="logo-title">
          <h1>PT. ALAM JAYA COAL MINING</h1>
          <h2>PLANT MAINTENANCE & RELIABILITY DEPARTMENT</h2>
          <p>Sistem Informasi Manajemen Pemeliharaan Alat Berat (SIM-PAB)</p>
        </div>
        <div class="doc-badge">
          <div class="doc-title">PLAN COMPONENT REPLACEMENT (PCR)</div>
          <div class="doc-sub">Tanggal Cetak: ${todayStr}</div>
          <div class="doc-sub" style="color: #ea580c; font-weight: bold;">Terintegrasi Otomatis dengan Daily HM & Fuel</div>
        </div>
      </div>

      <div class="kpi-container">
        <div class="kpi-card">
          <div class="kpi-title">Total Komponen</div>
          <div class="kpi-val">${totalItems} <span style="font-size: 11px; color: #64748b;">Unit</span></div>
          <div class="kpi-sub">Major Component Terjadwal</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Kritis (&le; 500 Jam)</div>
          <div class="kpi-val" style="color: #dc2626;">${criticalCount} <span style="font-size: 11px; color: #64748b;">Komponen</span></div>
          <div class="kpi-sub">Wajib Segera Dieksekusi</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Mendekati Penggantian (&le; 1500 Jam)</div>
          <div class="kpi-val" style="color: #d97706;">${warningCount} <span style="font-size: 11px; color: #64748b;">Komponen</span></div>
          <div class="kpi-sub">Persiapan Purchase Request (PR)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Total Estimasi Budget</div>
          <div class="kpi-val" style="color: #059669;">Rp ${totalEstCost.toLocaleString('id-ID')}</div>
          <div class="kpi-sub">Proyeksi Anggaran Penggantian</div>
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th style="width: 30px; text-align: center;">No</th>
            <th style="width: 80px;">No. Unit</th>
            <th>Nama Major Komponen</th>
            <th style="width: 85px; text-align: right;">HM Pasang</th>
            <th style="width: 95px; text-align: right;">HM Unit Terkini</th>
            <th style="width: 95px; text-align: right;">Running HM</th>
            <th style="width: 95px; text-align: right;">Target Lifetime</th>
            <th style="width: 95px; text-align: right;">Sisa Jam</th>
            <th style="width: 75px; text-align: center;">% Pakai</th>
            <th style="width: 95px;">Estimasi Tgl</th>
            <th style="width: 110px;">Status</th>
            <th style="width: 110px; text-align: right;">Estimasi Biaya</th>
          </tr>
        </thead>
        <tbody>
          ${pcrList.length > 0 ? pcrList.map((p, idx) => {
            const target = Number(p.target_lifetime_hm || 10000);
            const current = Number(p.current_hm || 0);
            const remain = Number(p.remaining_hm ?? Math.max(0, target - current));
            const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
            const isCritical = remain <= 500;
            const isWarning = remain <= 1500;
            
            let statusClass = 'status-monitoring';
            if (isCritical) statusClass = 'status-critical';
            else if (isWarning) statusClass = 'status-warning';
            else if ((p.status || '').toUpperCase() === 'SCHEDULED') statusClass = 'status-scheduled';

            return `
              <tr>
                <td style="text-align: center;">${idx + 1}</td>
                <td><span class="unit-badge">${p.equip_no || '-'}</span></td>
                <td style="font-weight: bold; color: #0f172a;">${p.component_name || '-'}</td>
                <td style="text-align: right; font-family: monospace;">${Number(p.install_hm || 0).toLocaleString()} Jam</td>
                <td style="text-align: right; font-family: monospace; color: #2563eb; font-weight: bold;">
                  ${Number(p.unit_latest_hm || current + Number(p.install_hm || 0)).toLocaleString()} Jam
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: #0f172a;">
                  ${current.toLocaleString()} Jam
                </td>
                <td style="text-align: right; font-family: monospace;">${target.toLocaleString()} Jam</td>
                <td style="text-align: right; font-family: monospace; font-weight: bold; color: ${isCritical ? '#dc2626' : (isWarning ? '#d97706' : '#166534')};">
                  ${remain.toLocaleString()} Jam
                </td>
                <td style="text-align: center; font-weight: bold;">${pct}%</td>
                <td>${p.scheduled_date || '-'}</td>
                <td>
                  <span class="status-badge ${statusClass}">
                    ${p.status || (isCritical ? 'CRITICAL' : (isWarning ? 'WARNING' : 'MONITORING'))}
                  </span>
                </td>
                <td style="text-align: right; font-family: monospace; font-weight: bold;">
                  Rp ${Number(p.estimated_cost || 0).toLocaleString('id-ID')}
                </td>
              </tr>
            `;
          }).join('') : `
            <tr>
              <td colspan="12" style="text-align: center; color: #94a3b8; padding: 16px;">Tidak ada data jadwal PCR terdaftar.</td>
            </tr>
          `}
        </tbody>
      </table>

      <!-- LEMBAR APPROVAL -->
      <div class="signatures">
        <div>
          <div class="sig-role">Disusun Oleh:</div>
          <div class="sig-box">Maintenance Planner</div>
        </div>
        <div>
          <div class="sig-role">Diperiksa Oleh:</div>
          <div class="sig-box">Maintenance Supervisor</div>
        </div>
        <div>
          <div class="sig-role">Disetujui Oleh:</div>
          <div class="sig-box">Plant Superintendent / Dept Head</div>
        </div>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
