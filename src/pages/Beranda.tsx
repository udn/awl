import BottomNav from '../components/BottomNav'
import { Waves, Droplets, Activity } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const stations = [
  { id: 1, name: 'Pos AWLR Opak Pulo', level: 0.786, status: 'Normal', updated: '08:00' },
  { id: 2, name: 'Pos AWLR Progo', level: 1.254, status: 'Waspada', updated: '07:45' },
  { id: 3, name: 'Pos AWLR Krasak', level: 0.512, status: 'Normal', updated: '07:30' },
]

export default function Beranda() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-blue-600 text-white px-4 pt-10 pb-6">
        <p className="text-sm opacity-80">Selamat Datang</p>
        <h1 className="text-xl font-bold">AWLR Monitoring</h1>
        <p className="text-xs opacity-70 mt-1">Sistem Pemantauan Tinggi Muka Air</p>
      </div>
      <div className="px-4 py-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pos Pemantauan</h2>
        {stations.map(st => (
          <button
            key={st.id}
            onClick={() => navigate('/analisa')}
            className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 text-left"
          >
            <div className="bg-blue-100 p-2 rounded-lg">
              <Waves size={20} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{st.name}</p>
              <p className="text-xs text-gray-500">Update: {st.updated}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-700">{st.level.toFixed(3)}</p>
              <p className={`text-xs font-medium ${st.status === 'Normal' ? 'text-green-600' : 'text-yellow-600'}`}>{st.status}</p>
            </div>
          </button>
        ))}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg"><Droplets size={20} className="text-green-600" /></div>
            <div><p className="text-xs text-gray-500">Total Pos</p><p className="text-lg font-bold text-gray-800">15</p></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><Activity size={20} className="text-purple-600" /></div>
            <div><p className="text-xs text-gray-500">Aktif</p><p className="text-lg font-bold text-gray-800">13</p></div>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
