import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Map, BarChart2, GitCompare, Info } from 'lucide-react'

const tabs = [
  { label: 'Beranda', path: '/beranda', icon: Home },
  { label: 'Peta', path: '/peta', icon: Map },
  { label: 'Monitoring', path: '/monitoring', icon: BarChart2 },
  { label: 'Komparasi', path: '/komparasi', icon: GitCompare },
  { label: 'Info', path: '/info', icon: Info },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex z-[1100] shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      {tabs.map(({ label, path, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            data-testid={`nav-${path.slice(1)}`}
            onClick={() => navigate(path)}
            className="flex-1 flex flex-col items-center py-2 gap-0.5"
          >
            <Icon size={22} color={active ? '#2563eb' : '#9ca3af'} />
            <span className={`text-[10px] ${active ? 'text-blue-600' : 'text-gray-400'}`}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
