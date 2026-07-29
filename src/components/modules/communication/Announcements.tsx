import React, { useState } from 'react';
import { MOCK_CIRCULARS } from '../../../mockData/mockData';
import { FileText, Search, Tag, Paperclip, Calendar, User, Bell } from 'lucide-react';

export const Announcements: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCirculars = MOCK_CIRCULARS.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950/40 to-slate-900 border border-brand-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 text-xs font-bold flex items-center gap-1.5 w-fit mb-2">
            <Bell className="w-3.5 h-3.5 text-brand-400" /> Official Circulars & Announcements
          </span>
          <h1 className="text-2xl font-extrabold text-white">School Notice Board</h1>
          <p className="text-slate-300 text-xs mt-1">Verified broadcasts, academic schedules, events, and transport updates.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Urgent', 'Academic', 'Transport', 'Wellness', 'Event'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.map((circ) => (
          <div key={circ.id} className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 glass-panel space-y-3 hover:border-brand-500/40 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  circ.category === 'Urgent' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  circ.category === 'Academic' ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' :
                  circ.category === 'Transport' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {circ.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" /> {circ.date}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {circ.targetRoles.map((r) => (
                  <span key={r} className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 capitalize">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white">{circ.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{circ.content}</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-400" /> Published by: <strong>{circ.author}</strong>
              </span>

              {circ.attachmentsCount ? (
                <span className="text-brand-400 font-bold flex items-center gap-1">
                  <Paperclip className="w-3.5 h-3.5" /> {circ.attachmentsCount} Attachment(s)
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
