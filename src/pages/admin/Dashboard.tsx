import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { BarChart3, Users, Briefcase, DollarSign, Film, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import StatCard from '../../components/StatCard'
import { api } from '../../services/api'

// Types
interface DashboardStats {
  totalUsers: number
  totalAssets: number
  totalTradingVolume: number
  dailyActiveUsers: number
}

interface User {
  id: number
  email: string
  phone: string
  kycLevel: number
  status: number
  createdAt: string
}

interface Asset {
  id: number
  title: { zh: string; en: string }
  apr: number
  targetAmount: number
  raisedAmount: number
  status: number
}

interface Drama {
  id: number
  title: { zh: string; en: string }
  episodes: number
  vipLevel: number
  heat: number
}

interface Withdrawal {
  id: number
  userId: number
  amount: number
  address: string
  status: number
  createdAt: string
}

interface Task {
  id: number
  title: { zh: string; en: string }
  reward: number
  status: number
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  
  // Dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalAssets: 0,
    totalTradingVolume: 0,
    dailyActiveUsers: 0,
  })

  // Users
  const [users, setUsers] = useState<User[]>([])
  const [usersPage, setUsersPage] = useState(1)
  const [_usersTotal, setUsersTotal] = useState(0)

  // Assets
  const [assets, setAssets] = useState<Asset[]>([])

  // Dramas
  const [dramas, setDramas] = useState<Drama[]>([])

  // Withdrawals
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])

  // Tasks
  const [tasks, setTasks] = useState<Task[]>([])

  const menuItems = [
    { key: 'dashboard', label: t('admin:dashboard'), icon: BarChart3 },
    { key: 'users', label: t('admin:users_management'), icon: Users },
    { key: 'assets', label: t('admin:assets_management'), icon: Briefcase },
    { key: 'dramas', label: t('admin:content_management'), icon: Film },
    { key: 'withdrawals', label: t('admin:withdrawals_pending'), icon: AlertTriangle },
    { key: 'tasks', label: t('admin:tasks_management'), icon: DollarSign },
  ]

  // Load dashboard data
  const loadDashboardStats = async () => {
    try {
      setLoading(true)
      const data = await api.admin.getDashboard()
      setStats(data)
    } catch (error) {
      console.error('Failed to load dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load users
  const loadUsers = async (page: number = 1) => {
    try {
      setLoading(true)
      const data = await api.admin.getUsers(page, 20)
      setUsers(data.list || [])
      setUsersTotal(data.total || 0)
      setUsersPage(page)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load assets
  const loadAssets = async () => {
    try {
      setLoading(true)
      const data = await api.admin.getAssets()
      setAssets(data.list || [])
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load dramas
  const loadDramas = async () => {
    try {
      setLoading(true)
      const data = await api.admin.getDramas()
      setDramas(data.list || [])
    } catch (error) {
      console.error('Failed to load dramas:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load withdrawals
  const loadWithdrawals = async (status?: number) => {
    try {
      setLoading(true)
      const data = await api.admin.getWithdrawals(status)
      setWithdrawals(data.list || [])
    } catch (error) {
      console.error('Failed to load withdrawals:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load tasks
  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await api.admin.getTasks()
      setTasks(data.list || [])
    } catch (error) {
      console.error('Failed to load tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Update user KYC
  const handleUpdateKyc = async (id: number, level: number) => {
    try {
      await api.admin.updateUserKyc(id, level)
      alert(t('admin:update_success'))
      loadUsers(usersPage)
    } catch (error) {
      console.error('Failed to update KYC:', error)
      alert(t('admin:update_failed'))
    }
  }

  // Update user status
  const handleUpdateStatus = async (id: number, status: number) => {
    try {
      await api.admin.updateUserStatus(id, status)
      alert(t('admin:update_success'))
      loadUsers(usersPage)
    } catch (error) {
      console.error('Failed to update status:', error)
      alert(t('admin:update_failed'))
    }
  }

  // Approve withdrawal
  const handleApproveWithdrawal = async (id: number) => {
    if (!confirm(t('admin:confirm_approve'))) return
    try {
      await api.admin.approveWithdrawal(id)
      alert(t('admin:approve_success'))
      loadWithdrawals(0)
    } catch (error) {
      console.error('Failed to approve withdrawal:', error)
      alert(t('admin:approve_failed'))
    }
  }

  // Reject withdrawal
  const handleRejectWithdrawal = async (id: number) => {
    const reason = prompt(t('admin:reject_reason'))
    if (!reason) return
    try {
      await api.admin.rejectWithdrawal(id, reason)
      alert(t('admin:reject_success'))
      loadWithdrawals(0)
    } catch (error) {
      console.error('Failed to reject withdrawal:', error)
      alert(t('admin:reject_failed'))
    }
  }

  // Update task status
  const handleUpdateTaskStatus = async (id: number, status: number) => {
    try {
      await api.admin.updateTaskStatus(id, status)
      alert(t('admin:update_success'))
      loadTasks()
    } catch (error) {
      console.error('Failed to update task status:', error)
      alert(t('admin:update_failed'))
    }
  }

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardStats()
    } else if (activeTab === 'users') {
      loadUsers(1)
    } else if (activeTab === 'assets') {
      loadAssets()
    } else if (activeTab === 'dramas') {
      loadDramas()
    } else if (activeTab === 'withdrawals') {
      loadWithdrawals(0) // 0 = pending
    } else if (activeTab === 'tasks') {
      loadTasks()
    }
  }, [activeTab])

  const getStatusText = (status: number) => {
    return status === 1 ? t('admin:active') : t('admin:inactive')
  }

  const getStatusClass = (status: number) => {
    return status === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
  }

  if (loading && activeTab === 'dashboard') {
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
          {/* Dashboard */}
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

              {/* 刷新按钮 */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={loadDashboardStats}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>

              <div className="glass rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">{t('admin:welcome_title')}</h2>
                <p className="text-gray-400">
                  {t('admin:welcome_desc')}
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• ✅ {t('admin:todo_1')}</li>
                  <li>• ✅ {t('admin:todo_2')}</li>
                  <li>• ✅ {t('admin:todo_3')}</li>
                  <li>• ✅ {t('admin:todo_4')}</li>
                </ul>
              </div>
            </>
          )}

          {/* 用户管理 */}
          {activeTab === 'users' && (
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin:users_management')}</h2>
                <button
                  onClick={() => loadUsers(usersPage)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">{t('admin:email_phone')}</th>
                        <th className="text-left py-3 px-2">{t('admin:kyc_level')}</th>
                        <th className="text-left py-3 px-2">{t('admin:status')}</th>
                        <th className="text-left py-3 px-2">{t('admin:actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800">
                          <td className="py-3 px-2">{user.id}</td>
                          <td className="py-3 px-2">
                            <div>{user.email}</div>
                            <div className="text-sm text-gray-400">{user.phone}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={cn(
                              'px-2 py-1 rounded text-sm',
                              user.kycLevel === 0 ? 'bg-yellow-500/20 text-yellow-400' : 
                              user.kycLevel === 1 ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                            )}>
                              KYC {user.kycLevel}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={cn('px-2 py-1 rounded text-sm', getStatusClass(user.status))}>
                              {getStatusText(user.status)}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              {user.kycLevel !== 1 && (
                                <button
                                  onClick={() => handleUpdateKyc(user.id, 1)}
                                  className="px-2 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                                >
                                  {t('admin:approve_kyc')}
                                </button>
                              )}
                              {user.status === 1 ? (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, 0)}
                                  className="px-2 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                >
                                  {t('admin:ban')}
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(user.id, 1)}
                                  className="px-2 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                                >
                                  {t('admin:unban')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {t('admin:no_data')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 资产管理 */}
          {activeTab === 'assets' && (
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin:assets_management')}</h2>
                <button
                  onClick={loadAssets}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">{t('admin:title')}</th>
                        <th className="text-left py-3 px-2">APR</th>
                        <th className="text-left py-3 px-2">{t('admin:target_amount')}</th>
                        <th className="text-left py-3 px-2">{t('admin:status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.map((asset) => (
                        <tr key={asset.id} className="border-b border-gray-800">
                          <td className="py-3 px-2">{asset.id}</td>
                          <td className="py-3 px-2">{asset.title.zh || asset.title.en}</td>
                          <td className="py-3 px-2">{asset.apr}%</td>
                          <td className="py-3 px-2">${asset.targetAmount.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <span className={cn('px-2 py-1 rounded text-sm', getStatusClass(asset.status))}>
                              {getStatusText(asset.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {assets.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {t('admin:no_data')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 内容管理 */}
          {activeTab === 'dramas' && (
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin:content_management')}</h2>
                <button
                  onClick={loadDramas}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">{t('admin:title')}</th>
                        <th className="text-left py-3 px-2">{t('admin:episodes')}</th>
                        <th className="text-left py-3 px-2">VIP {t('admin:level')}</th>
                        <th className="text-left py-3 px-2">{t('admin:heat')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dramas.map((drama) => (
                        <tr key={drama.id} className="border-b border-gray-800">
                          <td className="py-3 px-2">{drama.id}</td>
                          <td className="py-3 px-2">{drama.title.zh || drama.title.en}</td>
                          <td className="py-3 px-2">{drama.episodes}</td>
                          <td className="py-3 px-2">VIP {drama.vipLevel}</td>
                          <td className="py-3 px-2">{drama.heat}</td>
                        </tr>
                      ))}
                      {dramas.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {t('admin:no_data')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 提现审核 */}
          {activeTab === 'withdrawals' && (
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin:withdrawals_pending')}</h2>
                <button
                  onClick={() => loadWithdrawals(0)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">User ID</th>
                        <th className="text-left py-3 px-2">{t('admin:amount')}</th>
                        <th className="text-left py-3 px-2">{t('admin:address')}</th>
                        <th className="text-left py-3 px-2">{t('admin:actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id} className="border-b border-gray-800">
                          <td className="py-3 px-2">{withdrawal.id}</td>
                          <td className="py-3 px-2">{withdrawal.userId}</td>
                          <td className="py-3 px-2">${withdrawal.amount.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <code className="text-xs bg-black/30 px-2 py-1 rounded">
                              {withdrawal.address.slice(0, 16)}...
                            </code>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                              >
                                <CheckCircle size={14} />
                                {t('admin:approve')}
                              </button>
                              <button
                                onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                className="flex items-center gap-1 px-3 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                              >
                                <XCircle size={14} />
                                {t('admin:reject')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {withdrawals.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {t('admin:no_pending_withdrawals')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 任务管理 */}
          {activeTab === 'tasks' && (
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('admin:tasks_management')}</h2>
                <button
                  onClick={loadTasks}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg hover:bg-white/10"
                >
                  <RefreshCw size={16} />
                  {t('admin:refresh')}
                </button>
              </div>
              
              {loading ? (
                <div className="animate-pulse space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-700 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-2">ID</th>
                        <th className="text-left py-3 px-2">{t('admin:title')}</th>
                        <th className="text-left py-3 px-2">{t('admin:reward')}</th>
                        <th className="text-left py-3 px-2">{t('admin:status')}</th>
                        <th className="text-left py-3 px-2">{t('admin:actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id} className="border-b border-gray-800">
                          <td className="py-3 px-2">{task.id}</td>
                          <td className="py-3 px-2">{task.title.zh || task.title.en}</td>
                          <td className="py-3 px-2">${task.reward.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <span className={cn('px-2 py-1 rounded text-sm', getStatusClass(task.status))}>
                              {getStatusText(task.status)}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex gap-2">
                              {task.status !== 1 && (
                                <button
                                  onClick={() => handleUpdateTaskStatus(task.id, 1)}
                                  className="px-2 py-1 text-sm bg-green-500/20 text-green-400 rounded hover:bg-green-500/30"
                                >
                                  {t('admin:activate')}
                                </button>
                              )}
                              {task.status === 1 && (
                                <button
                                  onClick={() => handleUpdateTaskStatus(task.id, 0)}
                                  className="px-2 py-1 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                                >
                                  {t('admin:deactivate')}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {tasks.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-400">
                            {t('admin:no_data')}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
