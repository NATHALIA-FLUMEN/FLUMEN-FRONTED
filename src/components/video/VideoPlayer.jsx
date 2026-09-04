import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Eye, Star, Clock, ArrowLeft, Lock, Tag, ShieldAlert } from 'lucide-react';
import { useVideos } from '../../context/VideoContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { videoService } from '../../services/api.js';
import useScreenProtection from '../../hooks/useScreenProtection.js';

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

export default function VideoPlayer() {
  const { id } = useParams();
  const { getVideoById, videos } = useVideos();
  const { user, isAdmin } = useAuth();
  const [video, setVideo] = useState(null);
  const [playback, setPlayback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        setAccessDenied(false);
        const data = await getVideoById(id);
        setVideo(data);

        // Obtener URL de reproducción (firmada en premium)
        try {
          const pb = await videoService.getPlayback(id);
          setPlayback(pb);
        } catch (e) {
          // 401 en premium => sin acceso
          if (Number(data?.price) > 0) {
            setAccessDenied(true);
          } else {
            setError(e.message);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, getVideoById]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Protección anti-captura activa Mientras se reproduce contenido
  const canPlay = !!playback?.url && !accessDenied;
  const { blocked, dismissBlock } = useScreenProtection({
    enabled: canPlay,
    onAttempt: useCallback(() => {}, [])
  });

  if (loading) {
    return (
      <div className="container-app py-32">
        <div className="aspect-video bg-dark-700 rounded-3xl animate-pulse mb-6"></div>
        <div className="h-8 bg-dark-700 rounded animate-pulse w-1/2 mb-3"></div>
        <div className="h-4 bg-dark-700 rounded animate-pulse w-1/3"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="container-app py-32 text-center">
        <p className="text-xl text-gray-300 mb-4">{error || 'Video no encontrado'}</p>
        <button className="btn-secondary" onClick={() => navigate('/')}>
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>
    );
  }

  const related = videos
    .filter((v) => v.id !== video.id && v.category === video.category)
    .slice(0, 4);

  const isFree = Number(video.price) === 0;

  return (
    <div className="container-app py-24 sm:py-28">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative overflow-hidden rounded-3xl shadow-hover group aspect-video">
            {/* Overlay anti-captura */}
            {blocked && canPlay && (
              <div className="absolute inset-0 z-50 bg-dark-900/95 flex flex-col items-center justify-center gap-3" onClick={dismissBlock}>
                <ShieldAlert className="w-12 h-12 text-brand-400 animate-pulse" />
                <p className="text-white font-semibold">Contenido protegido</p>
                <p className="text-gray-400 text-sm px-8 text-center">
                  Está prohibida la captura o grabación de este video.
                </p>
              </div>
            )}

            {accessDenied && !isFree ? (
              <div className="absolute inset-0 bg-gradient-to-br from-dark-800 via-dark-900 to-dark-800 flex flex-col items-center justify-center text-center p-8 rounded-3xl">
                <div className="w-20 h-20 rounded-full bg-brand-600/20 border border-brand-600/40 flex items-center justify-center mb-5">
                  <Lock className="w-9 h-9 text-brand-400" />
                </div>
                <h2 className="font-display text-2xl font-bold text-white mb-2">
                  Video Premium bloqueado
                </h2>
                <p className="text-gray-400 max-w-md mb-6">
                  Debes comprar este video para poder reproducirlo. Tu contenido quedará
                  disponible de inmediato tras completar el pago.
                </p>
                <button
                  className="btn-primary"
                  onClick={() => (user ? navigate(`/checkout/${video.id}`) : navigate('/auth'))}
                >
                  <Lock className="w-4 h-4" />
                  {user ? `Comprar por $${video.price.toFixed(2)}` : 'Inicia sesión para comprar'}
                </button>
              </div>
            ) : canPlay ? (
              <video
                key={playback.url}
                src={playback.url}
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                poster={video.thumbnail}
                className="w-full h-full bg-black rounded-3xl"
              />
            ) : (
              <div className="absolute inset-0 bg-dark-800 flex items-center justify-center rounded-3xl">
                <p className="text-gray-400">No hay URL de reproducción disponible.</p>
              </div>
            )}

            {isFree && !accessDenied && (
              <div className="absolute -bottom-1 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-4 flex items-center justify-center gap-2">
                <span className="badge bg-mintx-500/90 text-white shadow-lg">
                  <Play className="w-3 h-3 mr-1 fill-current" />
                  Contenido Gratis
                </span>
              </div>
            )}
            {!isFree && !accessDenied && canPlay && (
              <div className="absolute -bottom-1 left-0 right-0 bg-gradient-to-t from-dark-900 to-transparent p-4 flex items-center justify-center gap-2">
                <span className="badge bg-brand-600 text-white shadow-lg">
                  <Lock className="w-3 h-3 mr-1" />
                  Contenido Premium - ${video.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {video.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-yellow-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-semibold">{Number(video.rating).toFixed(1)}</span>
                </span>
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Eye className="w-5 h-5" />
                  {formatViews(video.views)} vistas
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="badge bg-dark-600 text-gray-300">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(video.duration)}
              </span>
              <span className="badge bg-brand-600/20 text-brand-300 border border-brand-600/30">
                {video.category}
              </span>
              <span className="badge bg-dark-600 text-gray-300">
                <Tag className="w-3 h-3 mr-1" />
                {(video.tags || []).join(', ')}
              </span>
            </div>

            <div className="bg-dark-800 rounded-2xl p-5 card-surface">
              <h3 className="font-semibold text-white mb-2">Descripción</h3>
              <p className="text-gray-400 leading-relaxed">{video.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              {!isFree && accessDenied ? (
                <button
                  className="btn-primary"
                  onClick={() => (user ? navigate(`/checkout/${video.id}`) : navigate('/auth'))}
                >
                  <Lock className="w-5 h-5" />
                  {user ? `Comprar por $${video.price.toFixed(2)}` : 'Inicia sesión para comprar'}
                </button>
              ) : isFree ? (
                <a href={playback?.url || video.videoUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <Play className="w-5 h-5 fill-current" />
                  Reproducir gratis
                </a>
              ) : (
                <span className="badge bg-mintx-500/90 text-white text-sm px-4 py-2">
                  Ya tienes acceso a este video ✓
                </span>
              )}
              <button className="btn-secondary" onClick={() => navigate('/explorar')}>
                Explorar más
              </button>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <aside>
            <h3 className="font-display font-semibold text-lg text-white mb-4">
              Relacionados
            </h3>
            <div className="space-y-4">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/video/${rel.id}`)}
                  className="flex gap-3 cursor-pointer card-surface p-2 hover:border-brand-600/50 transition-all"
                >
                  <div className="w-28 flex-shrink-0 relative">
                    <img src={rel.thumbnail} alt={rel.title} className="w-28 h-16 object-cover rounded-lg" />
                    {rel.price > 0 && (
                      <span className="absolute bottom-1 right-1 badge bg-brand-600 text-white !px-1.5 !py-0 text-[9px]">
                        ${Number(rel.price).toFixed(0)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-white truncate">{rel.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{rel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
