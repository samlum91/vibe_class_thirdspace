export type DemoRole = 'participant' | 'host' | 'venue_manager';

export type ActiveTab = 'participant' | 'map' | 'host' | 'venue_manager';

export type InterestCategory =
  | 'Books & Reading'
  | 'Tea & Conversation'
  | 'Gardening & Nature'
  | 'Crafts & Mending'
  | 'Games & Puzzles'
  | 'Walking & Local History'
  | 'Music & Choir';

export type RecurrenceOption = 'One-off' | 'Weekly' | 'Fortnightly' | 'Monthly';

export type SlotStatus = 'available' | 'reserved';

export type ProposalStatus = 'pending' | 'approved' | 'declined' | 'published';

export interface Venue {
  id: string;
  name: string;
  /** City district vicinity only — never expose private or exact street addresses before RSVP */
  districtVicinity: string;
  cityDistrict: string;
  /** Distance from neighbourhood centre in kilometres (enforced <= 1.8 km) */
  distanceKm: number;
  walkingMinutes: number;
  /** Normalized map position (0-100%) on the single-neighbourhood canvas */
  mapX: number;
  mapY: number;
  /** Approximate district centroid lat/lng (never exact building doorstep) */
  approxLat: number;
  approxLng: number;
  accessibilityNotes: string;
  safetyVerification: string;
  maxRoomCapacity: number;
}

export interface TimeSlot {
  id: string;
  venueId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM (24h)
  endTime: string; // HH:MM (24h)
  maxCapacity: number;
  status: SlotStatus;
  reservedByProposalId?: string;
  venueSafetyNote: string;
  createdAt: string;
}

export interface SafeguardingChecklist {
  publicVenueConfirmed: boolean;
  inclusiveConductAgreed: boolean;
  vulnerableAdultAndChildSafe: boolean;
}

export interface Proposal {
  id: string;
  slotId: string;
  venueId: string;
  hostName: string;
  hostBio: string;
  title: string;
  /** ~100-word warm, readable summary for the expandable table & event pop-up */
  description: string;
  category: InterestCategory;
  requestedCapacity: number;
  costLabel: string;
  recurrence: RecurrenceOption;
  newcomersWelcome: boolean;
  soloFriendly: boolean;
  safeguarding: SafeguardingChecklist;
  status: ProposalStatus;
  declineReason?: string;
  createdAt: string;
  reviewedAt?: string;
  publishedGatheringId?: string;
}

export interface Gathering {
  id: string;
  proposalId?: string;
  title: string;
  summary: string;
  category: InterestCategory;
  hostName: string;
  hostNote: string;
  venueId: string;
  costLabel: string;
  recurrence: RecurrenceOption;
  newcomersWelcome: boolean;
  soloFriendly: boolean;
  safeguardingVerified: boolean;
  publishedAt: string;
}

export interface GatheringSession {
  id: string;
  gatheringId: string;
  slotId?: string;
  venueId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  capacity: number;
  /** List of participant IDs (privacy-preserving: only IDs stored locally, no personal contact details) */
  rsvpParticipantIds: string[];
}

export interface GatheringWithSessions {
  gathering: Gathering;
  venue: Venue;
  sessions: GatheringSession[];
  nextConfirmedSession: GatheringSession | null;
}

export interface AppState {
  demoParticipantId: string;
  demoParticipantName: string;
  demoHostName: string;
  demoVenueManagerName: string;
  neighbourhoodName: string;
  cityName: string;
  maxNeighbourhoodRadiusKm: number;
  venues: Venue[];
  slots: TimeSlot[];
  proposals: Proposal[];
  gatherings: Gathering[];
  sessions: GatheringSession[];
}
