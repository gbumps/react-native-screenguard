package com.screenguard;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.screenguard.helper.ScreenGuardHelper;
import com.screenguard.model.ScreenGuardBlurData;
import com.screenguard.model.ScreenGuardColorData;
import com.screenguard.model.ScreenGuardImageData;

import java.lang.ref.WeakReference;

@ReactModule(name = ScreenGuardModule.NAME)
public class ScreenGuardModuleImpl extends ReactContextBaseJavaModule {

    private WeakReference<Activity> mainActivityRef = null;

    public static final String NAME = "ScreenGuard";

    public static final String SCREENSHOT_EVT = "onScreenShotCaptured";

    public static final String SCREEN_RECORDING_EVT = "onScreenRecordingCaptured";

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

    
    public void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuard(
                    currentReactContext,
                    isCaptureScreenshotFile,
                    (url) -> currentReactContext.getJSModule(
                          DeviceEventManagerModule.RCTDeviceEventEmitter.class
                    ).emit(ScreenGuardModule.SCREENSHOT_EVT, url)
            );
        }
        mScreenGuard.register();
    }

    
    public void addListener(String eventName) {
//        if (mScreenGuard == null) {
//            mScreenGuard = new ScreenGuard(
//                    currentReactContext,
//                    (url) -> currentReactContext.getJSModule(
//                            DeviceEventManagerModule.RCTDeviceEventEmitter.class
//                    ).emit(eventName, url)
//            );
//        }
//        mScreenGuard.register();
        // Keep: Required for RN built in Event Emitter Calls.
    }

    
    public void removeListeners(int count) {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) {
        try {
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
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
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "activateShieldWithBlurView: " + e.getMessage());
        }
    }


    
    public void activateShieldWithImage(ReadableMap data) {
        try {
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
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
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "activateShieldWithImage: " + e.getMessage());
        }
    }

    
    public void activateShield(String hexColor, int timeAfterResume) {
        try {
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
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
                    intent.putExtra(ScreenGuardColorData.class.getName(),
                            new ScreenGuardColorData(
                            hexColor, timeAfterResume
                    ));

                    intent.setPackage(currentReactContext.getPackageName());

                    intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);

                    currentActivity.startActivity(intent);
                }
            });
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "activateShield exception: " + e.getMessage());
        }
    }

    
    public void activateShieldWithoutEffect() {
        try {
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
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

    
    public void deactivateShield() {
        try {
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
            } else {
                currentReactContext.sendBroadcast(
                        new Intent(ScreenGuardColorActivity.SCREENGUARD_COLOR_ACTIVITY_CLOSE));
            }
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "deactivateShield exception: " + e.getMessage());
        }
    }

}
