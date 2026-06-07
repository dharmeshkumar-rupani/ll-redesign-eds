export default function decorate(block) {
  // Wrap CTA buttons in a flex container for side-by-side layout
  const textCell = block.querySelector(':scope > div:last-child > div');
  if (!textCell) return;

  const buttonWrapper = textCell.querySelector('p.button-wrapper');
  if (!buttonWrapper) return;

  const secondaryP = buttonWrapper.nextElementSibling;
  if (!secondaryP || !secondaryP.querySelector('a')) return;

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'hero-lifestyle-ctas';
  textCell.insertBefore(ctaContainer, buttonWrapper);
  ctaContainer.appendChild(buttonWrapper);
  ctaContainer.appendChild(secondaryP);
}
