import { Dialog } from './Dialog'
import { useTranslation } from 'react-i18next'
import { Wallet, X } from 'lucide-react'
import { cn } from '../utils/cn'

interface ConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
}

const wallets = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: Wallet,
    description: 'Connect to your MetaMask wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: Wallet,
    description: 'Connect with WalletConnect',
  },
  {
    id: 'okx',
    name: 'OKX Wallet',
    icon: X,
    description: 'Connect to your OKX wallet',
  },
]

export default function ConnectWalletModal({ isOpen, onClose }: ConnectWalletModalProps) {
  const { t } = useTranslation()

  const handleConnect = (walletId: string) => {
    console.log('Connecting with', walletId)
    // Here would be the actual wallet connection logic
    setTimeout(() => {
      onClose()
    }, 500)
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={t('common:connect_wallet')}>
      <div className="space-y-4 py-4">
        <p className="text-gray-400 text-center mb-6">
          Select a wallet provider to connect
        </p>
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const Icon = wallet.icon
            return (
              <button
                key={wallet.id}
                onClick={() => handleConnect(wallet.id)}
                className={cn(
                  'w-full flex items-center gap-4 px-4 py-4 rounded-xl glass border border-gray-700',
                  'hover:border-primary hover:bg-primary/10 transition-all'
                )}
              >
                <div className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-lg">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">{wallet.name}</div>
                  <div className="text-sm text-gray-400">{wallet.description}</div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Dialog>
  )
}
