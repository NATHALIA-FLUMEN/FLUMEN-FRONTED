import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ShieldCheck, Sparkles, ChevronRight, Star } from 'lucide-react';
import { useSiteConfigContext } from '../../context/SiteConfigContext.jsx';

const DEFAULT = {
  heroTitle: 'Flumen Originals',
  heroSubtitle: 'Experiencia visual en 4K Ultra HD',
  heroDescription:
    'Descubre contenido exclusivo, documentales y series premium que solo encontrarás en Flumen.',
  heroButton: 'Reproducir ahora',
  heroButtonSecondary: 'Más información',
  accentColor: '#00e5ff'
};

const slides = [
  {
    img: 'https://picsum.photos/seed/original/1600/900',
    cat: '4K • HDR',
    accent: '#00e5ff'
  },
  {
    img: 'https://picsum.photos/seed/masterclass/1600/900',
    cat: 'Educación profesional',
    accent: '#8b5cf6'
  },
  {
    img: 'https://picsum.photos/seed/free/1600/900',
    cat: 'Empieza gratis',
    accent: '#10b981'
  }
];

export default function Hero() {
  const { config } = useSiteConfigContext();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const navigate = useNavigate();

  const heroTitle = (config && config.heroTitle) || DEFAULT.heroTitle;
  const heroSubtitle = (config && config.heroSubtitle) || DEFAULT.heroSubtitle;
  const heroDescription = (config && config.heroDescription) || DEFAULT.heroDescription;
  const heroButton = (config && config.heroButton) || DEFAULT.heroButton;
  const heroButtonSecondary = (config && config.heroButtonSecondary) || DEFAULT.heroButtonSecondary;
  const accent = (config && config.accentColor) || DEFAULT.accentColor;

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % slides.length), 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === active ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img src={s.img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d1e] via-[#0b0d1e]/80 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0d1e] via-[#0b0d1e]/60 to-transparent"></div>
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at 70% 30%, ${s.accent}33, transparent 55%)` }}
            ></div>
          </div>
        ))}
      </div>

      <div className="absolute top-24 right-10 hidden lg:block animate-float">
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e5ff] to-[#7c5cff] flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">En vivo ahora</p>
            <p className="text-white/50 text-xs">Contenido premium</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 right-16 hidden xl:block animate-float" style={{ animationDelay: '1s' }}>
        <div className="glass rounded-2xl p-4 flex items-center gap-3">
          <span className="text-yellow-400"><Star className="w-5 h-5 fill-current" /></span>
          <div>
            <p className="text-white font-semibold text-sm">4.9 de calificación</p>
            <p className="text-white/50 text-xs">Miles de reseñas</p>
          </div>
        </div>
      </div>

      <div className="container-app relative z-10 py-28">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-6 animate-slide-up">
            <span
              className="badge text-white"
              style={{ background: accent + '33', border: `1px solid ${accent}66` }}
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {slide.cat}
            </span>
          </div>

          <div key={'title-' + active} className="animate-slide-up">
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-4 text-balance">
              <span className="gradient-text">{heroTitle}</span>
            </h1>
          </div>

          <p className="text-white/70 text-lg sm:text-xl mb-3 font-medium">{heroSubtitle}</p>
          <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl leading-relaxed">{heroDescription}</p>

          <div className="flex flex-wrap gap-3 mb-10">
            <button onClick={() => navigate('/explorar')} className="btn-primary !px-8 !py-4 text-base">
              <Play className="w-5 h-5 fill-current" />
              {heroButton}
            </button>
            <button
              onClick={() => navigate('/premium')}
              className="btn-secondary !px-8 !py-4 text-base glass"
            >
              <Info className="w-5 h-5" />
              {heroButtonSecondary}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 mb-10 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Compra 100% segura
            </span>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Calidad 4K
            </span>
            <span className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              Pago único
            </span>
          </div>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === active ? 'w-16 bg-gradient-to-r from-[#00e5ff] to-[#7c5cff]' : 'w-8 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ver diapositiva ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0b0d1e] to-transparent"></div>

      {playing && (
        <div className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setPlaying(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#00e5ff] transition-colors text-lg"
            >
              Cerrar ✕
            </button>
            <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls autoPlay className="w-full rounded-2xl shadow-glow" />
          </div>
        </div>
      )}
    </section>
  );
}
