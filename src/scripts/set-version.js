const fs = require('fs');
const pkg = require('../package.json');
const versionFile = './src/version.ts';

fs.writeFileSync(
  versionFile,
  `export const version = '${pkg.version}';\n`
);