import React, { useState } from 'react';
import { Compass, MapPin, Shield } from 'lucide-react';
import { DistrictGeoResult, lookupDistrictVicinity } from '../services/nominatim';
import { formatFriendlyDate, formatTimeRange } from '../data/gatheringsStore';
import { GatheringWithSessions } from '../types/gatherings';

interface NeighbourhoodMapProps {
  items: GatheringWithSessions[];
  selectedGatheringId: string | null;
  onSelectGathering: (gatheringId: string) => void;
  onOpenPopup: (item: GatheringWithSessions) => void;
  neighbourhoodName: string;
  cityName: string;
  radiusKm: number;
}

export const NeighbourhoodMap: React.FC<NeighbourhoodMapProps> = ({
  items,
  selectedGatheringId,
  onSelectGathering,
  onOpenPopup,
  neighbourhoodName,
  cityName,
  radiusKm,
}) => {
  const [geoResult, setGeoResult] = useState<DistrictGeoResult | null>(null);
  const [isLookingUp, setIsLookingUp] = useState(false);

  const selectedItem =
    items.find((i) => i.gathering.id === selectedGatheringId) ?? items[0] ?? null;

  const handleVerifyDistrict = async () => {
    setIsLookingUp(true);
    const res = await lookupDistrictVicinity(`${neighbourhoodName}, ${cityName}`);
    setGeoResult(res);
    setIsLookingUp(false);
  };

  return (
    <section
      aria-labelledby="map-section-heading"
      className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <h2
            id="map-section-heading"
            className="font-display text-2xl font-bold text-stone-900"
          >
            {neighbourhoodName} Neighbourhood Gathering Map
          </h2>
          <p className="mt-1 text-base text-stone-700 max-w-2xl">
            Only public third-place venues within {radiusKm} km walking distance are pinned. For
            privacy and safety, pins indicate city district vicinity only.
          </p>
        </div>

        <button
          type="button"
          onClick={handleVerifyDistrict}
          disabled={isLookingUp}
          className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-lg border border-stone-300 bg-[#FAF7F2] text-stone-900 text-sm font-semibold hover:bg-stone-100 transition-colors whitespace-nowrap shrink-0"
        >
          <Compass className="w-4 h-4 text-[#14532D] shrink-0" aria-hidden="true" />
          <span>
            {isLookingUp
              ? 'Checking OpenStreetMap...'
              : 'Verify District via OpenStreetMap'}
          </span>
        </button>
      </div>

      {geoResult && (
        <div
          role="status"
          className="mt-4 p-3.5 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-sm text-stone-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <span>
            <strong>Verified District Vicinity:</strong> {geoResult.displayName} (
            {geoResult.source === 'nominatim-live'
              ? 'OpenStreetMap Nominatim keyless API'
              : 'Verified local district bounds'}
            )
          </span>
          <span className="tabular-nums text-stone-700 font-medium">
            District Centre: {geoResult.lat.toFixed(4)}, {geoResult.lon.toFixed(4)}
          </span>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Interactive Geographical District Map */}
        <div className="lg:col-span-8 relative rounded-xl border border-stone-300 bg-[#EAE6DC] overflow-hidden min-h-[380px] sm:min-h-[430px]">
          <svg
            viewBox="0 0 800 480"
            role="img"
            aria-label={`Geographical map of ${neighbourhoodName}, ${cityName} showing ${items.length} gathering pins within ${radiusKm} kilometres`}
            className="w-full h-full block select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* English Bay Shoreline (North) */}
            <rect x="0" y="0" width="800" height="480" fill="#F2EFE7" />
            <path
              d="M 0,0 L 800,0 L 800,82 Q 620,66 470,84 T 190,94 Q 90,104 0,92 Z"
              fill="#D2E3EA"
            />
            <text
              x="410"
              y="44"
              textAnchor="middle"
              fill="#2B5468"
              fontSize="14"
              fontWeight="600"
              letterSpacing="1.5"
            >
              ENGLISH BAY · KITSILANO SHORELINE
            </text>

            {/* Neighbourhood Parks */}
            {/* Kitsilano Beach Park */}
            <path
              d="M 465,86 Q 555,74 635,96 L 620,152 L 460,148 Z"
              fill="#D4E4CF"
              stroke="#A9C4A1"
              strokeWidth="1.5"
            />
            <text x="542" y="118" textAnchor="middle" fill="#2B5434" fontSize="12" fontWeight="600">
              Kitsilano Beach Park
            </text>

            {/* Connaught Park */}
            <rect
              x="365"
              y="265"
              width="125"
              height="74"
              rx="8"
              fill="#D4E4CF"
              stroke="#A9C4A1"
              strokeWidth="1.5"
            />
            <text x="427" y="306" textAnchor="middle" fill="#2B5434" fontSize="12" fontWeight="600">
              Connaught Park
            </text>

            {/* Major Neighbourhood Streets (West-East) */}
            <g stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round">
              <path d="M 30,132 Q 360,115 770,138" fill="none" />
              <line x1="20" y1="215" x2="780" y2="215" />
              <line x1="20" y1="355" x2="780" y2="355" />
            </g>
            <g stroke="#D6CFC2" strokeWidth="1.5" fill="none">
              <path d="M 30,132 Q 360,115 770,138" />
              <line x1="20" y1="215" x2="780" y2="215" />
              <line x1="20" y1="355" x2="780" y2="355" />
            </g>

            {/* Major Neighbourhood Streets (North-South) */}
            <g stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round">
              <line x1="160" y1="95" x2="160" y2="455" />
              <line x1="335" y1="90" x2="335" y2="455" />
              <line x1="515" y1="88" x2="515" y2="455" />
              <path d="M 655,105 L 635,455" fill="none" />
            </g>
            {/* Arbutus Greenway */}
            <path
              d="M 655,105 L 635,455"
              stroke="#84A98C"
              strokeWidth="3"
              strokeDasharray="6 4"
              fill="none"
            />

            {/* Street Labels (High Contrast) */}
            <text x="235" y="207" fill="#57534E" fontSize="12" fontWeight="600">
              West 4th Avenue
            </text>
            <text x="235" y="347" fill="#57534E" fontSize="12" fontWeight="600">
              West Broadway
            </text>
            <text x="168" y="425" fill="#57534E" fontSize="11" fontWeight="600">
              Alma St
            </text>
            <text x="344" y="425" fill="#57534E" fontSize="11" fontWeight="600">
              Macdonald St
            </text>
            <text x="523" y="425" fill="#57534E" fontSize="11" fontWeight="600">
              Arbutus St
            </text>
            <text x="650" y="395" fill="#2B5434" fontSize="11" fontWeight="600">
              Arbutus Greenway
            </text>

            {/* 1.8 km Walking Radius Boundary Circle */}
            <circle
              cx="415"
              cy="255"
              r="185"
              fill="rgba(20, 83, 45, 0.04)"
              stroke="#14532D"
              strokeWidth="2"
              strokeDasharray="8 6"
            />
            <text
              x="415"
              y="456"
              textAnchor="middle"
              fill="#14532D"
              fontSize="12"
              fontWeight="700"
            >
              Local Walking Boundary ({radiusKm} km radius · Nearby public venues only)
            </text>

            {/* Resident Neighbourhood Centre Marker */}
            <circle cx="415" cy="255" r="7" fill="#57534E" stroke="#FFFFFF" strokeWidth="2.5" />
            <text x="415" y="242" textAnchor="middle" fill="#1C1917" fontSize="11" fontWeight="700">
              Your District Centre
            </text>
          </svg>

          {/* Accessible HTML Pin Buttons overlaid on exact map percentages */}
          {items.map((item, idx) => {
            const isSelected = selectedItem?.gathering.id === item.gathering.id;
            const pinNumber = idx + 1;
            const spotsLeft = item.nextConfirmedSession
              ? Math.max(
                  0,
                  item.nextConfirmedSession.capacity -
                    item.nextConfirmedSession.rsvpParticipantIds.length
                )
              : 0;

            return (
              <button
                key={item.gathering.id}
                type="button"
                onClick={() => onSelectGathering(item.gathering.id)}
                onDoubleClick={() => onOpenPopup(item)}
                style={{
                  left: `${item.venue.mapX}%`,
                  top: `${item.venue.mapY}%`,
                }}
                aria-pressed={isSelected}
                aria-label={`Pin ${pinNumber}: ${item.gathering.title} in ${item.venue.districtVicinity}. ${spotsLeft} places left.`}
                className={`absolute -translate-x-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center group transition-transform ${
                  isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'
                }`}
              >
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-bold shadow-md border-2 transition-colors ${
                    isSelected
                      ? 'bg-[#14532D] text-white border-white'
                      : 'bg-white text-stone-900 border-[#14532D] group-hover:bg-[#ECFDF5]'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">{pinNumber}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pin Quick Inspector Panel */}
        <aside
          aria-label="Selected map pin details"
          className="lg:col-span-4 rounded-xl border border-stone-200 bg-[#FAF7F2] p-5 flex flex-col justify-between"
        >
          {selectedItem ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#14532D]">
                Selected Pin · {selectedItem.venue.districtVicinity}
              </p>
              <h3 className="mt-1.5 font-display text-xl font-bold text-stone-900">
                {selectedItem.gathering.title}
              </h3>
              <p className="mt-2 text-sm text-stone-700">
                <strong>Venue:</strong> {selectedItem.venue.name} ({selectedItem.venue.walkingMinutes}{' '}
                min walk)
              </p>
              <p className="mt-1 text-sm text-stone-700">
                <strong>Host:</strong> {selectedItem.gathering.hostName}
              </p>
              {selectedItem.nextConfirmedSession && (
                <p className="mt-1 text-sm text-stone-700 tabular-nums">
                  <strong>Next Confirmed Date:</strong>{' '}
                  {formatFriendlyDate(selectedItem.nextConfirmedSession.date)} (
                  {formatTimeRange(
                    selectedItem.nextConfirmedSession.startTime,
                    selectedItem.nextConfirmedSession.endTime
                  )}
                  )
                </p>
              )}
              <p className="mt-1 text-sm text-stone-700">
                <strong>Price:</strong> {selectedItem.gathering.costLabel}
              </p>
              <p className="mt-3 text-sm text-stone-800 line-clamp-4 leading-relaxed">
                {selectedItem.gathering.summary}
              </p>
            </div>
          ) : (
            <p className="text-base text-stone-700">
              No published gatherings currently have pins on the map.
            </p>
          )}

          <div className="mt-5 pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-start gap-2 text-xs text-stone-700">
              <Shield className="w-4 h-4 text-[#14532D] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                District vicinity only is shown here to protect residents and venues.
              </span>
            </div>
            {selectedItem && (
              <button
                type="button"
                onClick={() => onOpenPopup(selectedItem)}
                className="w-full px-4 py-2.5 min-h-[44px] rounded-lg bg-[#14532D] text-white text-sm font-semibold hover:bg-[#0F3F22] transition-colors"
              >
                Open Full Gathering Pop-up & RSVP
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};
