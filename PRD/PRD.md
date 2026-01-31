# PRD — Local Manual Search + AI Assistant + Community (MVP)

**Product name (working):** CollabWrk Manuals (or “Manual Assist”)  
**Platform (MVP):** iOS (React Native)  
**Language (MVP):** English  
**Geography:** Global  
**Target audience:** Industrial technicians / electricians / automation techs who troubleshoot equipment using PDF manuals.

---

## 1. Problem statement

Technicians often lose time searching long PDF manuals, cross-referencing common faults, and asking for help in scattered forums. Existing solutions either:
- require manuals to be hosted/redistributed (legal + licensing risk), or
- lack structured, searchable, model-aware troubleshooting knowledge.

**We will:** keep manuals **on-device** while enabling fast manual search, model-number detection, citations-based AI help, and a structured community request system.

---

## 2. Goals and success criteria

### 2.1 Goals (MVP)
1. **Fast manual search** across on-device PDFs with accurate page-level results.
2. **Model-number auto-detect** on import so users can quickly filter/search by model.
3. **AI answers with citations** using only small, relevant manual excerpts sent to the backend.
4. **Community threads + request board** with required tagging to improve discoverability.
5. **Private area** for saved searches, bookmarks, and saved threads.
6. **Supplier directory** (manual/curated) with “nearest” sorting (location opt-in).

### 2.2 Non-goals (MVP)
- Real-time chat / messaging.
- Uploading or hosting full manuals in the cloud.
- Supplier stock/availability.
- Android support.
- Full offline AI (AI requires backend call in MVP).
- Multi-language UI (English only in MVP).

### 2.3 Success metrics
- **Activation:** % of new users importing at least 1 PDF and performing 1 search within 24h.
- **Search efficiency:** median time from query → opening correct page (goal: reduce vs baseline).
- **AI usefulness:** thumbs-up rate on AI answers; % of answers with valid citations.
- **Community health:** requests created/week, solve rate, median time-to-first-response.
- **Retention:** D7 and D30 retention among active technicians.
- **Privacy adherence:** 0 incidents of full-manual upload; audit logs show snippet-only behavior.

---

## 3. Personas

1. **Field Technician (primary)**
   - Needs quick answers onsite; low patience for long reading.
   - Often knows model numbers and symptoms (“alarm code 32”, “no suction”, “VFD trips”).

2. **Senior Tech / Mentor**
   - Solves requests; values reputation/points.
   - Wants structured posting and searchable history.

3. **Operations / Company Admin (later)**
   - Seat management and compliance oversight.
   - Not critical for MVP, but impacts auth + company join.

---

## 4. Core user journeys (MVP)

### 4.1 Import and identify manual
1. User signs in and joins/creates company seat.
2. User imports a PDF from device storage.
3. App extracts first 3–8 pages text → detects model numbers → user confirms/edits.
4. Manual appears in library with model(s) and last-opened.

### 4.2 Search manual and open correct page
1. User opens manual detail.
2. User searches keyword(s) (e.g., “E14”, “pressure switch”, “wiring diagram”).
3. Results show sections with page numbers.
4. Tap result opens PDF viewer at page.

### 4.3 Ask AI with citations (RAG)
1. From manual detail or results, user taps “Ask AI”.
2. App retrieves top relevant chunks (5–12) locally.
3. Backend returns answer + citations (chunk/page range) + suggested faults.
4. User taps a citation to jump to page.

### 4.4 Community request to solve a fault
1. User creates a request: model number(s), symptoms, tags.
2. Another user “picks up” the request, comments, marks solved.
3. Solver gets points; request becomes a reusable artifact.

### 4.5 Discover “most searched” suggestions
1. Manual detail shows “Most searched in this manual”.
2. Suggestions based on aggregated anonymized search events tied to manual fingerprint hash.

### 4.6 Find supplier
1. When model/manual is known, user opens Suppliers.
2. App shows curated suppliers sorted by distance (if location is granted).

---

## 5. Product requirements

### 5.1 Functional requirements

#### A) Auth + company seats
- **FR-A1**: Sign-in with email/password (or SSO later).
- **FR-A2**: User must have **real name** (first + last).
- **FR-A3**: Join company via invite code/link.
- **FR-A4**: Seat assignment enforced on backend.

#### B) Manual library + import
- **FR-B1**: Import PDF from iOS Files / Share sheet.
- **FR-B2**: Store PDF reference locally (file path / secure bookmark).
- **FR-B3**: Create a **manual fingerprint hash** locally (privacy-safe).
- **FR-B4**: Show manual cards: model(s), manufacturer (optional), last opened.

