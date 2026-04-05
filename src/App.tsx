import { Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import LanguageSwitcher from './components/LanguageSwitcher'
import Home from './pages/Home'
import DramaPlayer from './pages/DramaPlayer'
import AssetDetail from './pages/AssetDetail'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Stake from './pages/Stake'
import ConnectWalletModal from './components/ConnectWalletModal'

function App() {
  const { i18n } = useTranslation()
  const [walletModalOpen, setWalletModalOpen] = useState(false)

  useEffect(() => {
    // Set language based on browser or saved preference
    const savedLang = localStorage.getItem('language')
    const browserLang = navigator.language.split('-')[0]
    const defaultLang = savedLang || (browserLang === 'zh' ? 'zh' : 'en')
    i18n.changeLanguage(defaultLang)
  }, [i18n])

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-deeper via-dark to-dark-lighter">
      <Navbar onConnectWallet={() => setWalletModalOpen(true)} />
      
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/drama/:id" element={<DramaPlayer />} />
          <Route path="/asset/:id" element={<AssetDetail />} />
          <Route path="/market" element={<Market />} />
          <Route path="/stake" element={<Stake />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="py-8 mt-20 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2026 ReelRWA. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </footer>

      <ConnectWalletModal 
        isOpen={walletModalOpen} 
        onClose={() => setWalletModalOpen(false)} 
      />
    </div>
  )
}

export default App
