import { ScavengerItem, GoodDeedAction, Tournament, UserProfile, SocialPost, Squad, CustomItemRequest, PhotoChallenge, UserAccount } from '../types';

export const INITIAL_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr_me',
    email: 'ronniehillsugc@gmail.com',
    password: 'password123',
    profile: {
      id: 'usr_me',
      email: 'ronniehillsugc@gmail.com',
      name: 'Ronnie Hills',
      handle: '@ronnie_scout',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      bio: 'Tournament Champion & Urban Explorer. Always on the lookout for hidden street art and karma opportunities.',
      karmaPoints: 1420,
      itemsFound: 38,
      goodDeedsLogged: 19,
      tournamentsWon: 3,
      totalPurseWinnings: 1850,
      squadId: 'sq_phoenix',
      squadName: 'Phoenix Karma Seekers',
      role: 'player',
      level: 12,
      badge: 'Karma Guardian Champion',
      joinedTournamentIds: ['tourn_grand_spring_2026', 'tourn_private_secret_society'],
      createdTournamentIds: ['tourn_private_secret_society'],
      spiedObjectsCount: 24,
      followingUserIds: ['usr_maya'],
      followerAdvantages: {
        bonusKarmaXP: 180,
        radarCluesUnlocked: 12,
        earlyIntelHits: 8
      }
    }
  },
  {
    id: 'usr_maya',
    email: 'maya.lin@karmaspy.io',
    password: 'password123',
    profile: {
      id: 'usr_maya',
      email: 'maya.lin@karmaspy.io',
      name: 'Maya Lin',
      handle: '@mayahunts',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      bio: 'Eagle-eyed photographer & eco-cleanup enthusiast. Spotting vintage oddities worldwide.',
      karmaPoints: 1720,
      itemsFound: 41,
      goodDeedsLogged: 22,
      tournamentsWon: 2,
      totalPurseWinnings: 1200,
      squadId: 'sq_urban_echo',
      squadName: 'Urban Echo Nomads',
      role: 'player',
      level: 11,
      badge: 'Eagle Eye Karma Spy',
      joinedTournamentIds: ['tourn_grand_spring_2026', 'tourn_eco_sprint'],
      createdTournamentIds: ['tourn_eco_sprint'],
      spiedObjectsCount: 31
    }
  },
  {
    id: 'usr_marcus',
    email: 'marcus.cole@karmaspy.io',
    password: 'password123',
    profile: {
      id: 'usr_marcus',
      email: 'marcus.cole@karmaspy.io',
      name: 'Marcus Cole',
      handle: '@marcus_clean',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      bio: 'Community Aid Leader. Believe in high karma multipliers and fair play scavenger hunts.',
      karmaPoints: 2100,
      itemsFound: 28,
      goodDeedsLogged: 29,
      tournamentsWon: 4,
      totalPurseWinnings: 2400,
      squadId: 'sq_green_pulse',
      squadName: 'Green Pulse Crusaders',
      role: 'host',
      level: 14,
      badge: 'Karma Deed Hero',
      joinedTournamentIds: ['tourn_grand_spring_2026'],
      createdTournamentIds: ['tourn_grand_spring_2026'],
      spiedObjectsCount: 19
    }
  }
];

