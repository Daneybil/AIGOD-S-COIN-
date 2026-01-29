import React from 'react';

const LOGO_DATA = [
  // Row 1
  { name: 'AI GODS', url: 'https://images.pollinations.ai/prompt/exact-replica-of-a-cyborg-man-face-split-vertically-left-side-is-chrome-robot-skull-right-side-is-glowing-gold-bitcoin-symbol-both-eyes-glowing-neon-blue-full-grey-beard-surrounded-by-intense-raging-orange-fire-and-flames-at-the-bottom-large-glowing-golden-text-AIGODS-cinematic-lighting-hyper-detailed-8k?width=128&height=128&nologo=true', isSpecial: true },
  { name: 'BlackRock', url: 'https://images.pollinations.ai/prompt/blackrock-logo-minimalist-symbol-vector-style-white?width=128&height=128&nologo=true', label: 'BL' },
  { name: 'Tesla', url: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg' },
  { name: 'OpenAI', url: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg' },
  { name: 'X', url: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg' },
  
  // Row 2
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'Apple', url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg' },
  { name: 'Empty', url: '' }, // Spacer
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg' },
  { name: 'Meta', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg' },

  // Row 3
  { name: 'BNB', url: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.svg' },
  { name: 'Coinbase', url: 'https://cryptologos.cc/logos/coinbase-coin-coin-logo.svg' },
  { name: 'Ethereum', url: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg' },
  { name: 'Solana', url: 'https://cryptologos.cc/logos/solana-sol-logo.svg' },
  { name: 'Polygon', url: 'https://cryptologos.cc/logos/polygon-matic-logo.svg' },

  // Row 4
  { name: 'Uniswap', url: 'https://cryptologos.cc/logos/uniswap-uni-logo.svg' },
  { name: 'MetaMask', url: 'https://cryptologos.cc/logos/metamask-mask-logo.svg' },
  { name: 'Phantom', url: 'https://images.pollinations.ai/prompt/phantom-wallet-ghost-logo-symbol-vector-white-on-black?width=128&height=128&nologo=true', label: 'PH' },
  { name: 'CoinGecko', url: 'https://cryptologos.cc/logos/coingecko-cg-logo.svg' },
  { name: 'CoinMarketCap', url: 'https://cryptologos.cc/logos/coinmarketcap-cmc-logo.svg' },
];

const LogoGrid: React.FC = () => {
  return (
    <div className="mt-40 w-full max-w-6xl px-4">
      <h2 className="text-[10px] font-black text-center mb-16 text-cyan-400 tracking-[0.5em] uppercase">BACKED BY TITANS & INNOVATORS</h2>
      <div className="grid grid-cols-5 gap-y-12 gap-x-6 items-center justify-items-center opacity-80">
        {LOGO_DATA.map((logo, i) => (
          <div 
            key={i} 
            className={`flex items-center justify-center w-full h-12 transition-all duration-500 transform hover:scale-110 hover:opacity-100 ${logo.name === 'Empty' ? 'invisible' : ''}`}
          >
            {logo.url ? (
              <img 
                src={logo.url} 
                alt={logo.name} 
                className={`max-h-full max-w-[100px] object-contain ${
                  logo.isSpecial ? 'rounded-full border-2 border-yellow-500/50 scale-125' : 
                  (['Apple', 'X', 'OpenAI', 'Meta'].includes(logo.name) ? 'filter invert' : '')
                }`} 
              />
            ) : logo.label ? (
                <div className="bg-gray-900 w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs text-gray-400 border border-gray-800 uppercase">{logo.label}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoGrid;
