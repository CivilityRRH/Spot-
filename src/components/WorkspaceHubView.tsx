import React, { useState, useEffect } from 'react';
import {
  Video,
  MessageSquare,
  GraduationCap,
  Sparkles,
  ExternalLink,
  Plus,
  Send,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Radio,
  Calendar,
  Layers,
  Award,
  Share2,
  Trash2,
  RefreshCw,
  LogIn
} from 'lucide-react';
import {
  MeetSpace,
  ChatSpace,
  ChatMessage,
  ClassroomCourse,
  ClassroomCourseWork,
  createMeetSpace,
  listChatSpaces,
  createChatSpace,
  sendChatMessage,
  listClassroomCourses,
  listCourseWork,
  createCourseWorkAssignment,
  createClassAnnouncement
} from '../services/googleWorkspaceService';
import { UserProfile, Tournament } from '../types';
import { googleSignIn, getAccessToken } from '../firebase';
import { sounds } from '../utils/audio';
import confetti from 'canvas-confetti';

interface WorkspaceHubViewProps {
  user: UserProfile;
  tournaments: Tournament[];
  activeTournament: Tournament;
}

export const WorkspaceHubView: React.FC<WorkspaceHubViewProps> = ({
  user,
  tournaments,
  activeTournament
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'meet' | 'chat' | 'classroom'>('meet');
  const [hasToken, setHasToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Meet state
  const [meetSpaces, setMeetSpaces] = useState<MeetSpace[]>([
    {
      name: 'spaces/tourney-alpha-warroom',
      meetingUri: 'https://meet.google.com/xyz-spot-hunt',
      meetingCode: 'xyz-spot-hunt',
      createdForTourneyOrSquad: 'Austin Grand Scavenger & Deeds War Room',
      createdAt: new Date().toISOString(),
    },
    {
      name: 'spaces/squad-phoenix-debrief',
      meetingUri: 'https://meet.google.com/phx-karm-meet',
      meetingCode: 'phx-karm-meet',
      createdForTourneyOrSquad: 'Phoenix Karma Seekers Strategy Room',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ]);
  const [newMeetTitle, setNewMeetTitle] = useState('SpotQuest Live Scavenger Strategy Call');
  const [isCreatingMeet, setIsCreatingMeet] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Chat state
  const [chatSpaces, setChatSpaces] = useState<ChatSpace[]>([]);
  const [selectedChatSpace, setSelectedChatSpace] = useState<ChatSpace | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      name: 'msg_1',
      text: '🛰️ [SpotQuest Referee]: Round 2 is LIVE! 5 bonus karma points for any verified park cleanup photo in the next 30 minutes!',
      sender: { displayName: 'Gemini AI Arbiter' },
      createTime: new Date(Date.now() - 600000).toISOString(),
    },
    {
      name: 'msg_2',
      text: '🤠 Jordan Wells just found the Vintage Turquoise Food Truck (+250 pts)!',
      sender: { displayName: 'SpotQuest Dispatch' },
      createTime: new Date(Date.now() - 120000).toISOString(),
    },
  ]);
  const [outboundMessage, setOutboundMessage] = useState('');
  const [newSpaceName, setNewSpaceName] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isCreatingChatSpace, setIsCreatingChatSpace] = useState(false);

  // Classroom state
  const [courses, setCourses] = useState<ClassroomCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ClassroomCourse | null>(null);
  const [courseWorkList, setCourseWorkList] = useState<ClassroomCourseWork[]>([]);
  const [assignmentTitle, setAssignmentTitle] = useState('Urban Ecology & Good Deeds Scavenger Expedition');
  const [assignmentDesc, setAssignmentDesc] = useState(
    'Students will use the SpotQuest mobile app to locate 5 local town landmarks and perform 2 verifiable community good deeds with photo proof.'
  );
  const [assignmentPoints, setAssignmentPoints] = useState(100);
  const [announcementText, setAnnouncementText] = useState(
    '📢 Class Scavenger Hunt is live on SpotQuest! Top scorer wins 25 extra credit points and $50 prize purse contribution!'
  );
  const [isPublishingAssignment, setIsPublishingAssignment] = useState(false);
  const [isPublishingAnnouncement, setIsPublishingAnnouncement] = useState(false);

  // Confirmation Modal state for destructive/external operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionLabel: '',
    onConfirm: async () => {},
  });

  // Success notifications
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    checkToken();
    loadWorkspaceData();
  }, []);

  const checkToken = async () => {
    const token = await getAccessToken();
    setHasToken(!!token);
  };

  const loadWorkspaceData = async () => {
    try {
      const [cSpaces, cCourses] = await Promise.all([
        listChatSpaces(),
        listClassroomCourses(),
      ]);
      setChatSpaces(cSpaces);
      if (cSpaces.length > 0 && !selectedChatSpace) {
        setSelectedChatSpace(cSpaces[0]);
      }
      setCourses(cCourses);
      if (cCourses.length > 0 && !selectedCourse) {
        setSelectedCourse(cCourses[0]);
        const cw = await listCourseWork(cCourses[0].id);
        setCourseWorkList(cw);
      }
    } catch (e) {
      console.warn('Error loading workspace data:', e);
    }
  };

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setHasToken(true);
        sounds.playKarmaChime();
        confetti({ particleCount: 40, spread: 60 });
        showToast('Google Workspace connected successfully with Meet, Chat & Classroom scopes!');
        loadWorkspaceData();
      }
    } catch (err: any) {
      console.error('Google connect error:', err);
      showToast('Could not complete Google Sign-In. Please allow popup access.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    sounds.playKarmaChime();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  /* =========================================================================
     MEET ACTIONS
     ========================================================================= */

  const handleCreateMeetSpace = async () => {
    if (!newMeetTitle.trim()) return;
    setIsCreatingMeet(true);
    try {
      const created = await createMeetSpace(newMeetTitle.trim());
      setMeetSpaces([created, ...meetSpaces]);
      sounds.playKarmaChime();
      confetti({ particleCount: 35, spread: 70 });
      showToast(`Google Meet room created: ${created.meetingCode}`);
      setNewMeetTitle('');
    } catch (e) {
      console.error(e);
      showToast('Failed to create Meet room');
    } finally {
      setIsCreatingMeet(false);
    }
  };

  const promptEndMeetSpace = (space: MeetSpace) => {
    setConfirmModal({
      isOpen: true,
      title: 'End Google Meet Conference Space?',
      description: `Are you sure you want to end and archive the Google Meet space "${space.createdForTourneyOrSquad || space.meetingCode}"? Active squad callers will be disconnected.`,
      actionLabel: 'End & Archive Room',
      onConfirm: async () => {
        setMeetSpaces((prev) => prev.filter((s) => s.name !== space.name));
        showToast('Google Meet space has been archived.');
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  /* =========================================================================
     CHAT ACTIONS
     ========================================================================= */

  const handleCreateChatSpace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpaceName.trim()) return;
    setIsCreatingChatSpace(true);
    try {
      const created = await createChatSpace(newSpaceName.trim());
      setChatSpaces([created, ...chatSpaces]);
      setSelectedChatSpace(created);
      setNewSpaceName('');
      sounds.playKarmaChime();
      showToast(`Google Chat space "${created.displayName}" created!`);
    } catch (e) {
      showToast('Could not create Chat space');
    } finally {
      setIsCreatingChatSpace(false);
    }
  };

  const promptSendChatMessage = (textToSend?: string) => {
    const msg = textToSend || outboundMessage;
    if (!msg.trim() || !selectedChatSpace) return;

    setConfirmModal({
      isOpen: true,
      title: 'Broadcast Message to Google Chat?',
      description: `Publish this update to Google Chat space "${selectedChatSpace.displayName}":\n\n"${msg}"`,
      actionLabel: 'Send to Google Chat',
      onConfirm: async () => {
        setIsSendingMessage(true);
        try {
          const sent = await sendChatMessage(selectedChatSpace.name, msg);
          setChatMessages((prev) => [
            {
              ...sent,
              sender: { displayName: `${user.name} (${user.handle})` },
            },
            ...prev,
          ]);
          setOutboundMessage('');
          sounds.playKarmaChime();
          showToast('Message broadcasted to Google Chat!');
        } catch (e) {
          showToast('Failed to broadcast message');
        } finally {
          setIsSendingMessage(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const handleBroadcastTournamentStandings = () => {
    if (!selectedChatSpace) return;
    const standingsMsg = `🏆 [SpotQuest Standings Update]\nTournament: ${activeTournament.title} (${activeTournament.townOrCity})\n💰 Total Purse: $${activeTournament.totalPurse}\n👥 Players: ${activeTournament.playersCount} | 🔴 Live Spectators: ${activeTournament.activeSpectatorCount || 150}\n🥇 Current Leader: ${user.name} (${user.karmaPoints} pts)\nJoin the hunt on SpotQuest now!`;
    promptSendChatMessage(standingsMsg);
  };

  /* =========================================================================
     CLASSROOM ACTIONS
     ========================================================================= */

  const handleCourseSelect = async (course: ClassroomCourse) => {
    setSelectedCourse(course);
    const cw = await listCourseWork(course.id);
    setCourseWorkList(cw);
  };

  const promptCreateAssignment = () => {
    if (!selectedCourse || !assignmentTitle.trim()) return;

    setConfirmModal({
      isOpen: true,
      title: 'Publish Assignment to Google Classroom?',
      description: `Create and publish assignment "${assignmentTitle}" (Worth ${assignmentPoints} Points) to class "${selectedCourse.name}"? All enrolled students will receive this assignment.`,
      actionLabel: 'Publish Assignment',
      onConfirm: async () => {
        setIsPublishingAssignment(true);
        try {
          const created = await createCourseWorkAssignment(selectedCourse.id, {
            title: assignmentTitle.trim(),
            description: assignmentDesc.trim(),
            maxPoints: assignmentPoints,
          });
          setCourseWorkList([created, ...courseWorkList]);
          sounds.playKarmaChime();
          confetti({ particleCount: 40, spread: 60 });
          showToast(`Assignment published to ${selectedCourse.name}!`);
        } catch (e) {
          showToast('Failed to publish assignment');
        } finally {
          setIsPublishingAssignment(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const promptPublishAnnouncement = () => {
    if (!selectedCourse || !announcementText.trim()) return;

    setConfirmModal({
      isOpen: true,
      title: 'Post Announcement in Google Classroom?',
      description: `Post to course "${selectedCourse.name}" stream:\n\n"${announcementText}"`,
      actionLabel: 'Post Announcement',
      onConfirm: async () => {
        setIsPublishingAnnouncement(true);
        try {
          await createClassAnnouncement(selectedCourse.id, announcementText.trim());
          sounds.playKarmaChime();
          showToast(`Announcement posted to ${selectedCourse.name}!`);
          setAnnouncementText('');
        } catch (e) {
          showToast('Failed to post announcement');
        } finally {
          setIsPublishingAnnouncement(false);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/60 text-emerald-300 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{notification}</span>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-2.5 text-amber-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-extrabold text-base text-slate-100">{confirmModal.title}</h3>
            </div>
            <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
              {confirmModal.description}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition"
              >
                {confirmModal.actionLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                Google Workspace Integration
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active OAuth
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Google Meet, Chat & Classroom Ops
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Coordinate team scavenger hunt war rooms in <strong className="text-indigo-300">Google Meet</strong>, dispatch live hunt alerts to <strong className="text-emerald-300">Google Chat Spaces</strong>, and publish community good deed assignments to <strong className="text-amber-300">Google Classroom</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {!hasToken ? (
              <button
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-105 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>{isConnecting ? 'Connecting...' : 'Authorize Google Account'}</span>
              </button>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">Google Workspace Linked</span>
              </div>
            )}
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 pt-5 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('meet')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
              activeSubTab === 'meet'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Google Meet War Rooms</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">{meetSpaces.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
              activeSubTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Google Chat Spaces & Dispatch</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">{chatSpaces.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('classroom')}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs transition flex items-center gap-2 ${
              activeSubTab === 'classroom'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Google Classroom Assignments</span>
            <span className="px-1.5 py-0.5 rounded-full bg-black/40 text-[10px]">{courses.length}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: GOOGLE MEET
          ========================================================================= */}
      {activeSubTab === 'meet' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create New Meet Space */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-indigo-400">
              <Video className="w-5 h-5" />
              <h3 className="font-extrabold text-sm text-slate-100">Launch Squad Meet Room</h3>
            </div>
            <p className="text-xs text-slate-400">
              Create an instant Google Meet room for your team during live tournaments to strategize, share coordinates, and debrief.
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">War Room Purpose / Title</label>
                <input
                  type="text"
                  value={newMeetTitle}
                  onChange={(e) => setNewMeetTitle(e.target.value)}
                  placeholder="E.g. Austin Lady Bird Lake Live Squad Call"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                onClick={handleCreateMeetSpace}
                disabled={isCreatingMeet || !newMeetTitle.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isCreatingMeet ? 'Creating Space...' : 'Create Google Meet Space'}</span>
              </button>
            </div>

            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3 text-[11px] text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Features enabled by Meet API:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                <li>Instant Google Meet join links with meeting codes</li>
                <li>Direct integration with tournament broadcast feeds</li>
                <li>Voice and video squad debriefing during live hunts</li>
              </ul>
            </div>
          </div>

          {/* Active Meet Spaces List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                <span>Active Google Meet Rooms</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                  {meetSpaces.length}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {meetSpaces.map((space) => (
                <div
                  key={space.name}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-sm space-y-4 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-[10px] font-black uppercase flex items-center gap-1">
                        <Radio className="w-3 h-3 text-indigo-400 animate-pulse" />
                        Live Space
                      </span>
                      <button
                        onClick={() => promptEndMeetSpace(space)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Archive Space"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm text-slate-100">
                      {space.createdForTourneyOrSquad || 'SpotQuest Team Room'}
                    </h4>

                    <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      <span className="truncate flex-1">{space.meetingUri}</span>
                      <button
                        onClick={() => handleCopy(space.meetingUri, space.name)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                        title="Copy Link"
                      >
                        {copiedCode === space.name ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <a
                      href={space.meetingUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet Call</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: GOOGLE CHAT
          ========================================================================= */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Space Selector & Space Creator */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Google Chat Spaces</span>
              </h3>

              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {chatSpaces.map((space) => {
                  const isSel = selectedChatSpace?.name === space.name;
                  return (
                    <button
                      key={space.name}
                      onClick={() => setSelectedChatSpace(space)}
                      className={`w-full p-3 rounded-2xl text-left text-xs font-bold transition flex items-center justify-between gap-2 ${
                        isSel
                          ? 'bg-emerald-950/70 border border-emerald-500/50 text-emerald-200'
                          : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{space.displayName}</span>
                      {isSel && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Create new Space */}
              <form onSubmit={handleCreateChatSpace} className="pt-2 border-t border-slate-800 space-y-2">
                <label className="block text-[11px] font-bold text-slate-400">Create New Chat Space</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSpaceName}
                    onChange={(e) => setNewSpaceName(e.target.value)}
                    placeholder="E.g. #seattle-beach-hunt"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={isCreatingChatSpace || !newSpaceName.trim()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-50 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Dispatch Actions */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>1-Click Game Broadcasts</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Push live tournament updates and leaderboard snapshots to the selected Google Chat room:
              </p>

              <button
                onClick={handleBroadcastTournamentStandings}
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-between transition"
              >
                <span>🏆 Broadcast Leaderboard Standings</span>
                <Send className="w-3.5 h-3.5 text-cyan-400" />
              </button>

              <button
                onClick={() =>
                  promptSendChatMessage(
                    `🌱 [Good Deed Alert]: ${user.name} completed a community kindness action! +100 Karma points recorded on SpotQuest!`
                  )
                }
                className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center justify-between transition"
              >
                <span>🌱 Broadcast Verified Good Deed</span>
                <Send className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Chat Room Feed & Message Box */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm space-y-4 min-h-[460px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">
                    {selectedChatSpace?.displayName || 'Google Chat Room'}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedChatSpace?.name || 'spaces/general'}
                  </span>
                </div>
                {selectedChatSpace?.spaceUri && (
                  <a
                    href={selectedChatSpace.spaceUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <span>Open in Google Chat</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Message History */}
              <div className="space-y-3 pt-4 max-h-72 overflow-y-auto pr-1">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-400">
                        {msg.sender?.displayName || 'Chat Participant'}
                      </span>
                      <span className="text-slate-500 text-[10px]">
                        {msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Outbound Message Composer */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={outboundMessage}
                  onChange={(e) => setOutboundMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && promptSendChatMessage()}
                  placeholder={`Send message to ${selectedChatSpace?.displayName || 'Chat Space'}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => promptSendChatMessage()}
                  disabled={isSendingMessage || !outboundMessage.trim() || !selectedChatSpace}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                🔒 Sends messages securely via Google Chat API with user authorization confirmation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: GOOGLE CLASSROOM
          ========================================================================= */}
      {activeSubTab === 'classroom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses Selector */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Linked Classroom Courses</span>
              </h3>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {courses.map((course) => {
                  const isSel = selectedCourse?.id === course.id;
                  return (
                    <div
                      key={course.id}
                      onClick={() => handleCourseSelect(course)}
                      className={`p-3.5 rounded-2xl cursor-pointer border transition ${
                        isSel
                          ? 'bg-amber-950/70 border-amber-500/60 ring-1 ring-amber-500/40 text-amber-200'
                          : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-xs text-slate-100 font-bold truncate">{course.name}</strong>
                        {course.section && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-amber-400">
                            {course.section}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {course.descriptionHeading || 'Coursework & Scavenger assignments'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {selectedCourse?.alternateLink && (
                <a
                  href={selectedCourse.alternateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <span>Open Class in Classroom</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Coursework & Announcement Publisher */}
          <div className="lg:col-span-2 space-y-4">
            {/* Create Assignment */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400">
                  <Award className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm text-slate-100">
                    Publish Assignment to {selectedCourse?.name || 'Classroom'}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">Teacher / Host Mode</span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Assignment Title</label>
                    <input
                      type="text"
                      value={assignmentTitle}
                      onChange={(e) => setAssignmentTitle(e.target.value)}
                      placeholder="E.g. Urban Scavenger Hunt & Ecology Log"
                      className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Max Points</label>
                    <input
                      type="number"
                      value={assignmentPoints}
                      onChange={(e) => setAssignmentPoints(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Instructions & Rubric</label>
                  <textarea
                    rows={2}
                    value={assignmentDesc}
                    onChange={(e) => setAssignmentDesc(e.target.value)}
                    placeholder="Explain what items to find or good deeds to complete..."
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  onClick={promptCreateAssignment}
                  disabled={isPublishingAssignment || !assignmentTitle.trim() || !selectedCourse}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isPublishingAssignment ? 'Publishing...' : 'Publish Assignment to Google Classroom'}</span>
                </button>
              </div>
            </div>

            {/* Post Announcement */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>Post Class Stream Announcement</span>
              </h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  placeholder="Share a tournament invite or bonus opportunity with your class..."
                  className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={promptPublishAnnouncement}
                  disabled={isPublishingAnnouncement || !announcementText.trim() || !selectedCourse}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </div>

            {/* Published Assignments in Course */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="font-extrabold text-xs text-slate-300 uppercase tracking-wider">
                Published Assignments in {selectedCourse?.name || 'Class'} ({courseWorkList.length})
              </h4>
              <div className="space-y-2">
                {courseWorkList.map((cw, idx) => (
                  <div
                    key={cw.id || idx}
                    className="p-3 bg-slate-950/70 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <strong className="text-slate-100 block font-bold">{cw.title}</strong>
                      <span className="text-[11px] text-slate-400">{cw.description}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-extrabold text-xs shrink-0">
                      {cw.maxPoints || 100} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
