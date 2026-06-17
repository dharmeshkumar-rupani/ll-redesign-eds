# AEM Migration Toolchain — End-to-End Reference (with Access Links)

This artifact catalogs every skill, MCP server, and tool used across the LifeLock EDS migration, organized by the end-to-end journey ending in bundling and pushing a content package to AEM (Universal Editor / xwalk). Each entry includes where it is accessed or documented.

## End-to-End Journey (stage → skills/tools → access)

### Stage 1 — Source capture & design
- **Figma MCP server** (`excat-figma`): `get_metadata`, `get_screenshot`, `get_design_context`.
  - Access: invoked via the `excat-figma` plugin MCP in this environment. Figma Dev Mode MCP docs: `https://help.figma.com/hc/en-us/articles/32132100833559`
- **WebFetch tool**: scraped live source pages (`https://lifelock.norton.com/products/lifelock-total`).
  - Access: built-in Claude Code tool (no external URL).
- **Bash + curl**: downloaded source images into `content/dam/ll-eds`.
  - Access: built-in `Bash` tool.

### Stage 2 — Page & content analysis
- **Page-analysis / scrape skills** and **Authoring-analysis skill**.
  - Access: AEM EDS skill set; reference docs `https://www.aem.live/developer/markup-sections-blocks` and `https://www.aem.live/developer/anatomy-of-a-project`

### Stage 3 — Block development
- **Building-blocks / EDS-developer skills**: built `hero-product`, `cards-feature`, `accordion`, `cards-xsell`, `cards-review`, `columns-signup`.
  - Docs: `https://www.aem.live/developer/block-collection` · `https://www.aem.live/developer/universal-editor-blocks`
- **Block collection reference (xwalk)**: canonical container+item patterns.
  - Repo: `https://github.com/adobe-rnd/aem-block-collection-xwalk`
- **Boilerplate (xwalk)**: project base.
  - Repo: `https://github.com/adobe-rnd/aem-boilerplate-xwalk`
- **Tools**: `Write`, `Edit`, `Read`, `Glob`, `Grep` (built-in).

### Stage 4 — Content modeling (Universal Editor)
- **Content-modeling skill** + **excat-xwalk-expert skill**: `_<block>.json` models, field hinting, container `filter` + item `model`; diagnosed `md2jcr` errors.
  - Docs: `https://www.aem.live/developer/component-model-definitions` (incl. field-collapse & element-grouping) · `https://github.com/adobe-rnd/eslint-plugin-xwalk`
- **Bash**: `npm run build:json`, `npm run lint`.

### Stage 5 — Design fidelity & validation
- **Playwright MCP server** (`excat playwright`): `browser_navigate`, `browser_snapshot`, `browser_take_screenshot`, `browser_evaluate`, `browser_click`, `browser_resize`.
  - Local dev server: `http://localhost:3000` · Playwright MCP: `https://github.com/microsoft/playwright-mcp`
- **Block-critique / page-critique skills**: pixel/style comparison vs. source.
- **excat ops MCP tools** (deferred): `get_all_blocks_catalog`, `get_block_details`, `search_blocks`, `validate_page_template_schema`, `generate_document_path` — invoked via the `excat` plugin MCP.
- **validation MCP**: `match_elements`.

### Stage 6 — Bundle & push content package to AEM
- **Import-script / parsers / transformers skills**: bundled import script, per-block parsers, page transformers (`tools/importer/`).
- **content-import skill (`run-bulk-import.js`)**: generates `.plain.html` content.
- **excat-xwalk-expert skill**: HTML/markdown → JCR-compatible structure for upload/package.
- **AEM Author + Universal Editor**: authoring & publish.
  - Author: `https://author-p149556-e1749225.adobeaemcloud.com`
  - UE canvas: `https://author-p149556-e1749225.adobeaemcloud.com/ui#/@symantec/aem/universal-editor/canvas/...`
  - Sites console (package creation): `https://author-p149556-e1749225.adobeaemcloud.com/ui#/aem/sites.html/content/ll-eds-new`
  - franklin.delivery servlet: `https://author-p149556-e1749225.adobeaemcloud.com/bin/franklin.delivery/dharmeshkumar-rupani/<site>/main`
- **Admin API** (`admin.hlx.page`): config / preview / live / status.
  - Docs: `https://www.aem.live/docs/admin.html` · Status: `https://admin.hlx.page/status/dharmeshkumar-rupani/<site>/main`
- **AEM Code Sync GitHub App**: code → delivery sync.
  - Install/config: `https://github.com/apps/aem-code-sync`
- **GitHub repo** (code source): `https://github.com/dharmeshkumar-rupani/ll-redesign-eds`
- **Delivery hosts**:
  - Preview: `https://main--ll-eds-new--dharmeshkumar-rupani.aem.page/`
  - Live: `https://main--ll-eds-new--dharmeshkumar-rupani.aem.live/`

## Open Issues Affecting Package Push

- [ ] **Delivery-host vs repo-name mismatch** — component-models serve from `main--ll-eds-new--…aem.page` (200) while `main--ll-redesign-eds--…aem.page` returns 404; cloud-config `repo`, GitHub repo (`ll-redesign-eds`), and EDS site (`ll-eds-new`) are misaligned.
- [ ] **Publish not reaching expected host** — UE shows "Publication Pending / Not previewed"; `aem.page` root 404s.

## Checklist

- [ ] Confirm desired output: (a) this annotated tool/skill inventory with links — done above, or (b) a step-by-step runbook to bundle + push the package
- [ ] Decide canonical EDS site name (`ll-eds-new` vs `ll-redesign-eds`) so delivery + component-models resolve to one host
- [ ] Align cloud-config `repo` property with the host serving `component-models.json`
- [ ] Confirm AEM Code Sync (`https://github.com/apps/aem-code-sync`) points the EDS site at the `ll-redesign-eds` GitHub repo
- [ ] Create/install the content package for `index` + `lifelock-total` via the AEM Sites console
- [ ] Preview + publish from Universal Editor; verify the correct `aem.page`/`aem.live` URL returns 200 and renders styled (not the UE canvas view)

> Informational artifact — no steps run in Plan mode. Switch to Execute mode to perform any config, package, or publish actions. Note: external URLs are provided for reference; verify project-specific hosts/IDs before acting.
