const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  { match: /(^|[\s"'`])text-7xl\b/g, replace: '$1text-4xl sm:text-5xl md:text-6xl lg:text-7xl' },
  { match: /(^|[\s"'`])text-6xl\b/g, replace: '$1text-4xl sm:text-5xl md:text-6xl' },
  { match: /(^|[\s"'`])text-5xl\b/g, replace: '$1text-3xl sm:text-4xl md:text-5xl' },
  { match: /(^|[\s"'`])text-4xl\b/g, replace: '$1text-2xl sm:text-3xl md:text-4xl' },
  { match: /(^|[\s"'`])text-3xl\b/g, replace: '$1text-xl sm:text-2xl md:text-3xl' },
  { match: /(^|[\s"'`])text-2xl\b/g, replace: '$1text-xl sm:text-2xl' },
  { match: /(^|[\s"'`])text-xl\b/g, replace: '$1text-lg sm:text-xl' },
  { match: /(^|[\s"'`])text-lg\b/g, replace: '$1text-base sm:text-lg' },
  { match: /(^|[\s"'`])text-base\b/g, replace: '$1text-sm sm:text-base' },
  { match: /(^|[\s"'`])text-sm\b/g, replace: '$1text-xs sm:text-sm' },
  { match: /(^|[\s"'`])text-xs\b/g, replace: '$1text-[10px] sm:text-xs' },
  { match: /(^|[\s"'`])text-\[11px\]/g, replace: '$1text-[10px] sm:text-[11px]' },
  { match: /(^|[\s"'`])text-\[10px\]/g, replace: '$1text-[9px] sm:text-[10px]' },
  { match: /(^|[\s"'`])text-\[9px\]/g, replace: '$1text-[8px] sm:text-[9px]' },
  { match: /(^|[\s"'`])text-\[8px\]/g, replace: '$1text-[7px] sm:text-[8px]' }
];

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const { match, replace } of replacements) {
        content = content.replace(match, replace);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

console.log("Starting typography scaling...");
processDirectory(dir);
console.log("Done.");
