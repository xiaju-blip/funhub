import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { createChart, type Time } from 'lightweight-charts'
import { useEffect, useRef } from 'react'
import { cn } from '../utils/cn'

// Mock data for candlestick
const generateCandlestickData = () => {
  const data = []
  const basePrice = 1.0
  let price = basePrice
  const now = Math.floor(Date.now() / 1000)
  for (let i = 0; i < 100; i++) {
    const time = (now - (100 - i) * 3600) as Time
    const open = price
    const change = (Math.random() - 0.5) * 0.1
    const close = open + change
    const high = Math.max(open, close) + Math.random() * 0.02
    const low = Math.min(open, close) - Math.random() * 0.02
    data.push({
      time,
      open,
      high,
      low,
      close,
    })
    price = close
  }
  return data
}

// Mock order book
const MOCK_ORDERS = {
  bids: [
    { price: 0.985, amount: 123.45, total: 121.6 },
    { price: 0.980, amount: 234.56, total: 229.9 },
    { price: 0.975, amount: 345.67, total: 337.0 },
    { price: 0.970, amount: 456.78, total: 443.1 },
    { price: 0.965, amount: 567.89, total: 548.0 },
  ],
  asks: [
    { price: 1.015, amount: 98.76, total: 100.2 },
    { price: 1.020, amount: 187.65, total: 191.4 },
    { price: 1.025, amount: 276.54, total: 283.5 },
    { price: 1.030, amount: 365.43, total: 376.4 },
    { price: 1.035, amount: 454.32, total: 470.3 },
  ],
}

// Mock recent trades
const MOCK_TRADES = [
  { price: '1.008', amount: '50.00', time: '12:34', isBuy: true },
  { price: '1.005', amount: '25.50', time: '12:33', isBuy: false },
  { price: '1.006', amount: '100.00', time: '12:31', isBuy: true },
  { price: '1.004', amount: '75.25', time: '12:30', isBuy: true },
  { price: '1.003', amount: '150.00', time: '12:28', isBuy: false },
  { price: '1.002', amount: '30.00', time: '12:25', isBuy: false },
  { price: '1.005', amount: '60.00', time: '12:22', isBuy: true },
]

export default function Market() {
  const { t } = useTranslation()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const [selectedPair, setSelectedPair] = useState('IPT/USDT')
  const [buyPrice, setBuyPrice] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  // Sell form state is ready for future implementation

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.1)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.1)' },
      },
    })

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })

    const data = generateCandlestickData()
    candlestickSeries.setData(data)

    chart.timeScale().fitContent()
    chartRef.current = chart

    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  const pairs = ['IPT/USDT', 'IPT/REEL', 'REEL/USDT']

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('trade:market_overview')}</h1>
        <p className="text-gray-400">Trade IPT tokens with C2C order book and AMM liquidity</p>
      </div>

      {/* Trading Pair Selection */}
      <div className="flex flex-wrap gap-4 mb-6">
        {pairs.map((pair) => (
          <button
            key={pair}
            onClick={() => setSelectedPair(pair)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              selectedPair === pair
                ? 'bg-primary text-white'
                : 'bg-dark-lighter text-gray-400 hover:bg-gray-700'
            )}
          >
            {pair}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-3">
          <div className="glass rounded-2xl p-4">
            <div ref={chartContainerRef} className="w-full" style={{ height: 400 }} />
          </div>

          {/* Order Book & Recent Trades */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Order Book */}
            <div className="glass rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-4">{t('trade:order_book')}</h3>
              <div className="space-y-1">
                <div className="flex text-xs text-gray-400 px-2 mb-2">
                  <span className="w-1/3">{t('trade:price')}</span>
                  <span className="w-1/3 text-center">{t('common:amount')}</span>
                  <span className="w-1/3 text-right">{t('common:total')}</span>
                </div>
                {[...MOCK_ORDERS.asks].reverse().map((ask, i) => (
                  <div key={`ask-${i}`} className="flex items-center relative px-2 py-1">
                    <div className="absolute inset-0 bg-red-500/20 right-0" style={{ width: `${(ask.total / 500) * 100}%` }} />
                    <span className="w-1/3 relative z-10 text-red-400 font-medium">{ask.price.toFixed(3)}</span>
                    <span className="w-1/3 text-center relative z-10 text-gray-300">{ask.amount.toFixed(2)}</span>
                    <span className="w-1/3 text-right relative z-10 text-gray-300">{ask.total.toFixed(1)}</span>
                  </div>
                ))}
                <div className="py-2 px-2 text-center text-lg font-bold">
                  <span className={MOCK_TRADES[MOCK_TRADES.length - 1].isBuy ? 'text-green-400' : 'text-red-400'}>
                    {MOCK_TRADES[MOCK_TRADES.length - 1].price}
                  </span>
                </div>
                {MOCK_ORDERS.bids.map((bid, i) => (
                  <div key={`bid-${i}`} className="flex items-center relative px-2 py-1">
                    <div className="absolute inset-0 bg-green-500/20 right-0" style={{ width: `${(bid.total / 500) * 100}%` }} />
                    <span className="w-1/3 relative z-10 text-green-400 font-medium">{bid.price.toFixed(3)}</span>
                    <span className="w-1/3 text-center relative z-10 text-gray-300">{bid.amount.toFixed(2)}</span>
                    <span className="w-1/3 text-right relative z-10 text-gray-300">{bid.total.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="glass rounded-2xl p-4">
              <h3 className="text-lg font-semibold mb-4">{t('trade:recent_trades')}</h3>
              <div className="space-y-1">
                <div className="flex text-xs text-gray-400 px-2 mb-2">
                  <span className="w-1/4">{t('trade:price')}</span>
                  <span className="w-1/4 text-center">{t('common:amount')}</span>
                  <span className="w-1/4 text-center">{t('common:time')}</span>
                </div>
                {MOCK_TRADES.map((trade, i) => (
                  <div key={i} className="flex px-2 py-1 text-sm">
                    <span className={cn(
                      'w-1/4 font-medium',
                      trade.isBuy ? 'text-green-400' : 'text-red-400'
                    )}>
                      {trade.price}
                    </span>
                    <span className="w-1/4 text-center text-gray-300">{trade.amount}</span>
                    <span className="w-1/4 text-center text-gray-400">{trade.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Form */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-4">
            <div className="tabs tabs-boxed bg-dark-lighter rounded-xl p-1 mb-4">
              <div className="flex gap-1">
                <button className={cn(
                  'flex-1 py-2 rounded-lg font-medium',
                  'bg-primary text-white'
                )}>
                  {t('common:buy')}
                </button>
                <button className={cn(
                  'flex-1 py-2 rounded-lg font-medium',
                  'text-gray-400 hover:text-white'
                )}>
                  {t('common:sell')}
                </button>
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('trade:price')} ({selectedPair.split('/')[1]})
                </label>
                <input
                  type="number"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('common:amount')} ({selectedPair.split('/')[0]})
                </label>
                <input
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t('common:total')}</span>
                <span className="text-white font-medium">
                  {(Number(buyPrice) * Number(buyAmount)).toFixed(4)}
                </span>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02]">
                {t('common:buy')}
              </button>
            </div>

            {/* My Orders */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">{t('trade:my_orders')}</h3>
              <div className="text-center py-8 text-gray-400 text-sm">
                No open orders
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
