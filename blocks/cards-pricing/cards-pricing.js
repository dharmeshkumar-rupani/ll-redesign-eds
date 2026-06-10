import { moveInstrumentation } from '../../scripts/scripts.js';

function buildToggle(block, config = {}) {
  const annualLabel = config.annualLabel || 'Annual';
  const saveBadge = config.saveBadge || 'Save 16%';
  const monthlyLabel = config.monthlyLabel || 'Monthly';

  const toggle = document.createElement('div');
  toggle.className = 'cards-pricing-toggle';

  const indicator = document.createElement('span');
  indicator.className = 'cards-pricing-toggle-indicator';

  const annualBtn = document.createElement('button');
  annualBtn.className = 'cards-pricing-toggle-btn active';
  annualBtn.innerHTML = `<span class="cards-pricing-toggle-label">${annualLabel}</span>${saveBadge ? `<span class="cards-pricing-save-badge">${saveBadge}</span>` : ''}`;

  const monthlyBtn = document.createElement('button');
  monthlyBtn.className = 'cards-pricing-toggle-btn';
  monthlyBtn.innerHTML = `<span class="cards-pricing-toggle-label">${monthlyLabel}</span>`;

  toggle.append(indicator, annualBtn, monthlyBtn);

  annualBtn.addEventListener('click', () => {
    annualBtn.classList.add('active');
    monthlyBtn.classList.remove('active');
    indicator.style.transform = 'translateX(0)';
    block.classList.remove('monthly');
    block.classList.add('annual');
  });

  monthlyBtn.addEventListener('click', () => {
    monthlyBtn.classList.add('active');
    annualBtn.classList.remove('active');
    indicator.style.transform = 'translateX(100%)';
    block.classList.remove('annual');
    block.classList.add('monthly');
  });

  return toggle;
}

export default function decorate(block) {
  block.classList.add('annual');

  const rows = [...block.children];

  // A real plan card always has a heading, feature list, price, or image.
  // Any leading row(s) without those are optional block-level toggle config:
  // cells = [annual label, save badge, monthly label].
  const isCardRow = (row) => row.querySelector('h3, ul, picture, p strong');
  const config = {};
  let firstCardIndex = 0;
  if (rows.length && !isCardRow(rows[0])) {
    const configCells = [];
    while (firstCardIndex < rows.length && !isCardRow(rows[firstCardIndex])) {
      configCells.push(...[...rows[firstCardIndex].children]);
      firstCardIndex += 1;
    }
    const val = (i) => (configCells[i] ? configCells[i].textContent.trim() : '');
    config.annualLabel = val(0);
    config.saveBadge = val(1);
    config.monthlyLabel = val(2);
    // Remove the consumed config rows so they are not rendered as cards.
    rows.slice(0, firstCardIndex).forEach((row) => row.remove());
  }

  const ul = document.createElement('ul');
  rows.slice(firstCardIndex).forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-pricing-card-image';
      } else {
        div.className = 'cards-pricing-card-body';
      }
    });
    ul.append(li);
  });

  ul.querySelectorAll('.cards-pricing-card-body').forEach((body) => {
    const h3 = body.querySelector('h3');
    if (h3) {
      const nextP = h3.nextElementSibling;
      if (nextP && nextP.tagName === 'P' && nextP.querySelector('em:only-child')) {
        const titleRow = document.createElement('div');
        titleRow.className = 'cards-pricing-title-row';
        h3.replaceWith(titleRow);
        titleRow.append(h3, nextP);
      }
    }

    const priceP = body.querySelector('p strong');
    if (priceP) {
      const priceText = priceP.textContent;
      const parts = priceText.split('|').map((s) => s.trim());
      const annualPrice = parts[0] || priceText;
      const monthlyPrice = parts[1] || annualPrice;

      const priceContainer = document.createElement('div');
      priceContainer.className = 'cards-pricing-price-container';

      const annualEl = document.createElement('span');
      annualEl.className = 'cards-pricing-price annual-price';
      const [dollars, unit] = annualPrice.split('/');
      annualEl.innerHTML = `<span class="cards-pricing-price-amount">${dollars.trim()}</span><span class="cards-pricing-price-unit">/${(unit || 'mo').trim()}</span>`;

      const monthlyEl = document.createElement('span');
      monthlyEl.className = 'cards-pricing-price monthly-price';
      const [mDollars, mUnit] = monthlyPrice.split('/');
      monthlyEl.innerHTML = `<span class="cards-pricing-price-amount">${mDollars.trim()}</span><span class="cards-pricing-price-unit">/${(mUnit || 'mo').trim()}</span>`;

      priceContainer.append(annualEl, monthlyEl);
      priceP.closest('p').replaceWith(priceContainer);
    }

    const allPs = [...body.querySelectorAll('p')];
    allPs.forEach((p) => {
      const text = p.textContent.trim();
      if (text.startsWith('Pay ') && text.includes('today')) {
        const parts = text.split('|').map((s) => s.trim());
        if (parts.length === 2) {
          p.innerHTML = `<span class="annual-subprice">${parts[0]}</span><span class="monthly-subprice">${parts[1]}</span>`;
        }
        p.classList.add('cards-pricing-subprice');
      }
    });

    const links = [...body.querySelectorAll('p a[href]')];
    const ctaPs = [];
    links.forEach((a) => {
      const p = a.closest('p');
      if (p && !ctaPs.includes(p)) ctaPs.push(p);
    });

    if (ctaPs.length === 2) {
      ctaPs[0].classList.add('cards-pricing-cta', 'annual-cta');
      ctaPs[1].classList.add('cards-pricing-cta', 'monthly-cta');
    } else if (ctaPs.length === 1) {
      ctaPs[0].classList.add('cards-pricing-cta', 'annual-cta');
    }

    const featureList = body.querySelector('ul');
    if (featureList) {
      featureList.classList.add('cards-pricing-features');

      const ctaWrapper = document.createElement('div');
      ctaWrapper.className = 'cards-pricing-cta-wrapper';
      ctaPs.forEach((p) => ctaWrapper.append(p));

      [...body.querySelectorAll('p')].forEach((p) => {
        const em = p.querySelector('em');
        if (em && em.textContent.toLowerCase().includes('pricing details')) {
          ctaWrapper.append(p);
        }
      });

      body.append(featureList, ctaWrapper);
    }
  });

  const toggle = buildToggle(block, config);

  block.textContent = '';
  block.append(toggle, ul);
}
