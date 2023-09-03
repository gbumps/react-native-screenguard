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
    public void activateShield(String hexColor) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()
            ).getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE, 
                    WindowManager.LayoutParams.FLAG_SECURE
            ));
            //TODO: Build another approach for Android 12+, as system blocks behaviour of activity which 
            //contains flag FLAG_NOT_TOUCHABLE, that mean keyboard or other gestures on main React Native
            //app will not work correctly.
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );
                intent.putExtra(ScreenGuardColorData.class.getName(), new ScreenGuardColorData(hexColor));
                intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                Objects.requireNonNull(
                        currentReactContext.getCurrentActivity()).startActivity(intent);
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
    public void deactivateShield() {
        try {
            if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.R) {
                currentReactContext.sendBroadcast(
                        new Intent("com.screenguard.ScreenGuardColorActivity.close")
                );
            }
            Handler handler = new Handler();
            Runnable delayedFunction = () -> {
                if (mHandlerBlockScreenShot != null) {
                    mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                            currentReactContext.getCurrentActivity()
                    ).getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
                    mHandlerBlockScreenShot = null;
                }
            };
            handler.postDelayed(delayedFunction, 500);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
