import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  const accordion = document.createElement('div');
  accordion.className = 'accordion-items';

  items.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'accordion-item';
    moveInstrumentation(row, item);

    const cols = [...row.children];
    const titleCol = cols[0];
    const contentCol = cols[1];

    const header = document.createElement('button');
    header.className = 'accordion-header';
    header.setAttribute('aria-expanded', 'false');

    const titleText = titleCol.textContent.trim();
    const titleSpan = document.createElement('span');
    titleSpan.className = 'accordion-title';
    titleSpan.textContent = titleText;

    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');

    header.append(titleSpan, icon);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.setAttribute('role', 'region');
    panel.hidden = true;

    if (contentCol) {
      panel.append(...contentCol.childNodes);
    }

    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
      item.classList.toggle('open', !expanded);
    });

    item.append(header, panel);
    accordion.append(item);
  });

  block.textContent = '';
  block.append(accordion);
}
