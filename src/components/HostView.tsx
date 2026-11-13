import React, { useMemo, useState } from 'react';
import { Calendar, CheckCircle2, Clock, MapPin, Send, ShieldCheck, XCircle } from 'lucide-react';
import {
  formatFriendlyDate,
  formatTimeRange,
  INTEREST_CATEGORIES,
  RECURRENCE_OPTIONS,
} from '../data/gatheringsStore';
import {
  AppState,
  InterestCategory,
  ProposalStatus,
  RecurrenceOption,
} from '../types/gatherings';

interface HostViewProps {
  state: AppState;
  onSubmitProposal: (input: {
    slotId: string;
    title: string;
    description: string;
    category: InterestCategory;
    requestedCapacity: number;
    costLabel: string;
    recurrence: RecurrenceOption;
    newcomersWelcome: boolean;
    soloFriendly: boolean;
    safeguarding: {
      publicVenueConfirmed: boolean;
      inclusiveConductAgreed: boolean;
      vulnerableAdultAndChildSafe: boolean;
    };
  }) => boolean;
  onPublishProposal: (proposalId: string) => void;
}

const STATUS_DISPLAY: Record<
  ProposalStatus,
  { label: string; classes: string; note: string }
> = {
  pending: {
    label: 'Pending Venue Review',
    classes: 'text-[#92400E] bg-[#FEF3C7] border-[#FCD34D]',
    note: 'Waiting for the Venue Manager to approve and reserve this slot.',
  },
  approved: {
    label: 'Approved — Ready to Publish',
    classes: 'text-[#14532D] bg-[#ECFDF5] border-[#6EE7B7]',
    note: 'Slot reserved! Click Publish Gathering to open RSVPs to neighbours.',
  },
  declined: {
    label: 'Declined',
    classes: 'text-[#991B1B] bg-[#FEF2F2] border-[#FCA5A5]',
    note: 'This proposal was declined by the Venue Manager.',
  },
  published: {
    label: 'Published to Neighbourhood',
    classes: 'text-[#1E3A8A] bg-[#EFF6FF] border-[#BFDBFE]',
    note: 'Live in Participant Discovery and pinned on the Neighbourhood Map.',
  },
};

