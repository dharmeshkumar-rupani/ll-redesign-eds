/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-scan variant.
 * Base block: columns
 * Source: https://lifelock.norton.com/
 * Selector: .c-pdes .c-pdes__email
 * Generated: 2026-06-06
 *
 * This block represents a "Personal Data Exposure Scan" two-column layout:
 * - Column 1 (left): Title, description, email form CTA, legal text, opt-in
 * - Column 2 (right): Illustration image
 *
 * Live DOM structure:
 *   div.c-pdes__email
 *     div.c-pdes__email-grid
 *       div.c-pdes__email-col.c-pdes__email-col--left
 *         h2.c-pdes__email-title
 *         span.c-pdes__email-description
 *         form.c-pdes__email-form (input + submit button)
 *         div.c-pdes__email-legal
 *         label.c-pdes__email-optin
 *       div.c-pdes__email-col.c-pdes__email-col--right
 *         picture.c-pdes__email-image > img
 */
export default function parse(element, { document }) {
  // === Column 1: Left panel - text content and CTA ===
  const leftCol = element.querySelector('.c-pdes__email-col--left, [class*="email-col--left"]');

  // Extract heading
  const heading = leftCol
    ? leftCol.querySelector('.c-pdes__email-title, h2')
    : element.querySelector('h2');

  // Extract description
  const description = leftCol
    ? leftCol.querySelector('.c-pdes__email-description, [class*="email-description"]')
    : null;

  // Extract submit button text for CTA
  const submitBtn = leftCol
    ? leftCol.querySelector('.c-pdes__email-submit, button[class*="email-submit"]')
    : null;

  // Extract legal text
  const legalDiv = leftCol
    ? leftCol.querySelector('.c-pdes__email-legal, [class*="email-legal"]')
    : null;

  // Extract opt-in label text
  const optinLabel = leftCol
    ? leftCol.querySelector('.c-pdes__email-optin-label, [class*="email-optin-label"]')
    : null;

  // Build column 1 content container
  const col1 = document.createElement('div');

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    col1.append(h2);
  }

  if (description) {
    const descP = document.createElement('p');
    descP.textContent = description.textContent.trim();
    col1.append(descP);
  }

  // Represent form submit as a CTA link
  if (submitBtn) {
    const ctaLink = document.createElement('a');
    ctaLink.href = '#scan';
    ctaLink.textContent = submitBtn.textContent.trim() || 'Submit';
    const ctaPara = document.createElement('p');
    ctaPara.append(ctaLink);
    col1.append(ctaPara);
  }

  if (legalDiv) {
    const legalP = document.createElement('p');
    legalP.innerHTML = legalDiv.innerHTML;
    col1.append(legalP);
  }

  if (optinLabel) {
    const optinP = document.createElement('p');
    optinP.textContent = optinLabel.textContent.trim();
    col1.append(optinP);
  }

  // === Column 2: Right panel - image ===
  const rightCol = element.querySelector('.c-pdes__email-col--right, [class*="email-col--right"]');

  const col2 = document.createElement('div');
  if (rightCol) {
    const picture = rightCol.querySelector('picture');
    const img = rightCol.querySelector('img');
    if (picture) {
      col2.append(picture.cloneNode(true));
    } else if (img) {
      col2.append(img.cloneNode(true));
    }
  }

  // === Build cells array ===
  // Columns block: single row with two columns (left: content, right: image)
  const cells = [
    [col1, col2],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-scan', cells });
  element.replaceWith(block);
}
