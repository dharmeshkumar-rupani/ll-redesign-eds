/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-awards.
 * Base block: carousel-awards (container block).
 * Source: https://lifelock.norton.com/
 * Generated: 2026-06-06 (v2)
 *
 * Live source structure (section.c-socialproof):
 *   - First child div: TrustPilot widget
 *     .c-trustpilot__container
 *       .c-trustpilot__container-link
 *         img.c-trustpilot__logo-image (TrustPilot logo)
 *         img.c-trustpilot__score-image (star rating)
 *         p.c-trustpilot__trust-score-reviews (text: "TrustScore 4.9 | 14425 reviews")
 *   - .c-socialproof__tile (repeated, each an award badge)
 *       .c-socialproof__tile__content
 *         .c-socialproof__tile__content__img > img (award badge image)
 *         .c-socialproof__tile__content__text > div (caption text)
 *
 * Target structure (container block):
 *   Each row = one slide with 2 columns: [image, caption text]
 *   Fields per item: media_image (with collapsed media_imageAlt), content_text
 */
export default function parse(element, { document }) {
  const cells = [];

  // Helper: create a cell with field hint comment before content
  function hintedCell(fieldName, elements) {
    const frag = document.createDocumentFragment();
    if (elements.length > 0) {
      frag.appendChild(document.createComment(` field:${fieldName} `));
      elements.forEach((el) => frag.appendChild(el));
    }
    return frag;
  }

  // 1. TrustPilot widget as first slide
  const trustpilotContainer = element.querySelector('.c-trustpilot__container');
  if (trustpilotContainer) {
    const logoImg = trustpilotContainer.querySelector('.c-trustpilot__logo-image, img');
    const scoreImg = trustpilotContainer.querySelector('.c-trustpilot__score-image');
    const reviewsText = trustpilotContainer.querySelector('.c-trustpilot__trust-score-reviews, p');

    // Image cell with field hint
    const imageElements = [];
    if (logoImg) imageElements.push(logoImg);
    if (scoreImg) imageElements.push(scoreImg);
    const imageCell = hintedCell('media_image', imageElements);

    // Content cell with field hint
    const contentElements = [];
    if (reviewsText) contentElements.push(reviewsText);
    const contentCell = hintedCell('content_text', contentElements);

    cells.push([imageCell, contentCell]);
  }

  // 2. Award tiles as subsequent slides
  const tiles = element.querySelectorAll('.c-socialproof__tile');
  tiles.forEach((tile) => {
    const img = tile.querySelector('.c-socialproof__tile__content__img img, img');
    const textDiv = tile.querySelector('.c-socialproof__tile__content__text div, .c-socialproof__tile__content__text');

    // Image cell with field hint
    const imageElements = [];
    if (img) imageElements.push(img);
    const imageCell = hintedCell('media_image', imageElements);

    // Content cell with field hint
    const contentElements = [];
    const captionText = textDiv ? textDiv.textContent.trim() : '';
    if (captionText && textDiv) contentElements.push(textDiv);
    const contentCell = hintedCell('content_text', contentElements);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-awards', cells });
  element.replaceWith(block);
}
