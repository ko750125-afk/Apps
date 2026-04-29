const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/apps.ts', 'utf8');
// Simple regex to find objects and check for name/url
const matches = content.match(/\{[\s\S]*?\}/g);

matches.forEach((match, index) => {
    if (match.includes('id:') && !match.includes('export interface')) {
        const hasName = match.includes('name:');
        const hasUrl = match.includes('url:');
        const idMatch = match.match(/id:\s*['"](.*?)['"]/);
        const id = idMatch ? idMatch[1] : `index ${index}`;
        
        if (!hasName || !hasUrl) {
            console.log(`Error in app ${id}: Missing ${!hasName ? 'name' : ''} ${!hasUrl ? 'url' : ''}`);
            console.log(match);
        }
    }
});
console.log('Validation complete.');
