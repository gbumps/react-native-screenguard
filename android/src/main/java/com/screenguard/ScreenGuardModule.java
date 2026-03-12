package com.screenguard;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Build;
import android.util.Log;
import android.view.View;
import android.view.WindowManager;
import android.widget.Toast;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.screenguard.helper.ScreenGuardClassName;
import com.screenguard.helper.ScreenGuardConstants;
import com.screenguard.helper.ScreenGuardHelper;

import java.lang.ref.WeakReference;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.LifecycleEventListener;
import org.json.JSONArray;
import org.json.JSONObject;

public class ScreenGuardModule implements LifecycleEventListener {

    private ReadableMap mConfigs;

    private WeakReference<Activity> mainActivityRef = null;

    private ReactApplicationContext currentReactContext;

    private ScreenGuardListener mScreenGuard;

    private boolean isInitialized = false;

    private java.util.function.Consumer<Integer> mScreenRecordingCallback = null;

    public ScreenGuardModule(ReactApplicationContext reactContext) {
        super();
        currentReactContext = reactContext;
        reactContext.addLifecycleEventListener(this);
    }

    @Override
    public void onHostResume() {
        Log.d("ScreenGuard", "onHostResume called, isInitialized=" + isInitialized);
        if (isInitialized && mConfigs != null) {
            boolean displayOverlayAndroid = !mConfigs.hasKey(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY_ANDROID)
                    || mConfigs.getBoolean(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY_ANDROID);
            boolean enableRecord = mConfigs.hasKey(ScreenGuardConstants.ENABLE_RECORD)
                    && mConfigs.getBoolean(ScreenGuardConstants.ENABLE_RECORD);
            boolean isOverlayActivated = ScreenGuardOverlay.getInstance().isActivated();

            Log.d("ScreenGuard", "displayOverlayAndroid=" + displayOverlayAndroid
                    + ", enableRecord=" + enableRecord
                    + ", isActivated=" + isOverlayActivated);

            if (displayOverlayAndroid && !enableRecord && isOverlayActivated) {
                Log.d("ScreenGuard", "Calling showPendingOverlay");
                ScreenGuardOverlay.getInstance().showPendingOverlay();
            }
        }
    }

    @Override
    public void onHostPause() {
    }

    @Override
    public void onHostDestroy() {
        cleanup();
    }

    private void cleanup() {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }

        if (Build.VERSION.SDK_INT >= 35 && mScreenRecordingCallback != null) {
            Activity mainActivity = mainActivityRef != null ? mainActivityRef.get() : null;
            if (mainActivity != null) {
                mainActivity.getWindowManager().removeScreenRecordingCallback(mScreenRecordingCallback);
            }
            mScreenRecordingCallback = null;
        }

        ScreenGuardOverlay.getInstance().cleanup();

        Activity mainActivity = mainActivityRef != null ? mainActivityRef.get() : null;
        if (mainActivity != null) {
            mainActivity
                    .runOnUiThread(() -> mainActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
        }

        isInitialized = false;
    }

    @NonNull
    public String getName() {
        return ScreenGuardClassName.SCREENGUARD;
    }

