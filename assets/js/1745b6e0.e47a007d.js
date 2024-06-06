"use strict";(self.webpackChunkreact_native_screenguard_docs=self.webpackChunkreact_native_screenguard_docs||[]).push([[625],{9374:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>d,metadata:()=>s,toc:()=>c});var r=i(4848),t=i(8453);const d={sidebar_position:3},o="Linking",s={id:"getting-started/linking",title:"Linking",description:"RN v0.60+",source:"@site/docs/getting-started/linking.md",sourceDirName:"getting-started",slug:"/getting-started/linking",permalink:"/react-native-screenguard/docs/getting-started/linking",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Installation",permalink:"/react-native-screenguard/docs/getting-started/install"},next:{title:"register",permalink:"/react-native-screenguard/docs/usages-and-apis/register"}},a={},c=[{value:"RN v0.60+",id:"rn-v060",level:2},{value:"iOS",id:"ios",level:4},{value:"RN v0.59",id:"rn-v059",level:2},{value:"iOS",id:"ios-1",level:4},{value:"Android",id:"android",level:4},{value:"Post installation for Android",id:"post-installation-for-android",level:2}];function l(e){const n={a:"a",code:"code",h1:"h1",h2:"h2",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"linking",children:"Linking"}),"\n",(0,r.jsx)(n.h2,{id:"rn-v060",children:"RN v0.60+"}),"\n",(0,r.jsxs)(n.p,{children:["From React native v0.60 and above, linking is automatic. So you don't need to run ",(0,r.jsx)(n.code,{children:"react-native link"})," anymore. Refer ",(0,r.jsx)(n.a,{href:"https://github.com/react-native-community/cli/blob/main/docs/autolinking.md",children:"here"}),"."]}),"\n",(0,r.jsx)(n.h4,{id:"ios",children:"iOS"}),"\n",(0,r.jsx)(n.p,{children:"After the the automatic scripts completed successfully, run pod install and you're good to go:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"pod install\n"})}),"\n",(0,r.jsx)(n.h2,{id:"rn-v059",children:"RN v0.59"}),"\n",(0,r.jsx)(n.p,{children:"React-native 0.59 and lower: Please do manual installation as follow"}),"\n",(0,r.jsx)(n.h4,{id:"ios-1",children:"iOS"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["In XCode, in the project navigator, right click ",(0,r.jsx)(n.code,{children:"Libraries"})," \u279c ",(0,r.jsx)(n.code,{children:"Add Files to [your project's name]"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Go to ",(0,r.jsx)(n.code,{children:"node_modules"})," \u279c ",(0,r.jsx)(n.code,{children:"react-native-screenguard"})," and add ",(0,r.jsx)(n.code,{children:"ScreenGuard.xcodeproj"})]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["In XCode, in the project navigator, select your project. Add ",(0,r.jsx)(n.code,{children:"libScreenguard.a"})," to your project's ",(0,r.jsx)(n.code,{children:"Build Phases"})," \u279c ",(0,r.jsx)(n.code,{children:"Link Binary With Libraries"})]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.h4,{id:"android",children:"Android"}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Open up ",(0,r.jsx)(n.code,{children:"android/app/src/main/java/[...]/MainActivity.java"})]}),"\n"]}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Add ",(0,r.jsx)(n.code,{children:"import com.screenguard.ScreenGuardPackage;"})," to the imports at the top of the file"]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:["Add ",(0,r.jsx)(n.code,{children:"new ScreenGuardPackage()"})," to the list returned by the ",(0,r.jsx)(n.code,{children:"getPackages()"})," method"]}),"\n"]}),"\n"]}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsxs)(n.li,{children:["Append the following lines to ",(0,r.jsx)(n.code,{children:"android/settings.gradle"}),":"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"include ':react-native-screenguard'\nproject(':react-native-screenguard').projectDir = new File(rootProject.projectDir,'../node_modules/react-native-screenguard/android')\n"})}),"\n",(0,r.jsxs)(n.ol,{start:"3",children:["\n",(0,r.jsxs)(n.li,{children:["Insert the following lines inside the dependencies block in ",(0,r.jsx)(n.code,{children:"android/app/build.gradle"}),":"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{children:"  compile project(':react-native-screenguard')\n"})}),"\n",(0,r.jsx)(n.h2,{id:"post-installation-for-android",children:"Post installation for Android"}),"\n",(0,r.jsx)(n.p,{children:"On Android, remember to setup a little bit as you will not receive the background color or the blur effect like in the video example."}),"\n",(0,r.jsxs)(n.ol,{children:["\n",(0,r.jsxs)(n.li,{children:["Open up ",(0,r.jsx)(n.code,{children:"[your_project_path]/android/app/src/main/AndroidManifest.xml"})," and add activity ",(0,r.jsx)(n.code,{children:"com.screenguard.ScreenGuardColorActivity"})," like below"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-xml",children:'<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n    <application ......>\n      \t<activity\n      \t  android:name=".MainActivity" .........>\n      \t  ..........\n      \t</activity>\n\n+       <activity android:name="com.screenguard.ScreenGuardColorActivity"\n+            android:theme="@style/Theme.AppCompat.Translucent"\n+            android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"\n+            android:windowSoftInputMode="stateAlwaysVisible|adjustResize"\n+            android:exported="false"\n+        />\n    </application>\n</manifest>\n'})}),"\n",(0,r.jsxs)(n.ol,{start:"2",children:["\n",(0,r.jsxs)(n.li,{children:["Open up ",(0,r.jsx)(n.code,{children:"[your_project_path]/android/app/src/main/res/values/styles.xml"})," and add style ",(0,r.jsx)(n.code,{children:"Theme.AppCompat.Translucent"})," like below"]}),"\n"]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-xml",children:'<resource>\n\n<style name="AppTheme">your current app style theme.............</style>\n\n+ <style name="Theme.AppCompat.Translucent">\n+        <item name="android:windowNoTitle">true</item>\n+        <item name="android:windowBackground">@android:color/transparent</item>\n+        <item name="android:colorBackgroundCacheHint">@null</item>\n+        <item name="android:windowIsTranslucent">true</item>\n+        <item name="android:windowAnimationStyle">@null</item>\n+        <item name="android:windowSoftInputMode">adjustResize</item>\n+ </style>\n</resource>\n'})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>s});var r=i(6540);const t={},d=r.createContext(t);function o(e){const n=r.useContext(d);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),r.createElement(d.Provider,{value:n},e.children)}}}]);