#### C) Indexing + search
- **FR-C1**: Extract text with page mapping.
- **FR-C2**: Chunk text with `page_start`, `page_end`, `chunk_id`.
- **FR-C3**: Keyword search across chunks (must-have).
- **FR-C4**: Results list shows snippet + page range.
- **FR-C5**: Tap result opens PDF at correct page.

#### D) Model-number auto-detect (model-first)
- **FR-D1**: On import, parse first 3–8 pages and run model regex + heuristics.
- **FR-D2**: Output: model number(s) primary, optional manufacturer guess, confidence.
- **FR-D3**: Confirmation/edit UI; persist final model(s).

#### E) AI answer with citations
- **FR-E1**: On-device retrieval selects top chunks (5–12).
- **FR-E2**: Backend `/ai/answer` uses **only provided chunks**.
- **FR-E3**: Response includes answer + citations mapping to pages.
- **FR-E4**: If insufficient context, AI must say: “Not found in this manual” + suggest posting a Request.
- **FR-E5**: UI includes “Common faults” panel (threads/requests links).

#### F) Private area
- **FR-F1**: Save searches per manual.
- **FR-F2**: Bookmarks with optional note.
- **FR-F3**: Save community thread locally to a “Saved” list.

#### G) Community (no realtime chat)
- **FR-G1**: Threads: create/read with required tags/categories.
- **FR-G2**: Requests: create, pickup, comment, mark solved.
- **FR-G3**: Points + ranking from solved requests.
- **FR-G4**: Search/filter threads/requests by tags + model number.

#### H) Global “most searched” suggestions
- **FR-H1**: Log anonymized search events to backend (query hash + fingerprint hash).
- **FR-H2**: Fetch top searches per manual fingerprint.
- **FR-H3**: Show suggestions on manual detail.

#### I) Suppliers (directory)
- **FR-I1**: Supplier records: name, geo, contact, supported brands.
- **FR-I2**: Sort by nearest if location granted.
- **FR-I3**: Filter by brand/model if available.

---

### 5.2 Non-functional requirements

- **NFR-1 Privacy:** Never upload full PDFs. Only send small excerpts (chunks) to backend for AI.
- **NFR-2 Security:** Encrypt sensitive local data at rest where feasible; use HTTPS/TLS; secure auth tokens.
- **NFR-3 Performance:**  
  - Import + indexing should complete within a reasonable time (target: < 60–120s for typical manuals).  
  - Search results should appear quickly (target: < 500ms after index built).
- **NFR-4 Reliability:** Index versioning and recovery if indexing interrupted.
- **NFR-5 Observability:** Capture errors and latency for import/index/search/AI endpoints.
- **NFR-6 Compliance:** Clear terms: user is responsible for manual acquisition; app does not redistribute manuals.

---

## 6. UX / Screens (MVP)

1. **Sign-in / Company Join**
   - Real name, email, password
   - Join via invite

2. **Manual Library**
   - Import PDF button
   - Manual card: model(s), manufacturer (optional), last opened

3. **Manual Detail**
   - Search bar
   - “Most searched in this manual”
   - Bookmarks + saved searches
   - Ask AI entry point

4. **Search Results**
   - Ranked list with snippets + page range
   - Tap → PDF viewer at page

5. **Ask AI**
   - Answer + citations
   - “Common faults” (threads/requests links)

6. **Community**
   - Threads list + filters
   - Thread create (required tags/models)
   - Save thread

7. **Request Board**
   - Create request (symptoms, model, tags)
   - Pickup / comment / solve
   - Points + ranking

8. **Suppliers**
   - Directory list
   - “Nearest” sorting (opt-in location)

9. **Profile**
   - Real name, company, points, rank, solved count

---

## 7. Data model (MVP)

### 7.1 Local (on device)
- `LocalManual`: `id`, `file_path`, `fingerprint_hash`, `detected_models[]`, `detected_brand?`, `confidence`, `text_index_version`, `created_at`
- `LocalManualChunk`: `manual_id`, `chunk_id`, `page_start`, `page_end`, `text`, `embedding?` (optional)
- `SavedSearch`: `manual_id`, `query`, `created_at`
- `Bookmark`: `manual_id`, `page`, `note?`
- `SavedThread`: `thread_id`, `saved_at`

### 7.2 Cloud
- `Company`, `Seat`
- `User`: `real_name`, `email`, `company_id`, `role`
- `Thread`: `title`, `body`, `tags[]`, `models[]`, `created_by`
- `Request`: `title`, `symptoms`, `tags[]`, `models[]`, `status`, `picked_by`, `solved_by`
- `Reputation`: `user_id`, `points`, `solved_count`, `rank`
- `SearchEvent`: `manual_fingerprint_hash`, `query_hash`, `top_chunk_ids[]`, `timestamp`
- `Supplier`: `name`, `geo`, `contact`, `brands_supported[]`

