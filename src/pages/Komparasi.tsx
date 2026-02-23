import BottomNav from '../components/BottomNav'
import { GitCompare } from 'lucide-react'

export default function Komparasi() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-16">
      <div className="bg-blue-600 text-white px-4 pt-10 pb-4">
        <h1 className="text-base font-bold">Komparasi</h1>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400">
        <GitCompare size={48} />
        <p className="text-sm">Halaman Komparasi</p>
      </div>
      <BottomNav />
    </div>
  )
}
