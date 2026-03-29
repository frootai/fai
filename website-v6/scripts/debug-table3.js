const fs = require('fs');
let raw = fs.readFileSync('docs/RAG-Architecture.md', 'utf-8');
let content = raw.replace(/\r\n/g, '\n');
content = content.replace(/^---[\s\S]*?---\n*/m, '');

// Apply the admonition regex
content = content.replace(
  /^:::(\w+)\s*(.*)\n([\s\S]*?)\n^:::\s*$/gm,
  (_match, type, title, body) => {
    const titleText = (title || '').trim();
    const prefix = `> **[${type.toUpperCase()}]${titleText ? ` ${titleText}` : ''}**\n`;
    const bodyLines = body.trim().split('\n').map(l => `> ${l}`).join('\n');
    return `${prefix}>\n${bodyLines}`;
  }
);

// Find the Decision Matrix section
const idx = content.indexOf('Decision Matrix');
if (idx >= 0) {
  const section = content.substring(idx, idx + 1500);
  console.log('=== Decision Matrix section (first 1500 chars) ===');
  console.log(section);
} else {
  console.log('Decision Matrix NOT FOUND');
}
