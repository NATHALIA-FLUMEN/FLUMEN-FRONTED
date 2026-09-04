import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { videoService } from '../services/api.js';

const VideoContext = createContext(null);

export function VideoProvider({ children }) {
  const [videos, setVideos] = useState([]);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filter, setFilter] = useState('all');

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (searchTerm) params.term = searchTerm;
      if (filter === 'free') params.free = 'true';
      if (filter === 'paid') params.paid = 'true';

      const data = await videoService.getAll(params);
      setVideos(data.data || []);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [searchTerm, activeCategory, filter]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const [featured, cats] = await Promise.all([
          videoService.getFeatured(),
          videoService.getCategories()
        ]);
        setFeaturedVideos(featured.data || []);
        setCategories(cats.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchVideos();
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm, activeCategory, filter, fetchVideos]);

  const getVideoById = useCallback(async (id) => {
    try {
      const data = await videoService.getById(id);
      return data.data;
    } catch (err) {
      throw err;
    }
  }, []);

  const value = {
    videos,
    featuredVideos,
    categories,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    filter,
    setFilter,
    fetchVideos,
    getVideoById
  };

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

export function useVideos() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideos debe usarse dentro de VideoProvider');
  }
  return context;
}
