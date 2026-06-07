/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pricing
 * Base block: cards
 * Source: https://lifelock.norton.com/
 * Selector: section.c-plans .c-plans__pricing
 * Generated: 2026-06-06
 *
 * Extracts pricing plan cards (Core, Advanced, Total) from the LifeLock plans section.
 * Each card becomes one row with two columns: image (empty for this variant) and text (richtext).
 * The text column contains the plan title, badge, description, pricing, features list, and CTA.
 *
 * UE Model fields (card):
 *   - image (reference) -> Cell 1 (empty for pricing cards)
 *   - text (richtext) -> Cell 2 (plan content)
 *
 * Note: Live page validation may fail due to A/B testing frameworks dynamically altering page
 * structure. Parser logic validated against cached source.html artifact.
 */
export default function parse(element, { document }) {
  // Get all pricing plan cards from the list
  const cards = element.querySelectorAll('.c-plans__card');
  const cells = [];

  cards.forEach((card) => {
    // Cell 1: image (empty for pricing cards - no card images in this variant)
    // Cell 2: text (richtext) - all card content combined

    const textWrapper = document.createElement('div');
    textWrapper.appendChild(document.createComment(' field:text '));

    // Extract plan title (h3)
    const title = card.querySelector('.c-plans__card-title');
    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textWrapper.appendChild(h3);
    }

    // Extract badge if present (e.g., "Most popular", "Most comprehensive")
    const badge = card.querySelector('.c-plans__badge');
    if (badge) {
      const badgeP = document.createElement('p');
      const badgeEm = document.createElement('em');
      badgeEm.textContent = badge.textContent.trim();
      badgeP.appendChild(badgeEm);
      textWrapper.appendChild(badgeP);
    }

    // Extract description/lede
    const lede = card.querySelector('.c-plans__card-lede');
    if (lede) {
      const p = document.createElement('p');
      p.textContent = lede.textContent.trim();
      textWrapper.appendChild(p);
    }

    // Extract pricing information
    const priceContainer = card.querySelector('.c-plans__card-price');
    if (priceContainer) {
      const currency = priceContainer.querySelector('.c-plans__price-currency');
      const priceValues = priceContainer.querySelectorAll('.c-plans__price-value .dp__pp_effective');
      const unit = priceContainer.querySelector('.c-plans__price-unit');

      // Use the first price value (annual billing rate)
      if (priceValues.length > 0 && currency) {
        const priceP = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${currency.textContent.trim()}${priceValues[0].textContent.trim()}${unit ? unit.textContent.trim() : ''}`;
        priceP.appendChild(strong);
        textWrapper.appendChild(priceP);
      }
    }

    // Extract annual pricing note (e.g., "Pay $124.99 today")
    const annualPricing = card.querySelector('.c-plans__annual-pricing');
    if (annualPricing) {
      const annualP = document.createElement('p');
      annualP.textContent = annualPricing.textContent.trim();
      textWrapper.appendChild(annualP);
    }

    // Extract features list
    const features = card.querySelectorAll('.c-plans__features .c-plans__feature');
    if (features.length > 0) {
      const ul = document.createElement('ul');
      features.forEach((feature) => {
        const li = document.createElement('li');
        // Get the span text (excludes the check icon image alt)
        const featureSpan = feature.querySelector(':scope > span');
        if (featureSpan) {
          li.textContent = featureSpan.textContent.trim();
        }
        if (li.textContent) {
          ul.appendChild(li);
        }
      });
      if (ul.children.length > 0) {
        textWrapper.appendChild(ul);
      }
    }

    // Extract CTA link (first one is for annual billing)
    const ctaLinks = card.querySelectorAll('a.c-plans__cta');
    if (ctaLinks.length > 0) {
      const cta = ctaLinks[0];
      const link = document.createElement('a');
      link.href = cta.href;
      link.textContent = cta.textContent.trim();
      const ctaP = document.createElement('p');
      ctaP.appendChild(link);
      textWrapper.appendChild(ctaP);
    }

    // Extract pricing details note
    const pricingDetails = card.querySelector('.c-plans__pricing-details');
    if (pricingDetails) {
      const detailsP = document.createElement('p');
      const detailsEm = document.createElement('em');
      detailsEm.textContent = pricingDetails.textContent.trim();
      detailsP.appendChild(detailsEm);
      textWrapper.appendChild(detailsP);
    }

    // Each card is a row: [image (empty), text (richtext content)]
    cells.push(['', textWrapper]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pricing', cells });
  element.replaceWith(block);
}
