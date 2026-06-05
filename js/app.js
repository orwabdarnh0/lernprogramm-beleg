'use strict';

const REST_URL = 'https://idefix.informatik.htw-dresden.de:8888/api/quizzes?page=0';
const REST_USER = 's88439quiz@htw-dresden.de';
const REST_PASSWORD = 'quizapp88439';
const QUESTIONS_PER_ROUND = 5;

function authHeader() {
  const token = btoa(`${REST_USER}:${REST_PASSWORD}`);
  return {
    'Authorization': `Basic ${token}`,
    'Accept': 'application/json'
  };
}

let localQuestions = {};
let quizData = [];
let currentIndex = 0;
let right = 0;
let wrong = 0;
let answered = false;

const categorySelect = document.getElementById('category');
const startBtn = document.getElementById('startBtn');
const nextBtn = document.getElementById('nextBtn');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const feedbackEl = document.getElementById('feedback');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const rightCount = document.getElementById('rightCount');
const wrongCount = document.getElementById('wrongCount');
const currentCategory = document.getElementById('currentCategory');
const categoryInfo = document.getElementById('categoryInfo');
const resultScreen = document.getElementById('resultScreen');

async function init() {
  await loadLocalQuestions();
  startQuiz();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
  }
}

async function loadLocalQuestions() {
  const response = await fetch('data/questions.json');
  localQuestions = await response.json();
}

async function startQuiz() {
  currentIndex = 0;
  right = 0;
  wrong = 0;
  answered = false;

  resultScreen.classList.add('hidden');
  document.querySelector('.quiz-card').classList.remove('hidden');
  updateStats();

  const category = categorySelect.value;
  currentCategory.textContent = categorySelect.options[categorySelect.selectedIndex].text;

  if (category === 'rest') {
    categoryInfo.textContent = 'Aufgaben werden per AJAX/fetch von der REST-API geladen.';
    quizData = await loadRestQuestions();
  } else {
    categoryInfo.textContent = 'Lokale Aufgaben aus data/questions.json.';
    quizData = shuffle([...localQuestions[category]]).slice(0, QUESTIONS_PER_ROUND);
  }

  showQuestion();
}

async function loadRestQuestions() {
  try {
    const response = await fetch(REST_URL, {
      method: 'GET',
      headers: authHeader()
    });

    if (!response.ok) {
      throw new Error(`REST-Server antwortet nicht korrekt: ${response.status}`);
    }

    const data = await response.json();
    console.log('REST data:', data);

    const normalized = normalizeRestData(data);

    if (normalized.length === 0) {
      throw new Error('REST-Datenformat konnte nicht gelesen werden.');
    }

    return shuffle(normalized).slice(0, QUESTIONS_PER_ROUND);
  } catch (error) {
    console.warn(error);

    return [
      {
        a: 'Was bedeutet REST?',
        l: ['Representational State Transfer', 'Remote Easy Style Text', 'Random Server Test', 'Real Script Transfer']
      },
      {
        a: 'Welche JavaScript-Funktion nutzt man für AJAX?',
        l: ['fetch()', 'alert()', 'console.log()', 'parseInt()']
      }
    ];
  }
}

function normalizeRestData(data) {
  const list = Array.isArray(data)
    ? data
    : (data.content || data.quizzes || data.items || data.data || []);

  return list.map(item => {
    const question =
      item.text ||
      item.question ||
      item.title ||
      item.a ||
      item.prompt ||
      'Externe Aufgabe';

    const answers =
      item.answers ||
      item.options ||
      item.choices ||
      item.l ||
      [];

    return {
      id: item.id || null,
      a: String(question),
      l: answers.map(String).slice(0, 4),
      source: 'rest'
    };
  }).filter(q => q.l.length >= 4);
}

function showQuestion() {
  answered = false;
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  nextBtn.classList.add('hidden');
  answersEl.innerHTML = '';

  if (currentIndex >= quizData.length) {
    showResult();
    return;
  }

  const q = quizData[currentIndex];

  renderQuestion(q.a);

  const answers = q.l.map((text, index) => ({
    text,
    index
  }));

  shuffle(answers).forEach(answerObj => {
    const button = document.createElement('button');
    button.textContent = answerObj.text;
    button.addEventListener('click', () => checkAnswer(button, answerObj, q));
    answersEl.appendChild(button);
  });

  updateProgress();
}

function renderQuestion(text) {
  if (categorySelect.value === 'mathe' && window.katex) {
    questionEl.innerHTML = '';
    katex.render(text, questionEl, { throwOnError: false });
  } else {
    questionEl.textContent = text;
  }
}

async function solveRestQuestion(questionId, selectedIndex) {
  const response = await fetch(
    `https://idefix.informatik.htw-dresden.de:8888/api/quizzes/${questionId}/solve`,
    {
      method: 'POST',
      headers: {
        ...authHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([selectedIndex])
    }
  );

  if (!response.ok) {
    throw new Error(`Solve fehlgeschlagen: ${response.status}`);
  }

  return await response.json();
}

async function checkAnswer(button, answerObj, question) {
  if (answered) return;
  answered = true;

  const buttons = answersEl.querySelectorAll('button');
  buttons.forEach(btn => btn.disabled = true);

  if (question.source === 'rest' && question.id !== null) {
    try {
      const result = await solveRestQuestion(question.id, answerObj.index);

      if (result.success) {
        right++;
        button.classList.add('correct');
        feedbackEl.textContent = result.feedback || 'Richtig!';
        feedbackEl.classList.add('ok');
      } else {
        wrong++;
        button.classList.add('wrong');
        feedbackEl.textContent = result.feedback || 'Falsch!';
        feedbackEl.classList.add('bad');
      }
    } catch (error) {
      wrong++;
      button.classList.add('wrong');
      feedbackEl.textContent = 'Fehler bei der Serverprüfung.';
      feedbackEl.classList.add('bad');
      console.warn(error);
    }
  } else {
    const correct = question.l[0];

    buttons.forEach(btn => {
      if (btn.textContent === correct) {
        btn.classList.add('correct');
      }
    });

    if (answerObj.text === correct) {
      right++;
      button.classList.add('correct');
      feedbackEl.textContent = 'Richtig!';
      feedbackEl.classList.add('ok');
    } else {
      wrong++;
      button.classList.add('wrong');
      feedbackEl.textContent = `Falsch! Richtige Antwort: ${correct}`;
      feedbackEl.classList.add('bad');
    }
  }

  updateStats();
  nextBtn.classList.remove('hidden');
}

function updateProgress() {
  const total = quizData.length || QUESTIONS_PER_ROUND;
  progressText.textContent = `${currentIndex} / ${total}`;
  progressFill.style.width = `${(currentIndex / total) * 100}%`;
}

function updateStats() {
  rightCount.textContent = right;
  wrongCount.textContent = wrong;
}

function showResult() {
  document.querySelector('.quiz-card').classList.add('hidden');
  resultScreen.classList.remove('hidden');

  document.getElementById('finalScore').textContent =
    `Du hast ${right} von ${quizData.length} Fragen richtig beantwortet.`;

  progressFill.style.width = '100%';
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  showQuestion();
});

startBtn.addEventListener('click', startQuiz);
categorySelect.addEventListener('change', startQuiz);

init();