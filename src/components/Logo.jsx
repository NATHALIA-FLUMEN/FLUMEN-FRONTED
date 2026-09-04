export default function Logo({ size = 'md', withText = true }) {
  const dimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`${dimensions[size]} relative flex-shrink-0`}>
        {/* Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00e5ff] via-[#7c5cff] to-[#312e8f] opacity-80 blur-[6px] scale-110"></div>
        {/* Main shape: lens/optic evoking streaming */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00e5ff] via-[#7c5cff] to-[#1a1a5e] flex items-center justify-center overflow-hidden">
          {/* Lens ring */}
          <svg viewBox="0 0 24 24" className="w-full h-full p-1.5" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="8.5" />
            {/* Play notch inside lens */}
            <path d="M10 8.8l5 3.2-5 3.2z" fill="white" stroke="none" />
          </svg>
          {/* Neon edge */}
          <div className="absolute inset-0 rounded-2xl ring-1 ring-white/30"></div>
        </div>
        {/* Sparkle accents */}
        <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#00e5ff] rounded-full animate-pulse"></span>
        <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-[#7c5cff] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></span>
      </div>
      {withText && (
        <div className="leading-none">
          <span className="font-display font-extrabold text-xl sm:text-2xl tracking-wide text-white">
            FLUM<span style={{ color: '#00e5ff' }}>EN</span>
          </span>
          <p className="text-[9px] text-white/40 tracking-[0.3em] uppercase mt-1 font-medium">
            Streaming
          </p>
        </div>
      )}
    </div>
  );
}
