import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center container-app py-24">
      <div className="text-center">
        <p className="font-display text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700 mb-4">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-400 mb-8">
          Lo sentimos, la página que buscas no existe o fue movida.
        </p>
        <Link to="/" className="btn-primary">
          <Home className="w-5 h-5" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
