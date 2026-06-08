export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'columns-signup-content';

  rows.forEach((row) => {
    const cols = [...row.children];
    cols.forEach((col) => {
      wrapper.append(...col.childNodes);
    });
  });

  // Find and style the form elements
  const inputs = wrapper.querySelectorAll('input, form');
  if (inputs.length === 0) {
    // Build a simple email signup form from text content
    const paragraphs = wrapper.querySelectorAll('p');
    paragraphs.forEach((p) => {
      const text = p.textContent.toLowerCase();
      if (text.includes('email') || text.includes('sign up')) {
        p.className = 'columns-signup-subtitle';
      }
    });
  }

  // Style links as buttons
  const links = wrapper.querySelectorAll('a');
  links.forEach((link) => {
    link.className = 'columns-signup-btn';
  });

  block.textContent = '';
  block.append(wrapper);
}
