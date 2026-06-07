/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-feature
 * Base block: tabs
 * Source: https://lifelock.norton.com/
 * Selector: section.c-features .c-features__desktop
 * Generated: 2026-06-06
 *
 * Source structure: .c-features__desktop > ol.c-features__list > li.c-features__item
 * Each item has: tagline (.c-features__tagline), heading (.c-features__heading),
 * body text (.c-features__item-body p), and a shared media figure (.c-features__media)
 *
 * Target structure (container block):
 * Each row = one tab item with 2 cells:
 *   Cell 1: tab title (tagline text)
 *   Cell 2: heading + image + description (grouped content_ fields)
 *
 * UE Model fields (tabs-feature-item):
 *   - title (text) -> Cell 1
 *   - content_heading (text) -> Cell 2
 *   - content_headingType (select, collapsed) -> skipped
 *   - content_image (reference) -> Cell 2
 *   - content_richtext (richtext) -> Cell 2
 */
export default function parse(element, { document }) {
  // Extract tab items from the ordered list
  const items = element.querySelectorAll('li.c-features__item');

  // Extract the shared media image (used for each tab or first tab)
  const mediaImage = element.querySelector('figure.c-features__media img[src]:not([src^="data:"])');

  const cells = [];

  items.forEach((item, index) => {
    // Cell 1: Tab title from tagline
    const tagline = item.querySelector('.c-features__tagline');
    const titleFrag = document.createDocumentFragment();
    titleFrag.appendChild(document.createComment(' field:title '));
    if (tagline) {
      const titleText = document.createElement('p');
      titleText.textContent = tagline.textContent.trim();
      titleFrag.appendChild(titleText);
    }

    // Cell 2: Grouped content fields (content_heading + content_image + content_richtext)
    const contentFrag = document.createDocumentFragment();

    // content_heading field
    const heading = item.querySelector('.c-features__heading, h3, h2');
    contentFrag.appendChild(document.createComment(' field:content_heading '));
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      contentFrag.appendChild(h3);
    }

    // content_image field - use the shared media image for each tab
    if (mediaImage) {
      contentFrag.appendChild(document.createComment(' field:content_image '));
      const img = document.createElement('img');
      img.src = mediaImage.src;
      if (mediaImage.alt) img.alt = mediaImage.alt;
      contentFrag.appendChild(img);
    }

    // content_richtext field - body description
    const bodyText = item.querySelector('.c-features__item-body p, .c-features__item-body');
    contentFrag.appendChild(document.createComment(' field:content_richtext '));
    if (bodyText) {
      const p = document.createElement('p');
      p.textContent = bodyText.textContent.trim();
      contentFrag.appendChild(p);
    }

    cells.push([titleFrag, contentFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-feature', cells });
  element.replaceWith(block);
}
