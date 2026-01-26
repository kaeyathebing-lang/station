import React, { useState } from 'react';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import MapComponent from './components/MapComponent';
import Timeline from './components/Timeline';
import { ViewState, TimeMode, Station } from './types';

const App: React.FC = () => {
  // State Machine
  const [viewState, setViewState] = useState<ViewState>(ViewState.S0_CITY);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  // Time Control State
  const [timeMode, setTimeMode] = useState<TimeMode>(TimeMode.CURRENT);
  const [timelineValue, setTimelineValue] = useState<number>(48); // 12:00 PM

  // Handlers
  const handleDistrictClick = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setViewState(ViewState.S1_DISTRICT);
  };

  const handleStationClick = (station: Station) => {
    setSelectedStation(station);
    setViewState(ViewState.S2_STATION);
  };

  const handleBack = () => {
    if (viewState === ViewState.S2_STATION) {
      setViewState(ViewState.S1_DISTRICT);
      setSelectedStation(null);
    } else if (viewState === ViewState.S1_DISTRICT) {
      setViewState(ViewState.S0_CITY);
      setSelectedDistrictId(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      <Header />

      <main className="flex-1 grid grid-cols-12 gap-5 p-5 overflow-hidden h-[calc(100vh-64px)]">
        
        {/* Left Column: Statistics */}
        <section className="col-span-3 bg-slate-900/60 rounded-2xl border border-slate-800 p-4 h-full flex flex-col backdrop-blur-xl shadow-2xl">
          <LeftPanel 
             viewState={viewState} 
             selectedDistrictId={selectedDistrictId} 
             selectedStation={selectedStation} 
          />
        </section>

        {/* Center Column: Map & Timeline */}
        <section className="col-span-6 flex flex-col relative h-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-black/20">
           {/* Map includes Top Time Window Switcher */}
           <MapComponent 
             viewState={viewState}
             selectedDistrictId={selectedDistrictId}
             selectedStationId={selectedStation?.id || null}
             timeMode={timeMode}
             setTimeMode={setTimeMode}
             onDistrictClick={handleDistrictClick}
             onStationClick={handleStationClick}
             onBack={handleBack}
           />
           
           {/* Bottom Timeline */}
           <Timeline 
             timelineValue={timelineValue}
             setTimelineValue={setTimelineValue}
           />
        </section>

        {/* Right Column: Dynamic Analysis */}
        <section className="col-span-3 bg-slate-900/60 rounded-2xl border border-slate-800 p-4 h-full flex flex-col backdrop-blur-xl shadow-2xl">
           <RightPanel viewState={viewState} timeMode={timeMode} />
        </section>

      </main>
    </div>
  );
};

export default App;