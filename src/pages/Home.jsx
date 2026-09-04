import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/layout/Hero.jsx';
import VideoGrid from '../components/video/VideoGrid.jsx';
import PaymentModal from '../components/ui/PaymentModal.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import { Crown, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const { featuredVideos, videos, loading, error } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const handlePlay = (video) => {
    navigate(`/video/${video.id}`);
  };

  const handleLocked = (video) => {
    setSelectedVideo(video);
  };

  const featured = featuredVideos.slice(0, 4);
  const trending = videos.slice(0, 8);

  return (
    <>
      <Hero />

      <section className="container-app py-12">
        {error && (
          <div className="mb-8 p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
            ⚠️ {error}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title flex items-center gap-2 mb-0">
            <Sparkles className="w-6 h-6 text-brand-500" />
            Destacados
          </h2>
          <Link to="/explorar" className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1">
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <VideoGrid
          videos={featured}
          loading={loading && !featured.length}
          onPlay={handlePlay}
          onLocked={handleLocked}
        />
      </section>

      <section className="py-12 bg-dark-800/50 border-y border-dark-600/50">
        <div className="container-app">
          <h2 className="section-title flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-brand-500" />
            Tendencias en la plataforma
          </h2>
          <VideoGrid
            videos={trending}
            loading={loading && !videos.length}
            onPlay={handlePlay}
            onLocked={handleLocked}
          />

          <div className="mt-10 bg-gradient-to-r from-brand-700 to-brand-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]"></div>
            <div className="relative">
              <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">
                Desbloquea todo el catálogo premium
              </h3>
              <p className="text-white/80 max-w-xl mx-auto mb-6">
                Adquiere acceso a más de {videos.filter(v => v.price > 0).length} videos exclusivos,
                cursos completos y contenido en 4K sin publicidad.
              </p>
              <button
                onClick={() => navigate('/premium')}
                className="btn-primary !bg-white !text-brand-700 hover:!bg-gray-100 hover:!shadow-glow"
              >
                Ver videos premium
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedVideo && (
        <PaymentModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onSuccess={() => navigate(`/video/${selectedVideo.id}`)}
        />
      )}
    </>
  );
}
