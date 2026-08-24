import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Radio,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  Sparkles,
  Heart,
  Flame,
  Send,
  Download,
  Share2,
  Users,
  Compass,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ScavengerItem, GoodDeedAction, LiveStreamMessage } from '../types';
import { sounds } from '../utils/audio';

interface LiveStreamModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableItems: ScavengerItem[];
  availableDeeds: GoodDeedAction[];
  onPublishRecordedClip: (clipData: {
    title: string;
    description: string;
    itemTagged?: ScavengerItem;
    deedTagged?: GoodDeedAction;
    videoUrl: string;
    durationSeconds: number;
    karmaEarned: number;
    pointsEarned: number;
  }) => void;
}

export const LiveStreamModal: React.FC<LiveStreamModalProps> = ({
  isOpen,
  onClose,
  availableItems,
  availableDeeds,
  onPublishRecordedClip
}) => {
  const [streamTitle, setStreamTitle] = useState('🔴 Live I-Spy Scavenger Hunt & Karma Run!');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedDeedId, setSelectedDeedId] = useState<string>('');
  
  const [isLive, setIsLive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [viewersCount, setViewersCount] = useState(1);
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [cameraPermissionError, setCameraPermissionError] = useState<string | null>(null);

  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);
  const [floatingReactions, setFloatingReactions] = useState<{ id: number; icon: string; x: number }[]>([]);
  const [chatMessages, setChatMessages] = useState<LiveStreamMessage[]>([
    { id: '1', userName: 'TournamentBot', text: '🏆 Live Stream Broadcast started. Good luck on the hunt!', time: 'now' },
    { id: '2', userName: 'Maya_Hunter', text: 'Let’s go! What item are you looking for first?', time: 'just now' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  // Initialize camera stream
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      resetState();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraPermissionError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraPermissionError('Camera API not accessible in this environment. Simulated Live Mode active.');
      }
    } catch {
      setCameraPermissionError('Webcam or mic not available/allowed. Simulated Live Broadcast enabled.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetState = () => {
    setIsLive(false);
    setIsRecording(false);
    setRecordingSeconds(0);
    setRecordedVideoUrl(null);
    setViewersCount(1);
    setFloatingReactions([]);
  };

  // Timer & simulated viewers & reactions
  useEffect(() => {
    let interval: number;
    if (isLive) {
      interval = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
        setViewersCount((v) => Math.min(650, v + Math.floor(Math.random() * 4) + 1));

        // Random bot chat occasionally
        if (Math.random() > 0.65) {
          const sampleUsers = ['EcoWarrior', 'EagleEye99', 'Sarah_J', 'KarmaMaster', 'Dexter_Spy', 'SnoopHunter'];
          const sampleComments = [
            'Looking clean! Check under that bench!',
            'Is that the yellow hydrant on the corner?? 🔍',
            'Sending +25 Karma tip to the purse! 💖',
            'Great good deed picking up that bottle! 🌿',
            'Nice camera angle, you got this!'
          ];
          const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
          const randomText = sampleComments[Math.floor(Math.random() * sampleComments.length)];
          setChatMessages((prev) => [
            ...prev.slice(-15),
            {
              id: Date.now().toString(),
              userName: randomUser,
              text: randomText,
              time: 'just now',
              isKarmaDonation: Math.random() > 0.8,
              amount: 10
            }
          ]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLive]);

  // Start Live Broadcasting & Recording
  const handleStartLive = () => {
    setIsLive(true);
    setIsRecording(true);
    setRecordingSeconds(0);
    sounds.playKarmaChime();

    // Start MediaRecorder if real stream available
    if (mediaStreamRef.current) {
      try {
        recordedChunksRef.current = [];
        const recorder = new MediaRecorder(mediaStreamRef.current, {
          mimeType: 'video/webm'
        });
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };
        recorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          setRecordedVideoUrl(url);
        };
        recorder.start();
        mediaRecorderRef.current = recorder;
      } catch {
        // Simulated fallback
      }
    }
  };

  // Stop Live Broadcast & Finish Recording
  const handleStopLive = () => {
    setIsLive(false);
    setIsRecording(false);
    sounds.playPurseJackpot();

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      // Create fallback dummy video url if real recorder unavailable
      setRecordedVideoUrl('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
    }
  };

  const handleTriggerReaction = (icon: string) => {
    sounds.playKarmaChime();
    const newReaction = {
      id: Date.now() + Math.random(),
      icon,
      x: Math.floor(Math.random() * 60) + 20
    };
    setFloatingReactions((prev) => [...prev, newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        userName: 'You (Host)',
        text: chatInput.trim(),
        time: 'now'
      }
    ]);
    setChatInput('');
  };

  const handlePublishToFeed = () => {
    const item = availableItems.find((i) => i.id === selectedItemId);
    const deed = availableDeeds.find((d) => d.id === selectedDeedId);

    const basePts = item ? item.basePoints : 0;
    const karmaPts = deed ? deed.baseKarmaPoints : 100;

    onPublishRecordedClip({
      title: streamTitle,
      description: `Live recorded broadcast clip (${recordingSeconds}s). ${item ? `Found ${item.name}!` : ''} ${deed ? `Executed ${deed.title}!` : ''}`,
      itemTagged: item,
      deedTagged: deed,
      videoUrl: recordedVideoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      durationSeconds: recordingSeconds,
      karmaEarned: karmaPts,
      pointsEarned: basePts
    });

    sounds.playPurseJackpot();
    onClose();
  };

  if (!isOpen) return null;

  const selectedItem = availableItems.find((i) => i.id === selectedItemId);
  const selectedDeed = availableDeeds.find((d) => d.id === selectedDeedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>KarmaSpy Live Broadcast & Video Recorder</span>
                {isLive && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] uppercase font-black tracking-wider animate-pulse">
                    LIVE
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Broadcast your I-Spy hunt, stream good deeds live to the community, and record clips for tournament points!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-y-auto">
          {/* Main Video & Camera Area (7 Cols) */}
          <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-between bg-slate-950 relative min-h-[380px]">
            {/* Floating Top Bar on Video */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 pointer-events-auto">
                {isLive ? (
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-black shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>LIVE</span>
                    <span className="text-rose-200 text-[11px] font-mono">
                      {Math.floor(recordingSeconds / 60)}:
                      {(recordingSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-slate-800/90 text-slate-300 text-xs font-bold border border-slate-700">
                    Standby Preview
                  </div>
                )}

                {isLive && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{viewersCount} watching</span>
                  </div>
                )}
              </div>

              {/* Tagged Item / Deed Overlay */}
              <div className="flex flex-col items-end gap-1 pointer-events-auto max-w-[200px] text-right">
                {selectedItem && (
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-900/80 border border-indigo-500/40 text-indigo-200 text-[11px] font-bold truncate">
                    🔍 Hunting: {selectedItem.name}
                  </span>
                )}
                {selectedDeed && (
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-900/80 border border-emerald-500/40 text-emerald-200 text-[11px] font-bold truncate">
                    ✨ Deed: {selectedDeed.title}
                  </span>
                )}
              </div>
            </div>

            {/* Video Viewport */}
            <div className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
              {/* Actual Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              />

              {/* Fallback Graphic if no webcam */}
              {!cameraActive || cameraPermissionError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-tr from-slate-900 via-indigo-950/60 to-slate-900">
                  <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3 animate-pulse">
                    <Radio className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">
                    Simulated Live Scavenger Cam Feed
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {cameraPermissionError || 'Camera inactive. High-definition simulator streaming live hunt telemetry.'}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                      ● 60 FPS HD Stream Ready
                    </span>
                  </div>
                </div>
              ) : null}

              {/* Floating Reaction Emojis Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    className="absolute bottom-6 text-3xl animate-bounce transition-all duration-1000"
                    style={{ left: `${r.x}%` }}
                  >
                    {r.icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Stream Controls Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    cameraActive
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-rose-950 border-rose-600 text-rose-300'
                  }`}
                  title="Toggle Camera"
                >
                  {cameraActive ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 ${
                    micActive
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                      : 'bg-rose-950 border-rose-600 text-rose-300'
                  }`}
                  title="Toggle Microphone"
                >
                  {micActive ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Live Action Buttons */}
              <div className="flex items-center gap-2">
                {!isLive ? (
                  <button
                    onClick={handleStartLive}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.02]"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Go Live & Record Now</span>
                  </button>
                ) : (
                  <button
                    onClick={handleStopLive}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 border border-red-500 text-red-400 hover:bg-red-950/50 font-extrabold text-sm transition"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    <span>End Stream & Save Clip</span>
                  </button>
                )}
              </div>

              {/* Live Quick Reactions for Audience / Self */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleTriggerReaction('❤️')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-rose-400 transition"
                  title="Cheer with Love"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => handleTriggerReaction('🔥')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-400 transition"
                  title="Cheer with Fire"
                >
                  <Flame className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={() => handleTriggerReaction('✨')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-emerald-400 transition"
                  title="Cheer with Good Karma"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Stream Setup & Live Chat (4 Cols) */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-5 flex flex-col justify-between bg-slate-900/60">
            <div className="space-y-4">
              {/* Stream Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Live Stream Title & Objective
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                  placeholder="E.g. Hunting for Origami Crane & cleaning park"
                />
              </div>

              {/* Tag Everyday Scavenger Item */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Tag Item You're Hunting For</span>
                  <span className="text-[10px] text-cyan-400 font-semibold">I-Spy Item</span>
                </label>
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- No Item Tagged (Free Hunt) --</option>
                  {availableItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      [{item.rarity.toUpperCase()}] {item.name} (+{item.basePoints} pts)
                    </option>
                  ))}
                </select>
              </div>

              {/* Tag Good Deed Action */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
                  <span>Tag Good Deed / Karma Action</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Karma Multiplier</span>
                </label>
                <select
                  value={selectedDeedId}
                  onChange={(e) => setSelectedDeedId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  <option value="">-- No Good Deed Tagged --</option>
                  {availableDeeds.map((deed) => (
                    <option key={deed.id} value={deed.id}>
                      [{deed.tier}] {deed.title} (+{deed.baseKarmaPoints} karma, {deed.multiplierBoost}x)
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Audience Chat */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-300">Live Chat & Karma Tips</span>
                  <span className="text-[10px] text-slate-400">{chatMessages.length} comments</span>
                </div>
                <div className="h-44 overflow-y-auto space-y-2 p-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-1.5 rounded-lg ${
                        msg.isKarmaDonation
                          ? 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                          : 'bg-slate-900/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-200">{msg.userName}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs font-medium">{msg.text}</p>
                    </div>
                  ))}
                </div>

                {/* Chat input */}
                <form onSubmit={handleSendChat} className="mt-2 flex gap-1.5">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Send a live comment..."
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>

            {/* Post-recording publish action */}
            {recordedVideoUrl && !isLive && (
              <div className="mt-4 p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>Stream Clip Ready to Publish!</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Recorded duration: {recordingSeconds}s. Publish to tournament feed to earn community verification votes.
                </p>
                <button
                  onClick={handlePublishToFeed}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Publish Clip to Tournament Feed</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
