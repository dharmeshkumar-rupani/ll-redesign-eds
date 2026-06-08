import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const items = [...block.children];
  const list = document.createElement('div');
  list.className = 'cards-feature-list';

  items.forEach((row) => {
    const item = document.createElement('div');
    item.className = 'cards-feature-item';
    moveInstrumentation(row, item);

    const cols = [...row.children];
    const titleCol = cols[0];
    const contentCol = cols[1];

    // Header bar with icon and title
    const header = document.createElement('div');
    header.className = 'cards-feature-header';

    const icon = document.createElement('span');
    icon.className = 'cards-feature-icon';

    const title = document.createElement('span');
    title.className = 'cards-feature-title';
    title.textContent = titleCol ? titleCol.textContent.trim() : '';

    header.append(icon, title);

    // Panel content — always visible
    const panel = document.createElement('div');
    panel.className = 'cards-feature-panel';

    if (contentCol) {
      panel.append(...contentCol.childNodes);
    }

    item.append(header, panel);
    list.append(item);
  });

  block.textContent = '';
  block.append(list);
}
