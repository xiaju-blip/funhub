import { motion } from 'framer-motion'

interface StatCardProps {
  label: string
  value: string
  suffix?: string
  delay?: number
}

export default function StatCard({ label, value, suffix, delay = 0 }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-xl p-6 text-center"
    >
      <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-primary">
        {value}
        {suffix && <span className="text-lg text-gray-400 ml-1">{suffix}</span>}
      </div>
      <div className="mt-2 text-gray-400 text-sm">{label}</div>
    </motion.div>
  )
}
