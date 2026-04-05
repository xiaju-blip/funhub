import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Users, Briefcase, DollarSign, Film, AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/cn'
import StatCard from '../../components/StatCard'

// 模拟数据
interface DashboardStats {
  totalUsers: number
  totalAssets: number
  totalTradingVolume: number
  dailyActiveUsers: number
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAssets: 0,
    totalTradingVolume: 0,
    dailyActiveUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: 调用 API 获取仪表板数据
    setTimeout(() => {
      setStats({
        totalUsers: 1250,
        totalAssets: 36,
        totalTradingVolume: 2580000,
        dailyActiveUsers: 328,
      })
      setLoading(false)
    }, 500)
  }, [])

  const menuItems = [
    { key: 'users', label: t('admin:users_management'), icon: Users },
    { key: 'assets', label: t('admin:assets_management'), icon: Briefcase },
    { key: 'dramas', label: t('admin:content_management'), icon: Film },
    { key: 'withdrawals', label: t('admin:withdrawals_pending'), icon: AlertTriangle },
    { key: 'tasks', label: t('admin:tasks_management'), icon: DollarSign },
    { key: 'dashboard', label: t('admin:dashboard'), icon: BarChart3 },
  ]

  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-700 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin:admin_panel')}</h1>

      {/* 侧边导航 + 内容 */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 左侧菜单 */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass rounded-xl p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      activeTab === item.key
                        ? 'bg-primary text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <>
              {/* 统计卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  label={t('admin:total_users')}
                  value={stats.totalUsers.toLocaleString()}
                />
                <StatCard
                  label={t('admin:total_assets')}
                  value={stats.totalAssets.toString()}
                />
                <StatCard
                  label={t('admin:total_volume')}
                  value={`$${(stats.totalTradingVolume / 1000000).toFixed(2)}M`}
                />
                <StatCard
                  label={t('admin:dau')}
                  value={stats.dailyActiveUsers.toString()}
                />
              </div>

              {/* 欢迎提示 */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin:welcome_title')}</h2>
                <p className="text-gray-400">
                  {t('admin:welcome_desc')}
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• ✅ {t('admin:todo_1')}</li>
                  <li>• ✅ {t('admin:todo_2')}</li>
                  <li>• ✅ {t('admin:todo_3')}</li>
                  <li>• ⬜ {t('admin:todo_4')}</li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin:users_management')}</h2>
              <p className="text-gray-400">{t('admin:coming_soon')}</p>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin:assets_management')}</h2>
              <p className="text-gray-400">{t('admin:coming_soon')}</p>
            </div>
          )}

          {activeTab === 'dramas' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin:content_management')}</h2>
              <p className="text-gray-400">{t('admin:coming_soon')}</p>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin:withdrawals_pending')}</h2>
              <p className="text-gray-400">{t('admin:coming_soon')}</p>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="glass rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">{t('admin:tasks_management')}</h2>
              <p className="text-gray-400">{t('admin:coming_soon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
