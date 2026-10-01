export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'legendary' | 'mythic';

export interface ScavengerItem {
  id: string;
  name: string;
  category: 'Household' | 'Urban & Street' | 'Nature & Park' | 'Work & School' | 'Kindness & Community' | 'Food & Drink' | 'Oddities & Fun';
  basePoints: number;
  rarity: ItemRarity;
  description: string;
  hint?: string;
  isCustom?: boolean;
  createdBy?: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  foundByCount?: number;
  isFoundByMe?: boolean;
  foundProofUrl?: string;
}

export type GoodDeedCategory = 
  | 'helping_hand' 
  | 'eco_cleanup' 
  | 'kindness_boost' 
  | 'community_aid' 
  | 'animal_welfare' 
  | 'mentorship';

export interface GoodDeedAction {
  id: string;
  title: string;
  category: GoodDeedCategory;
  baseKarmaPoints: number;
  multiplierBoost: number; // e.g. 1.25x
  description: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  verificationRequirement: string;
}

export interface CustomItemRequest {
  id: string;
  itemName: string;
  category: ScavengerItem['category'];
  suggestedPoints: number;
  description: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
  maxAllowedFinders: number;
  expiresInHours: number;
  votesUp: number;
  votesDown: number;
  userVoted?: 'up' | 'down';
  createdAt: string;
  adminNotes?: string;
}

export interface TaggedObject {
  id: string;
  name: string;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  radius: number; // percentage tolerance, e.g. 6%
  points: number;
  hint?: string;
  category?: string;
  rarity?: ItemRarity;
  karmaBonus?: number;
}

export interface PhotoChallenge {
  id: string;
  tournamentId: string;
  title: string;
  description: string;
  imageUrl: string;
  sceneCategory: 'Urban Street' | 'Cozy Room' | 'Nature Park' | 'Market & Cafe' | 'Vintage Desk' | 'Mystery Spot';
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  createdAt: string;
  taggedObjects: TaggedObject[];
  completedByUserIds: string[];
  foundObjectsByUser: { [userId: string]: string[] }; // user ID -> array of object IDs found
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  townOrCity: string; // e.g. "Seattle, WA", "Austin, TX", "London, UK", "Global Metro"
  regionCoordinates?: { lat: number; lng: number };
  huntCategory: 'Urban Exploration' | 'Eco Cleanup' | 'Community Kindness' | 'Historic Town' | 'Night Owl Hunt';
  specificHuntItems: string[]; // Specific items to hunt for in this town/tournament (e.g. "Art Deco Mailbox", "Bronze Pioneer Plaque", "Solar Powered Bench")
  specificGoodDeeds: string[]; // Specific good deeds tailored for this community (e.g. "Clean 10 pieces of park litter", "Help carry grocery bags", "Water wilting community planters")
  buyInFee: number; // in USD
  totalPurse: number; // in USD
  playersCount: number;
  squadsCount: number;
  startTime?: string;
  endsAt: string;
  status: 'active' | 'upcoming' | 'completed';
  isPrivate: boolean;
  inviteCode?: string;
  maxPlayers?: number;
  creatorId: string;
  creatorName: string;
  sponsorBonus: number;
  rules: string[];
  prizeSplit: {
    firstPlace: number;
    secondPlace: number;
    thirdPlace: number;
    topKarmaDeedHero: number;
    topSquadPurse: number;
  };
  joinedPlayerIds: string[];
  challengesCount?: number;
  activeSpectatorCount?: number;
  isLiveBroadcasting?: boolean;
}

export interface LiveTVBroadcast {
  id: string;
  streamerId: string;
  streamerName: string;
  streamerAvatar: string;
  streamerHandle: string;
  streamerSquad?: string;
  townOrCity: string;
  tournamentId: string;
  tournamentTitle: string;
  title: string;
  videoUrl: string; // Live stream feed or recorded simulated video
  activeSpectatorCount: number;
  targetItem?: string;
  targetDeed?: string;
  aiVerificationStatus: 'scanning' | 'verified_item' | 'verified_deed' | 'analyzing_video' | 'idle';
  aiScoreBreakdown?: {
    itemConfidence: number;
    deedConfidence: number;
    authenticityScore: number;
    liveKarmaAwarded: number;
    spectatorHypeBonus: number;
    feedback: string;
  };
  startedAt: string;
  chatMessages: LiveStreamMessage[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatar: string;
  bio?: string;
  karmaPoints: number;
  karmaKoins: number;
  itemsFound: number;
  goodDeedsLogged: number;
  tournamentsWon: number;
  totalPurseWinnings: number;
  squadId?: string;
  squadName?: string;
  role: 'host' | 'player' | 'moderator';
  level: number;
  badge: string;
  joinedTournamentIds: string[];
  createdTournamentIds?: string[];
  spiedObjectsCount?: number;
  followingUserIds?: string[];
  followerAdvantages?: {
    bonusKarmaXP: number;
    radarCluesUnlocked: number;
    earlyIntelHits: number;
  };
  preferences?: {
    soundEffects?: boolean;
    notifications?: boolean;
    publicProfile?: boolean;
  };
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  profile: UserProfile;
}

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likes: number;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userHandle: string;
  squadName?: string;
  type: 'item_found' | 'good_deed' | 'live_clip' | 'announcement' | 'photo_challenge_completed';
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  itemTagged?: {
    id: string;
    name: string;
    points: number;
    rarity: ItemRarity;
  };
  goodDeedTagged?: {
    id: string;
    title: string;
    karmaPoints: number;
    multiplier: number;
    tier: string;
  };
  pointsEarned: number;
  karmaEarned: number;
  totalEarnedScore: number;
  likes: number;
  isLiked?: boolean;
  comments: SocialComment[];
  verificationsCount: number;
  isVerifiedByMe?: boolean;
  purseTipAmount: number;
  createdAt: string;
}

export interface LiveStreamMessage {
  id: string;
  userName: string;
  text: string;
  isKarmaDonation?: boolean;
  amount?: number;
  time: string;
}

export interface Squad {
  id: string;
  name: string;
  tag: string;
  avatar: string;
  banner: string;
  membersCount: number;
  totalItemsFound: number;
  totalKarmaPoints: number;
  combinedScore: number;
  teamMultiplier: number;
  rank: number;
}
