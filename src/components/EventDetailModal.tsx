import React, { useEffect } from 'react';
import { Calendar, Clock, MapPin, ShieldCheck, Users, X } from 'lucide-react';
import {
  formatFriendlyDate,
  formatTimeRange,
} from '../data/gatheringsStore';
import { GatheringWithSessions } from '../types/gatherings';

interface EventDetailModalProps {
  item: GatheringWithSessions | null;
  demoParticipantId: string;
  onClose: () => void;
  onRsvp: (sessionId: string) => void;
  onCancelRsvp: (sessionId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  item,
  demoParticipantId,
  onClose,
  onRsvp,
  onCancelRsvp,
}) => {
  useEffect(() => {
    if (!item) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const { gathering, venue, sessions, nextConfirmedSession } = item;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-popup-headline"
        className="bg-white border border-stone-300 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <p className="text-sm font-medium text-stone-600">
              {gathering.category} · {gathering.recurrence} Gathering
            </p>
            <h2
              id="event-popup-headline"
              className="mt-1 font-display text-2xl sm:text-3xl font-bold text-stone-900"
            >
              {gathering.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gathering details"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-100 shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Key Facts Grid: Venue, Date, Time, Price, Vicinity */}
        <dl className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF7F2] border border-stone-200 rounded-lg p-4">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
              Venue
            </dt>
            <dd className="mt-1 text-base font-semibold text-stone-900">{venue.name}</dd>
            <dd className="text-sm text-stone-700">{venue.accessibilityNotes}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
              Vicinity (City District Only)
            </dt>
            <dd className="mt-1 text-base font-semibold text-stone-900 flex items-start gap-1.5">
              <MapPin className="w-4 h-4 text-[#14532D] mt-1 shrink-0" aria-hidden="true" />
              <span>
                {venue.districtVicinity}, {venue.cityDistrict}
              </span>
            </dd>
            <dd className="text-sm text-stone-700 tabular-nums">
              Approx. {venue.walkingMinutes} min walk ({venue.distanceKm.toFixed(1)} km) · Exact room
              notes shared after RSVP
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
              Next Confirmed Date & Time
            </dt>
            {nextConfirmedSession ? (
              <>
                <dd className="mt-1 text-base font-semibold text-stone-900 flex items-center gap-1.5 tabular-nums">
                  <Calendar className="w-4 h-4 text-[#14532D] shrink-0" aria-hidden="true" />
                  <span>{formatFriendlyDate(nextConfirmedSession.date)}</span>
                </dd>
                <dd className="text-sm text-stone-700 flex items-center gap-1.5 tabular-nums mt-0.5">
                  <Clock className="w-4 h-4 text-stone-600 shrink-0" aria-hidden="true" />
                  <span>
                    {formatTimeRange(
                      nextConfirmedSession.startTime,
                      nextConfirmedSession.endTime
                    )}
                  </span>
                </dd>
              </>
            ) : (
              <dd className="mt-1 text-sm text-stone-700">No upcoming session scheduled yet.</dd>
            )}
          </div>

          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-stone-600">
              Price & Host
            </dt>
            <dd className="mt-1 text-base font-semibold text-stone-900">{gathering.costLabel}</dd>
            <dd className="text-sm text-stone-700">
              Hosted by {gathering.hostName} ·{' '}
              {gathering.newcomersWelcome && gathering.soloFriendly
                ? 'Newcomers & solo attendees welcome'
                : gathering.newcomersWelcome
                ? 'Newcomers welcome'
                : 'Open to local residents'}
            </dd>
          </div>
        </dl>

        {/* Full ~100-word Summary */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-stone-900">About This Gathering</h3>
          <p className="mt-2 text-base text-stone-800 leading-relaxed">{gathering.summary}</p>
        </div>

        {/* Safeguarding reassurance */}
        <div className="mt-5 p-4 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#14532D] mt-0.5 shrink-0" aria-hidden="true" />
          <div className="text-sm text-stone-800">
            <p className="font-semibold text-stone-900">Verified Public Venue & Safeguarding</p>
            <p className="mt-0.5 text-stone-700">{venue.safetyVerification}</p>
          </div>
        </div>

        {/* Confirmed Sessions & RSVP Actions */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-stone-900">Confirmed Sessions</h3>
          {sessions.length === 0 ? (
            <p className="mt-2 text-sm text-stone-700">
              No confirmed sessions are open for RSVP at this time.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {sessions.map((session) => {
                const count = session.rsvpParticipantIds.length;
                const spotsLeft = Math.max(0, session.capacity - count);
                const isFull = spotsLeft === 0;
                const hasRsvp = session.rsvpParticipantIds.includes(demoParticipantId);

                return (
                  <li
                    key={session.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-lg border border-stone-200 bg-[#FAF7F2]"
                  >
                    <div>
                      <p className="text-base font-semibold text-stone-900 tabular-nums">
                        {formatFriendlyDate(session.date)} ·{' '}
                        {formatTimeRange(session.startTime, session.endTime)}
                      </p>
                      <p className="text-sm text-stone-700 flex items-center gap-1.5 mt-1 tabular-nums">
                        <Users className="w-4 h-4 text-stone-600 shrink-0" aria-hidden="true" />
                        <span>
                          {count} of {session.capacity} places taken ·{' '}
                          {isFull ? 'Session Full' : `${spotsLeft} places remaining`}
                        </span>
                      </p>
                    </div>

                    <div className="shrink-0">
                      {hasRsvp ? (
                        <button
                          type="button"
                          onClick={() => onCancelRsvp(session.id)}
                          className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-400 bg-white text-stone-900 text-sm font-semibold hover:bg-stone-100 transition-colors whitespace-nowrap"
                        >
                          Going — Cancel RSVP
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isFull}
                          onClick={() => onRsvp(session.id)}
                          className={`w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
                            isFull
                              ? 'bg-stone-200 text-stone-600 cursor-not-allowed border border-stone-300'
                              : 'bg-[#14532D] text-white hover:bg-[#0F3F22]'
                          }`}
                        >
                          {isFull ? 'Session Full' : 'RSVP for This Session'}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
