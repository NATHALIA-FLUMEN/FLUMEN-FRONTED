import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard.jsx';
import PaymentModal from '../components/ui/PaymentModal.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import { Crown, Check, ArrowRight } from 'lucide-react';

export default function PremiumVideos() {
  const { videos, loading, error } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const paidVideos = videos.filter((v) => v.price > 0);

  const handlePlay = (video) => navigate(`/video/${video.id}`);
  const handleLocked = (video) => setSelectedVideo(video);

  const benefits = [
    'Acceso permanente de pago único (sin suscripción)',
    'Videos en 4K Ultra HD y alta calidad',
    'Cursos y masterclass exclusivos',
    'Pago seguro online con tarjeta y métodos locales',
    'Reproducción inmediata tras la compra'
  ];

  return (
    <div className="container-app py-24 sm:py-28 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Crown className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
          Contenido Premium de Flumen
        </h1>
        <p className="text-gray-400">
          Accede a cursos, masterclass y contenido exclusivo de la plataforma.
          Elige un video, paga una sola vez y disfrútalo para siempre.
        </p>
      </div>

      <div className="card-surface p-8 sm:p-12 mb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(124,93,255,0.15),transparent_50%)]"></div>
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-4">
              Pago único. Acceso ilimitado.
            </h2>
            <p className="text-gray-400 mb-6">
              No usamos suscripciones: compras cada video y queda en tu biblioteca
              para reproducirlo cuando quieras. Sin compromisos mensuales.
            </p>
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-gray-200">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">
              {paidVideos.length}
            </div>
            <p className="text-gray-400 mb-6">videos premium disponibles</p>
            <button onClick={() => navigate('/explorar?cat=all')} className="btn-primary">
              Explorar y comprar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
          ⚠️ {error}
        </div>
      )}

      <h2 className="section-title">Videos premium disponibles</h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-dark-700 rounded-2xl mb-3"></div>
              <div className="h-4 bg-dark-700 rounded mb-2 w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paidVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={handlePlay}
              onLocked={handleLocked}
            />
          ))}
        </div>
      )}

      {selectedVideo && (
        <PaymentModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
          onSuccess={() => navigate(`/video/${selectedVideo.id}`)}
        />
      )}
    </div>
  );
}
