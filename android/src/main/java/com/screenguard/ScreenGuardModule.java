package com.screenguard;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.screenguard.helper.ScreenGuardClassName;
import com.screenguard.helper.ScreenGuardHelper;
import com.screenguard.model.ScreenGuardBlurData;
import com.screenguard.model.ScreenGuardColorData;
import com.screenguard.model.ScreenGuardImageData;

import java.lang.ref.WeakReference;

public class ScreenGuardModule {
    private WeakReference<Activity> mainActivityRef = null;

    private ReactApplicationContext currentReactContext;

    private ScreenGuardListener mScreenGuard;

    public ScreenGuardModule(ReactApplicationContext reactContext) {
        super();
        currentReactContext = reactContext;
    }

    @NonNull
    public String getName() {
        return ScreenGuardClassName.SCREENGUARD;
    }


    public void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuardListener(
                    currentReactContext,
                    isCaptureScreenshotFile,
                    (url) -> currentReactContext.getJSModule(
                          DeviceEventManagerModule.RCTDeviceEventEmitter.class
                    ).emit(ScreenGuardClassName.SCREENSHOT_EVT, url)
            );
        }
        mScreenGuard.register();
    }


    public void addListener(String eventName) {
        // Keep: Required for RN built in Event Emitter Calls.
    }


    public void removeListeners(int count) {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) throws Exception {
        Activity currentActivity = currentReactContext.getCurrentActivity();

        if (currentActivity == null) {
            return;
        }
        mainActivityRef = new WeakReference<>(currentActivity);

        currentActivity.runOnUiThread(() ->
                currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        );

        currentActivity.runOnUiThread(() -> {
            final View currentView =
                    currentActivity.getWindow().getDecorView().getRootView();
            currentView.setDrawingCacheEnabled(true);
            Bitmap bitmap = ScreenGuardHelper.captureReactView(currentView);
            String localPath = ScreenGuardHelper.saveBitmapToFile(currentReactContext, bitmap);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );
                intent.putExtra(ScreenGuardBlurData.class.getName(), new ScreenGuardBlurData(
                        screenGuardBlurData.getInt("radius"),
                        localPath,
                        screenGuardBlurData.getInt("timeAfterResume")
                ));
                currentActivity.startActivity(intent);

            }
        });
    }


    public void removeScreenShotEventListener() {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    public void activateShieldWithImage(ReadableMap data) throws Exception {
        Activity currentActivity = currentReactContext.getCurrentActivity();

        if (currentActivity == null) {
            return;
        }
        mainActivityRef = new WeakReference<>(currentActivity);

        currentActivity.runOnUiThread(() ->
                currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        );

        currentActivity.runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );

                ReadableMap source = data.getMap("source");
                String uriImage = "";
                if (source != null) {
                    uriImage = source.getString("uri");
                }
                String backgroundColor = data.getString("backgroundColor");
                double width = data.getDouble("width");
                double height = data.getDouble("height");
                int alignment = data.getInt("alignment");
                int timeAfterResume = data.getInt("timeAfterResume");
                intent.putExtra(ScreenGuardImageData.class.getName(), new ScreenGuardImageData(
                        backgroundColor,
                        uriImage,
                        width,
                        height,
                        alignment,
                        timeAfterResume
                ));

                intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                currentActivity.startActivity(intent);
            }
        });
    }


    public void activateShield(ReadableMap data) throws Exception {
        Activity currentActivity = currentReactContext.getCurrentActivity();

        if (currentActivity == null) {
            return;
        }
        mainActivityRef = new WeakReference<>(currentActivity);

        currentActivity.runOnUiThread(() ->
                currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        );

        currentActivity.runOnUiThread(() -> {
            String hexColor = data.getString("backgroundColor");
            int timeAfterResume = data.getInt("timeAfterResume");
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );
                intent.putExtra(ScreenGuardColorData.class.getName(),
                        new ScreenGuardColorData(
                        hexColor, timeAfterResume
                ));

                intent.setPackage(currentReactContext.getPackageName());

                intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);

                currentActivity.startActivity(intent);
            }
        });
    }


    public void activateShieldWithoutEffect() {
        try {
            Activity currentActivity = currentReactContext.getCurrentActivity();

            mainActivityRef = new WeakReference<>(currentActivity);

            if (currentActivity != null) {
                currentActivity.runOnUiThread(() ->
                        currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
                );
            }
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "activateShieldWithoutEffect exception: " + e.getMessage());
        }
    }


    public void deactivateShield() throws Exception {
        Activity mainActivity = mainActivityRef != null ? mainActivityRef.get() : null;
        if (mainActivity != null) {
            mainActivity.runOnUiThread(() ->
                    mainActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
            );
        }

        Activity currentActivity = currentReactContext.getCurrentActivity();

        if (currentActivity == null) {
            throw new NullPointerException("Current Activity is null!");
        }

        if (Build.VERSION.SDK_INT >= 33) {
            if (currentActivity instanceof ScreenGuardColorActivity) {
                currentActivity.finish();
            }
        }  else {
            currentReactContext.sendBroadcast(
                    new Intent(ScreenGuardClassName.SCREENGUARD_COLOR_ACTIVITY_CLOSE));
        }  
    }

}