export const CURRENT_USER: UserProfile = INITIAL_ACCOUNTS[0].profile;

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tourn_grand_spring_2026',
    title: 'Metro Scavenger Grand Purse & Karma Derby',
    description: 'The premier open-world Pokémon-GO style I-Spy scavenger tournament! Hunt for iconic artifacts across town while broadcasting good deeds live to the world to climb the global leaderboard.',
    townOrCity: 'Austin, TX (Downtown & Lady Bird Lake)',
    regionCoordinates: { lat: 30.2672, lng: -97.7431 },
    huntCategory: 'Urban Exploration',
    specificHuntItems: [
      'Art Deco Iron Mailbox',
      'Hand-Painted Bat Mural',
      'Solar-Powered Public Bench',
      'Vintage Turquoise Food Truck',
      'Cast-Iron Fire Hydrant on 6th St'
    ],
    specificGoodDeeds: [
      'Collect 5+ items of lake/park litter into recycling bins',
      'Return 3 abandoned shopping carts to designated corral',
      'Water wilting public planter boxes or community flower beds',
      'Help a neighbor or visitor carry heavy groceries/bags'
    ],
    buyInFee: 25,
    totalPurse: 5400,
    playersCount: 216,
    squadsCount: 18,
    startTime: '2026-08-20T00:00:00Z',
    endsAt: '2026-08-26T23:59:59Z',
    status: 'active',
    isPrivate: false,
    maxPlayers: 500,
    creatorId: 'usr_marcus',
    creatorName: 'Marcus Cole (Host)',
    sponsorBonus: 1000,
    activeSpectatorCount: 1420,
    isLiveBroadcasting: true,
    rules: [
      'Every player hunts for themselves, but team members amplify collective karma boosts.',
      'Gemini Vision AI live scans camera and video frames to score items & verify good deeds in real time.',
      'Good deed multiplier scales with community verification votes and authenticity score.',
      'Anyone can watch live broadcasts like a game show on TV, tipping and cheering for positive acts.',
      'Top 3 winners take 90% of the jackpot purse; 10% awarded to the Ultimate Karma Deed Champion.'
    ],
    prizeSplit: {
      firstPlace: 2700, // 50%
      secondPlace: 1350, // 25%
      thirdPlace: 810, // 15%
      topKarmaDeedHero: 540, // 10%
      topSquadPurse: 500
    },
    joinedPlayerIds: ['usr_me', 'usr_maya', 'usr_marcus', 'usr_dexter'],
    challengesCount: 3
  },
  {
    id: 'tourn_eco_sprint',
    title: 'Seattle Waterfront Eco-Spy & Community Cleanup Blitz',
    description: '48-Hour rapid sprint focused on finding Pacific Northwest coastal treasures while picking up beach litter and helping local elder neighbors.',
    townOrCity: 'Seattle, WA (Pike Place & Elliott Bay)',
    regionCoordinates: { lat: 47.6062, lng: -122.3321 },
    huntCategory: 'Eco Cleanup',
    specificHuntItems: [
      'Brass Nautical Compass Rose on Boardwalk',
      'Vintage Copper Weather Vane',
      'Hand-Carved Wooden Cedar Totem Motif',
      'Cobblestone Alley Streetlamp'
    ],
    specificGoodDeeds: [
      'Collect beach plastic or ocean debris along the shore',
      'Pay-it-forward coffee or treat for someone in line',
      'Volunteer at or donate items to local neighborhood food pantry'
    ],
    buyInFee: 10,
    totalPurse: 1800,
    playersCount: 180,
    squadsCount: 15,
    startTime: '2026-08-25T12:00:00Z',
    endsAt: '2026-08-27T18:00:00Z',
    status: 'upcoming',
    isPrivate: false,
    maxPlayers: 300,
    creatorId: 'usr_maya',
    creatorName: 'Maya Lin',
    sponsorBonus: 500,
    activeSpectatorCount: 840,
    isLiveBroadcasting: false,
    rules: [
      'Eco-actions grant 2.5x multiplier on any item discovered within 15 minutes of logging the deed.',
      'Gemini Vision checks before/after snapshots of cleanups for instant verification.'
    ],
    prizeSplit: {
      firstPlace: 900,
      secondPlace: 450,
      thirdPlace: 270,
      topKarmaDeedHero: 180,
      topSquadPurse: 200
    },
    joinedPlayerIds: ['usr_maya', 'usr_elena'],
    challengesCount: 2
  },
  {
    id: 'tourn_monthly_contenders_sep_2026',
    title: 'SpotQuest World Contenders Championship (Global Cities)',
    description: 'The premier worldwide live-streamed championship. Millions watch live as top contenders roam cities across the globe finding legendary artifacts and performing life-changing community deeds.',
    townOrCity: 'Global Metro (New York, Tokyo, London, Paris)',
    regionCoordinates: { lat: 40.7128, lng: -74.0060 },
    huntCategory: 'Community Kindness',
    specificHuntItems: [
      'Historic Cast-Iron Street Clock',
      'Origami Crane Left on Public Bench',
      'Artisan Mosaic Tile on Subway Wall',
      'Gilded Library Bookplate',
      'Vintage Rotary Phone in Indie Cafe'
    ],
    specificGoodDeeds: [
      'Organize a 5-person community park cleanup crew',
      'Verified blood donation or shelter pet support shift',
      'Teach a free skill or assist 3 strangers with transportation/luggage'
    ],
    buyInFee: 0,
    totalPurse: 10000,
    playersCount: 28,
    squadsCount: 10,
    startTime: '2026-09-01T00:00:00Z',
    endsAt: '2026-09-30T23:59:59Z',
    status: 'active',
    isPrivate: true,
    inviteCode: 'CONTENDER2026',
    maxPlayers: 50,
    creatorId: 'sys_spotquest',
    creatorName: 'SpotQuest Championship League',
    sponsorBonus: 3500,
    activeSpectatorCount: 5280,
    isLiveBroadcasting: true,
    rules: [
      'Invitational access restricted to scouts with 1+ Tournament Wins or 1,000+ Karma Points.',
      'Live stream broadcast mode active 24/7 with real-time Gemini Vision referee scoring.',
      'Top 3 Contenders share $8,000; Ultimate Karma Hero receives $2,000 bonus.',
      'Spectator chat votes and cheer reactions trigger instantaneous multiplier boosts.'
    ],
    prizeSplit: {
      firstPlace: 5000,
      secondPlace: 2500,
      thirdPlace: 1500,
      topKarmaDeedHero: 1000,
      topSquadPurse: 1000
    },
    joinedPlayerIds: ['usr_me', 'usr_maya', 'usr_marcus'],
    challengesCount: 6
  },
  {
    id: 'tourn_private_secret_society',
    title: 'Savannah Historic District: Antique Relics & Community Care',
    description: 'Explore shaded historic squares and moss-draped avenues to uncover secret architectural oddities while helping local historic preservation and community gardens.',
    townOrCity: 'Savannah, GA (Historic Squares)',
    regionCoordinates: { lat: 32.0809, lng: -81.0912 },
    huntCategory: 'Historic Town',
    specificHuntItems: [
      'Wrought Iron Gate with Fleur-de-Lis Emblem',
      'Cobblestone Ballast Stone from 18th Century',
      'Victorian Sundial in Shaded Courtyard',
      'Brass Door Knocker shaped like a Lion'
    ],
    specificGoodDeeds: [
      'Sweep fallen leaves / debris off historic brick walkways',
      'Offer directions and friendly town history guidance to visitors',
      'Plant native wildflower seeds in approved community garden beds'
    ],
    buyInFee: 50,
    totalPurse: 3250,
    playersCount: 45,
    squadsCount: 6,
    startTime: '2026-08-22T08:00:00Z',
    endsAt: '2026-08-29T23:59:59Z',
    status: 'active',
    isPrivate: true,
    inviteCode: 'VAULT-779',
    maxPlayers: 50,
    creatorId: 'usr_me',
    creatorName: 'Ronnie Hills (Host)',
    sponsorBonus: 1000,
    activeSpectatorCount: 620,
    isLiveBroadcasting: true,
    rules: [
      'Private invite code required to join.',
      'Live camera scanning required for verification of all historic targets.',
      '10% of total purse donated to local Savannah community heritage foundation.'
    ],
    prizeSplit: {
      firstPlace: 1625,
      secondPlace: 812,
      thirdPlace: 488,
      topKarmaDeedHero: 325,
      topSquadPurse: 300
    },
    joinedPlayerIds: ['usr_me', 'usr_dexter', 'usr_sarah'],
    challengesCount: 2
  }
];

