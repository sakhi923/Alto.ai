import React from 'react';

interface AltoLogoProps {
  className?: string;
  size?: number;
  showSparkle?: boolean;
}

/**
 * AltoLogoMark:
 * Faithfully reproduces the "Hi Alto" 3D stylized 'H' logo mark
 * with the planetary swoosh orbit ring and the 4-point sparkle star.
 */
export const AltoLogoMark: React.FC<AltoLogoProps> = ({ 
  className = '', 
  size = 32,
  showSparkle = true 
}) => {
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div 
      className={`relative inline-flex items-center justify-center flex-none select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(56,189,248,0.25)]"
      >
        <defs>
          {/* Main 'H' letter gradient: Sky blue -> Royal blue -> Violet -> Light Purple */}
          <linearGradient id={`hGradient-${uniqueId}`} x1="15%" y1="10%" x2="85%" y2="90%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="35%" stopColor="#2563eb" />
            <stop offset="70%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          {/* Orbit Swoosh Ring gradient: Cyan -> Lilac */}
          <linearGradient id={`orbitGradient-${uniqueId}`} x1="0%" y1="70%" x2="100%" y2="20%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="85%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          {/* Sparkle star gradient */}
          <linearGradient id={`sparkleGradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          {/* Inner ambient shadow for 3D depth */}
          <linearGradient id={`innerShadow-${uniqueId}`} x1="20%" y1="30%" x2="80%" y2="70%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#581c87" stopOpacity="0.8" />
          </linearGradient>

          {/* Soft glow filter */}
          <filter id={`glow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Back section of the Orbit Ring (behind the letter H) */}
        <path
          d="M 28 58 C 22 52, 24 42, 42 36 C 68 28, 92 34, 102 46 C 106 50, 104 56, 96 61"
          stroke={`url(#orbitGradient-${uniqueId})`}
          strokeWidth="7"
          strokeLinecap="round"
          strokeOpacity="0.65"
        />

        {/* 2. Main Stylized Letter 'H' */}
        {/* Left vertical stem with rounded terminals */}
        <rect
          x="28"
          y="26"
          width="18"
          height="68"
          rx="9"
          fill={`url(#hGradient-${uniqueId})`}
        />

        {/* Right vertical stem with rounded terminals */}
        <rect
          x="68"
          y="24"
          width="18"
          height="70"
          rx="9"
          fill={`url(#hGradient-${uniqueId})`}
        />

        {/* Connecting horizontal bar of the 'H' */}
        <rect
          x="36"
          y="50"
          width="42"
          height="18"
          rx="5"
          fill={`url(#hGradient-${uniqueId})`}
        />

        {/* 3. Front section of the Orbit Ring (swooshing across the front with 3D wrap) */}
        <path
          d="M 16 68 C 14 74, 20 80, 36 80 C 58 80, 84 66, 100 50 C 104 46, 103 40, 96 38"
          stroke={`url(#orbitGradient-${uniqueId})`}
          strokeWidth="8"
          strokeLinecap="round"
          filter={`url(#glow-${uniqueId})`}
        />
        {/* Inner crisp line of the front orbit */}
        <path
          d="M 17 68 C 15 73, 22 79, 36 79 C 57 79, 83 65, 99 50"
          stroke="#ffffff"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* 4. Top-Right Sparkle Star (✦) */}
        {showSparkle && (
          <g transform="translate(90, 16)">
            {/* 4-point diamond star */}
            <path
              d="M 10 0 Q 10 10 20 10 Q 10 10 10 20 Q 10 10 0 10 Q 10 10 10 0 Z"
              fill={`url(#sparkleGradient-${uniqueId})`}
              className="animate-pulse"
            />
            {/* Center gleam */}
            <circle cx="10" cy="10" r="2" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};

interface AltoLogoFullProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

/**
 * AltoLogoFull:
 * Renders the logo mark accompanied by the "Hi Alto" typography and optional tagline
 */
export const AltoLogoFull: React.FC<AltoLogoFullProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = false 
}) => {
  const markSize = size === 'sm' ? 28 : size === 'lg' ? 48 : 34;

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <AltoLogoMark size={markSize} />
      
      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5 leading-none">
          <span className="font-bold text-white tracking-tight font-sans text-base sm:text-lg">
            Hi
          </span>
          <span className="font-extrabold tracking-tight font-sans text-base sm:text-lg bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c084fc] bg-clip-text text-transparent">
            Alto
          </span>
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-[#c084fc] border border-[#a855f7]/30 tracking-wider">
            AI
          </span>
        </div>

        {showSubtitle && (
          <span className="text-[10px] text-[#94a3b8] tracking-wide mt-1 font-medium">
            Satu Tempat, Semua AI.
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * AltoFeaturesPill:
 * 4 Pillars from the image:
 * AI Coding (Tulis kode dengan AI)
 * Chat AI (Tanya apa saja)
 * Gemini (Jawaban lebih luas)
 * AI Studio (Buat & eksplor AI)
 */
export const AltoFeaturesBar: React.FC<{ onSelectMode?: (mode: string) => void }> = ({ onSelectMode }) => {
  const features = [
    {
      id: 'coding',
      title: 'AI Coding',
      desc: 'Tulis kode dengan AI',
      icon: '</>',
      color: 'from-blue-500/20 to-sky-500/20 text-sky-400 border-sky-500/30'
    },
    {
      id: 'chat',
      title: 'Chat AI',
      desc: 'Tanya apa saja',
      icon: '💬',
      color: 'from-indigo-500/20 to-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'gemini',
      title: 'Gemini',
      desc: 'Jawaban lebih luas',
      icon: '✦',
      color: 'from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30'
    },
    {
      id: 'studio',
      title: 'AI Studio',
      desc: 'Buat & eksplor AI',
      icon: '⛶',
      color: 'from-purple-500/20 to-pink-500/20 text-pink-300 border-pink-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
      {features.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectMode?.(item.id)}
          className={`flex flex-col items-center text-center p-2.5 rounded-xl bg-gradient-to-b ${item.color} border hover:scale-[1.02] transition-all cursor-pointer shadow-sm`}
        >
          <span className="text-sm font-bold mb-0.5">{item.icon}</span>
          <span className="text-xs font-semibold text-white tracking-tight">{item.title}</span>
          <span className="text-[10px] text-[#94a3b8] leading-tight mt-0.5">{item.desc}</span>
        </button>
      ))}
    </div>
  );
};
