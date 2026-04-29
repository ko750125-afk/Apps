const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/apps.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace vercel screenshot with wordpress mshots
content = content.replace(/https:\/\/screenshot\.vercel\.app\/([a-zA-Z0-9\-\.]+)/g, (match, url) => {
  return `https://s0.wp.com/mshots/v1/${url}?w=800`;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated apps.ts with new image service.');
