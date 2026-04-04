import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Play, Pause, Volume2, Fullscreen, Heart, MessageSquare, Share2 } from 'lucide-react'
import { cn } from '../utils/cn'

// Mock data
const MOCK_DRAMA = {
  id: '1',
  title: {
    zh: '逆袭千金：总裁的隐婚新娘',
    en: 'The Rebellious Heiress: CEO\'s Secret Wife'
  },
  description: {
    zh: '被渣男和继妹陷害，家破人亡的千金逆袭归来，开启复仇之路，意外嫁给神秘大佬，从此走上人生巅峰！',
    en: 'Framed by her scumbag ex and stepsister, the heiress returns for revenge. Unexpectedly marries a mysterious tycoon and reaches the top of her life!'
  },
  episodes: [
    { id: '1', number: 1, title: { zh: '第1集：家族破产', en: 'Episode 1: Family Bankruptcy' }, duration: 240 },
    { id: '2', number: 2, title: { zh: '第2集：街头相遇', en: 'Episode 2: Encounter on the Street' }, duration: 235, watched: true },
    { id: '3', number: 3, title: { zh: '第3集：神秘求婚', en: 'Episode 3: Mysterious Proposal' }, duration: 245 },
    { id: '4', number: 4, title: { zh: '第4集：初次反击', en: 'Episode 4: First Strike Back' }, duration: 240 },
    { id: '5', number: 5, title: { zh: '第5集：身份曝光', en: 'Episode 5: Identity Revealed' }, duration: 250 },
    { id: '6', number: 6, title: { zh: '第6集：开始布局', en: 'Episode 6: Setting the Trap' }, duration: 242 },
    { id: '7', number: 7, title: { zh: '第7集：强势打脸', en: 'Episode 7: Slap in the Face' }, duration: 238 },
    { id: '8', number: 8, title: { zh: '第8集：甜蜜同居', en: 'Episode 8: Sweet Cohabitation' }, duration: 245 },
    { id: '9', number: 9, title: { zh: '第9集：危机四伏', en: 'Episode 9: Dangerous Times' }, duration: 241 },
    { id: '10', number: 10, title: { zh: '第10集：终极对决', en: 'Episode 10: Final Showdown' }, duration: 255 },
  ],
  tags: {
    zh: ['逆袭', '总裁', '都市', '爱情'],
    en: ['Revenge', 'CEO', 'Urban', 'Romance']
  },
}

export default function DramaPlayer() {
  const { id } = useParams()
  const { t, i18n } = useTranslation()
  const [currentEpisode, setCurrentEpisode] = useState(MOCK_DRAMA.episodes[0])
  // id is used for API data fetching in production
  void id
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPoints, setCurrentPoints] = useState(125)
  const [todayPoints, setTodayPoints] = useState(45)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(1234)
  const [freeRemaining, setFreeRemaining] = useState(8)
  const [showAdModal, setShowAdModal] = useState(false)

  const currentTitle = i18n.language === 'zh' ? MOCK_DRAMA.title.zh : MOCK_DRAMA.title.en

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleEpisodeSelect = (episode: typeof MOCK_DRAMA.episodes[0]) => {
    // Check if free views exhausted
    if (freeRemaining <= 0) {
      setShowAdModal(true)
    } else {
      setCurrentEpisode(episode)
      setFreeRemaining(freeRemaining - 1)
    }
  }

  const handleWatchAd = () => {
    // Simulate ad watching
    setFreeRemaining(freeRemaining + 1)
    setTodayPoints(todayPoints + 5)
    setCurrentPoints(currentPoints + 5)
    setShowAdModal(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Player Section */}
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden glass">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1578632767115-351416917565?w=1200&h=675&fit=crop" 
                alt={currentTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 flex items-center justify-center bg-white/20 backdrop-blur rounded-full hover:bg-white/30 transition-colors"
              >
                {isPlaying ? (
                  <Pause size={40} className="text-white ml-1" />
                ) : (
                  <Play size={40} className="text-white ml-1" />
                )}
              </button>
            </div>
            
            {/* Player Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-4 text-white">
                <Volume2 size={20} />
                <div className="flex-1">
                  <div className="h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="w-1/3 h-full bg-primary"></div>
                  </div>
                </div>
                <Fullscreen size={20} />
              </div>
            </div>
          </div>

          {/* Drama Info */}
          <div className="mt-6 glass rounded-2xl p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{currentTitle}</h1>
            <p className="text-gray-400 mb-4">
              {i18n.language === 'zh' ? MOCK_DRAMA.description.zh : MOCK_DRAMA.description.en}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {(i18n.language === 'zh' ? MOCK_DRAMA.tags.zh : MOCK_DRAMA.tags.en).map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-dark-lighter rounded-full text-sm text-gray-300">
                  {tag}
                </span>
              ))}
            </div>

            {/* Interaction Bar */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-800">
              <button 
                onClick={handleLike}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Heart 
                  size={24} 
                  className={cn(liked ? 'fill-accent text-accent' : 'text-gray-400')}
                />
                <span className="font-medium">{likeCount.toLocaleString()}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                <MessageSquare size={24} />
                <span className="font-medium">89</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors">
                <Share2 size={24} />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* PoE Stats */}
          <div className="mt-6 glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t('drama:poe_mining')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">{t('drama:current_points')}</div>
                <div className="text-2xl font-bold text-primary">{currentPoints}</div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">{t('drama:today_earned')}</div>
                <div className="text-2xl font-bold text-green-400">+{todayPoints}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-gray-400 text-sm mb-2">{t('drama:estimated_reward')}</div>
              <div className="text-xl font-semibold">~ {(todayPoints / 1000).toFixed(3)} REEL</div>
            </div>
          </div>
        </div>

        {/* Episode Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass rounded-2xl p-4 sticky top-20">
            <h3 className="text-lg font-semibold mb-4">{t('drama:episodes')}</h3>
            
            {/* Free views hint */}
            <div className="mb-4 p-3 bg-dark-lighter rounded-lg">
              <p className="text-sm text-gray-300">
                {t('drama:free_views_remaining', { remaining: freeRemaining, total: 10 })}
              </p>
            </div>

            <div className="space-y-2 max-h-[800px] overflow-y-auto pr-2">
              {MOCK_DRAMA.episodes.map((episode) => {
                const episodeTitle = i18n.language === 'zh' ? episode.title.zh : episode.title.en
                return (
                  <button
                    key={episode.id}
                    onClick={() => handleEpisodeSelect(episode)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all border',
                      currentEpisode.id === episode.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-dark-lighter border-transparent hover:border-gray-600',
                      episode.watched && 'opacity-60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{episodeTitle}</span>
                      {episode.watched && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.floor(episode.duration / 60)}:{(episode.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Ad Modal for when free views exhausted */}
      {showAdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md glass rounded-2xl shadow-2xl p-6">
            <h3 className="text-xl font-bold mb-2">{t('drama:free_views_exhausted')}</h3>
            <p className="text-gray-400 mb-6">{t('drama:watch_ad_for_points')}</p>
            <p className="text-gray-400 mb-6">{t('drama:upgrade_vip')}</p>
            
            <div className="space-y-3">
              <button
                onClick={handleWatchAd}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary rounded-xl font-semibold text-white glow transition-all hover:scale-[1.02]"
              >
                {t('drama:watch_ad')} ({t('drama:get_points', { points: 5 })})
              </button>
              <button
                onClick={() => setShowAdModal(false)}
                className="w-full py-3 bg-dark-lighter hover:bg-gray-700 rounded-xl font-semibold transition-colors"
              >
                {t('common:cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
