import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Tv,
  Eye,
  Sparkles,
  Heart,
  Flame,
  ShieldCheck,
  Send,
  Camera,
  MapPin,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Play,
  Pause,
  Compass,
  Video,
  Award,
  Users,
  Layers,
  ChevronRight,
  TrendingUp,
  Volume2,
  VolumeX,
  RefreshCw
} from 'lucide-react';
import { Tournament, ScavengerItem, GoodDeedAction, LiveTVBroadcast, LiveStreamMessage } from '../types';
import { sounds } from '../utils/audio';

interface LiveTVHubViewProps {
  activeTournament: Tournament;
  allTournaments: Tournament[];
  onSelectTournament: (tournId: string) => void;
  onOpenLiveBroadcaster: () => void;
  onClaimItemQuick: (itemName: string) => void;
}

export const LiveTVHubView: React.FC<LiveTVHubViewProps> = ({
  activeTournament,
  allTournaments,
  onSelectTournament,
  onOpenLiveBroadcaster,
  onClaimItemQuick
}) => {
  // Curated list of active live game-show channels across cities
  const [broadcastChannels, setBroadcastChannels] = useState<LiveTVBroadcast[]>([
    {
      id: 'chan_austin_live',
      streamerId: 'usr_maya',
      streamerName: 'Maya Lin',
      streamerHandle: '@mayahunts',
      streamerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      streamerSquad: 'Urban Echo Nomads',
      townOrCity: 'Austin, TX (Downtown & Lady Bird Lake)',
      tournamentId: 'tourn_grand_spring_2026',
      tournamentTitle: 'Metro Scavenger Grand Purse & Karma Derby',
      title: '🔴 LIVE: Searching for the Art Deco Mailbox & River Cleanup!',
      videoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&auto=format&fit=crop&q=80',
      activeSpectatorCount: 1420,
      targetItem: 'Art Deco Iron Mailbox',
      targetDeed: 'Collect 5+ items of lake/park litter into recycling bins',
      aiVerificationStatus: 'scanning',
      aiScoreBreakdown: {
        itemConfidence: 94,
        deedConfidence: 98,
        authenticityScore: 99,
        liveKarmaAwarded: 350,
        spectatorHypeBonus: 45,
        feedback: 'Gemini Live Vision: Verified! High authenticity deed — Maya just collected 6 recyclable bottles and located the historic iron mailbox!'
      },
      startedAt: '12m ago',
      chatMessages: [
        { id: '1', userName: 'Spectator_Sam', text: 'She found the mailbox on 4th & Congress!! 📮', time: '1m ago' },
        { id: '2', userName: 'KarmaFan99', text: 'Tipping +50 Karma for cleaning up that boardwalk! 🌿👏', isKarmaDonation: true, amount: 50, time: '30s ago' },
        { id: '3', userName: 'Referee_Bot', text: '⚡ Gemini Vision scanning frame... 98% Good Deed Authenticity!', time: '10s ago' }
      ]
    },
    {
      id: 'chan_seattle_live',
      streamerId: 'usr_marcus',
      streamerName: 'Marcus Cole',
      streamerHandle: '@marcus_clean',
      streamerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      streamerSquad: 'Green Pulse Crusaders',
      townOrCity: 'Seattle, WA (Pike Place & Elliott Bay)',
      tournamentId: 'tourn_eco_sprint',
      tournamentTitle: 'Seattle Waterfront Eco-Spy & Community Cleanup Blitz',
      title: '🌊 LIVE: Pier 57 Boardwalk Compass Hunt + Groceries Helping Hand',
      videoUrl: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?w=1200&auto=format&fit=crop&q=80',
      activeSpectatorCount: 890,
      targetItem: 'Brass Nautical Compass Rose on Boardwalk',
      targetDeed: 'Help a neighbor or visitor carry heavy groceries/bags',
      aiVerificationStatus: 'verified_deed',
      aiScoreBreakdown: {
        itemConfidence: 89,
        deedConfidence: 96,
        authenticityScore: 97,
        liveKarmaAwarded: 420,
        spectatorHypeBonus: 50,
        feedback: 'Gemini Live Vision: Confirmed! Marcus helped an elderly tourist carry heavy luggage across the steep Pike Street incline.'
      },
      startedAt: '24m ago',
      chatMessages: [
        { id: '4', userName: 'Elena_Scout', text: 'Marcus is an absolute legend for that deed 🙌', time: '2m ago' },
        { id: '5', userName: 'SeattleLocal', text: 'Check the wooden planks near the Great Wheel for the compass!', time: '1m ago' }
      ]
    },
    {
      id: 'chan_global_metro',
      streamerId: 'usr_dexter',
      streamerName: 'Dexter Vance',
      streamerHandle: '@dexter_spy',
      streamerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      streamerSquad: 'Night Stalkers',
      townOrCity: 'Tokyo, JP (Shibuya & Harajuku)',
      tournamentId: 'tourn_monthly_contenders_sep_2026',
      tournamentTitle: 'SpotQuest World Contenders Championship (Global Cities)',
      title: '⚡ LIVE: Midnight Origami Crane Spotting & Community Guide',
      videoUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&auto=format&fit=crop&q=80',
      activeSpectatorCount: 3120,
      targetItem: 'Origami Crane Left on Public Bench',
      targetDeed: 'Teach a free skill or assist 3 strangers with transportation/luggage',
      aiVerificationStatus: 'verified_item',
      aiScoreBreakdown: {
        itemConfidence: 97,
        deedConfidence: 92,
        authenticityScore: 95,
        liveKarmaAwarded: 500,
        spectatorHypeBonus: 60,
        feedback: 'Gemini Live Vision: Legendary discovery! Dexter located the delicately folded golden origami crane in Miyashita Park!'
      },
      startedAt: '38m ago',
      chatMessages: [
        { id: '6', userName: 'TokyoGamer', text: 'Sugoi!! The crane was hidden by the bamboo rail!', time: '3m ago' },
        { id: '7', userName: 'GlobalPurse', text: 'Jackpot purse increased to $10,000!! 💰', time: 'just now' }
      ]
    }
  ]);

  const [selectedChannelId, setSelectedChannelId] = useState<string>('chan_austin_live');
  const [chatInput, setChatInput] = useState('');
  const [isAudiosMuted, setIsAudiosMuted] = useState(false);
  const [isScanningLiveFrame, setIsScanningLiveFrame] = useState(false);
  const [liveScanResult, setLiveScanResult] = useState<any>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; icon: string; x: number }[]>([]);

  const activeChannel = broadcastChannels.find((c) => c.id === selectedChannelId) || broadcastChannels[0];

  // Periodic simulated spectator chat & viewer count adjustments
  useEffect(() => {
    const timer = setInterval(() => {
      setBroadcastChannels((prev) =>
        prev.map((c) => ({
          ...c,
          activeSpectatorCount: c.activeSpectatorCount + (Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 2))
        }))
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: LiveStreamMessage = {
      id: Date.now().toString(),
      userName: 'You (Spectator)',
      text: chatInput.trim(),
      time: 'just now'
    };

    setBroadcastChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannel.id
          ? { ...c, chatMessages: [...c.chatMessages.slice(-20), newMsg] }
          : c
      )
    );
    setChatInput('');
    sounds.playKarmaChime();
  };

  const handleCheerReaction = (icon: string) => {
    sounds.playKarmaChime();
    const newHeart = {
      id: Date.now() + Math.random(),
      icon,
      x: Math.floor(Math.random() * 60) + 20
    };
    setFloatingHearts((prev) => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
    }, 2400);

    // Tip karma to the streamer
    setBroadcastChannels((prev) =>
      prev.map((c) => {
        if (c.id === activeChannel.id) {
          const cheerMsg: LiveStreamMessage = {
            id: Date.now().toString(),
            userName: 'You (Spectator)',
            text: `Sent ${icon} cheer boost to ${c.streamerName}!`,
            isKarmaDonation: true,
            amount: 20,
            time: 'just now'
          };
          return {
            ...c,
            chatMessages: [...c.chatMessages.slice(-20), cheerMsg]
          };
        }
        return c;
      })
    );
  };

  // Perform a live Gemini Vision Scan on the stream's current frame
  const handleTriggerLiveVisionScan = async () => {
    setIsScanningLiveFrame(true);
    setLiveScanResult(null);
    sounds.playCameraShutter();

    try {
      const response = await fetch('/api/gemini/scan-live-frame', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameBase64: activeChannel.videoUrl, // passing the frame snapshot url/data
          targetItemName: activeChannel.targetItem,
          targetDeedTitle: activeChannel.targetDeed,
          townOrCity: activeChannel.townOrCity
        })
      });

      if (response.ok) {
        const data = await response.json();
        setLiveScanResult(data);
        sounds.playPurseJackpot();

        // Broadcast referee verdict into live chat
        const refMsg: LiveStreamMessage = {
          id: Date.now().toString(),
          userName: '🤖 Gemini AI Referee',
          text: `🎯 VERDICT: ${data.feedback} (Karma: +${data.liveKarmaAwarded} | Authenticity: ${data.authenticityScore}%)`,
          isKarmaDonation: true,
          amount: data.liveKarmaAwarded,
          time: 'just now'
        };

        setBroadcastChannels((prev) =>
          prev.map((c) =>
            c.id === activeChannel.id
              ? {
                  ...c,
                  aiVerificationStatus: data.deedVerified ? 'verified_deed' : 'verified_item',
                  chatMessages: [...c.chatMessages.slice(-20), refMsg]
                }
              : c
          )
        );
      }
    } catch (e) {
      console.error('Live frame scan error:', e);
    } finally {
      setIsScanningLiveFrame(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Pokémon Go + TV Game Show Concept */}
      <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/90 border border-rose-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black uppercase tracking-wider animate-pulse">
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                Live World TV Broadcasts
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Good Deeds Shift Social Status
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
              Watch Real-World Scavenger Hunts Live on TV
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl leading-relaxed">
              Scouts explore their towns like Pokémon GO, hunting specific local artifacts and logging real acts of community kindness. Anyone can watch the live broadcast show, tip karma, and watch Gemini Vision referee video proof live!
            </p>
          </div>

          <button
            onClick={onOpenLiveBroadcaster}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-sm shadow-lg shadow-rose-600/30 transition transform active:scale-95 shrink-0"
          >
            <Camera className="w-4 h-4" />
            Go Live in My Town
          </button>
        </div>

        {/* Town Targets Quick Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Town Hub</p>
              <p className="text-xs font-bold text-slate-100 truncate">{activeTournament.townOrCity || 'Local Metro'}</p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Town Scavenger Targets</p>
              <p className="text-xs font-bold text-slate-100 truncate">
                {activeTournament.specificHuntItems?.length || 5} Specific Town Items
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Community Deeds</p>
              <p className="text-xs font-bold text-slate-100 truncate">
                {activeTournament.specificGoodDeeds?.length || 4} Verified Good Deeds
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Live TV Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Live Broadcast Player & Gemini Vision Live Scanner */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            {/* Broadcast Video Viewport */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
              <img
                src={activeChannel.videoUrl}
                alt={activeChannel.title}
                className="w-full h-full object-cover"
              />

              {/* Floating Live Reactions */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingHearts.map((h) => (
                  <div
                    key={h.id}
                    className="absolute text-2xl animate-bounce transition-all duration-1000"
                    style={{ left: `${h.x}%`, bottom: '20%' }}
                  >
                    {h.icon}
                  </div>
                ))}
              </div>

              {/* Overlay: Live Badge & Spectator Count */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-black tracking-wider uppercase shadow-md animate-pulse">
                  <Radio className="w-3.5 h-3.5" />
                  LIVE TV SHOW
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-slate-200 text-xs font-bold border border-white/10">
                  <Eye className="w-3.5 h-3.5 text-rose-400" />
                  {activeChannel.activeSpectatorCount.toLocaleString()} watching
                </span>
              </div>

              {/* Overlay: Town & Tournament info */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-500/30">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  {activeChannel.townOrCity}
                </span>
              </div>

              {/* Target Scan HUD Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-cyan-400 tracking-wider">
                      🎯 Hunting Item:
                    </span>
                    <span className="text-xs font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded-md">
                      {activeChannel.targetItem || 'Local Artifact'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wider">
                      🌿 Good Deed:
                    </span>
                    <span className="text-xs font-bold text-slate-100 bg-slate-800 px-2 py-0.5 rounded-md">
                      {activeChannel.targetDeed || 'Community Aid'}
                    </span>
                  </div>
                </div>

                {/* Gemini Referee Scan Action */}
                <button
                  onClick={handleTriggerLiveVisionScan}
                  disabled={isScanningLiveFrame}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition transform active:scale-95 disabled:opacity-50 shrink-0"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isScanningLiveFrame ? 'animate-spin' : ''}`} />
                  {isScanningLiveFrame ? 'Gemini AI Scanning Frame...' : 'Gemini AI Live Scan'}
                </button>
              </div>
            </div>

            {/* Streamer Header Bar */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={activeChannel.streamerAvatar}
                  alt={activeChannel.streamerName}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500/60"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-black text-slate-100">{activeChannel.streamerName}</h2>
                    <span className="text-xs text-slate-400">{activeChannel.streamerHandle}</span>
                    {activeChannel.streamerSquad && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {activeChannel.streamerSquad}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-300 mt-0.5 line-clamp-1">
                    {activeChannel.title}
                  </p>
                </div>
              </div>

              {/* Cheer & Tip Reactions */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto">
                <button
                  onClick={() => handleCheerReaction('❤️')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500/50 text-xs font-bold text-slate-200 hover:text-rose-300 transition flex items-center gap-1.5"
                  title="Send Love (+20 Karma tip)"
                >
                  ❤️ Love
                </button>
                <button
                  onClick={() => handleCheerReaction('🔥')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/50 text-xs font-bold text-slate-200 hover:text-amber-300 transition flex items-center gap-1.5"
                  title="Send Hype (+20 Karma tip)"
                >
                  🔥 Hype
                </button>
                <button
                  onClick={() => handleCheerReaction('🌿')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-xs font-bold text-slate-200 hover:text-emerald-300 transition flex items-center gap-1.5"
                  title="Send Eco Props (+20 Karma tip)"
                >
                  🌿 Eco Deed
                </button>
              </div>
            </div>

            {/* AI Referee Real-Time Breakdown Panel */}
            <div className="p-4 bg-slate-950/70">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                    Gemini Vision Live Referee Breakdown
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  Real-time Anti-Cheat Active
                </span>
              </div>

              {liveScanResult ? (
                <div className="bg-slate-900 rounded-2xl p-3.5 border border-cyan-500/30 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-cyan-300">{liveScanResult.feedback}</p>
                    <span className="text-xs font-black text-amber-400">
                      +{liveScanResult.totalLiveScore} Total Points
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-center">
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <p className="text-[10px] text-slate-400">Item Match</p>
                      <p className="text-xs font-bold text-cyan-400">{liveScanResult.itemConfidence}%</p>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <p className="text-[10px] text-slate-400">Deed Verified</p>
                      <p className="text-xs font-bold text-emerald-400">{liveScanResult.deedConfidence}%</p>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <p className="text-[10px] text-slate-400">Authenticity</p>
                      <p className="text-xs font-bold text-purple-400">{liveScanResult.authenticityScore}%</p>
                    </div>
                    <div className="bg-slate-950/60 rounded-lg p-1.5">
                      <p className="text-[10px] text-slate-400">Spectator Hype</p>
                      <p className="text-xs font-bold text-amber-400">+{liveScanResult.spectatorHypeBonus} XP</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{activeChannel.aiScoreBreakdown?.feedback}</span>
                  <span className="font-bold text-emerald-400 shrink-0 ml-2">
                    +{activeChannel.aiScoreBreakdown?.liveKarmaAwarded} Karma
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Other Channels Live On Air */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Tv className="w-4 h-4 text-rose-400" />
                Other Live Town Scavenger Broadcasts
              </h3>
              <span className="text-xs text-slate-400">Switch channel anytime</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {broadcastChannels.map((chan) => (
                <div
                  key={chan.id}
                  onClick={() => {
                    setSelectedChannelId(chan.id);
                    setLiveScanResult(null);
                    sounds.playKarmaChime();
                  }}
                  className={`p-3.5 rounded-2xl border transition cursor-pointer flex gap-3 ${
                    chan.id === selectedChannelId
                      ? 'bg-rose-950/30 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="w-20 h-16 rounded-xl overflow-hidden relative shrink-0">
                    <img src={chan.videoUrl} alt={chan.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 text-[9px] font-black bg-rose-600 text-white px-1 rounded">
                      LIVE
                    </span>
                  </div>
                  <div className="overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-200 truncate">{chan.streamerName}</p>
                        <span className="text-[10px] text-slate-400 truncate">({chan.townOrCity.split('(')[0]})</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-semibold line-clamp-1 mt-0.5">{chan.title}</p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 text-rose-400 font-bold">
                        <Eye className="w-2.5 h-2.5" />
                        {chan.activeSpectatorCount}
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold">🎯 {chan.targetItem?.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Live Spectator TV Chat & Tournament Town Item Targets */}
        <div className="space-y-4">
          {/* Live Show Chat Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex flex-col h-[420px] shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider">
                  Live TV Spectator Chat
                </h3>
              </div>
              <span className="text-[11px] font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-500/30">
                {activeChannel.activeSpectatorCount} Viewers
              </span>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
              {activeChannel.chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded-xl text-xs ${
                    msg.isKarmaDonation
                      ? 'bg-gradient-to-r from-amber-950/40 to-rose-950/40 border border-amber-500/30 text-amber-200 font-bold'
                      : 'bg-slate-950/60 border border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-bold text-slate-100 text-[11px]">{msg.userName}</span>
                    <span className="text-[10px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendLiveChat} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Cheer streamer or give clues..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Tournament Town Items & Deeds Checklist for this Location */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  Town Scavenger Hunt Targets
                </h3>
                <p className="text-[11px] text-slate-400">{activeTournament.townOrCity}</p>
              </div>
            </div>

            {/* Specific Items for this town */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                Specific Items to Spot:
              </p>
              {activeTournament.specificHuntItems?.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => onClaimItemQuick(item)}
                  className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 text-[10px] font-bold flex items-center justify-center border border-cyan-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition">
                      {item}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-cyan-400">
                    Scan / Claim →
                  </span>
                </div>
              ))}
            </div>

            {/* Specific Good Deeds for this town */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                Specific Community Good Deeds:
              </p>
              {activeTournament.specificGoodDeeds?.map((deed, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{deed}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                      Counts double in tournament karma ranking!
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
