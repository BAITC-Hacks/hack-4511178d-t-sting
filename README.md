# LectureKit

Paste a lecture and generate four study materials: a concise **summary**, separate **key points**, an interactive **quiz with correct answers and explanations**, and **flashcards with answers**. After checking the quiz, review cards for the topics you missed.

## Run

Requires Node.js 22+ with npm, an OpenAI API key with API quota and access to the configured model, and outbound HTTPS access to OpenAI.

```sh
npm install
cp .env.example .env
# Set OPENAI_API_KEY in .env using your editor. Never put it in frontend code.
npm start
```

Open [LectureKit locally](http://localhost:3000). This is a local address, not a public deployment.

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

`.env` is loaded on the server and ignored by Git. Environment variables can also be supplied by the host. Change `OPENAI_MODEL` to a model your API project can access that supports Responses structured outputs. Restart after changing configuration. The server starts without a key; generation then returns a clear configuration error.

```sh
npm run check
npm test
```

No frontend build step is needed. In this implementation environment, Node 24.19.0 was supplied by the desktop runtime, and npm commands were executed through its cached `pnpm dlx npm` runner because npm was not on PATH. A normal Node/npm installation uses the commands above.

## Use

1. Paste 300–20,000 trimmed characters of lecture text and choose **Generate study materials**. These are prototype limits; counts use JavaScript UTF-16 string length. Oversized input is rejected, never truncated.
2. Read **Lecture summary** and **Key points** in Overview. Expand **Lecture excerpt** to inspect support. Source ambiguity or limited coverage may appear in notes.
3. Choose **Take the quiz**, answer every question, then **Check answers**. See the score, correct answers, explanations, and excerpts. Answers stay locked until **Retry quiz**.
4. Choose **Review missed topics**. Reveal a card's answer, then use Previous/Next. Switch between All topics and Missed topics. If nothing was missed, review all cards; before checking the quiz, the missed deck explains that no results exist yet.
5. Edit the transcript or generate again. Editing immediately hides old material; each generation clears answers, score, filter, and revealed cards. Failure preserves the text and lets you explicitly retry. Clear removes the current session's input and results.

The repository includes `test/fixtures/synthetic-lecture.txt`, authored for this implementation: an explicitly fictional seed experiment with several topics, quantities, and exceptions. It is software test material, not an authentic lecture or gardening advice. It is not preloaded into the UI and never serves as fallback output. No authentic selected lecture was supplied or validated. The pre-existing design-prompt document is preserved unchanged; no competition reuse permission is asserted.

## Architecture

Express serves only `public/` and the same-origin API. `POST /api/generate` accepts `{ "transcript": "..." }`, returns `{ "pack": StudyPack }` or `{ "error": "..." }`, and makes one server-side OpenAI Responses request per valid click, with separate high-priority instructions, strict JSON Schema, `store: false`, a 5,000-token output budget, a 60-second SDK timeout, and zero automatic retries. The browser times out after 70 seconds. `lib/study.mjs` owns the schema, instructions, and ordinary-code validation. Each of one to six topic bundles contains a key point, source quote, quiz, and flashcard; topic indices connect missed questions to cards. Quiz and revision state live only in page memory. Validation rejects incomplete packs, malformed choices, incorrect index ranges, and quotes absent from the transcript after whitespace normalization. No topic is silently discarded and no generated-content cache is used. See the [OpenAI structured outputs documentation](https://developers.openai.com/api/docs/guides/structured-outputs).

## Features and limits

Implemented: all four outputs, predominant-lecture-language generation with an English interface, excerpt disclosures, source notes, complete quiz feedback, missed-topic revision, fresh reruns, accessible status/errors, safe text rendering, and responsive plain CSS.

Intentionally omitted: accounts, database, persistence/localStorage, uploads, audio/video, chat, export, embeddings, agent frameworks, streaming, analytics, and deployment automation.

Model quality varies. Instructions require lecture-only content and preserved conditions, exceptions, and unresolved contradictions, but the model can still make unsupported claims or ambiguous questions. A matching excerpt proves only that the text exists; it does not establish that every generated claim follows from it. The source itself may contain errors. There is no claim of fact-checking or proven learning benefits. Short or ambiguous lectures may support fewer topics; unsupported or unusable output is rejected. API availability, quota, model access, latency, and hosting uptime remain external dependencies. The unauthenticated prototype provides no per-user quota controls.

**Privacy:** Lecture text is sent to the OpenAI API. This app does not persist or log transcripts, has no cross-user generated state, and stores browser results only in memory until clear/reload. `store: false` is sent to the API; this does not promise provider-side zero retention. Keep credentials server-side. API responses use `Cache-Control: no-store`.

## Verification performed

- Dependency installation completed; npm reported zero vulnerabilities at installation time.
- `npm run check` passed for server, validation module, and browser JavaScript.
- `npm test` passed all 9 node:test cases: input boundaries/types; valid and incomplete packs; invalid answer indices/options; fabricated and whitespace-varied quotes; malformed/refused/incomplete output; HTTP health/assets/private-file isolation; body size and Unicode-escaped input; missing configuration; safe provider errors/timeouts; and one request per generation with changed input forwarded. Provider mocks exist only inside automated tests and do not test actual model quality.
- `npm start` started the server without credentials. HTTP smoke checks confirmed `/health`, `/`, `/app.js`, `/styles.css`, and clear invalid-input rejection.
- Browser checked empty-input rejection, the live endpoint's missing-key error with the synthetic lecture preserved, restored controls, explicit retry, and Clear. No generated results were substituted.
- **Blocked:** no `OPENAI_API_KEY` was available. Real generation, provider acceptance of the schema, all four live outputs, semantic inspection against the source, the changed-lecture live request, and the successful Generate → Quiz → missed-topic cards → Generate again browser journey remain unverified. No public deployment was performed. No authentic selected-lecture check was performed.

The sandbox initially blocked package networking and local listeners; installation and socket-based checks succeeded with the environment's approved network/socket access.

## Node-service hosting settings

No existing deployment configuration was present. For a generic Node service, install locked dependencies with `npm ci`, run `npm start`, and configure `OPENAI_API_KEY`, optional `OPENAI_MODEL`, and the host's `PORT`. The server listens on `0.0.0.0`; use `GET /health` (returns `{ "status": "ok" }`) as the health check. Allow outgoing HTTPS to OpenAI and request durations exceeding 60 seconds. Serve the frontend and API together. Health indicates process availability, not working OpenAI credentials. No cloud resources were provisioned.

External runtime dependencies: Express (HTTP/static serving), the official `openai` SDK (Responses API), and dotenv (server configuration); transitive versions are recorded in `package-lock.json`. Tests use built-in `node:test`. No external browser assets or new browser-test framework are required.
