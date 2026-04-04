import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Gift, Trophy, User, Wallet, CreditCard, Settings, ArrowRight } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { cn } from '../utils/cn'

// Mock data
const portfolioData = [
  { name: 'The Rebellious Heiress', value: 42500, color: '#6366f1' },
  { name: 'War God Returns', value: 21000, color: '#8b5cf6' },
  { name: 'Star Crossed', value: 15000, color: '#ec4899' },
  { name: 'Cash', value: 12345, color: '#10b981' },
]

const mockPositions = [
  {
    id: '1',
    title: { zh: '逆袭千金：总裁的隐婚新娘', en: 'The Rebellious Heiress' },
    shares: 425.00,
    avgCost: 1.00,
    currentValue: 432.13,
    roi: 1.68,
  },
  {
    id: '2',
    title: { zh: '龙域战神：都市归来', en: 'War God Returns' },
    shares: 210.00,
    avgCost: 1.00,
    currentValue: 222.30,
    roi: 5.86,
  },
]

const MOCK_INVITE = {
  code: 'REEL12345',
  link: 'https://reelrwa.com?ref=REEL12345',
  directCount: 12,
  indirectCount: 8,
  totalReward: '1250 REEL',
}

export default function Profile() {
  const { t, i18n } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalValue = portfolioData.reduce((sum, item) => sum + item.value, 0)

  const menuItems = [
    { icon: User, label: t('profile:my_assets'), path: '/my-assets' },
    { icon: Wallet, label: t('profile:my_positions'), path: '/positions' },
    { icon: CreditCard, label: t('profile:transaction_history'), path: '/transactions' },
    { icon: Gift, label: t('profile:invite_friends'), path: '/invite' },
    { icon: Trophy, label: t('profile:daily_checkin'), path: '/checkin' },
    { icon: Settings, label: t('profile:security_settings'), path: '/security' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('profile:profile')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info & Menu */}
        <div className="lg:col-span-1 space-y-6">
          {/* User Card */}
          <div className="glass rounded-2xl p-6 text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">John Doe</h2>
            <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              VIP 1
            </div>
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">{t('profile:kyc_level')}</span>
                <span className="font-medium">Level 2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('profile:reel_balance')}</span>
                <span className="font-medium text-green-400">1,250.50 REEL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">{t('profile:points')}</span>
                <span className="font-medium">1,845</span>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="glass rounded-2xl p-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              return (
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-dark-lighter transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                      <Icon size={18} />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-500" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Right Column - Portfolio & Invite */}
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Overview */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">{t('profile:total_value')}: ${totalValue.toLocaleString()}</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`$${value}`, 'Value']}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* My Positions */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">{t('profile:my_positions')}</h2>
            <div className="space-y-4">
              {mockPositions.map((position) => {
                const title = i18n.language === 'zh' ? position.title.zh : position.title.en
                return (
                  <div key={position.id} className="p-4 bg-dark-lighter rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg">{title}</h3>
                      <span className={cn(
                        'font-semibold',
                        position.roi > 0 ? 'text-green-400' : 'text-red-400'
                      )}>
                        {position.roi > 0 ? '+' : ''}{position.roi}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">{t('common:share')}</div>
                        <div className="font-medium">{position.shares.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Avg. Cost</div>
                        <div className="font-medium">${position.avgCost.toFixed(3)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Value</div>
                        <div className="font-medium">${position.currentValue.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Invite Friends */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">{t('profile:invite_friends')}</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('profile:invite_code')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={MOCK_INVITE.code}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white"
                />
                <button
                  onClick={() => copyToClipboard(MOCK_INVITE.code)}
                  className="px-4 py-3 bg-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {copied ? t('profile:copied') : t('profile:copy')}
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('profile:share_link')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={MOCK_INVITE.link}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(MOCK_INVITE.link)}
                  className="px-4 py-3 bg-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  {copied ? t('profile:copied') : t('profile:copy')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-dark-lighter rounded-xl">
                <div className="text-2xl font-bold text-primary">{MOCK_INVITE.directCount}</div>
                <div className="text-sm text-gray-400">{t('profile:direct_invites')}</div>
              </div>
              <div className="text-center p-4 bg-dark-lighter rounded-xl">
                <div className="text-2xl font-bold text-secondary">{MOCK_INVITE.indirectCount}</div>
                <div className="text-sm text-gray-400">{t('profile:indirect_invites')}</div>
              </div>
              <div className="text-center p-4 bg-dark-lighter rounded-xl">
                <div className="text-2xl font-bold text-accent">{MOCK_INVITE.totalReward}</div>
                <div className="text-sm text-gray-400">{t('profile:total_rewards')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
