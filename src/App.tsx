import React, { useState, useEffect } from 'react';
import {
  CURRENT_USER,
  INITIAL_ACCOUNTS,
  INITIAL_TOURNAMENTS,
  INITIAL_EVERYDAY_ITEMS,
  GOOD_DEEDS_CATALOG,
  INITIAL_POSTS,
  INITIAL_CUSTOM_REQUESTS,
  INITIAL_SQUADS,
  INITIAL_LEADERBOARD,
  INITIAL_PHOTO_CHALLENGES
} from './data/mockData';
import {
  ScavengerItem,
  GoodDeedAction,
  SocialPost,
  CustomItemRequest,
  UserProfile,
  UserAccount,
  Tournament,
  PhotoChallenge,
  TaggedObject
} from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SocialFeed } from './components/SocialFeed';
import { ItemCatalogView } from './components/ItemCatalogView';
import { KarmaCalculatorView } from './components/KarmaCalculatorView';
import { TournamentPurseView } from './components/TournamentPurseView';
import { CustomRequestsView } from './components/CustomRequestsView';
import { TeamHubView } from './components/TeamHubView';
import { LiveStreamModal } from './components/LiveStreamModal';
import { ItemClaimModal } from './components/ItemClaimModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CreateTournamentModal } from './components/CreateTournamentModal';
import { PhotoTaggingCreatorModal } from './components/PhotoTaggingCreatorModal';
import { InteractiveISpyPlayerModal } from './components/InteractiveISpyPlayerModal';
import { ScoutProfileModal } from './components/ScoutProfileModal';
import { PhotoChallengesListView } from './components/PhotoChallengesListView';
import { MonthlyContendersView } from './components/MonthlyContendersView';
import { sounds } from './utils/audio';
import { loadStorage, saveStorage } from './utils/storage';
import confetti from 'canvas-confetti';
import { Radio } from 'lucide-react';

