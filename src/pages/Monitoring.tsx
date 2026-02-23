import BottomNav from '../components/BottomNav'
import { BarChart2 } from 'lucide-react'

export default function Monitoring() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-blue-600 text-white px-4 pt-10 pb-4">
        <h1 className="text-base font-bold">Monitoring</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <BarChart2 size={48} />
        <p className="text-sm">Halaman Monitoring</p>
      </div>
      <BottomNav />
    </div>
  )
}
