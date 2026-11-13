import {
  AppState,
  Gathering,
  GatheringSession,
  GatheringWithSessions,
  InterestCategory,
  Proposal,
  RecurrenceOption,
  SafeguardingChecklist,
  TimeSlot,
  Venue,
} from '../types/gatherings';

const STORAGE_KEY = 'kitsilano_third_place_state_v1';

export const INTEREST_CATEGORIES: InterestCategory[] = [
  'Books & Reading',
  'Tea & Conversation',
  'Gardening & Nature',
  'Crafts & Mending',
  'Games & Puzzles',
  'Walking & Local History',
  'Music & Choir',
];

export const RECURRENCE_OPTIONS: RecurrenceOption[] = [
  'One-off',
  'Weekly',
  'Fortnightly',
  'Monthly',
];

export const INITIAL_STATE: AppState = {
  demoParticipantId: 'resident-demo-01',
  demoParticipantName: 'Margaret (Local Resident)',
  demoHostName: 'Arthur Pendelton',
  demoVenueManagerName: 'Claire Moreau (Venue Coordinator)',
  neighbourhoodName: 'Kitsilano',
  cityName: 'Vancouver',
  maxNeighbourhoodRadiusKm: 1.8,
  venues: [
    {
      id: 'venue-1',
      name: 'Kitsilano Branch Reading Room',
      districtVicinity: 'West 4th & Alma Vicinity',
      cityDistrict: 'West Kitsilano',
      distanceKm: 0.4,
      walkingMinutes: 5,
      mapX: 28,
      mapY: 46,
      approxLat: 49.2682,
      approxLng: -123.1785,
      accessibilityNotes: 'Step-free ground floor entrance, hearing loop, accessible restrooms.',
      safetyVerification: 'Public municipal library with front-desk staff on duty throughout open hours.',
      maxRoomCapacity: 16,
    },
    {
      id: 'venue-2',
      name: 'Connaught Conservatory Hall',
      districtVicinity: 'Connaught Park Vicinity',
      cityDistrict: 'Central Kitsilano',
      distanceKm: 0.7,
      walkingMinutes: 9,
      mapX: 54,
      mapY: 62,
      approxLat: 49.2624,
      approxLng: -123.1592,
      accessibilityNotes: 'Level garden pathway, wide double doors, padded armchair seating.',
      safetyVerification: 'City-operated community hall with on-site caretaker and open public foyer.',
      maxRoomCapacity: 20,
    },
    {
      id: 'venue-3',
      name: 'Balsam Teahouse & Courtyard',
      districtVicinity: 'West Broadway & Balsam Vicinity',
      cityDistrict: 'Central Kitsilano',
      distanceKm: 0.9,
      walkingMinutes: 11,
      mapX: 46,
      mapY: 74,
      approxLat: 49.2636,
      approxLng: -123.1641,
      accessibilityNotes: 'Ramp entry, quiet acoustic corner away from espresso bar.',
      safetyVerification: 'Daytime staffed café tables reserved in full view of main counter.',
      maxRoomCapacity: 12,
    },
    {
      id: 'venue-4',
      name: 'Point Grey Boathouse Porch',
      districtVicinity: 'Kitsilano Beach Park Vicinity',
      cityDistrict: 'North Kitsilano',
      distanceKm: 1.2,
      walkingMinutes: 15,
      mapX: 67,
      mapY: 26,
      approxLat: 49.2738,
      approxLng: -123.1538,
      accessibilityNotes: 'Paved seawall access, covered porch benches, warm lighting.',
      safetyVerification: 'Public parks board pavilion with visible daylight promenade access.',
      maxRoomCapacity: 14,
    },
    {
      id: 'venue-5',
      name: 'Arbutus Mending Workshop',
      districtVicinity: 'Arbutus Greenway Vicinity',
      cityDistrict: 'East Kitsilano',
      distanceKm: 1.4,
      walkingMinutes: 17,
      mapX: 80,
      mapY: 56,
      approxLat: 49.2661,
      approxLng: -123.1494,
      accessibilityNotes: 'Street-level entry, adjustable worktables, bright daylight lamps.',
      safetyVerification: 'Registered non-profit textile studio with two stewards present.',
      maxRoomCapacity: 10,
    },
    {
      id: 'venue-far-excluded',
      name: 'Fraserview Banquet Annex (Outside Radius)',
      districtVicinity: 'South Vancouver District',
      cityDistrict: 'South Vancouver',
      distanceKm: 7.4,
      walkingMinutes: 92,
      mapX: 95,
      mapY: 95,
      approxLat: 49.2185,
      approxLng: -123.0652,
      accessibilityNotes: 'Outside local walking neighbourhood.',
      safetyVerification: 'Excluded automatically by proximity safety rule.',
      maxRoomCapacity: 40,
    },
  ],
  slots: [
    {
      id: 'slot-1',
      venueId: 'venue-1',
      date: '2026-11-17',
      startTime: '10:30',
      endTime: '12:00',
      maxCapacity: 12,
      status: 'reserved',
      reservedByProposalId: 'prop-seed-1',
      venueSafetyNote: 'Library quiet study room; front desk notified of public gathering.',
      createdAt: '2026-11-01T09:00:00Z',
    },
    {
      id: 'slot-2',
      venueId: 'venue-3',
      date: '2026-11-19',
      startTime: '14:00',
      endTime: '15:30',
      maxCapacity: 10,
      status: 'reserved',
      reservedByProposalId: 'prop-seed-2',
      venueSafetyNote: 'Sunlit front tables near counter; wheelchair accessible.',
      createdAt: '2026-11-02T10:00:00Z',
    },
    {
      id: 'slot-3',
      venueId: 'venue-2',
      date: '2026-11-21',
      startTime: '10:00',
      endTime: '11:30',
      maxCapacity: 16,
      status: 'reserved',
      reservedByProposalId: 'prop-seed-3',
      venueSafetyNote: 'Conservatory main hall; caretaker on-site.',
      createdAt: '2026-11-02T11:30:00Z',
    },
    {
      id: 'slot-4',
      venueId: 'venue-5',
      date: '2026-11-24',
      startTime: '13:30',
      endTime: '15:30',
      maxCapacity: 8,
      status: 'reserved',
      reservedByProposalId: 'prop-seed-4',
      venueSafetyNote: 'Daylight studio room; scissors and irons supervised by host.',
      createdAt: '2026-11-03T12:00:00Z',
    },
    {
      id: 'slot-5',
      venueId: 'venue-4',
      date: '2026-11-26',
      startTime: '09:30',
      endTime: '11:00',
      maxCapacity: 12,
      status: 'reserved',
      reservedByProposalId: 'prop-seed-5',
      venueSafetyNote: 'Public seawall shelter; dry indoor backup room available.',
      createdAt: '2026-11-04T09:00:00Z',
    },
    {
      id: 'slot-6',
      venueId: 'venue-1',
      date: '2026-11-28',
      startTime: '14:00',
      endTime: '15:30',
      maxCapacity: 12,
      status: 'available',
      venueSafetyNote: 'Main floor community table; librarian on duty.',
      createdAt: '2026-11-10T09:15:00Z',
    },
    {
      id: 'slot-7',
      venueId: 'venue-2',
      date: '2026-11-30',
      startTime: '15:00',
      endTime: '16:30',
      maxCapacity: 14,
      status: 'available',
      venueSafetyNote: 'Garden sunroom; accessible side ramp.',
      createdAt: '2026-11-11T14:00:00Z',
    },
    {
      id: 'slot-8',
      venueId: 'venue-3',
      date: '2026-12-02',
      startTime: '10:30',
      endTime: '12:00',
      maxCapacity: 10,
      status: 'available',
      venueSafetyNote: 'Reserved long oak table; quiet morning hours.',
      createdAt: '2026-11-12T08:30:00Z',
    },
  ],
  proposals: [
    {
      id: 'prop-seed-1',
      slotId: 'slot-1',
      venueId: 'venue-1',
      hostName: 'Eleanor Vance',
      hostBio: 'Retired librarian and Kitsilano resident for 22 years.',
      title: 'Tuesday Morning Short-Story Circle',
      description:
        'Join neighbours around a bright reading table for an unhurried hour of shared short fiction and thoughtful conversation. Each fortnight we choose one classic or contemporary story under twenty pages, so there is never heavy homework before you arrive. Whether you prefer to read a paragraph aloud or simply listen with a warm mug of herbal tea, every voice is valued equally. Newcomers and solo attendees are greeted at the library desk and introduced gently. Large-print copies are always provided on the table, and our gathering finishes promptly by noon so everyone has their afternoon free.',
      category: 'Books & Reading',
      requestedCapacity: 12,
      costLabel: 'Free',
      recurrence: 'Fortnightly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'published',
      createdAt: '2026-11-02T09:00:00Z',
      reviewedAt: '2026-11-02T14:00:00Z',
      publishedGatheringId: 'gath-1',
    },
    {
      id: 'prop-seed-2',
      slotId: 'slot-2',
      venueId: 'venue-3',
      hostName: 'David Chen',
      hostBio: 'Former ceramicist and neighbourhood walking group volunteer.',
      title: 'Afternoon Tea & Neighbourhood Tales',
      description:
        'Settle into a quiet sunlit corner of the Balsam Teahouse for friendly, unforced conversation over loose-leaf tea. This gathering was started for residents who would enjoy steady weekly company without loud music or crowded evening bars. We begin with a light prompt—such as a favourite local memory, recipe, or travel photograph—so nobody feels put on the spot. Most guests arrive on their own, and our host greets everyone at the teahouse door. There is no ticket fee; we simply ask participants to support our host café with a single cup of tea or pastry.',
      category: 'Tea & Conversation',
      requestedCapacity: 10,
      costLabel: '$5 min. tea spend',
      recurrence: 'Weekly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'published',
      createdAt: '2026-11-03T09:00:00Z',
      reviewedAt: '2026-11-03T16:00:00Z',
      publishedGatheringId: 'gath-2',
    },
    {
      id: 'prop-seed-3',
      slotId: 'slot-3',
      venueId: 'venue-2',
      hostName: 'Harriet Okafor',
      hostBio: 'Master Gardener volunteer and retired biology teacher.',
      title: 'Winter Seed Swap & Balcony Gardening',
      description:
        'Spend a restorative Saturday morning among potted ferns and citrus trees planning next spring’s window boxes, patios, and community plots. Bring leftover seed packets if you have them, or simply come empty-handed to learn what thrives in Kitsilano’s coastal shade and winter rain. We share practical tips on peat-free compost, raised ergonomic planters, and easy culinary herbs for apartment balconies. Seating is cushioned and step-free, with warm water and mugs provided. Solo visitors and first-time gardeners are warmly encouraged to join our welcoming table at Connaught Conservatory Hall.',
      category: 'Gardening & Nature',
      requestedCapacity: 16,
      costLabel: 'Free (optional $3 tea)',
      recurrence: 'Monthly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'published',
      createdAt: '2026-11-04T09:00:00Z',
      reviewedAt: '2026-11-04T15:00:00Z',
      publishedGatheringId: 'gath-3',
    },
    {
      id: 'prop-seed-4',
      slotId: 'slot-4',
      venueId: 'venue-5',
      hostName: 'Arthur Pendelton',
      hostBio: 'Retired tailor and community repair volunteer.',
      title: 'Visible Mending & Wool Darning Table',
      description:
        'Bring a favourite wool jumper, cardigan, or linen shirt that needs a careful stitch, button replacement, or tidy darn. Around a well-lit shared table on the Arbutus Greenway, we teach calm, practical mending techniques that extend the life of well-loved clothing while sharing easy conversation. Spare darning mushrooms, blunt tapestry needles, and natural yarns are included in the materials contribution. Beginners who have never threaded a needle are especially welcome, and experienced stitchers enjoy trading patterns. Our ground-floor workshop is bright, calm, and open strictly during daytime hours.',
      category: 'Crafts & Mending',
      requestedCapacity: 8,
      costLabel: '$6 materials',
      recurrence: 'Fortnightly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'published',
      createdAt: '2026-11-05T10:00:00Z',
      reviewedAt: '2026-11-05T13:30:00Z',
      publishedGatheringId: 'gath-4',
    },
    {
      id: 'prop-seed-5',
      slotId: 'slot-5',
      venueId: 'venue-4',
      hostName: 'Thomas MacLeod',
      hostBio: 'Amateur naturalist and local heritage docent.',
      title: 'Seawall Birdwatching & Gentle Stroll',
      description:
        'Meet at the covered Point Grey Boathouse Porch for a flat, unhurried morning walk along the paved seawall path watching winter sea ducks, herons, and bald eagles. We keep an easy conversational pace with frequent bench stops so nobody is left behind, and we return to the sheltered porch for warm flasks and shared field notes. Extra pairs of lightweight binoculars are on hand to borrow at no charge. Whether you have lived in Kitsilano for decades or just moved onto the block, this outdoor morning circle is designed for solo guests and friendly newcomers.',
      category: 'Walking & Local History',
      requestedCapacity: 12,
      costLabel: 'Free',
      recurrence: 'Weekly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'published',
      createdAt: '2026-11-06T08:00:00Z',
      reviewedAt: '2026-11-06T12:00:00Z',
      publishedGatheringId: 'gath-5',
    },
    {
      id: 'prop-pending-demo',
      slotId: 'slot-6',
      venueId: 'venue-1',
      hostName: 'Arthur Pendelton',
      hostBio: 'Retired tailor and community chess enthusiast.',
      title: 'Saturday Afternoon Gentle Chess & Backgammon',
      description:
        'Pull up a chair at the library community table for relaxed, non-competitive games of chess, backgammon, and cribbage. No clocks or tournament pressure—just friendly boards paired by interest and plenty of time to chat between moves. Boards and large-piece sets are supplied by the host, and newcomers who want a quick refresher on openings or scoring are always paired kindly. Every participant is welcomed individually at the library entrance, and all play remains strictly social in the public reading room.',
      category: 'Games & Puzzles',
      requestedCapacity: 10,
      costLabel: 'Free',
      recurrence: 'Weekly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguarding: {
        publicVenueConfirmed: true,
        inclusiveConductAgreed: true,
        vulnerableAdultAndChildSafe: true,
      },
      status: 'pending',
      createdAt: '2026-11-12T10:15:00Z',
    },
  ],
  gatherings: [
    {
      id: 'gath-1',
      proposalId: 'prop-seed-1',
      title: 'Tuesday Morning Short-Story Circle',
      summary:
        'Join neighbours around a bright reading table for an unhurried hour of shared short fiction and thoughtful conversation. Each fortnight we choose one classic or contemporary story under twenty pages, so there is never heavy homework before you arrive. Whether you prefer to read a paragraph aloud or simply listen with a warm mug of herbal tea, every voice is valued equally. Newcomers and solo attendees are greeted at the library desk and introduced gently. Large-print copies are always provided on the table, and our gathering finishes promptly by noon so everyone has their afternoon free.',
      category: 'Books & Reading',
      hostName: 'Eleanor Vance',
      hostNote: 'Retired librarian · Large-print copies provided',
      venueId: 'venue-1',
      costLabel: 'Free',
      recurrence: 'Fortnightly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguardingVerified: true,
      publishedAt: '2026-11-02T15:00:00Z',
    },
    {
      id: 'gath-2',
      proposalId: 'prop-seed-2',
      title: 'Afternoon Tea & Neighbourhood Tales',
      summary:
        'Settle into a quiet sunlit corner of the Balsam Teahouse for friendly, unforced conversation over loose-leaf tea. This gathering was started for residents who would enjoy steady weekly company without loud music or crowded evening bars. We begin with a light prompt—such as a favourite local memory, recipe, or travel photograph—so nobody feels put on the spot. Most guests arrive on their own, and our host greets everyone at the teahouse door. There is no ticket fee; we simply ask participants to support our host café with a single cup of tea or pastry.',
      category: 'Tea & Conversation',
      hostName: 'David Chen',
      hostNote: 'Former ceramicist · Quiet acoustic corner reserved',
      venueId: 'venue-3',
      costLabel: '$5 min. tea spend',
      recurrence: 'Weekly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguardingVerified: true,
      publishedAt: '2026-11-03T17:00:00Z',
    },
    {
      id: 'gath-3',
      proposalId: 'prop-seed-3',
      title: 'Winter Seed Swap & Balcony Gardening',
      summary:
        'Spend a restorative Saturday morning among potted ferns and citrus trees planning next spring’s window boxes, patios, and community plots. Bring leftover seed packets if you have them, or simply come empty-handed to learn what thrives in Kitsilano’s coastal shade and winter rain. We share practical tips on peat-free compost, raised ergonomic planters, and easy culinary herbs for apartment balconies. Seating is cushioned and step-free, with warm water and mugs provided. Solo visitors and first-time gardeners are warmly encouraged to join our welcoming table at Connaught Conservatory Hall.',
      category: 'Gardening & Nature',
      hostName: 'Harriet Okafor',
      hostNote: 'Master Gardener volunteer · Step-free conservatory',
      venueId: 'venue-2',
      costLabel: 'Free (optional $3 tea)',
      recurrence: 'Monthly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguardingVerified: true,
      publishedAt: '2026-11-04T16:00:00Z',
    },
    {
      id: 'gath-4',
      proposalId: 'prop-seed-4',
      title: 'Visible Mending & Wool Darning Table',
      summary:
        'Bring a favourite wool jumper, cardigan, or linen shirt that needs a careful stitch, button replacement, or tidy darn. Around a well-lit shared table on the Arbutus Greenway, we teach calm, practical mending techniques that extend the life of well-loved clothing while sharing easy conversation. Spare darning mushrooms, blunt tapestry needles, and natural yarns are included in the materials contribution. Beginners who have never threaded a needle are especially welcome, and experienced stitchers enjoy trading patterns. Our ground-floor workshop is bright, calm, and open strictly during daytime hours.',
      category: 'Crafts & Mending',
      hostName: 'Arthur Pendelton',
      hostNote: 'Retired tailor · All needles & wool supplied',
      venueId: 'venue-5',
      costLabel: '$6 materials',
      recurrence: 'Fortnightly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguardingVerified: true,
      publishedAt: '2026-11-05T14:30:00Z',
    },
    {
      id: 'gath-5',
      proposalId: 'prop-seed-5',
      title: 'Seawall Birdwatching & Gentle Stroll',
      summary:
        'Meet at the covered Point Grey Boathouse Porch for a flat, unhurried morning walk along the paved seawall path watching winter sea ducks, herons, and bald eagles. We keep an easy conversational pace with frequent bench stops so nobody is left behind, and we return to the sheltered porch for warm flasks and shared field notes. Extra pairs of lightweight binoculars are on hand to borrow at no charge. Whether you have lived in Kitsilano for decades or just moved onto the block, this outdoor morning circle is designed for solo guests and friendly newcomers.',
      category: 'Walking & Local History',
      hostName: 'Thomas MacLeod',
      hostNote: 'Local heritage docent · Spare binoculars available',
      venueId: 'venue-4',
      costLabel: 'Free',
      recurrence: 'Weekly',
      newcomersWelcome: true,
      soloFriendly: true,
      safeguardingVerified: true,
      publishedAt: '2026-11-06T13:00:00Z',
    },
  ],
  sessions: [
    {
      id: 'sess-1',
      gatheringId: 'gath-1',
      slotId: 'slot-1',
      venueId: 'venue-1',
      date: '2026-11-17',
      startTime: '10:30',
      endTime: '12:00',
      capacity: 12,
      rsvpParticipantIds: ['p-a', 'p-b', 'p-c', 'p-d', 'p-e', 'p-f'],
    },
    {
      id: 'sess-2',
      gatheringId: 'gath-2',
      slotId: 'slot-2',
      venueId: 'venue-3',
      date: '2026-11-19',
      startTime: '14:00',
      endTime: '15:30',
      capacity: 10,
      // Pre-seeded as FULL (10 of 10) to demonstrate disabled RSVP when full
      rsvpParticipantIds: ['p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-7', 'p-8', 'p-9', 'p-10'],
    },
    {
      id: 'sess-3',
      gatheringId: 'gath-3',
      slotId: 'slot-3',
      venueId: 'venue-2',
      date: '2026-11-21',
      startTime: '10:00',
      endTime: '11:30',
      capacity: 16,
      rsvpParticipantIds: ['resident-demo-01', 'p-k', 'p-l', 'p-m', 'p-n'],
    },
    {
      id: 'sess-4',
      gatheringId: 'gath-4',
      slotId: 'slot-4',
      venueId: 'venue-5',
      date: '2026-11-24',
      startTime: '13:30',
      endTime: '15:30',
      capacity: 8,
      rsvpParticipantIds: ['p-x', 'p-y', 'p-z'],
    },
    {
      id: 'sess-5',
      gatheringId: 'gath-5',
      slotId: 'slot-5',
      venueId: 'venue-4',
      date: '2026-11-26',
      startTime: '09:30',
      endTime: '11:00',
      capacity: 12,
      rsvpParticipantIds: ['p-q', 'p-r', 'p-s', 'p-t'],
    },
  ],
};