export default function App() {
  // Global User & Accounts State (Persisted)
  const [accounts, setAccounts] = useState<UserAccount[]>(() =>
    loadStorage('karmaspy_accounts', INITIAL_ACCOUNTS)
  );
  const [user, setUser] = useState<UserProfile>(() =>
    loadStorage('karmaspy_user', CURRENT_USER)
  );

  // Tournaments & Challenges State (Persisted)
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    loadStorage('karmaspy_tournaments', INITIAL_TOURNAMENTS)
  );
  const [activeTournamentId, setActiveTournamentId] = useState<string>(
    INITIAL_TOURNAMENTS[0]?.id || 'tourn_grand_spring_2026'
  );
  const [photoChallenges, setPhotoChallenges] = useState<PhotoChallenge[]>(() =>
    loadStorage('karmaspy_challenges', INITIAL_PHOTO_CHALLENGES)
  );

  // Scavenger & Social State (Persisted)
  const [items, setItems] = useState<ScavengerItem[]>(() =>
    loadStorage('karmaspy_items', INITIAL_EVERYDAY_ITEMS)
  );
  const [goodDeeds, setGoodDeeds] = useState<GoodDeedAction[]>(GOOD_DEEDS_CATALOG);
  const [posts, setPosts] = useState<SocialPost[]>(() =>
    loadStorage('karmaspy_posts', INITIAL_POSTS)
  );
  const [customRequests, setCustomRequests] = useState<CustomItemRequest[]>(() =>
    loadStorage('karmaspy_custom_requests', INITIAL_CUSTOM_REQUESTS)
  );
  const [squads, setSquads] = useState(INITIAL_SQUADS);
  const [leaderboard, setLeaderboard] = useState(() =>
    loadStorage('karmaspy_leaderboard', INITIAL_LEADERBOARD)
  );

  // LocalStorage Persistence Effects
  useEffect(() => saveStorage('karmaspy_accounts', accounts), [accounts]);
  useEffect(() => saveStorage('karmaspy_user', user), [user]);
  useEffect(() => saveStorage('karmaspy_tournaments', tournaments), [tournaments]);
  useEffect(() => saveStorage('karmaspy_challenges', photoChallenges), [photoChallenges]);
  useEffect(() => saveStorage('karmaspy_items', items), [items]);
  useEffect(() => saveStorage('karmaspy_posts', posts), [posts]);
  useEffect(() => saveStorage('karmaspy_custom_requests', customRequests), [customRequests]);
  useEffect(() => saveStorage('karmaspy_leaderboard', leaderboard), [leaderboard]);

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<string>('feed');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals Visibility
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedItemForClaim, setSelectedItemForClaim] = useState<ScavengerItem | null>(null);

  // New Modals: Auth, Profile, Tournament Creation, Photo Tagging & Play, Scout Inspector
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateTournamentModalOpen, setIsCreateTournamentModalOpen] = useState(false);
  const [isPhotoTaggingModalOpen, setIsPhotoTaggingModalOpen] = useState(false);
  const [activePlayingChallenge, setActivePlayingChallenge] = useState<PhotoChallenge | null>(null);
  const [inspectedScout, setInspectedScout] = useState<UserProfile | null>(null);
  const [isScoutModalOpen, setIsScoutModalOpen] = useState(false);

  // Follow Scout Handler (Provides follower advantages)
  const handleToggleFollowUser = (targetUserId: string) => {
    setUser((prevUser) => {
      const currentFollowing = prevUser.followingUserIds || [];
      const isFollowing = currentFollowing.includes(targetUserId);

      const updatedFollowing = isFollowing
        ? currentFollowing.filter((id) => id !== targetUserId)
        : [...currentFollowing, targetUserId];

      const currentAdv = prevUser.followerAdvantages || {
        bonusKarmaXP: 0,
        radarCluesUnlocked: 0,
        earlyIntelHits: 0
      };

      const updatedAdv = !isFollowing
        ? {
            bonusKarmaXP: currentAdv.bonusKarmaXP + 50,
            radarCluesUnlocked: currentAdv.radarCluesUnlocked + 2,
            earlyIntelHits: currentAdv.earlyIntelHits + 1
          }
        : currentAdv;

      const updatedUser = {
        ...prevUser,
        followingUserIds: updatedFollowing,
        followerAdvantages: updatedAdv
      };

      // Sync with accounts
      setAccounts((prevAccs) =>
        prevAccs.map((acc) =>
          acc.profile.id === updatedUser.id ? { ...acc, profile: updatedUser } : acc
        )
      );

      return updatedUser;
    });

    if (user.preferences?.soundEffects !== false) {
      sounds.playPurseJackpot();
    }
  };

  const handleInspectScout = (scoutId: string) => {
    const foundAcc = accounts.find((a) => a.profile.id === scoutId);
    if (foundAcc) {
      setInspectedScout(foundAcc.profile);
      setIsScoutModalOpen(true);
      return;
    }

    const foundPost = posts.find((p) => p.userId === scoutId);
    if (foundPost) {
      const tempScout: UserProfile = {
        id: scoutId,
        name: foundPost.userName,
        handle: foundPost.userHandle,
        email: `${foundPost.userHandle.replace('@', '')}@karmaspy.io`,
        avatar: foundPost.userAvatar,
        level: 4,
        karmaPoints: 1250,
        itemsFound: 18,
        goodDeedsLogged: 12,
        totalPurseWinnings: 350,
        tournamentsWon: 1,
        role: 'player',
        joinedTournamentIds: ['tourney_1'],
        squadName: foundPost.squadName || 'Karma Scouts',
        badge: 'Master I-Spy Scout',
        followingUserIds: [],
        followerAdvantages: { bonusKarmaXP: 100, radarCluesUnlocked: 5, earlyIntelHits: 2 }
      };
      setInspectedScout(tempScout);
      setIsScoutModalOpen(true);
      return;
    }

    if (scoutId === user.id) {
      setInspectedScout(user);
      setIsScoutModalOpen(true);
    }
  };

  // Active Tournament object
  const activeTournament = tournaments.find((t) => t.id === activeTournamentId) || tournaments[0] || INITIAL_TOURNAMENTS[0];

  // Auth Handlers
  const handleLoginAccount = (account: UserAccount) => {
    setUser(account.profile);
    setIsAuthModalOpen(false);
    if (account.profile.preferences?.soundEffects !== false) {
      sounds.playKarmaChime();
    }
  };

  const handleSignUpAccount = (newAccount: UserAccount) => {
    setAccounts((prev) => [...prev, newAccount]);
    setUser(newAccount.profile);
    setIsAuthModalOpen(false);
    sounds.playPurseJackpot();
  };

  const handleSwitchAccount = (account: UserAccount) => {
    setUser(account.profile);
    setIsAuthModalOpen(false);
    setIsProfileModalOpen(false);
    if (account.profile.preferences?.soundEffects !== false) {
      sounds.playKarmaChime();
    }
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updated };

      // Sync with accounts list
      setAccounts((prevAccs) =>
        prevAccs.map((acc) =>
          acc.profile.id === newUser.id
            ? { ...acc, email: newUser.email || acc.email, profile: { ...acc.profile, ...updated } }
            : acc
        )
      );

      // Sync user profile across posts created by this user
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.userId === newUser.id
            ? {
                ...p,
                userName: newUser.name,
                userHandle: newUser.handle,
                userAvatar: newUser.avatar,
                squadName: newUser.squadName
              }
            : p
        )
      );

      // Sync user profile across challenges created by this user
      setPhotoChallenges((prevChallenges) =>
        prevChallenges.map((c) =>
          c.creatorId === newUser.id
            ? { ...c, creatorName: newUser.name, creatorAvatar: newUser.avatar }
            : c
        )
      );

      // Sync user profile across custom requests
      setCustomRequests((prevRequests) =>
        prevRequests.map((r) =>
          r.requesterId === newUser.id
            ? { ...r, requesterName: newUser.name, requesterAvatar: newUser.avatar }
            : r
        )
      );

      // Sync user profile on Leaderboard
      setLeaderboard((prevLb) =>
        prevLb.map((row) =>
          row.isMe || row.id === newUser.id
            ? { ...row, name: newUser.name, handle: newUser.handle, avatar: newUser.avatar, squadName: newUser.squadName || row.squadName }
            : row
        )
      );

      return newUser;
    });

    if (updated.preferences?.soundEffects !== false) {
      sounds.playKarmaChime();
    }
  };

  const handleLogout = () => {
    setIsProfileModalOpen(false);
    setIsAuthModalOpen(true);
  };

  const handleUpdateUserKarma = (addedKarma: number, addedWins: number = 0) => {
    setUser((prev) => {
      const updated: UserProfile = {
        ...prev,
        karmaPoints: prev.karmaPoints + addedKarma,
        tournamentsWon: prev.tournamentsWon + addedWins,
        level: Math.floor((prev.karmaPoints + addedKarma) / 150) + 1
      };
      setAccounts((accs) =>
        accs.map((a) => (a.profile.id === updated.id ? { ...a, profile: updated } : a))
      );
      return updated;
    });
  };

  // Tournament Handlers
  const handleCreateTournament = (newTourney: Tournament) => {
    setTournaments((prev) => [newTourney, ...prev]);
    setActiveTournamentId(newTourney.id);
    setActiveTab('tournament');
    sounds.playPurseJackpot();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const handleJoinTournament = (tournamentId: string, buyInFee: number) => {
    setTournaments((prev) =>
      prev.map((t) => {
        if (t.id === tournamentId) {
          const joinedList = t.joinedPlayerIds || [];
          if (!joinedList.includes(user.id)) {
            return {
              ...t,
              joinedPlayerIds: [...joinedList, user.id],
              playersCount: t.playersCount + 1,
              totalPurse: t.totalPurse + buyInFee
            };
          }
        }
        return t;
      })
    );
    sounds.playPurseJackpot();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleUnlockPrivateTournament = (code: string): boolean => {
    const match = tournaments.find(
      (t) => t.isPrivate && t.inviteCode && t.inviteCode.toUpperCase() === code.toUpperCase()
    );
    if (match) {
      setActiveTournamentId(match.id);
      setActiveTab('tournament');
      return true;
    }
    return false;
  };

  // Photo Challenge & Tagging Handlers
  const handleSavePhotoChallenge = (newChallenge: PhotoChallenge) => {
    setPhotoChallenges((prev) => [newChallenge, ...prev]);

    // Create a social post announcement for the feed
    const post: SocialPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userHandle: user.handle,
      squadName: user.squadName,
      type: 'announcement',
      content: `🎯 New I-Spy Photo Challenge published: "${newChallenge.title}"! Can you spot all ${newChallenge.taggedObjects.length} hidden objects?`,
      mediaUrl: newChallenge.imageUrl,
      mediaType: 'image',
      pointsEarned: 50,
      karmaEarned: 25,
      totalEarnedScore: 75,
      likes: 3,
      isLiked: true,
      verificationsCount: 2,
      isVerifiedByMe: true,
      purseTipAmount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setPosts((prev) => [post, ...prev]);
    sounds.playPurseJackpot();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleObjectFoundInISpy = (challengeId: string, objectId: string, pointsAwarded: number) => {
    setPhotoChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const userFound = c.foundObjectsByUser[user.id] || [];
          if (!userFound.includes(objectId)) {
            return {
              ...c,
              foundObjectsByUser: {
                ...c.foundObjectsByUser,
                [user.id]: [...userFound, objectId]
              }
            };
          }
        }
        return c;
      })
    );

    // Reward user
    setUser((prev) => ({
      ...prev,
      itemsFound: prev.itemsFound + 1,
      karmaPoints: prev.karmaPoints + Math.round(pointsAwarded * 0.5)
    }));

    // Update leaderboard
    setLeaderboard((prev) =>
      prev.map((row) => {
        if (row.isMe) {
          const newItemScore = row.itemScore + pointsAwarded;
          const newTotal = Math.round((newItemScore + row.karmaScore) * row.teamMultiplier);
          return {
            ...row,
            itemScore: newItemScore,
            totalPoints: newTotal
          };
        }
        return row;
      })
    );
  };

  const handleCompleteAllObjectsInISpy = (challenge: PhotoChallenge) => {
    sounds.playPurseJackpot();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Handler: Like Post
  const handleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
          };
        }
        return p;
      })
    );
  };

  // Handler: Add Comment
  const handleAddComment = (postId: string, text: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: Date.now().toString(),
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                text,
                createdAt: 'Just now',
                likes: 0
              }
            ]
          };
        }
        return p;
      })
    );
  };

  // Handler: Verify Deed / Item
  const handleVerifyDeed = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isVerified = !p.isVerifiedByMe;
          return {
            ...p,
            isVerifiedByMe: isVerified,
            verificationsCount: isVerified
              ? p.verificationsCount + 1
              : Math.max(0, p.verificationsCount - 1)
          };
        }
        return p;
      })
    );

    // Reward verifier with +5 karma
    setUser((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + 5
    }));
  };

  // Handler: Tip Tournament Purse
  const handleTipPurse = (postId: string, amount: number) => {
    // Increase tournament purse
    setTournaments((prev) =>
      prev.map((t) => (t.id === activeTournament.id ? { ...t, totalPurse: t.totalPurse + amount } : t))
    );

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, purseTipAmount: p.purseTipAmount + amount } : p))
    );

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Handler: Claim Item
  const handleClaimSubmitted = (claimData: {
    item: ScavengerItem;
    goodDeed?: GoodDeedAction;
    notes: string;
    proofMediaUrl: string;
    pointsEarned: number;
    karmaEarned: number;
    totalEarned: number;
  }) => {
    // Mark item as found
    setItems((prev) =>
      prev.map((i) =>
        i.id === claimData.item.id
          ? { ...i, isFoundByMe: true, foundByCount: (i.foundByCount || 0) + 1 }
          : i
      )
    );

    // Update user stats
    setUser((prev) => ({
      ...prev,
      itemsFound: prev.itemsFound + 1,
      karmaPoints: prev.karmaPoints + claimData.karmaEarned,
      goodDeedsLogged: claimData.goodDeed ? prev.goodDeedsLogged + 1 : prev.goodDeedsLogged
    }));

    // Update leaderboard
    setLeaderboard((prev) =>
      prev.map((row) => {
        if (row.isMe) {
          const newItemScore = row.itemScore + claimData.pointsEarned;
          const newKarmaScore = row.karmaScore + claimData.karmaEarned;
          const newTotal = Math.round((newItemScore + newKarmaScore) * row.teamMultiplier);
          return {
            ...row,
            itemScore: newItemScore,
            karmaScore: newKarmaScore,
            totalPoints: newTotal
          };
        }
        return row;
      })
    );

    // Publish to feed
    const newPost: SocialPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userHandle: user.handle,
      squadName: user.squadName,
      type: claimData.goodDeed ? 'good_deed' : 'item_found',
      content: claimData.notes,
      mediaUrl: claimData.proofMediaUrl,
      mediaType: 'image',
      itemTagged: {
        id: claimData.item.id,
        name: claimData.item.name,
        points: claimData.pointsEarned,
        rarity: claimData.item.rarity
      },
      goodDeedTagged: claimData.goodDeed
        ? {
            id: claimData.goodDeed.id,
            title: claimData.goodDeed.title,
            karmaPoints: claimData.karmaEarned,
            multiplier: claimData.goodDeed.multiplierBoost,
            tier: claimData.goodDeed.tier
          }
        : undefined,
      pointsEarned: claimData.pointsEarned,
      karmaEarned: claimData.karmaEarned,
      totalEarnedScore: claimData.totalEarned,
      likes: 1,
      isLiked: true,
      verificationsCount: 1,
      isVerifiedByMe: true,
      purseTipAmount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setPosts((prev) => [newPost, ...prev]);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Handler: Publish Recorded Live Clip
  const handlePublishRecordedClip = (clipData: {
    title: string;
    description: string;
    itemTagged?: ScavengerItem;
    deedTagged?: GoodDeedAction;
    videoUrl: string;
    durationSeconds: number;
    karmaEarned: number;
    pointsEarned: number;
  }) => {
    const totalScore = Math.round((clipData.pointsEarned + clipData.karmaEarned) * 1.5);

    const newClipPost: SocialPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userHandle: user.handle,
      squadName: user.squadName,
      type: 'live_clip',
      content: `🔴 ${clipData.title} — ${clipData.description}`,
      mediaUrl: clipData.videoUrl,
      mediaType: 'video',
      itemTagged: clipData.itemTagged
        ? {
            id: clipData.itemTagged.id,
            name: clipData.itemTagged.name,
            points: clipData.pointsEarned,
            rarity: clipData.itemTagged.rarity
          }
        : undefined,
      goodDeedTagged: clipData.deedTagged
        ? {
            id: clipData.deedTagged.id,
            title: clipData.deedTagged.title,
            karmaPoints: clipData.karmaEarned,
            multiplier: clipData.deedTagged.multiplierBoost,
            tier: clipData.deedTagged.tier
          }
        : undefined,
      pointsEarned: clipData.pointsEarned,
      karmaEarned: clipData.karmaEarned,
      totalEarnedScore: totalScore,
      likes: 2,
      isLiked: true,
      verificationsCount: 1,
      isVerifiedByMe: true,
      purseTipAmount: 10,
      createdAt: 'Just now',
      comments: []
    };

    setPosts((prev) => [newClipPost, ...prev]);

    setUser((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + clipData.karmaEarned,
      itemsFound: clipData.itemTagged ? prev.itemsFound + 1 : prev.itemsFound,
      goodDeedsLogged: clipData.deedTagged ? prev.goodDeedsLogged + 1 : prev.goodDeedsLogged
    }));
  };

  // Handler: Log Good Deed from Calculator
  const handleLogGoodDeed = (
    deed: GoodDeedAction,
    impactTier: string,
    witnessBonus: boolean,
    notes: string
  ) => {
    let mult = 1.0;
    if (impactTier === 'neighborhood') mult = 1.25;
    if (impactTier === 'community_hero') mult = 1.6;
    if (witnessBonus) mult *= 1.2;

    const karmaYield = Math.round(deed.baseKarmaPoints * mult);

    setUser((prev) => ({
      ...prev,
      karmaPoints: prev.karmaPoints + karmaYield,
      goodDeedsLogged: prev.goodDeedsLogged + 1
    }));

    // Post to feed
    const deedPost: SocialPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userHandle: user.handle,
      squadName: user.squadName,
      type: 'good_deed',
      content: notes || `Logged verified act of kindness: ${deed.title}! ${deed.description}`,
      mediaUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
      goodDeedTagged: {
        id: deed.id,
        title: deed.title,
        karmaPoints: karmaYield,
        multiplier: deed.multiplierBoost,
        tier: deed.tier
      },
      pointsEarned: 0,
      karmaEarned: karmaYield,
      totalEarnedScore: karmaYield,
      likes: 1,
      isLiked: true,
      verificationsCount: 1,
      isVerifiedByMe: true,
      purseTipAmount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setPosts((prev) => [deedPost, ...prev]);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 }
    });
  };

  // Handler: Generate Unlimited Random Items
  const handleGenerateRandomItems = (count: number) => {
    const itemAdjectives = ['Vintage', 'Golden', 'Antique', 'Neon', 'Handmade', 'Spotted', 'Urban', 'Rare', 'Cozy', 'Luminescent'];
    const itemNouns = ['Ceramic Teapot', 'Street Sign with Arrow', 'Bird Feeder in Garden', 'Classic Leather Notebook', 'Street Musician Case', 'Park Bench with Plaque', 'Stray Kitten Playing with Yarn', 'Painted Utility Box', 'Copper Weather Vane', 'Mini Windchime'];
    const categories: ScavengerItem['category'][] = [
      'Household',
      'Urban & Street',
      'Nature & Park',
      'Work & School',
      'Kindness & Community',
      'Food & Drink',
      'Oddities & Fun'
    ];
    const rarities: ('common' | 'uncommon' | 'rare' | 'legendary')[] = ['common', 'uncommon', 'rare', 'legendary'];

    const newItems: ScavengerItem[] = Array.from({ length: count }).map((_, i) => {
      const adj = itemAdjectives[Math.floor(Math.random() * itemAdjectives.length)];
      const noun = itemNouns[Math.floor(Math.random() * itemNouns.length)];
      const rarity = rarities[Math.floor(Math.random() * rarities.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      let pts = 30;
      if (rarity === 'uncommon') pts = 60;
      if (rarity === 'rare') pts = 110;
      if (rarity === 'legendary') pts = 200;

      return {
        id: `gen_item_${Date.now()}_${i}`,
        name: `${adj} ${noun}`,
        category,
        basePoints: pts,
        rarity,
        description: `Randomized everyday I-Spy objective. Hunt this item in your surroundings!`,
        hint: `Check public places, neighborhood squares, or local stores.`,
        foundByCount: 0,
        isFoundByMe: false
      };
    });

    setItems((prev) => [...newItems, ...prev]);
  };

  // Handler: Vote Custom Item
  const handleVoteRequest = (requestId: string, vote: 'up' | 'down') => {
    setCustomRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          const currentVote = req.userVoted;
          let votesUp = req.votesUp;
          let votesDown = req.votesDown;

          if (currentVote === vote) {
            // Cancel vote
            if (vote === 'up') votesUp--;
            if (vote === 'down') votesDown--;
            return { ...req, userVoted: undefined, votesUp, votesDown };
          } else {
            if (currentVote === 'up') votesUp--;
            if (currentVote === 'down') votesDown--;
            if (vote === 'up') votesUp++;
            if (vote === 'down') votesDown++;
            return { ...req, userVoted: vote, votesUp, votesDown };
          }
        }
        return req;
      })
    );
  };

  // Handler: Submit Custom Request
  const handleSubmitNewRequest = (data: {
    itemName: string;
    category: ScavengerItem['category'];
    suggestedPoints: number;
    description: string;
    maxAllowedFinders: number;
    expiresInHours: number;
  }) => {
    const newReq: CustomItemRequest = {
      id: `req_${Date.now()}`,
      itemName: data.itemName,
      category: data.category,
      suggestedPoints: data.suggestedPoints,
      description: data.description,
      requesterId: user.id,
      requesterName: user.name,
      requesterAvatar: user.avatar,
      status: 'pending',
      maxAllowedFinders: data.maxAllowedFinders,
      expiresInHours: data.expiresInHours,
      votesUp: 1,
      votesDown: 0,
      userVoted: 'up',
      createdAt: 'Just now'
    };

    setCustomRequests((prev) => [newReq, ...prev]);
  };

  // Handler: Approve Custom Item into Catalog
  const handleAdminApprove = (requestId: string) => {
    const req = customRequests.find((r) => r.id === requestId);
    if (!req) return;

    setCustomRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? { ...r, status: 'approved', adminNotes: 'Approved by Tournament Host & Injected into catalog!' }
          : r
      )
    );

    // Add to items list
    const newItem: ScavengerItem = {
      id: `custom_item_${req.id}`,
      name: req.itemName,
      category: req.category,
      basePoints: req.suggestedPoints,
      rarity: req.suggestedPoints > 150 ? 'legendary' : req.suggestedPoints > 80 ? 'rare' : 'uncommon',
      description: req.description,
      isCustom: true,
      createdBy: req.requesterName,
      foundByCount: 0,
      isFoundByMe: false
    };

    setItems((prev) => [newItem, ...prev]);
    sounds.playPurseJackpot();
  };

  // Handler: Create custom post from composer
  const handleCreateCustomPost = (
    content: string,
    mediaUrl?: string,
    item?: ScavengerItem,
    deed?: GoodDeedAction
  ) => {
    const basePts = item ? item.basePoints : 0;
    const karmaPts = deed ? deed.baseKarmaPoints : 0;
    const mult = deed ? deed.multiplierBoost : 1.0;
    const total = Math.round((basePts + karmaPts) * mult);

    const post: SocialPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userHandle: user.handle,
      squadName: user.squadName,
      type: deed ? 'good_deed' : item ? 'item_found' : 'announcement',
      content: content || `Hunted an item and shared with the squad!`,
      mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      mediaType: 'image',
      itemTagged: item
        ? {
            id: item.id,
            name: item.name,
            points: item.basePoints,
            rarity: item.rarity
          }
        : undefined,
      goodDeedTagged: deed
        ? {
            id: deed.id,
            title: deed.title,
            karmaPoints: deed.baseKarmaPoints,
            multiplier: deed.multiplierBoost,
            tier: deed.tier
          }
        : undefined,
      pointsEarned: basePts,
      karmaEarned: karmaPts,
      totalEarnedScore: total,
      likes: 1,
      isLiked: true,
      verificationsCount: 1,
      isVerifiedByMe: true,
      purseTipAmount: 0,
      createdAt: 'Just now',
      comments: []
    };

    setPosts((prev) => [post, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Navigation Header */}
      <Header
        user={user}
        activeTournament={activeTournament}
        onGoLive={() => setIsLiveModalOpen(true)}
        onClaimItem={() => {
          setSelectedItemForClaim(null);
          setIsClaimModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenCreateTournament={() => setIsCreateTournamentModalOpen(true)}
        onOpenCreateChallenge={() => setIsPhotoTaggingModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Sidebar */}
          <Sidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            user={user}
            activeTournament={activeTournament}
            onOpenProfile={() => setIsProfileModalOpen(true)}
            onOpenCreateTournament={() => setIsCreateTournamentModalOpen(true)}
            onOpenCreateChallenge={() => setIsPhotoTaggingModalOpen(true)}
          />

          {/* Center / Main Content Area */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'feed' && (
              <SocialFeed
                posts={posts}
                user={user}
                onLikePost={handleLikePost}
                onAddComment={handleAddComment}
                onVerifyDeed={handleVerifyDeed}
                onTipPurse={handleTipPurse}
                onGoLive={() => setIsLiveModalOpen(true)}
                onClaimItem={() => {
                  setSelectedItemForClaim(null);
                  setIsClaimModalOpen(true);
                }}
                onCreateCustomPost={handleCreateCustomPost}
                availableItems={items}
                availableDeeds={goodDeeds}
                onToggleFollowUser={handleToggleFollowUser}
                onInspectScout={handleInspectScout}
              />
            )}

            {activeTab === 'challenges' && (
              <PhotoChallengesListView
                challenges={photoChallenges}
                activeTournament={activeTournament}
                currentUser={user}
                onPlayChallenge={(challenge) => {
                  setActivePlayingChallenge(challenge);
                }}
                onOpenCreateChallenge={() => setIsPhotoTaggingModalOpen(true)}
              />
            )}

            {activeTab === 'live_hub' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-rose-950/80 via-slate-900 to-indigo-950/80 border border-rose-500/40 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                        LIVE BROADCAST HUB
                      </span>
                      <span className="text-xs text-slate-300 font-bold">2 Streams Active Now</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Live I-Spy Hunts & Karma Streams
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                      Watch fellow hunters stream their city discoveries and good deeds live in real-time. Cheer with karma or broadcast your own hunt!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsLiveModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition transform hover:scale-[1.02]"
                  >
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>Go Live & Record Stream</span>
                  </button>
                </div>

                {/* Active streams grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setIsLiveModalOpen(true)}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg cursor-pointer group hover:border-rose-500/50 transition"
                  >
                    <div className="relative h-56 bg-slate-950">
                      <img
                        src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&auto=format&fit=crop&q=80"
                        alt="Maya stream"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>LIVE</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                            148 watching
                          </span>
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-900/80 text-indigo-200 text-[10px] font-bold">
                            🔍 Hunting: Antique Typewriter
                          </span>
                          <h4 className="text-white font-extrabold text-sm mt-1">
                            🔴 Searching for the Antique Typewriter in Old Town!
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setIsLiveModalOpen(true)}
                    className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg cursor-pointer group hover:border-emerald-500/50 transition"
                  >
                    <div className="relative h-56 bg-slate-950">
                      <img
                        src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80"
                        alt="Samir stream"
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/60 p-4 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            <span>LIVE</span>
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                            94 watching
                          </span>
                        </div>
                        <div>
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-900/80 text-emerald-200 text-[10px] font-bold">
                            ✨ Deed: River Walk Trash Pick & Double Rainbow
                          </span>
                          <h4 className="text-white font-extrabold text-sm mt-1">
                            🔴 River Walk Trash Pick & Double Rainbow Hunt
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'catalog' && (
              <ItemCatalogView
                items={items}
                onClaimItem={(item) => {
                  setSelectedItemForClaim(item);
                  setIsClaimModalOpen(true);
                }}
                onRequestCustomItem={() => setActiveTab('custom_requests')}
                onGenerateRandomItems={handleGenerateRandomItems}
              />
            )}

            {activeTab === 'calculator' && (
              <KarmaCalculatorView
                goodDeeds={goodDeeds}
                user={user}
                onLogGoodDeed={handleLogGoodDeed}
                availableItems={items}
              />
            )}

            {activeTab === 'tournament' && (
              <TournamentPurseView
                tournament={activeTournament}
                tournaments={tournaments}
                user={user}
                leaderboard={leaderboard}
                photoChallenges={photoChallenges}
                onSelectTournament={(t) => setActiveTournamentId(t.id)}
                onJoinTournament={handleJoinTournament}
                onOpenCreateTournament={() => setIsCreateTournamentModalOpen(true)}
                onPlayChallenge={(challenge) => setActivePlayingChallenge(challenge)}
                onOpenCreateChallenge={() => setIsPhotoTaggingModalOpen(true)}
                onUnlockPrivateTournament={handleUnlockPrivateTournament}
              />
            )}

            {activeTab === 'monthly_contenders' && (
              <MonthlyContendersView
                user={user}
                accounts={accounts}
                tournaments={tournaments}
                photoChallenges={photoChallenges}
                onSelectTournament={(tId) => {
                  setActiveTournamentId(tId);
                  setActiveTab('tournament');
                }}
                onInspectScout={handleInspectScout}
                onPlayChallenge={(challenge) => {
                  setActivePlayingChallenge(challenge);
                }}
                onUpdateUserKarma={handleUpdateUserKarma}
              />
            )}

            {activeTab === 'custom_requests' && (
              <CustomRequestsView
                requests={customRequests}
                onVoteRequest={handleVoteRequest}
                onSubmitNewRequest={handleSubmitNewRequest}
                onAdminApprove={handleAdminApprove}
              />
            )}

            {activeTab === 'squads' && <TeamHubView squads={squads} user={user} />}
          </div>
        </div>
      </main>

      {/* Live Stream & Recording Modal */}
      <LiveStreamModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        availableItems={items}
        availableDeeds={goodDeeds}
        onPublishRecordedClip={handlePublishRecordedClip}
      />

      {/* Claim Found Item Modal */}
      <ItemClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        items={items}
        goodDeeds={goodDeeds}
        initialSelectedItem={selectedItemForClaim}
        onClaimSubmitted={handleClaimSubmitted}
      />

      {/* Auth Modal (Login, Signup, Demo Switcher) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        accounts={accounts}
        currentUser={user}
        onLogin={handleLoginAccount}
        onSignUp={handleSignUpAccount}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
        onOpenAuthModal={() => {
          setIsProfileModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        isOpen={isCreateTournamentModalOpen}
        onClose={() => setIsCreateTournamentModalOpen(false)}
        user={user}
        onCreateTournament={handleCreateTournament}
      />

      {/* Photo Tagging Challenge Creator Modal */}
      <PhotoTaggingCreatorModal
        isOpen={isPhotoTaggingModalOpen}
        onClose={() => setIsPhotoTaggingModalOpen(false)}
        user={user}
        tournaments={tournaments}
        activeTournamentId={activeTournament?.id}
        onCreateChallenge={handleSavePhotoChallenge}
      />

      {/* Interactive I-Spy Gameplay Player Modal */}
      {activePlayingChallenge && (
        <InteractiveISpyPlayerModal
          isOpen={!!activePlayingChallenge}
          onClose={() => setActivePlayingChallenge(null)}
          challenge={activePlayingChallenge}
          user={user}
          onObjectDiscovered={(challengeId, objId, pts) =>
            handleObjectFoundInISpy(challengeId, objId, pts)
          }
          onChallengeCompleted={() =>
            handleCompleteAllObjectsInISpy(activePlayingChallenge)
          }
          onToggleFollowCreator={handleToggleFollowUser}
        />
      )}

      {/* Scout Profile Inspector Modal */}
      <ScoutProfileModal
        isOpen={isScoutModalOpen}
        onClose={() => setIsScoutModalOpen(false)}
        scout={inspectedScout}
        currentUser={user}
        onToggleFollow={handleToggleFollowUser}
        userPosts={posts}
        userChallenges={photoChallenges}
        onPlayChallenge={(challenge) => {
          setActivePlayingChallenge(challenge);
        }}
      />
    </div>
  );
}
