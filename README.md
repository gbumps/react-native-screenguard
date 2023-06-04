<p align="left">
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://aleen42.github.io/badges/src/eslint.svg"><img src="https://aleen42.github.io/badges/src/eslint.svg"></a>
</p>

<img src="https://media.giphy.com/media/4vMWOXJFB8Jks2K3Fl/giphy.gif" />

A Native library for blocking screenshot for react-native developer

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

- React-native 0.60 and higher: just pod install and you are good to go!

- React-native 0.59 and lower:




## Usage

Activate the screenguard

```js
import ScreenGuard from 'react-native-screenguard';

ScreenGuardModule.register(null, (_) => {
	.....do anything you want after the screenshot 
});
```

Activate the screenguard with your custom background color layout, received after taking the screenshot.

```js
import ScreenGuard from 'react-native-screenguard';

ScreenGuardModule.register(
	//insert any hex color you want here, default is black if not
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



