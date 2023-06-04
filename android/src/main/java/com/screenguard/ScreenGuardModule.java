package com.screenguard;

import android.os.Handler;
import android.os.Looper;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;

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
            mScreenGuard = new ScreenGuard(currentReactContext, (url) -> currentReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onSnapper", url));
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
    public void activateShield() {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    getReactApplicationContext().getCurrentActivity()
            ).getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE
            ));
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    @ReactMethod
    public void deactivateShield() {
        try {
            mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    getReactApplicationContext().getCurrentActivity()
            ).getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
            mHandlerBlockScreenShot = null;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
