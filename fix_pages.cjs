const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Remove hardcoded backgrounds from min-h-screen wrappers
  content = content.replace(/className="(.*?)bg-slate-50(?:\/50)?(.*?)"/g, 'className="$1$2"');
  content = content.replace(/className="(.*?)bg-white(.*?)"/g, 'className="$1$2"');
  content = content.replace(/className="(.*?)bg-\[#020617\](.*?)"/g, 'className="$1$2"');
  content = content.replace(/className="(.*?)bg-\[#FDF5EC\](.*?)"/g, 'className="$1$2"');
  content = content.replace(/className="(.*?)bg-gradient-to-br from-slate-50 via-white to-emerald-50\/30(.*?)"/g, 'className="$1$2"');

  // Clean up any double spaces created by the replacements
  content = content.replace(/className="(.*?)\s{2,}(.*?)"/g, 'className="$1 $2"');
  content = content.replace(/className="\s+(.*?)"/g, 'className="$1"');

  if (file === 'About.jsx') {
    // Remove sections
    // Learning Categories
    content = content.replace(/\{\s*\/\*\s*Learning Categories\s*\*\/\s*\}[^]*?(?=\{\s*\/\*\s*Why Edu Alt Tech\s*\*\/\s*\})/s, '');
    // Why Edu Alt Tech
    content = content.replace(/\{\s*\/\*\s*Why Edu Alt Tech\s*\*\/\s*\}[^]*?(?=\{\s*\/\*\s*How It Works\s*\*\/\s*\})/s, '');
    // How It Works
    content = content.replace(/\{\s*\/\*\s*How It Works\s*\*\/\s*\}[^]*?(?=\{\s*\/\*\s*Team\s*\*\/\s*\})/s, '');
    // CTA
    content = content.replace(/\{\s*\/\*\s*CTA\s*\*\/\s*\}[^]*?(?=\s*<\/div>\s*<\/div>\s*;\s*\})/s, '');
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Pages updated successfully!');
