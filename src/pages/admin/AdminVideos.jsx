import { useEffect, useState, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Film, Upload, X, Star, Eye, Lock, Tag, Save
} from 'lucide-react';
import { adminService } from '../../services/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '',
  description: '',
  category: 'General',
  tags: '',
  price: '0',
  featured: false,
  isPublished: true,
  duration: '0',
  rating: '4.5'
};

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const fileVideoRef = useRef(null);
  const fileThumbRef = useRef(null);

  const loadVideos = () => {
    setLoading(true);
    setError('');
    adminService
      .getVideos()
      .then((res) => setVideos(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setVideoFile(null);
    setThumbFile(null);
    setModalOpen(true);
  };

  const openEdit = (video) => {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description || '',
      category: video.category || 'General',
      tags: (video.tags || []).join(', '),
      price: String(video.price || 0),
      featured: Boolean(video.featured),
      isPublished: video.is_published !== false,
      duration: String(video.duration || 0),
      rating: String(video.rating || 4.5)
    });
    setVideoFile(null);
    setThumbFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('El título es obligatorio');
      return;
    }
    if (!editing && !videoFile) {
      toast.error('Debes subir un archivo de video');
      return;
    }

    setSaving(true);
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('category', form.category);
    data.append('tags', form.tags);
    data.append('price', form.price);
    data.append('duration', form.duration);
    data.append('rating', form.rating);
    data.append('featured', String(form.featured));
    data.append('isPublished', String(form.isPublished));
    if (videoFile) data.append('video', videoFile);
    if (thumbFile) data.append('thumbnail', thumbFile);

    try {
      if (editing) {
        await adminService.updateVideo(editing.id, data);
        toast.success('Video actualizado');
      } else {
        await adminService.createVideo(data);
        toast.success('Video creado');
      }
      setModalOpen(false);
      loadVideos();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (video) => {
    if (!window.confirm(`¿Eliminar el video "${video.title}"? Esta acción es irreversible.`)) return;
    try {
      await adminService.deleteVideo(video.id);
      toast.success('Video eliminado');
      loadVideos();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleTogglePublish = async (video) => {
    try {
      const data = new FormData();
      data.append('title', video.title);
      data.append('description', video.description || '');
      data.append('category', video.category || 'General');
      data.append('tags', (video.tags || []).join(', '));
      data.append('price', video.price);
      data.append('duration', video.duration || 0);
      data.append('rating', video.rating || 4.5);
      data.append('featured', String(video.featured));
      data.append('isPublished', String(video.is_published !== true));
      await adminService.updateVideo(video.id, data);
      toast.success(video.is_published ? 'Video dado de baja' : 'Video publicado');
      loadVideos();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Gestión de videos</h1>
          <p className="text-gray-400 text-sm mt-1">Sube, edita y administra el catálogo</p>
        </div>
        <button onClick={openCreate} className="btn-primary !py-2.5">
          <Plus className="w-4 h-4" />
          Nuevo video
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-brand-600/10 border border-brand-600/30 rounded-2xl text-brand-300">
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 rounded-3xl border border-dashed border-dark-500">
          <Film className="w-14 h-14 text-dark-500 mx-auto mb-3" />
          <p className="text-gray-400">No hay videos todavía</p>
          <button onClick={openCreate} className="btn-primary mt-4">
            <Plus className="w-4 h-4" />
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="card-surface p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-36 aspect-video bg-dark-700 rounded-xl flex-shrink-0 overflow-hidden">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-500">
                    <Film className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-white truncate">{video.title}</h3>
                  {video.featured && (
                    <span className="badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                      <Star className="w-3 h-3 mr-1" />
                      Destacado
                    </span>
                  )}
                  {!video.is_published && (
                    <span className="badge bg-gray-600/30 text-gray-400">Borrador</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  <span>{video.category}</span>
                  {Number(video.price) > 0 ? (
                    <span className="flex items-center gap-1 text-brand-400">
                      <Lock className="w-3 h-3" /> ${Number(video.price).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-emerald-400">Gratis</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {video.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {(video.tags || []).slice(0, 3).join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleTogglePublish(video)}
                  className="btn-secondary !py-2 !px-3 text-xs"
                  title={video.is_published ? 'Dar de baja' : 'Publicar'}
                >
                  {video.is_published ? 'Ocultar' : 'Publicar'}
                </button>
                <button onClick={() => openEdit(video)} className="btn-secondary !py-2 !px-3 text-xs">
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(video)}
                  className="py-2 px-3 rounded-xl bg-brand-600/20 text-brand-400 hover:bg-brand-600/30 text-xs transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !saving && setModalOpen(false)}>
          <div
            className="bg-dark-800 rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-500"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-white">
                {editing ? 'Editar video' : 'Nuevo video'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Título *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="input-app"
                  placeholder="Ej: Mi video increíble"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-app min-h-[90px]"
                  placeholder="Describe el contenido del video"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Categoría</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-app"
                    placeholder="Ej: Educación"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Precio (USD)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="input-app"
                    placeholder="0 = gratis"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Etiquetas (separadas por coma)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="input-app"
                    placeholder="educacion, curso, 4k"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Duración (segundos)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="input-app"
                    placeholder="300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Calificación (0-5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="input-app"
                  />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="w-4 h-4 accent-brand-600"
                    />
                    Destacado
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    Publicado
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Archivo de video {!editing && '*'}
                  </label>
                  <input
                    type="file"
                    accept="video/*"
                    ref={fileVideoRef}
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    className="file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:bg-brand-600 file:text-white file:border-0 text-sm text-gray-400 w-full"
                  />
                  {videoFile && <p className="text-xs text-emerald-400 mt-1">✓ {videoFile.name}</p>}
                  {editing && !videoFile && <p className="text-xs text-gray-600 mt-1">Dejar vacío mantiene el video actual</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Portada (imagen)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileThumbRef}
                    onChange={(e) => setThumbFile(e.target.files[0])}
                    className="file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:bg-dark-500 file:text-gray-200 file:border-0 text-sm text-gray-400 w-full"
                  />
                  {thumbFile && <p className="text-xs text-emerald-400 mt-1">✓ {thumbFile.name}</p>}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {saving ? <Spinner size="sm" color="white" /> : (
                    <>
                      <Save className="w-4 h-4" />
                      {editing ? 'Guardar cambios' : 'Crear video'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
