document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('quizForm');
    const quizContainer = document.getElementById('quizContainer');
    const demoBtn = document.getElementById('demoBtn');
    const submitBtn = document.getElementById('submitBtn');
    const resetBtn = document.getElementById('resetBtn');
    const resultBox = document.getElementById('result');

    const contactForm = document.getElementById('contactForm');
    const messageBox = document.getElementById('messageBox');

    let questions = [];

    const escapeHtml = (text) => {
        return String(text)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    };

    const useJQuery = typeof window.jQuery !== 'undefined';

    function clearQuizFeedback() {
        if (!resultBox) return;
        resultBox.className = 'alert alert-success text-center mt-4 d-none';
        resultBox.textContent = '';

        document.querySelectorAll('[id^="explain-"]').forEach(el => {
            el.className = 'mt-2 text-muted small d-none';
            el.textContent = '';
        });
    }

    function renderQuiz(list) {
        if (!quizContainer) return;

        quizContainer.innerHTML = '';

        list.forEach((q, index) => {
            const card = document.createElement('div');
            card.className = 'card shadow-sm question-card mb-4';

            const body = document.createElement('div');
            body.className = 'card-body';

            const title = document.createElement('h5');
            title.textContent = `Câu ${index + 1}. ${q.question}`;

            body.appendChild(title);

            q.answers.forEach((answer, i) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'form-check';

                const inputId = `q${q.id}_${i}`;

                const input = document.createElement('input');
                input.className = 'form-check-input';
                input.type = 'radio';
                input.name = `q${q.id}`;
                input.id = inputId;
                input.value = i;

                const label = document.createElement('label');
                label.className = 'form-check-label';
                label.setAttribute('for', inputId);
                label.innerHTML = escapeHtml(answer);

                wrapper.appendChild(input);
                wrapper.appendChild(label);
                body.appendChild(wrapper);
            });

            const explain = document.createElement('div');
            explain.className = 'mt-2 text-muted small d-none';
            explain.id = `explain-${q.id}`;

            body.appendChild(explain);
            card.appendChild(body);
            quizContainer.appendChild(card);
        });
    }

    function showQuizResult(score, total, allAnswered) {
        if (!resultBox) return;

        resultBox.classList.remove('d-none');

        if (useJQuery) {
            window.jQuery(resultBox).hide().removeClass('d-none').fadeIn(200);
        }

        resultBox.className = 'alert text-center mt-4';

        if (score === total) {
            resultBox.classList.add('alert-success');
            resultBox.textContent = `Chúc mừng bạn! Bạn đúng ${score}/${total} câu.`;
        } else if (allAnswered) {
            resultBox.classList.add('alert-warning');
            resultBox.textContent = `Bạn đúng ${score}/${total} câu. Hãy xem lại các câu chưa đúng.`;
        } else {
            resultBox.classList.add('alert-info');
            resultBox.textContent = `Bạn đúng ${score}/${total} câu. Vẫn còn câu chưa chọn đáp án.`;
        }
    }

    function gradeQuiz() {
        if (!questions.length) return;

        let score = 0;
        let allAnswered = true;

        questions.forEach(q => {
            const checked = document.querySelector(`input[name="q${q.id}"]:checked`);
            const explainBox = document.getElementById(`explain-${q.id}`);

            if (!checked) {
                allAnswered = false;
                if (explainBox) {
                    explainBox.className = 'mt-2 text-danger small';
                    explainBox.textContent = 'Bạn chưa chọn đáp án cho câu này.';
                }
                return;
            }

            const selectedValue = Number(checked.value);

            if (selectedValue === q.correct) {
                score++;
                if (explainBox) {
                    explainBox.className = 'mt-2 text-success small';
                    explainBox.textContent = `Đúng: ${q.explain}`;
                }
            } else {
                if (explainBox) {
                    explainBox.className = 'mt-2 text-danger small';
                    explainBox.textContent = `Sai: ${q.explain}`;
                }
            }
        });

        showQuizResult(score, questions.length, allAnswered);
    }

    function fillDemoAnswers() {
        if (!questions.length) return;

        questions.forEach(q => {
            const correctInput = document.querySelector(`input[name="q${q.id}"][value="${q.correct}"]`);
            if (correctInput) {
                correctInput.checked = true;
            }
        });

        if (resultBox) {
            resultBox.className = 'alert alert-info text-center mt-4 d-none';
            resultBox.textContent = '';
        }

        document.querySelectorAll('[id^="explain-"]').forEach(el => {
            el.className = 'mt-2 text-muted small d-none';
            el.textContent = '';
        });
    }

    function resetQuiz() {
        if (!quizForm) return;

        setTimeout(() => {
            quizForm.reset();
            clearQuizFeedback();
        }, 0);
    }

    if (quizContainer) {
        fetch('data/questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không tải được file questions.json');
                }
                return response.json();
            })
            .then(data => {
                questions = Array.isArray(data) ? data : [];
                renderQuiz(questions);
            })
            .catch(error => {
                quizContainer.innerHTML = `
                    <div class="alert alert-danger">
                        Không tải được câu hỏi: ${escapeHtml(error.message)}
                    </div>
                `;
            });
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', gradeQuiz);
    }

    if (demoBtn) {
        demoBtn.addEventListener('click', fillDemoAnswers);
    }

    if (quizForm) {
        quizForm.addEventListener('reset', resetQuiz);
    }

    function setContactMessage(type, text) {
        if (!messageBox) return;

        messageBox.className = `alert mt-4 ${type}`;
        messageBox.textContent = text;
        messageBox.classList.remove('d-none');

        if (useJQuery) {
            window.jQuery(messageBox).hide().removeClass('d-none').fadeIn(200);
        }
    }

    if (contactForm && messageBox) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const role = document.getElementById('role')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!name || !email || !role || !message) {
                setContactMessage('alert-danger', 'Vui lòng điền đầy đủ thông tin trước khi gửi góp ý.');
                return;
            }

            if (!emailPattern.test(email)) {
                setContactMessage('alert-danger', 'Email chưa đúng định dạng. Vui lòng kiểm tra lại.');
                return;
            }

            setContactMessage('alert-success', 'Cảm ơn bạn đã gửi góp ý. Nhóm 6 sẽ tiếp tục hoàn thiện website.');
            contactForm.reset();
        });

        contactForm.addEventListener('reset', () => {
            setTimeout(() => {
                messageBox.className = 'alert mt-4 d-none';
                messageBox.textContent = '';
            }, 0);
        });
    }
});
