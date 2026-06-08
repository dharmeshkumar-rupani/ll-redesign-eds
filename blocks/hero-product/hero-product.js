import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  block.classList.add('annual');

  const rows = [...block.children];
  const leftCol = document.createElement('div');
  leftCol.className = 'hero-product-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'hero-product-right';

  // Extract content from rows
  let imageEl = null;
  let infoContent = null;

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      if (col.querySelector('picture') && !col.querySelector('h1, h2, h3, p strong')) {
        moveInstrumentation(col, leftCol);
        imageEl = col;
      } else {
        moveInstrumentation(col, rightCol);
        infoContent = col;
      }
    });
  });

  // Build LEFT column: image + features bar
  if (imageEl) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'hero-product-image';
    imageWrapper.append(...imageEl.childNodes);
    leftCol.append(imageWrapper);
  }

  // Build RIGHT column: product info card
  if (infoContent) {
    // Process breadcrumb - first paragraph before h1
    const h1El = infoContent.querySelector('h1');
    const firstP = infoContent.querySelector('p');
    if (firstP && h1El && h1El.previousElementSibling === firstP) {
      firstP.className = 'hero-product-breadcrumb';
    }

    // Process rating
    const ratingP = infoContent.querySelector('p em');
    if (ratingP) {
      const ratingEl = ratingP.closest('p');
      ratingEl.className = 'hero-product-rating';
    }

    // Build badge pills after title
    const h1 = infoContent.querySelector('h1');
    if (h1) {
      const badges = document.createElement('div');
      badges.className = 'hero-product-badges';
      badges.innerHTML = '<span class="hero-product-badge">Best Protection</span><span class="hero-product-badge">Save with annual plans</span>';
      h1.after(badges);
    }

    // Process description
    const allPs = [...infoContent.querySelectorAll('p')];
    allPs.forEach((p) => {
      const text = p.textContent.trim().toLowerCase();
      if (text.startsWith('best for')) {
        p.className = 'hero-product-description';
      }
      if (text.includes('money-back') || text.includes('60-day') || text.includes('guarantee')) {
        p.className = 'hero-product-guarantee';
      }
      if (text.includes('24/7') && !p.querySelector('a')) {
        p.className = 'hero-product-guarantee';
      }
    });

    // Process features list into a features bar
    const featureList = infoContent.querySelector('ul');
    if (featureList) {
      featureList.className = 'hero-product-features';
      leftCol.append(featureList);
    }

    // Process price
    let annualPrice = '199.99';
    let monthlyPrice = '19.99';
    const strongEl = infoContent.querySelector('p strong');
    if (strongEl && !strongEl.closest('.hero-product-cta')) {
      const priceP = strongEl.closest('p');
      const priceText = strongEl.textContent;
      const parts = priceText.split('|').map((s) => s.trim());
      annualPrice = parts[0] || priceText;
      monthlyPrice = parts[1] || annualPrice;

      const priceContainer = document.createElement('div');
      priceContainer.className = 'hero-product-price-section';

      const priceLabel = document.createElement('span');
      priceLabel.className = 'hero-product-price-label';
      priceLabel.textContent = 'Your price:';

      const annualEl = document.createElement('span');
      annualEl.className = 'hero-product-price annual-price';
      annualEl.innerHTML = annualPrice;

      const monthlyEl = document.createElement('span');
      monthlyEl.className = 'hero-product-price monthly-price';
      monthlyEl.innerHTML = monthlyPrice;

      priceContainer.append(priceLabel, annualEl, monthlyEl);
      priceP.replaceWith(priceContainer);
    }

    // Build plan options
    const planOptions = document.createElement('div');
    planOptions.className = 'hero-product-plan-options';
    const planLabel = document.createElement('h3');
    planLabel.className = 'hero-product-section-label';
    planLabel.textContent = 'Plan options';

    const planTabs = document.createElement('div');
    planTabs.className = 'hero-product-plan-tabs';

    const plans = [
      { icon: 'person', name: 'Individual', desc: '1 adult' },
      { icon: 'couple', name: 'Couple', desc: '2 adults' },
      { icon: 'family', name: 'Family', desc: '2 adults + up to 5 kids' },
    ];

    plans.forEach((plan, i) => {
      const tab = document.createElement('button');
      tab.className = `hero-product-plan-tab${i === 0 ? ' active' : ''}`;
      tab.innerHTML = `<span class="hero-product-plan-icon hero-product-plan-icon-${plan.icon}"></span><span class="hero-product-plan-name">${plan.name}</span><span class="hero-product-plan-desc">${plan.desc}</span>`;
      tab.addEventListener('click', () => {
        planTabs.querySelectorAll('.hero-product-plan-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
      });
      planTabs.append(tab);
    });

    planOptions.append(planLabel, planTabs);

    // Build billing options
    const billingOptions = document.createElement('div');
    billingOptions.className = 'hero-product-billing-options';
    const billingLabel = document.createElement('h3');
    billingLabel.className = 'hero-product-section-label';
    billingLabel.textContent = 'Billing options';

    const billingTabs = document.createElement('div');
    billingTabs.className = 'hero-product-billing-tabs';

    const annualPriceClean = annualPrice.replace('$', '');
    const monthlyPriceClean = monthlyPrice.replace('$', '');

    const annualTab = document.createElement('button');
    annualTab.className = 'hero-product-billing-tab active';
    annualTab.innerHTML = `<span class="hero-product-billing-name">Annual</span><span class="hero-product-billing-badge">16% OFF*</span><span class="hero-product-billing-price">$<strong>${annualPriceClean}</strong>/yr.</span>`;

    const monthlyTab = document.createElement('button');
    monthlyTab.className = 'hero-product-billing-tab';
    monthlyTab.innerHTML = `<span class="hero-product-billing-name">Monthly</span><span class="hero-product-billing-price">$<strong>${monthlyPriceClean}</strong>/mo.</span>`;

    annualTab.addEventListener('click', () => {
      annualTab.classList.add('active');
      monthlyTab.classList.remove('active');
      block.classList.remove('monthly');
      block.classList.add('annual');
    });

    monthlyTab.addEventListener('click', () => {
      monthlyTab.classList.add('active');
      annualTab.classList.remove('active');
      block.classList.remove('annual');
      block.classList.add('monthly');
    });

    billingTabs.append(annualTab, monthlyTab);
    billingOptions.append(billingLabel, billingTabs);

    // Process CTA link
    const ctaLink = infoContent.querySelector('a');
    if (ctaLink) {
      const ctaP = ctaLink.closest('p');
      if (ctaP) {
        ctaP.className = 'hero-product-cta';
        ctaLink.innerHTML = `<span class="hero-product-cta-icon"></span>${ctaLink.textContent}`;
      }
    }

    // Insert plan and billing options into info content
    const description = infoContent.querySelector('.hero-product-description');
    if (description) {
      description.after(planOptions);
      planOptions.after(billingOptions);
    }

    rightCol.append(...infoContent.childNodes);

    // Reorder: Price → CTA → Guarantee texts
    const ctaEl = rightCol.querySelector('.hero-product-cta');
    const guaranteeEls = rightCol.querySelectorAll('.hero-product-guarantee');
    if (ctaEl) {
      rightCol.append(ctaEl);
      guaranteeEls.forEach((g) => rightCol.append(g));
    }
  }

  // Assemble
  block.textContent = '';
  block.append(leftCol, rightCol);

  // Move the right card to section level for sticky across sections
  requestAnimationFrame(() => {
    const section = block.closest('.section');
    if (!section || window.innerWidth < 900) return;

    const nextSection = section.nextElementSibling;
    if (!nextSection) return;

    // Create a page-level wrapper that contains all left content + sticky right card
    const pageLayout = document.createElement('div');
    pageLayout.className = 'hero-product-page-layout';

    const leftContent = document.createElement('div');
    leftContent.className = 'hero-product-page-left';

    // Move the right col out and into page layout
    const stickyCard = rightCol.cloneNode(true);
    stickyCard.className = 'hero-product-right hero-product-sticky-card annual';
    rightCol.remove();

    // Re-bind billing toggle events on cloned card
    const billingBtns = stickyCard.querySelectorAll('.hero-product-billing-tab');
    if (billingBtns.length === 2) {
      billingBtns[0].addEventListener('click', () => {
        billingBtns[0].classList.add('active');
        billingBtns[1].classList.remove('active');
        stickyCard.classList.remove('monthly');
        stickyCard.classList.add('annual');
      });
      billingBtns[1].addEventListener('click', () => {
        billingBtns[1].classList.add('active');
        billingBtns[0].classList.remove('active');
        stickyCard.classList.remove('annual');
        stickyCard.classList.add('monthly');
      });
    }

    // Re-bind plan tab events
    const planBtns = stickyCard.querySelectorAll('.hero-product-plan-tab');
    planBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        planBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Insert page layout wrapper after the hero block
    const wrapper = block.closest('.hero-product-wrapper');
    if (!wrapper) return;

    section.insertBefore(pageLayout, wrapper);
    leftContent.append(wrapper);

    // Move subsequent sections' inner content into the left column
    const sectionsToMerge = [];
    let sibling = section.nextElementSibling;
    while (sibling && !sibling.querySelector('.cards-xsell, .cards-review')) {
      sectionsToMerge.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    sectionsToMerge.forEach((s) => {
      const content = document.createElement('div');
      content.className = 'hero-product-merged-section';
      while (s.firstChild) content.append(s.firstChild);
      leftContent.append(content);
      s.remove();
    });

    pageLayout.append(leftContent, stickyCard);
  });
}
