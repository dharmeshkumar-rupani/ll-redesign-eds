/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-appbanner
 * Base block: columns
 * Source: https://lifelock.norton.com/
 * Generated: 2026-06-06
 * Note: The section.c-appbanner element has been removed from the live site.
 * Parser is validated against cached source.html artifacts only.
 * Live validation: section.c-appbanner removed from live site (verified via Playwright 2026-06-06).
 *
 * Extracts an app banner section with a phone mockup image on one side
 * and text content (badge, heading, description, app store buttons) on the other.
 * Produces a standard Columns block with 2 columns in 1 row.
 *
 * Columns blocks do NOT require field hints (per xwalk hinting rules).
 */
export default function parse(element, { document }) {
  // Column 1: App mockup image - the first img direct child of the section,
  // or the first img that is NOT inside the buttons/store area
  const allImages = element.querySelectorAll('img');
  let appImage = null;
  for (const img of allImages) {
    if (!img.closest('.c-appbanner__buttons') && !img.closest('.c-appbanner__store')) {
      appImage = img;
      break;
    }
  }

  // Column 2: Build content container with badge, heading, description, and store links
  const col2 = document.createElement('div');

  const badge = element.querySelector('.c-appbanner__badge, [class*="badge"]');
  if (badge) {
    const p = document.createElement('p');
    p.textContent = badge.textContent.trim();
    col2.appendChild(p);
  }

  const heading = element.querySelector('.c-appbanner__title, [class*="appbanner"] h2, h2, h1');
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    col2.appendChild(h);
  }

  const description = element.querySelector('.c-appbanner__lede, [class*="appbanner"] p:not(.c-appbanner__badge)');
  if (description) {
    const p = document.createElement('p');
    p.textContent = description.textContent.trim();
    col2.appendChild(p);
  }

  // App store buttons (links with images)
  const storeLinks = element.querySelectorAll('.c-appbanner__store, .c-appbanner__buttons a');
  storeLinks.forEach((link) => {
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href');
    const storeImg = link.querySelector('img');
    if (storeImg) {
      const img = document.createElement('img');
      img.src = storeImg.src || storeImg.getAttribute('src');
      img.alt = storeImg.alt || storeImg.getAttribute('alt') || '';
      a.appendChild(img);
    } else {
      a.textContent = link.textContent.trim();
    }
    col2.appendChild(a);
  });

  // Build cells array: single row with 2 columns
  // cells format: [[col1, col2]] = 1 row with 2 columns
  const cells = [];
  if (appImage) {
    const imgEl = document.createElement('img');
    imgEl.src = appImage.src || appImage.getAttribute('src');
    imgEl.alt = appImage.alt || appImage.getAttribute('alt') || '';
    cells.push([imgEl, col2]);
  } else {
    cells.push([col2]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-appbanner', cells });
  element.replaceWith(block);
}
