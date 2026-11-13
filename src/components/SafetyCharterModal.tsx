import React, { useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

interface SafetyCharterModalProps {
  isOpen: boolean;
  onClose: () => void;
  radiusKm: number;
}

export const SafetyCharterModal: React.FC<SafetyCharterModalProps> = ({
  isOpen,
  onClose,
  radiusKm,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-charter-title"
        className="bg-white border border-stone-300 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-[#14532D] shrink-0" aria-hidden="true" />
            <h2
              id="safety-charter-title"
              className="font-display text-2xl font-bold text-stone-900"
            >
              Neighbourhood Safeguarding & Privacy Charter
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close safety charter"
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-stone-300 text-stone-800 hover:bg-stone-100"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 space-y-5 text-base text-stone-800 leading-relaxed">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              1. Public Third-Place Venues Only
            </h3>
            <p className="mt-1 text-stone-700">
              Every gathering is hosted inside a vetted public venue—such as a municipal library,
              community conservatory, staffed café, or park pavilion—with clear exits and on-site
              stewards. Private residences are never listed.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              2. Strict Walking-Distance Boundary ({radiusKm} km)
            </h3>
            <p className="mt-1 text-stone-700">
              To reduce travel strain and keep gatherings rooted in familiar streets, venues outside
              the {radiusKm} km Kitsilano neighbourhood boundary are automatically excluded from
              discovery and booking.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              3. District-Only Vicinity & Data Privacy
            </h3>
            <p className="mt-1 text-stone-700">
              Public maps, tables, and pop-ups display only the city district vicinity (for example,
              “Connaught Park Vicinity · Kitsilano”). Personal contact details, phone numbers, and
              attendee lists are never exposed publicly.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              4. Protecting Children, Seniors & Vulnerable Residents
            </h3>
            <p className="mt-1 text-stone-700">
              Hosts must affirm a three-part safeguarding pledge before a Venue Manager can review
              their proposal: public daylight/staffed hours, respectful inclusive conduct, and strict
              supervision standards ensuring no unsupervised minors or vulnerable-adult isolation.
              Venue Managers retain full authority to decline proposals or reserve rooms for one
              verified gathering per slot.
            </p>
          </div>
        </div>

        <div className="mt-7 pt-4 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white font-semibold hover:bg-[#0F3F22] transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
