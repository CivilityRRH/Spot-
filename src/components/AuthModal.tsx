import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  AtSign,
  ShieldCheck,
  Sparkles,
  Camera,
  CheckCircle2,
  AlertCircle,
  Users,
  Eye,
  EyeOff
} from 'lucide-react';
import { UserAccount, UserProfile } from '../types';
import { sounds } from '../utils/audio';
import { compressImageDataUrl } from '../utils/storage';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { getUserProfileDoc, saveUserProfileDoc } from '../services/firestoreService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: UserAccount[];
  currentUser: UserProfile;
  onLogin: (account: UserAccount) => void;
  onSignUp: (newAccount: UserAccount) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  accounts,
  currentUser,
  onLogin,
  onSignUp
}) => {
  const [tab, setTab] = useState<'login' | 'signup' | 'switch'>('login');
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup fields
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [squadName, setSquadName] = useState('Phoenix Karma Seekers');

  // Error feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      if (!fbUser) throw new Error('No user returned from Google Sign In');

      // Check if user profile already exists in Firestore
      let existingProfile = await getUserProfileDoc(fbUser.uid);
      if (!existingProfile) {
        const cleanHandle = `@${(fbUser.displayName || 'scout').toLowerCase().replace(/\s+/g, '_')}`;
        existingProfile = {
          id: fbUser.uid,
          email: fbUser.email || 'scout@spotquest.app',
          name: fbUser.displayName || 'SpotQuest Scout',
          handle: cleanHandle,
          avatar: fbUser.photoURL || AVATAR_PRESETS[0],
          bio: 'Verified Scout on SpotQuest',
          karmaPoints: 150, // Welcome bonus
          itemsFound: 0,
          goodDeedsLogged: 0,
          tournamentsWon: 0,
          totalPurseWinnings: 0,
          squadId: 'sq_phoenix',
          squadName: 'Phoenix Karma Seekers',
          role: 'player',
          level: 1,
          badge: 'Verified Google Scout',
          joinedTournamentIds: ['tourn_grand_spring_2026', 'tourn_monthly_contenders_sep_2026'],
          createdTournamentIds: [],
          spiedObjectsCount: 0,
        };
        await saveUserProfileDoc(existingProfile);
      }

      const userAcc: UserAccount = {
        id: existingProfile.id,
        email: existingProfile.email,
        profile: existingProfile,
      };

      sounds.playKarmaChime();
      onLogin(userAcc);
      onClose();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setErrorMsg(err.message || 'Failed to sign in with Google. Check popup permissions.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const found = accounts.find(
      (acc) => acc.email.toLowerCase() === loginEmail.trim().toLowerCase()
    );

    if (!found) {
      setErrorMsg('No account found with this email. Try signing up or use a demo account.');
      return;
    }

    if (found.password && found.password !== loginPassword) {
      setErrorMsg('Incorrect password. For demo accounts, the password is "password123".');
      return;
    }

    sounds.playKarmaChime();
    onLogin(found);
    onClose();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    const existing = accounts.find(
      (acc) => acc.email.toLowerCase() === signupEmail.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg('An account with this email already exists. Please log in.');
      return;
    }

    const cleanHandle = handle.trim().startsWith('@')
      ? handle.trim()
      : `@${handle.trim() || name.toLowerCase().replace(/\s+/g, '_')}`;

    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    const newProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      email: signupEmail.trim(),
      name: name.trim(),
      handle: cleanHandle,
      avatar: finalAvatar,
      bio: bio.trim() || 'New I-Spy Hunter & Good Karma Pioneer',
      karmaPoints: 100, // Initial welcome bonus
      itemsFound: 0,
      goodDeedsLogged: 0,
      tournamentsWon: 0,
      totalPurseWinnings: 0,
      squadId: squadName.includes('Phoenix') ? 'sq_phoenix' : 'sq_urban_echo',
      squadName,
      role: 'player',
      level: 1,
      badge: 'Novice Karma Spy',
      joinedTournamentIds: ['tourn_grand_spring_2026'],
      createdTournamentIds: [],
      spiedObjectsCount: 0
    };

    const newAccount: UserAccount = {
      id: newProfile.id,
      email: signupEmail.trim(),
      password: signupPassword,
      profile: newProfile
    };

    sounds.playKarmaChime();
    onSignUp(newAccount);
    onClose();
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
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                👁️
              </div>
              <span className="font-extrabold text-base text-white">SpotQuest Auth & Cloud Sync</span>
            </div>
            <p className="text-xs text-slate-400">
              Sign in to sync your score, join tournaments, claim prizes, and log good deeds to Firebase.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Firebase Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2.5 transition border border-slate-200 disabled:opacity-50 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold tracking-wider text-slate-500">
            or use credentials
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Tab Selection */}
        <div className="flex rounded-2xl bg-slate-950 p-1 border border-slate-800 text-xs font-bold">
          <button
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'login'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => {
              setTab('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'signup'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </button>

          <button
            onClick={() => {
              setTab('switch');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              tab === 'switch'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Demo Users</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Log In */}
        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="e.g. ronniehillsugc@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.01]"
              >
                Sign In to KarmaSpy
              </button>
            </div>

            <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-slate-300">💡 Quick Demo Passwords:</p>
              <p>All demo accounts use password: <code className="text-amber-300 font-mono">password123</code></p>
            </div>
          </form>
        )}

        {/* TAB 2: Sign Up */}
        {tab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5 text-xs max-h-[60vh] overflow-y-auto pr-1">
            {/* Avatar Selector */}
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">Choose Avatar or Upload</label>
              <div className="flex items-center gap-3">
                <img
                  src={customAvatarUrl || selectedAvatar}
                  alt="Avatar preview"
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-rose-500 shrink-0"
                />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    {AVATAR_PRESETS.slice(0, 5).map((av, idx) => (
                      <img
                        key={idx}
                        src={av}
                        alt={`Preset ${idx}`}
                        onClick={() => {
                          setSelectedAvatar(av);
                          setCustomAvatarUrl('');
                        }}
                        className={`w-7 h-7 rounded-lg object-cover cursor-pointer transition ${
                          selectedAvatar === av && !customAvatarUrl
                            ? 'ring-2 ring-rose-400 scale-110'
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>

                  <label className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 cursor-pointer border border-slate-700 transition">
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Upload Custom Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jordan Wells"
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Handle / Username</label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="jordan_spy"
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="jordan@example.com"
                  className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create strong password"
                  className="w-full pl-8 pr-10 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Bio / Hunting Specialization</label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="E.g. Vintage item seeker & beach cleanup specialist"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition transform hover:scale-[1.01]"
              >
                Create Account & Join Tournament
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Fast Switch Demo Accounts */}
        {tab === 'switch' && (
          <div className="space-y-3 text-xs">
            <p className="text-slate-300 text-xs">
              Quickly test player perspectives, tournament host controls, or opponent accounts:
            </p>

            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {accounts.map((acc) => {
                const isCurrent = acc.profile.id === currentUser.id;
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      sounds.playKarmaChime();
                      onLogin(acc);
                      onClose();
                    }}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      isCurrent
                        ? 'bg-rose-950/40 border-rose-500/60 ring-1 ring-rose-500/40'
                        : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.profile.avatar}
                        alt={acc.profile.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-slate-100">{acc.profile.name}</strong>
                          {acc.profile.role === 'host' && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase">
                              HOST
                            </span>
                          )}
                          {isCurrent && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">{acc.profile.handle} • {acc.email}</span>
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                          {acc.profile.karmaPoints} karma pts • {acc.profile.itemsFound} items found
                        </div>
                      </div>
                    </div>

                    <button className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-slate-200 hover:text-white text-[11px] font-bold border border-slate-700 transition">
                      {isCurrent ? 'Selected' : 'Switch'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
