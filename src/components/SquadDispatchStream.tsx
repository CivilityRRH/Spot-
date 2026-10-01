import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Radio,
  Video,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Flame,
  MapPin,
  Trophy,
  Users,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Compass,
  HeartHandshake
} from 'lucide-react';
import { Squad, UserProfile } from '../types';
import {
  sendChatMessage,
  listChatMessages,
  createMeetSpace,
  ChatMessage
} from '../services/googleWorkspaceService';
import { sounds } from '../utils/audio';

interface SquadDispatchStreamProps {
  squads: Squad[];
  user: UserProfile;
  activeSquad: Squad;
  onSelectSquad?: (squad: Squad) => void;
}

export type DispatchCategory = 'mission' | 'deed' | 'clue' | 'tactical' | 'meet';

export interface DispatchMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  squadId: string;
  squadTag: string;
  category: DispatchCategory;
  text: string;
  timestamp: string;
  meetUri?: string;
  reactions: {
    onIt: number;
    fire: number;
    headingThere: number;
    verified: number;
  };
  userReacted?: { [reactionKey: string]: boolean };
  syncedToGoogleChat?: boolean;
}

const STORAGE_KEY = 'spotquest_squad_dispatch_messages_v1';

const INITIAL_DISPATCH_MESSAGES: DispatchMessage[] = [
  {
    id: 'disp_1',
    senderId: 'scout_alex',
    senderName: 'Alex Rivera',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    squadId: 'squad_phoenix',
    squadTag: 'PHX',
    category: 'mission',
    text: '🎯 [Mission Progress] Team! I just verified the Historic Cast-Iron Bell at City Hall (+80 pts). That completes 3/5 of our urban targets!',
    timestamp: new Date(Date.now() - 420000).toISOString(),
    reactions: { onIt: 4, fire: 7, headingThere: 2, verified: 5 },
    syncedToGoogleChat: true,
  },
  {
    id: 'disp_2',
    senderId: 'scout_maya',
    senderName: 'Maya Lin',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    squadId: 'squad_phoenix',
    squadTag: 'PHX',
    category: 'deed',
    text: '🤝 [Good Deed Alert] Assisting community garden volunteers with potting native wildflowers on South Greenway. Uploaded live referee proof: +180 Karma logged & squad multiplier is now 1.45x!',
    timestamp: new Date(Date.now() - 250000).toISOString(),
    reactions: { onIt: 2, fire: 12, headingThere: 1, verified: 8 },
    syncedToGoogleChat: true,
  },
  {
    id: 'disp_3',
    senderId: 'scout_jordan',
    senderName: 'Jordan Wells',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    squadId: 'squad_phoenix',
    squadTag: 'PHX',
    category: 'clue',
    text: '📍 [Clue Coordinate] The rare Vintage Turquoise Food Truck is stationed near 4th & Pine alleyway! If anyone is in Sector B, grab the photo stamp before it moves at 7 PM!',
    timestamp: new Date(Date.now() - 110000).toISOString(),
    reactions: { onIt: 6, fire: 5, headingThere: 4, verified: 3 },
    syncedToGoogleChat: true,
  },
  {
    id: 'disp_4',
    senderId: 'referee_bot',
    senderName: 'SpotQuest AI Arbiter',
    senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    squadId: 'squad_phoenix',
    squadTag: 'SYS',
    category: 'tactical',
    text: '⚡ [Tactical Dispatch] Tournament Purse Milestone reached ($1,650)! First player to complete their individual good deed quota unlocks a +300 bonus jackpot share.',
    timestamp: new Date(Date.now() - 45000).toISOString(),
    reactions: { onIt: 8, fire: 14, headingThere: 3, verified: 9 },
    syncedToGoogleChat: true,
  },
];

