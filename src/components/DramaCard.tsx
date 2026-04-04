import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DramaCardProps {
  id: string
  title: { zh: string; en: string }
  cover: string
  episodes: number
  heat: number
  vipLevel: number
}

export default function DramaCard({ id, title, cover, episodes, heat, vipLevel }: DramaCardProps) {
  const navigate = useNavigate()
  const currentLang = localStorage.getItem('language') || 'en'
  const currentTitle = currentLang === 'zh' ? title.zh : title.en

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => navigate(`/drama/${id}`)}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden glass group-hover:scale-[1.03] transition-transform duration-300">
        <img 
          src={cover} 
          alt={currentTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {vipLevel > 0 && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-accent/90 rounded-md text-xs font-bold text-white">
            VIP {vipLevel}
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{episodes} episodes</span>
            <div className="flex items-center gap-1 text-accent">
              <Flame size={14} />
              <span className="text-xs font-bold">{heat}</span>
            </div>
          </div>
        </div>
      </div>
      <h3 className="mt-3 font-semibold text-base line-clamp-1">{currentTitle}</h3>
    </div>
  )
}
