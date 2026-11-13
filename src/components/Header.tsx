import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { ActiveTab } from '../types/gatherings';

interface HeaderProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSafetyCharter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenSafetyCharter,
}) => {
  const navItems: Array<{ id: ActiveTab; label: string }> = [
    { id: 'participant', label: 'Discover' },
    { id: 'map', label: 'Neighbourhood Map' },
    { id: 'host', label: 'Host Desk' },
    { id: 'venue_manager', label: 'Venue Manager' },
  ];

  return (
    <header className="bg-white border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab('participant')}
          className="font-display text-xl font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0 text-left hover:text-emerald-950 transition-colors min-h-[44px] flex items-center"
        >
          Kitsilano Third Place
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`text-base font-medium whitespace-nowrap shrink-0 py-2 border-b-2 transition-colors min-h-[44px] ${
                  isActive
                    ? 'text-[#14532D] border-[#14532D] font-semibold'
                    : 'text-stone-700 border-transparent hover:text-stone-950 hover:border-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onOpenSafetyCharter}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22] transition-colors whitespace-nowrap shrink-0"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Safety Charter</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row (scrollable single-line links) */}
      <nav
        aria-label="Mobile sections"
        className="md:hidden border-t border-stone-200 px-4 flex items-center gap-4 overflow-x-auto"
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`text-sm font-medium whitespace-nowrap shrink-0 py-2.5 border-b-2 min-h-[44px] ${
                isActive
                  ? 'text-[#14532D] border-[#14532D] font-semibold'
                  : 'text-stone-700 border-transparent'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
