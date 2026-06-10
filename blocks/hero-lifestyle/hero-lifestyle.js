import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Hero Lifestyle: full-bleed background photo with a white text overlay
 * (heading + paragraph + primary/secondary CTA).
 *
 * The block model renders two cells (an image and a rich-text content cell),
 * but the order/wrapping can vary. This rebuilds a stable structure so the
 * CSS (which targets the first child as the image and the last child as the
 * content overlay) always matches:
 *
 *   .hero-lifestyle
 *     > div (image)   > div > picture
 *     > div (content) > div > h1 / p / ctas
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const imageCell = cells.find((cell) => cell.querySelector('picture'));
  const contentCell = cells.find(
    (cell) => cell !== imageCell && cell.querySelector('h1, h2, h3, p, a, ul'),
  );

  const imageRow = document.createElement('div');
  const imageInner = document.createElement('div');
  if (imageCell) {
    moveInstrumentation(imageCell, imageInner);
    imageInner.append(...imageCell.childNodes);
  }
  imageRow.append(imageInner);

  const contentRow = document.createElement('div');
  const contentInner = document.createElement('div');
  if (contentCell) {
    moveInstrumentation(contentCell, contentInner);
    contentInner.append(...contentCell.childNodes);
  }
  contentRow.append(contentInner);

  block.textContent = '';
  block.append(imageRow, contentRow);

  // Group the primary (bold link -> button-wrapper) and secondary CTA so they
  // can sit side by side.
  const buttonWrapper = contentInner.querySelector('p.button-wrapper');
  const secondaryP = buttonWrapper && buttonWrapper.nextElementSibling;
  if (buttonWrapper && secondaryP && secondaryP.querySelector('a')) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'hero-lifestyle-ctas';
    contentInner.insertBefore(ctaContainer, buttonWrapper);
    ctaContainer.append(buttonWrapper, secondaryP);
  }
}
