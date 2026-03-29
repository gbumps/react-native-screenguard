'use strict';

const path = require('path');
const fs = require('fs');

function getRNVersion() {
  try {
    // From node_modules/react-native-screenguard/scripts, go up to node_modules/react-native/package.json
    const rnPackagePath = path.resolve(__dirname, '..', '..', 'react-native', 'package.json');
    const rnPackage = JSON.parse(fs.readFileSync(rnPackagePath, 'utf8'));
    return rnPackage.version;
  } catch (_) {
    return null;
  }
}

function parseMinor(version) {
  const match = version.match(/^0\.(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

const rnVersion = getRNVersion();
if (rnVersion) {
  const minor = parseMinor(rnVersion);
  if (minor !== null && minor < 68) {
    process.stderr.write(
      '\nWARNING: react-native-screenguard support better at RN version 0.68 and above, consider upgrading your current project\'s RN version\n\n'
    );
  }
}
