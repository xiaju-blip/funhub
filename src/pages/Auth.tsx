import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Phone, Lock, ArrowRight, Wallet } from 'lucide-react'
import { cn } from '../utils/cn'

type AuthMode = 'login' | 'register'
type AuthMethod = 'email' | 'phone' | 'wallet'

export default function Auth() {
  const { t } = useTranslation()
  const [mode, setMode] = useState<AuthMode>('login')
  const [authMethod, setAuthMethod] = useState<AuthMethod>('email')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit auth form', { mode, authMethod, formData })
    // Handle authentication here
  }

  const handleGoogleLogin = () => {
    console.log('Google OAuth login')
    // Handle Google OAuth here
  }

  const sendCode = () => {
    const target = authMethod === 'email' ? formData.email : formData.phone
    console.log('Send verification code to', target)
    // Send code logic
  }

  const handleWalletConnect = () => {
    console.log('Wallet connect login')
    // Handle Wallet connect logic here (e.g. Web3Modal, RainbowKit, etc.)
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="glass rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {mode === 'login' ? t('auth:welcome_back') : t('auth:create_account')}
            </h1>
            <p className="text-gray-400">
              {mode === 'login' 
                ? t('auth:login_to_continue') 
                : t('auth:register_to_start')
              }
            </p>
          </div>

          {/* Social Login */}
          <div className="mb-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-gray-700 rounded-xl transition-colors font-medium"
            >
              <span className="text-red-500 font-bold text-xl">G</span>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex bg-dark-lighter rounded-xl p-1 mb-6">
            <button
              onClick={() => setAuthMethod('email')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                authMethod === 'email' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} />
                {t('auth:email')}
              </div>
            </button>
            <button
              onClick={() => setAuthMethod('phone')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                authMethod === 'phone' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Phone size={16} />
                {t('auth:phone')}
              </div>
            </button>
            <button
              onClick={() => setAuthMethod('wallet')}
              className={cn(
                'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                authMethod === 'wallet' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet size={16} />
                {t('auth:wallet')}
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMethod === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('auth:email_address')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            {authMethod === 'phone' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('auth:phone_number')}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+1 123 456 7890"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            {authMethod !== 'wallet' && ((mode === 'register' || (mode === 'login' && !formData.code)) && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('auth:verification_code')}
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="123456"
                    className="flex-1 px-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={sendCode}
                    className="px-4 py-3 bg-primary hover:bg-primary/90 rounded-lg font-medium whitespace-nowrap transition-colors"
                  >
                    {t('auth:send_code')}
                  </button>
                </div>
              </div>
            ))}

            {authMethod !== 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('auth:password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            {authMethod === 'wallet' && mode === 'login' && (
              <div className="text-center py-6">
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  className="px-6 py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02] inline-flex items-center gap-2"
                >
                  <Wallet size={20} />
                  {t('auth:connect_wallet')}
                </button>
                <p className="text-sm text-gray-400 mt-3">
                  {t('auth:connect_wallet_hint')}
                </p>
              </div>
            )}

            {mode === 'register' && authMethod !== 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  {t('auth:confirm_password')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-lighter border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>
            )}

            {mode === 'register' && authMethod !== 'wallet' && (
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  {t('auth:i_agree')}{' '}
                  <a href="#" className="text-primary hover:underline">
                    {t('auth:privacy_policy')}
                  </a>{' '}{' & '}{' '}
                  <a href="#" className="text-primary hover:underline">
                    {t('auth:terms_of_service')}
                  </a>
                </label>
              </div>
            )}

            {authMethod !== 'wallet' && (
              <button
                type="submit"
                disabled={mode === 'register' && !agreeTerms}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === 'login' ? t('auth:login') : t('auth:register')}
                <ArrowRight size={18} className="inline-block ml-2" />
              </button>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === 'login' 
                ? t('auth:dont_have_account') 
                : t('auth:already_have_account')
              }{' '}
              <button
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="text-primary hover:underline font-medium"
              >
                {mode === 'login' ? t('auth:sign_up') : t('auth:sign_in')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
