import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../components/video/CategoryFilter.jsx';
import VideoGrid from '../components/video/VideoGrid.jsx';
import PaymentModal from '../components/ui/PaymentModal.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import { Compass } from 'lucide-react';

export default function Explore() {
  const { videos, loading, error, filter, setFilter } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const handlePlay = (video) => navigate(`/video/${video.id}`);
  const handleLocked = (video) => setSelectedVideo(video);

  return (
    <div className="container-app py-24 sm:py-28 min-h-screen">
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
        <Compass className="w-8 h-8 text-brand-500" />
        Explorar catálogo
      </h1>
      <p className="text-gray-400 mb-8">
        Descubre toda nuestra colección de videos disponibles, gratuitos y premium.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-6 mb-8">
        <CategoryFilter />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'all'
                ? 'bg-dark-500 text-white'
                : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'free'
                ? 'bg-emerald-500 text-white'
                : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
            }`}
          >
            Solo gratis
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === 'paid'
                ? 'bg-brand-600 text-white'
                : 'bg-dark-600 text-gray-400 hover:bg-dark-500'
            }`}
          >
            Solo premium
          </button>
        </div>
      </div>

      <VideoGrid
        videos={videos}
        loading={loading}
        onPlay={handlePlay}
        onLocked={handleLocked}
      />

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
