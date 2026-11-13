import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { formatFriendlyDate, formatTimeRange } from '../data/gatheringsStore';
import { GatheringWithSessions } from '../types/gatherings';

interface EventSummaryTableProps {
  items: GatheringWithSessions[];
  selectedGatheringId: string | null;
  demoParticipantId: string;
  onSelectGathering: (gatheringId: string) => void;
  onOpenPopup: (item: GatheringWithSessions) => void;
  onRsvp: (sessionId: string) => void;
}

export const EventSummaryTable: React.FC<EventSummaryTableProps> = ({
  items,
  selectedGatheringId,
  demoParticipantId,
  onSelectGathering,
  onOpenPopup,
  onRsvp,
}) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    onSelectGathering(id);
  };

  return (
    <section
      aria-labelledby="summary-table-heading"
      className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6"
    >
      <div className="pb-4 border-b border-stone-200">
        <h2
          id="summary-table-heading"
          className="font-display text-2xl font-bold text-stone-900"
        >
          Pinned Gatherings Summary Table
        </h2>
        <p className="mt-1 text-base text-stone-700">
          Expand any row to read the full 100-word description, or open the event pop-up for
          venue details, city district vicinity, and RSVP.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="py-8 text-base text-stone-700">
          No published gatherings match the current neighbourhood map.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-stone-300 text-sm font-semibold text-stone-800">
                <th scope="col" className="py-3 pr-3">
                  Pin
                </th>
                <th scope="col" className="py-3 px-3">
                  Gathering & Host
                </th>
                <th scope="col" className="py-3 px-3">
                  District Vicinity
                </th>
                <th scope="col" className="py-3 px-3">
                  Next Confirmed Date
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  Places Left
                </th>
                <th scope="col" className="py-3 px-3">
                  Price
                </th>
                <th scope="col" className="py-3 pl-3 text-right">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-base">
              {items.map((item, idx) => {
                const { gathering, venue, nextConfirmedSession } = item;
                const isExpanded = Boolean(expandedIds[gathering.id]);
                const isSelected = selectedGatheringId === gathering.id;
                const rsvpCount = nextConfirmedSession
                  ? nextConfirmedSession.rsvpParticipantIds.length
                  : 0;
                const cap = nextConfirmedSession ? nextConfirmedSession.capacity : 0;
                const spotsLeft = Math.max(0, cap - rsvpCount);
                const isFull = nextConfirmedSession ? spotsLeft === 0 : true;
                const hasRsvp = nextConfirmedSession
                  ? nextConfirmedSession.rsvpParticipantIds.includes(demoParticipantId)
                  : false;

                return (
                  <React.Fragment key={gathering.id}>
                    <tr
                      className={`transition-colors ${
                        isSelected ? 'bg-[#ECFDF5]/60' : 'hover:bg-[#FAF7F2]'
                      }`}
                    >
                      <td className="py-3.5 pr-3 align-top font-bold text-[#14532D] tabular-nums">
                        #{idx + 1}
                      </td>
                      <td className="py-3.5 px-3 align-top">
                        <button
                          type="button"
                          onClick={() => onSelectGathering(gathering.id)}
                          className="text-left font-semibold text-stone-900 hover:text-[#14532D] hover:underline"
                        >
                          {gathering.title}
                        </button>
                        <div className="text-sm text-stone-700 mt-0.5">
                          {gathering.category} · Hosted by {gathering.hostName}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-top text-sm text-stone-800">
                        <div>{venue.districtVicinity}</div>
                        <div className="text-stone-600 tabular-nums">
                          {venue.walkingMinutes} min walk
                        </div>
                      </td>
                      <td className="py-3.5 px-3 align-top text-sm text-stone-900 tabular-nums">
                        {nextConfirmedSession ? (
                          <>
                            <div className="font-semibold">
                              {formatFriendlyDate(nextConfirmedSession.date)}
                            </div>
                            <div className="text-stone-700">
                              {formatTimeRange(
                                nextConfirmedSession.startTime,
                                nextConfirmedSession.endTime
                              )}
                            </div>
                          </>
                        ) : (
                          <span className="text-stone-600">Date pending</span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 align-top text-right text-sm font-semibold tabular-nums">
                        {nextConfirmedSession ? (
                          <span className={isFull ? 'text-[#991B1B]' : 'text-stone-900'}>
                            {isFull ? 'Full' : `${spotsLeft} / ${cap}`}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-3.5 px-3 align-top text-sm text-stone-800 whitespace-nowrap">
                        {gathering.costLabel}
                      </td>
                      <td className="py-3.5 pl-3 align-top text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => toggleExpand(gathering.id)}
                            aria-expanded={isExpanded}
                            aria-controls={`detail-row-${gathering.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap"
                          >
                            <span>{isExpanded ? 'Hide 100-word detail' : 'Expand detail'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="w-4 h-4" aria-hidden="true" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenPopup(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22] transition-colors whitespace-nowrap"
                          >
                            <span>Pop-up</span>
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr id={`detail-row-${gathering.id}`} className="bg-[#FAF7F2]">
                        <td colSpan={7} className="p-5 border-t border-stone-200">
                          <div className="max-w-3xl space-y-3">
                            <p className="text-sm font-semibold text-stone-900">
                              Full Event Detail · {venue.name} ({venue.districtVicinity})
                            </p>
                            <p className="text-base text-stone-800 leading-relaxed">
                              {gathering.summary}
                            </p>
                            <p className="text-sm text-stone-700">
                              <strong>Accessibility & Safety:</strong> {venue.accessibilityNotes}{' '}
                              {venue.safetyVerification}
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                              <button
                                type="button"
                                onClick={() => onOpenPopup(item)}
                                className="px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100"
                              >
                                Open Event Pop-up
                              </button>
                              {nextConfirmedSession && !hasRsvp && (
                                <button
                                  type="button"
                                  disabled={isFull}
                                  onClick={() => onRsvp(nextConfirmedSession.id)}
                                  className={`px-4 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold ${
                                    isFull
                                      ? 'bg-stone-200 text-stone-600 cursor-not-allowed'
                                      : 'bg-[#14532D] text-white hover:bg-[#0F3F22]'
                                  }`}
                                >
                                  {isFull
                                    ? 'Next Session Full'
                                    : `RSVP for ${formatFriendlyDate(nextConfirmedSession.date)}`}
                                </button>
                              )}
                              {hasRsvp && (
                                <span className="text-sm font-semibold text-[#14532D]">
                                  You have a confirmed RSVP for the next session.
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
