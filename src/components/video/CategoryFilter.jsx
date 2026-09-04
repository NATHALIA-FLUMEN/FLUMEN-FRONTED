import { useVideos } from '../../context/VideoContext.jsx';
import { LayoutGrid, Globe2 } from 'lucide-react';

export default function CategoryFilter() {
  const { categories, activeCategory, setActiveCategory } = useVideos();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
      <button
        onClick={() => setActiveCategory('all')}
        className={`flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeCategory === 'all'
            ? 'bg-brand-600 text-white shadow-glow'
            : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.slug)}
          className={`flex items-center gap-1.5 flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === cat.slug
              ? 'bg-brand-600 text-white shadow-glow'
              : 'bg-dark-600 text-gray-300 hover:bg-dark-500'
          }`}
        >
          <Globe2 className="w-4 h-4" style={{ color: activeCategory === cat.slug ? 'white' : cat.color }} />
          {cat.name}
        </button>
      ))}
    </div>
  );
}