---

## 8. API contract (MVP)

### Auth / Company
- `POST /auth/login`
- `POST /company/invite`
- `GET /company/seats`

### Threads
- `GET /threads?tag=&model=`
- `POST /threads`
- `POST /threads/{id}/save` *(optional; saving can be local-only in MVP)*

### Requests
- `GET /requests?status=&model=`
- `POST /requests`
- `POST /requests/{id}/pickup`
- `POST /requests/{id}/solve`

### Reputation
- `GET /leaderboard`
- `GET /users/{id}/reputation`

### Analytics
- `POST /search-events`
- `GET /manuals/{fingerprint}/top-searches`

### AI
- `POST /ai/answer`
  - **input:** `{question, manual_fingerprint, chunks:[{text,page_start,page_end,chunk_id}], model_numbers[]}`
  - **output:** `{answer, citations:[{chunk_id,page_start,page_end}], suggested_faults:[thread/request refs]}`

### Suppliers
- `GET /suppliers/nearby?lat=&lng=&brand=&model=`

---

## 9. AI / RAG design (MVP)

### 9.1 Retrieval flow
1. On-device keyword retrieval (required)
2. Select top 5–12 chunks with page mapping
3. Send chunks + question to `/ai/answer`
4. LLM must:
   - answer only from chunks
   - always include citations
   - refuse when insufficient

### 9.2 “Common faults”
- MVP: derive from **solved requests** + curated fault tags.
- Promote recurring issues per model to “Common faults” list with links.

### 9.3 Guardrails
- Strict instruction: “Use only provided context.”
- Output structure enforced server-side (JSON schema).
- If citations missing or hallucination suspected → fallback response.

---

## 10. Analytics & events (MVP)

### 10.1 Key events
- `manual_imported` (manual fingerprint, models detected, duration)
- `manual_indexed` (chunks count, index version, duration)
- `manual_opened`
- `manual_searched` (fingerprint, query hash, top chunk ids)
- `ai_asked` (fingerprint, model numbers, chunks count)
- `ai_answer_rated` (thumbs up/down)
- `thread_created`, `thread_viewed`, `thread_saved`
- `request_created`, `request_picked`, `request_solved`

### 10.2 Privacy rules for events
- Never send full query text; send **query_hash**.
- Never send full PDF content; only the selected small chunks for AI requests.
- Manual identity via **fingerprint_hash** only.

---

## 11. Privacy, security, and legal notes (MVP)

- Manuals are user-provided and remain on-device.
- Cloud receives:
  - anonymized search events tied to manual fingerprint
  - small excerpt chunks for AI answering
- Terms must clearly state:
  - users must have lawful access to manuals
  - app does not redistribute manuals
- Location is opt-in and only used for supplier proximity.

---

## 12. Dependencies and tech assumptions

- React Native iOS app
- PDF parsing + text extraction library with page mapping
- Backend: Auth, community APIs, analytics, AI endpoint
- Vector DB optional (server-side) only for community content; manuals are local-only
- LLM provider behind `/ai/answer` with citation-first prompting and schema enforcement

---

## 13. Risks and mitigations

1. **Text extraction quality varies** (scanned PDFs)
   - MVP: support text PDFs; detect “no text” and inform user
   - Later: OCR optional

2. **Hallucinated AI responses**
   - Strict chunk-only prompting + schema + citation requirement
   - Refuse if insufficient evidence

3. **Privacy concerns**
   - Enforce snippet-only uploads
   - Audit logging on backend for payload sizes / chunk counts

4. **Tagging quality in community**
   - Required tags/models on post
   - Moderation tools later

---

## 14. Milestones (implementation order)

1. Foundations: RN app shell, auth/company join, PDF import, viewer
2. Local indexing: extraction + chunking + keyword search + open-at-page
3. Model-number auto-detect + confirm/edit UI
4. AI answers with citations + “not found” fallback
5. Private area: saved searches, bookmarks, saved threads
6. Community: threads + requests + points/ranking
7. Global top searches (search events + suggestions)
8. Supplier directory + nearby sorting

---

## 15. Open questions (to resolve during build)
- Seat pricing + invite flow specifics (admin vs self-serve).
- Exact model-number detection rules per manufacturer (regex library scope).
- Moderation policy for community content and abuse handling.
- Offline behavior when backend unavailable (queue events; disable AI).
- “Supplier directory” sourcing and update workflow.

