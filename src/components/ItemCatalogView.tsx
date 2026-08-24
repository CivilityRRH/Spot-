import React, { useState } from 'react';
import {
  Compass,
  Shuffle,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Layers,
  Flame,
  Award,
  Lock,
  FileQuestion,
  HelpCircle
} from 'lucide-react';
import { ScavengerItem, ItemRarity } from '../types';
import { sounds } from '../utils/audio';

interface ItemCatalogViewProps {
  items: ScavengerItem[];
  onClaimItem: (item: ScavengerItem) => void;
  onRequestCustomItem: () => void;
  onGenerateRandomItems: (count: number) => void;
}

export const ItemCatalogView: React.FC<ItemCatalogViewProps> = ({
  items,
  onClaimItem,
  onRequestCustomItem,
  onGenerateRandomItems
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [filterFoundStatus, setFilterFoundStatus] = useState<'All' | 'Found' | 'Unfound'>('All');
  const [isRandomizing, setIsRandomizing] = useState(false);

  const categories = [
    'All',
    'Household',
    'Urban & Street',
    'Nature & Park',
    'Work & School',
    'Kindness & Community',
    'Food & Drink',
    'Oddities & Fun'
  ];

  const rarities = ['All', 'common', 'uncommon', 'rare', 'legendary', 'mythic'];

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.hint && item.hint.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesRarity = selectedRarity === 'All' || item.rarity === selectedRarity;
    const matchesFound =
      filterFoundStatus === 'All' ||
      (filterFoundStatus === 'Found' && item.isFoundByMe) ||
      (filterFoundStatus === 'Unfound' && !item.isFoundByMe);

    return matchesSearch && matchesCategory && matchesRarity && matchesFound;
  });

  const handleRandomize = (count: number) => {
    setIsRandomizing(true);
    sounds.playItemFound();
    setTimeout(() => {
      onGenerateRandomItems(count);
      setIsRandomizing(false);
      sounds.playKarmaChime();
    }, 400);
  };

  const getRarityBadge = (rarity: ItemRarity) => {
    switch (rarity) {
      case 'common':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      case 'uncommon':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30';
      case 'rare':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-500/30';
      case 'legendary':
        return 'bg-purple-950/80 text-purple-300 border-purple-500/30';
      case 'mythic':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Unlimited Randomizer Control */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] font-extrabold uppercase tracking-wider border border-cyan-500/30">
                Unlimited Item Pool
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {items.length} Total Registered Items
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Everyday Items I-Spy Catalog
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Hunt real-world items in your environment with no limits! Generate infinite randomized challenge sets or request custom tournament items with community permissions.
            </p>
          </div>

          {/* Randomizer & Custom Item Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleRandomize(5)}
              disabled={isRandomizing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition transform hover:scale-[1.02] active:scale-95"
            >
              <Shuffle className={`w-4 h-4 ${isRandomizing ? 'animate-spin' : ''}`} />
              <span>Randomize +5 New Items</span>
            </button>

            <button
              onClick={onRequestCustomItem}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>Request Custom Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, description, hints..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Found Status Filter */}
          <div className="flex items-center gap-1 w-full sm:w-auto">
            {(['All', 'Found', 'Unfound'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterFoundStatus(status)}
                className={`flex-1 sm:flex-none px-3 py-2 rounded-xl text-xs font-bold transition ${
                  filterFoundStatus === status
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`bg-slate-900/90 border rounded-2xl p-4 flex flex-col justify-between shadow-md transition hover:border-slate-600 group ${
              item.isFoundByMe ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${getRarityBadge(
                    item.rarity
                  )}`}
                >
                  {item.rarity}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-black">
                    +{item.basePoints} pts
                  </span>
                  {item.isFoundByMe && (
                    <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400" title="Found by you!">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Category */}
              <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-300 transition">
                {item.name}
              </h3>
              <p className="text-[11px] text-cyan-400/90 font-semibold mb-2">{item.category}</p>

              {/* Description & Hint */}
              <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              {item.hint && (
                <div className="mt-2 p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-amber-300/90">
                  <span className="font-bold text-amber-400">💡 Hint:</span> {item.hint}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                Spotted by {item.foundByCount || 0} hunters
              </span>

              <button
                onClick={() => onClaimItem(item)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  item.isFoundByMe
                    ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 hover:bg-slate-700'
                    : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-sm'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{item.isFoundByMe ? 'Claim Again' : 'Found It!'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Compass className="w-12 h-12 mx-auto text-slate-600" />
          <h4 className="text-base font-bold text-slate-200">No items match your filter</h4>
          <p className="text-xs max-w-sm mx-auto">
            Try adjusting your search keywords, category filter, or click below to randomize new everyday items!
          </p>
          <button
            onClick={() => handleRandomize(5)}
            className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500 transition"
          >
            Randomize +5 New Items
          </button>
        </div>
      )}
    </div>
  );
};
