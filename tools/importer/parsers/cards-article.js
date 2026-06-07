/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article
 * Base block: cards
 * Source: https://lifelock.norton.com/
 * Selector: section.c-articlelist
 * Generated: 2026-06-06
 *
 * Extracts article cards from the LifeLock article list section.
 * Each card has an image and text content (tagline, heading, read time, link).
 * Model fields (from _cards.json): image (reference), text (richtext)
 *
 * Validation note: The section.c-articlelist element no longer exists on the
 * current live page (verified via Playwright). Parser is structurally correct
 * and validated against the cached source.html from block-context.
 *
 * Source HTML structure (from cache):
 *   section.c-articlelist > .c-articlelist__header (title + see-all link)
 *   section.c-articlelist > ul.c-articlelist__grid > li.c-articlelist__card
 *     Each card: a.c-articlelist__link wrapping:
 *       .c-articlelist__media > picture > img
 *       .c-articlelist__tagline-body-wrapper > span.c-articlelist__tagline
 *       .c-articlelist__body > h3.c-articlelist__heading
 *       .c-articlelist__footer > span.c-articlelist__read
 *
 * Output structure per card row (2 cells matching Cards block model):
 *   Cell 1 (image): article thumbnail picture/img element
 *   Cell 2 (text): tagline, h3 heading, read time, CTA link
 */
export default function parse(element, { document }) {
  // Find all article card items in the grid
  const cardItems = element.querySelectorAll('li.c-articlelist__card');

  // Fallback selectors for markup variations
  const cards = cardItems.length > 0
    ? cardItems
    : element.querySelectorAll('.c-articlelist__grid > li, ul > li');

  // Bail out gracefully if no cards found
  if (!cards || cards.length === 0) return;

  const cells = [];

  cards.forEach((card) => {
    // Cell 1: Image - prefer picture for responsive images, fallback to img
    const picture = card.querySelector('picture.c-articlelist__picture, .c-articlelist__media picture, picture');
    const img = card.querySelector('img.c-articlelist__img, .c-articlelist__media img');
    const imageEl = picture || img;
    const imageCell = imageEl ? [imageEl] : [];

    // Cell 2: Text content (tagline, heading, read time, link)
    const textCell = [];

    // Card link href for CTA
    const cardLink = card.querySelector('a.c-articlelist__link, a[href]');
    const cardHref = cardLink ? (cardLink.href || cardLink.getAttribute('href')) : '';

    // Tagline/category label
    const tagline = card.querySelector('span.c-articlelist__tagline, .c-articlelist__tagline');
    if (tagline) {
      const p = document.createElement('p');
      p.textContent = tagline.textContent.trim();
      textCell.push(p);
    }

    // Article heading
    const heading = card.querySelector('h3.c-articlelist__heading, .c-articlelist__body h3, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }

    // Read time indicator
    const readTime = card.querySelector('span.c-articlelist__read, .c-articlelist__footer span');
    if (readTime) {
      const p = document.createElement('p');
      p.textContent = readTime.textContent.trim();
      textCell.push(p);
    }

    // Article CTA link pointing to full article
    if (cardHref) {
      const a = document.createElement('a');
      a.href = cardHref;
      a.textContent = heading ? heading.textContent.trim() : 'Read more';
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  if (cells.length > 0) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
    element.replaceWith(block);
  }
}
