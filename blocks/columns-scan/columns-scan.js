/* Block: columns-scan
 * Centered "Is your info exposed?" scan form on a warm gradient background.
 * Authored content (single cell): h2, lede p, "Your email" p (input label),
 * "Scan" p (button label), legal p, and "[x] Opt-in..." p (checkbox label).
 */
export default function decorate(block) {
  const cell = block.querySelector(':scope > div > div');
  if (!cell) return;

  const paragraphs = [...cell.querySelectorAll(':scope > p')];

  // Identify the email-label and Scan-button paragraphs
  const emailP = paragraphs.find((p) => /your email/i.test(p.textContent) && !p.querySelector('a[href^="http"]'));
  const scanP = paragraphs.find((p) => p.textContent.trim().toLowerCase() === 'scan');
  const optinP = paragraphs.find((p) => p.textContent.trim().startsWith('[x]') || /opt-in/i.test(p.textContent));

  // Build the pill-shaped input row: email field + inline Scan button
  if (emailP && scanP) {
    const form = document.createElement('form');
    form.className = 'columns-scan-form';
    form.addEventListener('submit', (e) => e.preventDefault());

    const input = document.createElement('input');
    input.type = 'email';
    input.className = 'columns-scan-input';
    input.placeholder = emailP.textContent.trim();
    input.setAttribute('aria-label', emailP.textContent.trim());

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'columns-scan-submit';
    button.textContent = scanP.textContent.trim();

    form.append(input, button);
    emailP.replaceWith(form);
    scanP.remove();
  }

  // Convert the opt-in paragraph into a real checkbox label
  if (optinP) {
    const labelText = optinP.textContent.replace(/^\s*\[x\]\s*/i, '').trim();
    const label = document.createElement('label');
    label.className = 'columns-scan-optin';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.className = 'columns-scan-optin-input';

    const span = document.createElement('span');
    span.className = 'columns-scan-optin-label';
    span.textContent = labelText;

    label.append(checkbox, span);
    optinP.replaceWith(label);
  }
}