    public void initSettings(ReadableMap data) {
        mConfigs = data;
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null) {
            mainActivityRef = new WeakReference<>(currentActivity);

            boolean enableCapture = data.hasKey(ScreenGuardConstants.ENABLE_CAPTURE)
                    && data.getBoolean(ScreenGuardConstants.ENABLE_CAPTURE);
            boolean enableRecord = data.hasKey(ScreenGuardConstants.ENABLE_RECORD)
                    && data.getBoolean(ScreenGuardConstants.ENABLE_RECORD);
            boolean getScreenshotPath = data.hasKey(ScreenGuardConstants.GET_SCREENSHOT_PATH)
                    && data.getBoolean(ScreenGuardConstants.GET_SCREENSHOT_PATH);

            ScreenGuardOverlay.getInstance().init(currentActivity);

            registerScreenShotEventListener(getScreenshotPath);

            if (Build.VERSION.SDK_INT >= 35) {
                registerScreenRecordingCallback();
            }
        }
        isInitialized = true;
        Log.d("ScreenGuard", "initSettings completed, isInitialized=" + isInitialized);
        logAction(ScreenGuardConstants.ACTION_INIT, false);
    }

    @androidx.annotation.RequiresApi(api = 35)
    private void registerScreenRecordingCallback() {
        if (mScreenRecordingCallback != null)
            return;

        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null) {
            mScreenRecordingCallback = (state) -> {
                boolean isRecording = state > 0;
                WritableMap map = Arguments.createMap();
                map.putBoolean(ScreenGuardConstants.IS_RECORDING, isRecording);
                currentReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(ScreenGuardClassName.SCREEN_RECORDING_EVT, map);

                logAction(isRecording ? ScreenGuardConstants.ACTION_RECORDING_START
                        : ScreenGuardConstants.ACTION_RECORDING_STOP, true);

                boolean displayOverlayAndroid = mConfigs == null
                        || !mConfigs.hasKey(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY_ANDROID)
                        || mConfigs.getBoolean(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY_ANDROID);

                boolean isOverlayActivated = ScreenGuardOverlay.getInstance().isActivated();

                if (displayOverlayAndroid && isOverlayActivated) {
                    if (isRecording) {
                        showOverlayPermanent();
                        currentActivity.runOnUiThread(() -> {
                            Toast.makeText(currentReactContext, ScreenGuardConstants.MSG_RECORDING_BLOCKED,
                                    Toast.LENGTH_SHORT).show();
                        });
                    } else {
                        ScreenGuardOverlay.getInstance().showPendingOverlay();
                    }
                } else if (isRecording && isOverlayActivated) {
                    currentActivity.runOnUiThread(() -> {
                        Toast.makeText(currentReactContext, ScreenGuardConstants.MSG_RECORDING_BLOCKED,
                                Toast.LENGTH_SHORT).show();
                    });
                }
            };

            currentActivity.getWindowManager().addScreenRecordingCallback(
                    currentReactContext.getMainExecutor(),
                    mScreenRecordingCallback);
        }
    }

    private void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        int limitCount = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.LIMIT_CAPTURE_EVT_COUNT)
                ? mConfigs.getInt(ScreenGuardConstants.LIMIT_CAPTURE_EVT_COUNT)
                : 0;
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuardListener(
                    currentReactContext,
                    isCaptureScreenshotFile,
                    limitCount,
                    (url) -> {
                        currentReactContext.getJSModule(
                                DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                                .emit(ScreenGuardClassName.SCREENSHOT_EVT, url);

                        logAction(ScreenGuardConstants.ACTION_SCREENSHOT_TAKEN, true);

                        if (ScreenGuardOverlay.getInstance().isActivated()) {
                            Activity currentActivity = currentReactContext.getCurrentActivity();
                            if (currentActivity != null) {
                                currentActivity.runOnUiThread(() -> {
                                    Toast.makeText(currentReactContext, ScreenGuardConstants.MSG_SCREENSHOT_BLOCKED,
                                            Toast.LENGTH_SHORT).show();
                                });
                            }
                        }
                    });
        }
        mScreenGuard.register();
    }

    private void showOverlay() {
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null) {
            ScreenGuardOverlay.getInstance().showPendingOverlay();
        }
    }

    private void showOverlayPermanent() {
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null) {
            ScreenGuardOverlay.getInstance().showColorPermanent("#000000");
        }
    }

    public void addListener(String eventName) {
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

        currentActivity
                .runOnUiThread(() -> currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE));

        currentActivity.runOnUiThread(() -> {
            final View currentView = currentActivity.getWindow().getDecorView().getRootView();
            currentView.setDrawingCacheEnabled(true);
            Bitmap bitmap = ScreenGuardHelper.captureReactView(currentView);

            int radius = screenGuardBlurData.getInt(ScreenGuardConstants.RADIUS);
            int timeAfterResume = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.TIME_AFTER_RESUME)
                    ? mConfigs.getInt(ScreenGuardConstants.TIME_AFTER_RESUME)
                    : 1000;

            ScreenGuardOverlay.getInstance().prepareBlur(currentActivity, bitmap, radius, timeAfterResume);
        });
        logAction(ScreenGuardConstants.ACTION_ACTIVATE_BLUR, true);
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

        currentActivity
                .runOnUiThread(() -> currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE));

        currentActivity.runOnUiThread(() -> {
            ReadableMap source = data.getMap(ScreenGuardConstants.SOURCE);
            String uriImage = "";
            if (source != null) {
                uriImage = source.getString(ScreenGuardConstants.URI);
            }
            String backgroundColor = data.getString(ScreenGuardConstants.BACKGROUND_COLOR);
            double width = data.getDouble(ScreenGuardConstants.WIDTH);
            double height = data.getDouble(ScreenGuardConstants.HEIGHT);
            int alignment = data.getInt(ScreenGuardConstants.ALIGNMENT);
            int timeAfterResume = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.TIME_AFTER_RESUME)
                    ? mConfigs.getInt(ScreenGuardConstants.TIME_AFTER_RESUME)
                    : 1000;

            ScreenGuardOverlay.getInstance().prepareImage(currentActivity, uriImage, width, height, alignment,
                    backgroundColor, timeAfterResume);
        });
        logAction(ScreenGuardConstants.ACTION_ACTIVATE_IMAGE, true);
    }

    public void activateShield(ReadableMap data) throws Exception {
        Activity currentActivity = currentReactContext.getCurrentActivity();

        if (currentActivity == null) {
            return;
        }
        mainActivityRef = new WeakReference<>(currentActivity);

        currentActivity
                .runOnUiThread(() -> currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE));

        currentActivity.runOnUiThread(() -> {
            String hexColor = data.getString(ScreenGuardConstants.BACKGROUND_COLOR);
            int timeAfterResume = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.TIME_AFTER_RESUME)
                    ? mConfigs.getInt(ScreenGuardConstants.TIME_AFTER_RESUME)
                    : 1000;

            ScreenGuardOverlay.getInstance().prepareColor(currentActivity, hexColor, timeAfterResume);
        });
        logAction(ScreenGuardConstants.ACTION_ACTIVATE_SHIELD, true);
    }

    public void activateShieldWithoutEffect() {
        try {
            Activity currentActivity = currentReactContext.getCurrentActivity();

            mainActivityRef = new WeakReference<>(currentActivity);

            if (currentActivity != null) {
                currentActivity.runOnUiThread(
                        () -> currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE));
            }
            logAction(ScreenGuardConstants.ACTION_ACTIVATE_NO_EFFECT, true);
        } catch (Exception e) {
            Log.e(ScreenGuardModule.class.getName(), "activateShieldWithoutEffect exception: " + e.getMessage());
        }
    }

    public void deactivateShield() throws Exception {
        Activity mainActivity = mainActivityRef != null ? mainActivityRef.get() : null;
        if (mainActivity != null) {
            mainActivity
                    .runOnUiThread(() -> mainActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
        }

        ScreenGuardOverlay.getInstance().hide();

        logAction(ScreenGuardConstants.ACTION_DEACTIVATE, false);
    }

    private void logAction(String action, boolean isActivated) {
        if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.TRACKING_LOG)
                && !mConfigs.getBoolean(ScreenGuardConstants.TRACKING_LOG)) {
            return;
        }

        try {
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(ScreenGuardConstants.PREFS_NAME,
                    Context.MODE_PRIVATE);
            String logsStr = shardPref.getString(ScreenGuardConstants.PREF_LOGS, "[]");
            JSONArray logs = new JSONArray(logsStr);

            JSONObject logEntry = new JSONObject();
            logEntry.put(ScreenGuardConstants.TIMESTAMP, System.currentTimeMillis());
            logEntry.put(ScreenGuardConstants.ACTION, action);
            logEntry.put(ScreenGuardConstants.IS_ACTIVATED, isActivated);
            logEntry.put(ScreenGuardConstants.METHOD, "");

            logs.put(logEntry);

            // Limit to last 1000 logs
            if (logs.length() > 1000) {
                JSONArray newLogs = new JSONArray();
                for (int i = logs.length() - 1000; i < logs.length(); i++) {
                    newLogs.put(logs.get(i));
                }
                logs = newLogs;
            }

            shardPref.edit().putString(ScreenGuardConstants.PREF_LOGS, logs.toString()).apply();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getScreenGuardLogs(double maxCount, Promise promise) {
        try {
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(ScreenGuardConstants.PREFS_NAME,
                    Context.MODE_PRIVATE);
            String logsStr = shardPref.getString(ScreenGuardConstants.PREF_LOGS, "[]");
            JSONArray logs = new JSONArray(logsStr);

            int count = (int) maxCount;
            if (count > logs.length()) {
                count = logs.length();
            }

            WritableArray result = Arguments.createArray();
            int startIndex = Math.max(0, logs.length() - count);
            for (int i = startIndex; i < logs.length(); i++) {
                JSONObject log = logs.getJSONObject(i);
                WritableMap map = Arguments.createMap();
                map.putDouble(ScreenGuardConstants.TIMESTAMP, log.getDouble(ScreenGuardConstants.TIMESTAMP));
                map.putString(ScreenGuardConstants.ACTION, log.getString(ScreenGuardConstants.ACTION));
                map.putBoolean(ScreenGuardConstants.IS_ACTIVATED, log.getBoolean(ScreenGuardConstants.IS_ACTIVATED));
                map.putString(ScreenGuardConstants.METHOD, log.getString(ScreenGuardConstants.METHOD));
                result.pushMap(map);
            }
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(ScreenGuardConstants.ERR_GET_LOGS, e.getMessage());
        }
    }
}