export const INITIAL_PHOTO_CHALLENGES: PhotoChallenge[] = [
  {
    id: 'challenge_antique_desk',
    tournamentId: 'tourn_grand_spring_2026',
    title: 'The Antiquarian\'s Study: Vintage Relics',
    description: 'Examine this crowded collector\'s desk! Spy the hidden vintage clock, brass magnifying loupe, and classic quill pen.',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&auto=format&fit=crop&q=80',
    sceneCategory: 'Vintage Desk',
    creatorId: 'usr_marcus',
    creatorName: 'Marcus Cole',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    createdAt: '2 hours ago',
    completedByUserIds: ['usr_maya'],
    foundObjectsByUser: {
      usr_me: ['obj_desk_1'],
      usr_maya: ['obj_desk_1', 'obj_desk_2', 'obj_desk_3', 'obj_desk_4']
    },
    taggedObjects: [
      {
        id: 'obj_desk_1',
        name: 'Glowing Laptop Screen with Code',
        x: 48.5,
        y: 42.0,
        radius: 8.5,
        points: 40,
        hint: 'Directly in the central focal point emitting light.',
        category: 'Technology',
        rarity: 'common'
      },
      {
        id: 'obj_desk_2',
        name: 'Yellow Sticky Note Reminder',
        x: 28.0,
        y: 65.0,
        radius: 6.5,
        points: 65,
        hint: 'Look to the bottom-left beside the notebook edge.',
        category: 'Work & School',
        rarity: 'uncommon'
      },
      {
        id: 'obj_desk_3',
        name: 'Ceramic Espresso Mug with Steam',
        x: 76.5,
        y: 54.0,
        radius: 7.0,
        points: 75,
        hint: 'On the right side near the desk lamp glow.',
        category: 'Household',
        rarity: 'rare'
      },
      {
        id: 'obj_desk_4',
        name: 'Small Succulent in White Pot',
        x: 18.2,
        y: 35.5,
        radius: 6.0,
        points: 90,
        hint: 'Top-left corner bringing natural greenery.',
        category: 'Nature & Park',
        rarity: 'rare',
        karmaBonus: 25
      }
    ]
  },
  {
    id: 'challenge_artisan_market',
    tournamentId: 'tourn_grand_spring_2026',
    title: 'Old Town Artisan Cafe & Street Corner',
    description: 'Can you spot the hidden items in this vibrant market scene? Look for the red bicycle bell, chalkboard menu, and blooming lavender bouquet.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    sceneCategory: 'Market & Cafe',
    creatorId: 'usr_me',
    creatorName: 'Ronnie Hills',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    createdAt: '5 hours ago',
    completedByUserIds: [],
    foundObjectsByUser: {
      usr_me: ['obj_cafe_1']
    },
    taggedObjects: [
      {
        id: 'obj_cafe_1',
        name: 'Hanging Edison Filament Bulb',
        x: 32.5,
        y: 22.0,
        radius: 7.0,
        points: 50,
        hint: 'Suspended from the ceiling wooden beam.',
        category: 'Household',
        rarity: 'common'
      },
      {
        id: 'obj_cafe_2',
        name: 'Vintage Espresso Grinder Hopper',
        x: 62.0,
        y: 44.5,
        radius: 7.5,
        points: 85,
        hint: 'Behind the polished counter behind the barista station.',
        category: 'Food & Drink',
        rarity: 'rare'
      },
      {
        id: 'obj_cafe_3',
        name: 'Hand-painted "Free Kindness Notes" Box',
        x: 82.0,
        y: 72.0,
        radius: 7.0,
        points: 120,
        hint: 'Resting on the lower display tier near the patron table.',
        category: 'Kindness & Community',
        rarity: 'legendary',
        karmaBonus: 50
      }
    ]
  },
  {
    id: 'challenge_botanical_sanctuary',
    tournamentId: 'tourn_eco_sprint',
    title: 'Secret Greenhouse & Botanical Discovery',
    description: 'Spot the delicate greenhouse details! Find the copper watering can, hanging glass terrarium, and hidden hummingbird figurine.',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&auto=format&fit=crop&q=80',
    sceneCategory: 'Nature Park',
    creatorId: 'usr_maya',
    creatorName: 'Maya Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    createdAt: '1 day ago',
    completedByUserIds: ['usr_me'],
    foundObjectsByUser: {
      usr_me: ['obj_green_1', 'obj_green_2', 'obj_green_3']
    },
    taggedObjects: [
      {
        id: 'obj_green_1',
        name: 'Hanging Fern in Macrame Basket',
        x: 25.0,
        y: 28.0,
        radius: 8.0,
        points: 45,
        hint: 'Hanging gracefully near the upper glass sunbeam.',
        category: 'Nature & Park',
        rarity: 'common'
      },
      {
        id: 'obj_green_2',
        name: 'Vintage Copper Spout Watering Can',
        x: 68.0,
        y: 68.0,
        radius: 7.5,
        points: 95,
        hint: 'On the stone potting shelf beside the terra cotta pots.',
        category: 'Household',
        rarity: 'rare'
      },
      {
        id: 'obj_green_3',
        name: 'Miniature Wooden Birdhouse Feeder',
        x: 48.0,
        y: 52.0,
        radius: 6.5,
        points: 130,
        hint: 'Tucked inside the dense monstera foliage.',
        category: 'Kindness & Community',
        rarity: 'legendary',
        karmaBonus: 40
      }
    ]
  }
];

