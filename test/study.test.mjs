import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateTranscript, validatePack, parseResponse } from '../lib/study.mjs';
import { createApp } from '../server.mjs';

const transcript = await readFile(new URL('./fixtures/synthetic-lecture.txt', import.meta.url), 'utf8');
// Synthetic output is confined to tests; production always calls OpenAI.
function validPack() {
  return {
    title: 'The classroom seed experiment', summary: 'The fictional experiment uses labeled trays and conditional watering.', notes: [],
    topics: [{ name: 'Watering exception', keyPoint: 'Skip watering when soil is visibly wet.',
      quote: 'If the soil is still visibly wet, skip watering that morning.',
      quiz: { question: 'When should morning watering be skipped?', options: ['When the soil is visibly wet', 'Always', 'Never', 'When a tray is labeled'], correctIndex: 0, explanation: 'The lecture explicitly says to skip watering if soil is still visibly wet.' },
      flashcard: { front: 'What is the exception to morning watering?', back: 'Skip watering if the soil is still visibly wet.' },
    }],
  };
}

test('rejects missing, non-string, empty, short, and oversized input', () => {
  for (const value of [undefined, null, 42, {}, [], '', '   ', 'x'.repeat(299), 'x'.repeat(20001)]) assert.throws(() => validateTranscript(value));
  assert.equal(validateTranscript(` ${'x'.repeat(300)} `).length, 300);
  assert.equal(validateTranscript('x'.repeat(20000)).length, 20000);
});
test('accepts a complete valid pack', () => assert.deepEqual(validatePack(validPack(), transcript), validPack()));
test('rejects invalid answer indices and incomplete topics', () => {
  for (const index of [-1, 4, 0.5, '0']) {
    const pack = validPack(); pack.topics[0].quiz.correctIndex = index;
    assert.throws(() => validatePack(pack, transcript));
  }
  for (const field of ['quiz', 'flashcard', 'keyPoint']) {
    const pack = validPack(); delete pack.topics[0][field]; assert.throws(() => validatePack(pack, transcript));
  }
});
test('rejects fabricated source quotes and accepts whitespace differences', () => {
  const pack = validPack(); pack.topics[0].quote = 'Water the tray every evening.';
  assert.throws(() => validatePack(pack, transcript));
  pack.topics[0].quote = 'If the soil is still\nvisibly   wet, skip watering that morning.';
  assert.doesNotThrow(() => validatePack(pack, transcript));
});
test('rejects malformed packs, empty or excess topics, duplicate options, and long summaries', () => {
  for (const mutate of [
    (p) => { p.topics = []; }, (p) => { p.topics = Array(7).fill(p.topics[0]); },
    (p) => { p.topics[0].quiz.options[1] = p.topics[0].quiz.options[0].toUpperCase(); },
    (p) => { p.topics[0].quiz.options.pop(); }, (p) => { p.topics[0].flashcard.back = ''; },
    (p) => { p.summary = transcript; }, (p) => { p.notes = 'none'; }, (p) => { p.extra = true; },
  ]) { const pack = validPack(); mutate(pack); assert.throws(() => validatePack(pack, transcript)); }
  for (const pack of [null, [], {}, 'text']) assert.throws(() => validatePack(pack, transcript));
});
test('handles refusals, incomplete, empty, and unparseable responses', () => {
  for (const response of [
    { status: 'completed', output: [{ content: [{ type: 'refusal' }] }] },
    { status: 'incomplete' }, { status: 'failed' },
    { status: 'completed', output_text: '' }, { status: 'completed', output_text: '{' },
  ]) assert.throws(() => parseResponse(response, transcript));
  assert.deepEqual(parseResponse({ status: 'completed', output_text: JSON.stringify(validPack()) }, transcript), validPack());
});

async function serve(t, options) {
  const server = createApp(options).listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  t.after(() => new Promise((resolve) => server.close(resolve)));
  return `http://127.0.0.1:${server.address().port}`;
}
const post = (base, value) => fetch(`${base}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ transcript: value }) });

test('HTTP health, assets, private files, invalid JSON/input, and missing credentials', async (t) => {
  const base = await serve(t, { apiKey: '' });
  assert.deepEqual(await (await fetch(`${base}/health`)).json(), { status: 'ok' });
  for (const path of ['/', '/app.js', '/styles.css']) assert.equal((await fetch(base + path)).status, 200);
  for (const path of ['/server.mjs', '/.env', '/package.json', '/test/fixtures/synthetic-lecture.txt']) assert.equal((await fetch(base + path)).status, 404);
  assert.equal((await post(base, 'short')).status, 400);
  const malformed = await fetch(`${base}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(malformed.status, 400); assert.match((await malformed.json()).error, /Malformed JSON/);
  const oversized = await post(base, 'x'.repeat(170000)); assert.equal(oversized.status, 413);
  const escapedUnicode = await fetch(`${base}/api/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"transcript":"' + '\\u4e00'.repeat(20000) + '"}' });
  assert.equal(escapedUnicode.status, 503);
  const unconfigured = await post(base, transcript); assert.equal(unconfigured.status, 503);
  assert.match((await unconfigured.json()).error, /OPENAI_API_KEY/);
});
test('one provider call per request, strict schema, no storage, and changed lecture forwarded', async (t) => {
  const calls = [];
  const base = await serve(t, { client: { responses: { create: async (request) => {
    calls.push(request); return { status: 'completed', output_text: JSON.stringify(validPack()) };
  } } } });
  const changed = transcript.replace('20 milliliters', '30 milliliters');
  for (const text of [transcript, changed]) {
    const response = await post(base, text); assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.deepEqual((await response.json()).pack, validPack());
  }
  assert.equal(calls.length, 2);
  assert.equal(calls[0].input[0].content, transcript.trim());
  assert.equal(calls[1].input[0].content, changed.trim());
  assert.equal(calls[0].store, false); assert.equal(calls[0].text.format.strict, true);
  assert.equal(calls[0].max_output_tokens, 5000);
});
test('provider errors are safe and invalid model output is never a success', async (t) => {
  let failure;
  const base = await serve(t, { client: { responses: { create: async () => {
    if (failure) throw failure;
    return { status: 'completed', output_text: '{"invalid":true}' };
  } } } });
  for (const [status, expected] of [[401, 503], [403, 503], [404, 503], [429, 429], [500, 502]]) {
    failure = Object.assign(new Error('sensitive provider details'), { status });
    const response = await post(base, transcript); assert.equal(response.status, expected);
    assert.doesNotMatch(JSON.stringify(await response.json()), /sensitive provider details/);
  }
  failure = Object.assign(new Error('private'), { name: 'APIConnectionTimeoutError' });
  assert.equal((await post(base, transcript)).status, 504);
  failure = null; assert.equal((await post(base, transcript)).status, 502);
});
