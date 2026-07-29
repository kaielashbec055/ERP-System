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
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 border border-blue-200 shadow-md text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-extrabold flex items-center gap-1.5 w-fit mb-2">
            <Bell className="w-3.5 h-3.5 text-white" /> Official Circulars & Announcements
          </span>
          <h1 className="text-2xl font-extrabold">School Notice Board</h1>
          <p className="text-blue-100 text-xs mt-1 font-medium">Verified broadcasts, academic schedules, events, and transport updates.</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/90 text-[#1E293B] placeholder-slate-400 border border-white/40 rounded-2xl text-xs font-medium focus:outline-none focus:bg-white shadow-xs"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {['All', 'Urgent', 'Academic', 'Transport', 'Wellness', 'Event'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#4F7CFF] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Circulars List */}
      <div className="space-y-4">
        {filteredCirculars.map((circ) => (
          <div key={circ.id} className="p-6 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-200/80 shadow-md space-y-3 hover:border-[#4F7CFF]/50 transition-all">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                  circ.category === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                  circ.category === 'Academic' ? 'bg-blue-100 text-[#4F7CFF] border border-blue-200' :
                  circ.category === 'Transport' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                  'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {circ.category}
                </span>
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {circ.date}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {circ.targetRoles.map((r) => (
                  <span key={r} className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 capitalize">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <h3 className="text-base font-extrabold text-[#1E293B]">{circ.title}</h3>
            <p className="text-xs text-slate-600 font-medium leading-relaxed">{circ.content}</p>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#4F7CFF]" /> Published by: <strong className="text-[#1E293B]">{circ.author}</strong>
              </span>

              {circ.attachmentsCount ? (
                <span className="text-[#4F7CFF] font-extrabold flex items-center gap-1">
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
