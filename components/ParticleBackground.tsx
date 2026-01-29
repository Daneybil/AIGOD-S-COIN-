
import React from 'react';

const ParticleBackground: React.FC = () => {
  const AIGODS_LOGO_URL = "https://images.pollinations.ai/prompt/exact-replica-of-a-cyborg-man-face-split-vertically-left-side-is-chrome-robot-skull-right-side-is-glowing-gold-bitcoin-symbol-both-eyes-glowing-neon-blue-full-grey-beard-surrounded-by-intense-raging-orange-fire-and-flames-at-the-bottom-large-glowing-golden-text-AIGOD%27S-cinematic-lighting-hyper-detailed-8k?width=512&height=512&nologo=true";

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-[#0a0005]">
      {/* Dynamic Dark Pink Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a000d] via-[#33001a] to-[#0a0005] opacity-100" />
      
      {/* Pulsing Dark Pink Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-900/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-800/20 blur-[120px] rounded-full animate-pulse-slow" />
      
      {/* Dark pink bubbles layer */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div 
            key={`bubble-${i}`}
            className="absolute animate-bubble-float bg-pink-500/30 rounded-full blur-sm"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 12}px`,
              height: `${4 + Math.random() * 12}px`,
              animationDelay: `${Math.random() * -20}s`,
              animationDuration: `${8 + Math.random() * 15}s`,
            }}
          />
        ))}
      </div>

      {/* Grid Overlay for depth */}
      <div className="absolute inset-0 opacity-10" style={{ 
        backgroundImage: 'linear-gradient(rgba(255, 0, 127, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 127, 0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      {/* Enhanced Rotating 3D Coins Layer with high visibility AIGODS Logo */}
      <div className="absolute inset-0 overflow-hidden [perspective:1500px] z-20">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -30}s`,
              animationDuration: `${15 + Math.random() * 20}s`,
            }}
          >
            <div 
              className="relative w-16 h-16 md:w-24 md:h-24 [transform-style:preserve-3d] animate-spin-3d"
              style={{
                animationDuration: `${6 + Math.random() * 8}s`,
              }}
            >
              {/* Coin Edges (giving it depth) */}
              {[...Array(8)].map((_, idx) => (
                <div 
                  key={idx}
                  className="absolute inset-0 rounded-full border border-yellow-700/50 bg-yellow-600/80 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  style={{ transform: `translateZ(${idx - 4}px)` }}
                />
              ))}
              
              {/* Front side of coin - AIGODS Logo */}
              <div className="absolute inset-0 rounded-full bg-black border-2 border-yellow-500/80 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.6)] [backface-visibility:hidden] [transform:translateZ(5px)]">
                <img src={AIGODS_LOGO_URL} className="w-full h-full object-cover" alt="AIGODS Coin Front" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
              </div>
              
              {/* Back side of coin - AIGODS Logo */}
              <div className="absolute inset-0 rounded-full bg-black border-2 border-yellow-500/80 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.6)] [transform:rotateY(180deg) translateZ(5px)] [backface-visibility:hidden]">
                <img src={AIGODS_LOGO_URL} className="w-full h-full object-cover" alt="AIGODS Coin Back" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bottom Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
    </div>
  );
};

export default ParticleBackground;
