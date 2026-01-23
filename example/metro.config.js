const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const root = path.resolve(__dirname, '..');
const modules = [
  '@react-native-community/netinfo',
  'react-native',
  'react',
  'react-redux',
]; // list of modules that are present in both root and example node_modules

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
  ...defaultConfig,
  projectRoot: __dirname,
  watchFolders: [root],
  resolver: {
    ...defaultConfig.resolver,
    blacklistRE: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {}),
  },
};

function escape(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