function cloneInitialState(): AppState {
  return JSON.parse(JSON.stringify(INITIAL_STATE)) as AppState;
}

export function loadState(): AppState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = cloneInitialState();
      saveState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed || !Array.isArray(parsed.venues) || !Array.isArray(parsed.sessions)) {
      return cloneInitialState();
    }
    return parsed;
  } catch {
    return cloneInitialState();
  }
}

export function saveState(state: AppState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors in restricted preview contexts
  }
}

export function resetDemoState(): AppState {
  const fresh = cloneInitialState();
  saveState(fresh);
  return fresh;
}

/**
 * Safety & Proximity Guardrail: Only return venues inside the single neighbourhood radius.
 */
export function getLocalVenues(state: AppState): Venue[] {
  return state.venues.filter((v) => v.distanceKm <= state.maxNeighbourhoodRadiusKm);
}

export function getVenueById(state: AppState, venueId: string): Venue | undefined {
  return state.venues.find((v) => v.id === venueId);
}

export function getNextConfirmedSession(sessions: GatheringSession[]): GatheringSession | null {
  if (sessions.length === 0) return null;
  const sorted = [...sessions].sort((a, b) => {
    const da = `${a.date}T${a.startTime}`;
    const db = `${b.date}T${b.startTime}`;
    return da.localeCompare(db);
  });
  return sorted[0] ?? null;
}

