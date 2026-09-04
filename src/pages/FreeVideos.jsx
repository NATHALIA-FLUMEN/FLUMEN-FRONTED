import { useNavigate } from 'react-router-dom';
import VideoCard from '../components/video/VideoCard.jsx';
import PaymentModal from '../components/ui/PaymentModal.jsx';
import { useVideos } from '../context/VideoContext.jsx';
import { useState } from 'react';
import { Gift } from 'lucide-react';

export default function FreeVideos() {
  const { videos, loading, error } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const navigate = useNavigate();

  const freeVideos = videos.filter((v) => v.price === 0);

  const handlePlay = (video) => navigate(`/video/${video.id}`);
  const handleLocked = (video) => setSelectedVideo(video);

  return (
    <div className="container-app py-24 sm:py-28 min-h-screen">
      <div className="max-w-2xl mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <Gift className="w-8 h-8 text-emerald-400" />
          Videos gratuitos
        </h1>
        <p className="text-gray-400">
          Disfruta gratis de una selección de nuestros mejores contenidos. Sin registro, sin tarjetas.
          Solo reproduce y disfruta.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
          ⚠️ {error}
        </div>
      )}

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
          {freeVideos.map((video) => (
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
