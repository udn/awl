import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Compass, Search, RefreshCw, BookOpen, Navigation } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import MapLegend from '../components/MapLegend'

type WaterStation = { id: number; name: string; lat: number; lng: number; type: 'water'; status: string }
type WeatherStation = { id: number; name: string; lat: number; lng: number; type: 'weather'; rain: string }
type Station = WaterStation | WeatherStation

const stations: Station[] = [
  { id: 1, name: 'Pos AWLR Opak Pulo', lat: -7.802, lng: 110.364, type: 'water', status: 'connected' },
  { id: 2, name: 'Pos AWLR Progo', lat: -7.750, lng: 110.220, type: 'water', status: 'connected' },
  { id: 3, name: 'Pos AWLR Krasak', lat: -7.620, lng: 110.280, type: 'water', status: 'maintenance' },
  { id: 4, name: 'Pos AWLR Serang', lat: -7.680, lng: 110.420, type: 'water', status: 'connected' },
  { id: 5, name: 'Pos AWLR Winongo', lat: -7.820, lng: 110.350, type: 'water', status: 'disconnected' },
  { id: 6, name: 'Stasiun Cuaca Godean', lat: -7.770, lng: 110.295, type: 'weather', rain: 'none' },
  { id: 7, name: 'Stasiun Cuaca Sleman', lat: -7.716, lng: 110.355, type: 'weather', rain: 'light' },
  { id: 8, name: 'Stasiun Cuaca Bantul', lat: -7.890, lng: 110.330, type: 'weather', rain: 'none' },
  { id: 9, name: 'Stasiun Cuaca Wates', lat: -7.870, lng: 110.150, type: 'weather', rain: 'moderate' },
  { id: 10, name: 'Stasiun Cuaca Klaten', lat: -7.706, lng: 110.600, type: 'weather', rain: 'none' },
  { id: 11, name: 'Stasiun Cuaca Prambanan', lat: -7.752, lng: 110.490, type: 'weather', rain: 'none' },
  { id: 12, name: 'Stasiun Cuaca Pakem', lat: -7.648, lng: 110.418, type: 'weather', rain: 'very_light' },
  { id: 13, name: 'Stasiun Cuaca Kalasan', lat: -7.769, lng: 110.461, type: 'weather', rain: 'none' },
  { id: 14, name: 'Stasiun Cuaca Depok', lat: -7.755, lng: 110.376, type: 'weather', rain: 'none' },
  { id: 15, name: 'Stasiun Cuaca Pleret', lat: -7.840, lng: 110.395, type: 'weather', rain: 'light' },
]

function getMarkerColor(station: Station) {
  if (station.type === 'water') {
    if (station.status === 'connected') return '#22c55e'
    if (station.status === 'disconnected') return '#111827'
    return '#a16207'
  }
  const rainColors: Record<string, string> = {
    none: '#22c55e',
    very_light: '#bae6fd',
    light: '#60a5fa',
    moderate: '#facc15',
    heavy: '#f97316',
    very_heavy: '#ef4444',
  }
  return rainColors[station.rain] ?? '#22c55e'
}

function createDivIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="width:16px;height:16px;background:${color};border:2px solid white;border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  })
}

export default function Peta() {
  const [showLegend, setShowLegend] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    setMapReady(true)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center gap-3 px-4 pt-10 pb-3 shadow-sm z-[1100]">
        <Compass size={22} className="text-blue-600" />
        <h1 className="flex-1 text-base font-bold text-gray-800">Peta Lokasi Pos</h1>
        <button data-testid="peta-search" className="p-1.5 rounded-full hover:bg-gray-100" aria-label="Cari"><Search size={20} className="text-gray-600" /></button>
        <button data-testid="peta-refresh" className="p-1.5 rounded-full hover:bg-gray-100" aria-label="Segarkan"><RefreshCw size={20} className="text-gray-600" /></button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {mapReady && (
          <MapContainer
            center={[-7.797068, 110.370529]}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stations.map(station => (
              <Marker
                key={station.id}
                position={[station.lat, station.lng]}
                icon={createDivIcon(getMarkerColor(station))}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold">{station.name}</p>
                    {station.type === 'water' && <p className="text-xs text-gray-500">Status: {station.status}</p>}
                    {station.type === 'weather' && <p className="text-xs text-gray-500">Hujan: {station.rain}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {/* Legend overlay */}
        {showLegend && (
          <div className="absolute bottom-36 left-3 z-[1200]">
            <MapLegend />
          </div>
        )}

        {/* FABs */}
        <button
          data-testid="peta-legend"
          onClick={() => setShowLegend(o => !o)}
          className="absolute bottom-20 left-3 z-[1200] bg-white rounded-full shadow-lg p-3"
          aria-label="Legenda"
        >
          <BookOpen size={22} className="text-blue-600" />
        </button>
        <button data-testid="peta-navigation" className="absolute bottom-20 right-3 z-[1200] bg-blue-600 rounded-full shadow-lg p-3" aria-label="Navigasi">
          <Navigation size={22} className="text-white" />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
