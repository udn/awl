import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const weatherItems = [
  { label: 'Tidak Hujan', color: '#22c55e' },
  { label: 'Hujan Sangat Ringan', color: '#bae6fd' },
  { label: 'Hujan Ringan', color: '#60a5fa' },
  { label: 'Hujan Sedang', color: '#facc15' },
  { label: 'Hujan Lebat', color: '#f97316' },
  { label: 'Hujan Sangat Lebat', color: '#ef4444' },
]

const waterItems = [
  { label: 'Koneksi Terhubung', color: '#22c55e' },
  { label: 'Koneksi Terputus', color: '#111827' },
  { label: 'Perbaikan', color: '#a16207' },
]

export default function MapLegend() {
  const [open, setOpen] = useState(true)

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ minWidth: 260 }}>
      <button
        data-testid="map-legend-toggle"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-2 bg-blue-600 text-white text-sm font-semibold"
      >
        <span>Legenda</span>
        {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
      {open && (
        <div className="p-3 flex gap-4">
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">Stasiun Cuaca</p>
            {weatherItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5 mb-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 mb-1">Duga Air</p>
            {waterItems.map(item => (
              <div key={item.label} className="flex items-center gap-1.5 mb-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
