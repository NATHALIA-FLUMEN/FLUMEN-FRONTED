import VideoCard from './VideoCard.jsx';
import { Film } from 'lucide-react';

export default function VideoGrid({ videos, loading, onPlay, onLocked, emptyMessage = 'No se encontraron videos' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-dark-700 rounded-2xl mb-3"></div>
            <div className="h-4 bg-dark-700 rounded mb-2 w-3/4"></div>
            <div className="h-3 bg-dark-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-16 bg-dark-800 rounded-3xl border border-dashed border-dark-500">
        <Film className="w-16 h-16 text-dark-500 mx-auto mb-4" />
        <p className="text-gray-400 font-medium">{emptyMessage}</p>
        <p className="text-sm text-gray-600 mt-1">Prueba cambiando los filtros o la búsqueda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          onPlay={onPlay}
          onLocked={onLocked}
        />
      ))}
    </div>
  );
}
