/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: LifeLock section breaks and section metadata.
 * Inserts <hr> between sections and creates Section Metadata blocks for styled sections.
 * Uses payload.template.sections from page-templates.json.
 * All selectors validated against migration-work/cleaned.html.
 *
 * Sections (from page-templates.json):
 *   1. section.c-hero (no style)
 *   2. section.c-claims (no style)
 *   3. section.c-features (no style)
 *   4. section.c-pdes (no style)
 *   5. section.c-plans (no style)
 *   6. section.c-quiz (no style)
 *   7. section.c-testimonialcarousel (style: dark)
 *   8. section.c-awardscarousel (style: grey)
 *   9. section.c-articlelist (no style)
 *  10. section.c-appbanner (style: dark)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const doc = element.ownerDocument;
    const sections = payload && payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Find section elements using multiple strategies
    const findSection = (selector) => {
      // selector format: "section.c-hero" -> primary class is "c-hero"
      const className = selector.replace(/^section\./, '');

      // Try exact selector, class-only, and attribute-contains
      return element.querySelector(selector)
        || element.querySelector(`.${className}`)
        || element.querySelector(`section[class*="${className}"]`)
        || element.querySelector(`[class*="${className}"]`);
    };

    // Process in reverse DOM order to avoid position shifts from insertions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = findSection(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block after the section if it has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (metaBlock) {
          sectionEl.after(metaBlock);
        }
      }

      // Insert <hr> before the section if it's not the first
      if (i > 0) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
