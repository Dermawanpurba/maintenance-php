import { WorkOrder, Equipment } from '../types';

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
