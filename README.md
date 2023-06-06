<p align="left">
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://aleen42.github.io/badges/src/eslint.svg"><img src="https://aleen42.github.io/badges/src/eslint.svg"></a>
</p>

A Native library for blocking screenshot for react-native developer, with background color screenshot customizable.

# Get started

## Installation

1. Install the dependency

```sh
$ npm install react-native-screenguard
```
```sh
$ yarn add react-native-screenguard
```

2. Linking:

- React-native 0.60 and higher: just `cd ios && pod install`, no additional requirements.

- React-native 0.59 and lower: Please do manual installation as follow

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`

2. Go to `node_modules` ➜ `react-native-screenguard` and add `ScreenGuard.xcodeproj`

3. In XCode, in the project navigator, select your project. Add `libScreenguard.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`


#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

  - Add `import com.screenguard.ScreenGuardPackage;` to the imports at the top of the file

  - Add `new ScreenGuardPackage()` to the list returned by the `getPackages()` method

2. Append the following lines to `android/settings.gradle`:

  	```
  	include ':react-native-screenguard'
  	project(':react-native-screenguard').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-screenguard/android')
  	```

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

  	```
      compile project(':react-native-screenguard')
  	```

For Expo user: First, you need to eject Expo or `npx expo prebuild` in order to use this library.

  	```
	  https://docs.expo.dev/workflow/prebuild/
	```

## Usage

(iOS + Android) Activate the screenguard

```js
import ScreenGuard from 'react-native-screenguard';

ScreenGuardModule.register(null, (_) => {
	.....do anything you want after the screenshot 
});

```
(iOS only) Activate the screenguard with your custom background color layout, received after taking the screenshot.

```js
import ScreenGuard from 'react-native-screenguard';

ScreenGuardModule.register(
	//insert any hex color you want here, default black if null or empty
	'#0F9D58',
	(_) => {
	.....do anything you want after the screenshot 
});
```

Deactivate the screenguard

```js
ScreenGuardModule.unregister();
```


## Limitation

This library support blocking view from being screenshoted for iOS 13+ only.

Background color for the layout received after screenshoted and event callback after screenshot supports for iOS only.


## Contributing
All contributions are welcome! Please open an issue if you get stuck and bugs, or a PR if you have any feature idea, improvements and bug fixing. I'm very appreciate ! 

## License
MIT



