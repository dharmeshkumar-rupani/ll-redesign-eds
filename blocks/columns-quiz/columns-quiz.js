/**
 * columns-quiz block
 * Interactive plan recommendation quiz.
 * Authored content structure (row with 2 cells):
 *   Cell 1: h2 (title) + p (subtitle) + [h3 + ul] pairs (questions + options)
 *   Cell 2: result content (plan name, description, CTA link)
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const cells = [...row.children];
  if (cells.length < 2) return;

  const introCell = cells[0];
  const contentCell = cells[1];

  // Extract questions from the intro cell (h3 + ul pairs after the intro h2/p)
  const questions = [];
  const introElements = [];
  let foundQuestion = false;

  [...introCell.children].forEach((el) => {
    if (el.tagName === 'H3') {
      foundQuestion = true;
      questions.push({ text: el.textContent.trim(), options: [] });
    } else if (el.tagName === 'UL' && questions.length > 0) {
      const opts = [...el.querySelectorAll('li')].map((li) => li.textContent.trim());
      questions[questions.length - 1].options = opts;
    } else if (!foundQuestion) {
      introElements.push(el);
    }
  });

  // If no questions found in content, keep columns layout
  if (questions.length === 0) {
    block.classList.add('columns-quiz-2-cols');
    return;
  }

  // Build intro section (h2 + p only)
  introCell.innerHTML = '';
  introElements.forEach((el) => introCell.appendChild(el));

  // Build quiz panel in content cell
  const totalSteps = questions.length;
  contentCell.innerHTML = '';

  // Create step elements
  questions.forEach((q, idx) => {
    const step = document.createElement('div');
    step.className = 'quiz-step';
    step.dataset.step = idx + 1;
    if (idx > 0) step.hidden = true;

    // Step header with progress
    const header = document.createElement('div');
    header.className = 'quiz-step-header';

    const progress = document.createElement('div');
    progress.className = 'quiz-progress';

    const counter = document.createElement('span');
    counter.className = 'quiz-counter';
    counter.textContent = `Question ${idx + 1} of ${totalSteps}`;

    const bar = document.createElement('div');
    bar.className = 'quiz-bar';

    const barFill = document.createElement('div');
    barFill.className = 'quiz-bar-fill';
    barFill.style.width = `${((idx + 1) / totalSteps) * 100}%`;

    bar.appendChild(barFill);
    progress.appendChild(counter);
    progress.appendChild(bar);

    const question = document.createElement('h3');
    question.className = 'quiz-question';
    question.textContent = q.text;

    header.appendChild(progress);
    header.appendChild(question);

    // Options list
    const optionsList = document.createElement('ul');
    optionsList.className = 'quiz-options';
    optionsList.setAttribute('role', 'list');

    q.options.forEach((optText) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.setAttribute('aria-pressed', 'false');

      const radio = document.createElement('span');
      radio.className = 'quiz-option-radio';
      radio.setAttribute('aria-hidden', 'true');

      const label = document.createElement('span');
      label.className = 'quiz-option-label';
      label.textContent = optText;

      btn.appendChild(radio);
      btn.appendChild(label);
      li.appendChild(btn);
      optionsList.appendChild(li);
    });

    step.appendChild(header);
    step.appendChild(optionsList);
    contentCell.appendChild(step);
  });

  // Create result panel (hidden initially)
  const result = document.createElement('div');
  result.className = 'quiz-result';
  result.hidden = true;

  // Extract result content from original cell 2
  const resultContent = contentCell.querySelectorAll('p, a, ul, h3');
  if (resultContent.length === 0) {
    // Build a default result structure
    const matchLabel = document.createElement('span');
    matchLabel.className = 'quiz-result-match';
    matchLabel.textContent = 'Your match';

    const resultHeading = document.createElement('h3');
    resultHeading.textContent = 'Total';

    const resultDesc = document.createElement('p');
    resultDesc.textContent = 'Our most comprehensive plan for your accounts, investments and property.';

    const actions = document.createElement('div');
    actions.className = 'quiz-result-actions';

    const learnMore = document.createElement('a');
    learnMore.href = 'https://lifelock.norton.com/products';
    learnMore.textContent = 'Learn more';

    const retake = document.createElement('button');
    retake.type = 'button';
    retake.className = 'quiz-retake';
    retake.textContent = 'Retake the quiz';

    actions.appendChild(learnMore);
    actions.appendChild(retake);

    result.appendChild(matchLabel);
    result.appendChild(resultHeading);
    result.appendChild(resultDesc);
    result.appendChild(actions);
  }
  contentCell.appendChild(result);

  // Event delegation for quiz interaction
  contentCell.addEventListener('click', (e) => {
    const optionBtn = e.target.closest('.quiz-option');
    if (!optionBtn) return;

    // Mark selected
    const currentStep = optionBtn.closest('.quiz-step');
    currentStep.querySelectorAll('.quiz-option').forEach((btn) => {
      btn.setAttribute('aria-pressed', 'false');
    });
    optionBtn.setAttribute('aria-pressed', 'true');

    // Advance to next step after brief delay
    const stepIndex = parseInt(currentStep.dataset.step, 10);
    setTimeout(() => {
      currentStep.hidden = true;
      const nextStep = contentCell.querySelector(`.quiz-step[data-step="${stepIndex + 1}"]`);
      if (nextStep) {
        nextStep.hidden = false;
      } else {
        // Show result
        result.hidden = false;
      }
    }, 400);
  });

  // Retake button handler
  contentCell.addEventListener('click', (e) => {
    if (e.target.closest('.quiz-retake')) {
      result.hidden = true;
      contentCell.querySelectorAll('.quiz-step').forEach((step, idx) => {
        step.hidden = idx !== 0;
        step.querySelectorAll('.quiz-option').forEach((btn) => {
          btn.setAttribute('aria-pressed', 'false');
        });
      });
    }
  });

  block.classList.add('columns-quiz-2-cols');
}
