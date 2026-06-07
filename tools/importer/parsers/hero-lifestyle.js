/* eslint-disable */
/* global WebImporter */

/**
 * Parser: hero-lifestyle
 * Base block: hero
 * Source: https://lifelock.norton.com/
 * Selector: div.slider.carousel.panelcontainer.c-slider--controls-inside
 * Generated: 2026-06-06
 *
 * UE Model fields (from blocks/hero/_hero.json):
 *   - image (reference) → Row 1
 *   - imageAlt (collapsed into image, no separate row)
 *   - text (richtext) → Row 2
 *
 * Source structure (live carousel):
 *   - .c-slider__container (slides) → each slide has:
 *     - .cmp-container__bg-img__picture (img) → background image
 *     - .c-title h3 → heading
 *     - .c-btn__container a → CTA link
 *
 * Strategy: Extract first non-clone slide as the hero content.
 */
export default function parse(element, { document }) {
  // Find the first real slide (not a clone used for infinite scroll)
  const firstSlide = element.querySelector('.c-slider__container:not(.glide__slide--clone)');
  const slideSource = firstSlide || element;

  // Extract background image from the slide
  const bgImage = slideSource.querySelector('.cmp-container__bg-img__picture, .cmp-container__bg-img__container img, picture img');

  // Extract heading (h3 in .c-title, or fallback to any h1-h3)
  const heading = slideSource.querySelector('.c-title h3, .c-title h2, .c-title h1, h3, h2, h1');

  // Extract CTA link
  const ctaLink = slideSource.querySelector('.c-btn__container a, .c-btn a, a.c-btn');

  // Build cells array matching UE model structure (2 rows: image, text)
  const cells = [];

  // Row 1: image field
  const imageCell = document.createDocumentFragment();
  imageCell.appendChild(document.createComment(' field:image '));
  if (bgImage) {
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = bgImage.src || bgImage.getAttribute('src') || '';
    img.alt = bgImage.alt || bgImage.getAttribute('alt') || '';
    picture.appendChild(img);
    imageCell.appendChild(picture);
  }
  cells.push([imageCell]);

  // Row 2: text field (heading + CTA)
  const textCell = document.createDocumentFragment();
  textCell.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h1 = document.createElement('h1');
    h1.textContent = heading.textContent.trim();
    textCell.appendChild(h1);
  }

  if (ctaLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = ctaLink.href || ctaLink.getAttribute('href') || '';
    a.textContent = ctaLink.textContent.trim();
    const strong = document.createElement('strong');
    strong.appendChild(a);
    p.appendChild(strong);
    textCell.appendChild(p);
  }

  cells.push([textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-lifestyle', cells });
  element.replaceWith(block);
}
