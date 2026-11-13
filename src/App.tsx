import { useMemo, useState } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import {
  addVenueSlot,
  approveProposal,
  cancelRsvp,
  declineProposal,
  getPublishedGatheringsWithSessions,
  loadState,
  publishProposal,
  resetDemoState,
  rsvpToSession,
  submitProposal,
} from './data/gatheringsStore';
import {
  ActiveTab,
  AppState,
  DemoRole,
  InterestCategory,
  RecurrenceOption,
  SafeguardingChecklist,
} from './types/gatherings';
import { Header } from './components/Header';
import { RoleSwitcherBar } from './components/RoleSwitcherBar';
import { ParticipantView } from './components/ParticipantView';
import { NeighbourhoodMap } from './components/NeighbourhoodMap';
import { EventSummaryTable } from './components/EventSummaryTable';
import { HostView } from './components/HostView';
import { VenueManagerView } from './components/VenueManagerView';
import { EventDetailModal } from './components/EventDetailModal';
import { SafetyCharterModal } from './components/SafetyCharterModal';

interface FeedbackBanner {
  type: 'success' | 'error';
  text: string;
}

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState());
  const [activeRole, setActiveRole] = useState<DemoRole>('participant');
  const [activeTab, setActiveTab] = useState<ActiveTab>('participant');
  const [selectedMapGatheringId, setSelectedMapGatheringId] = useState<string | null>(null);
  const [popupGatheringId, setPopupGatheringId] = useState<string | null>(null);
  const [isSafetyOpen, setIsSafetyOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackBanner | null>(null);

  const publishedItems = useMemo(() => getPublishedGatheringsWithSessions(state), [state]);

  const popupItem = useMemo(
    () => publishedItems.find((i) => i.gathering.id === popupGatheringId) ?? null,
    [publishedItems, popupGatheringId]
  );

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'participant' || tab === 'map') {
      setActiveRole('participant');
    } else if (tab === 'host') {
      setActiveRole('host');
    } else if (tab === 'venue_manager') {
      setActiveRole('venue_manager');
    }
  };

  const handleSwitchRole = (role: DemoRole) => {
    setActiveRole(role);
    if (role === 'participant') {
      setActiveTab('participant');
    } else if (role === 'host') {
      setActiveTab('host');
    } else {
      setActiveTab('venue_manager');
    }
  };

  const handleResetDemo = () => {
    const fresh = resetDemoState();
    setState(fresh);
    setPopupGatheringId(null);
    setSelectedMapGatheringId(null);
    setFeedback({
      type: 'success',
      text: 'Demo state reset to initial Kitsilano neighbourhood gatherings.',
    });
  };

  const handleRsvp = (sessionId: string) => {
    const res = rsvpToSession(state, sessionId);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const handleCancelRsvp = (sessionId: string) => {
    const res = cancelRsvp(state, sessionId);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const handleAddSlot = (input: {
    venueId: string;
    date: string;
    startTime: string;
    endTime: string;
    maxCapacity: number;
    venueSafetyNote: string;
  }) => {
    const res = addVenueSlot(state, input);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
    return res.ok;
  };

  const handleSubmitProposal = (input: {
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
  }) => {
    const res = submitProposal(state, input);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
    return res.ok;
  };

  const handleApproveProposal = (proposalId: string) => {
    const res = approveProposal(state, proposalId);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const handleDeclineProposal = (proposalId: string, reason: string) => {
    const res = declineProposal(state, proposalId, reason);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  const handlePublishProposal = (proposalId: string) => {
    const res = publishProposal(state, proposalId);
    setState(res.state);
    setFeedback({ type: res.ok ? 'success' : 'error', text: res.message });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-stone-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#14532D] focus:text-white focus:rounded-lg"
      >
        Skip to main content
      </a>

      <Header
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenSafetyCharter={() => setIsSafetyOpen(true)}
      />

      <RoleSwitcherBar
        activeRole={activeRole}
        onSwitchRole={handleSwitchRole}
        onResetDemo={handleResetDemo}
        neighbourhoodName={state.neighbourhoodName}
        cityName={state.cityName}
        radiusKm={state.maxNeighbourhoodRadiusKm}
      />

      <main id="main-content" className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {/* Live Accessible Status Feedback */}
        {feedback && (
          <div
            role="status"
            aria-live="polite"
            className={`mb-6 p-4 rounded-xl border flex items-start justify-between gap-4 ${
              feedback.type === 'success'
                ? 'bg-[#ECFDF5] border-[#6EE7B7] text-[#14532D]'
                : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
            }`}
          >
            <div className="flex items-start gap-3 text-base font-medium">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Dismiss message"
              className="p-1.5 min-h-[36px] min-w-[36px] rounded-lg hover:bg-black/5 flex items-center justify-center shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {activeTab === 'participant' && (
          <ParticipantView
            items={publishedItems}
            demoParticipantId={state.demoParticipantId}
            demoParticipantName={state.demoParticipantName}
            onRsvp={handleRsvp}
            onCancelRsvp={handleCancelRsvp}
            onOpenPopup={(item) => setPopupGatheringId(item.gathering.id)}
            onJumpToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <NeighbourhoodMap
              items={publishedItems}
              selectedGatheringId={selectedMapGatheringId}
              onSelectGathering={(id) => setSelectedMapGatheringId(id)}
              onOpenPopup={(item) => setPopupGatheringId(item.gathering.id)}
              neighbourhoodName={state.neighbourhoodName}
              cityName={state.cityName}
              radiusKm={state.maxNeighbourhoodRadiusKm}
            />

            <EventSummaryTable
              items={publishedItems}
              selectedGatheringId={selectedMapGatheringId}
              demoParticipantId={state.demoParticipantId}
              onSelectGathering={(id) => setSelectedMapGatheringId(id)}
              onOpenPopup={(item) => setPopupGatheringId(item.gathering.id)}
              onRsvp={handleRsvp}
            />
          </div>
        )}

        {activeTab === 'host' && (
          <HostView
            state={state}
            onSubmitProposal={handleSubmitProposal}
            onPublishProposal={handlePublishProposal}
          />
        )}

        {activeTab === 'venue_manager' && (
          <VenueManagerView
            state={state}
            onAddSlot={handleAddSlot}
            onApproveProposal={handleApproveProposal}
            onDeclineProposal={handleDeclineProposal}
          />
        )}
      </main>

      <footer className="bg-white border-t border-stone-200 mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-stone-700">
          <p>
            Kitsilano Third Place · Single-neighbourhood community demo · © OpenStreetMap
            contributors, ODbL.
          </p>
          <button
            type="button"
            onClick={() => setIsSafetyOpen(true)}
            className="text-left sm:text-right font-semibold text-[#14532D] hover:underline"
          >
            Read Neighbourhood Safeguarding & Privacy Charter
          </button>
        </div>
      </footer>

      <EventDetailModal
        item={popupItem}
        demoParticipantId={state.demoParticipantId}
        onClose={() => setPopupGatheringId(null)}
        onRsvp={handleRsvp}
        onCancelRsvp={handleCancelRsvp}
      />

      <SafetyCharterModal
        isOpen={isSafetyOpen}
        onClose={() => setIsSafetyOpen(false)}
        radiusKm={state.maxNeighbourhoodRadiusKm}
      />
    </div>
  );
}
