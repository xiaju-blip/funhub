import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '../utils/cn'

// Mock data
const MOCK_ASSET = {
  id: '1',
  title: {
    zh: '逆袭千金：总裁的隐婚新娘',
    en: 'The Rebellious Heiress: CEO\'s Secret Wife'
  },
  description: {
    zh: '这是一部爆款都市短剧，全网播放量超过1亿次，流量稳定增长，分红潜力巨大。投资者可以通过持有IP份额享受播放和广告分红。',
    en: 'This is a hit urban short drama with over 100 million total views, stable traffic growth and huge dividend potential. Investors can share playback and advertising revenue by holding IP tokens.'
  },
  cover: 'https://images.unsplash.com/photo-1578632767115-351416917565?w=1200&h=600&fit=crop',
  apy: 18.5,
  targetAmount: 500000,
  raisedAmount: 425000,
  durationDays: 180,
  currentPrice: 1.005,
  dividendHistory: [
    { date: 'Jan', amount: 1250 },
    { date: 'Feb', amount: 1380 },
    { date: 'Mar', amount: 1520 },
    { date: 'Apr', amount: 1490 },
    { date: 'May', amount: 1680 },
    { date: 'Jun', amount: 1820 },
  ],
}

export default function AssetDetail() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [amount, setAmount] = useState('')
  // id is used for API data fetching in production
  void id
  const progress = Math.round((MOCK_ASSET.raisedAmount / MOCK_ASSET.targetAmount) * 100)
  const estimatedShare = Number(amount) / MOCK_ASSET.currentPrice || 0
  const estimatedDividend = (estimatedShare * MOCK_ASSET.apy / 100 / 365 * MOCK_ASSET.durationDays).toFixed(2)

  const currentTitle = i18n.language === 'zh' ? MOCK_ASSET.title.zh : MOCK_ASSET.title.en
  const currentDescription = i18n.language === 'zh' ? MOCK_ASSET.description.zh : MOCK_ASSET.description.en

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with cover */}
      <div className="relative rounded-3xl overflow-hidden mb-8">
        <img 
          src={MOCK_ASSET.cover} 
          alt={currentTitle}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{currentTitle}</h1>
          <div className="flex flex-wrap gap-4">
            <div className="px-4 py-2 bg-primary/90 rounded-full text-white font-semibold">
              {MOCK_ASSET.apy}% {t('common:apr')}
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur rounded-full text-white font-medium">
              {progress}% {t('common:progress')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">{t('common:description')}</h2>
            <p className="text-gray-300 leading-relaxed">{currentDescription}</p>
          </div>

          {/* Historical Dividends Chart */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">{t('common:dividends')} {t('common:history')}</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_ASSET.dividendHistory}>
                  <defs>
                    <linearGradient id="colorDividend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorDividend)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Holders */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">{t('common:holders')}</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-dark-lighter rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-sm font-bold">
                      {i}
                    </div>
                    <span className="font-mono text-sm">0x...{Math.floor(Math.random() * 10000)}</span>
                  </div>
                  <span className="font-semibold">{(Math.random() * 10).toFixed(2)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Invest Panel */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">{t('common:invest')}</h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('common:current_price')}</span>
                <span className="font-semibold">${MOCK_ASSET.currentPrice.toFixed(3)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">{t('common:target')}</span>
                <span className="font-semibold">${MOCK_ASSET.targetAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">{t('common:raised')}</span>
                <span className="font-semibold">${MOCK_ASSET.raisedAmount.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">{t('common:apr')}</span>
                <span className="font-semibold text-green-400">{MOCK_ASSET.apy}%</span>
              </div>

              <div>
                <div className="text-gray-400 mb-2">{t('common:progress')}</div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-sm mt-1 text-gray-400">{progress}%</div>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('common:amount')} (USDT)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              {amount && Number(amount) > 0 && (
                <div className="bg-dark-lighter rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('common:estimated')} {t('common:share')}</span>
                    <span className="font-semibold">{estimatedShare.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Estimated Total Dividend</span>
                    <span className="font-semibold text-green-400">{estimatedDividend} USDT</span>
                  </div>
                </div>
              )}

              <button 
                disabled={!amount || Number(amount) <= 0}
                className={cn(
                  'w-full py-4 rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02]',
                  (!amount || Number(amount) <= 0) 
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-secondary'
                )}
              >
                {t('common:invest_now')}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Price slippage may occur based on AMM liquidity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
