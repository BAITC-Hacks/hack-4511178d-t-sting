const $ = (selector) => document.querySelector(selector);
const transcript = $('#transcript');
let pack = null;
let pending = false;
let answers = [];
let checked = false;
let missed = [];
let filter = 'all';
let cardPosition = 0;
let revealed = false;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text, action, secondary = false) {
  const node = element('button', text, secondary ? 'secondary' : undefined);
  node.type = 'button';
  node.addEventListener('click', action);
  return node;
}
function excerpt(quote) {
  const details = element('details');
  details.append(element('summary', 'Lecture excerpt'), element('blockquote', quote));
  return details;
}
function resetStudy() {
  answers = []; checked = false; missed = []; filter = 'all'; cardPosition = 0; revealed = false;
}
function invalidate() {
  pack = null; resetStudy();
  $('#results').hidden = true;
  for (const view of ['overview', 'quiz', 'flashcards']) $(`#${view}`).replaceChildren();
  $('#pack-title').textContent = '';
}
function updateInput() {
  $('#count').textContent = transcript.value.trim().length.toLocaleString('en-US');
  transcript.removeAttribute('aria-invalid');
  $('#error').textContent = '';
  $('#status').textContent = '';
  invalidate();
}
transcript.addEventListener('input', updateInput);
$('#clear').addEventListener('click', () => { transcript.value = ''; updateInput(); transcript.focus(); });

function showView(view) {
  for (const name of ['overview', 'quiz', 'flashcards']) $(`#${name}`).hidden = name !== view;
  document.querySelectorAll('[data-view]').forEach((node) => node.setAttribute('aria-pressed', String(node.dataset.view === view)));
  if (view === 'flashcards') { revealed = false; renderCards(); }
}
document.querySelectorAll('[data-view]').forEach((node) => node.addEventListener('click', () => showView(node.dataset.view)));

$('#generate-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  if (pending) return;
  const text = transcript.value.trim();
  invalidate();
  $('#error').textContent = '';
  $('#status').textContent = '';
  if (text.length < 300 || text.length > 20000) {
    $('#error').textContent = text.length > 20000 ? 'Use at most 20,000 characters. Nothing was truncated.' : 'Enter at least 300 characters of lecture text.';
    transcript.setAttribute('aria-invalid', 'true'); transcript.focus(); return;
  }
  pending = true;
  for (const node of [transcript, $('#generate'), $('#clear')]) node.disabled = true;
  $('#generate-form').setAttribute('aria-busy', 'true');
  $('#status').textContent = 'Generating study materials…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 70_000);
  try {
    const response = await fetch('/api/generate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text }), signal: controller.signal,
    });
    let data;
    try { data = await response.json(); }
    catch { throw new Error('The server returned an unreadable response. Please try again.'); }
    if (!response.ok) throw new Error(data.error || 'Generation failed. Please try again.');
    if (!data.pack || !Array.isArray(data.pack.topics) || !data.pack.topics.length) throw new Error('No study materials were returned. Please try again.');
    pack = data.pack;
    answers = Array(pack.topics.length).fill(null);
    $('#pack-title').textContent = pack.title;
    renderOverview(); renderQuiz(); renderCards(); showView('overview');
    $('#results').hidden = false;
    $('#status').textContent = 'Study materials ready.';
    $('#pack-title').focus();
  } catch (error) {
    invalidate();
    $('#status').textContent = '';
    $('#error').textContent = error.name === 'AbortError' ? 'The request timed out. Your text is still here; generate again to retry.' : (error instanceof TypeError ? 'Could not reach the server. Check your connection and generate again to retry.' : error.message);
  } finally {
    clearTimeout(timeout); pending = false;
    for (const node of [transcript, $('#generate'), $('#clear')]) node.disabled = false;
    $('#generate-form').setAttribute('aria-busy', 'false');
  }
});

function renderOverview() {
  const view = $('#overview'); view.replaceChildren();
  view.append(element('h3', 'Lecture summary'), element('p', pack.summary, 'prose'));
  if (pack.notes.length) {
    const notes = element('aside', undefined, 'notes'); notes.append(element('h4', 'Source notes'));
    pack.notes.forEach((note) => notes.append(element('p', note))); view.append(notes);
  }
  view.append(element('h3', 'Key points'));
  const list = element('ol', undefined, 'key-points');
  pack.topics.forEach((topic) => {
    const item = element('li');
    item.append(element('h4', topic.name), element('p', topic.keyPoint), excerpt(topic.quote)); list.append(item);
  });
  view.append(list, button('Take the quiz', () => showView('quiz')));
}

