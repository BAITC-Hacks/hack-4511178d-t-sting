import dotenv from 'dotenv';
import express from 'express';
import OpenAI from 'openai';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { instructions, studySchema, validateTranscript, parseResponse } from './lib/study.mjs';

dotenv.config({ quiet: true });

export function createApp({ apiKey = process.env.OPENAI_API_KEY, model = process.env.OPENAI_MODEL || 'gpt-4.1-mini', client } = {}) {
  const app = express();
  app.disable('x-powered-by');
  const openai = client || (apiKey?.trim() ? new OpenAI({ apiKey, timeout: 60_000, maxRetries: 0 }) : null);
  app.use((_req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
    next();
  });
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  // 160 KiB also accommodates 20,000 characters encoded as JSON Unicode escapes.
  app.use('/api', (_req, res, next) => { res.set('Cache-Control', 'no-store'); next(); });
  app.use(express.json({ limit: '160kb' }));
  app.post('/api/generate', async (req, res) => {
    let transcript;
    try {
      if (!req.is('application/json')) return res.status(415).json({ error: 'Send a JSON body with a transcript string.' });
      transcript = validateTranscript(req.body?.transcript);
    } catch (error) { return res.status(400).json({ error: error.message }); }
    if (!openai) return res.status(503).json({ error: 'Generation is not configured. Set OPENAI_API_KEY on the server and restart it.' });
    let response;
    try {
      response = await openai.responses.create({
        model, instructions, input: [{ role: 'user', content: transcript }],
        text: { format: { type: 'json_schema', name: 'study_pack', strict: true, schema: studySchema } },
        store: false, max_output_tokens: 5000,
      });
    } catch (error) {
      if (error.name === 'APIConnectionTimeoutError' || error.name === 'AbortError') {
        return res.status(504).json({ error: 'Generation timed out. Please try again.' });
      }
      if (error.status === 429) return res.status(429).json({ error: 'The AI provider rate or quota limit was reached. Check API quota or try again later.' });
      if ([401, 403, 404].includes(error.status)) return res.status(503).json({ error: 'AI access is unavailable. Check the server API key, project access, and configured model.' });
      return res.status(502).json({ error: 'The AI provider is unavailable or could not process this request. Check server configuration and try again.' });
    }
    try { return res.json({ pack: parseResponse(response, transcript) }); }
    catch (error) { return res.status(502).json({ error: error.message }); }
  });
  app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));
  app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));
  app.use((error, _req, res, _next) => {
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Request body is too large. Lecture text must be at most 20,000 characters.' });
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON. Send an object with a transcript string.' });
    return res.status(400).json({ error: 'The request could not be read. Send a valid JSON body.' });
  });
  return app;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error('PORT must be an integer from 1 to 65535.');
    process.exit(1);
  }
  const server = createApp().listen(port, '0.0.0.0', () => console.log(`LectureKit listening on port ${port}`));
  server.on('error', () => { console.error('Server could not start. Check PORT and whether it is already in use.'); process.exit(1); });
}