export const PRESET_SCENE_TEMPLATES = [
  {
    title: 'Vintage Antique Shop & Curio Cabinet',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
    category: 'Vintage Desk' as const,
    description: 'Packed with mechanical clocks, books, figurines, and brass instruments.'
  },
  {
    title: 'Bustling Street Market & Cafe Sidewalk',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    category: 'Market & Cafe' as const,
    description: 'Filled with signs, bikes, cups, lanterns, and street art.'
  },
  {
    title: 'Enchanted Greenhouse & Botanical Garden',
    url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&auto=format&fit=crop&q=80',
    category: 'Nature Park' as const,
    description: 'Lush plants, watering cans, pots, hidden garden statues, and insects.'
  },
  {
    title: 'Cozy Artist Loft & Workstation',
    url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&auto=format&fit=crop&q=80',
    category: 'Cozy Room' as const,
    description: 'Paintbrushes, canvas easels, mugs, lamps, and sketchbooks.'
  },
  {
    title: 'Urban City Plaza & Fountain Square',
    url: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1200&auto=format&fit=crop&q=80',
    category: 'Urban Street' as const,
    description: 'Benches, pigeons, street lights, umbrellas, and distant monuments.'
  }
];

export const GOOD_DEEDS_CATALOG: GoodDeedAction[] = [
  {
    id: 'deed_pickup_litter',
    title: 'Street / Park Litter Cleanup (5+ Items)',
    category: 'eco_cleanup',
    baseKarmaPoints: 120,
    multiplierBoost: 1.35,
    tier: 'Bronze',
    description: 'Collect recyclable bottles, plastic waste, or debris from public areas and deposit in proper bins.',
    verificationRequirement: 'Short video showing before/after or disposal.'
  },
  {
    id: 'deed_return_stray_cart',
    title: 'Return Abandoned Shopping Carts',
    category: 'community_aid',
    baseKarmaPoints: 80,
    multiplierBoost: 1.25,
    tier: 'Bronze',
    description: 'Safely wheel stray parking lot carts back into the designated corral.',
    verificationRequirement: 'Photo or live video of returning 2+ carts.'
  },
  {
    id: 'deed_help_stranger_carry',
    title: 'Assist Stranger with Heavy Groceries / Luggage',
    category: 'helping_hand',
    baseKarmaPoints: 200,
    multiplierBoost: 1.5,
    tier: 'Silver',
    description: 'Help an elderly person, parent with stroller, or traveler carry packages across stairs or streets.',
    verificationRequirement: 'Live clip or friendly gesture acknowledgment.'
  },
  {
    id: 'deed_feed_stray_animal',
    title: 'Feed or Water Community / Stray Animals',
    category: 'animal_welfare',
    baseKarmaPoints: 180,
    multiplierBoost: 1.45,
    tier: 'Silver',
    description: 'Provide clean water or pet-friendly food to thirsty community pets or local shelter drop.',
    verificationRequirement: 'Photo of the clean bowl / meal.'
  },
  {
    id: 'deed_pay_it_forward',
    title: 'Pay-It-Forward (Coffee / Bus Fare / Meal)',
    category: 'kindness_boost',
    baseKarmaPoints: 350,
    multiplierBoost: 1.8,
    tier: 'Gold',
    description: 'Buy a stranger behind you their drink, pay someone’s metro fare, or gift a lunch.',
    verificationRequirement: 'Receipt / Barista thumbs up.'
  },
  {
    id: 'deed_plant_or_water_tree',
    title: 'Water Drought-Stricken Public Plants or Plant Seedlings',
    category: 'eco_cleanup',
    baseKarmaPoints: 220,
    multiplierBoost: 1.55,
    tier: 'Silver',
    description: 'Care for wilting public planter boxes, neighborhood greenery, or guerrilla gardening.',
    verificationRequirement: 'Video watering / planting proof.'
  },
  {
    id: 'deed_neighborhood_mentorship',
    title: 'Teach a Skill or Free Community Tutoring',
    category: 'mentorship',
    baseKarmaPoints: 500,
    multiplierBoost: 2.2,
    tier: 'Diamond',
    description: 'Spend at least 30 minutes sharing knowledge, fixing a neighbor’s bike, or tutoring.',
    verificationRequirement: 'Short testimonial or live session broadcast.'
  },
  {
    id: 'deed_blood_donation_drop',
    title: 'Verified Blood or Pantry Food Bank Donation',
    category: 'community_aid',
    baseKarmaPoints: 650,
    multiplierBoost: 2.5,
    tier: 'Diamond',
    description: 'Donate at a local Red Cross center or deliver a box of non-perishables to a local pantry.',
    verificationRequirement: 'Badge / Donation sticker proof.'
  }
];

