/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-lifestyle.js
  function parse(element, { document }) {
    const firstSlide = element.querySelector(".c-slider__container:not(.glide__slide--clone)");
    const slideSource = firstSlide || element;
    const bgImage = slideSource.querySelector(".cmp-container__bg-img__picture, .cmp-container__bg-img__container img, picture img");
    const heading = slideSource.querySelector(".c-title h3, .c-title h2, .c-title h1, h3, h2, h1");
    const ctaLink = slideSource.querySelector(".c-btn__container a, .c-btn a, a.c-btn");
    const cells = [];
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(" field:image "));
    if (bgImage) {
      const picture = document.createElement("picture");
      const img = document.createElement("img");
      img.src = bgImage.src || bgImage.getAttribute("src") || "";
      img.alt = bgImage.alt || bgImage.getAttribute("alt") || "";
      picture.appendChild(img);
      imageCell.appendChild(picture);
    }
    cells.push([imageCell]);
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h1 = document.createElement("h1");
      h1.textContent = heading.textContent.trim();
      textCell.appendChild(h1);
    }
    if (ctaLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = ctaLink.href || ctaLink.getAttribute("href") || "";
      a.textContent = ctaLink.textContent.trim();
      const strong = document.createElement("strong");
      strong.appendChild(a);
      p.appendChild(strong);
      textCell.appendChild(p);
    }
    cells.push([textCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-lifestyle", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-stats.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll('li.c-claims__item, li[class*="claims__item"], li[class*="stat__item"]');
    const cells = [];
    items.forEach((item) => {
      const prefix = item.querySelector(".c-claims__affix--prefix");
      const number = item.querySelector(".c-claims__number");
      const suffix = item.querySelector(".c-claims__affix--suffix");
      let statValue = "";
      if (prefix) statValue += prefix.textContent.trim();
      if (number) statValue += number.textContent.trim();
      if (suffix) statValue += suffix.textContent.trim();
      const subTitle = item.querySelector(".c-claims__sub-title");
      const descText = item.querySelector(".c-claims__text");
      const textContent = [];
      const fieldHint = document.createComment(" field:text ");
      textContent.push(fieldHint);
      if (statValue) {
        const statHeading = document.createElement("h3");
        statHeading.textContent = statValue;
        textContent.push(statHeading);
      }
      if (subTitle) {
        const subTitleEl = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = subTitle.textContent.trim();
        subTitleEl.appendChild(strong);
        textContent.push(subTitleEl);
      }
      if (descText) {
        const descEl = document.createElement("p");
        descEl.textContent = descText.textContent.trim();
        textContent.push(descEl);
      }
      cells.push(["", textContent]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-feature.js
  function parse3(element, { document }) {
    const items = element.querySelectorAll("li.c-features__item");
    const mediaImage = element.querySelector('figure.c-features__media img[src]:not([src^="data:"])');
    const cells = [];
    items.forEach((item, index) => {
      const tagline = item.querySelector(".c-features__tagline");
      const titleFrag = document.createDocumentFragment();
      titleFrag.appendChild(document.createComment(" field:title "));
      if (tagline) {
        const titleText = document.createElement("p");
        titleText.textContent = tagline.textContent.trim();
        titleFrag.appendChild(titleText);
      }
      const contentFrag = document.createDocumentFragment();
      const heading = item.querySelector(".c-features__heading, h3, h2");
      contentFrag.appendChild(document.createComment(" field:content_heading "));
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        contentFrag.appendChild(h3);
      }
      if (mediaImage) {
        contentFrag.appendChild(document.createComment(" field:content_image "));
        const img = document.createElement("img");
        img.src = mediaImage.src;
        if (mediaImage.alt) img.alt = mediaImage.alt;
        contentFrag.appendChild(img);
      }
      const bodyText = item.querySelector(".c-features__item-body p, .c-features__item-body");
      contentFrag.appendChild(document.createComment(" field:content_richtext "));
      if (bodyText) {
        const p = document.createElement("p");
        p.textContent = bodyText.textContent.trim();
        contentFrag.appendChild(p);
      }
      cells.push([titleFrag, contentFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-scan.js
  function parse4(element, { document }) {
    const leftCol = element.querySelector('.c-pdes__email-col--left, [class*="email-col--left"]');
    const heading = leftCol ? leftCol.querySelector(".c-pdes__email-title, h2") : element.querySelector("h2");
    const description = leftCol ? leftCol.querySelector('.c-pdes__email-description, [class*="email-description"]') : null;
    const submitBtn = leftCol ? leftCol.querySelector('.c-pdes__email-submit, button[class*="email-submit"]') : null;
    const legalDiv = leftCol ? leftCol.querySelector('.c-pdes__email-legal, [class*="email-legal"]') : null;
    const optinLabel = leftCol ? leftCol.querySelector('.c-pdes__email-optin-label, [class*="email-optin-label"]') : null;
    const col1 = document.createElement("div");
    if (heading) {
      const h2 = document.createElement("h2");
      h2.textContent = heading.textContent.trim();
      col1.append(h2);
    }
    if (description) {
      const descP = document.createElement("p");
      descP.textContent = description.textContent.trim();
      col1.append(descP);
    }
    if (submitBtn) {
      const ctaLink = document.createElement("a");
      ctaLink.href = "#scan";
      ctaLink.textContent = submitBtn.textContent.trim() || "Submit";
      const ctaPara = document.createElement("p");
      ctaPara.append(ctaLink);
      col1.append(ctaPara);
    }
    if (legalDiv) {
      const legalP = document.createElement("p");
      legalP.innerHTML = legalDiv.innerHTML;
      col1.append(legalP);
    }
    if (optinLabel) {
      const optinP = document.createElement("p");
      optinP.textContent = optinLabel.textContent.trim();
      col1.append(optinP);
    }
    const rightCol = element.querySelector('.c-pdes__email-col--right, [class*="email-col--right"]');
    const col2 = document.createElement("div");
    if (rightCol) {
      const picture = rightCol.querySelector("picture");
      const img = rightCol.querySelector("img");
      if (picture) {
        col2.append(picture.cloneNode(true));
      } else if (img) {
        col2.append(img.cloneNode(true));
      }
    }
    const cells = [
      [col1, col2]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-scan", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pricing.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll(".c-plans__card");
    const cells = [];
    cards.forEach((card) => {
      const textWrapper = document.createElement("div");
      textWrapper.appendChild(document.createComment(" field:text "));
      const title = card.querySelector(".c-plans__card-title");
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textWrapper.appendChild(h3);
      }
      const badge = card.querySelector(".c-plans__badge");
      if (badge) {
        const badgeP = document.createElement("p");
        const badgeEm = document.createElement("em");
        badgeEm.textContent = badge.textContent.trim();
        badgeP.appendChild(badgeEm);
        textWrapper.appendChild(badgeP);
      }
      const lede = card.querySelector(".c-plans__card-lede");
      if (lede) {
        const p = document.createElement("p");
        p.textContent = lede.textContent.trim();
        textWrapper.appendChild(p);
      }
      const priceContainer = card.querySelector(".c-plans__card-price");
      if (priceContainer) {
        const currency = priceContainer.querySelector(".c-plans__price-currency");
        const priceValues = priceContainer.querySelectorAll(".c-plans__price-value .dp__pp_effective");
        const unit = priceContainer.querySelector(".c-plans__price-unit");
        if (priceValues.length > 0 && currency) {
          const priceP = document.createElement("p");
          const strong = document.createElement("strong");
          strong.textContent = `${currency.textContent.trim()}${priceValues[0].textContent.trim()}${unit ? unit.textContent.trim() : ""}`;
          priceP.appendChild(strong);
          textWrapper.appendChild(priceP);
        }
      }
      const annualPricing = card.querySelector(".c-plans__annual-pricing");
      if (annualPricing) {
        const annualP = document.createElement("p");
        annualP.textContent = annualPricing.textContent.trim();
        textWrapper.appendChild(annualP);
      }
      const features = card.querySelectorAll(".c-plans__features .c-plans__feature");
      if (features.length > 0) {
        const ul = document.createElement("ul");
        features.forEach((feature) => {
          const li = document.createElement("li");
          const featureSpan = feature.querySelector(":scope > span");
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
      const ctaLinks = card.querySelectorAll("a.c-plans__cta");
      if (ctaLinks.length > 0) {
        const cta = ctaLinks[0];
        const link = document.createElement("a");
        link.href = cta.href;
        link.textContent = cta.textContent.trim();
        const ctaP = document.createElement("p");
        ctaP.appendChild(link);
        textWrapper.appendChild(ctaP);
      }
      const pricingDetails = card.querySelector(".c-plans__pricing-details");
      if (pricingDetails) {
        const detailsP = document.createElement("p");
        const detailsEm = document.createElement("em");
        detailsEm.textContent = pricingDetails.textContent.trim();
        detailsP.appendChild(detailsEm);
        textWrapper.appendChild(detailsP);
      }
      cells.push(["", textWrapper]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pricing", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-quiz.js
  function parse6(element, { document }) {
    const quizEl = element.querySelector(".c-quiz");
    const leftCol = document.createElement("div");
    const rightCol = document.createElement("div");
    if (quizEl) {
      const questionScreens = quizEl.querySelectorAll(
        '.c-quiz__screen[data-screen="q1"], .c-quiz__screen[data-screen="q2"], .c-quiz__screen[data-screen="email"]'
      );
      questionScreens.forEach((screen) => {
        const heading = screen.querySelector(".c-quiz__heading, .c-quiz__legend, legend");
        if (heading) {
          const h3 = document.createElement("h3");
          h3.textContent = heading.textContent.trim();
          leftCol.appendChild(h3);
        }
        const answerItems = screen.querySelectorAll(".c-quiz__answergroup__item label");
        if (answerItems.length > 0) {
          const ul = document.createElement("ul");
          answerItems.forEach((label) => {
            const text = label.textContent.trim();
            if (text) {
              const li = document.createElement("li");
              li.textContent = text;
              ul.appendChild(li);
            }
          });
          if (ul.children.length > 0) {
            leftCol.appendChild(ul);
          }
        }
        const emailBtns = screen.querySelectorAll(".c-quiz__email__btn__yes, .c-quiz__email__btn__no");
        if (emailBtns.length > 0) {
          const ul = document.createElement("ul");
          emailBtns.forEach((btn) => {
            const li = document.createElement("li");
            li.textContent = btn.textContent.trim();
            ul.appendChild(li);
          });
          leftCol.appendChild(ul);
        }
      });
      const resultsScreen = quizEl.querySelector('.c-quiz__screen[data-screen="results"]');
      if (resultsScreen) {
        const preheading = resultsScreen.querySelector(".c-quiz__results__preheading");
        if (preheading) {
          const p = document.createElement("p");
          p.textContent = preheading.textContent.trim();
          rightCol.appendChild(p);
        }
        const productNames = resultsScreen.querySelectorAll(".c-quiz__results__product__name");
        const uniqueNames = [...new Set(Array.from(productNames).map((el) => el.textContent.trim()))];
        if (uniqueNames.length > 0) {
          const ul = document.createElement("ul");
          uniqueNames.forEach((name) => {
            const li = document.createElement("li");
            li.textContent = name;
            ul.appendChild(li);
          });
          rightCol.appendChild(ul);
        }
        const ctaLinks = resultsScreen.querySelectorAll("a.c-btn, a.c-quiz__results__cta, .c-quiz__results__product__cta a");
        if (ctaLinks.length > 0) {
          ctaLinks.forEach((cta) => {
            const a = document.createElement("a");
            a.href = cta.href || cta.getAttribute("href") || "#";
            a.textContent = cta.textContent.trim();
            rightCol.appendChild(a);
          });
        }
      }
    }
    if (leftCol.children.length === 0) {
      const fallbackHeading = element.querySelector("h2, h3, .c-quiz__heading");
      if (fallbackHeading) {
        const h3 = document.createElement("h3");
        h3.textContent = fallbackHeading.textContent.trim();
        leftCol.appendChild(h3);
      }
    }
    const cells = [
      [leftCol, rightCol]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-quiz", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-testimonial.js
  function parse7(element, { document }) {
    var cards = Array.from(element.querySelectorAll(".c-rev__card"));
    var isLiveFormat = cards.length > 0;
    if (!isLiveFormat) {
      cards = Array.from(element.querySelectorAll('.c-testimonialcarousel__card, li[class*="testimonial"]'));
      if (cards.length === 0) {
        cards = Array.from(element.querySelectorAll("li"));
      }
    }
    if (cards.length === 0) {
      var block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells: [] });
      element.replaceWith(block);
      return;
    }
    var seen = /* @__PURE__ */ new Set();
    var uniqueCards = [];
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var key = "";
      if (isLiveFormat) {
        var quoteEl = card.querySelector(".c-rev__card-quote");
        key = quoteEl ? quoteEl.textContent.trim().substring(0, 50) : "";
      } else {
        var videoSource = card.querySelector('video source, source[src*=".mp4"]');
        key = videoSource ? videoSource.getAttribute("src") : "";
        if (!key) {
          var q = card.querySelector('.c-testimonialcarousel__quote, p[class*="quote"]');
          key = q ? q.textContent.trim() : "";
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
      var mediaDiv = document.createElement("div");
      var mediaHint = document.createComment(" field:media_image ");
      mediaDiv.appendChild(mediaHint);
      var contentDiv = document.createElement("div");
      var contentHint = document.createComment(" field:content_text ");
      contentDiv.appendChild(contentHint);
      if (isLiveFormat) {
        var starsImg = slideCard.querySelector('img.c-rev__stars, img[class*="stars"]');
        if (starsImg) {
          var imgClone = starsImg.cloneNode(true);
          mediaDiv.appendChild(imgClone);
        }
        var title = slideCard.querySelector("h5.c-rev__card-title, .c-rev__card-title");
        var quote = slideCard.querySelector("p.c-rev__card-quote, .c-rev__card-quote");
        var memberName = slideCard.querySelector("p.c-rev__member-name, .c-rev__member-name");
        var memberSince = slideCard.querySelector("p.c-rev__membership-length, .c-rev__membership-length");
        if (title) {
          var h = document.createElement("h3");
          h.textContent = title.textContent.trim();
          contentDiv.appendChild(h);
        }
        if (quote) {
          var p = document.createElement("p");
          p.textContent = quote.textContent.trim();
          contentDiv.appendChild(p);
        }
        if (memberName) {
          var nameP = document.createElement("p");
          var strong = document.createElement("strong");
          strong.textContent = memberName.textContent.trim();
          nameP.appendChild(strong);
          if (memberSince) {
            nameP.appendChild(document.createTextNode(" " + memberSince.textContent.trim()));
          }
          contentDiv.appendChild(nameP);
        }
      } else {
        var vidSource = slideCard.querySelector('video source, source[src*=".mp4"]');
        var videoSrc = vidSource ? vidSource.getAttribute("src") || "" : "";
        if (videoSrc) {
          var videoLink = document.createElement("a");
          videoLink.setAttribute("href", videoSrc);
          videoLink.textContent = videoSrc;
          mediaDiv.appendChild(videoLink);
        }
        var quoteOrig = slideCard.querySelector('.c-testimonialcarousel__quote, p[class*="quote"]');
        var nameOrig = slideCard.querySelector('.c-testimonialcarousel__name, strong[class*="name"]');
        var roleOrig = slideCard.querySelector('.c-testimonialcarousel__role, span[class*="role"]');
        if (quoteOrig) {
          var pOrig = document.createElement("p");
          pOrig.textContent = quoteOrig.textContent.trim();
          contentDiv.appendChild(pOrig);
        }
        if (nameOrig || roleOrig) {
          var namePOrig = document.createElement("p");
          if (nameOrig) {
            var strongOrig = document.createElement("strong");
            strongOrig.textContent = nameOrig.textContent.trim();
            namePOrig.appendChild(strongOrig);
          }
          if (roleOrig) {
            if (nameOrig) namePOrig.appendChild(document.createTextNode(", "));
            var em = document.createElement("em");
            em.textContent = roleOrig.textContent.trim();
            namePOrig.appendChild(em);
          }
          contentDiv.appendChild(namePOrig);
        }
      }
      cells.push([mediaDiv, contentDiv]);
    }
    var block = WebImporter.Blocks.createBlock(document, { name: "carousel-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-awards.js
  function parse8(element, { document }) {
    const cells = [];
    function hintedCell(fieldName, elements) {
      const frag = document.createDocumentFragment();
      if (elements.length > 0) {
        frag.appendChild(document.createComment(` field:${fieldName} `));
        elements.forEach((el) => frag.appendChild(el));
      }
      return frag;
    }
    const trustpilotContainer = element.querySelector(".c-trustpilot__container");
    if (trustpilotContainer) {
      const logoImg = trustpilotContainer.querySelector(".c-trustpilot__logo-image, img");
      const scoreImg = trustpilotContainer.querySelector(".c-trustpilot__score-image");
      const reviewsText = trustpilotContainer.querySelector(".c-trustpilot__trust-score-reviews, p");
      const imageElements = [];
      if (logoImg) imageElements.push(logoImg);
      if (scoreImg) imageElements.push(scoreImg);
      const imageCell = hintedCell("media_image", imageElements);
      const contentElements = [];
      if (reviewsText) contentElements.push(reviewsText);
      const contentCell = hintedCell("content_text", contentElements);
      cells.push([imageCell, contentCell]);
    }
    const tiles = element.querySelectorAll(".c-socialproof__tile");
    tiles.forEach((tile) => {
      const img = tile.querySelector(".c-socialproof__tile__content__img img, img");
      const textDiv = tile.querySelector(".c-socialproof__tile__content__text div, .c-socialproof__tile__content__text");
      const imageElements = [];
      if (img) imageElements.push(img);
      const imageCell = hintedCell("media_image", imageElements);
      const contentElements = [];
      const captionText = textDiv ? textDiv.textContent.trim() : "";
      if (captionText && textDiv) contentElements.push(textDiv);
      const contentCell = hintedCell("content_text", contentElements);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-awards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse9(element, { document }) {
    const cardItems = element.querySelectorAll("li.c-articlelist__card");
    const cards = cardItems.length > 0 ? cardItems : element.querySelectorAll(".c-articlelist__grid > li, ul > li");
    if (!cards || cards.length === 0) return;
    const cells = [];
    cards.forEach((card) => {
      const picture = card.querySelector("picture.c-articlelist__picture, .c-articlelist__media picture, picture");
      const img = card.querySelector("img.c-articlelist__img, .c-articlelist__media img");
      const imageEl = picture || img;
      const imageCell = imageEl ? [imageEl] : [];
      const textCell = [];
      const cardLink = card.querySelector("a.c-articlelist__link, a[href]");
      const cardHref = cardLink ? cardLink.href || cardLink.getAttribute("href") : "";
      const tagline = card.querySelector("span.c-articlelist__tagline, .c-articlelist__tagline");
      if (tagline) {
        const p = document.createElement("p");
        p.textContent = tagline.textContent.trim();
        textCell.push(p);
      }
      const heading = card.querySelector("h3.c-articlelist__heading, .c-articlelist__body h3, h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textCell.push(h3);
      }
      const readTime = card.querySelector("span.c-articlelist__read, .c-articlelist__footer span");
      if (readTime) {
        const p = document.createElement("p");
        p.textContent = readTime.textContent.trim();
        textCell.push(p);
      }
      if (cardHref) {
        const a = document.createElement("a");
        a.href = cardHref;
        a.textContent = heading ? heading.textContent.trim() : "Read more";
        const p = document.createElement("p");
        p.append(a);
        textCell.push(p);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    if (cells.length > 0) {
      const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/columns-appbanner.js
  function parse10(element, { document }) {
    const allImages = element.querySelectorAll("img");
    let appImage = null;
    for (const img of allImages) {
      if (!img.closest(".c-appbanner__buttons") && !img.closest(".c-appbanner__store")) {
        appImage = img;
        break;
      }
    }
    const col2 = document.createElement("div");
    const badge = element.querySelector('.c-appbanner__badge, [class*="badge"]');
    if (badge) {
      const p = document.createElement("p");
      p.textContent = badge.textContent.trim();
      col2.appendChild(p);
    }
    const heading = element.querySelector('.c-appbanner__title, [class*="appbanner"] h2, h2, h1');
    if (heading) {
      const h = document.createElement("h2");
      h.textContent = heading.textContent.trim();
      col2.appendChild(h);
    }
    const description = element.querySelector('.c-appbanner__lede, [class*="appbanner"] p:not(.c-appbanner__badge)');
    if (description) {
      const p = document.createElement("p");
      p.textContent = description.textContent.trim();
      col2.appendChild(p);
    }
    const storeLinks = element.querySelectorAll(".c-appbanner__store, .c-appbanner__buttons a");
    storeLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.href || link.getAttribute("href");
      const storeImg = link.querySelector("img");
      if (storeImg) {
        const img = document.createElement("img");
        img.src = storeImg.src || storeImg.getAttribute("src");
        img.alt = storeImg.alt || storeImg.getAttribute("alt") || "";
        a.appendChild(img);
      } else {
        a.textContent = link.textContent.trim();
      }
      col2.appendChild(a);
    });
    const cells = [];
    if (appImage) {
      const imgEl = document.createElement("img");
      imgEl.src = appImage.src || appImage.getAttribute("src");
      imgEl.alt = appImage.alt || appImage.getAttribute("alt") || "";
      cells.push([imgEl, col2]);
    } else {
      cells.push([col2]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-appbanner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/lifelock-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".c-quiz__container",
        ".grecaptcha-badge"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.c-headermenu",
        "footer.c-footer",
        ".dp__config",
        "#ensModalWrapper",
        "#ccaas-widget",
        '[id^="ttdUniversalPixelTag"]',
        '[id^="batBeacon"]',
        "#podscribe-request",
        "iframe",
        "link",
        "noscript"
      ]);
      const trackingImgs = element.querySelectorAll('img[src*="bat.bing.com"], img[src*="analytics.twitter.com"], img[src*="t.co/"], img[src*="event.havasedge.com"], img[src*="verifi.podscribe.com"], img[src*="insight.adsrvr.org"]');
      trackingImgs.forEach((img) => img.remove());
      element.querySelectorAll("[data-track]").forEach((el) => el.removeAttribute("data-track"));
      element.querySelectorAll("[onclick]").forEach((el) => el.removeAttribute("onclick"));
    }
  }

  // tools/importer/transformers/lifelock-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const doc = element.ownerDocument;
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const findSection = (selector) => {
        const className = selector.replace(/^section\./, "");
        return element.querySelector(selector) || element.querySelector(`.${className}`) || element.querySelector(`section[class*="${className}"]`) || element.querySelector(`[class*="${className}"]`);
      };
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = findSection(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (metaBlock) {
            sectionEl.after(metaBlock);
          }
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-lifestyle": parse,
    "cards-stats": parse2,
    "tabs-feature": parse3,
    "columns-scan": parse4,
    "cards-pricing": parse5,
    "columns-quiz": parse6,
    "carousel-testimonial": parse7,
    "carousel-awards": parse8,
    "cards-article": parse9,
    "columns-appbanner": parse10
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "LifeLock Norton homepage with identity theft protection plans and features",
    urls: [
      "https://lifelock.norton.com/"
    ],
    blocks: [
      {
        name: "hero-lifestyle",
        instances: ["div.slider.carousel.panelcontainer.c-slider--controls-inside"]
      },
      {
        name: "cards-stats",
        instances: ["section.c-claims .c-claims__list"]
      },
      {
        name: "tabs-feature",
        instances: ["section.c-features .c-features__desktop"]
      },
      {
        name: "columns-scan",
        instances: [".c-pdes .c-pdes__email"]
      },
      {
        name: "cards-pricing",
        instances: ["section.c-plans .c-plans__pricing"]
      },
      {
        name: "columns-quiz",
        instances: [".c-quiz__container"]
      },
      {
        name: "carousel-testimonial",
        instances: [".reviews.c-reviews--with-border"]
      },
      {
        name: "carousel-awards",
        instances: ["section.c-socialproof"]
      },
      {
        name: "cards-article",
        instances: ["section.c-articlelist"]
      },
      {
        name: "columns-appbanner",
        instances: ["section.c-appbanner"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "section.c-hero",
        style: null,
        blocks: ["hero-lifestyle"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Claims/Stats",
        selector: "section.c-claims",
        style: null,
        blocks: ["cards-stats"],
        defaultContent: [".c-claims__title"]
      },
      {
        id: "section-3",
        name: "Features",
        selector: "section.c-features",
        style: null,
        blocks: ["tabs-feature"],
        defaultContent: [".c-features__intro"]
      },
      {
        id: "section-4",
        name: "Personal Data Exposure Scan",
        selector: "section.c-pdes",
        style: null,
        blocks: ["columns-scan"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Pricing Plans",
        selector: "section.c-plans",
        style: null,
        blocks: ["cards-pricing"],
        defaultContent: [".c-plans__intro"]
      },
      {
        id: "section-6",
        name: "Quiz",
        selector: "section.c-quiz",
        style: null,
        blocks: ["columns-quiz"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Testimonials",
        selector: "section.c-testimonialcarousel",
        style: "dark",
        blocks: ["carousel-testimonial"],
        defaultContent: [".c-testimonialcarousel__intro"]
      },
      {
        id: "section-8",
        name: "Awards/Trust",
        selector: "section.c-socialproof",
        style: "grey",
        blocks: ["carousel-awards"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Article List",
        selector: "section.c-articlelist",
        style: null,
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "App Banner",
        selector: "section.c-appbanner",
        style: "dark",
        blocks: ["columns-appbanner"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
