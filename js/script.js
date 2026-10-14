document.addEventListener('DOMContentLoaded', function () {
  const topBtn = document.getElementById('topBtn');

  if (topBtn) {
    window.addEventListener('scroll', function () {
      topBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    topBtn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  document
    .querySelectorAll('.card, .lesson-box, .question-card, .glossary-card')
    .forEach(function (card) {
      card.classList.add('fadeIn');
    });

  const header = document.querySelector('header');
  if (header) {
    header.classList.add('slideUp');
  }

  const glossaryCards = document.querySelectorAll('.glossary-card');
  glossaryCards.forEach(function (card) {
    card.addEventListener('mouseenter', function () {
      card.classList.add('shadow');
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('shadow');
    });
  });

  window.addEventListener('load', function () {
    glossaryCards.forEach(function (card, index) {
      setTimeout(function () {
        card.classList.add('fadeIn');
      }, index * 100);
    });
  });

  const searchInput = document.getElementById('searchQuestion');
  if (searchInput) {
    searchInput.addEventListener('keyup', function () {
      const keyword = this.value.toLowerCase().trim();
      const items = document.querySelectorAll(
        '#glossaryContainer .glossary-item'
      );
      let count = 0;

      items.forEach(function (item) {
        const text = item.textContent.toLowerCase();

        if (text.includes(keyword)) {
          item.style.display = '';
          count++;
        } else {
          item.style.display = 'none';
        }
      });

      let result = document.getElementById('searchResult');

      if (!result) {
        result = document.createElement('p');
        result.id = 'searchResult';
        result.className = 'text-center fw-bold mt-4';
        document
          .getElementById('glossaryContainer')
          .insertAdjacentElement('afterend', result);
      }

      if (keyword === '') {
        result.innerHTML = '';
      } else if (count === 0) {
        result.className = 'text-center text-danger fw-bold mt-4';
        result.innerHTML = 'Không tìm thấy thuật ngữ phù hợp.';
      } else {
        result.className = 'text-center text-success fw-bold mt-4';
        result.innerHTML = 'Tìm thấy ' + count + ' thuật ngữ.';
      }
    });
  }

  let questions = [];
  const quizContainer = document.getElementById('quizContainer');

  if (quizContainer) {
    fetch('data/questions.json')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Không tải được file questions.json');
        }
        return response.json();
      })
      .then(function (data) {
        questions = Array.isArray(data) ? data : [];
        renderQuiz();
      })
      .catch(function () {
        quizContainer.innerHTML = `
            <div class="alert alert-danger text-center">
              Không thể tải file questions.json
            </div>
          `;
      });
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function renderQuiz() {
    if (!quizContainer) return;

    quizContainer.innerHTML = '';

    questions.forEach(function (q, index) {
      let html = `
          <div class="card question-card shadow mb-4">
            <div class="card-body">
              <h5 class="fw-bold mb-3">
                Câu ${index + 1}. ${escapeHtml(q.question)}
              </h5>
        `;

      (q.answers || []).forEach(function (option, i) {
        const inputId = `q${index}_${i}`;

        html += `
            <div class="form-check mb-2">
              <input
                class="form-check-input"
                type="radio"
                name="q${index}"
                id="${inputId}"
                value="${i}"
              >
              <label class="form-check-label" for="${inputId}">
                ${escapeHtml(option)}
              </label>
            </div>
          `;
      });

      html += `
            </div>
          </div>
        `;

      quizContainer.innerHTML += html;
    });
  }

  const submitBtn = document.getElementById('submitBtn');
  const resetBtn = document.getElementById('resetBtn');
  const demoBtn = document.getElementById('demoBtn');
  const result = document.getElementById('result');

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (!questions.length) return;

      let score = 0;
      let answered = 0;

      questions.forEach(function (q, index) {
        const answer = document.querySelector(
          'input[name="q' + index + '"]:checked'
        );
        const card = document.querySelectorAll('.question-card')[index];

        if (answer) {
          answered++;
        }

        if (answer && Number(answer.value) === Number(q.correct)) {
          score++;
          if (card) {
            card.classList.remove('wrong-answer');
            card.classList.add('correct-answer');
          }
        } else if (card) {
          card.classList.remove('correct-answer');
          card.classList.add('wrong-answer');
        }
      });

      const total = questions.length;
      const percent = total > 0 ? Math.round((score / total) * 100) : 0;

      let color = 'bg-danger';
      let text = 'Bạn cần ôn tập thêm.';

      if (percent >= 90) {
        color = 'bg-success';
        text = '🎉 Xuất sắc! Bạn đã nắm rất vững kiến thức.';
      } else if (percent >= 70) {
        color = 'bg-info';
        text = '👍 Kết quả tốt! Tiếp tục phát huy.';
      } else if (percent >= 50) {
        color = 'bg-warning';
        text = '⚠️ Bạn nên xem lại bài giảng.';
      } else if (answered < total) {
        text = 'Bạn chưa chọn hết đáp án. Hãy hoàn thành tất cả câu hỏi.';
      }

      if (result) {
        result.innerHTML = `
            <div class="card shadow mt-5">
              <div class="card-body text-center">
                <h2 class="text-primary mb-4">
                  KẾT QUẢ BÀI LÀM
                </h2>
  
                <h1 class="display-4 fw-bold">
                  ${score} / ${total}
                </h1>
  
                <div class="progress mt-4 mb-4">
                  <div class="progress-bar ${color}" style="width:${percent}%">
                    ${percent}%
                  </div>
                </div>
  
                <div class="alert alert-primary">
                  ${text}
                </div>
              </div>
            </div>
          `;

        result.classList.add('show');
        result.classList.remove('d-none');
        result.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      const quizForm = document.getElementById('quizForm');
      if (quizForm) quizForm.reset();

      if (result) {
        result.innerHTML = '';
        result.classList.remove('show');
        result.classList.add('d-none');
      }

      document.querySelectorAll('.question-card').forEach(function (card) {
        card.classList.remove('correct-answer', 'wrong-answer');
      });
    });
  }

  if (demoBtn) {
    demoBtn.addEventListener('click', function () {
      questions.forEach(function (q, index) {
        const radio = document.getElementById('q' + index + '_' + q.correct);
        if (radio) radio.checked = true;
      });
    });
  }

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const role = document.getElementById('role');
      const rating = document.getElementById('rating');
      const message = document.getElementById('message');

      const nameError = document.getElementById('nameError');
      const emailError = document.getElementById('emailError');
      const roleError = document.getElementById('roleError');
      const ratingError = document.getElementById('ratingError');
      const messageError = document.getElementById('messageError');
      const success = document.getElementById('successMessage');

      let valid = true;

      function setError(input, errorBox, text) {
        if (input) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
        }
        if (errorBox) errorBox.textContent = text;
        valid = false;
      }

      function setSuccess(input, errorBox) {
        if (input) {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
        if (errorBox) errorBox.textContent = '';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name.value.trim() || name.value.trim().length < 2) {
        setError(name, nameError, 'Họ và tên phải có ít nhất 2 ký tự.');
      } else {
        setSuccess(name, nameError);
      }

      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        setError(email, emailError, 'Email chưa đúng định dạng.');
      } else {
        setSuccess(email, emailError);
      }

      if (!role.value.trim()) {
        setError(role, roleError, 'Vui lòng chọn vai trò.');
      } else {
        setSuccess(role, roleError);
      }

      if (!rating.value.trim()) {
        setError(rating, ratingError, 'Vui lòng chọn mức độ hài lòng.');
      } else {
        setSuccess(rating, ratingError);
      }

      if (!message.value.trim() || message.value.trim().length < 10) {
        setError(
          message,
          messageError,
          'Nội dung góp ý phải có ít nhất 10 ký tự.'
        );
      } else {
        setSuccess(message, messageError);
      }

      if (!valid) {
        if (success) success.classList.add('d-none');
        return;
      }

      if (success) success.classList.remove('d-none');

      contactForm.reset();

      [name, email, role, rating, message].forEach(function (el) {
        if (el) el.classList.remove('is-valid', 'is-invalid');
      });
    });

    contactForm.addEventListener('reset', function () {
      setTimeout(function () {
        const success = document.getElementById('successMessage');
        const errors = document.querySelectorAll(
          '#nameError, #emailError, #roleError, #ratingError, #messageError'
        );

        if (success) success.classList.add('d-none');

        errors.forEach(function (el) {
          el.textContent = '';
        });

        ['name', 'email', 'role', 'rating', 'message'].forEach(function (id) {
          const el = document.getElementById(id);
          if (el) el.classList.remove('is-valid', 'is-invalid');
        });
      }, 0);
    });
  }

  $('input, textarea, select').on('focus', function () {
    $(this).addClass('shadow');
  });

  $('input, textarea, select').on('blur', function () {
    $(this).removeClass('shadow');
  });

  console.log('Website Chủ đề D đã tải thành công.');
});
