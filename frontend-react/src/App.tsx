import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EquipmentView } from './components/EquipmentView';
import { WorkOrdersView } from './components/WorkOrdersView';
import { BacklogView } from './components/BacklogView';
import { DailyHmView } from './components/DailyHmView';
import { P2hInspectionView } from './components/P2hInspectionView';
import { PartsStockView } from './components/PartsStockView';
import { ToolsTrackerView } from './components/ToolsTrackerView';
import { SwabView } from './components/SwabView';
import { FailureAnalysisView } from './components/FailureAnalysisView';
import { MeetingNotesView } from './components/MeetingNotesView';
import { SystemHealthView } from './components/SystemHealthView';
import { api } from './services/api';
import {
  Equipment,
  WorkOrder,
  Backlog,
  DailyHM,
  PartItem,
  ToolItem,
  SwabRecord,
  FARRecord,
  MeetingNote
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
  const [parts, setParts] = useState<PartItem[]>([]);
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [swabs, setSwabs] = useState<SwabRecord[]>([]);
  const [fars, setFars] = useState<FARRecord[]>([]);
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);

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
        setParts(data.parts || []);
        setTools(data.masterTools || []);
        setSwabs(data.swabComponents || []);
        setFars(data.farRecords || []);
        setMeetingNotes(data.meetingNotes || []);
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

  return (
    <div className="flex h-screen h-[100dvh] overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-white">
      {/* Collapsible / Responsive Sidebar */}
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          apiOnline={apiOnline}
          latency={latency}
          onRefresh={loadData}
          refreshing={refreshing}
          onBackup={handleBackup}
        />

        {/* Viewport Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Menghubungkan ke backend WOSys ERP...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  equipments={equipments}
                  workOrders={workOrders}
                  backlogs={backlogs}
                  dailyHms={dailyHms}
                  onNavigate={tab => setCurrentTab(tab)}
                />
              )}
              {currentTab === 'fleet' && (
                <EquipmentView equipments={equipments} onRefresh={loadData} />
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
              {currentTab === 'p2h' && (
                <P2hInspectionView equipments={equipments} onRefresh={loadData} />
              )}
              {currentTab === 'parts' && (
                <PartsStockView parts={parts} onRefresh={loadData} />
              )}
              {currentTab === 'tools' && (
                <ToolsTrackerView tools={tools} onRefresh={loadData} />
              )}
              {currentTab === 'swab' && (
                <SwabView swabs={swabs} equipments={equipments} onRefresh={loadData} />
              )}
              {currentTab === 'far' && (
                <FailureAnalysisView fars={fars} equipments={equipments} onRefresh={loadData} />
              )}
              {currentTab === 'meetings' && (
                <MeetingNotesView notes={meetingNotes} onRefresh={loadData} />
              )}
              {currentTab === 'system' && (
                <SystemHealthView
                  latency={latency}
                  apiOnline={apiOnline}
                  onRefresh={loadData}
                />
              )}
            </>
          )}
        </main>

        {/* Footer Bar */}
        <footer className="h-9 flex-shrink-0 border-t border-slate-800/80 bg-slate-950 px-4 sm:px-6 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-2">
            <span>WOSys Enterprise Maintenance ERP</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">React 18 + SQLite WAL</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400">
            <span>API Server:</span>
            <span className="font-mono text-emerald-400 font-bold">127.0.0.1:8003</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