export const SquadDispatchStream: React.FC<SquadDispatchStreamProps> = ({
  squads,
  user,
  activeSquad,
  onSelectSquad,
}) => {
  const [messages, setMessages] = useState<DispatchMessage[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_DISPATCH_MESSAGES;
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | DispatchCategory>('all');
  const [selectedSquadId, setSelectedSquadId] = useState<string>(activeSquad.id || 'squad_phoenix');
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState<DispatchCategory>('mission');
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // War room creation state
  const [isStartingWarRoom, setIsStartingWarRoom] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync selected squad when prop updates
  useEffect(() => {
    if (activeSquad?.id) {
      setSelectedSquadId(activeSquad.id);
    }
  }, [activeSquad?.id]);

  // Save to local storage whenever messages update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn('Could not cache dispatch messages', e);
    }
  }, [messages]);

  const currentSquad = squads.find((s) => s.id === selectedSquadId) || activeSquad;
  const currentSpaceName = `spaces/${currentSquad.id.replace('squad_', '')}-tactical-dispatch`;
  const googleChatWebUrl = `https://chat.google.com`;

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    const squadMatch = msg.squadId === currentSquad.id || msg.squadId === 'all' || msg.squadTag === 'SYS';
    if (!squadMatch) return false;
    if (selectedFilter === 'all') return true;
    return msg.category === selectedFilter;
  });

  // Handle reaction
  const handleReaction = (msgId: string, reactionType: 'onIt' | 'fire' | 'headingThere' | 'verified') => {
    sounds.playTap();
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id !== msgId) return m;
        const userReacted = m.userReacted?.[reactionType];
        return {
          ...m,
          reactions: {
            ...m.reactions,
            [reactionType]: userReacted
              ? Math.max(0, m.reactions[reactionType] - 1)
              : m.reactions[reactionType] + 1,
          },
          userReacted: {
            ...(m.userReacted || {}),
            [reactionType]: !userReacted,
          },
        };
      })
    );
  };

  // Quick prompt templates
  const handleApplyTemplate = (type: DispatchCategory) => {
    setInputCategory(type);
    if (type === 'mission') {
      setInputText(`🎯 [Mission Progress] Located target item in Sector B! Photographic proof submitted for squad score.`);
    } else if (type === 'deed') {
      setInputText(`🤝 [Good Deed Alert] Completed verified community deed in town! +150 Karma added to our multiplier.`);
    } else if (type === 'clue') {
      setInputText(`📍 [Clue Coordinate] Spotted an elusive target near the central park monument. Teammates rendezvous here!`);
    } else if (type === 'tactical') {
      setInputText(`⚡ [Tactical Dispatch] Squad check-in! Let's coordinate on finding the remaining 2 rare items.`);
    }
  };

  // Pre-dispatch confirmation prompt
  const handleOpenConfirm = () => {
    if (!inputText.trim()) return;
    setShowConfirmModal(true);
  };

  // Perform Google Chat dispatch
  const handleConfirmSend = async () => {
    if (!inputText.trim()) return;
    setIsSending(true);
    setShowConfirmModal(false);

    const newMsg: DispatchMessage = {
      id: `disp_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      squadId: currentSquad.id,
      squadTag: currentSquad.tag,
      category: inputCategory,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      reactions: { onIt: 1, fire: 0, headingThere: 0, verified: 0 },
      syncedToGoogleChat: true,
    };

    try {
      // Send to Google Chat API (with fallback in service)
      await sendChatMessage(currentSpaceName, `[${currentSquad.tag}] ${user.name}: ${inputText.trim()}`);
      sounds.playKarmaChime();
    } catch (err) {
      console.warn('Google Chat dispatch error, saved locally:', err);
    } finally {
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
      setIsSending(false);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Post instant squad score broadcast into Google Chat
  const handleBroadcastSquadStatus = async () => {
    setIsSyncing(true);
    const text = `📊 [SQUAD STATUS BROADCAST] ${currentSquad.name} [${currentSquad.tag}]: ${currentSquad.totalItemsFound} items discovered • +${currentSquad.totalKarmaPoints} total karma • ${currentSquad.teamMultiplier}x squad multiplier • Combined Score: ${currentSquad.combinedScore.toLocaleString()}! Let's keep hunting!`;

    const broadcastMsg: DispatchMessage = {
      id: `disp_${Date.now()}`,
      senderId: user.id,
      senderName: `${user.name} (Captain Broadcast)`,
      senderAvatar: user.avatar,
      squadId: currentSquad.id,
      squadTag: currentSquad.tag,
      category: 'tactical',
      text,
      timestamp: new Date().toISOString(),
      reactions: { onIt: 3, fire: 9, headingThere: 1, verified: 6 },
      syncedToGoogleChat: true,
    };

    try {
      await sendChatMessage(currentSpaceName, text);
      sounds.playKarmaChime();
    } catch (e) {
      console.warn('Sync broadcast error:', e);
    } finally {
      setMessages((prev) => [...prev, broadcastMsg]);
      setIsSyncing(false);
    }
  };

  // Start a War Room Google Meet call and post link directly to dispatch
  const handleStartMeetAndPost = async () => {
    setIsStartingWarRoom(true);
    try {
      const meet = await createMeetSpace(`${currentSquad.name} Squad War Room`);
      const meetText = `📹 [WAR ROOM CALL READY] Live Google Meet strategy room launched: ${meet.meetingUri} (Code: ${meet.meetingCode}). Jump in to coordinate search sectors in real-time!`;

      const meetMsg: DispatchMessage = {
        id: `disp_${Date.now()}`,
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        squadId: currentSquad.id,
        squadTag: currentSquad.tag,
        category: 'meet',
        text: meetText,
        timestamp: new Date().toISOString(),
        meetUri: meet.meetingUri,
        reactions: { onIt: 5, fire: 8, headingThere: 3, verified: 4 },
        syncedToGoogleChat: true,
      };

      await sendChatMessage(currentSpaceName, meetText);
      setMessages((prev) => [...prev, meetMsg]);
      sounds.playKarmaChime();
    } catch (e) {
      console.warn('War room launch error:', e);
    } finally {
      setIsStartingWarRoom(false);
    }
  };

  const getCategoryBadge = (cat: DispatchCategory) => {
    switch (cat) {
      case 'mission':
        return {
          label: 'Mission Progress',
          classes: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          icon: <Compass className="w-3 h-3" />,
        };
      case 'deed':
        return {
          label: 'Good Deed Alert',
          classes: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: <HeartHandshake className="w-3 h-3" />,
        };
      case 'clue':
        return {
          label: 'Clue Coordinate',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: <MapPin className="w-3 h-3" />,
        };
      case 'meet':
        return {
          label: 'Meet War Room',
          classes: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: <Video className="w-3 h-3" />,
        };
      case 'tactical':
      default:
        return {
          label: 'Tactical Dispatch',
          classes: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          icon: <Radio className="w-3 h-3" />,
        };
    }
  };

  return (
    <div id="squad-dispatch-stream" className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
      {/* Header bar */}
      <div className="p-5 md:p-6 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/60 border-b border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 shrink-0 shadow-lg shadow-indigo-500/10">
              <MessageSquare className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Google Chat Integration
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                  Asynchronous Mission Dispatch Stream
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Squad Dispatch & Mission Stream
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Coordinate item discoveries, log community good deeds, and broadcast tactical alerts via Google Chat.
              </p>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={googleChatWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition shadow-sm"
              title="Open Google Chat in browser"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>Open in Google Chat</span>
            </a>

            <button
              onClick={handleStartMeetAndPost}
              disabled={isStartingWarRoom}
              className="py-2 px-3 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isStartingWarRoom ? 'Launching Meet...' : 'Post War Room Call'}</span>
            </button>

            <button
              onClick={handleBroadcastSquadStatus}
              disabled={isSyncing}
              className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Broadcast Progress</span>
            </button>
          </div>
        </div>

        {/* Squad Channel Tabs */}
        <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Active Channel:
            </span>
            {squads.map((sq) => {
              const isSelected = sq.id === currentSquad.id;
              const isUserSquad = sq.id === user.squadId;
              return (
                <button
                  key={sq.id}
                  onClick={() => {
                    setSelectedSquadId(sq.id);
                    if (onSelectSquad) onSelectSquad(sq);
                  }}
                  className={`py-1.5 px-3 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-400'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <img src={sq.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                  <span>[{sq.tag}] {sq.name}</span>
                  {isUserSquad && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" title="Your Squad" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Channel Space: <strong className="text-slate-200">{currentSpaceName}</strong></span>
          </div>
        </div>
      </div>

      {/* Squad Mission Overview Strip */}
      <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-slate-400">Squad Multiplier:</span>
            <span className="font-black text-amber-300">{currentSquad.teamMultiplier}x</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Spotted Items:</span>
            <span className="font-black text-cyan-300">{currentSquad.totalItemsFound}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Total Karma:</span>
            <span className="font-black text-emerald-300">+{currentSquad.totalKarmaPoints} pts</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Async Roster:</span>
          <span className="font-extrabold text-white">{currentSquad.membersCount} Scouts in Mission</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mr-1">Filter:</span>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`py-1 px-2.5 rounded-lg font-bold transition text-xs ${
            selectedFilter === 'all'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Transmissions ({messages.filter(m => m.squadId === currentSquad.id || m.squadId === 'all').length})
        </button>
        <button
          onClick={() => setSelectedFilter('mission')}
          className={`py-1 px-2.5 rounded-lg font-bold transition text-xs flex items-center gap-1 ${
            selectedFilter === 'mission'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Compass className="w-3 h-3" />
          <span>🎯 Mission Progress</span>
        </button>
        <button
          onClick={() => setSelectedFilter('deed')}
          className={`py-1 px-2.5 rounded-lg font-bold transition text-xs flex items-center gap-1 ${
            selectedFilter === 'deed'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          <HeartHandshake className="w-3 h-3" />
          <span>🤝 Good Deeds</span>
        </button>
        <button
          onClick={() => setSelectedFilter('clue')}
          className={`py-1 px-2.5 rounded-lg font-bold transition text-xs flex items-center gap-1 ${
            selectedFilter === 'clue'
              ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-amber-300'
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>📍 Clues & Pins</span>
        </button>
        <button
          onClick={() => setSelectedFilter('tactical')}
          className={`py-1 px-2.5 rounded-lg font-bold transition text-xs flex items-center gap-1 ${
            selectedFilter === 'tactical'
              ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-indigo-300'
          }`}
        >
          <Radio className="w-3 h-3" />
          <span>⚡ Tactical</span>
        </button>
      </div>

      {/* Message Stream Feed */}
      <div className="p-4 md:p-6 space-y-4 max-h-[460px] overflow-y-auto bg-slate-950/40">
        {filteredMessages.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-dashed border-slate-800 text-slate-400 space-y-2">
            <Radio className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-bold text-sm text-slate-300">No transmissions in this filter</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Post an asynchronous mission update, pinpoint an item clue, or broadcast a good deed using the composer below.
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const badge = getCategoryBadge(msg.category);
            const isCurrentUser = msg.senderId === user.id;

            return (
              <div
                key={msg.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrentUser
                    ? 'bg-indigo-950/30 border-indigo-500/40 ml-4 md:ml-8'
                    : msg.category === 'meet'
                    ? 'bg-rose-950/20 border-rose-500/40'
                    : msg.category === 'deed'
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-white">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          [{msg.squadTag}]
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-indigo-400 font-bold">(You)</span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Async Dispatch
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${badge.classes}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                    {msg.syncedToGoogleChat && (
                      <span
                        className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        title="Synced via Google Chat API"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1 whitespace-pre-line">
                  {msg.text}
                </p>

                {/* If Google Meet Link */}
                {msg.meetUri && (
                  <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-rose-200">
                      <Video className="w-4 h-4 text-rose-400 animate-pulse" />
                      <span className="font-bold">Active Google Meet War Room</span>
                    </div>
                    <a
                      href={msg.meetUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1 transition"
                    >
                      <span>Join Call</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Footer Reactions */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReaction(msg.id, 'onIt')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                        msg.userReacted?.onIt
                          ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                      title="Affirm mission / On it"
                    >
                      <span>🫡</span>
                      <span className="text-[10px]">On It</span>
                      {msg.reactions.onIt > 0 && (
                        <span className="text-[10px] font-black text-white ml-0.5">{msg.reactions.onIt}</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleReaction(msg.id, 'fire')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                        msg.userReacted?.fire
                          ? 'bg-amber-600/30 text-amber-300 border-amber-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                      title="Hyped / Great find"
                    >
                      <span>🔥</span>
                      <span className="text-[10px]">Hype</span>
                      {msg.reactions.fire > 0 && (
                        <span className="text-[10px] font-black text-white ml-0.5">{msg.reactions.fire}</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleReaction(msg.id, 'headingThere')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                        msg.userReacted?.headingThere
                          ? 'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                      title="Heading to coordinate"
                    >
                      <span>📍</span>
                      <span className="text-[10px]">Heading There</span>
                      {msg.reactions.headingThere > 0 && (
                        <span className="text-[10px] font-black text-white ml-0.5">{msg.reactions.headingThere}</span>
                      )}
                    </button>

                    <button
                      onClick={() => handleReaction(msg.id, 'verified')}
                      className={`py-1 px-2 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                        msg.userReacted?.verified
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800'
                      }`}
                      title="Deed or item verified"
                    >
                      <span>✨</span>
                      <span className="text-[10px]">Verified</span>
                      {msg.reactions.verified > 0 && (
                        <span className="text-[10px] font-black text-white ml-0.5">{msg.reactions.verified}</span>
                      )}
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500">
                    Google Chat Space: {currentSquad.tag}-TACSYS
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Dispatch Templates */}
      <div className="px-5 py-2.5 bg-slate-900 border-t border-slate-800/80">
        <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick Templates:</span>
          <button
            onClick={() => handleApplyTemplate('mission')}
            className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-[11px] shrink-0 transition flex items-center gap-1"
          >
            <Compass className="w-3 h-3" />
            <span>🎯 Report Item Found</span>
          </button>
          <button
            onClick={() => handleApplyTemplate('deed')}
            className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-bold text-[11px] shrink-0 transition flex items-center gap-1"
          >
            <HeartHandshake className="w-3 h-3" />
            <span>🤝 Community Deed Alert</span>
          </button>
          <button
            onClick={() => handleApplyTemplate('clue')}
            className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 font-bold text-[11px] shrink-0 transition flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            <span>📍 Pin Clue / Coordinate</span>
          </button>
          <button
            onClick={() => handleApplyTemplate('tactical')}
            className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-[11px] shrink-0 transition flex items-center gap-1"
          >
            <Radio className="w-3 h-3" />
            <span>⚡ Squad Rally Beacon</span>
          </button>
        </div>
      </div>

      {/* Message Composer */}
      <div className="p-4 md:p-5 bg-slate-900 border-t border-slate-800">
        <div className="space-y-3">
          {/* Category selection */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400">Tag:</span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['mission', 'deed', 'clue', 'tactical'] as DispatchCategory[]).map((cat) => {
                  const isSel = inputCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setInputCategory(cat)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-extrabold capitalize transition ${
                        isSel
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Posting as: <strong className="text-white">{user.name}</strong> [{currentSquad.tag}]
            </div>
          </div>

          {/* Text input with Send */}
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleOpenConfirm();
                  }
                }}
                rows={2}
                placeholder={`Dispatch mission update to ${currentSquad.name} via Google Chat...`}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <div className="absolute right-3 bottom-2 text-[10px] text-slate-500">
                {inputText.length}/300
              </div>
            </div>

            <button
              onClick={handleOpenConfirm}
              disabled={!inputText.trim() || isSending}
              className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal (Required by Google Workspace Skill guidelines before sending) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
                <MessageSquare className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Confirm Google Chat Dispatch</h4>
                <p className="text-xs text-slate-400">Review before posting to your squad space</p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Target Space:</span>
                <span className="font-mono text-indigo-300">{currentSpaceName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Squad:</span>
                <span className="font-bold text-white">{currentSquad.name} [{currentSquad.tag}]</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Mission Tag:</span>
                <span className="font-black text-amber-300 uppercase">{inputCategory}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block mb-1">Message Content:</span>
                <div className="p-2.5 rounded-xl bg-slate-900 text-slate-200 italic">
                  "{inputText}"
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSend}
                disabled={isSending}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSending ? 'Sending to Space...' : 'Confirm & Dispatch'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
