import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TopManagementView } from './components/TopManagementView';
import { EquipmentView } from './components/EquipmentView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { BacklogView } from './components/BacklogView';
import { DailyHmView } from './components/DailyHmView';
import { MechanicActivityView } from './components/MechanicActivityView';
import { P2hInspectionView } from './components/P2hInspectionView';
import { PartsStockView } from './components/PartsStockView';
import { ToolsTrackerView } from './components/ToolsTrackerView';
import { SwabView } from './components/SwabView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { MeetingNotesView } from './components/MeetingNotesView';
import { MonthlyBudgetView } from './components/MonthlyBudgetView';
import { PcrView } from './components/PcrView';
import { BasicMaintenanceView } from './components/BasicMaintenanceView';
import { SystemHealthView } from './components/SystemHealthView';
import { MobileLiquidDock } from './components/MobileLiquidDock';
import { Database3dView } from './components/Database3dView';
import { ManageUsersView } from './components/ManageUsersView';
import { MasterCrewCompView } from './components/MasterCrewCompView';
import { QuickBDAwalModal } from './components/QuickBDAwalModal';
import { SettingsView } from './components/SettingsView';
import { ScheduledOilSamplingView } from './components/ScheduledOilSamplingView';
import { PpuView } from './components/PpuView';
import { TargetJamOperasiView } from './components/TargetJamOperasiView';
import { printExecutiveReport } from './utils/printUtils';
import { api } from './services/api';
import {
  Equipment,
  WorkOrder,
  Backlog,
  DailyHM,
  MechanicActivity,
  MasterMekanik,
  PartItem,
  ToolItem,
  SwabRecord,
  FARRecord,
  MeetingNote,
  MonthlyBudgetItem,
  PcrItem,
  PlanAlat,
  PlanService,
  SystemLogItem,
  MasterPelapor,
  MasterComponentItem,
  SettingsData,
  OilSample,
  MaintenanceWeek,
  PpuRecord,
  TargetJamOperasi,
  TargetJamHarian
} from './types';
import { RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);
  const [latency, setLatency] = useState(12);

  // Core Datasets
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [backlogs, setBacklogs] = useState<Backlog[]>([]);
  const [dailyHms, setDailyHms] = useState<DailyHM[]>([]);
  const [activities, setActivities] = useState<MechanicActivity[]>([]);
  const [mechanics, setMechanics] = useState<MasterMekanik[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [swabs, setSwabs] = useState<SwabRecord[]>([]);
  const [fars, setFars] = useState<FARRecord[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudgetItem[]>([]);
  const [pcrList, setPcrList] = useState<PcrItem[]>([]);
  const [planAlats, setPlanAlats] = useState<PlanAlat[]>([]);
  const [planServices, setPlanServices] = useState<PlanService[]>([]);
  const [systemLogs, setSystemLogs] = useState<SystemLogItem[]>([]);
  const [pelapors, setPelapors] = useState<MasterPelapor[]>([]);
  const [components, setComponents] = useState<MasterComponentItem[]>([]);
  const [settings, setSettings] = useState<SettingsData>({});
  const [oilSamples, setOilSamples] = useState<OilSample[]>([]);
  const [pmRecords, setPmRecords] = useState<any[]>([]);
  const [maintenanceWeeks, setMaintenanceWeeks] = useState<MaintenanceWeek[]>([]);
  const [targetJamOperasi, setTargetJamOperasi] = useState<TargetJamOperasi[]>([]);
  const [targetJamHarian, setTargetJamHarian] = useState<TargetJamHarian[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [isBDAwalModalOpen, setIsBDAwalModalOpen] = useState(false);

  const loadData = async () => {
    const startTime = performance.now();
    try {
      setRefreshing(true);
      const data = await api.getOptimizedData();
      const calcLatency = Math.round(performance.now() - startTime);
      setLatency(calcLatency);

      if (data && data.success) {
        setApiOnline(true);
        setEquipments(data.equip || []);
        setWorkOrders(data.wo || []);
        setBacklogs(data.backlog || []);
        setDailyHms(data.dailyHM || []);
        setActivities(data.activities || []);
        setMechanics(data.mekanikList || []);
        setParts(data.parts || []);
        setTools(data.masterTools || []);
        setSwabs(data.swabComponents || []);
        setFars(data.farRecords || []);
        setMeetingNotes(data.meetingNotes || []);
        setMonthlyBudgets(data.monthlyBudget || []);
        setPcrList(data.pcr || []);
        setPlanAlats(data.planAlat || []);
        setPlanServices(data.planService || []);
        setSystemLogs(data.systemLogs || []);
        setPelapors(data.pelaporList || []);
        setComponents(data.components || []);
        setSettings(data.settings || {});
        setOilSamples(data.oilSamples || []);
        setPmRecords(data.pmRecords || []);
        setMaintenanceWeeks(data.maintenanceWeeks || []);
        setTargetJamOperasi(data.targetJamOperasi || []);
        setTargetJamHarian(data.targetJamHarian || []);
        setInspections(data.inspections || []);
      }
    } catch (err) {
      console.error('Failed to fetch data from API:', err);
      setApiOnline(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 45000);
    return () => clearInterval(interval);
  }, []);

  const handleBackup = () => {
    api.triggerBackupDownload();
  };

  const handlePrintExecReport = () => {
    const totalUnits = equipments.length || 1;
    let rfu = 0;
    let rwn = 0;
    let bd = 0;

    equipments.forEach(eq => {
      const s = (eq.status || '').toUpperCase();
      if (s === 'READY' || s === 'RUNNING' || s === 'ACTIVE' || s === 'RFU' || s === 'OPERASI') {
        rfu++;
      } else if (s === 'RWN' || s.includes('NOTE')) {
        rwn++;
      } else {
        bd++;
      }
    });

    const pa = Math.round(((rfu + rwn) / totalUnits) * 100);
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const end = now.toISOString().split('T')[0];

    printExecutiveReport(
      {
        pa,
        rfu,
        rwn,
        bd,
        totalHours: 720 * totalUnits,
        downtimeHours: bd * 24
      },
      equipments,
      workOrders,
      { start, end }
    );
  };

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-[#f1f5f9] text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Capsule Collapsible Sidebar (Desktop) / Slide-over Drawer (Mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={tab => setCurrentTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        counts={{
          equip: equipments.length,
          wo: workOrders.length,
          backlog: backlogs.length,
          parts: parts.length,
        }}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          apiOnline={apiOnline}
          latency={latency}
          onRefresh={loadData}
          refreshing={refreshing}
          onOpenBDAwal={() => setIsBDAwalModalOpen(true)}
          onPrintExecSummary={handlePrintExecReport}
        />

        {/* Viewport Scroll Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 relative bg-[#f1f5f9] pb-24 md:pb-8">
          <div className="max-w-[1440px] mx-auto">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Menghubungkan ke backend WOSys ERP...
                </p>
              </div>
            ) : (
              <>
                {currentTab === 'top_management' && (
                  <TopManagementView
                    equipments={equipments}
                    workOrders={workOrders}
                    backlogs={backlogs}
                    dailyHms={dailyHms}
                    meetingNotes={meetingNotes}
                    onNavigate={tab => setCurrentTab(tab)}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'dashboard' && (
                  <DashboardView
                    equipments={equipments}
                    workOrders={workOrders}
                    backlogs={backlogs}
                    dailyHms={dailyHms}
                    planAlats={planAlats}
                    planServices={planServices}
                    onNavigate={tab => setCurrentTab(tab)}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'database_3d' && (
                  <Database3dView
                    equipments={equipments}
                    workOrders={workOrders}
                    backlogs={backlogs}
                    dailyHms={dailyHms}
                    parts={parts}
                    tools={tools}
                    onNavigate={tab => setCurrentTab(tab)}
                  />
                )}
                {currentTab === 'monthly_budget' && (
                  <MonthlyBudgetView budgets={monthlyBudgets} onRefresh={loadData} />
                )}
                {currentTab === 'pcr' && (
                  <PcrView pcrList={pcrList} equipments={equipments} onRefresh={loadData} />
                )}
                {currentTab === 'sos' && (
                  <ScheduledOilSamplingView
                    equipments={equipments}
                    oilSamples={oilSamples}
                    onRefresh={loadData}
                    onNavigateToWO={(unit, problem) => {
                      setCurrentTab('wo');
                    }}
                  />
                )}
                {[
                  'bm_dashboard',
                  'bm_inspection',
                  'bm_greasing',
                  'bm_washing',
                  'bm_ac_electrical',
                  'bm_bucket_blade',
                  'bm_undercarriage',
                  'bm_retorque',
                  'bm_tyre',
                  'pm_washing',
                  'pm_greasing',
                  'pm_inspection',
                  'pm_torque',
                  'pm_battery'
                ].includes(currentTab) && (
                  <BasicMaintenanceView
                    category={currentTab as any}
                    equipments={equipments}
                    pmRecords={pmRecords}
                    maintenanceWeeks={maintenanceWeeks}
                    onRefresh={loadData}
                    onNavigate={tab => setCurrentTab(tab as any)}
                  />
                )}
                {currentTab === 'fleet' && (
                  <EquipmentView
                    equipments={equipments}
                    planAlats={planAlats}
                    planServices={planServices}
                    onRefresh={loadData}
                    onNavigate={tab => setCurrentTab(tab as any)}
                  />
                )}
                {currentTab === 'wo' && (
                  <WorkOrdersView
                    workOrders={workOrders}
                    equipments={equipments}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'backlog' && (
                  <BacklogView
                    backlogs={backlogs}
                    equipments={equipments}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'daily_hm' && (
                  <DailyHmView
                    dailyHms={dailyHms}
                    equipments={equipments}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'aktifitas' && (
                  <MechanicActivityView
                    activities={activities}
                    mechanics={mechanics}
                    workOrders={workOrders}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'p2h' && (
                  <P2hInspectionView equipments={equipments} inspections={inspections} onRefresh={loadData} />
                )}
                {currentTab === 'parts' && (
                  <PartsStockView parts={parts} onRefresh={loadData} />
                )}
                {currentTab === 'tools' && (
                  <ToolsTrackerView tools={tools} onRefresh={loadData} />
                )}
                {currentTab === 'master_crew' && (
                  <MasterCrewCompView
                    mechanics={mechanics}
                    pelapors={pelapors}
                    components={components}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'swab' && (
                  <SwabView swabs={swabs} equipments={equipments} onRefresh={loadData} />
                )}
                {currentTab === 'far' && (
                  <FailureAnalysisView fars={fars} equipments={equipments} onRefresh={loadData} />
                )}
                {currentTab === 'ppu' && (
                  <PpuView equipments={equipments} onRefresh={loadData} />
                )}
                {currentTab === 'target_jam_operasi' && (
                  <TargetJamOperasiView
                    equipments={equipments}
                    targetJamOperasi={targetJamOperasi}
                    targetJamHarian={targetJamHarian}
                    onRefresh={loadData}
                  />
                )}
                {currentTab === 'meetings' && (
                  <MeetingNotesView notes={meetingNotes} onRefresh={loadData} />
                )}
                {currentTab === 'manage_users' && (
                  <ManageUsersView onRefresh={loadData} />
                )}
                {currentTab === 'settings' && (
                  <SettingsView initialSettings={settings} onRefresh={loadData} />
                )}
                {currentTab === 'system' && (
                  <SystemHealthView
                    latency={latency}
                    apiOnline={apiOnline}
                    systemLogs={systemLogs}
                    onRefresh={loadData}
                  />
                )}
              </>
            )}
          </div>
        </main>

        {/* Footer Bar */}
        <footer className="h-9 flex-shrink-0 border-t border-slate-200/80 bg-white px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-500 font-medium z-10">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">WOSys ERP</span>
            <span>•</span>
            <span>PT. Benamakmur Selaras Sejahtera</span>
            <span>•</span>
            <span className="text-blue-600 font-bold">React 18 + SQLite WAL</span>
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-slate-400">
            <span>Plant Maintenance System</span>
          </div>
        </footer>

        {/* Mobile Liquid Navigation Dock (floating bottom) */}
        <MobileLiquidDock
          currentTab={currentTab}
          onSelectTab={tab => setCurrentTab(tab)}
        />

        {/* Quick Breakdown Reporting Modal */}
        <QuickBDAwalModal
          isOpen={isBDAwalModalOpen}
          onClose={() => setIsBDAwalModalOpen(false)}
          equipments={equipments}
          onSuccess={() => {
            loadData();
          }}
        />
      </div>
    </div>
  );
};

export default App;
