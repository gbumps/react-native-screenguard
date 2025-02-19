import {
  AndroidConfig,
  ConfigPlugin,
  createRunOncePlugin,
  ExportedConfig,
  withAndroidManifest,
  withAndroidStyles,
} from '@expo/config-plugins';

const pkg = require('../../../package.json');

/**
 * Add an ScreenGuard activity to the AndroidManifest.xml
 * @param config
 */
function addActivityToManifest(config: ExportedConfig) {
  return withAndroidManifest(config, async (newConfig) => {
    const mainApplicationActivities =
      newConfig.modResults.manifest.application?.[0]?.activity;
    const hasScreenGuardActivity = mainApplicationActivities?.some(
      (activity) =>
        activity.$['android:name'] ===
        'com.screenguard.ScreenGuardColorActivity'
    );
    if (hasScreenGuardActivity) {
      return newConfig;
    }
    if (mainApplicationActivities) {
      mainApplicationActivities.push({
        $: {
          'android:name': 'com.screenguard.ScreenGuardColorActivity',
          'android:theme': '@style/Theme.AppCompat.Translucent',
          'android:configChanges':
            'keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode',
          'android:windowSoftInputMode': 'stateAlwaysVisible|adjustResize',
          'android:exported': 'false',
        },
      });
    }
    return newConfig;
  });
}

/**
 * Add ScreenGuard theme to styles.xml
 * @param config
 */
function addScreenGuardThemeToStylesXml(config: ExportedConfig) {
  return withAndroidStyles(config, async (newConfig) => {
    const styles = newConfig.modResults.resources.style || [];
    const hasScreenGuardTheme = styles?.some(
      (style) => style.$.name === 'Theme.AppCompat.Translucent'
    );
    if (hasScreenGuardTheme) {
      return newConfig;
    }
    const newStyle: AndroidConfig.Resources.ResourceGroupXML = {
      // @ts-ignore: We don't need any parend here
      $: {
        name: 'Theme.AppCompat.Translucent',
      },
      item: [
        {
          $: {
            name: 'android:windowNoTitle',
          },
          _: 'true',
        },
        {
          $: {
            name: 'android:windowBackground',
          },
          _: '@android:color/transparent',
        },
        {
          $: {
            name: 'android:colorBackgroundCacheHint',
          },
          _: '@null',
        },
        {
          $: {
            name: 'android:windowIsTranslucent',
          },
          _: 'true',
        },
        {
          $: {
            name: 'android:windowAnimationStyle',
          },
          _: '@null',
        },
        {
          $: {
            name: 'android:windowSoftInputMode',
          },
          _: 'adjustResize',
        },
      ],
    };
    styles.push(newStyle);
    return newConfig;
  });
}

const withScreenGuardAndroid: ConfigPlugin = (config) => {
  config = addActivityToManifest(config);
  config = addScreenGuardThemeToStylesXml(config);
  return config;
};

export default createRunOncePlugin(
  withScreenGuardAndroid,
  pkg.name,
  pkg.version
);
