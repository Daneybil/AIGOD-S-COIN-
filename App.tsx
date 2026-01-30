
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Twitter, 
  Send, 
  MessageSquare, 
  Youtube, 
  ShieldCheck, 
  Copy, 
  CreditCard,
  ExternalLink,
  Lock,
  Zap,
  CheckCircle2,
  X,
  Wallet2,
  ChevronRight,
  Share2,
  Globe,
  FileText,
  MousePointer2,
  Loader2,
  Check,
  Trophy,
  Medal,
  Crown,
  TrendingUp,
  Award,
  Wallet
} from 'lucide-react';
import LogoGrid from './components/LogoGrid';
import ParticleBackground from './components/ParticleBackground';
import ChatAssistant from './components/ChatAssistant';

declare global {
  interface Window {
    ethers: any;
    ethereum: any;
  }
}

const App: React.FC = () => {
  const CONTRACT_ADDRESS = "0x7A9EEc905095228e2B5a66Dfb743F3772042f026";
  const ABI = [
    "function buyPreSale(address referrer) payable",
    "function claimAirdrop()",
    "function hasClaimedAirdrop(address user) view returns(bool)"
  ];
  const POLYGON_CHAIN_ID = "0x89"; // 137 in hex

  const [calcAmount, setCalcAmount] = useState<string>('');
  const [calcChain, setCalcChain] = useState<string>('BNB');
  const [calcStage, setCalcStage] = useState<string>('Stage 2');
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [nativeBalance, setNativeBalance] = useState<string>("0");

  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isWhitepaperOpen, setIsWhitepaperOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isBuyProcessing, setIsBuyProcessing] = useState(false);
  const [activeNetwork, setActiveNetwork] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWalletName, setConnectingWalletName] = useState<string | null>(null);
  const [hasClaimed, setHasClaimed] = useState(false);

  // Social Task State
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);
  const [socialTasks, setSocialTasks] = useState({
    twitter: false,
    telegram: false,
    youtube: false
  });
  const [verifyingTask, setVerifyingTask] = useState<string | null>(null);

  const LAUNCH_PRICE = 3.50;
  const STAGE_1_PRICE = 0.20;
  const STAGE_2_PRICE = 0.80;

  const currentPrice = calcStage === 'Stage 1' ? STAGE_1_PRICE : STAGE_2_PRICE;
  
  const tokenPrices: Record<string, number> = {
    'BNB': 600,
    'SOL': 150,
    'MATIC': 0.70,
    'USD': 1
  };

  // Check connection status and balance on change
  useEffect(() => {
    if (connectedAddress) {
      updateBlockchainData();
    }
  }, [connectedAddress]);

  const updateBlockchainData = async () => {
    if (!window.ethereum || !connectedAddress) return;
    try {
      const provider = new window.ethers.BrowserProvider(window.ethereum);
      const balance = await provider.getBalance(connectedAddress);
      setNativeBalance(window.ethers.formatEther(balance));

      const contract = new window.ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const claimed = await contract.hasClaimedAirdrop(connectedAddress);
      setHasClaimed(claimed);
    } catch (e) {
      console.error("Failed to fetch chain data", e);
    }
  };

  const calculatedTokens = useMemo(() => {
    const amount = parseFloat(calcAmount);
    if (isNaN(amount) || amount <= 0) return 0;
    const usdValue = amount * (tokenPrices[calcChain] || 0);
    return Math.floor(usdValue / currentPrice);
  }, [calcAmount, calcChain, calcStage, currentPrice, tokenPrices]);

  const potentialX = useMemo(() => {
    return (LAUNCH_PRICE / currentPrice).toFixed(2);
  }, [currentPrice]);

  const potentialProfit = useMemo(() => {
    const tokens = calculatedTokens;
    if (tokens === 0) return "0";
    return (tokens * LAUNCH_PRICE).toLocaleString();
  }, [calculatedTokens]);

  const copyToClipboard = async (text: string, label: string = "Link") => {
    if (label === "Referral Link") {
      if (!connectedAddress) {
        alert("Connect wallet first!");
        setIsWalletModalOpen(true);
        return;
      }
      const link = `${window.location.origin}?ref=${connectedAddress}`;
      await navigator.clipboard.writeText(link);
      alert("Referral Link Copied: " + link);
      return;
    }
    await navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const handleNetworkClick = (network: string) => {
    setActiveNetwork(network);
    setIsWalletModalOpen(true);
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: POLYGON_CHAIN_ID }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: POLYGON_CHAIN_ID,
              chainName: 'Polygon Mainnet',
              nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
              rpcUrls: ['https://polygon-rpc.com/'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            }],
          });
          return true;
        } catch (addError) {
          return false;
        }
      }
      return false;
    }
  };

  const connectWallet = async (walletName?: string) => {
    if (!window.ethereum) {
      alert("No crypto wallet detected. Please install MetaMask.");
      return;
    }

    setIsConnecting(true);
    setConnectingWalletName(walletName || 'MetaMask');
    
    try {
      const provider = new window.ethers.BrowserProvider(window.ethereum);
      
      // Ensure we are on Polygon
      const network = await provider.getNetwork();
      if (network.chainId !== BigInt(137)) {
        const switched = await switchNetwork();
        if (!switched) {
          alert("Please switch to Polygon network to continue.");
          setIsConnecting(false);
          return;
        }
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      setConnectedAddress(accounts[0]);
      setIsWalletModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Connection Failed: " + (err.message || "User rejected"));
    } finally {
      setIsConnecting(false);
      setConnectingWalletName(null);
    }
  };

  const handleBuyToken = async () => {
    if (!connectedAddress) {
      setIsWalletModalOpen(true);
      return;
    }
    
    const amountStr = buyAmount || "1"; // Default 1 MATIC for test
    const amountNum = parseFloat(amountStr);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid MATIC amount.");
      return;
    }
    
    setIsBuyProcessing(true);
    try {
      const provider = new window.ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new window.ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const params = new URLSearchParams(window.location.search);
      let referrer = params.get("ref");
      if (!referrer || !window.ethers.isAddress(referrer)) {
        referrer = "0x0000000000000000000000000000000000000000";
      }

      const tx = await contract.buyPreSale(referrer, {
        value: window.ethers.parseEther(amountStr)
      });

      await tx.wait();
      alert("Presale Purchase Successful! Tokens will be distributed after TGE.");
      updateBlockchainData();
      setBuyAmount('');
    } catch (err: any) {
      alert("Purchase Failed: " + (err.reason || err.message));
    } finally {
      setIsBuyProcessing(false);
    }
  };

  const verifySocialTask = (platform: 'twitter' | 'telegram' | 'youtube') => {
    setVerifyingTask(platform);
    setTimeout(() => {
      setSocialTasks(prev => ({ ...prev, [platform]: true }));
      setVerifyingTask(null);
    }, 2000);
  };

  const handleClaimAirdrop = async () => {
    if (!connectedAddress) {
      setIsWalletModalOpen(true);
      return;
    }
    
    if (!socialTasks.twitter || !socialTasks.telegram || !socialTasks.youtube) {
      setIsAirdropModalOpen(true);
      return;
    }

    if (hasClaimed) {
      alert("You have already claimed your airdrop tokens.");
      return;
    }

    setIsBuyProcessing(true);
    try {
      const provider = new window.ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new window.ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.claimAirdrop();
      await tx.wait();

      alert("Airdrop Claimed Successfully!");
      setHasClaimed(true);
      setIsAirdropModalOpen(false);
      updateBlockchainData();
    } catch (err: any) {
      alert("Claim Failed: " + (err.reason || err.message));
    } finally {
      setIsBuyProcessing(false);
    }
  };

  const finishAirdropClaim = () => {
    if (socialTasks.twitter && socialTasks.telegram && socialTasks.youtube) {
      handleClaimAirdrop();
    }
  };

  const referralLink = connectedAddress 
    ? `${window.location.origin}?ref=${connectedAddress}` 
    : "Connect wallet to generate referral link";

  const AIGODS_LOGO_URL = "https://images.pollinations.ai/prompt/exact-replica-of-a-cyborg-man-face-split-vertically-left-side-is-chrome-robot-skull-right-side-is-glowing-gold-bitcoin-symbol-both-eyes-glowing-neon-blue-full-grey-beard-surrounded-by-intense-raging-orange-fire-and-flames-at-the-bottom-large-glowing-golden-text-AIGOD%27S-cinematic-lighting-hyper-detailed-8k?width=512&height=512&nologo=true";

  return (
    <div className="min-h-screen relative flex flex-col items-center py-10 px-4 md:px-0 bg-transparent text-white">
      <ParticleBackground />

      {/* Floating AI Assistant */}
      <ChatAssistant logoUrl={AIGODS_LOGO_URL} />

      {/* Persistent User Info (Top Center) */}
      {connectedAddress && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[70] flex items-center gap-4 bg-black/60 backdrop-blur-xl border border-cyan-500/30 px-6 py-3 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.2)] animate-in slide-in-from-top-4 duration-500">
           <div className="flex flex-col items-center">
              <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">WALLET MATIC</span>
              <span className="text-xl font-black text-white">{parseFloat(nativeBalance).toFixed(4)}</span>
           </div>
           <div className="w-[1px] h-8 bg-gray-800 mx-2"></div>
           <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">ADDRESS</span>
              <span className="text-xs font-mono text-cyan-500" id="walletAddress">{connectedAddress.slice(0,6)}...{connectedAddress.slice(-4)}</span>
           </div>
        </div>
      )}

      {/* Top Right Connect Button */}
      {!connectedAddress && (
        <div className="fixed top-8 right-8 z-[70]">
          <button 
            onClick={() => setIsWalletModalOpen(true)}
            className="bg-cyan-500 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] group"
          >
            <Wallet size={20} />
            <span className="tracking-widest uppercase text-sm">Connect Wallet</span>
          </button>
        </div>
      )}

      {/* Transaction Loading Overlay */}
      {isBuyProcessing && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="text-center space-y-6">
            <Loader2 size={80} className="text-cyan-400 animate-spin mx-auto" />
            <h3 className="text-3xl font-black uppercase italic tracking-widest text-white">Broadcasting to Polygon</h3>
            <p className="text-cyan-400 font-bold tracking-[0.2em] text-xs uppercase">Target Contract: {CONTRACT_ADDRESS}</p>
            <p className="text-gray-500 text-sm font-bold animate-pulse uppercase">Awaiting block confirmation...</p>
          </div>
        </div>
      )}

      {/* Wallet Connection Modal */}
      {isWalletModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsWalletModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0a0a0f] border border-gray-800 rounded-[2.5rem] p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-widest italic">Connect Wallet</h3>
              <button onClick={() => setIsWalletModalOpen(false)} className="p-2 bg-gray-900 rounded-full hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-6 text-center">
              Connect to <span className="text-cyan-400">Polygon Mainnet</span>
            </p>

            <div className="space-y-4">
              {[
                { name: 'MetaMask', icon: 'https://cryptologos.cc/logos/metamask-mask-logo.svg', chain: 'Polygon / Multi' },
                { name: 'Trust Wallet', icon: 'https://cryptologos.cc/logos/trust-wallet-twt-logo.svg', chain: 'Polygon / Multi' },
                { name: 'Coinbase Wallet', icon: 'https://cryptologos.cc/logos/coinbase-coin-coin-logo.svg', chain: 'Polygon / Multi' },
              ].map((wallet) => (
                <button 
                  key={wallet.name}
                  onClick={() => connectWallet(wallet.name)}
                  className={`w-full bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 p-5 rounded-2xl flex items-center justify-between transition-all group ${isConnecting && connectingWalletName !== wallet.name ? 'opacity-30' : ''}`}
                  disabled={isConnecting}
                >
                  <div className="flex items-center gap-4">
                    <img src={wallet.icon} className="w-8 h-8 object-contain" alt={wallet.name} />
                    <div className="text-left">
                      <span className="font-black uppercase text-xs tracking-widest block">{wallet.name}</span>
                      <span className="text-[8px] text-gray-500 font-black uppercase">{wallet.chain}</span>
                    </div>
                  </div>
                  {isConnecting && connectingWalletName === wallet.name ? (
                    <div className="flex flex-col items-end">
                      <Loader2 size={16} className="animate-spin text-cyan-400 mb-1" />
                      <span className="text-[6px] text-cyan-400 font-black uppercase">Syncing...</span>
                    </div>
                  ) : <ChevronRight size={20} className="text-gray-600 group-hover:text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Airdrop Social Task Modal */}
      {isAirdropModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setIsAirdropModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#050508] border border-cyan-500/20 rounded-[3rem] p-10 animate-in slide-in-from-bottom-10 duration-300">
            <h3 className="text-3xl font-black text-center mb-4 uppercase italic">Verify Social Tasks</h3>
            <p className="text-gray-400 text-center text-sm font-bold uppercase tracking-widest mb-6 leading-relaxed">
              Our AI Automatically detects your engagement. <br/>Follow all handles to unlock your 100 AIGODS.
            </p>
            
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 mb-8 text-center cursor-pointer hover:bg-cyan-500/20 transition-all" onClick={() => copyToClipboard(CONTRACT_ADDRESS, "Contract")}>
              <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-1">POLYGON CONTRACT</p>
              <p className="text-xs text-white font-mono break-all">{CONTRACT_ADDRESS}</p>
            </div>

            <div className="space-y-6">
              {[
                { platform: 'twitter' as const, label: 'Follow @AIGODSCOIN on X', color: '#1DA1F2', icon: Twitter, link: 'https://x.com/AIGODSCOIN' },
                { platform: 'telegram' as const, label: 'Join AIGODS Official Telegram', color: '#26A5E4', icon: Send, link: 'https://t.me/AIGODSCOINOFFICIAL' },
                { platform: 'youtube' as const, label: 'Subscribe to AIGODS TV', color: '#FF0000', icon: Youtube, link: 'https://www.youtube.com/@AIGODSCOINOFFICIAL' }
              ].map((task) => (
                <div key={task.platform} className="bg-white/5 border border-gray-800 p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl" style={{ backgroundColor: `${task.color}20` }}>
                      <task.icon size={24} style={{ color: task.color }} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest">{task.label}</span>
                  </div>
                  {!socialTasks[task.platform] ? (
                    <button 
                      onClick={() => {
                        window.open(task.link, '_blank');
                        verifySocialTask(task.platform);
                      }}
                      className="bg-cyan-500 text-black px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-transform"
                      disabled={verifyingTask === task.platform}
                    >
                      {verifyingTask === task.platform ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'FOLLOW & VERIFY'}
                    </button>
                  ) : (
                    <div className="bg-green-500/20 text-green-500 p-2 rounded-full border border-green-500/50">
                      <Check size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              onClick={finishAirdropClaim}
              disabled={!(socialTasks.twitter && socialTasks.telegram && socialTasks.youtube)}
              className={`w-full mt-10 py-6 rounded-2xl font-black uppercase text-xl transition-all ${
                socialTasks.twitter && socialTasks.telegram && socialTasks.youtube 
                ? 'bg-green-500 text-black shadow-[0_0_40px_rgba(34,197,94,0.4)]' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              CLAIM 100 AIGODS NOW
            </button>
          </div>
        </div>
      )}

      {/* Top Left Navigation Bar */}
      <div className="fixed top-8 left-8 z-50 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer hover:scale-110 transition-transform">
            <div className="absolute inset-0 bg-orange-500/40 rounded-full blur-3xl group-hover:bg-orange-500/60 transition-all"></div>
            <img 
              src={AIGODS_LOGO_URL} 
              alt="AIGODS Logo" 
              className="w-16 h-16 md:w-32 md:h-32 rounded-full border-4 border-yellow-500/80 relative z-10 shadow-[0_0_50px_rgba(234,179,8,0.7)] object-cover"
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setIsWhitepaperOpen(true)}
              className="bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white font-black px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] flex items-center gap-3 hover:bg-white/20 transition-all shadow-[0_10px_40px_rgba(0,0,0,0.5)] group"
            >
              <FileText size={20} className="text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="tracking-[0.2em] uppercase text-[10px] md:text-sm">White Paper</span>
            </button>

            <button 
              onClick={() => setIsLeaderboardOpen(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-6 py-3 md:px-8 md:py-4 rounded-[1.5rem] flex items-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] group"
            >
              <Trophy size={20} className="group-hover:rotate-12 transition-transform" />
              <span className="tracking-[0.1em] uppercase text-[10px] md:text-sm">Referral Rewards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Badge */}
      <div className="bg-gradient-cyan-magenta text-black text-xl md:text-5xl font-black px-12 py-6 md:py-8 rounded-[3rem] mb-12 tracking-[0.1em] md:tracking-[0.2em] uppercase shadow-2xl animate-pulse text-center mt-64 md:mt-32 w-[95%] md:w-auto italic">
        LAUNCHING SOON – 10$ BILLION+ BACKED
      </div>

      {/* Main Heading */}
      <h1 className="text-7xl md:text-9xl font-black mb-2 text-gradient-magenta tracking-tighter text-center italic">
        AIGODS
      </h1>
      <p className="text-cyan-400 font-black tracking-[0.3em] text-[10px] md:text-sm mb-12 uppercase text-center">THE FUTURE IS NOW – BECOME A GOD IN CRYPTO 👑</p>

      {/* Description */}
      <div className="max-w-4xl text-center px-4 space-y-6">
        <p className="text-lg md:text-2xl font-bold text-gray-100 leading-relaxed text-center">
          <span className="text-cyan-400">AIGODS</span> is the world's first decentralized superintelligence token, powering AI agents and autonomous economies via the Polygon network.
        </p>
        <p className="text-sm md:text-xl text-gray-400 font-medium leading-relaxed text-center">
          Backed /partnered by <span className="text-white font-bold">BlackRock, Tesla, Twitter/X, OpenAI, NVIDIA, Google, Apple, Microsoft</span> and others with over <span className="text-white font-bold">$10 billion</span> in committed capital.
        </p>
      </div>

      {/* Video Section */}
      <div className="mt-16 w-full max-w-4xl aspect-video bg-[#050510] rounded-[2.5rem] relative overflow-hidden border-4 border-gray-900 shadow-[0_0_80px_rgba(168,85,247,0.15)] group cursor-pointer">
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10 pointer-events-none p-10 text-center">
            <Youtube size={64} className="text-white/20 mb-4" />
            <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Watch video on YouTube</p>
            <p className="text-gray-600 text-xs mt-2 italic">Error 153<br/>Video player configuration error</p>
        </div>
        <div className="w-full h-full bg-black"></div>
      </div>

      {/* Presale Details */}
      <div className="mt-32 text-center w-full max-w-5xl px-4">
        <h2 className="text-5xl md:text-8xl font-black text-cyan-400 mb-20 tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]">
          PRESALE DETAILS
        </h2>
        
        <div className="flex flex-col gap-6 mb-16 items-center">
          <div className="w-full bg-[#0d1117]/60 p-10 rounded-[2.5rem] border border-gray-800/50 backdrop-blur-xl transition-transform hover:scale-[1.02]">
            <span className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center">STAGE 1 PRICE</span>
            <span className="text-7xl font-black text-white text-center block">$0.20</span>
            <div className="mt-4 flex items-center justify-center gap-2 text-green-500 font-black text-sm">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               ACTIVE NOW ON POLYGON
            </div>
            <p className="mt-4 text-[10px] text-gray-600 font-mono break-all text-center">{CONTRACT_ADDRESS}</p>
          </div>

          <div className="w-full bg-[#0d1117]/40 p-10 rounded-[2.5rem] border border-gray-800/30 backdrop-blur-xl opacity-60">
            <span className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center">STAGE 2 PRICE</span>
            <span className="text-7xl font-black text-white text-center block">$0.80</span>
            <div className="mt-4 text-gray-500 font-black text-xs uppercase tracking-widest italic text-center">NEXT PHASE</div>
          </div>

          <div className="w-full bg-[#0d1117]/80 p-10 rounded-[2.5rem] border-2 border-cyan-400 backdrop-blur-2xl shadow-[0_0_50px_rgba(34,211,238,0.2)]">
            <span className="block text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-center">FINAL LAUNCH PRICE</span>
            <span className="text-8xl md:text-9xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] text-center block">
              $3.50
            </span>
            <div className="mt-4 text-white/40 font-black text-sm uppercase tracking-[0.4em] text-center">Q4 2026</div>
          </div>
        </div>
      </div>

      {/* 3D Rotating Coin Image Section with Flaming Fire */}
      <div className="mt-32 relative group">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute inset-0 bg-orange-600 rounded-full animate-fire-rise"
                style={{ animationDelay: `${i * 0.3}s`, left: `${(Math.random() - 0.5) * 60}px` }}
              />
            ))}
            <div className="absolute inset-0 bg-orange-500/40 blur-[100px] rounded-full scale-150 animate-pulse"></div>
          </div>

          <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-yellow-500/40 p-2 shadow-[0_0_120px_rgba(234,179,8,0.7)] transition-transform hover:scale-110 duration-700">
              <div className="w-full h-full rounded-full border-2 border-yellow-500/60 overflow-hidden bg-black animate-coin-rotate-slow shadow-[inset_0_0_40px_rgba(234,179,8,0.5)]">
                 <img src={AIGODS_LOGO_URL} className="w-full h-full object-cover" alt="Rotating AIGOD'S Logo" />
              </div>
          </div>
      </div>

      {/* AIGODS CALCULATOR */}
      <div className="mt-32 w-full max-w-2xl bg-[#0a0f18] border border-gray-800 rounded-[3rem] p-12 md:p-16 shadow-3xl backdrop-blur-3xl">
        <h3 className="text-cyan-400 font-black text-center text-[10px] tracking-[0.4em] mb-12 uppercase italic text-center">AIGODS CALCULATOR</h3>
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 text-center block w-full">INVESTMENT AMOUNT</label>
              <input 
                type="number" 
                placeholder="0.0"
                className="w-full bg-black/40 border border-gray-800 rounded-3xl p-6 text-white font-black text-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-center"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 text-center block w-full">ASSET</label>
              <select 
                className="w-full bg-black/40 border border-gray-800 rounded-3xl p-6 text-white font-black text-2xl focus:outline-none focus:border-cyan-500/50 appearance-none text-center"
                value={calcChain}
                onChange={(e) => setCalcChain(e.target.value)}
              >
                <option value="BNB">BNB</option>
                <option value="SOL">SOL</option>
                <option value="MATIC">MATIC</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 text-center">
             <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2 uppercase text-center block w-full">PRESALE PHASE</label>
             <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCalcStage('Stage 1')}
                  className={`py-6 rounded-3xl font-black text-sm uppercase transition-all border ${calcStage === 'Stage 1' ? 'bg-cyan-500 text-black border-cyan-400' : 'bg-black/40 text-gray-500 border-gray-800'}`}
                >
                  Stage 1 ($0.20)
                </button>
                <button 
                  onClick={() => setCalcStage('Stage 2')}
                  className={`py-6 rounded-3xl font-black text-sm uppercase transition-all border ${calcStage === 'Stage 2' ? 'bg-[#FF00FF] text-black border-[#FF00FF]' : 'bg-black/40 text-gray-500 border-gray-800'}`}
                >
                  Stage 2 ($0.80)
                </button>
             </div>
          </div>

          <div className="bg-[#050508] p-12 rounded-[2.5rem] border border-gray-900 text-center">
            <div className="text-gray-500 text-[10px] font-black uppercase mb-4 tracking-widest text-center">EQUIVALENT AIGODS TOKENS</div>
            <div className="text-6xl md:text-7xl font-black text-cyan-400 text-center">{calculatedTokens.toLocaleString()}</div>
            <div className="mt-6 text-green-500 font-black text-xs md:text-sm uppercase tracking-widest text-center">
              Potential Listing Value: ${potentialProfit} ({potentialX}X)
            </div>
          </div>
        </div>
      </div>

      {/* Payment Selection Section */}
      <div className="mt-20 w-full max-w-4xl px-4 flex flex-col items-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
            <button onClick={() => connectWallet('BNB')} className="bg-[#F3BA2F] text-black font-black py-4 rounded-xl hover:scale-105 transition-all uppercase text-sm tracking-widest">BNB CHAIN</button>
            <button onClick={() => connectWallet('POLYGON')} className="bg-[#8247E5] text-white font-black py-4 rounded-xl hover:scale-105 transition-all uppercase text-sm tracking-widest">POLYGON</button>
            <button onClick={() => connectWallet('SOLANA')} className="bg-white text-black font-black py-4 rounded-xl hover:scale-105 transition-all uppercase text-sm tracking-widest">SOLANA</button>
            <div className="relative group w-full">
                <button className="w-full bg-[#0070F3] text-white font-black py-4 rounded-xl hover:scale-105 transition-all uppercase text-xs tracking-tighter flex items-center justify-center gap-2 text-center">
                    <CreditCard size={16} /> DEBIT/CREDIT
                </button>
                <div className="absolute -top-3 -right-2 bg-cyan-400 text-black text-[8px] font-black px-2 py-1 rounded-full animate-bounce uppercase tracking-tighter shadow-lg">FASTEST OPTION</div>
            </div>
        </div>

        {/* Main Buy & Input Section */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
            <div className="lg:col-span-7 bg-[#0d1117]/40 border border-gray-800 rounded-[2rem] p-4 flex items-center relative group overflow-hidden">
                <input 
                  type="text" 
                  placeholder="Amount in MATIC"
                  className="w-full bg-transparent border-none text-white font-black text-2xl md:text-3xl px-8 focus:outline-none placeholder:text-gray-700 z-10 text-center"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
            </div>
            <button 
              onClick={handleBuyToken}
              className="lg:col-span-5 bg-gradient-to-r from-[#FF00FF] to-[#00FFFF] text-black font-black py-8 px-12 rounded-[2rem] text-2xl md:text-3xl hover:scale-[1.03] transition-all shadow-[0_0_60px_rgba(0,255,255,0.3)] flex flex-col items-center justify-center leading-none text-center group"
            >
                <span className="mb-1 uppercase italic">PURCHASE NOW</span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition-opacity">POLYGON CONTRACT: {CONTRACT_ADDRESS.slice(0, 10)}...</span>
            </button>
        </div>

        {/* Claim Free Tokens Section */}
        <button 
          onClick={handleClaimAirdrop}
          className="w-full bg-[#22C55E] text-black font-black py-10 rounded-[2.5rem] text-3xl md:text-5xl hover:scale-[1.02] transition-all shadow-[0_0_80px_rgba(34,197,94,0.3)] mb-20 uppercase tracking-tighter text-center italic"
        >
          {hasClaimed ? 'AIRDROP CLAIMED ✓' : 'CLAIM 100 AIGODS FREE'}
        </button>
      </div>

      {/* Referral Section - ARCHITECT */}
      <div className="mt-12 w-full max-w-4xl bg-[#0a0f18] border border-gray-800 rounded-[3rem] p-12 md:p-16 text-center backdrop-blur-3xl shadow-2xl">
        <h3 className="text-4xl md:text-7xl font-black mb-4 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent italic uppercase tracking-tighter leading-none text-center">
            BECOME AN AIGODS ARCHITECT
        </h3>
        <p className="text-white font-black text-sm md:text-xl uppercase tracking-[0.2em] mb-8 text-center">
            VIRAL GROWTH IS THE ENGINE OF OUR REVOLUTION.
        </p>
        <p className="text-gray-400 font-bold mb-8 text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-center">
          Referrals are the fastest way to advertise AIGODS. By sharing, you don't just earn <span className="text-green-400">50% INSTANT REWARDS</span>—you directly increase the value of your own bags via contract <code className="text-white">{CONTRACT_ADDRESS.slice(0, 12)}...</code>
        </p>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 flex flex-col items-center gap-4 cursor-pointer group hover:border-cyan-500/30 transition-all" onClick={() => copyToClipboard(CONTRACT_ADDRESS, "Contract")}>
           <p className="text-cyan-400 font-black text-[10px] uppercase tracking-[0.4em]">POLYGON SMART CONTRACT ADDRESS</p>
           <p className="text-white font-mono text-sm break-all group-hover:text-cyan-400 transition-colors text-center">{CONTRACT_ADDRESS}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 bg-black/60 border border-gray-800 py-6 px-10 rounded-2xl flex items-center justify-between text-gray-600 font-black text-xs md:text-sm truncate">
            <span className="truncate">{referralLink}</span>
            <Lock size={16} />
          </div>
          <button onClick={() => copyToClipboard(referralLink, "Referral Link")} className="bg-white text-black py-6 px-12 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:scale-105 transition-transform">
            <Copy size={20} /> Copy Link
          </button>
        </div>
        <p className="text-[#A855F7] font-black text-[10px] uppercase tracking-[0.3em] text-center">MUST CONNECT WALLET TO UNLOCK REFERRAL REWARDS</p>
      </div>

      <LogoGrid />

      {/* Footer */}
      <div className="mt-40 w-full max-w-6xl px-4 border-t border-gray-900 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-cyan-400 font-black text-2xl uppercase tracking-[0.2em] italic leading-none">AIGODS COIN OFFICIAL</h4>
            <div className="flex justify-center md:justify-start gap-8">
              <a href="https://x.com/AIGODSCOIN" target="_blank" rel="noopener noreferrer">
                <Twitter size={36} className="transition-all hover:scale-110" style={{ color: '#1DA1F2' }} />
              </a>
              <a href="https://t.me/AIGODSCOINOFFICIAL" target="_blank" rel="noopener noreferrer">
                <Send size={36} className="transition-all hover:scale-110" style={{ color: '#26A5E4' }} />
              </a>
              <a href="https://t.me/AIGODSCOIN" target="_blank" rel="noopener noreferrer">
                <MessageSquare size={36} className="transition-all hover:scale-110" style={{ color: '#0088cc' }} />
              </a>
              <a href="https://www.youtube.com/@AIGODSCOINOFFICIAL" target="_blank" rel="noopener noreferrer">
                <Youtube size={36} className="transition-all hover:scale-110" style={{ color: '#FF0000' }} />
              </a>
            </div>
          </div>
          <div className="space-y-8 text-center md:text-left">
            <h4 className="text-[#FF00FF] font-black text-2xl uppercase tracking-[0.2em] italic leading-none">INFLUENCER HUB</h4>
            <div className="flex justify-center md:justify-start gap-8">
              <a href="https://x.com/elonmusk" target="_blank" rel="noopener noreferrer">
                <Twitter size={36} className="transition-all hover:scale-110" style={{ color: '#1DA1F2' }} />
              </a>
              <a href="https://x.com/BlackRock" target="_blank" rel="noopener noreferrer">
                <Twitter size={36} className="transition-all hover:scale-110" style={{ color: '#1DA1F2' }} />
              </a>
              <a href="https://www.blackrock.com/corporate" target="_blank" rel="noopener noreferrer">
                <Globe size={36} className="transition-all hover:scale-110" style={{ color: '#00FFFF' }} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-40 text-center pb-20 space-y-8 border-t border-gray-900/50 pt-16">
          <p className="text-gray-600 text-xs font-black tracking-[0.6em] uppercase text-center">© 2026 AI GODS – THE INTELLIGENCE LAYER OF WEB3</p>
        </div>
      </div>
    </div>
  );
};

export default App;