export const HostView: React.FC<HostViewProps> = ({
  state,
  onSubmitProposal,
  onPublishProposal,
}) => {
  const localVenuesMap = useMemo(
    () =>
      new Map(
        state.venues
          .filter((v) => v.distanceKm <= state.maxNeighbourhoodRadiusKm)
          .map((v) => [v.id, v])
      ),
    [state.venues, state.maxNeighbourhoodRadiusKm]
  );

  const availableSlots = useMemo(
    () =>
      state.slots
        .filter((s) => s.status === 'available' && localVenuesMap.has(s.venueId))
        .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`)),
    [state.slots, localVenuesMap]
  );

  const [selectedSlotId, setSelectedSlotId] = useState<string>(
    availableSlots[0]?.id ?? ''
  );
  const effectiveSlotId = availableSlots.some((s) => s.id === selectedSlotId)
    ? selectedSlotId
    : availableSlots[0]?.id ?? '';

  const selectedSlot = availableSlots.find((s) => s.id === effectiveSlotId) ?? null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InterestCategory>('Books & Reading');
  const [requestedCapacity, setRequestedCapacity] = useState<number>(8);
  const [costLabel, setCostLabel] = useState('Free');
  const [recurrence, setRecurrence] = useState<RecurrenceOption>('Fortnightly');
  const [newcomersWelcome, setNewcomersWelcome] = useState(true);
  const [soloFriendly, setSoloFriendly] = useState(true);
  const [publicVenueConfirmed, setPublicVenueConfirmed] = useState(false);
  const [inclusiveConductAgreed, setInclusiveConductAgreed] = useState(false);
  const [vulnerableAdultAndChildSafe, setVulnerableAdultAndChildSafe] = useState(false);

  const wordCount = description.trim() ? description.trim().split(/\s+/).length : 0;

  const handleSlotChange = (slotId: string) => {
    setSelectedSlotId(slotId);
    const slot = availableSlots.find((s) => s.id === slotId);
    if (slot && requestedCapacity > slot.maxCapacity) {
      setRequestedCapacity(slot.maxCapacity);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!effectiveSlotId) return;

    const ok = onSubmitProposal({
      slotId: effectiveSlotId,
      title,
      description,
      category,
      requestedCapacity: selectedSlot
        ? Math.min(requestedCapacity, selectedSlot.maxCapacity)
        : requestedCapacity,
      costLabel,
      recurrence,
      newcomersWelcome,
      soloFriendly,
      safeguarding: {
        publicVenueConfirmed,
        inclusiveConductAgreed,
        vulnerableAdultAndChildSafe,
      },
    });

    if (ok) {
      setTitle('');
      setDescription('');
      setCostLabel('Free');
      setPublicVenueConfirmed(false);
      setInclusiveConductAgreed(false);
      setVulnerableAdultAndChildSafe(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <section className="bg-white border border-stone-200 rounded-xl p-6">
        <p className="text-sm font-semibold text-[#14532D]">
          Host Desk · Signed in as {state.demoHostName}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-stone-900">
          Propose & Publish a Neighbourhood Gathering
        </h1>
        <p className="mt-2 text-base text-stone-700 max-w-3xl">
          Select an open time slot offered by a local venue, submit your gathering proposal with
          our community safeguarding pledge, and publish it once the Venue Manager approves your
          booking.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Browse Available Slots & Submit Proposal */}
        <section
          aria-labelledby="submit-proposal-heading"
          className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6"
        >
          <h2
            id="submit-proposal-heading"
            className="font-display text-2xl font-bold text-stone-900"
          >
            1. Choose an Available Slot & Submit Proposal
          </h2>

          {availableSlots.length === 0 ? (
            <div className="mt-4 p-5 rounded-lg bg-[#FAF7F2] border border-stone-200 text-base text-stone-800">
              All neighbourhood slots are currently reserved. Switch to the{' '}
              <strong>Venue Manager</strong> role to list a new available slot.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Slot Selection List */}
              <fieldset>
                <legend className="text-base font-semibold text-stone-900 mb-2">
                  Available Neighbourhood Venue Slots ({availableSlots.length})
                </legend>
                <div className="space-y-2.5">
                  {availableSlots.map((slot) => {
                    const venue = localVenuesMap.get(slot.venueId);
                    if (!venue) return null;
                    const isSelected = slot.id === effectiveSlotId;
                    return (
                      <label
                        key={slot.id}
                        className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                          isSelected
                            ? 'border-[#14532D] bg-[#ECFDF5]/60 ring-1 ring-[#14532D]'
                            : 'border-stone-300 bg-[#FAF7F2] hover:bg-stone-100'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="slotId"
                            value={slot.id}
                            checked={isSelected}
                            onChange={() => handleSlotChange(slot.id)}
                            className="mt-1 h-5 w-5 accent-[#14532D]"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-base font-bold text-stone-900">
                                {venue.name}
                              </span>
                              <span className="text-sm font-semibold text-[#14532D] tabular-nums">
                                Up to {slot.maxCapacity} people
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-stone-800 flex flex-wrap items-center gap-x-4 gap-y-1 tabular-nums">
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-stone-600" aria-hidden="true" />
                                {formatFriendlyDate(slot.date)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-4 h-4 text-stone-600" aria-hidden="true" />
                                {formatTimeRange(slot.startTime, slot.endTime)}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-stone-600" aria-hidden="true" />
                                {venue.districtVicinity}
                              </span>
                            </p>
                            <p className="mt-1 text-sm text-stone-700">{slot.venueSafetyNote}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* Proposal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="proposal-title"
                    className="block text-sm font-semibold text-stone-900 mb-1.5"
                  >
                    Gathering Title *
                  </label>
                  <input
                    id="proposal-title"
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Wednesday Morning Watercolour & Tea"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proposal-category"
                    className="block text-sm font-semibold text-stone-900 mb-1.5"
                  >
                    Category *
                  </label>
                  <select
                    id="proposal-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as InterestCategory)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
                  >
                    {INTEREST_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="proposal-capacity"
                    className="block text-sm font-semibold text-stone-900 mb-1.5"
                  >
                    Requested Capacity (max {selectedSlot?.maxCapacity ?? 12}) *
                  </label>
                  <input
                    id="proposal-capacity"
                    type="number"
                    min={2}
                    max={selectedSlot?.maxCapacity ?? 20}
                    required
                    value={requestedCapacity}
                    onChange={(e) => setRequestedCapacity(Number(e.target.value))}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900 tabular-nums"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proposal-cost"
                    className="block text-sm font-semibold text-stone-900 mb-1.5"
                  >
                    Cost or Minimum Spend *
                  </label>
                  <input
                    id="proposal-cost"
                    type="text"
                    required
                    value={costLabel}
                    onChange={(e) => setCostLabel(e.target.value)}
                    placeholder="e.g. Free or $5 tea spend"
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
                  />
                </div>

                <div>
                  <label
                    htmlFor="proposal-recurrence"
                    className="block text-sm font-semibold text-stone-900 mb-1.5"
                  >
                    Optional Recurrence Setting
                  </label>
                  <select
                    id="proposal-recurrence"
                    value={recurrence}
                    onChange={(e) => setRecurrence(e.target.value as RecurrenceOption)}
                    className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-base text-stone-900"
                  >
                    {RECURRENCE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="proposal-description"
                      className="block text-sm font-semibold text-stone-900"
                    >
                      Gathering Description (aim for ~80–100 words) *
                    </label>
                    <span className="text-xs text-stone-600 tabular-nums">
                      {wordCount} words
                    </span>
                  </div>
                  <textarea
                    id="proposal-description"
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happens during the session, what to bring (if anything), and how newcomers or solo neighbours will be welcomed at the door."
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 bg-white text-base text-stone-900 leading-relaxed"
                  />
                </div>
              </div>

              {/* Welcoming flags */}
              <div className="flex flex-wrap gap-5 pt-1">
                <label className="inline-flex items-center gap-2.5 text-base text-stone-900 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={newcomersWelcome}
                    onChange={(e) => setNewcomersWelcome(e.target.checked)}
                    className="h-5 w-5 accent-[#14532D]"
                  />
                  <span>Newcomers welcome</span>
                </label>
                <label className="inline-flex items-center gap-2.5 text-base text-stone-900 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={soloFriendly}
                    onChange={(e) => setSoloFriendly(e.target.checked)}
                    className="h-5 w-5 accent-[#14532D]"
                  />
                  <span>Solo attendees welcome</span>
                </label>
              </div>

              {/* Mandatory Community Safeguarding Pledge */}
              <fieldset className="p-4 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-3">
                <legend className="px-1 text-sm font-bold text-[#14532D] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  <span>Community Safeguarding Commitment (Required)</span>
                </legend>
                <label className="flex items-start gap-3 text-sm text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={publicVenueConfirmed}
                    onChange={(e) => setPublicVenueConfirmed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[#14532D] shrink-0"
                  />
                  <span>
                    I will host strictly within this vetted public venue during scheduled hours and
                    never invite attendees to private residences.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inclusiveConductAgreed}
                    onChange={(e) => setInclusiveConductAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[#14532D] shrink-0"
                  />
                  <span>
                    I will uphold respectful, non-commercial, welcoming conduct and never request
                    private financial or personal contact details from participants.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vulnerableAdultAndChildSafe}
                    onChange={(e) => setVulnerableAdultAndChildSafe(e.target.checked)}
                    className="mt-0.5 h-5 w-5 accent-[#14532D] shrink-0"
                  />
                  <span>
                    I commit to safe practices protecting venues, hosts, seniors, children, and
                    vulnerable residents (adults only unless a parent/guardian attends with minors).
                  </span>
                </label>
              </fieldset>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-lg bg-[#14532D] text-white text-base font-semibold hover:bg-[#0F3F22] transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>Submit Gathering Proposal</span>
              </button>
            </form>
          )}
        </section>

        {/* Right Column: Track Proposal Status & Publish After Approval */}
        <section
          aria-labelledby="track-proposals-heading"
          className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-6"
        >
          <h2
            id="track-proposals-heading"
            className="font-display text-2xl font-bold text-stone-900"
          >
            2. Your Proposals & Publishing
          </h2>
          <p className="mt-1 text-sm text-stone-700">
            Proposals can only be published after a Venue Manager approves and reserves the slot.
          </p>

          <ul className="mt-5 space-y-4">
            {state.proposals.map((prop) => {
              const slot = state.slots.find((s) => s.id === prop.slotId);
              const venue = state.venues.find((v) => v.id === prop.venueId);
              const statusMeta = STATUS_DISPLAY[prop.status];

              return (
                <li
                  key={prop.id}
                  className="p-4 rounded-xl border border-stone-200 bg-[#FAF7F2] space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${statusMeta.classes}`}
                    >
                      {prop.status === 'approved' || prop.status === 'published' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : prop.status === 'declined' ? (
                        <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      )}
                      <span>{statusMeta.label}</span>
                    </span>
                    <span className="text-xs text-stone-600 tabular-nums">
                      Up to {prop.requestedCapacity} guests
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-stone-900">
                    {prop.title}
                  </h3>

                  <p className="text-sm text-stone-700">
                    {venue?.name ?? 'Local Venue'} ·{' '}
                    {slot
                      ? `${formatFriendlyDate(slot.date)} (${formatTimeRange(
                          slot.startTime,
                          slot.endTime
                        )})`
                      : 'Slot details'}
                  </p>

                  <p className="text-sm text-stone-700">
                    {prop.status === 'declined' && prop.declineReason
                      ? prop.declineReason
                      : statusMeta.note}
                  </p>

                  {prop.status === 'approved' && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onPublishProposal(prop.id)}
                        className="w-full px-4 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22] transition-colors"
                      >
                        Publish Gathering to Neighbours
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};
