// Текущий индекс вопроса (0 = первый)
let current = 0;
// null = ещё не выбрали ответ
let selected = null;
// Секунды для таймера
let seconds = 0;
let timerInterval;
let correct_count = 0;   // сколько правильных ответов
let answered = 0;        // сколько всего отвечено



// Запускаем таймер
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    document.getElementById('header-timer').textContent = m + ':' + s;
  }, 1000);
}

// Рендерим карточку по индексу current
function renderCard() {
  const q = questions[current];

  // Обновляем текст
  document.getElementById('header-num').textContent =
    `КАРТОЧКА ${q.number} / ${questions.length}`;
  document.getElementById('frontTag').textContent =
    `СИТУАЦИЯ: ${q.topic.toUpperCase()}`;
  document.getElementById('frontQuestion').textContent = q.text;
  document.getElementById('optA').textContent = q.options.A;
  document.getElementById('optB').textContent = q.options.B;
  document.getElementById('optC').textContent = q.options.C;

  // Обновляем прогресс-бар
  const percent = ((current) / questions.length) * 100;
  document.getElementById('progressBar').style.width = percent + '%';

  // Сбрасываем состояние
  document.getElementById('card').classList.remove('flipped');
  document.querySelectorAll('.option').forEach(el => {
    el.classList.remove('selected', 'correct', 'wrong');
  });
  selected = null;
}

// Обработка выбора ответа
async function selectOption(letter) {
  if (selected) return;
  selected = letter;

  // Подсвечиваем выбранный вариант
  document.querySelectorAll('.option').forEach(el => {
    if (el.dataset.letter === letter) {
      el.classList.add('selected');
    }
  });

  // Отправляем на сервер
  const q = questions[current];
  const res = await fetch('/api/check/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': CSRF_TOKEN
    },
    body: JSON.stringify({
      question_id: q.id,
      answer: letter
    })
  });

  const data = await res.json();

  // ТОЛЬКО ЗДЕСЬ data уже существует — считаем очки
  answered++;
  if (data.correct) correct_count++;

  // Подсвечиваем правильный/неправильный
  document.querySelectorAll('.option').forEach(el => {
    if (el.dataset.letter === letter) {
      el.classList.add(data.correct ? 'correct' : 'wrong');
    }
  });

  document.getElementById('stampEl').textContent =
    data.correct ? 'ПРАВИЛЬНО!' : 'НЕВЕРНО!';
  document.getElementById('stampEl').className =
    'stamp' + (data.correct ? '' : ' wrong');
  document.getElementById('backExplanation').textContent =
    data.explanation;

  setTimeout(() => {
    document.getElementById('card').classList.add('flipped');
  }, 400);
}

// Следующая карточка
function nextCard() {
  // если ответили на все вопросы — показываем результаты
  if (answered >= questions.length) {
    showResults();
    return;
  }
  current = (current + 1) % questions.length;
  renderCard();
}

// Вешаем обработчики на варианты ответов
document.querySelectorAll('.option').forEach(el => {
  el.addEventListener('click', () => {
    selectOption(el.dataset.letter);
  });
});

// Кнопка следующего вопроса
document.getElementById('nextBtn').addEventListener('click', (e) => {
  // stopPropagation — чтобы клик не дошёл до .scene и не перевернул карточку обратно
  e.stopPropagation();
  nextCard();
});
function showResults() {
  // останавливаем таймер
  clearInterval(timerInterval);

  const total = questions.length;
  const percent = Math.round((correct_count / total) * 100);

  // определяем звание
  let rank, desc, rankClass;

  if (percent === 100) {
    rank = 'ЦИФРОВОЙ МОНАХ';
    desc = 'Абсолютное знание. Ты не просто выжил бы без технологий — ты бы их пересобрал с нуля.';
    rankClass = 'rank-perfect';
  } else if (percent >= 80) {
    rank = 'АВТОНОМНЫЙ АГЕНТ';
    desc = 'Отличный результат. Система может дать сбой, но ты — нет.';
    rankClass = 'rank-great';
  } else if (percent >= 60) {
    rank = 'ПОЛЕВОЙ ТЕХНИК';
    desc = 'Сойдёт для выживания. Базовые навыки есть, но пробелы опасны.';
    rankClass = 'rank-good';
  } else if (percent >= 40) {
    rank = 'ЦИФРОВОЙ ЗОМБИ';
    desc = 'Без интернета ты потерян. Пора прокачать реальные навыки.';
    rankClass = 'rank-ok';
  } else {
    rank = 'СИСТЕМА.EXE';
    desc = 'Критическая зависимость от автоматизации. Алгоритмы управляют тобой, не ты ими.';
    rankClass = 'rank-bad';
  }

  // вставляем данные в DOM
  const percentEl = document.getElementById('resultsPercent');
  percentEl.textContent = percent + '%';
  percentEl.className = 'results-percent ' + rankClass;

  document.getElementById('resultsRank').textContent = rank;
  document.getElementById('resultsDesc').textContent = desc;
  document.getElementById('scoreCorrect').textContent = correct_count;
  document.getElementById('scoreTotal').textContent = total;

  // показываем экран результатов
  document.getElementById('results').style.display = 'flex';
}

function restartQuiz() {
  // сбрасываем все переменные
  current = 0;
  selected = null;
  correct_count = 0;
  answered = 0;
  seconds = 0;

  // прячем экран результатов
  document.getElementById('results').style.display = 'none';

  // перезапускаем таймер
  clearInterval(timerInterval);
  startTimer();

  // рендерим первую карточку
  renderCard();
}

// вешаем обработчик на кнопку рестарта
document.getElementById('restartBtn').addEventListener('click', restartQuiz);




// Старт
renderCard();
startTimer();