/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroLifestyleParser from './parsers/hero-lifestyle.js';
import cardsStatsParser from './parsers/cards-stats.js';
import tabsFeatureParser from './parsers/tabs-feature.js';
import columnsScanParser from './parsers/columns-scan.js';
import cardsPricingParser from './parsers/cards-pricing.js';
import columnsQuizParser from './parsers/columns-quiz.js';
import carouselTestimonialParser from './parsers/carousel-testimonial.js';
import carouselAwardsParser from './parsers/carousel-awards.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsAppbannerParser from './parsers/columns-appbanner.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/lifelock-cleanup.js';
import sectionsTransformer from './transformers/lifelock-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-lifestyle': heroLifestyleParser,
  'cards-stats': cardsStatsParser,
  'tabs-feature': tabsFeatureParser,
  'columns-scan': columnsScanParser,
  'cards-pricing': cardsPricingParser,
  'columns-quiz': columnsQuizParser,
  'carousel-testimonial': carouselTestimonialParser,
  'carousel-awards': carouselAwardsParser,
  'cards-article': cardsArticleParser,
  'columns-appbanner': columnsAppbannerParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'LifeLock Norton homepage with identity theft protection plans and features',
  urls: [
    'https://lifelock.norton.com/'
  ],
  blocks: [
    {
      name: 'hero-lifestyle',
      instances: ['div.slider.carousel.panelcontainer.c-slider--controls-inside']
    },
    {
      name: 'cards-stats',
      instances: ['section.c-claims .c-claims__list']
    },
    {
      name: 'tabs-feature',
      instances: ['section.c-features .c-features__desktop']
    },
    {
      name: 'columns-scan',
      instances: ['.c-pdes .c-pdes__email']
    },
    {
      name: 'cards-pricing',
      instances: ['section.c-plans .c-plans__pricing']
    },
    {
      name: 'columns-quiz',
      instances: ['.c-quiz__container']
    },
    {
      name: 'carousel-testimonial',
      instances: ['.reviews.c-reviews--with-border']
    },
    {
      name: 'carousel-awards',
      instances: ['section.c-socialproof']
    },
    {
      name: 'cards-article',
      instances: ['section.c-articlelist']
    },
    {
      name: 'columns-appbanner',
      instances: ['section.c-appbanner']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'section.c-hero',
      style: null,
      blocks: ['hero-lifestyle'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Claims/Stats',
      selector: 'section.c-claims',
      style: null,
      blocks: ['cards-stats'],
      defaultContent: ['.c-claims__title']
    },
    {
      id: 'section-3',
      name: 'Features',
      selector: 'section.c-features',
      style: null,
      blocks: ['tabs-feature'],
      defaultContent: ['.c-features__intro']
    },
    {
      id: 'section-4',
      name: 'Personal Data Exposure Scan',
      selector: 'section.c-pdes',
      style: null,
      blocks: ['columns-scan'],
      defaultContent: []
    },
    {
      id: 'section-5',
      name: 'Pricing Plans',
      selector: 'section.c-plans',
      style: null,
      blocks: ['cards-pricing'],
      defaultContent: ['.c-plans__intro']
    },
    {
      id: 'section-6',
      name: 'Quiz',
      selector: 'section.c-quiz',
      style: null,
      blocks: ['columns-quiz'],
      defaultContent: []
    },
    {
      id: 'section-7',
      name: 'Testimonials',
      selector: 'section.c-testimonialcarousel',
      style: 'dark',
      blocks: ['carousel-testimonial'],
      defaultContent: ['.c-testimonialcarousel__intro']
    },
    {
      id: 'section-8',
      name: 'Awards/Trust',
      selector: 'section.c-socialproof',
      style: 'grey',
      blocks: ['carousel-awards'],
      defaultContent: []
    },
    {
      id: 'section-9',
      name: 'Article List',
      selector: 'section.c-articlelist',
      style: null,
      blocks: ['cards-article'],
      defaultContent: []
    },
    {
      id: 'section-10',
      name: 'App Banner',
      selector: 'section.c-appbanner',
      style: 'dark',
      blocks: ['columns-appbanner'],
      defaultContent: []
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
