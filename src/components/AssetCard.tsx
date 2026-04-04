import { useTranslation } from 'react-i18next'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface AssetCardProps {
  id: string
  title: { zh: string; en: string }
  cover: string
  apr: number
  targetAmount: number
  raisedAmount: number
  durationDays: number
}

export default function AssetCard({ id, title, cover, apr, targetAmount, raisedAmount, durationDays }: AssetCardProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const currentTitle = i18n.language === 'zh' ? title.zh : title.en
  const progress = Math.round((raisedAmount / targetAmount) * 100)

  return (
    <div 
      className="glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer group"
      onClick={() => navigate(`/asset/${id}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={cover} 
          alt={currentTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary/90 text-white text-sm font-semibold">
          {apr}% APR
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg mb-3 line-clamp-1">{currentTitle}</h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">{i18n.t('common:progress')}</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-gray-400">Target</div>
              <div className="font-semibold">${targetAmount.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400">Duration</div>
              <div className="font-semibold">{durationDays} days</div>
            </div>
          </div>

          <button className="w-full mt-2 py-3 bg-white/5 hover:bg-primary transition-colors rounded-xl font-medium group-hover:bg-primary flex items-center justify-center gap-2">
            {i18n.t('common:invest_now')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}
