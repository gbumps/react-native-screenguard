<p align="left">
  <a href="https://github.com/prettier/prettier"><img src="https://img.shields.io/badge/styled_with-prettier-ff69b4.svg"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg"></a>
  <a href="https://aleen42.github.io/badges/src/eslint.svg"><img src="https://aleen42.github.io/badges/src/eslint.svg"></a>
</p>

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)

A Native library for blocking screenshot for react-native developer, with background color screenshot customizable.


https://github.com/gbumps/react-native-screenguard/assets/16846439/26d8ac37-9bc3-4d5b-8ad5-93525fb90a72


# Get started

<!--ts-->
  * [Installation](#installation)
    * [1.Install](#1-install)
      * [stable](#stable)
      * [beta](#beta)
    * [2.Linking](#2-linking)
  * [Usage](#usage)
     * [register](#1-register)
     * [registerWithoutScreenguard](#2-registerwithoutscreenguard)(Deprecated)
     * [registerScreenshotEventListener](#3-registerscreenshoteventlistener)(New ✨)
     * [registerScreenRecordingEventListener](#4-registerscreenrecordingeventlistener)(New ✨)
     * [registerWithBlurView](#5-registerwithblurview)(beta)
     * [registerWithImage](#6-registerwithimage)(beta)
     * [unregister](#7-unregister)
  * [Limitation](#limitation)
  * [Contributing](#contributing)
  * [License](#license)
<!--te-->

## Installation

  ## 1. Install

  #### Stable

- For protecting app from screenshot and screen recording captured, install stable version is enough.

```sh
$ npm install react-native-screenguard --save
```

```sh
$ yarn add react-native-screenguard
```
Source code on `master` branch.

  #### Beta

- If you want more customization over the screen protector filter like `registerWithBlurView` and `registerWithImage`, install this version.

```sh
$ npm install react-native-screenguard@beta --save

```

```sh
$ yarn add react-native-screenguard@beta
```

`Note`: Remember to `pod install` on ios and `gradle build` on Android again to take effect.

Source code on `beta` branch.


## 2. Linking

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
  	project(':react-native-screenguard').projectDir = new File(rootProject.projectDir,'../node_modules/react-native-screenguard/android')
  	```

    3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

  	```
      compile project(':react-native-screenguard')
  	```

For Expo user: First, you need to eject Expo or `npx expo prebuild` in order to use this library, check Expo docs below: 

	https://docs.expo.dev/workflow/prebuild/

## Usage

#### 1. register

- (iOS + Android) : Activate the screenguard with your custom background color layout. 

- Android will receive the background color when app in background or inactive state.

```js
import ScreenGuardModule from 'react-native-screenguard';

ScreenGuardModule.register(
	//insert any hex color you want here, default black if null or empty
	'#0F9D58',
	(_) => {
	.....do anything you want after the screenshot 
});
```

iOS

https://github.com/gbumps/react-native-screenguard/assets/16846439/fd4b3662-6e3b-4428-a927-23ee2068c22a 

Android

https://github.com/gbumps/react-native-screenguard/assets/16846439/da99c58c-fb79-4885-b496-ecb242bd4cf8


#### 2. registerWithoutScreenguard

- (iOS + Android) Activate without screenguard, if you just want to detect and receive event callback only.

- `Note:` This function is deprecated and will be removed from ver `4.0.0+`, consider using [registerScreenshotEventListener](#3-registerscreenshoteventlistenernew) or [registerScreenRecordingEventListener](#4-registerscreenrecordingeventlistenernew) instead.

```js
import ScreenGuardModule from 'react-native-screenguard';

ScreenGuardModule.registerWithoutScreenguard(
	(_) => {
	.....do anything you want after the screenshot 
});
```

#### 3. registerScreenshotEventListener

- (iOS + Android) Activate a screenshot detector and receive an event callback after a screenshot has been triggered successfully.


```js
import ScreenGuardModule from 'react-native-screenguard';

ScreenGuardModule.registerScreenshotEventListener(
	(_) => {
	.....do anything you want after the screenshot 
});
```

#### 4. registerScreenRecordingEventListener

- (iOS only) Activate a screen recording detector and receive an event callback after a record has done.


```js
import ScreenGuardModule from 'react-native-screenguard';

ScreenGuardModule.registerScreenRecordingEventListener(
	(_) => {
	.....do anything you want after the screen record
});
```

#### 5. registerWithBlurView

- Beta version only. See how to install [here](#beta)

- Activate screenguard with a blurred effect view after captured.

- Blurview on Android using [Blurry](https://github.com/wasabeef/Blurry).

- Accepted a JS object with following parameters:

  * `radius` <b>(required)</b>: blur radius value number in between `[15, 50]` (Explain below) , throws warning if smaller than 15 or bigger than 50, exception if smaller than 1 or not a number.

  * `timeAfterResume` <b>(Android only)</b>: A small amount of time (in milliseconds) for the blur view to disappear before jumping back to the main application view, default 1000ms


```js
import ScreenGuardModule from 'react-native-screenguard';

const data = {
 radius: 35,
 timeAfterResume: 2000,
};

//register with a blur radius of 35
ScreenGuardModule.registerWithBlurView(data, (_) => {
	.....do anything you want after the screenshot 
});
```

 `Explain`: Set blur radius smaller than 15 won't help much, as content still look very clear and easy to read. Same with bigger than 50 but content will be shrinked and vanished inside the view, blurring is meaningless. So, between 15 and 50 is enough.

iOS

https://github.com/gbumps/react-native-screenguard/assets/16846439/17429686-1bc4-4d5b-aa6c-82616ec8d1c5

#### 6. registerWithImage

- Beta version only. See how to install [here](#beta)

- Activate screenguard with a custom image view and background color. 

- ImageView using [SDWebImage](https://github.com/SDWebImage/SDWebImage) on iOS and [Glide](https://github.com/bumptech/glide) on Android for faster loading and caching.

- Accepted a JS object with following parameters:

  * `width`: width of the image

  * `height`: height of the image

  * `source` <b>(required)</b>: uri from network image or from local project `require`, accept all kinds of image (jpg|jpeg|png|gif|bmp|webp|svg), throws warning if uri is not an image uri;

  * `defaultSource`: default source if network image uri failed to load, from local project `require`, accept all kinds of image (jpg|jpeg|png|gif|bmp|webp|svg);

  * `backgroundColor`: background color behind the image, just like `register`.

  * `timeAfterResume` <b>(Android only)</b>: A small amount of time (in milliseconds) for the blur view to disappear before jumping back to the main view, default 1000ms

```js
import ScreenGuardModule from 'react-native-screenguard';

const data = {
  height: 150,
  width: 200,
  source: {
    uri: 'https://www.icegif.com/wp-content/uploads/2022/09/icegif-386.gif',
  },
  defaultSource: require('./images/test.png'),
  backgroundColor: color,
  alignment: 5 // Alignment.centerRight
},
//register with an image
ScreenGuardModule.registerWithImage(
  data,
	(_) => {
	.....do anything you want after the screenshot 
});
```

`Warning`: This feature is still in experimental on Android, so please use with caution as some unexpected behaviour might occurs.

iOS

https://github.com/gbumps/react-native-screenguard/assets/16846439/087dd9d5-b64f-4daf-a804-acc9a3cb4cc2

Android

https://github.com/gbumps/react-native-screenguard/assets/16846439/dd2d8191-555f-4f84-abf5-6cbcf67dc84b

#### 5. unregister

- (iOS + Android) Deactivate the screenguard.

```js
ScreenGuardModule.unregister();
```


## Limitation

- From `v0.3.6` and above, callbacks will not be activated on all register functions. You may have to activate it yourself by using [registerScreenshotEventListener](#3-registerscreenshoteventlistenernew) or [registerScreenRecordingEventListener](#4-registerscreenrecordingeventlistenernew) instead.

- This library support blocking screenshot for iOS 13+, Android 5+ only.

- The protection filter is already activated until you call `unregister`. So remember to call a function only <b>ONCE</b> for limitting errors and unexpected problems might happened during testing.

- Lib does not support combine feature together. (For example you want to use `registerWithBlurView` combine with `register` to have a blur view with color behind,.....)

- On Android, if you want to use callback, consider using `registerScreenShotEventListener` instead, as you may not receive any event after a screenshot has been triggered if using with `register`.


## Contributing
All contributions are welcome! Please open an issue if you get stuck and bugs, or a PR if you have any feature idea, improvements and bug fixing. I'm very appreciate ! 

## License
MIT



