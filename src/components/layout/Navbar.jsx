import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ChevronDown, LogOut, User, LayoutDashboard, Clapperboard } from 'lucide-react';
import Logo from '../Logo.jsx';
import { useVideos } from '../../context/VideoContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { searchTerm, setSearchTerm } = useVideos();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setProfileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const links = [
    { to: '/', label: 'Inicio' },
    { to: '/explorar', label: 'Explorar' },
    { to: '/gratis', label: 'Gratis' },
    { to: '/premium', label: 'Premium' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'glass-nav shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="container-app flex items-center justify-between py-3.5">
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-1 ml-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
                location.pathname === link.to
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {location.pathname === link.to && (
                <span className="absolute inset-0 bg-white/10 rounded-full border border-white/10"></span>
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center bg-black/60 border border-white/15 rounded-full pl-4 pr-1.5 py-1.5 animate-scale-in">
              <Search className="w-4 h-4 text-white/50 mr-2" />
              <input
                autoFocus
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={() => { if (!searchTerm) setSearchOpen(false); }}
                placeholder="Buscar en Flumen..."
                className="bg-transparent text-white placeholder-white/40 text-sm outline-none w-44 sm:w-64"
              />
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-full hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => navigate('/premium')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg,#00e5ff,#7c5cff)',
              boxShadow: '0 8px 25px -8px rgba(0,229,255,0.7)'
            }}
          >
            <Sparkles className="w-4 h-4" />
            Premium
          </button>

          {/* User */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c5cff] flex items-center justify-center text-sm font-bold text-white border-2 border-white/20">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-60 glass rounded-2xl overflow-hidden shadow-2xl animate-scale-in">
                  <div className="px-4 py-3 border-b border-white/10 bg-black/30">
                    <p className="text-white font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-white/50 text-xs truncate">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(245,197,24,0.15)', color: '#f5c518' }}>
                        <Sparkles className="w-2.5 h-2.5" /> Administrador
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    {isAdmin && (
                      <button
                        onClick={() => { setProfileOpen(false); navigate('/admin'); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Panel de admin
                      </button>
                    )}
                    <button
                      onClick={() => { setProfileOpen(false); navigate('/perfil'); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:bg-white/10 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Mi perfil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#7c5cff] hover:bg-white/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:bg-white/10"
            >
              Iniciar sesión
            </button>
          )}

          {/* Mobile menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
            aria-label="Menú"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block h-0.5 w-6 bg-current transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-nav border-t border-white/10 animate-fade-in">
          <div className="container-app py-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  location.pathname === link.to ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              {!user && (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/auth'); }}
                  className="w-full btn-primary"
                >
                  Iniciar sesión
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => { setIsMenuOpen(false); navigate('/admin'); }}
                  className="w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10"
                >
                  <LayoutDashboard className="w-4 h-4" /> Panel de admin
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
