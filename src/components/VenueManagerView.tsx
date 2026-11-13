import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, Plus, ShieldCheck, Users, XCircle } from 'lucide-react';
import { formatFriendlyDate, formatTimeRange } from '../data/gatheringsStore';
import { AppState } from '../types/gatherings';

interface VenueManagerViewProps {
  state: AppState;
  onAddSlot: (input: {
    venueId: string;
    date: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    venueSafetyNote: string;
  }) => boolean;
  onApproveProposal: (proposalId: string) => void;
  onDeclineProposal: (proposalId: string, reason: string) => void;
}

export const VenueManagerView: React.FC<VenueManagerViewProps> = ({
  state,
  onAddSlot,
  onApproveProposal,
  onDeclineProposal,
}) => {
  const localVenues = useMemo(
    () => state.venues.filter((v) => v.distanceKm <= state.maxNeighbourhoodRadiusKm),
    [state.venues, state.maxNeighbourhoodRadiusKm]
  );

  const [venueId, setVenueId] = useState(localVenues[0]?.id ?? '');
  const [date, setDate] = useState('2026-12-04');
  const [startTime, setStartTime] = useState('10:30');
  const [endTime, setEndTime] = useState('12:00');
  const [maxCapacity, setMaxCapacity] = useState(12);
  const [venueSafetyNote, setVenueSafetyNote] = useState(
    'Ground-floor public space; staff present at reception desk.'
  );

  const selectedVenue = localVenues.find((v) => v.id === venueId) ?? localVenues[0];

  const handleAddSlotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onAddSlot({
      venueId,
      date,
      startTime,
      endTime,
      maxCapacity,
      venueSafetyNote,
    });
    if (ok) {
      setVenueSafetyNote('Ground-floor public space; staff present at reception desk.');
    }
  };

  const pendingProposals = state.proposals.filter((p) => p.status === 'pending');
  const reviewedProposals = state.proposals.filter((p) => p.status !== 'pending');

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <section className="bg-white border border-stone-200 rounded-xl p-6">
        <p className="text-sm font-semibold text-[#14532D]">
          Venue Manager Desk · Signed in as {state.demoVenueManagerName}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">
          Manage Neighbourhood Venue Slots & Proposals
        </h1>
        <p className="mt-2 text-base text-stone-700 max-w-3xl">
          Offer daytime and early-evening community room slots within {state.maxNeighbourhoodRadiusKm}{' '}
          km of {state.neighbourhoodName}, and approve or decline incoming host proposals. Approving
          a proposal reserves that slot exclusively so double-bookings cannot occur.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Add Available Slot */}
        <section
          aria-labelledby="add-slot-heading"
          className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6"
        >
          <h2
            id="add-slot-heading"
            className="font-display text-2xl font-bold text-stone-900"
          >
            Add an Available Venue Slot
          </h2>
          <p className="mt-1 text-sm text-stone-700">
            Only verified local venues within walking distance ({state.maxNeighbourhoodRadiusKm} km)
            appear below.
          </p>

          <form onSubmit={handleAddSlotSubmit} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="slot-venue"
                className="block text-sm font-semibold text-stone-900 mb-1.5"
              >
                Local Community Venue *
              </label>
              <select
                id="slot-venue"
                value={venueId}
                onChange={(e) => {
                  const nextId = e.target.value;
                  setVenueId(nextId);
                  const v = localVenues.find((x) => x.id === nextId);
                  if (v && maxCapacity > v.maxRoomCapacity) {
                    setMaxCapacity(v.maxRoomCapacity);
                  }
                }}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
              >
                {localVenues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.districtVicinity} · {v.distanceKm.toFixed(1)} km)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="slot-date"
                  className="block text-sm font-semibold text-stone-900 mb-1.5"
                >
                  Session Date *
                </label>
                <input
                  id="slot-date"
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900 tabular-nums"
                />
              </div>

              <div>
                <label
                  htmlFor="slot-start"
                  className="block text-sm font-semibold text-stone-900 mb-1.5"
                >
                  Start Time *
                </label>
                <input
                  id="slot-start"
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900 tabular-nums"
                />
              </div>

              <div>
                <label
                  htmlFor="slot-end"
                  className="block text-sm font-semibold text-stone-900 mb-1.5"
                >
                  End Time *
                </label>
                <input
                  id="slot-end"
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900 tabular-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="slot-capacity"
                  className="block text-sm font-semibold text-stone-900 mb-1.5"
                >
                  Max Room Capacity (up to {selectedVenue?.maxRoomCapacity ?? 20}) *
                </label>
                <input
                  id="slot-capacity"
                  type="number"
                  min={2}
                  max={selectedVenue?.maxRoomCapacity ?? 20}
                  required
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="slot-safety-note"
                className="block text-sm font-semibold text-stone-900 mb-1.5"
              >
                Venue Safety & Accessibility Note
              </label>
              <textarea
                id="slot-safety-note"
                rows={2}
                value={venueSafetyNote}
                onChange={(e) => setVenueSafetyNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-lg bg-[#14532D] text-white text-base font-semibold hover:bg-[#0F3F22] transition-colors"
            >
              <Plus className="w-5 h-5" aria-hidden="true" />
              <span>List Available Slot</span>
            </button>
          </form>
        </section>

        {/* Right: Review Pending Proposals + Slot Status */}
        <div className="lg:col-span-7 space-y-6">
          <section
            aria-labelledby="review-proposals-heading"
            className="bg-white border border-stone-200 rounded-xl p-6"
          >
            <h2
              id="review-proposals-heading"
              className="font-display text-2xl font-bold text-stone-900"
            >
              Proposals Awaiting Review ({pendingProposals.length})
            </h2>
            <p className="mt-1 text-sm text-stone-700">
              Review requested time, group size, and host safeguarding confirmation before
              approving.
            </p>

            {pendingProposals.length === 0 ? (
              <div className="mt-4 p-5 rounded-lg bg-[#FAF7F2] border border-stone-200 text-base text-stone-700">
                No pending host proposals right now. Switch to the <strong>Host</strong> role to
                submit a proposal for an available slot.
              </div>
            ) : (
              <ul className="mt-4 space-y-4">
                {pendingProposals.map((prop) => {
                  const slot = state.slots.find((s) => s.id === prop.slotId);
                  const venue = state.venues.find((v) => v.id === prop.venueId);
                  const isSlotAlreadyReserved = slot?.status === 'reserved';

                  return (
                    <li
                      key={prop.id}
                      className="p-5 rounded-xl border border-stone-300 bg-[#FAF7F2] space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#92400E] bg-[#FEF3C7] border border-[#FCD34D] px-2.5 py-1 rounded-md">
                          Pending Review
                        </span>
                        <span className="text-sm font-semibold text-stone-800 tabular-nums">
                          Requested Group Size: {prop.requestedCapacity} guests
                          {slot ? ` (Room max ${slot.maxCapacity})` : ''}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold text-stone-900">
                        {prop.title}
                      </h3>

                      <p className="text-sm text-stone-800">
                        <strong>Host:</strong> {prop.hostName} · <strong>Category:</strong>{' '}
                        {prop.category} · <strong>Cost:</strong> {prop.costLabel}
                      </p>

                      {slot && venue && (
                        <p className="text-sm text-stone-800 flex flex-wrap items-center gap-x-4 gap-y-1 tabular-nums">
                          <span className="inline-flex items-center gap-1.5 font-semibold">
                            <Calendar className="w-4 h-4 text-[#14532D]" aria-hidden="true" />
                            {venue.name} · {formatFriendlyDate(slot.date)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-stone-600" aria-hidden="true" />
                            {formatTimeRange(slot.startTime, slot.endTime)}
                          </span>
                        </p>
                      )}

                      <p className="text-base text-stone-800 leading-relaxed">
                        {prop.description}
                      </p>

                      <p className="text-sm text-[#14532D] flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                        <span>
                          Host confirmed public venue, inclusive conduct & vulnerable-person
                          safeguarding pledge.
                        </span>
                      </p>

                      {isSlotAlreadyReserved && (
                        <p className="text-sm font-semibold text-[#991B1B]">
                          This slot was already reserved by another approved proposal and cannot be
                          double-booked.
                        </p>
                      )}

                      <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          disabled={isSlotAlreadyReserved}
                          onClick={() => onApproveProposal(prop.id)}
                          className={`inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-lg text-sm font-semibold transition-colors ${
                            isSlotAlreadyReserved
                              ? 'bg-stone-200 text-stone-600 cursor-not-allowed border border-stone-300'
                              : 'bg-[#14532D] text-white hover:bg-[#0F3F22]'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                          <span>
                            {isSlotAlreadyReserved
                              ? 'Slot Already Reserved'
                              : 'Approve & Reserve Slot'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDeclineProposal(
                              prop.id,
                              'Time slot or group capacity did not match venue availability.'
                            )
                          }
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg border border-[#991B1B] bg-white text-[#991B1B] text-sm font-semibold hover:bg-[#FEF2F2] transition-colors"
                        >
                          <XCircle className="w-4 h-4" aria-hidden="true" />
                          <span>Decline Proposal</span>
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Slot Ledger & Decision History */}
          <section
            aria-labelledby="slots-ledger-heading"
            className="bg-white border border-stone-200 rounded-xl p-6"
          >
            <h2
              id="slots-ledger-heading"
              className="font-display text-xl font-bold text-stone-900"
            >
              Venue Slot Schedule ({state.slots.length})
            </h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-stone-300 font-semibold text-stone-800">
                    <th scope="col" className="py-2.5 pr-3">
                      Venue
                    </th>
                    <th scope="col" className="py-2.5 px-3">
                      Date & Time
                    </th>
                    <th scope="col" className="py-2.5 px-3 text-right">
                      Max Cap.
                    </th>
                    <th scope="col" className="py-2.5 pl-3">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {state.slots
                    .slice()
                    .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
                    .map((slot) => {
                      const venue = state.venues.find((v) => v.id === slot.venueId);
                      const reservedProp = slot.reservedByProposalId
                        ? state.proposals.find((p) => p.id === slot.reservedByProposalId)
                        : undefined;
                      return (
                        <tr key={slot.id}>
                          <td className="py-3 pr-3 font-medium text-stone-900">
                            {venue?.name ?? 'Local Venue'}
                          </td>
                          <td className="py-3 px-3 text-stone-800 tabular-nums">
                            {formatFriendlyDate(slot.date)} ·{' '}
                            {formatTimeRange(slot.startTime, slot.endTime)}
                          </td>
                          <td className="py-3 px-3 text-right text-stone-800 tabular-nums">
                            <span className="inline-flex items-center gap-1 justify-end">
                              <Users className="w-3.5 h-3.5 text-stone-600" aria-hidden="true" />
                              {slot.maxCapacity}
                            </span>
                          </td>
                          <td className="py-3 pl-3">
                            {slot.status === 'available' ? (
                              <span className="font-semibold text-[#14532D]">
                                Available for hosts
                              </span>
                            ) : (
                              <span className="font-semibold text-stone-800">
                                Reserved{reservedProp ? ` · ${reservedProp.title}` : ''}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {reviewedProposals.length > 0 && (
              <div className="mt-6 pt-4 border-t border-stone-200">
                <h3 className="text-sm font-semibold text-stone-900">
                  Recently Reviewed Proposals ({reviewedProposals.length})
                </h3>
                <ul className="mt-2 space-y-1.5 text-sm text-stone-700">
                  {reviewedProposals.map((p) => (
                    <li key={p.id}>
                      <strong>{p.title}</strong> ({p.hostName}, {p.requestedCapacity} guests) —{' '}
                      <span className="capitalize font-semibold">{p.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
