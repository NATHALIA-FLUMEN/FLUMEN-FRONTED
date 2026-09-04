import { Link } from 'react-router-dom';
import { Play, Youtube, Instagram, Twitter, Facebook, Heart } from 'lucide-react';
import Logo from '../Logo.jsx';

export default function Footer() {
  const year = new Date().getFullYear();

  const sections = [
    {
      title: 'Plataforma',
      links: [
        { label: 'Inicio', to: '/' },
        { label: 'Explorar catálogo', to: '/explorar' },
        { label: 'Videos gratis', to: '/gratis' },
        { label: 'Contenido premium', to: '/premium' }
      ]
    },
    {
      title: 'Categorías',
      links: [
        { label: 'Documentales', to: '/explorar?cat=documental' },
        { label: 'Cocina', to: '/explorar?cat=cocina' },
        { label: 'Viajes', to: '/explorar?cat=viajes' },
        { label: 'Educación', to: '/explorar?cat=educacion' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Acerca de', to: '/' },
        { label: 'Términos', to: '/' },
        { label: 'Privacidad', to: '/' },
        { label: 'Ayuda', to: '/' }
      ]
    }
  ];

  return (
    <footer className="bg-dark-800 border-t border-dark-600 mt-20">
      <div className="container-app py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Logo size="lg" />
            <p className="text-gray-400 text-sm mt-4 max-w-sm leading-relaxed">
              Flumen es tu plataforma de referencia para contenido de video de alta calidad.
              Disfruta de una selección cuidadosa de videos gratuitos y premium, curados para ofrecerte la mejor experiencia audiovisual.
            </p>
            <div className="flex gap-3 mt-6">
              {[Youtube, Instagram, Twitter, Facebook].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-brand-600 transition-all"
                  aria-label="Red social"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-gray-400 hover:text-brand-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-600/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            Hecho con <Heart className="w-4 h-4 text-brand-500 fill-current" /> by Flumen · © {year}
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-brand-500 fill-current" />
            Streaming de calidad premium
          </p>
        </div>
      </div>
    </footer>
  );
}
