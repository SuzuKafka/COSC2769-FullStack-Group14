// RMIT University Vietnam
// Course: COSC2769 - Full Stack Development
// Semester: 2025B
// Assessment: Assignment 02
// Author: Ryota Suzuki
// ID: s4075375

#!/usr/bin/env node
/*
 * Adds the RMIT header block and an optional description comment to the top of JS/JSX files
 * if it is not already present.
 */
const fs = require('fs');
const path = require('path');

const HEADER = `// RMIT University Vietnam\n// Course: COSC2769 - Full Stack Development\n// Semester: 2025B\n// Assessment: Assignment 02\n// Author: Ryota Suzuki\n// ID: s4075375\n\n`;

const TARGET_DIRS = [
  path.join(__dirname, '..'),
  path.join(__dirname, '..', 'routes'),
  path.join(__dirname, '..', 'models'),
  path.join(__dirname, '..', '..', 'client', 'src'),
];

const EXCLUDE_DIRS = new Set(['node_modules']);

const shouldProcess = (filePath) => filePath.endsWith('.js') || filePath.endsWith('.jsx');

const hasHeader = (content) => content.startsWith('// RMIT University Vietnam');

const processFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (hasHeader(content)) {
    return;
  }

  fs.writeFileSync(filePath, HEADER + content, 'utf8');
  console.log(`Header added: ${filePath}`);
};

const walk = (dir) => {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    if (EXCLUDE_DIRS.has(entry.name)) {
      return;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      return;
    }

    if (shouldProcess(fullPath)) {
      processFile(fullPath);
    }
  });
};

TARGET_DIRS.forEach((dir) => {
  if (fs.existsSync(dir)) {
    walk(dir);
  }
});

console.log('Header insertion completed.');