export const INITIAL_EVERYDAY_ITEMS: ScavengerItem[] = [
  {
    id: 'item_1',
    name: 'Yellow Fire Hydrant',
    category: 'Urban & Street',
    basePoints: 35,
    rarity: 'common',
    description: 'A classic municipal yellow fire hydrant along a sidewalk or intersection.',
    hint: 'Check street corners near school zones or parks.',
    foundByCount: 84,
    isFoundByMe: true
  },
  {
    id: 'item_2',
    name: 'Vintage Bicycle with Wicker Basket',
    category: 'Urban & Street',
    basePoints: 95,
    rarity: 'rare',
    description: 'A retro cruiser or road bike sporting a front woven wicker basket.',
    hint: 'Frequently spotted near artisan bakeries and college campuses.',
    foundByCount: 22,
    isFoundByMe: false
  },
  {
    id: 'item_3',
    name: 'Spotted Dalmation or Two Poodles Walking Together',
    category: 'Nature & Park',
    basePoints: 110,
    rarity: 'rare',
    description: 'Canine buddies on an afternoon stroll.',
    hint: 'Dog parks between 4 PM - 7 PM.',
    foundByCount: 16,
    isFoundByMe: false
  },
  {
    id: 'item_4',
    name: 'Steaming Red Coffee Mug on a Wooden Table',
    category: 'Household',
    basePoints: 25,
    rarity: 'common',
    description: 'A ceramic red mug showing visible steam rising.',
    hint: 'Kitchen counters or cozy local coffee shops.',
    foundByCount: 142,
    isFoundByMe: true
  },
  {
    id: 'item_5',
    name: 'Origami Crane Left on Public Bench',
    category: 'Kindness & Community',
    basePoints: 175,
    rarity: 'legendary',
    description: 'A folded paper crane left behind for good fortune and peace.',
    hint: 'Look on transit benches, library tables, or community boards.',
    foundByCount: 7,
    isFoundByMe: false
  },
  {
    id: 'item_6',
    name: 'Antique Typewriter or Rotary Phone',
    category: 'Oddities & Fun',
    basePoints: 240,
    rarity: 'mythic',
    description: 'A mechanical typing machine or rotary dial telephone still functioning.',
    hint: 'Antique thrift stores, quirky hotel lobbies, or indie bookstores.',
    foundByCount: 4,
    isFoundByMe: false
  },
  {
    id: 'item_7',
    name: 'Neon Open Sign in Rainy Window',
    category: 'Urban & Street',
    basePoints: 50,
    rarity: 'uncommon',
    description: 'A vibrant glowing neon OPEN sign reflecting against glass.',
    hint: 'Diners, barber shops, or midnight bodegas.',
    foundByCount: 65,
    isFoundByMe: true
  },
  {
    id: 'item_8',
    name: 'Three-Leaf Clover with a Ladybug',
    category: 'Nature & Park',
    basePoints: 150,
    rarity: 'legendary',
    description: 'A lush green clover with a tiny spotted ladybug resting on the petal.',
    hint: 'Botanical gardens, lawn patches after morning mist.',
    foundByCount: 9,
    isFoundByMe: false
  },
  {
    id: 'item_9',
    name: 'Mechanical Pocket Watch or Hourglass',
    category: 'Household',
    basePoints: 85,
    rarity: 'rare',
    description: 'An old-school ticking pocket timepiece with brass chain or sand hourglass.',
    hint: 'Study desks, watch repair displays, or vintage markets.',
    foundByCount: 29,
    isFoundByMe: false
  },
  {
    id: 'item_10',
    name: 'Street Musician Playing Saxophone or Cello',
    category: 'Kindness & Community',
    basePoints: 120,
    rarity: 'uncommon',
    description: 'A busker filling the street air with live acoustic melodies.',
    hint: 'Subway plazas, downtown walking streets.',
    foundByCount: 41,
    isFoundByMe: false
  },
  {
    id: 'item_11',
    name: 'Heart-Shaped Rock or Fallen Leaf',
    category: 'Nature & Park',
    basePoints: 60,
    rarity: 'uncommon',
    description: 'Naturally formed heart silhouette in stone or autumn leaf.',
    hint: 'River gravel beds, hiking trails, under oak trees.',
    foundByCount: 53,
    isFoundByMe: false
  },
  {
    id: 'item_12',
    name: 'Handmade "Free Books / Little Library" Box',
    category: 'Kindness & Community',
    basePoints: 70,
    rarity: 'uncommon',
    description: 'A roadside wooden birdhouse-style free book exchange kiosk.',
    hint: 'Residential neighborhood front yards.',
    foundByCount: 88,
    isFoundByMe: true
  },
  {
    id: 'item_13',
    name: 'Classic 1970s Muscle Car in Mint Condition',
    category: 'Urban & Street',
    basePoints: 130,
    rarity: 'rare',
    description: 'A glossy vintage Mustang, Camaro, or Challenger parked on street.',
    hint: 'Weekend car meets or sunny boulevard drives.',
    foundByCount: 19,
    isFoundByMe: false
  },
  {
    id: 'item_14',
    name: 'Chalk Art Mural on Public Sidewalk',
    category: 'Oddities & Fun',
    basePoints: 45,
    rarity: 'common',
    description: 'Colorful chalk drawing or hopscotch grid drawn by kids or local artists.',
    hint: 'Elementary school sidewalks, plaza walking paths.',
    foundByCount: 97,
    isFoundByMe: true
  },
  {
    id: 'item_15',
    name: 'Barista Latte Art with a Swan or Rosetta',
    category: 'Food & Drink',
    basePoints: 40,
    rarity: 'common',
    description: 'Steamed micro-foam poured with precise swan or tulip leaf pattern.',
    hint: 'Specialty espresso cafes.',
    foundByCount: 120,
    isFoundByMe: true
  },
  {
    id: 'item_16',
    name: 'Double Rainbow in the Sky',
    category: 'Nature & Park',
    basePoints: 300,
    rarity: 'mythic',
    description: 'Two full distinct concentric rainbow arcs breaking through storm clouds.',
    hint: 'Late afternoon sun shower clearing skies.',
    foundByCount: 2,
    isFoundByMe: false
  }
];

