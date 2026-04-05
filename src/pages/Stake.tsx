import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '../utils/cn'

// Mock data for stake pools
const STAKE_POOLS = [
  {
    id: 1,
    name: 'Flexible Pool',
    lockDays: 0,
    baseApy: 5.0,
    maxStake: null,
    minStake: 100,
    penaltyRate: 0,
    totalStaked: 1250000,
  },
  {
    id: 2,
    name: '30 Days Lock',
    lockDays: 30,
    baseApy: 8.0,
    maxStake: 5000000,
    minStake: 100,
    penaltyRate: 50,
    totalStaked: 850000,
  },
  {
    id: 3,
    name: '90 Days Lock',
    lockDays: 90,
    baseApy: 12.0,
    maxStake: 10000000,
    minStake: 100,
    penaltyRate: 30,
    totalStaked: 1250000,
  },
  {
    id: 4,
    name: '180 Days Lock',
    lockDays: 180,
    baseApy: 18.0,
    maxStake: 20000000,
    minStake: 100,
    penaltyRate: 20,
    totalStaked: 1800000,
  },
]

// Mock APY history
const APY_HISTORY = [
  { date: 'Jan', apy: 5.0 },
  { date: 'Feb', apy: 5.2 },
  { date: 'Mar', apy: 4.8 },
  { date: 'Apr', apy: 5.1 },
  { date: 'May', apy: 5.0 },
  { date: 'Jun', apy: 5.3 },
]

// Mock user stakes
const MY_STAKES = [
  {
    poolId: 1,
    poolName: 'Flexible Pool',
    amount: 2500.50,
    earned: 32.15,
    pending: 5.20,
    lockEndTime: null,
    autoCompound: true,
    vipLevel: 1,
  },
  {
    poolId: 3,
    poolName: '90 Days Lock',
    amount: 5000.00,
    earned: 125.80,
    pending: 18.50,
    lockEndTime: Date.now() + 30 * 24 * 60 * 60 * 1000,
    autoCompound: false,
    vipLevel: 1,
  },
]

