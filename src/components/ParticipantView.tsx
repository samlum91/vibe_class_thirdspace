import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, ShieldCheck, Users } from 'lucide-react';
import {
  formatFriendlyDate,
  formatTimeRange,
  getDayOfWeek,
  INTEREST_CATEGORIES,
} from '../data/gatheringsStore';
import { GatheringWithSessions, InterestCategory } from '../types/gatherings';

interface ParticipantViewProps {
  items: GatheringWithSessions[];
  demoParticipantId: string;
  demoParticipantName: string;
  onRsvp: (sessionId: string) => void;
  onCancelRsvp: (sessionId: string) => void;
  onOpenPopup: (item: GatheringWithSessions) => void;
  onJumpToMap: () => void;
}

export const ParticipantView: React.FC<ParticipantViewProps> = ({
  items,
  demoParticipantId,
  demoParticipantName,
  onRsvp,
  onCancelRsvp,
  onOpenPopup,
  onJumpToMap,
}) => {
  const [subView, setSubView] = useState<'browse' | 'my_gatherings'>('browse');
  const [interestFilter, setInterestFilter] = useState<'all' | InterestCategory>('all');
  const [dayFilter, setDayFilter] = useState<string>('all');

  const availableDays = useMemo(() => {
    const days = new Set<string>();
    items.forEach((item) => {
      item.sessions.forEach((s) => {
        const day = getDayOfWeek(s.date);
        if (day) days.add(day);
      });
    });
    const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return Array.from(days).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (interestFilter !== 'all' && item.gathering.category !== interestFilter) {
        return false;
      }
      if (dayFilter !== 'all') {
        const matchesDay = item.sessions.some((s) => getDayOfWeek(s.date) === dayFilter);
        if (!matchesDay) return false;
      }
      return true;
    });
  }, [items, interestFilter, dayFilter]);

  const myGatherings = useMemo(() => {
    return items
      .map((item) => {
        const rsvpSessions = item.sessions.filter((s) =>
          s.rsvpParticipantIds.includes(demoParticipantId)
        );
        if (rsvpSessions.length === 0) return null;
        return { ...item, rsvpSessions };
      })
      .filter((x): x is GatheringWithSessions & { rsvpSessions: typeof items[number]['sessions'] } => x !== null);
  }, [items, demoParticipantId]);

  const myRsvpCount = myGatherings.reduce((acc, g) => acc + g.rsvpSessions.length, 0);

  return (
    <div className="space-y-6">
      {/* Warm Editorial Introduction + Sub-Navigation */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#14532D]">
              Signed in as {demoParticipantName}
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-bold text-stone-900">
              Welcoming Third-Place Gatherings Near You
            </h1>
            <p className="mt-2.5 text-base text-stone-700 leading-relaxed">
              Small, recurring neighbourhood groups hosted in vetted public libraries, cafés,
              and community halls within walking distance. Newcomers and solo attendees are
              greeted warmly at every table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div
              role="tablist"
              aria-label="Participant sections"
              className="inline-flex items-center p-1 rounded-lg bg-[#F3EFE8] border border-stone-300"
            >
              <button
                type="button"
                role="tab"
                aria-selected={subView === 'browse'}
                onClick={() => setSubView('browse')}
                className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
                  subView === 'browse'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                Browse Gatherings ({items.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={subView === 'my_gatherings'}
                onClick={() => setSubView('my_gatherings')}
                className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-semibold transition-colors whitespace-nowrap tabular-nums ${
                  subView === 'my_gatherings'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-700 hover:text-stone-950'
                }`}
              >
                My Gatherings ({myRsvpCount})
              </button>
            </div>

            <button
              type="button"
              onClick={onJumpToMap}
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-colors whitespace-nowrap"
            >
              <MapPin className="w-4 h-4 text-[#14532D]" aria-hidden="true" />
              <span>View District Map & Table</span>
            </button>
          </div>
        </div>

        {/* Filters (shown in Browse tab) */}
        {subView === 'browse' && (
          <div className="mt-6 pt-5 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div>
              <label
                htmlFor="filter-interest"
                className="block text-sm font-semibold text-stone-900 mb-1.5"
              >
                Filter by Interest
              </label>
              <select
                id="filter-interest"
                value={interestFilter}
                onChange={(e) =>
                  setInterestFilter(e.target.value as 'all' | InterestCategory)
                }
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
              >
                <option value="all">All Interests</option>
                {INTEREST_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-day"
                className="block text-sm font-semibold text-stone-900 mb-1.5"
              >
                Filter by Day of Week
              </label>
              <select
                id="filter-day"
                value={dayFilter}
                onChange={(e) => setDayFilter(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
              >
                <option value="all">Any Day</option>
                {availableDays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-4">
              {(interestFilter !== 'all' || dayFilter !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setInterestFilter('all');
                    setDayFilter('all');
                  }}
                  className="px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 text-sm font-semibold text-stone-800 hover:bg-stone-100"
                >
                  Clear Filters
                </button>
              )}
              <p className="text-sm text-stone-700 tabular-nums">
                Showing {filteredItems.length} of {items.length} local gatherings
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Browse Gatherings Grid */}
      {subView === 'browse' && (
        <>
          {filteredItems.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center">
              <h2 className="font-display text-xl font-bold text-stone-900">
                No gatherings match those filters
              </h2>
              <p className="mt-2 text-base text-stone-700">
                Try clearing the interest or day filter to see all upcoming neighbourhood tables.
              </p>
              <button
                type="button"
                onClick={() => {
                  setInterestFilter('all');
                  setDayFilter('all');
                }}
                className="mt-4 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22]"
              >
                Show All Gatherings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => {
                const { gathering, venue, nextConfirmedSession } = item;
                const rsvpCount = nextConfirmedSession
                  ? nextConfirmedSession.rsvpParticipantIds.length
                  : 0;
                const capacity = nextConfirmedSession ? nextConfirmedSession.capacity : 0;
                const spotsLeft = Math.max(0, capacity - rsvpCount);
                const isFull = nextConfirmedSession ? spotsLeft === 0 : true;
                const hasRsvp = nextConfirmedSession
                  ? nextConfirmedSession.rsvpParticipantIds.includes(demoParticipantId)
                  : false;

                return (
                  <article
                    key={gathering.id}
                    className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      {/* Quiet unboxed metadata line */}
                      <p className="text-sm font-medium text-stone-600">
                        {gathering.category} · {gathering.recurrence} · {gathering.costLabel}
                      </p>

                      <h2 className="mt-1.5 font-display text-2xl font-bold text-stone-900 leading-snug">
                        {gathering.title}
                      </h2>

                      <p className="mt-2.5 text-base text-stone-700 line-clamp-3 leading-relaxed">
                        {gathering.summary}
                      </p>

                      <dl className="mt-5 pt-4 border-t border-stone-200 space-y-2.5 text-sm text-stone-800">
                        <div className="flex items-start gap-2.5">
                          <Calendar
                            className="w-4 h-4 text-[#14532D] mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="sr-only">Next Confirmed Date</dt>
                            <dd className="font-semibold text-stone-900 tabular-nums">
                              Next Confirmed Date:{' '}
                              {nextConfirmedSession
                                ? `${formatFriendlyDate(
                                    nextConfirmedSession.date
                                  )} · ${formatTimeRange(
                                    nextConfirmedSession.startTime,
                                    nextConfirmedSession.endTime
                                  )}`
                                : 'Awaiting next confirmed slot'}
                            </dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className="w-4 h-4 text-[#14532D] mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="sr-only">Venue and Vicinity</dt>
                            <dd>
                              <strong className="text-stone-900">{venue.name}</strong> ·{' '}
                              {venue.districtVicinity} ({venue.walkingMinutes} min walk)
                            </dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <Users
                            className="w-4 h-4 text-stone-600 mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="sr-only">Host and Attendance</dt>
                            <dd className="tabular-nums">
                              Hosted by <strong className="text-stone-900">{gathering.hostName}</strong>{' '}
                              ·{' '}
                              {nextConfirmedSession ? (
                                isFull ? (
                                  <span className="font-semibold text-[#991B1B]">
                                    Session Full ({rsvpCount}/{capacity})
                                  </span>
                                ) : (
                                  <span>
                                    {spotsLeft} of {capacity} places open
                                  </span>
                                )
                              ) : (
                                'Capacity pending'
                              )}
                            </dd>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <ShieldCheck
                            className="w-4 h-4 text-[#14532D] mt-0.5 shrink-0"
                            aria-hidden="true"
                          />
                          <div>
                            <dt className="sr-only">Welcome & Safety</dt>
                            <dd className="text-stone-700">
                              {gathering.newcomersWelcome && gathering.soloFriendly
                                ? 'Newcomers & solo attendees warmly welcome · Public venue verified'
                                : 'Open to neighbours · Public venue verified'}
                            </dd>
                          </div>
                        </div>
                      </dl>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenPopup(item)}
                        className="px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100 transition-colors"
                      >
                        Full Details & Pop-up
                      </button>

                      {nextConfirmedSession && (
                        <>
                          {hasRsvp ? (
                            <button
                              type="button"
                              onClick={() => onCancelRsvp(nextConfirmedSession.id)}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#14532D] bg-[#ECFDF5] text-sm font-semibold text-[#14532D] hover:bg-[#D1FAE5] transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                              <span>Confirmed — Cancel RSVP</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={isFull}
                              onClick={() => onRsvp(nextConfirmedSession.id)}
                              className={`px-5 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                                isFull
                                  ? 'bg-stone-200 text-stone-600 cursor-not-allowed border border-stone-300'
                                  : 'bg-[#14532D] text-white hover:bg-[#0F3F22]'
                              }`}
                            >
                              {isFull ? 'Session Full' : 'RSVP for Next Session'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* My Gatherings Tab */}
      {subView === 'my_gatherings' && (
        <section
          aria-labelledby="my-gatherings-heading"
          className="bg-white border border-stone-200 rounded-xl p-6"
        >
          <h2
            id="my-gatherings-heading"
            className="font-display text-2xl font-bold text-stone-900"
          >
            My Confirmed Gatherings
          </h2>
          <p className="mt-1 text-base text-stone-700">
            Your upcoming session RSVPs in Kitsilano. If your plans change, cancelling frees a
            place for another neighbour.
          </p>

          {myGatherings.length === 0 ? (
            <div className="mt-6 p-8 rounded-xl bg-[#FAF7F2] border border-stone-200 text-center">
              <p className="text-lg font-semibold text-stone-900">
                You have not RSVP’d to a session yet.
              </p>
              <p className="mt-1 text-base text-stone-700">
                Browse the neighbourhood gatherings to reserve a welcoming seat.
              </p>
              <button
                type="button"
                onClick={() => setSubView('browse')}
                className="mt-4 px-5 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22]"
              >
                Browse Gatherings
              </button>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {myGatherings.map((item) =>
                item.rsvpSessions.map((session) => (
                  <li
                    key={session.id}
                    className="p-5 rounded-xl border border-stone-200 bg-[#FAF7F2] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#14532D]">
                        Confirmed RSVP · {item.gathering.category}
                      </p>
                      <h3 className="font-display text-xl font-bold text-stone-900">
                        {item.gathering.title}
                      </h3>
                      <p className="text-base text-stone-800 flex items-center gap-2 tabular-nums">
                        <Clock className="w-4 h-4 text-stone-600 shrink-0" aria-hidden="true" />
                        <span>
                          {formatFriendlyDate(session.date)} ·{' '}
                          {formatTimeRange(session.startTime, session.endTime)}
                        </span>
                      </p>
                      <p className="text-sm text-stone-700">
                        <strong>Venue:</strong> {item.venue.name} ({item.venue.districtVicinity}) ·
                        Hosted by {item.gathering.hostName} · {item.gathering.costLabel}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => onOpenPopup(item)}
                        className="px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100"
                      >
                        View Gathering Pop-up
                      </button>
                      <button
                        type="button"
                        onClick={() => onCancelRsvp(session.id)}
                        className="px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-400 bg-white text-sm font-semibold text-stone-900 hover:bg-stone-100"
                      >
                        Cancel RSVP
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>
      )}
    </div>
  );
};
