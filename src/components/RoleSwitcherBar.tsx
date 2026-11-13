import React from 'react';
import { RotateCcw } from 'lucide-react';
import { DemoRole } from '../types/gatherings';

interface RoleSwitcherBarProps {
  activeRole: DemoRole;
  onSwitchRole: (role: DemoRole) => void;
  onResetDemo: () => void;
  neighbourhoodName: string;
  cityName: string;
  radiusKm: number;
}

const ROLE_OPTIONS: Array<{
  id: DemoRole;
  label: string;
  summary: string;
}> = [
  {
    id: 'participant',
    label: 'Participant',
    summary: 'Browse nearby gatherings, inspect the district map, and RSVP to dated sessions.',
  },
  {
    id: 'host',
    label: 'Host',
    summary: 'Choose an open venue slot, submit a gathering proposal, and publish once approved.',
  },
  {
    id: 'venue_manager',
    label: 'Venue Manager',
    summary: 'List safe neighbourhood slots and approve or decline incoming host proposals.',
  },
];

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  activeRole,
  onSwitchRole,
  onResetDemo,
  neighbourhoodName,
  cityName,
  radiusKm,
}) => {
  const currentRole = ROLE_OPTIONS.find((r) => r.id === activeRole) ?? ROLE_OPTIONS[0];

  return (
    <section
      aria-label="Demo Role Switcher and Neighbourhood Scope"
      className="bg-[#F3EFE8] border-b border-stone-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span
            id="demo-role-label"
            className="text-sm font-semibold text-stone-900 whitespace-nowrap shrink-0"
          >
            Demo Role Switcher:
          </span>
          <div
            role="group"
            aria-labelledby="demo-role-label"
            className="inline-flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-lg border border-stone-300"
          >
            {ROLE_OPTIONS.map((role) => {
              const selected = activeRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => onSwitchRole(role.id)}
                  aria-pressed={selected}
                  className={`px-3.5 py-2 min-h-[40px] rounded-md text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    selected
                      ? 'bg-[#14532D] text-white'
                      : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
          <p className="text-sm text-stone-700 leading-snug">{currentRole.summary}</p>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
          <span className="text-sm text-stone-700 whitespace-nowrap">
            Scope: {neighbourhoodName}, {cityName} (within {radiusKm} km)
          </span>
          <button
            type="button"
            onClick={onResetDemo}
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-lg border border-stone-300 bg-white text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>
    </section>
  );
};
