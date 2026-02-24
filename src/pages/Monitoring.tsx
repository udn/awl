import { useState, useEffect, useRef, useCallback } from 'react'
import BottomNav from '../components/BottomNav'
import WaterTankGauge from '../components/WaterTankGauge'
import { Activity, Settings, X, ChevronUp, ChevronDown } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'

type Status = 'safe' | 'warning' | 'danger'

interface Reading {
  id: number
  time: string
  level: number
  status: Status
}

interface Thresholds {
  warning: number
  danger: number
  max: number
}

const DEFAULT_THRESHOLDS: Thresholds = { warning: 1.5, danger: 2.5, max: 4.0 }
const UPDATE_INTERVAL_MS = 3000
const MAX_HISTORY = 20
// Slight upward bias (0.48 < 0.5) and magnitude (0.12) mimic gradual river-level rise
const SIM_BIAS = 0.48
const SIM_VARIANCE = 0.12

function getStatus(level: number, t: Thresholds): Status {
  if (level >= t.danger) return 'danger'
  if (level >= t.warning) return 'warning'
  return 'safe'
}

function simulateNext(prev: number, max: number): number {
  const delta = (Math.random() - SIM_BIAS) * SIM_VARIANCE
  return Math.round(Math.max(0.05, Math.min(max - 0.05, prev + delta)) * 1000) / 1000
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

const STATUS_META: Record<Status, { label: string; bg: string; text: string; border: string }> = {
  safe:    { label: 'Aman',    bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-300' },
  warning: { label: 'Waspada', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  danger:  { label: 'Bahaya',  bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-300' },
}

export default function Monitoring() {
  const [thresholds, setThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS)
  const [pendingThresholds, setPendingThresholds] = useState<Thresholds>(DEFAULT_THRESHOLDS)
  const [history, setHistory] = useState<Reading[]>(() => {
    const now = new Date()
    const initialLevel = 0.8
    return [{
      id: 0,
      time: formatTime(now),
      level: initialLevel,
      status: getStatus(initialLevel, DEFAULT_THRESHOLDS),
    }]
  })
  const [showSettings, setShowSettings] = useState(false)
  const [showLog, setShowLog] = useState(true)
  const idRef = useRef(1)

  const current = history[history.length - 1]
  const status = current.status
  const meta = STATUS_META[status]

  useEffect(() => {
    const timer = setInterval(() => {
      setHistory(prev => {
        const last = prev[prev.length - 1]
        const newLevel = simulateNext(last.level, thresholds.max)
        const newStatus = getStatus(newLevel, thresholds)
        const entry: Reading = {
          id: idRef.current++,
          time: formatTime(new Date()),
          level: newLevel,
          status: newStatus,
        }
        const updated = [...prev, entry]
        return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated
      })
    }, UPDATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [thresholds])

  const toggleSettings = useCallback(() => {
    setShowSettings(o => !o)
    setPendingThresholds(thresholds)
  }, [thresholds])

  function applyThresholds() {
    if (pendingThresholds.warning >= pendingThresholds.danger) return
    if (pendingThresholds.danger >= pendingThresholds.max) return
    setThresholds(pendingThresholds)
    setShowSettings(false)
  }

  function clampInput(val: string, min: number, max: number): number {
    const n = parseFloat(val)
    if (isNaN(n)) return min
    return Math.min(max, Math.max(min, n))
  }

  const chartData = history.map(r => ({ time: r.time, level: r.level }))

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity size={20} />
          <h1 className="text-base font-bold">Water Level Monitor</h1>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs opacity-80">Live</span>
        </div>
      </div>

      {/* Status banner */}
      <div className={`mx-3 mt-3 px-4 py-2 rounded-xl border flex items-center justify-between ${meta.bg} ${meta.border}`}>
        <div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${meta.text}`}>{meta.label}</span>
          <p className={`text-xs mt-0.5 ${meta.text} opacity-80`}>
            {status === 'safe' && 'Tinggi muka air dalam batas normal.'}
            {status === 'warning' && 'Tinggi muka air mendekati batas aman!'}
            {status === 'danger' && 'Tinggi muka air melebihi batas bahaya!'}
          </p>
        </div>
        <button
          onClick={toggleSettings}
          className="p-1.5 rounded-full bg-white bg-opacity-60"
          aria-label="Pengaturan batas"
        >
          <Settings size={16} className="text-gray-600" />
        </button>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="mx-3 mt-2 bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-800">Konfigurasi Batas Siaga</h2>
            <button onClick={() => setShowSettings(false)}>
              <X size={16} className="text-gray-400" />
            </button>
          </div>
          <div className="space-y-3">
            {(
              [
                { key: 'warning', label: 'Batas Waspada (m)', color: 'text-yellow-600' },
                { key: 'danger',  label: 'Batas Bahaya (m)',  color: 'text-red-600' },
                { key: 'max',     label: 'Kapasitas Maks (m)', color: 'text-gray-600' },
              ] as const
            ).map(({ key, label, color }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <span className={`text-xs font-medium ${color} flex-1`}>{label}</span>
                <div className="flex items-center gap-1">
                  <button
                    className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"
                    onClick={() => setPendingThresholds(p => ({ ...p, [key]: Math.max(0.1, +(p[key] - 0.1).toFixed(1)) }))}
                  >
                    <ChevronDown size={14} />
                  </button>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="99"
                    value={pendingThresholds[key]}
                    onChange={e => setPendingThresholds(p => ({ ...p, [key]: clampInput(e.target.value, 0.1, 99) }))}
                    className="w-16 text-center text-sm border border-gray-200 rounded py-0.5"
                  />
                  <button
                    className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center"
                    onClick={() => setPendingThresholds(p => ({ ...p, [key]: +(p[key] + 0.1).toFixed(1) }))}
                  >
                    <ChevronUp size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {(pendingThresholds.warning >= pendingThresholds.danger || pendingThresholds.danger >= pendingThresholds.max) && (
            <p className="text-xs text-red-500 mt-2">Waspada &lt; Bahaya &lt; Maks diperlukan.</p>
          )}
          <button
            onClick={applyThresholds}
            disabled={pendingThresholds.warning >= pendingThresholds.danger || pendingThresholds.danger >= pendingThresholds.max}
            className="mt-3 w-full py-2 bg-blue-600 text-white text-sm rounded-lg font-medium disabled:opacity-40"
          >
            Terapkan
          </button>
        </div>
      )}

      {/* Main gauge card */}
      <div className="mx-3 mt-2 bg-white rounded-xl shadow-sm p-4 flex flex-col items-center gap-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide self-start">Tinggi Muka Air Saat Ini</p>
        <div className="flex items-center gap-8 w-full justify-center">
          <WaterTankGauge level={current.level} maxLevel={thresholds.max} status={status} />
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-3xl font-bold text-gray-800">{current.level.toFixed(3)}</p>
              <p className="text-sm text-gray-500">meter</p>
            </div>
            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.text}`}>
              {meta.label}
            </div>
            <div className="text-xs text-gray-400">
              <p>Update: {current.time}</p>
              <p>Waspada: {thresholds.warning} m</p>
              <p>Bahaya: {thresholds.danger} m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mx-3 mt-2 bg-white rounded-xl shadow-sm p-4">
        <p className="text-sm font-bold text-gray-800 mb-3">Tren Pembacaan Terakhir</p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
            <YAxis domain={[0, thresholds.max]} tick={{ fontSize: 9 }} tickFormatter={(v: number) => v.toFixed(1)} />
            <Tooltip formatter={(v: number) => [`${v.toFixed(3)} m`, 'Level']} labelStyle={{ fontSize: 10 }} />
            <ReferenceLine y={thresholds.warning} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: 'W', position: 'right', fontSize: 9, fill: '#f59e0b' }} />
            <ReferenceLine y={thresholds.danger}  stroke="#ef4444" strokeDasharray="4 2" label={{ value: 'D', position: 'right', fontSize: 9, fill: '#ef4444' }} />
            <Line type="monotone" dataKey="level" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Historical log */}
      <div className="mx-3 mt-2 bg-white rounded-xl shadow-sm overflow-hidden mb-2">
        <button
          className="w-full flex items-center justify-between px-4 py-3"
          onClick={() => setShowLog(o => !o)}
        >
          <p className="text-sm font-bold text-gray-800">Log Pembacaan</p>
          {showLog ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </button>
        {showLog && (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="py-2 px-3 text-left font-semibold">Waktu</th>
                <th className="py-2 px-3 text-right font-semibold">Level (m)</th>
                <th className="py-2 px-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...history].reverse().map((r, i) => (
                <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-1.5 px-3 text-gray-500">{r.time}</td>
                  <td className="py-1.5 px-3 text-right font-medium text-gray-800">{r.level.toFixed(3)}</td>
                  <td className="py-1.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_META[r.status].bg} ${STATUS_META[r.status].text}`}>
                      {STATUS_META[r.status].label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