function renderQuiz() {
  const view = $('#quiz'); view.replaceChildren(element('h3', 'Quiz'));
  view.append(element('p', 'Answer every question, then check your answers.', 'muted'));
  const form = element('form');
  pack.topics.forEach((topic, index) => {
    const field = element('fieldset');
    field.append(element('legend', `${index + 1}. ${topic.quiz.question}`));
    topic.quiz.options.forEach((option, optionIndex) => {
      const label = element('label', undefined, 'option');
      const radio = element('input'); radio.type = 'radio'; radio.name = `question-${index}`;
      radio.value = String(optionIndex); radio.required = true;
      radio.checked = answers[index] === optionIndex; radio.disabled = checked;
      radio.addEventListener('change', () => { answers[index] = optionIndex; });
      label.append(radio, element('span', option)); field.append(label);
    });
    if (checked) {
      const correct = answers[index] === topic.quiz.correctIndex;
      const feedback = element('div', undefined, correct ? 'feedback correct' : 'feedback incorrect');
      feedback.append(element('strong', correct ? 'Correct' : 'Incorrect'),
        element('p', `Correct answer: ${topic.quiz.options[topic.quiz.correctIndex]}`),
        element('p', topic.quiz.explanation), excerpt(topic.quote));
      field.append(feedback);
    }
    form.append(field);
  });
  if (!checked) {
    const submit = element('button', 'Check answers'); submit.type = 'submit'; form.append(submit);
    const message = element('p', undefined, 'error'); message.setAttribute('role', 'alert'); form.append(message);
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (answers.some((answer) => answer === null)) { message.textContent = 'Answer every question before checking.'; return; }
      checked = true;
      missed = pack.topics.flatMap((topic, index) => answers[index] === topic.quiz.correctIndex ? [] : [index]);
      renderQuiz(); $('#score').focus();
    });
  }
  view.append(form);
  if (checked) {
    const score = element('h4', `${pack.topics.length - missed.length} of ${pack.topics.length} correct`);
    score.id = 'score'; score.tabIndex = -1; score.setAttribute('role', 'status'); view.append(score);
    if (!missed.length) view.append(element('p', 'Nothing missed. You can review all flashcards.'));
    const actions = element('div', undefined, 'actions');
    actions.append(button(missed.length ? 'Review missed topics' : 'Review all flashcards', () => {
      filter = missed.length ? 'missed' : 'all'; cardPosition = 0; showView('flashcards');
    }), button('Retry quiz', () => {
      resetStudy(); answers = Array(pack.topics.length).fill(null); renderQuiz(); renderCards();
      $('#quiz input').focus();
    }, true));
    view.append(actions);
  }
}

function renderCards() {
  const view = $('#flashcards'); view.replaceChildren(element('h3', 'Flashcards'));
  const label = element('label', 'Review '); label.htmlFor = 'card-filter';
  const select = element('select'); select.id = 'card-filter';
  for (const [value, text] of [['all', 'All topics'], ['missed', 'Missed topics']]) {
    const option = element('option', text); option.value = value; select.append(option);
  }
  select.value = filter;
  select.addEventListener('change', () => { filter = select.value; cardPosition = 0; revealed = false; renderCards(); $('#card-filter').focus(); });
  view.append(label, select);
  const indices = filter === 'missed' ? missed : pack.topics.map((_topic, index) => index);
  if (!indices.length) {
    view.append(element('p', checked ? 'Nothing missed. Choose All topics to review the whole deck.' : 'Take and check the quiz first to find topics to review.'));
    return;
  }
  const topic = pack.topics[indices[cardPosition]];
  const card = element('article', undefined, 'flashcard'); card.setAttribute('aria-live', 'polite');
  card.append(element('p', `Card ${cardPosition + 1} of ${indices.length}`, 'muted'), element('h4', topic.flashcard.front));
  if (revealed) {
    card.append(element('p', topic.flashcard.back, 'answer'), excerpt(topic.quote));
  }
  const reveal = button(revealed ? 'Hide answer' : 'Reveal answer', () => { revealed = !revealed; renderCards(); $('#reveal').focus(); });
  reveal.id = 'reveal'; reveal.setAttribute('aria-expanded', String(revealed)); card.append(reveal); view.append(card);
  const actions = element('div', undefined, 'actions');
  const move = (step) => { cardPosition += step; revealed = false; renderCards(); $('#reveal').focus(); };
  const previous = button('Previous', () => move(-1), true); previous.disabled = cardPosition === 0;
  const next = button('Next', () => move(1), true); next.disabled = cardPosition === indices.length - 1;
  actions.append(previous, next); view.append(actions);
}
