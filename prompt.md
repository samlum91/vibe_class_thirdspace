# Collated Session Prompts

This document collates all user prompts from the build session in chronological order. Any credentials shared during git operations have been redacted.

---

## Prompt 1 — Core Application Specification

```markdown
#-----R: ROLE-----------------------
You are a senior front-end developer with expertise in vanilla JavaScript, responsive UI, and serverless functions on Vercel. You follow Material Design and hold every element to WCAG 2.1 AA.

#---------G: GOAL---------------------
Help people find a third place beyond home and work through recurring neighbourhood gatherings. Connect participants and communities, hosts who organise activities, and venues with space to offer.
Build a dashboard with these components:
1. A geographical map with all the events located on the map as pins.
2. A table summary of the pinned events from the map that can be expanded to show a 100 word detail of the event.
3. At the next level, show a pop-up of each event that provides more detail of the event: Headline, Summary, Venue, time, Date, Price and showing only the vicinity of the event, by city district.
Finally, make the following journey interactive in a single browser:
1. A venue manager lists an available slot.
2. A host selects the slot and submits a gathering proposal.
3. The venue manager approves the proposal, reserving the slot.
4. The host publishes the gathering.
5. A participant discovers it, RSVPs for a specific session, and can see the next confirmed date when one exists.

#---------O: Output---------------------
Build the working app in the preview with three views:
- Map: A geographical map with all the events located on the map as pins.
- Participant: Browse published gatherings, filter by interest or day, and see the venue, host, date, cost, and whether newcomers or solo attendees are welcome. RSVP for a session and view it under 'My Gatherings'.
- Host: Browse available slots, submit a proposal, track its Pending, Approved, or Declined status, and publish it after approval. Include title, description, category, capacity, cost or minimum spend, and an optional recurrence setting.
- Venue Manager: Add available slots, review proposals with the requested time and group size, and approve or decline each proposal.
Open on the participant discovery page. Add a clearly labelled demo role switcher for Participant, Host, and Venue Manager. Use English throughout, with warm colours, readable event cards, and layouts that work on phones and laptops.

#---------G: Guardrails---------------------
- Keep the build frontend-only. Use shared browser state persisted in localStorage. The preview must run without a server, account setup, API keys, or external services.
- Keep mock data and data operations in a small TypeScript module separate from the UI components, so I can replace the local implementation with a backend API later.
- Simulate the workflow rules in the demo: reserve a slot on approval, prevent a second approval for a reserved slot, and allow publishing only after approval.
- Model gatherings and dated sessions separately. Each approved slot covers one session. Track capacity and RSVPs per session, prevent duplicate RSVPs for the demo participant, and disable RSVP when a session is full.
- Keep the scope to one neighbourhood. Leave backend integration, authentication, payments, chat, reviews, and maps for a later version.
- Also follow the following rules: "Reduce the risk of meeting the wrong people". Do not show venues that are too far from the user. Retain data privacy. "Create safe practices that keep venues, hosts, children, and vulnerable people safe from ALL harm."

#---------C: Context---------------------
Audience: 45 to 70 years old who might need simple interfaces, strong HTML/CSS, limited JS. Environment: built in Google AI Studio, versioned in GitHub, hosted on Vercel. We will be using a keyless API by Nominatim (OpenStreetMap).
```

---

## Prompt 2 — Git Push (Initial Release)

```text
git push
https://[REDACTED_TOKEN]@github.com/samlum91/vibe_class_thirdspace.git
```

---

## Prompt 3 — Vercel Serverless Nominatim Backend

```text
1. Add a serverless connection to Nominatim (OpenStreetMap) for geocoding, hosted as Vercel serverless functions. I am choosing Nominatim on purpose (no key, no card, global coverage, low-volume use). Do not swap it for another provider.
   # Forward geocoding (address or place name -> coordinates):
   {NOMINATIM_BASE_URL}/search?q=<query>&format=json&limit=1
   # Reverse geocoding (coordinates -> address):
   {NOMINATIM_BASE_URL}/reverse?lat=<lat>&lon=<lon>&format=json
   # Every request needs an identifying header:
   User-Agent: <NOMINATIM_USER_AGENT> (format: YourProduct/1.0 (https://your-app.vercel.app; you@example.com))

2. Store this in an /api folder at project root level (not in /src), so Vercel deploys each file as a serverless function.

3. Put /health.ts, /search.ts and /reverse.ts in the same subfolder:
   /api/geocode/health.ts -> checks env vars are set and calls {NOMINATIM_BASE_URL}/status?format=json
   /api/geocode/search.ts -> GET ?q=... returns { lat, lon, displayName }
   /api/geocode/reverse.ts -> GET ?lat=...&lon=... returns { displayName, address }

4. Do not hardcode any URL, contact detail or header value. I will add them later as Vercel environment variables:
   NOMINATIM_BASE_URL (e.g. https://nominatim.openstreetmap.org)
   NOMINATIM_USER_AGENT (product name + site URL + contact email)
   The app must be able to switch geocoding provider by changing NOMINATIM_BASE_URL only, with no code change.

CONTEXT (Nominatim usage policy, which the build must follow):
- Max 1 request per second for the whole application. Throttle server-side and return HTTP 429 with a friendly message if exceeded.
- Cache results. Set Cache-Control: public, s-maxage=86400, stale-while-revalidate=604800 on successful responses so Vercel's CDN serves repeat lookups, and store coordinates once geocoded rather than re-querying.
- No autocomplete or search-as-you-type. Geocode only when the user submits the form.
- Stock library User-Agents get a 403. Always send NOMINATIM_USER_AGENT from the server. Never call Nominatim directly from the browser.
- lat and lon come back as strings. Convert them with Number() and validate them before returning, storing or doing any maths.
- Validate inputs: q is required and trimmed (max 200 chars); lat must be between -90 and 90 and lon between -180 and 180. Return 400 otherwise.
- If there are no results, return 404 { error: "No match found" }. If upstream fails, return 502 without leaking upstream details.
- Display "© OpenStreetMap contributors, ODbL" wherever results or maps are shown.
- Non-commercial, low-volume use only. Do not resell results or build a geocoding-centred service. Access can be withdrawn without notice.
Use TypeScript with @vercel/node types (VercelRequest, VercelResponse) and the built-in fetch. Allow GET only (405 otherwise).
```

