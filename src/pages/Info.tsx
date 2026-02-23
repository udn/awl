import BottomNav from '../components/BottomNav'
import { Info as InfoIcon } from 'lucide-react'

export default function Info() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-blue-600 text-white px-4 pt-10 pb-4">
        <h1 className="text-base font-bold">Info</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <InfoIcon size={48} />
        <p className="text-sm">Halaman Info</p>
        <p className="text-xs text-center px-8">AWLR Monitoring System v1.0.0</p>
      </div>
      <BottomNav />
    </div>
  )
}
