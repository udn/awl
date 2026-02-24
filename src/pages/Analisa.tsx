import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, Waves, ChevronRight } from 'lucide-react'
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const mockData = [
  { time: '00:00', avg: 0.786, low: 0.775, high: 0.795 },
  { time: '01:00', avg: 0.796, low: 0.792, high: 0.801 },
  { time: '02:00', avg: 0.796, low: 0.794, high: 0.800 },
  { time: '03:00', avg: 0.799, low: 0.795, high: 0.804 },
  { time: '04:00', avg: 0.800, low: 0.796, high: 0.804 },
  { time: '05:00', avg: 0.796, low: 0.791, high: 0.800 },
  { time: '06:00', avg: 0.786, low: 0.781, high: 0.794 },
  { time: '07:00', avg: 0.786, low: 0.782, high: 0.790 },
  { time: '08:00', avg: 0.786, low: 0.782, high: 0.790 },
]

const chartData = mockData.map(d => ({
  time: d.time,
  avg: d.avg,
  range: [d.low, d.high] as [number, number],
}))

const tabs = ['Hari', 'Bulan', 'Tahun']

export default function Analisa() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-4">
      {/* Header */}
      <div className="bg-blue-600 text-white flex items-center gap-3 px-4 pt-10 pb-4">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="flex-1 text-base font-bold">Analisa</h1>
        <button className="p-1"><Download size={22} /></button>
      </div>

      {/* Station info */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 shadow-sm">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Waves size={22} className="text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">Pos AWLR Opak Pulo</p>
          <p className="text-xs text-gray-500">Tinggi Muka Air</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white flex border-b border-gray-200 mt-0">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`flex-1 py-2.5 text-sm font-medium ${
              activeTab === i
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Selector */}
      <div className="bg-white flex items-center justify-between px-4 py-3 mt-2 shadow-sm">
        <span className="text-sm font-medium text-gray-700">Tinggi Muka Air</span>
        <ChevronRight size={18} className="text-gray-400" />
      </div>

      {/* Chart */}
      <div className="bg-white mx-3 mt-2 rounded-xl shadow-sm p-3">
        <p className="text-sm font-bold text-gray-800">Rerata Tinggi Muka Air (m)</p>
        <p className="text-xs text-gray-500 mb-3">Minggu, 15 Februari 2026</p>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 10 }} />
            <YAxis
              domain={[0.76, 0.81]}
              tick={{ fontSize: 10 }}
              tickFormatter={(v: number) => v.toFixed(2)}
            />
            <Tooltip formatter={(v: number) => v.toFixed(3)} />
            <Legend
              formatter={(value) => {
                if (value === 'range') return 'Range'
                return 'Rerata Tinggi Muka Air'
              }}
              iconType="circle"
              wrapperStyle={{ fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="range"
              fill="#99f6e4"
              stroke="#14b8a6"
              strokeWidth={1}
              fillOpacity={0.6}
              name="range"
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: '#2563eb', r: 3 }}
              name="avg"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-white mx-3 mt-2 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="py-2 px-2 text-left font-semibold">Waktu</th>
              <th className="py-2 px-2 text-right font-semibold">Rerata</th>
              <th className="py-2 px-2 text-right font-semibold">Low</th>
              <th className="py-2 px-2 text-right font-semibold">High</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((row, i) => (
              <tr key={row.time} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="py-2 px-2 text-gray-600">2026-02-15 {row.time}</td>
                <td className="py-2 px-2 text-right text-gray-800 font-medium">{row.avg.toFixed(3)}</td>
                <td className="py-2 px-2 text-right text-gray-600">{row.low.toFixed(3)}</td>
                <td className="py-2 px-2 text-right text-gray-600">{row.high.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
