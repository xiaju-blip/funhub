import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import StatCard from '../components/StatCard'
import AssetCard from '../components/AssetCard'
import DramaCard from '../components/DramaCard'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { api, type Asset, type Drama } from '../services/api'

// Fallback mock data if API is not available
const MOCK_ASSETS = [
  {
    id: '1',
    title: {
      zh: '逆袭千金：总裁的隐婚新娘',
      en: 'The Rebellious Heiress: CEO\'s Secret Wife'
    },
    description: {
      zh: '一场精心策划的阴谋，让她从千金大小姐变成一无所有。隐婚嫁给神秘总裁，看她如何逆袭复仇...',
      en: 'A well-planned conspiracy turns her from a wealthy heiress into nothing. Married secretly to a mysterious CEO, watch how she fights back...'
    },
    cover: 'https://images.unsplash.com/photo-1578632767115-351416917565?w=800&h=450&fit=crop',
    apr: 18.5,
    targetAmount: 500000,
    raisedAmount: 425000,
    durationDays: 180,
    currentPrice: 100.0
  },
  {
    id: '2',
    title: {
      zh: '龙域战神：都市归来',
      en: 'War God Returns to City'
    },
    description: {
      zh: '十年戎马，战神归乡。曾经的耻辱，今日百倍奉还！',
      en: 'Ten years of war, the god of war returns to the city. Past shame will be repaid a hundredfold today!'
    },
    cover: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&h=450&fit=crop',
    apr: 15.2,
    targetAmount: 300000,
    raisedAmount: 210000,
    durationDays: 90,
    currentPrice: 85.5
  },
  {
    id: '3',
    title: {
      zh: '星际情缘：异星邂逅',
      en: 'Star Crossed: Alien Encounter'
    },
    description: {
      zh: '遥远星际，人类探险家与异星公主的浪漫邂逅，跨越星系的爱情故事',
      en: 'A romantic encounter between a human explorer and an alien princess among the stars, a love story across galaxies'
    },
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    apr: 22.8,
    targetAmount: 800000,
    raisedAmount: 320000,
    durationDays: 365,
    currentPrice: 120.0
  }
]

const MOCK_DRAMAS = [
  {
    id: '1',
    title: {
      zh: '逆袭千金：总裁的隐婚新娘',
      en: 'The Rebellious Heiress: CEO\'s Secret Wife'
    },
    cover: 'https://images.unsplash.com/photo-1578632767115-351416917565?w=400&h=600&fit=crop',
    episodes: 100,
    heat: 24589,
    vipLevel: 0
  },
  {
    id: '2',
    title: {
      zh: '龙域战神：都市归来',
      en: 'War God Returns to City'
    },
    cover: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop',
    episodes: 80,
    heat: 18234,
    vipLevel: 1
  },
  {
    id: '3',
    title: {
      zh: '星际情缘：异星邂逅',
      en: 'Star Crossed: Alien Encounter'
    },
    cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop',
    episodes: 120,
    heat: 15678,
    vipLevel: 2
  },
  {
    id: '4',
    title: {
      zh: '豪门风云：继承者归来',
      en: 'Rich Family: The Heir Returns'
    },
    cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
    episodes: 95,
    heat: 12345,
    vipLevel: 0
  }
]

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: {
      zh: 'ReelRWA V13.1 全球上线，支持中英文切换',
      en: 'ReelRWA V13.1 Global Launch with Multi-language Support'
    },
    date: '2026-03-26'
  },
  {
    id: 2,
    title: {
      zh: '新项目《星际情缘》开放认购，APR 22.8%',
      en: 'New Project "Star Crossed" Open for Investment, APR 22.8%'
    },
    date: '2026-03-20'
  },
  {
    id: 3,
    title: {
      zh: '首次邀请好友活动，额外奖励 100 REEL',
      en: 'First Invitation Campaign, Extra 100 REEL Reward'
    },
    date: '2026-03-15'
  }
]

export default function Home() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [assets, setAssets] = useState<Asset[]>([])
  const [dramas, setDramas] = useState<Drama[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetsData, dramasData] = await Promise.all([
          api.getAssets(),
          api.getDramas()
        ])
        setAssets(assetsData)
        setDramas(dramasData)
      } catch (error) {
        console.error('Failed to fetch data from API:', error)
        // Fallback to mock data
        setAssets(MOCK_ASSETS)
        setDramas(MOCK_DRAMAS)
      }
    }

    fetchData()
  }, [])

  const displayAssets = assets.length > 0 ? assets : MOCK_ASSETS
  const displayDramas = dramas.length > 0 ? dramas : MOCK_DRAMAS

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden mb-12 hero-gradient"
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative px-6 py-16 md:px-12 md:py-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            {t('home:welcome')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            {t('home:subtitle')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button 
              onClick={() => navigate('/market')}
              className="px-8 py-4 bg-white text-dark font-semibold rounded-full hover:scale-105 transition-transform"
            >
              {t('home:explore_market')}
            </button>
            <button 
              onClick={() => navigate('/dramas')}
              className="px-8 py-4 bg-black/30 text-white font-semibold rounded-full border border-white/30 hover:bg-black/50 transition-transform"
            >
              {t('home:start_watching')}
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label={t('home:total_users')} 
            value="125,847" 
            delay={0.1}
          />
          <StatCard 
            label={t('home:total_assets')} 
            value="$42.5" 
            suffix="M" 
            delay={0.2}
          />
          <StatCard 
            label={t('home:total_dividends')} 
            value="$3.2" 
            suffix="M" 
            delay={0.3}
          />
        </div>
      </motion.section>

      {/* Featured Assets */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t('home:featured_assets')}</h2>
          <button 
            onClick={() => navigate('/assets')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            {t('common:view_all')} <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayAssets.map((asset) => (
            <AssetCard key={asset.id} {...asset} />
          ))}
        </div>
      </motion.section>

      {/* Hot Dramas */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">{t('home:hot_dramas')}</h2>
          <button 
            onClick={() => navigate('/dramas')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            {t('common:view_all')} <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayDramas.map((drama) => (
            <DramaCard key={drama.id} {...drama} />
          ))}
        </div>
      </motion.section>

      {/* Latest Announcements */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{t('home:latest_announcements')}</h2>
        <div className="glass rounded-2xl overflow-hidden">
          {MOCK_ANNOUNCEMENTS.map((announcement, index) => {
            const currentTitle = i18n.language === 'zh' ? announcement.title.zh : announcement.title.en
            return (
              <div 
                key={announcement.id}
                className={`flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors ${
                  index !== MOCK_ANNOUNCEMENTS.length - 1 ? 'border-b border-gray-800' : ''
                }`}
              >
                <span className="font-medium">{currentTitle}</span>
                <span className="text-sm text-gray-400">{announcement.date}</span>
              </div>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
