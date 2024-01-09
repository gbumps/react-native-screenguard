package com.screenguard;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Objects;

@ReactModule(name = ScreenGuardModule.NAME)
public class ScreenGuardModule extends ReactContextBaseJavaModule {

    public static final String NAME = "ScreenGuard";
    private static Handler mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());

    private ReactApplicationContext currentReactContext;
    private ScreenGuard mScreenGuard;

    public ScreenGuardModule(ReactApplicationContext reactContext) {
      super(reactContext);
      currentReactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
      return NAME;
    }

    @ReactMethod
    public void listenEvent() {
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuard(
                    currentReactContext,
                    (url) -> currentReactContext.getJSModule(
                            DeviceEventManagerModule.RCTDeviceEventEmitter.class
                    ).emit("onSnapper", url)
            );
        }
        mScreenGuard.register();
    }

    @ReactMethod
    public void removeEvent() {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Keep: Required for RN built in Event Emitter Calls.
    }

    @ReactMethod
    public void activateShield(String hexColor) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (
                getReactApplicationContext().getCurrentActivity() != null
            ) {
                mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    getReactApplicationContext().getCurrentActivity()
                ).getWindow().setFlags(
                        WindowManager.LayoutParams.FLAG_SECURE, 
                        WindowManager.LayoutParams.FLAG_SECURE
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void activateWithoutShield() {
        try {
            deactivateShield();
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void activateShield(String hexColor) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();
            if (currentActivity != null) {
                mHandlerBlockScreenShot.post(() ->
                                currentActivity.getWindow().setFlags(
                        WindowManager.LayoutParams.FLAG_SECURE, 
                        WindowManager.LayoutParams.FLAG_SECURE
                ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void deactivateShield() {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();
                if (currentActivity != null) {
                   mHandlerBlockScreenShot.post(() ->
                           currentActivity
                     .getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
                    mHandlerBlockScreenShot = null;
                } else {
                    Log.w("ACTIVITY_SCREENSHOT", "handler is null");
                }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