export const INITIAL_CUSTOM_REQUESTS: CustomItemRequest[] = [
  {
    id: 'req_1',
    itemName: 'Someone Wearing Mismatched Colorful Funky Socks',
    category: 'Oddities & Fun',
    suggestedPoints: 65,
    description: 'Spot someone rocking two completely different bright socks in public!',
    requesterId: 'usr_sarah',
    requesterName: 'Sarah Jenkins',
    requesterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    status: 'approved',
    maxAllowedFinders: 25,
    expiresInHours: 36,
    votesUp: 42,
    votesDown: 3,
    userVoted: 'up',
    createdAt: '2026-08-23T14:30:00Z',
    adminNotes: 'Verified community fun challenge. Point cap approved at 65pts.'
  },
  {
    id: 'req_2',
    itemName: 'Public Trash Bin Cleaned & Decorated with Smiley Sticker',
    category: 'Kindness & Community',
    suggestedPoints: 110,
    description: 'Find a public trash can where someone added an uplifting note or sanitized the handle.',
    requesterId: 'usr_marcus',
    requesterName: 'Marcus Cole',
    requesterAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'approved',
    maxAllowedFinders: 15,
    expiresInHours: 48,
    votesUp: 56,
    votesDown: 1,
    userVoted: 'up',
    createdAt: '2026-08-23T16:00:00Z',
    adminNotes: 'Promotes hygiene & good karma vibe.'
  },
  {
    id: 'req_3',
    itemName: 'Rare Blue Butterfly Resting on Sunflower',
    category: 'Nature & Park',
    suggestedPoints: 180,
    description: 'Capture a vibrant blue morpho or swallowtail on a blooming sunflower.',
    requesterId: 'usr_elena',
    requesterName: 'Elena Rostova',
    requesterAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    status: 'pending',
    maxAllowedFinders: 10,
    expiresInHours: 24,
    votesUp: 28,
    votesDown: 4,
    createdAt: '2026-08-23T17:15:00Z'
  }
];

