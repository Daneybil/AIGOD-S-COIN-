
import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden pointer-events-none bg-black">
      {/* Darkened background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat animate-slow-zoom opacity-30"
        style={{ 
          backgroundImage: `url('https://images.pollinations.ai/prompt/exact-replica-of-a-cyborg-man-face-split-vertically-left-side-is-chrome-robot-skull-right-side-is-glowing-gold-bitcoin-symbol-both-eyes-glowing-neon-blue-full-grey-beard-surrounded-by-intense-raging-orange-fire-and-flames-at-the-bottom-large-glowing-golden-text-AIGODS-cinematic-lighting-hyper-detailed-8k?width=1024&height=1024&nologo=true')`,
          filter: 'brightness(0.5) contrast(1.4) saturate(1.1) grayscale(0.2)'
        }}
      />
      
      {/* Dark pink bubbles layer */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div 
            key={`bubble-${i}`}
            className="absolute animate-bubble-float bg-pink-600/20 rounded-full blur-md"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${5 + Math.random() * 15}px`,
              height: `${5 + Math.random() * 15}px`,
              animationDelay: `${Math.random() * -20}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black mix-blend-multiply" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 animate-pulse-slow bg-orange-500/5 mix-blend-screen" />

      {/* Rotating 3D Coins Layer */}
      <div className="absolute inset-0 overflow-hidden [perspective:1500px] z-10">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * -40}s`,
              animationDuration: `${18 + Math.random() * 22}s`,
            }}
          >
            <div 
              className="relative w-12 h-12 md:w-20 md:h-20 [transform-style:preserve-3d] animate-spin-3d shadow-[0_0_40px_rgba(234,179,8,0.4)]"
              style={{
                animationDuration: `${4 + Math.random() * 7}s`,
                opacity: 0.2 + Math.random() * 0.3
              }}
            >
              {[...Array(5)].map((_, idx) => (
                <div 
                  key={idx}
                  className="absolute inset-0 rounded-full border border-yellow-800 bg-yellow-600"
                  style={{ transform: `translateZ(${idx - 2}px)` }}
                />
              ))}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-600 to-yellow-300 border-2 border-yellow-200 flex items-center justify-center text-yellow-900 font-black text-2xl md:text-3xl shadow-xl [backface-visibility:hidden] [transform:translateZ(3px)]">₿</div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-700 to-yellow-400 border-2 border-yellow-300 flex items-center justify-center text-yellow-900 font-black text-2xl md:text-3xl shadow-lg [transform:rotateY(180deg) translateZ(3px)] [backface-visibility:hidden]">₿</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticleBackground;