---

## Prompt 4 — Git Push (Serverless Proxy Update)

```text
git push
https://[REDACTED_TOKEN]@github.com/samlum91/vibe_class_thirdspace.git
```

---

## Prompt 5 — Keep Serverless Files Grouped & Keyless Response Cleanup

```text
reorganize my files. it should include /health.ts and all the relevant folders store within the same sub folder of api.

nominato is a keyless service it should not return environment variables here.

no further changes
```

---

## Prompt 6 — Git Push (Response Cleanup)

```text
git push
https://[REDACTED_TOKEN]@github.com/samlum91/vibe_class_thirdspace.git
```

---

## Prompt 7 — Move Endpoints Directly Into `/api` (Remove `geocode` Subfolder)

```text
reorganize my files. i do not need geocode subfolder. the api folder should directly include /health.ts and all the relevant folders store within the same sub folder of api.
nominatim is a keyless service it should not return environment variables here.
```

---

## Prompt 8 — Redo Backend Specification Under `/api`

```text
redo the backend with the following:

1. Add a serverless connection to Nominatim (OpenStreetMap) for geocoding,
   hosted as Vercel serverless functions. I am choosing Nominatim on purpose
   (no key, no card, global coverage, low-volume use). Do not swap it for
   another provider.

   # Forward geocoding (address or place name -> coordinates):
   {NOMINATIM_BASE_URL}/search?q=<query>&format=json&limit=1

   # Reverse geocoding (coordinates -> address):
   {NOMINATIM_BASE_URL}/reverse?lat=<lat>&lon=<lon>&format=json

   # Every request needs an identifying header:
   User-Agent: <NOMINATIM_USER_AGENT>
   (format: YourProduct/1.0 (https://vibe-class-thirdspace-db2nb3z0x-samlum91.vercel.app/; samuellum@gmail.com))

2. Store this in an /api folder at project root level (not in /src), so
   Vercel deploys each file as a serverless function.

3. Put /health.ts, /search.ts and /reverse.ts in the same folder:
   /api/health.ts   -> checks env vars are set and calls {NOMINATIM_BASE_URL}/status?format=json
   /api/search.ts   -> GET ?q=...  returns { lat, lon, displayName }
   /api/reverse.ts  -> GET ?lat=...&lon=...  returns { displayName, address }

4. Do not hardcode any URL, contact detail or header value. I will add them
   later as Vercel environment variables:
   NOMINATIM_BASE_URL     (e.g. https://nominatim.openstreetmap.org)
   NOMINATIM_USER_AGENT   (product name + site URL + contact email)
   The app must be able to switch geocoding provider by changing
   NOMINATIM_BASE_URL only, with no code change.

CONTEXT (Nominatim usage policy, which the build must follow):
- Max 1 request per second for the whole application. Throttle server-side
  and return HTTP 429 with a friendly message if exceeded.
- Cache results. Set Cache-Control: public, s-maxage=86400,
  stale-while-revalidate=604800 on successful responses so Vercel's CDN
  serves repeat lookups, and store coordinates once geocoded rather than
  re-querying.
- No autocomplete or search-as-you-type. Geocode only when the user submits
  the form.
- Stock library User-Agents get a 403. Always send NOMINATIM_USER_AGENT
  from the server. Never call Nominatim directly from the browser.
- lat and lon come back as strings. Convert them with Number() and validate
  them before returning, storing or doing any maths.
- Validate inputs: q is required and trimmed (max 200 chars); lat must be
  between -90 and 90 and lon between -180 and 180. Return 400 otherwise.
- If there are no results, return 404 { error: "No match found" }. If
  upstream fails, return 502 without leaking upstream details.
- Display "© OpenStreetMap contributors, ODbL" wherever results or maps are
  shown.
- Non-commercial, low-volume use only. Do not resell results or build a
  geocoding-centred service. Access can be withdrawn without notice.

Use TypeScript with @vercel/node types (VercelRequest, VercelResponse) and
the built-in fetch. Allow GET only (405 otherwise).
```

---

## Prompt 9 — Git Push (Reorganized `/api` Backend)

```text
git push
https://[REDACTED_TOKEN]@github.com/samlum91/vibe_class_thirdspace.git
```

---

## Prompt 10 — Collate Prompts

```text
collate all the prompt to prompt md
```
