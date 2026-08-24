import React, { useState, useEffect } from 'react';
import {
  User,
  AtSign,
  Camera,
  Trophy,
  Sparkles,
  Layers,
  Heart,
  DollarSign,
  ShieldCheck,
  LogOut,
  CheckCircle2,
  Lock,
  Compass,
  Edit3,
  Mail,
  Users,
  Volume2,
  VolumeX,
  Bell,
  Eye,
  Settings,
  Zap,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { sounds } from '../utils/audio';
import { compressImageDataUrl } from '../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onOpenAuthModal: () => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80'
];

const SQUAD_OPTIONS = [
  'Karma Scouts',
  'Phoenix Karma Seekers',
  'Urban Echo Hunters',
  'Eco Vanguard Squad',
  'Metro I-Spy Syndicate'
];

const BADGE_OPTIONS = [
  'Novice Karma Spy',
  'Master I-Spy Scout',
  'Karma Legend',
  'Urban Explorer',
  'Eco Hero',
  'Tournament Grandmaster'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateProfile,
  onLogout,
  onOpenAuthModal
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [handle, setHandle] = useState(user.handle);
  const [email, setEmail] = useState(user.email || '');
  const [bio, setBio] = useState(user.bio || '');
  const [squadName, setSquadName] = useState(user.squadName || 'Karma Scouts');
  const [badge, setBadge] = useState(user.badge || 'Novice Karma Spy');
  const [avatar, setAvatar] = useState(user.avatar);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [soundEffects, setSoundEffects] = useState(user.preferences?.soundEffects ?? true);
  const [notifications, setNotifications] = useState(user.preferences?.notifications ?? true);
  const [publicProfile, setPublicProfile] = useState(user.preferences?.publicProfile ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Synchronize state when user or modal visibility changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setHandle(user.handle || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setSquadName(user.squadName || 'Karma Scouts');
      setBadge(user.badge || 'Novice Karma Spy');
      setAvatar(user.avatar || AVATAR_PRESETS[0]);
      setSoundEffects(user.preferences?.soundEffects ?? true);
      setNotifications(user.preferences?.notifications ?? true);
      setPublicProfile(user.preferences?.publicProfile ?? true);
      setCustomAvatarUrl('');
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() || avatar;
    const cleanHandle = handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`;

    if (soundEffects) {
      sounds.playKarmaChime();
    }

    onUpdateProfile({
      name: name.trim(),
      handle: cleanHandle,
      email: email.trim(),
      bio: bio.trim(),
      squadName,
      badge,
      avatar: finalAvatar,
      preferences: {
        soundEffects,
        notifications,
        publicProfile
      }
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImageDataUrl(file, 400, 400, 0.7);
      if (compressed) {
        setCustomAvatarUrl(compressed);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-rose-400" />
            <h3 className="font-extrabold text-base text-white">Player & Account Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/60 p-5 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative">
            <img
              src={customAvatarUrl || avatar}
              alt={name}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-rose-500 shadow-xl"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-black text-lg text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase border border-rose-500/30">
                {user.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">{user.handle} • {user.email || 'scout@karmaspy.io'}</p>
            <p className="text-xs text-slate-300 pt-1 leading-relaxed">{user.bio || 'Active scavenger hunter exploring urban oddities & helping the community.'}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-xl bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-bold">
                {user.squadName}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                Level {user.level}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form Toggle */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3.5 text-xs bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-rose-400" />
                Edit Profile & Account Settings
              </span>
              {saveSuccess && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> All Saved!
                </span>
              )}
            </div>

            {/* Avatar Presets & Custom Upload */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Change Avatar</label>
              <div className="flex flex-wrap items-center gap-2">
                {AVATAR_PRESETS.map((av, idx) => (
                  <img
                    key={idx}
                    src={av}
                    alt={`Avatar ${idx}`}
                    onClick={() => {
                      setAvatar(av);
                      setCustomAvatarUrl('');
                    }}
                    className={`w-9 h-9 rounded-xl object-cover cursor-pointer transition ${
                      avatar === av && !customAvatarUrl
                        ? 'ring-2 ring-rose-400 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}

                <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer border border-slate-700 font-bold text-xs transition">
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Username Handle</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Squad / Team</label>
                <select
                  value={squadName}
                  onChange={(e) => setSquadName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                >
                  {SQUAD_OPTIONS.map((sq) => (
                    <option key={sq} value={sq}>
                      {sq}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Player Title / Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
              >
                {BADGE_OPTIONS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Personal Bio & Motto</label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your hunting philosophy and favorite objects..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* App Preferences Toggles */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                Account Preferences
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSoundEffects(!soundEffects)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    soundEffects
                      ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {soundEffects ? <Volume2 className="w-3.5 h-3.5 text-rose-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span className="font-bold text-[11px]">Audio Cues</span>
                  </div>
                  <span className="text-[10px] uppercase font-black">{soundEffects ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNotifications(!notifications)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    notifications
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-[11px]">Alerts</span>
                  </div>
                  <span className="text-[10px] uppercase font-black">{notifications ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPublicProfile(!publicProfile)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                    publicProfile
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-[11px]">Public</span>
                  </div>
                  <span className="text-[10px] uppercase font-black">{publicProfile ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
              >
                Save Settings & Profile
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-rose-400" />
              <span>Edit Account Settings & Profile</span>
            </button>
          </div>
        )}

        {/* Player Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-emerald-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Karma Points</span>
            </div>
            <strong className="text-base font-black text-white">{user.karmaPoints}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Layers className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Items Found</span>
            </div>
            <strong className="text-base font-black text-white">{user.itemsFound}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-rose-400 mb-1">
              <Heart className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Good Deeds</span>
            </div>
            <strong className="text-base font-black text-white">{user.goodDeedsLogged}</strong>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Purse Winnings</span>
            </div>
            <strong className="text-base font-black text-amber-300">${user.totalPurseWinnings.toLocaleString()}</strong>
          </div>
        </div>

        {/* FOLLOWER ADVANTAGE HUB */}
        <div className="bg-gradient-to-r from-rose-950/70 via-slate-950 to-indigo-950/70 border border-rose-500/40 p-4 rounded-2xl space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Your Follower Advantages & Perks</span>
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              <span>{user.followingUserIds?.length || 0} Scouts Followed</span>
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            In SpotQuest, <strong>following scouts gives YOU the advantage!</strong> You earn a +15% Karma bonus & unlock Radar Clues on every challenge created by scouts you follow.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Bonus Karma XP</span>
              <strong className="text-rose-400 font-extrabold text-xs">+{user.followerAdvantages?.bonusKarmaXP || 180} XP</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Radar Hints</span>
              <strong className="text-cyan-400 font-extrabold text-xs">{user.followerAdvantages?.radarCluesUnlocked || 12} Unlocked</strong>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 block uppercase">Intel Advantage</span>
              <strong className="text-amber-300 font-extrabold text-xs">+15% Multiplier</strong>
            </div>
          </div>
        </div>

        {/* Account Controls & Switcher */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenAuthModal();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <User className="w-3.5 h-3.5 text-indigo-400" />
            <span>Switch / Manage Accounts</span>
          </button>

          <button
            onClick={() => {
              sounds.playCameraShutter();
              onLogout();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold border border-rose-500/40 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

