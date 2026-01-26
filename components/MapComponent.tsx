import React, { useEffect, useRef, useMemo } from 'react';
import { ViewState, District, Station, TimeMode } from '../types';
import { DISTRICTS, generateStations, TIME_MODES, MAP_TILE_URL } from '../constants';
import { ArrowLeft, Layers, DollarSign } from 'lucide-react';
import * as L from 'leaflet';

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapComponentProps {
  viewState: ViewState;
  selectedDistrictId: string | null;
  selectedStationId: string | null;
  timeMode: TimeMode;
  setTimeMode: (mode: TimeMode) => void;
  onDistrictClick: (id: string) => void;
  onStationClick: (station: Station) => void;
  onBack: () => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  viewState,
  selectedDistrictId,
  selectedStationId,
  timeMode,
  setTimeMode,
  onDistrictClick,
  onStationClick,
  onBack
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const districtLayerRef = useRef<L.LayerGroup | null>(null);
  const stationLayerRef = useRef<L.LayerGroup | null>(null);

  const currentStations = useMemo(() => {
    if (!selectedDistrictId) return [];
    return generateStations(selectedDistrictId);
  }, [selectedDistrictId]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      center: [22.65, 114.15],
      zoom: 10,
      minZoom: 9,
      zoomControl: false,
      attributionControl: false
    });

    // OpenStreetMap Mapnik
    L.tileLayer(MAP_TILE_URL, {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const districtLayer = L.layerGroup().addTo(map);
    const stationLayer = L.layerGroup().addTo(map);

    districtLayerRef.current = districtLayer;
    stationLayerRef.current = stationLayer;
    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // 1. Draw Grid Polygons
  useEffect(() => {
    if (!mapInstance.current || !districtLayerRef.current) return;
    const layerGroup = districtLayerRef.current;
    layerGroup.clearLayers();

    if (viewState === ViewState.S0_CITY) {
      DISTRICTS.forEach(district => {
        
        if (!district.isActive) {
          // Render Background Grids (Inactive)
          L.polygon(district.coordinates, {
            color: '#334155', // Slate-700
            weight: 1,
            fillColor: '#0f172a', // Slate-950
            fillOpacity: 0.6,
            dashArray: '5, 5',
            interactive: false
          }).addTo(layerGroup);
          return;
        }

        // Render Shenzhen Active Grids
        // Logic for Capacity based on TimeMode
        let capacity = 0;
        if (timeMode === TimeMode.HISTORY) capacity = district.capacityHistory;
        else if (timeMode === TimeMode.PREDICTION) capacity = district.capacityPrediction;
        else capacity = district.capacityCurrent;

        let color = '#0ea5e9'; // Default Cyan
        let opacity = 0.4;

        if (timeMode === TimeMode.HISTORY) {
           // History: Muted
           color = '#475569'; 
           opacity = 0.4 + (capacity / 200);
        } else if (timeMode === TimeMode.PREDICTION) {
           // Prediction: Warning logic
           color = capacity > 80 ? '#ef4444' : '#3b82f6';
           opacity = 0.6;
        } else {
           // Current: Heatmap
           color = capacity > 80 ? '#06b6d4' : '#3b82f6';
           opacity = 0.4 + (capacity / 200);
        }

        const polygon = L.polygon(district.coordinates, {
          color: '#1e293b', 
          weight: 1,
          fillColor: color,
          fillOpacity: opacity,
        });

        polygon.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onDistrictClick(district.id);
        });
        
        // Highlight effect
        polygon.on('mouseover', () => {
          polygon.setStyle({ weight: 2, color: '#fff', fillOpacity: 0.8 });
        });
        polygon.on('mouseout', () => {
          polygon.setStyle({ weight: 1, color: '#1e293b', fillOpacity: opacity });
        });

        // HTML Label at Center
        const labelIcon = L.divIcon({
          className: 'bg-transparent',
          html: `<div class="text-[10px] font-bold text-white drop-shadow-md text-center" style="width:80px; margin-left:-40px; text-shadow: 0 1px 2px rgba(0,0,0,0.8);">
                  ${district.name}<br/>
                  <span class="${timeMode === TimeMode.PREDICTION && capacity > 80 ? 'text-red-300' : 'text-cyan-100'}">
                    负载: ${capacity}%
                  </span>
                 </div>`,
          iconSize: [0, 0]
        });
        L.marker(district.center, { icon: labelIcon, interactive: false }).addTo(layerGroup);

        layerGroup.addLayer(polygon);
      });
    } else if (selectedDistrictId) {
       // S1/S2: Focus mode.
       const district = DISTRICTS.find(d => d.id === selectedDistrictId);
       if (district) {
         // Draw outline
         L.polygon(district.coordinates, {
            color: '#38bdf8',
            weight: 3,
            fillColor: '#000',
            fillOpacity: 0.1,
            interactive: false
         }).addTo(layerGroup);
       }
    }
  }, [viewState, timeMode, selectedDistrictId, onDistrictClick]);

  // 2. Draw Stations (Colored by Revenue)
  useEffect(() => {
    if (!mapInstance.current || !stationLayerRef.current) return;
    const layerGroup = stationLayerRef.current;
    layerGroup.clearLayers();

    if (viewState === ViewState.S1_DISTRICT || viewState === ViewState.S2_STATION) {
      currentStations.forEach(station => {
        const isSelected = station.id === selectedStationId;
        
        // Color by Revenue Level
        let color = '#94a3b8'; // C - Grey
        if (station.revenueLevel === 'S') color = '#f43f5e'; // Red (Hot)
        else if (station.revenueLevel === 'A') color = '#f59e0b'; // Orange
        else if (station.revenueLevel === 'B') color = '#06b6d4'; // Cyan

        const iconHtml = `
          <div class="relative flex items-center justify-center">
            ${isSelected ? `<div class="absolute w-10 h-10 rounded-full border-2 border-white animate-ping opacity-70"></div>` : ''}
            <div class="w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg flex items-center justify-center text-[8px] font-bold text-white" 
                 style="background-color: ${color}; transform: scale(${isSelected ? 1.5 : 1}); box-shadow: 0 0 10px ${color};">
              ${station.revenueLevel}
            </div>
          </div>
        `;

        const icon = L.divIcon({
          html: iconHtml,
          className: 'bg-transparent',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker(station.position, { icon });

        marker.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onStationClick(station);
        });

        if (isSelected) marker.setZIndexOffset(1000);
        layerGroup.addLayer(marker);
      });
    }
  }, [viewState, currentStations, selectedStationId, onStationClick]);

  // View Transitions
  useEffect(() => {
    if (!mapInstance.current) return;
    const map = mapInstance.current;
    if (viewState === ViewState.S0_CITY) {
      map.flyTo([22.65, 114.15], 10, { duration: 1 });
    } else if (selectedDistrictId) {
      const district = DISTRICTS.find(d => d.id === selectedDistrictId);
      if (district) map.flyTo(district.center, 13, { duration: 1 });
    }
  }, [viewState, selectedDistrictId]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden rounded-xl border border-slate-700 shadow-inner group">
      <div ref={mapContainer} className="w-full h-full z-0 opacity-80" />

      {/* Time Switcher */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[500] bg-slate-900/95 border border-slate-600 rounded-lg p-1 shadow-2xl flex items-center">
         {TIME_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setTimeMode(mode.id)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                timeMode === mode.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mode.label}
            </button>
         ))}
      </div>

      {viewState !== ViewState.S0_CITY && (
        <button onClick={onBack} className="absolute top-6 left-6 z-[500] bg-slate-900/90 text-white px-4 py-2 rounded border border-slate-600 hover:border-cyan-500 flex items-center gap-2 shadow-lg text-sm">
          <ArrowLeft size={14} /> 返回上一级
        </button>
      )}
      
      {/* Revised Legend */}
      <div className="absolute top-6 right-6 z-[500] bg-slate-900/90 p-3 rounded border border-slate-700 text-xs text-slate-300 shadow-xl w-40">
        <h4 className="mb-2 font-bold text-white border-b border-slate-700 pb-1 flex items-center gap-2">
           <Layers size={12}/> {viewState === ViewState.S0_CITY ? '容量/负载图例' : '营收等级图例'}
        </h4>
        <div className="space-y-1.5">
          {viewState === ViewState.S0_CITY ? (
             timeMode === TimeMode.PREDICTION ? (
               <>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 border border-white/20"></span> 预测过载 (大于80%)</div>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 border border-white/20"></span> 预测正常</div>
               </>
             ) : (
               <>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 bg-cyan-400 border border-white/20"></span> 高负载区域</div>
                 <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 border border-white/20"></span> 正常区域</div>
               </>
             )
          ) : (
            <>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]"></span> S级 (高营收)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-amber-500"></span> A级 (良好)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-cyan-500"></span> B级 (一般)</div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-slate-400"></span> C级 (亏损)</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
