import {
    ConfigPlugin,
    createRunOncePlugin,
} from '@expo/config-plugins';

const pkg = require('../../package.json');

const withScreenGuard: ConfigPlugin = (config) => {
    return config;
};

export default createRunOncePlugin(withScreenGuard, pkg.name, pkg.version);
