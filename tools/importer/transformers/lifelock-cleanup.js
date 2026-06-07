/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LifeLock site-wide cleanup.
 * Removes non-authorable content (header, footer, tracking, widgets, privacy dialogs).
 * All selectors validated against migration-work/cleaned.html DOM.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove quiz container moved outside main via JS (line 5 of cleaned.html)
    // Found: <div class="c-quiz__container"> at body top level
    WebImporter.DOMUtils.remove(element, [
      '.c-quiz__container',
      '.grecaptcha-badge',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome and global elements
    // Found: <header class="c-headermenu"> (line 561)
    // Found: <footer class="c-footer u-section"> (line 2280)
    // Found: <div class="dp__config"> (line 558)
    // Found: <dialog id="ensModalWrapper"> (line 2544) - privacy preference center
    // Found: <div id="ccaas-widget"> (line 2654) - chat widget
    // Found: <div id="ttdUniversalPixelTag..."> - tracking pixels
    // Found: <div id="batBeacon..."> - Bing tracking beacons
    // Found: <img id="podscribe-request"> - tracking pixel
    // Found: iframes for doubleclick, adsrvr, recaptcha, nlok-prod
    WebImporter.DOMUtils.remove(element, [
      'header.c-headermenu',
      'footer.c-footer',
      '.dp__config',
      '#ensModalWrapper',
      '#ccaas-widget',
      '[id^="ttdUniversalPixelTag"]',
      '[id^="batBeacon"]',
      '#podscribe-request',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove tracking images (pixels from twitter, bing, havasedge, podscribe)
    const trackingImgs = element.querySelectorAll('img[src*="bat.bing.com"], img[src*="analytics.twitter.com"], img[src*="t.co/"], img[src*="event.havasedge.com"], img[src*="verifi.podscribe.com"], img[src*="insight.adsrvr.org"]');
    trackingImgs.forEach((img) => img.remove());

    // Remove data-tracking attributes from all elements
    element.querySelectorAll('[data-track]').forEach((el) => el.removeAttribute('data-track'));
    element.querySelectorAll('[onclick]').forEach((el) => el.removeAttribute('onclick'));
  }
}
