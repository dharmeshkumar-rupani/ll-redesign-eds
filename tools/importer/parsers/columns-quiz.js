/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-quiz
 * Base block: columns
 * Source: https://lifelock.norton.com/
 * Selector: .c-quiz__container
 * Generated: 2026-06-06
 *
 * Maps the interactive quiz component into a Columns block with two columns:
 * - Column 1 (left): Quiz questions with their answer options
 * - Column 2 (right): Results section with product recommendations and CTA
 *
 * Live DOM structure:
 * .c-quiz__container
 *   .c-quiz[data-active-screen]
 *     .c-quiz__nav (back, retake, progress, close)
 *     .c-quiz__screen[data-screen="q1"] - concerns checkboxes
 *     .c-quiz__screen[data-screen="q2"] - people to protect radios
 *     .c-quiz__screen[data-screen="email"] - email opt-in
 *     .c-quiz__screen[data-screen="loading"] - loading state
 *     .c-quiz__screen[data-screen="results"] - product results
 *   .c-quiz__innerModal__container
 */
export default function parse(element, { document }) {
  // --- Extract quiz questions (screens q1, q2, email) ---
  const quizEl = element.querySelector('.c-quiz');
  const leftCol = document.createElement('div');
  const rightCol = document.createElement('div');

  if (quizEl) {
    // Get question screens (q1, q2, email - skip loading and results)
    const questionScreens = quizEl.querySelectorAll(
      '.c-quiz__screen[data-screen="q1"], .c-quiz__screen[data-screen="q2"], .c-quiz__screen[data-screen="email"]'
    );

    questionScreens.forEach((screen) => {
      // Extract question heading
      const heading = screen.querySelector('.c-quiz__heading, .c-quiz__legend, legend');
      if (heading) {
        const h3 = document.createElement('h3');
        h3.textContent = heading.textContent.trim();
        leftCol.appendChild(h3);
      }

      // Extract answer options as a list
      const answerItems = screen.querySelectorAll('.c-quiz__answergroup__item label');
      if (answerItems.length > 0) {
        const ul = document.createElement('ul');
        answerItems.forEach((label) => {
          const text = label.textContent.trim();
          if (text) {
            const li = document.createElement('li');
            li.textContent = text;
            ul.appendChild(li);
          }
        });
        if (ul.children.length > 0) {
          leftCol.appendChild(ul);
        }
      }

      // For email screen, extract button options (Yes/No)
      const emailBtns = screen.querySelectorAll('.c-quiz__email__btn__yes, .c-quiz__email__btn__no');
      if (emailBtns.length > 0) {
        const ul = document.createElement('ul');
        emailBtns.forEach((btn) => {
          const li = document.createElement('li');
          li.textContent = btn.textContent.trim();
          ul.appendChild(li);
        });
        leftCol.appendChild(ul);
      }
    });

    // --- Extract results section ---
    const resultsScreen = quizEl.querySelector('.c-quiz__screen[data-screen="results"]');
    if (resultsScreen) {
      // Results preheading
      const preheading = resultsScreen.querySelector('.c-quiz__results__preheading');
      if (preheading) {
        const p = document.createElement('p');
        p.textContent = preheading.textContent.trim();
        rightCol.appendChild(p);
      }

      // Product names (unique plan names)
      const productNames = resultsScreen.querySelectorAll('.c-quiz__results__product__name');
      const uniqueNames = [...new Set(Array.from(productNames).map((el) => el.textContent.trim()))];
      if (uniqueNames.length > 0) {
        const ul = document.createElement('ul');
        uniqueNames.forEach((name) => {
          const li = document.createElement('li');
          li.textContent = name;
          ul.appendChild(li);
        });
        rightCol.appendChild(ul);
      }

      // CTA buttons/links from results
      const ctaLinks = resultsScreen.querySelectorAll('a.c-btn, a.c-quiz__results__cta, .c-quiz__results__product__cta a');
      if (ctaLinks.length > 0) {
        ctaLinks.forEach((cta) => {
          const a = document.createElement('a');
          a.href = cta.href || cta.getAttribute('href') || '#';
          a.textContent = cta.textContent.trim();
          rightCol.appendChild(a);
        });
      }
    }
  }

  // Fallback: if no content extracted, use basic text from element
  if (leftCol.children.length === 0) {
    const fallbackHeading = element.querySelector('h2, h3, .c-quiz__heading');
    if (fallbackHeading) {
      const h3 = document.createElement('h3');
      h3.textContent = fallbackHeading.textContent.trim();
      leftCol.appendChild(h3);
    }
  }

  // --- Build cells array ---
  // Columns block: single row with two columns
  const cells = [
    [leftCol, rightCol],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-quiz', cells });
  element.replaceWith(block);
}
