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
     * [registerWithoutScreenguard](#2-registerwithoutscreenguard)
     * [registerWithBlurView (beta)](#3-registerwithblurview)
     * [registerWithImage (beta)](#4-registerwithimage)
     * [unregister](#5-unregister)
  * [Limitation](#limitation)
  * [Contributing](#contributing)
  * [License](#license)
<!--te-->

## Installation

  ## 1. Install

  #### Stable

- For protecting from being screenshoted and screen recording captured only, stable version is enough.

```sh
$ npm install react-native-screenguard --save
```

```sh
$ yarn add react-native-screenguard
```

  #### Beta

- If you want more customization over the screen protector filter like `registerWithBlurView` and `registerWithImage`, install this version.

```sh
$ npm install react-native-screenguard@beta --save

```

```sh
$ yarn add react-native-screenguard@beta
```

`Note`: Remember to `pod install` on ios and `gradle build` on Android again to take effect.


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

`Note`: All features below contain a `callback` method after a screenshot or screen recording has been taken.

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

```js
import ScreenGuardModule from 'react-native-screenguard';

ScreenGuardModule.registerWithoutScreenguard(
	(_) => {
	.....do anything you want after the screenshot 
});
```

#### 3. registerWithBlurView

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


https://github.com/gbumps/react-native-screenguard/assets/16846439/17429686-1bc4-4d5b-aa6c-82616ec8d1c5

#### 4. registerWithImage

- Beta version only. See how to install [here](#beta)

- Activate screenguard with a custom image view and background color. 

- ImageView using [SDWebImage](https://github.com/SDWebImage/SDWebImage) on iOS and [Glide](https://github.com/bumptech/glide) on Android for faster loading and caching.

- Accepted a JS object with following parameters:

  * `width`: width of the image

  * `height`: height of the image

  * `uri` <b>(required)</b>: uri of the image, accept all kinds of image (jpg|jpeg|png|gif|bmp|webp|svg), throws warning if uri is not an image uri;

  * `backgroundColor`: background color behind the image, just like `register`.

  * `timeAfterResume` <b>(Android only)</b>: A small amount of time (in milliseconds) for the blur view to disappear before jumping back to the main view, default 1000ms

```js
import ScreenGuardModule from 'react-native-screenguard';

const data = {
  height: 150,
  width: 200,
  uri: 'https://www.icegif.com/wp-content/uploads/2022/09/icegif-386.gif',
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

#### 5. unregister

- (iOS + Android) Deactivate the screenguard.

```js
ScreenGuardModule.unregister();
```


## Limitation

- This library support blocking screenshot for iOS 13+, Android 5+ only.

- The protection filter is already activated until you call `unregister`. So remember to call a function only <b>ONCE</b> for limitting errors and unexpected problems might happened during testing.

- Lib does not support combine feature together yet. (For example you want to use `registerWithBlurView` combine with `register` to have a blur view with color behind,.....)

- On Android, if you want to use callback, consider using `registerWithoutScreenguard` instead, as you may not receive any event after a screenshot has been triggered if using with `register`.


## Contributing
All contributions are welcome! Please open an issue if you get stuck and bugs, or a PR if you have any feature idea, improvements and bug fixing. I'm very appreciate ! 

## License
MIT



