/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-testimonial
 * Base block: carousel-testimonial (container block)
 * Source: https://lifelock.norton.com/
 * Selector: .reviews.c-reviews--with-border
 * Generated: 2026-06-06
 *
 * Live source structure:
 *   div.reviews.c-reviews--with-border
 *     > div.c-rev__card (repeating review cards)
 *       > div.c-rev__card-header
 *         > h5.c-rev__card-title (review title)
 *         > p.c-rev__product-name
 *         > img.c-rev__stars (star rating)
 *       > div.c-rev__member-details
 *         > p.c-rev__member-name (reviewer name)
 *         > p.c-rev__membership-length (date)
 *       > p.c-rev__card-quote (the testimonial quote)
 *       > p.c-rev__card-member-name (reviewer name repeated)
 *       > p.c-rev__member-since (date repeated)
 *
 * Cached source structure (original design):
 *   div.c-testimonialcarousel__carousel
 *     > li.c-testimonialcarousel__card (repeating slides)
 *       > div.c-testimonialcarousel__media > video > source[src]
 *       > div.c-testimonialcarousel__panel
 *         > p.c-testimonialcarousel__quote
 *         > strong.c-testimonialcarousel__name
 *         > span.c-testimonialcarousel__role
 *
 * Target structure (container block):
 *   Each row = one testimonial with 2 columns:
 *     Col 1 (media_image group): star rating image or video link
 *     Col 2 (content_text): quote + customer name + role as richtext
 *
 * UE Model fields per item:
 *   - media_image (reference) - Background Image
 *   - media_imageAlt (collapsed - skip hinting)
 *   - content_text (richtext) - Text content
 */
export default function parse(element, { document }) {
  // Handle both live DOM structure (.c-rev__card) and original structure (.c-testimonialcarousel__card)
  var cards = Array.from(element.querySelectorAll('.c-rev__card'));
  var isLiveFormat = cards.length > 0;

  if (!isLiveFormat) {
    // Fallback to original testimonial carousel structure
    cards = Array.from(element.querySelectorAll('.c-testimonialcarousel__card, li[class*="testimonial"]'));
    if (cards.length === 0) {
      cards = Array.from(element.querySelectorAll('li'));
    }
  }

  if (cards.length === 0) {
    var block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Deduplicate if needed (original format repeats for infinite scroll)
  var seen = new Set();
  var uniqueCards = [];
  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var key = '';
    if (isLiveFormat) {
      var quoteEl = card.querySelector('.c-rev__card-quote');
      key = quoteEl ? quoteEl.textContent.trim().substring(0, 50) : '';
    } else {
      var videoSource = card.querySelector('video source, source[src*=".mp4"]');
      key = videoSource ? videoSource.getAttribute('src') : '';
      if (!key) {
        var q = card.querySelector('.c-testimonialcarousel__quote, p[class*="quote"]');
        key = q ? q.textContent.trim() : '';
      }
    }
    if (key && !seen.has(key)) {
      seen.add(key);
      uniqueCards.push(card);
    } else if (!key) {
      uniqueCards.push(card);
    }
  }

  var cells = [];

  for (var j = 0; j < uniqueCards.length; j++) {
    var slideCard = uniqueCards[j];

    // Build media cell (Col 1)
    var mediaDiv = document.createElement('div');
    var mediaHint = document.createComment(' field:media_image ');
    mediaDiv.appendChild(mediaHint);

    // Build content cell (Col 2)
    var contentDiv = document.createElement('div');
    var contentHint = document.createComment(' field:content_text ');
    contentDiv.appendChild(contentHint);

    if (isLiveFormat) {
      // Live format: extract stars image as media, quote + name as content
      var starsImg = slideCard.querySelector('img.c-rev__stars, img[class*="stars"]');
      if (starsImg) {
        var imgClone = starsImg.cloneNode(true);
        mediaDiv.appendChild(imgClone);
      }

      var title = slideCard.querySelector('h5.c-rev__card-title, .c-rev__card-title');
      var quote = slideCard.querySelector('p.c-rev__card-quote, .c-rev__card-quote');
      var memberName = slideCard.querySelector('p.c-rev__member-name, .c-rev__member-name');
      var memberSince = slideCard.querySelector('p.c-rev__membership-length, .c-rev__membership-length');

      if (title) {
        var h = document.createElement('h3');
        h.textContent = title.textContent.trim();
        contentDiv.appendChild(h);
      }

      if (quote) {
        var p = document.createElement('p');
        p.textContent = quote.textContent.trim();
        contentDiv.appendChild(p);
      }

      if (memberName) {
        var nameP = document.createElement('p');
        var strong = document.createElement('strong');
        strong.textContent = memberName.textContent.trim();
        nameP.appendChild(strong);
        if (memberSince) {
          nameP.appendChild(document.createTextNode(' ' + memberSince.textContent.trim()));
        }
        contentDiv.appendChild(nameP);
      }
    } else {
      // Original format: extract video URL as media, quote + name + role as content
      var vidSource = slideCard.querySelector('video source, source[src*=".mp4"]');
      var videoSrc = vidSource ? (vidSource.getAttribute('src') || '') : '';

      if (videoSrc) {
        var videoLink = document.createElement('a');
        videoLink.setAttribute('href', videoSrc);
        videoLink.textContent = videoSrc;
        mediaDiv.appendChild(videoLink);
      }

      var quoteOrig = slideCard.querySelector('.c-testimonialcarousel__quote, p[class*="quote"]');
      var nameOrig = slideCard.querySelector('.c-testimonialcarousel__name, strong[class*="name"]');
      var roleOrig = slideCard.querySelector('.c-testimonialcarousel__role, span[class*="role"]');

      if (quoteOrig) {
        var pOrig = document.createElement('p');
        pOrig.textContent = quoteOrig.textContent.trim();
        contentDiv.appendChild(pOrig);
      }

      if (nameOrig || roleOrig) {
        var namePOrig = document.createElement('p');
        if (nameOrig) {
          var strongOrig = document.createElement('strong');
          strongOrig.textContent = nameOrig.textContent.trim();
          namePOrig.appendChild(strongOrig);
        }
        if (roleOrig) {
          if (nameOrig) namePOrig.appendChild(document.createTextNode(', '));
          var em = document.createElement('em');
          em.textContent = roleOrig.textContent.trim();
          namePOrig.appendChild(em);
        }
        contentDiv.appendChild(namePOrig);
      }
    }

    cells.push([mediaDiv, contentDiv]);
  }

  var block = WebImporter.Blocks.createBlock(document, { name: 'carousel-testimonial', cells });
  element.replaceWith(block);
}
