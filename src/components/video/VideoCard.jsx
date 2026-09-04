import { Play, Eye, Star, Lock, Clock, Bookmark } from 'lucide-react';
import { useState } from 'react';

function formatDuration(seconds) {
  if (!seconds) return '0:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatViews(views) {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
  return views;
}

export default function VideoCard({ video, onPlay, onLocked }) {
  const [isHover, setIsHover] = useState(false);
  const isFree = video.price === 0;
  const isPremium = Number(video.price) > 0;

  return (
    <article
      className="group relative cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      onClick={() => (isFree ? onPlay?.(video) : onLocked?.(video))}
    >
      <div className="relative rounded-2xl overflow-hidden aspect-video transition-all duration-500 group-hover:scale-[1.02]">
        {/* Background image */}
        <div className="absolute inset-0 bg-[#17181d]">
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={video.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          )}
        </div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
        {isHover && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(circle at 50% 70%, rgba(0,229,255,0.30), transparent 70%)' }}></div>
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          {isPremium ? (
            <span className="badge text-white font-semibold px-2.5 py-1 text-[11px] shadow-lg"
              style={{ background: 'linear-gradient(135deg,#f5c518,#00a8c9)' }}>
              <Lock className="w-3 h-3 mr-1" />
              ${Number(video.price).toFixed(2)}
            </span>
          ) : (
            <span className="badge bg-emerald-500 text-white px-2.5 py-1 text-[11px] font-semibold shadow-lg">
              GRATIS
            </span>
          )}

          <span className="badge bg-black/50 backdrop-blur text-white px-2 py-1 text-[11px]">
            <Clock className="w-3 h-3 mr-1" />
            {formatDuration(video.duration)}
          </span>
        </div>

        {/* Center play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-500 ${isHover ? 'scale-110 opacity-100' : 'opacity-0 scale-90'}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-2xl"
              style={{ background: 'linear-gradient(135deg,#00e5ff,#7c5cff)' }}>
              <Play className="w-6 h-6 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-white/80">{video.category}</span>
            <span className="flex items-center gap-1 text-[11px] text-white/70">
              <Eye className="w-3 h-3" />
              {formatViews(video.views)}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-white">
            {video.title}
          </h3>
        </div>
      </div>

      {/* Extended card on hover (desktop) */}
      <div className={`hidden md:block absolute left-0 right-0 top-1/2 z-20 rounded-2xl p-4 transition-all duration-500 origin-top ${isHover ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'}`}
        style={{ transformOrigin: 'bottom' }}>
        <div className="glass rounded-2xl p-4 shadow-2xl"
          style={{ boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold text-white">{Number(video.rating).toFixed(1)}</span>
            </span>
            <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-white/70 line-clamp-2 mb-3">{video.description}</p>
          <div className="flex flex-wrap gap-1">
            {(video.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
