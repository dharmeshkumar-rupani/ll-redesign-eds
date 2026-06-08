import { moveInstrumentation } from '../../scripts/scripts.js';

function createStars(rating) {
  const stars = document.createElement('div');
  stars.className = 'cards-review-stars';
  const fullStars = Math.floor(rating);
  for (let i = 0; i < 5; i += 1) {
    const star = document.createElement('span');
    star.className = i < fullStars ? 'star full' : 'star empty';
    star.textContent = '★';
    stars.append(star);
  }
  return stars;
}

export default function decorate(block) {
  const rows = [...block.children];
  const cards = document.createElement('div');
  cards.className = 'cards-review-grid';

  rows.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'cards-review-card';
    moveInstrumentation(row, card);

    const cols = [...row.children];
    const contentCol = cols[0] || cols[1];

    if (contentCol) {
      const elements = [...contentCol.children];
      elements.forEach((el) => {
        if (el.tagName === 'H3' || el.tagName === 'H4') {
          el.className = 'cards-review-title';
          card.append(el);
        } else if (el.tagName === 'P') {
          const text = el.textContent.trim();
          if (text.includes('LifeLock') && text.includes('Protection')) {
            el.className = 'cards-review-product';
            card.append(el);
            const stars = createStars(5);
            card.append(stars);
          } else if (text.match(/\d{1,2}\/\d{1,2}\/\d{4}/) || text.includes('Verified')) {
            el.className = 'cards-review-meta';
            card.append(el);
          } else if (text.length > 50) {
            el.className = 'cards-review-text';
            card.append(el);
          } else {
            el.className = 'cards-review-meta';
            card.append(el);
          }
        } else {
          card.append(el);
        }
      });
    }

    cards.append(card);
  });

  block.textContent = '';
  block.append(cards);
}
