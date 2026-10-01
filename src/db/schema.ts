import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

// Users Table linked to Firebase Auth UID
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name'),
  handle: text('handle'),
  avatar: text('avatar'),
  bio: text('bio'),
  karmaPoints: integer('karma_points').default(100),
  karmaKoins: integer('karma_koins').default(0),
  itemsFound: integer('items_found').default(0),
  goodDeedsLogged: integer('good_deeds_logged').default(0),
  tournamentsWon: integer('tournaments_won').default(0),
  totalPurseWinnings: integer('total_purse_winnings').default(0),
  squadId: text('squad_id'),
  squadName: text('squad_name'),
  role: text('role').default('player'),
  level: integer('level').default(1),
  badge: text('badge'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tournaments Table
export const tournaments = pgTable('tournaments', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  buyInFee: integer('buy_in_fee').default(0),
  totalPurse: integer('total_purse').default(0),
  playersCount: integer('players_count').default(0),
  squadsCount: integer('squads_count').default(0),
  startTime: text('start_time'),
  endsAt: text('ends_at'),
  status: text('status').default('active'),
  isPrivate: boolean('is_private').default(false),
  inviteCode: text('invite_code'),
  maxPlayers: integer('max_players').default(500),
  creatorId: text('creator_id'),
  creatorName: text('creator_name'),
  sponsorBonus: integer('sponsor_bonus').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Social Posts Table
export const socialPosts = pgTable('social_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar'),
  userHandle: text('user_handle'),
  squadName: text('squad_name'),
  type: text('type').notNull(),
  content: text('content').notNull(),
  mediaUrl: text('media_url'),
  mediaType: text('media_type'),
  pointsEarned: integer('points_earned').default(0),
  karmaEarned: integer('karma_earned').default(0),
  totalEarnedScore: integer('total_earned_score').default(0),
  likes: integer('likes').default(0),
  verificationsCount: integer('verifications_count').default(0),
  purseTipAmount: integer('purse_tip_amount').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Photo Challenges Table
export const photoChallenges = pgTable('photo_challenges', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  sceneCategory: text('scene_category'),
  creatorId: text('creator_id').notNull(),
  creatorName: text('creator_name'),
  creatorAvatar: text('creator_avatar'),
  taggedObjectsJson: text('tagged_objects_json'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Custom Item Requests Table
export const customItemRequests = pgTable('custom_item_requests', {
  id: text('id').primaryKey(),
  itemName: text('item_name').notNull(),
  category: text('category'),
  suggestedPoints: integer('suggested_points').default(100),
  description: text('description'),
  requesterId: text('requester_id').notNull(),
  requesterName: text('requester_name'),
  requesterAvatar: text('requester_avatar'),
  status: text('status').default('pending'),
  maxAllowedFinders: integer('max_allowed_finders').default(10),
  expiresInHours: integer('expires_in_hours').default(48),
  votesUp: integer('votes_up').default(0),
  votesDown: integer('votes_down').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Scavenger Items Table
export const scavengerItems = pgTable('scavenger_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  basePoints: integer('base_points').notNull(),
  rarity: text('rarity').notNull(),
  description: text('description'),
  hint: text('hint'),
  isCustom: boolean('is_custom').default(false),
  createdBy: text('created_by'),
  approvalStatus: text('approval_status').default('approved'),
  foundByCount: integer('found_by_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Squads Table
export const squads = pgTable('squads', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  tag: text('tag').notNull(),
  avatar: text('avatar'),
  banner: text('banner'),
  membersCount: integer('members_count').default(1),
  totalItemsFound: integer('total_items_found').default(0),
  totalKarmaPoints: integer('total_karma_points').default(0),
  combinedScore: integer('combined_score').default(0),
  teamMultiplier: integer('team_multiplier').default(1),
  rank: integer('rank').default(1),
  createdAt: timestamp('created_at').defaultNow(),
});