export function getPublishedGatheringsWithSessions(state: AppState): GatheringWithSessions[] {
  const localVenuesMap = new Map(getLocalVenues(state).map((v) => [v.id, v]));

  return state.gatherings
    .map((gathering) => {
      const venue = localVenuesMap.get(gathering.venueId);
      if (!venue) return null; // Enforces single-neighbourhood proximity rule
      const sessions = state.sessions
        .filter((s) => s.gatheringId === gathering.id)
        .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`));
      const nextConfirmedSession = getNextConfirmedSession(sessions);
      return {
        gathering,
        venue,
        sessions,
        nextConfirmedSession,
      };
    })
    .filter((item): item is GatheringWithSessions => item !== null)
    .sort((a, b) => {
      const da = a.nextConfirmedSession
        ? `${a.nextConfirmedSession.date}T${a.nextConfirmedSession.startTime}`
        : '9999-12-31';
      const db = b.nextConfirmedSession
        ? `${b.nextConfirmedSession.date}T${b.nextConfirmedSession.startTime}`
        : '9999-12-31';
      return da.localeCompare(db);
    });
}

export interface ActionResult {
  ok: boolean;
  message: string;
  state: AppState;
}

export function addVenueSlot(
  state: AppState,
  input: {
    venueId: string;
    date: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    venueSafetyNote: string;
  }
): ActionResult {
  const venue = getVenueById(state, input.venueId);
  if (!venue) {
    return { ok: false, message: 'Please choose a verified local venue.', state };
  }
  if (venue.distanceKm > state.maxNeighbourhoodRadiusKm) {
    return {
      ok: false,
      message: `Safety boundary: Venues more than ${state.maxNeighbourhoodRadiusKm} km away cannot be listed in this neighbourhood.`,
      state,
    };
  }
  if (!input.date || !input.startTime || !input.endTime) {
    return { ok: false, message: 'Please provide a date, start time, and end time.', state };
  }
  if (input.endTime <= input.startTime) {
    return { ok: false, message: 'End time must be after start time.', state };
  }
  const safeCap = Math.max(2, Math.min(input.maxCapacity, venue.maxRoomCapacity));

  const newSlot: TimeSlot = {
    id: `slot-${Date.now()}`,
    venueId: venue.id,
    date: input.date,
    startTime: input.startTime,
    endTime: input.endTime,
    maxCapacity: safeCap,
    status: 'available',
    venueSafetyNote:
      input.venueSafetyNote.trim() || 'Public venue space with on-site staff awareness.',
    createdAt: new Date().toISOString(),
  };

  const nextState: AppState = {
    ...state,
    slots: [newSlot, ...state.slots],
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Available slot listed at ${venue.name} for ${input.date}.`,
    state: nextState,
  };
}

export function submitProposal(
  state: AppState,
  input: {
    slotId: string;
    title: string;
    description: string;
    category: InterestCategory;
    requestedCapacity: number;
    costLabel: string;
    recurrence: RecurrenceOption;
    newcomersWelcome: boolean;
    soloFriendly: boolean;
    safeguarding: SafeguardingChecklist;
  }
): ActionResult {
  const slot = state.slots.find((s) => s.id === input.slotId);
  if (!slot) {
    return { ok: false, message: 'Selected venue slot could not be found.', state };
  }
  if (slot.status !== 'available') {
    return {
      ok: false,
      message: 'This slot has already been reserved by an approved gathering.',
      state,
    };
  }
  if (!input.title.trim() || !input.description.trim()) {
    return { ok: false, message: 'Please enter both a gathering title and description.', state };
  }
  if (
    !input.safeguarding.publicVenueConfirmed ||
    !input.safeguarding.inclusiveConductAgreed ||
    !input.safeguarding.vulnerableAdultAndChildSafe
  ) {
    return {
      ok: false,
      message: 'Please confirm all three community safeguarding commitments before submitting.',
      state,
    };
  }
  if (input.requestedCapacity < 2 || input.requestedCapacity > slot.maxCapacity) {
    return {
      ok: false,
      message: `Requested capacity must be between 2 and ${slot.maxCapacity} for this room.`,
      state,
    };
  }

  const newProposal: Proposal = {
    id: `prop-${Date.now()}`,
    slotId: slot.id,
    venueId: slot.venueId,
    hostName: state.demoHostName,
    hostBio: 'Neighbourhood resident & community host.',
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    requestedCapacity: input.requestedCapacity,
    costLabel: input.costLabel.trim() || 'Free',
    recurrence: input.recurrence,
    newcomersWelcome: input.newcomersWelcome,
    soloFriendly: input.soloFriendly,
    safeguarding: input.safeguarding,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const nextState: AppState = {
    ...state,
    proposals: [newProposal, ...state.proposals],
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Proposal "${newProposal.title}" submitted for Venue Manager review.`,
    state: nextState,
  };
}

export function approveProposal(state: AppState, proposalId: string): ActionResult {
  const proposal = state.proposals.find((p) => p.id === proposalId);
  if (!proposal) {
    return { ok: false, message: 'Proposal not found.', state };
  }
  if (proposal.status !== 'pending') {
    return { ok: false, message: 'Only pending proposals can be approved.', state };
  }
  const slot = state.slots.find((s) => s.id === proposal.slotId);
  if (!slot) {
    return { ok: false, message: 'Associated slot not found.', state };
  }
  // Guardrail: Prevent a second approval for an already-reserved slot
  if (slot.status === 'reserved') {
    return {
      ok: false,
      message: 'Cannot approve: this time slot is already reserved by another approved proposal.',
      state,
    };
  }

  const now = new Date().toISOString();
  const nextSlots = state.slots.map((s) =>
    s.id === slot.id
      ? { ...s, status: 'reserved' as const, reservedByProposalId: proposal.id }
      : s
  );

  const nextProposals = state.proposals.map((p) =>
    p.id === proposal.id
      ? { ...p, status: 'approved' as const, reviewedAt: now }
      : p
  );

  const nextState: AppState = {
    ...state,
    slots: nextSlots,
    proposals: nextProposals,
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Approved "${proposal.title}". The slot on ${slot.date} is now reserved.`,
    state: nextState,
  };
}

export function declineProposal(
  state: AppState,
  proposalId: string,
  reason = 'Time slot or group capacity did not fit this week’s venue schedule.'
): ActionResult {
  const proposal = state.proposals.find((p) => p.id === proposalId);
  if (!proposal) {
    return { ok: false, message: 'Proposal not found.', state };
  }
  if (proposal.status !== 'pending') {
    return { ok: false, message: 'Only pending proposals can be declined.', state };
  }

  const nextProposals = state.proposals.map((p) =>
    p.id === proposal.id
      ? {
          ...p,
          status: 'declined' as const,
          declineReason: reason.trim() || 'Declined by venue manager.',
          reviewedAt: new Date().toISOString(),
        }
      : p
  );

  const nextState: AppState = {
    ...state,
    proposals: nextProposals,
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Proposal "${proposal.title}" has been declined.`,
    state: nextState,
  };
}

export function publishProposal(state: AppState, proposalId: string): ActionResult {
  const proposal = state.proposals.find((p) => p.id === proposalId);
  if (!proposal) {
    return { ok: false, message: 'Proposal not found.', state };
  }
  // Guardrail: Allow publishing ONLY after approval
  if (proposal.status !== 'approved') {
    return {
      ok: false,
      message: 'Publishing is only allowed after a Venue Manager has approved your proposal.',
      state,
    };
  }
  const slot = state.slots.find((s) => s.id === proposal.slotId);
  if (!slot || slot.reservedByProposalId !== proposal.id) {
    return {
      ok: false,
      message: 'This proposal does not hold a confirmed slot reservation.',
      state,
    };
  }

  const gatheringId = `gath-${Date.now()}`;
  const sessionId = `sess-${Date.now()}`;

  const newGathering: Gathering = {
    id: gatheringId,
    proposalId: proposal.id,
    title: proposal.title,
    summary: proposal.description,
    category: proposal.category,
    hostName: proposal.hostName,
    hostNote: `${proposal.hostBio} · Safeguarding pledge verified`,
    venueId: proposal.venueId,
    costLabel: proposal.costLabel,
    recurrence: proposal.recurrence,
    newcomersWelcome: proposal.newcomersWelcome,
    soloFriendly: proposal.soloFriendly,
    safeguardingVerified: true,
    publishedAt: new Date().toISOString(),
  };

  // Guardrail: Each approved slot covers one dated session
  const newSession: GatheringSession = {
    id: sessionId,
    gatheringId,
    slotId: slot.id,
    venueId: slot.venueId,
    date: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    capacity: proposal.requestedCapacity,
    rsvpParticipantIds: [],
  };

  const nextProposals = state.proposals.map((p) =>
    p.id === proposal.id
      ? {
          ...p,
          status: 'published' as const,
          publishedGatheringId: gatheringId,
        }
      : p
  );

  const nextState: AppState = {
    ...state,
    proposals: nextProposals,
    gatherings: [newGathering, ...state.gatherings],
    sessions: [...state.sessions, newSession],
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Published "${newGathering.title}" with confirmed session on ${slot.date}. Participants can now discover and RSVP.`,
    state: nextState,
  };
}

export function rsvpToSession(state: AppState, sessionId: string): ActionResult {
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) {
    return { ok: false, message: 'Session not found.', state };
  }
  const participantId = state.demoParticipantId;
  // Guardrail: Prevent duplicate RSVPs
  if (session.rsvpParticipantIds.includes(participantId)) {
    return {
      ok: false,
      message: 'You already have a confirmed RSVP for this session.',
      state,
    };
  }
  // Guardrail: Disable / block RSVP when session is full
  if (session.rsvpParticipantIds.length >= session.capacity) {
    return {
      ok: false,
      message: 'This session is currently full.',
      state,
    };
  }

  const nextSessions = state.sessions.map((s) =>
    s.id === session.id
      ? { ...s, rsvpParticipantIds: [...s.rsvpParticipantIds, participantId] }
      : s
  );

  const nextState: AppState = {
    ...state,
    sessions: nextSessions,
  };
  saveState(nextState);
  return {
    ok: true,
    message: `RSVP confirmed for ${session.date} (${session.startTime}–${session.endTime}). Added to My Gatherings.`,
    state: nextState,
  };
}

export function cancelRsvp(state: AppState, sessionId: string): ActionResult {
  const session = state.sessions.find((s) => s.id === sessionId);
  if (!session) {
    return { ok: false, message: 'Session not found.', state };
  }
  const participantId = state.demoParticipantId;
  if (!session.rsvpParticipantIds.includes(participantId)) {
    return { ok: false, message: 'No RSVP found to cancel.', state };
  }

  const nextSessions = state.sessions.map((s) =>
    s.id === session.id
      ? {
          ...s,
          rsvpParticipantIds: s.rsvpParticipantIds.filter((id) => id !== participantId),
        }
      : s
  );

  const nextState: AppState = {
    ...state,
    sessions: nextSessions,
  };
  saveState(nextState);
  return {
    ok: true,
    message: `Your RSVP for ${session.date} has been cancelled so another neighbour can take the place.`,
    state: nextState,
  };
}

export function formatFriendlyDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dateObj);
}

export function getDayOfWeek(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return '';
  const dateObj = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(dateObj);
}

export function formatTimeRange(start: string, end: string): string {
  const to12 = (hhmm: string) => {
    const [hStr, mStr] = hhmm.split(':');
    const h = Number(hStr);
    const m = Number(mStr);
    if (!Number.isFinite(h)) return hhmm;
    const suffix = h >= 12 ? 'pm' : 'am';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
  };
  return `${to12(start)} – ${to12(end)}`;
}
