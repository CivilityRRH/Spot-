import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Compass,
  Radio,
  Image,
  Send,
  Coins,
  CheckCircle2,
  Play,
  Flame,
  Award,
  UserPlus,
  UserCheck,
  Zap,
  Filter
} from 'lucide-react';
import { SocialPost, UserProfile, ScavengerItem, GoodDeedAction } from '../types';
import { sounds } from '../utils/audio';

interface SocialFeedProps {
  posts: SocialPost[];
  user: UserProfile;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onVerifyDeed: (postId: string) => void;
  onTipPurse: (postId: string, amount: number) => void;
  onGoLive: () => void;
  onClaimItem: () => void;
  onCreateCustomPost: (content: string, mediaUrl?: string, item?: ScavengerItem, deed?: GoodDeedAction) => void;
  availableItems: ScavengerItem[];
  availableDeeds: GoodDeedAction[];
  onToggleFollowUser?: (userId: string) => void;
  onInspectScout?: (scoutId: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  posts,
  user,
  onLikePost,
  onAddComment,
  onVerifyDeed,
  onTipPurse,
  onGoLive,
  onClaimItem,
  onCreateCustomPost,
  availableItems,
  availableDeeds,
  onToggleFollowUser,
  onInspectScout
}) => {
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [selectedDeedId, setSelectedDeedId] = useState('');
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<{ [postId: string]: string }>({});
  const [feedFilter, setFeedFilter] = useState<'all' | 'followed'>('all');

  const filteredPosts = posts.filter((post) => {
    if (feedFilter === 'followed') {
      return user.followingUserIds?.includes(post.userId);
    }
    return true;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && !selectedItemId && !selectedDeedId) return;

    const item = availableItems.find((i) => i.id === selectedItemId);
    const deed = availableDeeds.find((d) => d.id === selectedDeedId);

    onCreateCustomPost(
      newPostContent,
      selectedMediaUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      item,
      deed
    );

    setNewPostContent('');
    setSelectedItemId('');
    setSelectedDeedId('');
    setSelectedMediaUrl('');
    sounds.playKarmaChime();
  };

  const handleSendComment = (postId: string) => {
    const text = commentInput[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text.trim());
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    sounds.playKarmaChime();
  };

  return (
    <div className="space-y-6">
      {/* Top Stories / Active Live Hunters Carousel */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">
              Live Hunters & Karma Stories
            </span>
          </div>
          <button
            onClick={onGoLive}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>+ Start Your Stream</span>
          </button>
        </div>

        <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-thin">
          {/* Your Story / Live Trigger */}
          <div
            onClick={onGoLive}
            className="relative shrink-0 w-24 h-36 rounded-2xl overflow-hidden bg-gradient-to-b from-rose-900/40 to-slate-950 border-2 border-dashed border-rose-500/50 hover:border-rose-400 flex flex-col items-center justify-center text-center p-2 cursor-pointer transition transform hover:scale-105 group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg mb-1 group-hover:scale-110 transition">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-xs font-black text-white">Go Live</span>
            <span className="text-[10px] text-rose-300">Broadcast Hunt</span>
          </div>

          {/* Hunter Story 1 */}
          <div className="relative shrink-0 w-24 h-36 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-rose-500 cursor-pointer transition transform hover:scale-105 group">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
              alt="Maya Lin"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-between">
              <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider w-fit">
                LIVE (148)
              </span>
              <span className="text-[11px] font-bold text-white leading-tight">Maya Lin</span>
            </div>
          </div>

          {/* Hunter Story 2 */}
          <div className="relative shrink-0 w-24 h-36 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-emerald-500 cursor-pointer transition transform hover:scale-105 group">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
              alt="Marcus Cole"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-between">
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider w-fit">
                DEED (450p)
              </span>
              <span className="text-[11px] font-bold text-white leading-tight">Marcus Cole</span>
            </div>
          </div>

          {/* Hunter Story 3 */}
          <div className="relative shrink-0 w-24 h-36 rounded-2xl overflow-hidden bg-slate-800 ring-2 ring-cyan-500 cursor-pointer transition transform hover:scale-105 group">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
              alt="Dexter Vance"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-2 flex flex-col justify-between">
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-black uppercase tracking-wider w-fit">
                SPOTTED
              </span>
              <span className="text-[11px] font-bold text-white leading-tight">Dexter Vance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Post Composer */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-rose-500/40"
          />
          <div className="flex-1">
            <input
              type="text"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder={`Share an I-Spy discovery, good deed, or tournament update, ${(user?.name || 'Hunter').split(' ')[0]}...`}
              className="w-full px-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-full text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition"
            />
          </div>
        </div>

        {/* Tag Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tag Found Item</span>
            </label>
            <select
              value={selectedItemId}
              onChange={(e) => setSelectedItemId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="">-- No Item Tagged --</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.rarity}] {item.name} (+{item.basePoints} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tag Good Deed Done</span>
            </label>
            <select
              value={selectedDeedId}
              onChange={(e) => setSelectedDeedId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">-- No Good Deed Tagged --</option>
              {availableDeeds.map((deed) => (
                <option key={deed.id} value={deed.id}>
                  [{deed.tier}] {deed.title} (+{deed.baseKarmaPoints} karma)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={onGoLive}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-900/50 transition"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Go Live</span>
            </button>

            <button
              onClick={onClaimItem}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
            >
              <Image className="w-3.5 h-3.5 text-cyan-400" />
              <span>Add Proof Photo</span>
            </button>
          </div>

          <button
            onClick={handlePostSubmit}
            disabled={!newPostContent.trim() && !selectedItemId && !selectedDeedId}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-extrabold shadow-md transition"
          >
            <span>Publish Post</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Feed Filters & Follower Advantage Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFeedFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
              feedFilter === 'all'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            All Live Activity
          </button>
          <button
            onClick={() => setFeedFilter('followed')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              feedFilter === 'followed'
                ? 'bg-gradient-to-r from-rose-600 to-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>Followed Scouts Radar Intel</span>
            <span className="px-1.5 py-0.5 rounded-full bg-rose-950 text-rose-200 text-[10px] font-black border border-rose-500/40">
              +15% XP
            </span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 px-2">
          <Zap className="w-3.5 h-3.5 text-rose-400 shrink-0 animate-pulse" />
          <span><strong>Follower Advantage:</strong> Following scouts unlocks radar hints & +15% bonus Karma!</span>
        </div>
      </div>

      {/* Feed Posts Stream */}
      <div className="space-y-5">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/80 border border-slate-800 rounded-3xl space-y-3">
            <UserPlus className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="font-extrabold text-white text-sm">No Followed Scouts Activity Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Follow scouts in the main feed, leaderboard, or team hub to unlock their exclusive radar location hints and earn a +15% Karma bonus on all their posts!
            </p>
            <button
              onClick={() => setFeedFilter('all')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold"
            >
              Browse All Scouts in Main Feed
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isFollowingAuthor = user.followingUserIds?.includes(post.userId);
            const isMe = post.userId === user.id;

            return (
              <div
                key={post.id}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4 transition hover:border-slate-700"
              >
                {/* Post Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.userAvatar}
                      alt={post.userName}
                      onClick={() => onInspectScout?.(post.userId)}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-700 cursor-pointer hover:ring-rose-500 transition"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          onClick={() => onInspectScout?.(post.userId)}
                          className="font-extrabold text-sm text-slate-100 cursor-pointer hover:text-rose-400 transition"
                        >
                          {post.userName}
                        </h4>
                        {post.squadName && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                            {post.squadName}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span>{post.userHandle}</span>
                        <span>•</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Follow Button & Badges */}
                  <div className="flex items-center gap-2">
                    {!isMe && onToggleFollowUser && (
                      <button
                        onClick={() => onToggleFollowUser(post.userId)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition ${
                          isFollowingAuthor
                            ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 hover:bg-rose-950 hover:text-rose-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                        title={
                          isFollowingAuthor
                            ? 'Following! You get +15% Follower Karma Bonus on this post.'
                            : 'Follow Scout to unlock +15% Follower Karma Advantage'
                        }
                      >
                        {isFollowingAuthor ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[11px]">Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5 text-rose-400" />
                            <span className="text-[11px]">Follow Scout</span>
                          </>
                        )}
                      </button>
                    )}

                    {isFollowingAuthor && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-500/40 text-rose-300 text-[10px] font-extrabold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-rose-400 animate-pulse" />
                        <span>+15% PERK ACTIVE</span>
                      </span>
                    )}

                    {post.type === 'good_deed' && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-extrabold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>GOOD DEED</span>
                      </span>
                    )}
                    {post.type === 'item_found' && (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] font-extrabold flex items-center gap-1">
                        <Compass className="w-3 h-3" />
                        <span>SPOTTED</span>
                      </span>
                    )}
                    {post.type === 'live_clip' && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[10px] font-extrabold flex items-center gap-1">
                        <Radio className="w-3 h-3 animate-pulse" />
                        <span>RECORDED CLIP</span>
                      </span>
                    )}
                  </div>
                </div>

            {/* Post Content */}
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{post.content}</p>

            {/* Item & Deed Tags Banner */}
            {(post.itemTagged || post.goodDeedTagged) && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.itemTagged && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs">
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Item: <strong>{post.itemTagged.name}</strong> (+{post.itemTagged.points} pts)</span>
                  </div>
                )}
                {post.goodDeedTagged && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Deed: <strong>{post.goodDeedTagged.title}</strong> (+{post.goodDeedTagged.karmaPoints} karma, {post.goodDeedTagged.multiplier}x)</span>
                  </div>
                )}
              </div>
            )}

            {/* Post Media (Photo / Video clip) */}
            {post.mediaUrl && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 max-h-96 group border border-slate-800">
                <img
                  src={post.mediaUrl}
                  alt="Post visual proof"
                  className="w-full h-full object-cover max-h-96"
                />
                {post.mediaType === 'video' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition">
                    <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Score badge overlay */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-black flex items-center gap-1.5 shadow-lg">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>+{post.totalEarnedScore} Tournament Score</span>
                </div>
              </div>
            )}

            {/* Interaction Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {/* Like Button */}
                <button
                  onClick={() => {
                    sounds.playKarmaChime();
                    onLikePost(post.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                    post.isLiked
                      ? 'bg-rose-950/60 text-rose-400 border border-rose-500/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span className="font-bold">{post.likes}</span>
                </button>

                {/* Comment Toggle */}
                <button
                  onClick={() =>
                    setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 transition"
                >
                  <MessageCircle className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold">{post.comments.length}</span>
                </button>

                {/* Verify Deed / Proof */}
                <button
                  onClick={() => {
                    sounds.playKarmaChime();
                    onVerifyDeed(post.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition ${
                    post.isVerifiedByMe
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-emerald-300'
                  }`}
                  title="Verify authentic proof to award karma"
                >
                  <ShieldCheck className={`w-4 h-4 ${post.isVerifiedByMe ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span className="font-bold">{post.verificationsCount} Verified</span>
                </button>
              </div>

              {/* Tip to Tournament Purse Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    sounds.playPurseJackpot();
                    onTipPurse(post.id, 5);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-300 hover:border-amber-400 hover:bg-amber-900/40 text-xs font-bold transition"
                  title="Tip $5 into the Tournament Grand Purse to reward this player"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tip Purse +$5</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-2.5 text-xs bg-slate-950/60 p-2.5 rounded-xl">
                      <img
                        src={comment.userAvatar}
                        alt={comment.userName}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{comment.userName}</span>
                          <span className="text-[10px] text-slate-400">{comment.createdAt}</span>
                        </div>
                        <p className="text-slate-300 mt-0.5">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput[post.id] || ''}
                    onChange={(e) =>
                      setCommentInput({ ...commentInput, [post.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment(post.id)}
                    placeholder="Write a comment or praise..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }))}
      </div>
    </div>
  );
};
