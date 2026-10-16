document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const topBtn = document.getElementById('topBtn');
  const body = document.body;

  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        topBtn.style.display = 'flex';
      } else {
        topBtn.style.display = 'none';
      }
    });

    topBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  const animatedItems = document.querySelectorAll(
    '.card, .lesson-card, .question-card, .glossary-card'
  );

  animatedItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('fade-in');
    }, index * 70);
  });

  const header = document.querySelector('header');
  if (header) {
    header.classList.add('slide-up');
  }

  const glossaryCards = document.querySelectorAll('.glossary-card');
  glossaryCards.forEach((card) => {
    card.addEventListener('mouseenter', () => card.classList.add('shadow'));
    card.addEventListener('mouseleave', () => card.classList.remove('shadow'));
  });

  const glossarySearch = $('#searchGlossary');
  const glossaryResult = $('#glossaryResult');

  if (glossarySearch.length) {
    glossarySearch.on('input', function () {
      const keyword = $(this).val().toString().trim().toLowerCase();
      const items = $('.glossary-item');
      let visibleCount = 0;

      items.each(function () {
        const text = $(this).text().toLowerCase();
        const match = text.includes(keyword);
        $(this).toggle(match);
        if (match) visibleCount++;
      });

      if (keyword === '') {
        glossaryResult.text('');
      } else if (visibleCount === 0) {
        glossaryResult
          .removeClass('text-success')
          .addClass('text-danger')
          .text('Không tìm thấy thuật ngữ phù hợp.');
      } else {
        glossaryResult
          .removeClass('text-danger')
          .addClass('text-success')
          .text(`Tìm thấy ${visibleCount} thuật ngữ phù hợp.`);
      }
    });
  }

  let questions = [];
  const quizContainer = document.getElementById('quizContainer');
  const totalQuestion = document.getElementById('totalQuestion');
  const answeredCount = document.getElementById('answeredCount');
  const progressBar = document.getElementById('quizProgress');
  const progressText = document.getElementById('progressText');
  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const demoBtn = document.getElementById('demoBtn');
  const resultCard = document.getElementById('resultCard');
  const answerSection = document.getElementById('answerSection');
  const answerContainer = document.getElementById('answerContainer');

  if (quizContainer) {
    loadQuestions();
  }

  async function loadQuestions() {
    try {
      const response = await fetch('data/questions.json', {
        cache: 'no-cache',
      });

      if (!response.ok) {
        throw new Error('Không tìm thấy file data/questions.json');
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu JSON không hợp lệ.');
      }

      questions = data;

      if (totalQuestion) {
        totalQuestion.textContent = questions.length;
      }

      renderQuiz();
      updateProgress();
    } catch (error) {
      console.error(error);

      quizContainer.innerHTML = `
        <div class="alert alert-danger text-center shadow">
          <h4 class="mb-3">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Không thể tải bộ câu hỏi
          </h4>
          <p class="mb-2">Kiểm tra đường dẫn:</p>
          <code>data/questions.json</code>
          <hr />
          <small>${escapeHTML(error.message)}</small>
        </div>
      `;
    }
  }

  function escapeHTML(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderQuiz() {
    quizContainer.innerHTML = '';

    questions.forEach((question, index) => {
      let html = `
        <div class="card question-card mb-4">
          <div class="card-body">
            <h5 class="fw-bold text-primary mb-4">
              Câu ${index + 1}. ${escapeHTML(question.question)}
            </h5>
      `;

      question.answers.forEach((answer, i) => {
        const id = `q${index}_${i}`;

        html += `
          <div class="form-check mb-2">
            <input
              class="form-check-input"
              type="radio"
              name="q${index}"
              id="${id}"
              value="${i}"
            />
            <label class="form-check-label" for="${id}">
              ${escapeHTML(answer)}
            </label>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      quizContainer.insertAdjacentHTML('beforeend', html);
    });
  }

  function updateProgress() {
    if (!questions.length) return;

    const answered = document.querySelectorAll(
      "#quizContainer input[type='radio']:checked"
    ).length;

    if (answeredCount) {
      answeredCount.textContent = answered;
    }

    const percent = Math.round((answered / questions.length) * 100);

    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
    }

    if (progressText) {
      progressText.textContent = `${percent}%`;
    }
  }

  document.addEventListener('change', (e) => {
    if (e.target.matches("#quizContainer input[type='radio']")) {
      updateProgress();
    }
  });

  function showResult() {
    if (!questions.length) return;

    const selected = document.querySelectorAll(
      "#quizContainer input[type='radio']:checked"
    );

    if (selected.length < questions.length) {
      alert('Vui lòng trả lời đầy đủ tất cả câu hỏi.');
      return;
    }

    let correct = 0;
    answerContainer.innerHTML = '';

    questions.forEach((q, index) => {
      const selectedRadio = document.querySelector(
        `input[name="q${index}"]:checked`
      );
      const value = Number(selectedRadio.value);
      const isCorrect = value === q.correct;

      if (isCorrect) correct++;

      const html = `
        <div class="card mb-4 shadow-sm question-card ${
          isCorrect ? 'correct-answer' : 'wrong-answer'
        }">
          <div class="card-body">
            <h5 class="fw-bold">Câu ${index + 1}. ${escapeHTML(q.question)}</h5>
            <p class="${isCorrect ? 'text-success' : 'text-danger'} fw-bold">
              ${isCorrect ? '✔ Bạn trả lời đúng' : '✘ Bạn trả lời sai'}
            </p>
            <p class="mb-2">
              <strong>Bạn chọn:</strong> ${escapeHTML(q.answers[value])}
            </p>
            <p class="mb-2">
              <strong>Đáp án đúng:</strong> ${escapeHTML(q.answers[q.correct])}
            </p>
            ${
              q.explanation
                ? `<div class="alert alert-info mb-0">${escapeHTML(
                    q.explanation
                  )}</div>`
                : ''
            }
          </div>
        </div>
      `;

      answerContainer.insertAdjacentHTML('beforeend', html);
    });

    const total = questions.length;
    const wrong = total - correct;
    const score = (correct / total) * 10;
    const percent = Math.round((correct / total) * 100);

    document.getElementById('score').textContent = score.toFixed(1);
    document.getElementById('correct').textContent = correct;
    document.getElementById('wrong').textContent = wrong;
    document.getElementById('percent').textContent = `${percent}%`;

    let text = '';
    if (percent >= 90) {
      text = 'Xuất sắc! Bạn nắm rất vững kiến thức.';
    } else if (percent >= 70) {
      text = 'Khá tốt! Hãy tiếp tục phát huy.';
    } else if (percent >= 50) {
      text = 'Bạn nên xem lại bài giảng.';
    } else {
      text = 'Bạn cần ôn tập thêm.';
    }

    document.getElementById('evaluation').textContent = text;
    resultCard.classList.remove('d-none');
    answerSection.classList.remove('d-none');
    resultCard.scrollIntoView({ behavior: 'smooth' });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', showResult);
  }

  if (demoBtn) {
    demoBtn.addEventListener('click', () => {
      questions.forEach((q, index) => {
        const radio = document.getElementById(`q${index}_${q.correct}`);
        if (radio) radio.checked = true;
      });
      updateProgress();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const form = document.getElementById('quizForm');
      if (form) form.reset();

      updateProgress();

      if (resultCard) resultCard.classList.add('d-none');
      if (answerSection) answerSection.classList.add('d-none');
      if (answerContainer) answerContainer.innerHTML = '';

      document.getElementById('score').textContent = '0';
      document.getElementById('correct').textContent = '0';
      document.getElementById('wrong').textContent = '0';
      document.getElementById('percent').textContent = '0%';
      document.getElementById('evaluation').textContent = 'Chưa có kết quả.';

      document.querySelectorAll('.question-card').forEach((card) => {
        card.classList.remove('correct-answer', 'wrong-answer');
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fields = {
      name: {
        el: document.getElementById('name'),
        error: document.getElementById('nameError'),
        validate: (value) => {
          const v = value.trim();
          if (!v) return 'Họ và tên không được để trống.';
          if (v.length < 2) return 'Họ và tên phải có ít nhất 2 ký tự.';
          return '';
        },
      },
      email: {
        el: document.getElementById('email'),
        error: document.getElementById('emailError'),
        validate: (value) => {
          const v = value.trim();
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!v) return 'Email không được để trống.';
          if (!regex.test(v)) return 'Email chưa đúng định dạng.';
          return '';
        },
      },
      role: {
        el: document.getElementById('role'),
        error: document.getElementById('roleError'),
        validate: (value) => (!value ? 'Vui lòng chọn đối tượng.' : ''),
      },
      rating: {
        el: document.getElementById('rating'),
        error: document.getElementById('ratingError'),
        validate: (value) => (!value ? 'Vui lòng chọn mức độ hài lòng.' : ''),
      },
      subject: {
        el: document.getElementById('subject'),
        error: document.getElementById('subjectError'),
        validate: (value) => {
          const v = value.trim();
          if (!v) return 'Chủ đề góp ý không được để trống.';
          if (v.length < 4) return 'Chủ đề góp ý phải có ít nhất 4 ký tự.';
          return '';
        },
      },
      message: {
        el: document.getElementById('message'),
        error: document.getElementById('messageError'),
        validate: (value) => {
          const v = value.trim();
          if (!v) return 'Nội dung góp ý không được để trống.';
          if (v.length < 10) return 'Nội dung góp ý phải có ít nhất 10 ký tự.';
          return '';
        },
      },
      agree: {
        el: document.getElementById('agree'),
        error: document.getElementById('agreeError'),
        validate: (checked) =>
          !checked ? 'Bạn cần xác nhận đồng ý trước khi gửi.' : '',
      },
    };

    function setFieldState(field, message) {
      if (!field.el || !field.error) return;

      const isCheckbox = field.el.type === 'checkbox';

      if (message) {
        field.el.classList.add('is-invalid');
        field.el.classList.remove('is-valid');
        field.error.textContent = message;
      } else {
        field.el.classList.remove('is-invalid');
        field.el.classList.add('is-valid');
        field.error.textContent = '';
      }

      if (isCheckbox && !message) {
        field.el.classList.add('is-valid');
      }
    }

    function validateField(key) {
      const field = fields[key];
      if (!field) return true;

      const value =
        field.el.type === 'checkbox' ? field.el.checked : field.el.value;
      const message = field.validate(value);
      setFieldState(field, message);
      return !message;
    }

    function validateAll() {
      return Object.keys(fields).every((key) => validateField(key));
    }

    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.el) return;

      const eventName = field.el.type === 'checkbox' ? 'change' : 'input';
      field.el.addEventListener(eventName, () => validateField(key));
      field.el.addEventListener('blur', () => validateField(key));
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateAll()) {
        const firstInvalid = contactForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        const success = document.getElementById('successMessage');
        success.classList.add('d-none');
        return;
      }

      const success = document.getElementById('successMessage');
      success.classList.remove('d-none');

      contactForm.reset();
      Object.keys(fields).forEach((key) => {
        const field = fields[key];
        if (field.el) field.el.classList.remove('is-valid', 'is-invalid');
        if (field.error) field.error.textContent = '';
      });

      setTimeout(() => {
        success.classList.add('d-none');
      }, 3500);
    });

    contactForm.addEventListener('reset', () => {
      setTimeout(() => {
        const success = document.getElementById('successMessage');
        success.classList.add('d-none');

        Object.keys(fields).forEach((key) => {
          const field = fields[key];
          if (field.el) field.el.classList.remove('is-valid', 'is-invalid');
          if (field.error) field.error.textContent = '';
        });
      }, 0);
    });
  }
});