export const INITIAL_SQUADS: Squad[] = [
  {
    id: 'sq_phoenix',
    name: 'Phoenix Karma Seekers',
    tag: 'PHNX',
    avatar: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    membersCount: 12,
    totalItemsFound: 248,
    totalKarmaPoints: 8940,
    combinedScore: 14650,
    teamMultiplier: 1.45,
    rank: 1
  },
  {
    id: 'sq_urban_echo',
    name: 'Urban Echo Nomads',
    tag: 'ECHO',
    avatar: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    membersCount: 14,
    totalItemsFound: 215,
    totalKarmaPoints: 7620,
    combinedScore: 12890,
    teamMultiplier: 1.35,
    rank: 2
  },
  {
    id: 'sq_green_pulse',
    name: 'Green Pulse Crusaders',
    tag: 'PULS',
    avatar: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80',
    membersCount: 10,
    totalItemsFound: 190,
    totalKarmaPoints: 8100,
    combinedScore: 11950,
    teamMultiplier: 1.40,
    rank: 3
  }
];

export const INITIAL_LEADERBOARD = [
  {
    rank: 1,
    user: CURRENT_USER,
    itemScore: 2150,
    karmaScore: 1840,
    teamMultiplier: 1.45,
    totalPoints: 5785,
    potentialPursePayout: 2700,
    isMe: true
  },
  {
    rank: 2,
    user: {
      id: 'usr_maya',
      name: 'Maya Lin',
      handle: '@mayahunts',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      karmaPoints: 1720,
      itemsFound: 41,
      goodDeedsLogged: 22,
      tournamentsWon: 2,
      totalPurseWinnings: 1200,
      squadId: 'sq_urban_echo',
      squadName: 'Urban Echo Nomads',
      role: 'player' as const,
      level: 11,
      badge: 'Eagle Eye Karma Spy'
    },
    itemScore: 2020,
    karmaScore: 1720,
    teamMultiplier: 1.35,
    totalPoints: 5049,
    potentialPursePayout: 1350,
    isMe: false
  },
  {
    rank: 3,
    user: {
      id: 'usr_marcus',
      name: 'Marcus Cole',
      handle: '@marcus_clean',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      karmaPoints: 2100,
      itemsFound: 28,
      goodDeedsLogged: 29,
      tournamentsWon: 4,
      totalPurseWinnings: 2400,
      squadId: 'sq_green_pulse',
      squadName: 'Green Pulse Crusaders',
      role: 'player' as const,
      level: 14,
      badge: 'Karma Deed Hero'
    },
    itemScore: 1450,
    karmaScore: 2100,
    teamMultiplier: 1.40,
    totalPoints: 4970,
    potentialPursePayout: 810,
    isMe: false
  },
  {
    rank: 4,
    user: {
      id: 'usr_dexter',
      name: 'Dexter Vance',
      handle: '@dex_seeker',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      karmaPoints: 1150,
      itemsFound: 36,
      goodDeedsLogged: 14,
      tournamentsWon: 1,
      totalPurseWinnings: 650,
      squadId: 'sq_phoenix',
      squadName: 'Phoenix Karma Seekers',
      role: 'player' as const,
      level: 9,
      badge: 'Speed Spy'
    },
    itemScore: 1980,
    karmaScore: 1150,
    teamMultiplier: 1.45,
    totalPoints: 4538,
    potentialPursePayout: 0,
    isMe: false
  }
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post_1',
    userId: 'usr_me',
    userName: 'Ronnie Hills',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    userHandle: '@ronnie_scout',
    squadName: 'Phoenix Karma Seekers',
    type: 'good_deed',
    content: 'Just cleaned up the whole North Meadow playground while hunting for the Vintage Bicycle! Picked up 12 crushed aluminum cans and 3 plastic jugs. Karma boost activated! 🌿✨',
    mediaUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    goodDeedTagged: {
      id: 'deed_pickup_litter',
      title: 'Street / Park Litter Cleanup',
      karmaPoints: 120,
      multiplier: 1.35,
      tier: 'Bronze'
    },
    pointsEarned: 0,
    karmaEarned: 120,
    totalEarnedScore: 162,
    likes: 38,
    isLiked: true,
    verificationsCount: 14,
    isVerifiedByMe: true,
    purseTipAmount: 15,
    createdAt: '15 minutes ago',
    comments: [
      {
        id: 'c_1',
        userId: 'usr_maya',
        userName: 'Maya Lin',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        text: 'Awesome job Ronnie! Clean parks make the scavenger hunt so much better for everyone.',
        createdAt: '10m ago',
        likes: 4
      },
      {
        id: 'c_2',
        userId: 'usr_marcus',
        userName: 'Marcus Cole',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'Verified! Adding +10 community bonus points. Keep that multiplier hot!',
        createdAt: '7m ago',
        likes: 2
      }
    ]
  },
  {
    id: 'post_2',
    userId: 'usr_maya',
    userName: 'Maya Lin',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    userHandle: '@mayahunts',
    squadName: 'Urban Echo Nomads',
    type: 'item_found',
    content: 'SPOTTED! 🔍 Found the Origami Crane sitting peacefully on the third bench outside the Central Library! Plus gave a cold water bottle to the gardener working outside.',
    mediaUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    itemTagged: {
      id: 'item_5',
      name: 'Origami Crane Left on Public Bench',
      points: 175,
      rarity: 'legendary'
    },
    goodDeedTagged: {
      id: 'deed_help_stranger_carry',
      title: 'Water for Public Grounds Worker',
      karmaPoints: 150,
      multiplier: 1.5,
      tier: 'Silver'
    },
    pointsEarned: 175,
    karmaEarned: 150,
    totalEarnedScore: 487,
    likes: 64,
    isLiked: false,
    verificationsCount: 21,
    isVerifiedByMe: true,
    purseTipAmount: 25,
    createdAt: '42 minutes ago',
    comments: [
      {
        id: 'c_3',
        userId: 'usr_dexter',
        userName: 'Dexter Vance',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        text: 'That legendary find just pushed you into 2nd place on the purse board! Insane!',
        createdAt: '30m ago',
        likes: 5
      }
    ]
  },
  {
    id: 'post_3',
    userId: 'usr_marcus',
    userName: 'Marcus Cole',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    userHandle: '@marcus_clean',
    squadName: 'Green Pulse Crusaders',
    type: 'live_clip',
    content: '🔴 Recorded Live Stream: Completed a 45-minute neighborhood cart return & assisted 3 elderly shoppers with heavy bags at SuperMarket East. Watch the full live replay!',
    mediaUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    goodDeedTagged: {
      id: 'deed_return_stray_cart',
      title: 'Mega Cart Corral Blitz & Shopper Assist',
      karmaPoints: 450,
      multiplier: 2.0,
      tier: 'Diamond'
    },
    pointsEarned: 0,
    karmaEarned: 450,
    totalEarnedScore: 900,
    likes: 112,
    isLiked: true,
    verificationsCount: 45,
    isVerifiedByMe: false,
    purseTipAmount: 50,
    createdAt: '2 hours ago',
    comments: [
      {
        id: 'c_4',
        userId: 'usr_me',
        userName: 'Ronnie Hills',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        text: 'This is the true spirit of KarmaSpy! 100% verified hero deed!',
        createdAt: '1h ago',
        likes: 12
      }
    ]
  }
];

export const LIVE_STREAMS_ACTIVE = [
  {
    id: 'stream_1',
    user: {
      name: 'Maya Lin',
      handle: '@mayahunts',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
    },
    title: '🔴 LIVE: Searching for the Antique Typewriter in Old Town!',
    itemLookingFor: 'Antique Typewriter (240 pts)',
    viewers: 148,
    karmaCheer: 620,
    thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=600&auto=format&fit=crop&q=80',
    isLive: true
  },
  {
    id: 'stream_2',
    user: {
      name: 'Samir Patel',
      handle: '@samir_scout',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    },
    title: '🔴 LIVE: River Walk Trash Pick & Double Rainbow Hunt',
    itemLookingFor: 'Double Rainbow & Eco Cleanup',
    viewers: 94,
    karmaCheer: 410,
    thumbnail: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=80',
    isLive: true
  }
];
