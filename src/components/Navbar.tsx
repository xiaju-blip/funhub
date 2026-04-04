import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Search, Bell, User } from 'lucide-react'
import LanguageSwitcher from './LanguageSwitcher'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface NavbarProps {
  onConnectWallet: () => void
}

export default function Navbar({ onConnectWallet }: NavbarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isConnected] = useState(false)

  const navItems = [
    { label: t('common:home'), path: '/' },
    { label: t('common:market'), path: '/market' },
    { label: t('common:dramas'), path: '/dramas' },
    { label: t('common:assets'), path: '/assets' },
    { label: t('common:profile'), path: '/profile' },
  ]

  const truncateAddress = (addr: string) => {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-deeper/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">R</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              ReelRWA
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-white',
                  location.pathname === item.path
                    ? 'text-white'
                    : 'text-gray-400'
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors">
              <Search size={20} />
            </button>
            
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {isConnected ? (
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-dark-lighter rounded-full border border-gray-700">
                <User size={16} className="text-primary" />
                <span className="text-sm font-medium">
                  {truncateAddress('0x1234567890abcdef1234567890abcdef12345678')}
                </span>
              </div>
            ) : (
              <button
                onClick={onConnectWallet}
                className="hidden md:block px-6 py-2 bg-gradient-to-r from-primary to-secondary rounded-full font-medium text-white glow transition-all hover:scale-105"
              >
                {t('common:connect_wallet')}
              </button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-dark border-b border-gray-800">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2 rounded-lg text-base font-medium',
                  location.pathname === item.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-300 hover:bg-gray-800'
                )}
              >
                {item.label}
              </Link>
            ))}
            {!isConnected && (
              <button
                onClick={() => {
                  onConnectWallet()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-lg font-medium text-white"
              >
                {t('common:connect_wallet')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
