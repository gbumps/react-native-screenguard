package com.screenguard;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
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
import com.screenguard.helper.ScreenGuardHelper;
import com.screenguard.model.ScreenGuardBlurData;
import com.screenguard.model.ScreenGuardColorData;
import com.screenguard.model.ScreenGuardImageData;

@ReactModule(name = ScreenGuardModule.NAME)
public class ScreenGuardModule extends ReactContextBaseJavaModule {

    public static final String NAME = "ScreenGuard";

    public static final String SCREENSHOT_EVT = "onScreenShotCaptured";

    public static final String SCREEN_RECORDING_EVT = "onScreenRecordingCaptured";

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

    @ReactMethod
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

    @ReactMethod
    public void removeListeners(int count) {
        // Keep: Required for RN built in Event Emitter Calls.
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    @ReactMethod
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();

            if (currentActivity == null) {
                return;
            }
            if (currentActivity.getClass() == ScreenGuardColorActivity.class) {
                deactivateShield();
            }
            if (mHandlerBlockScreenShot != null) {
                mHandlerBlockScreenShot.post(() ->
                        currentActivity.getWindow().setFlags(
                                WindowManager.LayoutParams.FLAG_SECURE,
                                WindowManager.LayoutParams.FLAG_SECURE
                        ));
            }
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
            e.printStackTrace();
        }
    }


    @ReactMethod
    public void activateShieldWithImage(ReadableMap data) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();

            if (currentActivity == null) {
                return;
            }
            if (currentActivity.getClass() == ScreenGuardColorActivity.class) {
                deactivateShield();
            }
            if (mHandlerBlockScreenShot != null) {
                mHandlerBlockScreenShot.post(() ->
                        currentActivity.getWindow().setFlags(
                                WindowManager.LayoutParams.FLAG_SECURE,
                                WindowManager.LayoutParams.FLAG_SECURE
                        ));
            }
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
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void activateShield(String hexColor, int timeAfterResume) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();
            if (currentActivity == null) {
                return;
            }
            if (mHandlerBlockScreenShot != null) {
                mHandlerBlockScreenShot.post(() ->
                        currentActivity.getWindow().setFlags(
                                WindowManager.LayoutParams.FLAG_SECURE,
                                WindowManager.LayoutParams.FLAG_SECURE
                        ));
            }
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
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void activateShieldWithoutEffect() {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            if (currentReactContext == null) {
                currentReactContext = getReactApplicationContext();
            }
            Activity currentActivity = currentReactContext.getCurrentActivity();
            if (currentActivity != null && mHandlerBlockScreenShot != null) {
                mHandlerBlockScreenShot.post(() -> currentActivity.getWindow().setFlags(
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
            if (currentActivity == null) {
                throw new NullPointerException("Current Activity is null!");
            }
            mHandlerBlockScreenShot.postDelayed(() -> currentActivity
                    .getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE), 400);
    
            mHandlerBlockScreenShot = null;
            if (Build.VERSION.SDK_INT >= 33) {
              if (currentActivity instanceof ScreenGuardColorActivity) {
                currentActivity.finish();
              }
            } else {
              currentContext.sendBroadcast(
                new Intent(ScreenGuardColorActivity.SCREENGUARD_COLOR_ACTIVITY_CLOSE));
            }
            removeListeners(1);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void deactivateShield() {
        try {
          if (mHandlerBlockScreenShot == null) {
            mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
          }
          if (currentActivity == null) {
              throw new NullPointerException("Current Activity is null!");
          }
            
        } catch (Exception e) {
          Log.e(UNREGISTER, e.getMessage());
        }
      }

}