export default function Stake() {
  const { t } = useTranslation()
  const [amount, setAmount] = useState('')
  const [selectedPool, setSelectedPool] = useState(STAKE_POOLS[0])
  const userVipLevel = 1 // from user state

  const calculateApy = (pool: typeof STAKE_POOLS[0]) => {
    return pool.baseApy + (userVipLevel * 0.5)
  }

  const calculateExpectedEarn = (pool: typeof STAKE_POOLS[0], amount: number) => {
    const apy = calculateApy(pool)
    return (amount * apy / 100 * (pool.lockDays || 365) / 365).toFixed(2)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('common:stake')}</h1>
        <p className="text-gray-400">Stake REEL to earn extra APY rewards</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">{t('stake:total_staked')}</div>
          <div className="text-3xl font-bold text-white">5,150,000 REEL</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">{t('stake:my_staked')}</div>
          <div className="text-3xl font-bold text-primary">7,500.50 REEL</div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">{t('stake:total_earned')}</div>
          <div className="text-3xl font-bold text-green-400">157.95 REEL</div>
        </div>
      </div>

      {/* APY History Chart */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">{t('stake:apy_history')}</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={APY_HISTORY}>
              <defs>
                <linearGradient id="colorApy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
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
                dataKey="apy" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorApy)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stake Pools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {STAKE_POOLS.map((pool) => {
          const apy = calculateApy(pool)
          const isSelected = selectedPool.id === pool.id
          return (
            <div
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={cn(
                'glass rounded-2xl p-6 cursor-pointer transition-all hover:scale-[1.02]',
                isSelected ? 'border-2 border-primary' : 'border border-gray-800'
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold">{pool.name}</h3>
                  <p className="text-gray-400">{pool.lockDays} {t('common:days')}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">{apy}%</div>
                  <div className="text-sm text-gray-400">APY</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <div className="text-gray-400">{t('stake:total_staked')}</div>
                  <div className="font-medium">{pool.totalStaked.toLocaleString()} REEL</div>
                </div>
                <div>
                  <div className="text-gray-400">{t('stake:min_deposit')}</div>
                  <div className="font-medium">{pool.minStake} REEL</div>
                </div>
                {pool.maxStake && (
                  <div>
                    <div className="text-gray-400">{t('stake:max_capacity')}</div>
                    <div className="font-medium">{pool.maxStake.toLocaleString()} REEL</div>
                  </div>
                )}
                {pool.lockDays > 0 && (
                  <div>
                    <div className="text-gray-400">{t('stake:early_exit_penalty')}</div>
                    <div className="font-medium">{pool.penaltyRate}% of earned</div>
                  </div>
                )}
              </div>

              {pool.lockDays > 0 && (
                <div className="px-3 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg text-sm">
                  Locked for {pool.lockDays} {t('common:days')}, early withdrawal reduces reward
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Deposit Form */}
      <div className="glass rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6">
          {t('common:stake')} - {selectedPool.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                {t('common:amount')} (REEL)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min={selectedPool.minStake}
                className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
              />
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Balance: 1250.50 REEL</span>
                <button className="text-primary hover:text-primary/80">Max</button>
              </div>
            </div>

            <div>
              <div className="flex justify-between p-3 bg-dark-lighter rounded-lg">
                <span className="text-gray-400">Expected APY</span>
                <span className="font-bold text-green-400">{calculateApy(selectedPool)}%</span>
              </div>
            </div>

            {Number(amount) > 0 && (
              <div className="p-4 bg-dark-lighter rounded-xl space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Principal</span>
                  <span className="font-medium">{Number(amount)} REEL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expected Earn ({selectedPool.lockDays || 365} days)</span>
                  <span className="font-bold text-green-400">
                    {calculateExpectedEarn(selectedPool, Number(amount))} REEL
                  </span>
                </div>
              </div>
            )}

            <button
              disabled={!amount || Number(amount) < selectedPool.minStake}
              className={cn(
                'w-full py-4 rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02]',
                (!amount || Number(amount) < selectedPool.minStake) 
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary to-secondary'
              )}
            >
              {t('common:stake')}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('stake:vip_bonus')}</h3>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-dark-lighter rounded-lg">
                <span>VIP 0 (Free)</span>
                <span className="text-green-400 font-medium">+0.0%</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-lighter rounded-lg">
                <span>VIP 1</span>
                <span className="text-green-400 font-medium">+0.5%</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-lighter rounded-lg">
                <span>VIP 2</span>
                <span className="text-green-400 font-medium">+1.0%</span>
              </div>
              <div className="flex justify-between p-3 bg-dark-lighter rounded-lg">
                <span>VIP 3</span>
                <span className="text-green-400 font-medium">+1.5%</span>
              </div>
              <div className="p-3 bg-primary/10 text-primary rounded-lg">
                Your current VIP {userVipLevel} → +{userVipLevel * 0.5}% extra APY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Stakes */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">{t('stake:my_stakes')}</h2>
        <div className="space-y-4">
          {MY_STAKES.map((stake) => {
            const pool = STAKE_POOLS.find(p => p.id === stake.poolId)
            const apy = calculateApy(pool!) + stake.vipLevel * 0.5
            return (
              <div key={stake.poolId} className="p-5 bg-dark-lighter rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{stake.poolName}</h3>
                    {stake.lockEndTime && (
                      <p className="text-sm text-gray-400">
                        {t('stake:lock_ends')}: {new Date(stake.lockEndTime).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">{stake.amount.toFixed(2)} REEL</div>
                    <div className="text-sm text-green-400">+{stake.earned.toFixed(2)} {t('stake:earned')}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-400">APY</div>
                    <div className="font-medium text-green-400">{apy}%</div>
                  </div>
                  <div>
                    <div className="text-gray-400">{t('stake:pending')}</div>
                    <div className="font-medium">{stake.pending.toFixed(2)} REEL</div>
                  </div>
                  <div>
                    <div className="text-gray-400">{t('stake:auto_compound')}</div>
                    <div className="font-medium">{stake.autoCompound ? 'On' : 'Off'}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-medium transition-colors">
                    {t('stake:claim_reward')}
                  </button>
                  {(!pool?.lockDays || Date.now() > stake.lockEndTime!) ? (
                    <button className="flex-1 py-2 bg-red-600/90 hover:bg-red-600 rounded-lg font-medium transition-colors">
                      {t('stake:unstake')}
                    </button>
                  ) : (
                    <button disabled className="flex-1 py-2 bg-gray-600 rounded-lg font-medium cursor-not-allowed opacity-50">
                      {t('stake:locked')}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
