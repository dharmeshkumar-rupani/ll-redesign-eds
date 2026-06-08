import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const cols = [...row.children];
    const imageCol = cols[0];
    const contentCol = cols[1];

    if (imageCol) {
      const cardImage = document.createElement('div');
      cardImage.className = 'cards-xsell-image';
      cardImage.append(...imageCol.childNodes);
      li.append(cardImage);
    }

    if (contentCol) {
      const cardBody = document.createElement('div');
      cardBody.className = 'cards-xsell-body';
      cardBody.append(...contentCol.childNodes);

      // Process price
      const strongEl = cardBody.querySelector('p strong');
      if (strongEl) {
        const priceP = strongEl.closest('p');
        priceP.className = 'cards-xsell-price';
      }

      // Process CTA
      const link = cardBody.querySelector('a');
      if (link) {
        const ctaP = link.closest('p');
        if (ctaP) ctaP.className = 'cards-xsell-cta';
      }

      li.append(cardBody);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
