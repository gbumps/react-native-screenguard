package com.screenguard;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
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
import com.screenguard.model.ScreenGuardBlurData;
import com.screenguard.model.ScreenGuardColorData;
import com.screenguard.model.ScreenGuardImageData;

import java.lang.ref.WeakReference;
import android.content.SharedPreferences;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;

public class ScreenGuardModule {
    
    private ReadableMap mConfigs;

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

    public void initSettings(ReadableMap data) {
        mConfigs = data;
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null) {
            mainActivityRef = new WeakReference<>(currentActivity);
            
            boolean enableCapture = data.hasKey(ScreenGuardConstants.ENABLE_CAPTURE) && data.getBoolean(ScreenGuardConstants.ENABLE_CAPTURE);
            boolean enableRecord = data.hasKey(ScreenGuardConstants.ENABLE_RECORD) && data.getBoolean(ScreenGuardConstants.ENABLE_RECORD);
            boolean getScreenshotPath = data.hasKey(ScreenGuardConstants.GET_SCREENSHOT_PATH) && data.getBoolean(ScreenGuardConstants.GET_SCREENSHOT_PATH);

            currentActivity.runOnUiThread(() -> {
                if (enableCapture || enableRecord) {
                    currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                } else {
                    currentActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                }
            });

            registerScreenShotEventListener(getScreenshotPath);

            if (Build.VERSION.SDK_INT >= 35) {
                registerScreenRecordingCallback();
            }
        }
        logAction(ScreenGuardConstants.ACTION_INIT, false);
    }

    private void registerScreenRecordingCallback() {
        if (Build.VERSION.SDK_INT >= 35) {
            Activity currentActivity = currentReactContext.getCurrentActivity();
            if (currentActivity != null) {
                currentActivity.getWindow().addScreenRecordingCallback(currentReactContext.getMainExecutor(), (state) -> {
                    boolean isRecording = state > 0;
                    WritableMap map = Arguments.createMap();
                    map.putBoolean(ScreenGuardConstants.IS_RECORDING, isRecording);
                    currentReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(ScreenGuardClassName.SCREEN_RECORDING_EVT, map);
                    
                    logAction(isRecording ? ScreenGuardConstants.ACTION_RECORDING_START : ScreenGuardConstants.ACTION_RECORDING_STOP, true);
                    
                    if (isRecording) {
                         currentActivity.runOnUiThread(() -> {
                             Toast.makeText(currentReactContext, ScreenGuardConstants.MSG_RECORDING_BLOCKED, Toast.LENGTH_SHORT).show();
                         });
                    }
                });
            }
        }
    }

    private void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        int limitCount = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.LIMIT_CAPTURE_EVT_COUNT) ? mConfigs.getInt(ScreenGuardConstants.LIMIT_CAPTURE_EVT_COUNT) : 0;
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuardListener(
                    currentReactContext,
                    isCaptureScreenshotFile,
                    limitCount,
                    (url) -> {
                        currentReactContext.getJSModule(
                          DeviceEventManagerModule.RCTDeviceEventEmitter.class
                        ).emit(ScreenGuardClassName.SCREENSHOT_EVT, url);
                        
                        logAction(ScreenGuardConstants.ACTION_SCREENSHOT_TAKEN, true);
                        
                        Activity currentActivity = currentReactContext.getCurrentActivity();
                        if (currentActivity != null) {
                             currentActivity.runOnUiThread(() -> {
                                 Toast.makeText(currentReactContext, ScreenGuardConstants.MSG_SCREENSHOT_BLOCKED, Toast.LENGTH_SHORT).show();
                             });
                        }
                        
                        boolean enableRecord = mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.ENABLE_RECORD) && mConfigs.getBoolean(ScreenGuardConstants.ENABLE_RECORD);
                        if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY) && mConfigs.getBoolean(ScreenGuardConstants.DISPLAY_SCREENGUARD_OVERLAY) && !enableRecord) {
                             showOverlay();
                        }
                    }
            );
        }
        mScreenGuard.register();
    }

    private void showOverlay() {
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null && mConfigs != null) {
            Intent intent = new Intent(currentActivity, ScreenGuardColorActivity.class);
            ScreenGuardColorData data = new ScreenGuardColorData("#000000", mConfigs.hasKey(ScreenGuardConstants.TIME_AFTER_RESUME) ? mConfigs.getInt(ScreenGuardConstants.TIME_AFTER_RESUME) : 1000);
            intent.putExtra(ScreenGuardColorData.class.getName(), data);
            if (mConfigs.hasKey(ScreenGuardConstants.ALLOW_BACKPRESS) && mConfigs.getBoolean(ScreenGuardConstants.ALLOW_BACKPRESS)) {
                intent.putExtra(ScreenGuardConstants.ALLOW_BACKPRESS, true);
            }
            intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION | Intent.FLAG_ACTIVITY_NEW_TASK);
            currentActivity.startActivity(intent);
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
                        screenGuardBlurData.getInt(ScreenGuardConstants.RADIUS),
                        localPath,
                        screenGuardBlurData.getInt(ScreenGuardConstants.TIME_AFTER_RESUME)
                ));
                 if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.ALLOW_BACKPRESS) && mConfigs.getBoolean(ScreenGuardConstants.ALLOW_BACKPRESS)) {
                    intent.putExtra(ScreenGuardConstants.ALLOW_BACKPRESS, true);
                }
                currentActivity.startActivity(intent);

            }
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

        currentActivity.runOnUiThread(() ->
                currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE)
        );

        currentActivity.runOnUiThread(() -> {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );

                ReadableMap source = data.getMap(ScreenGuardConstants.SOURCE);
                String uriImage = "";
                if (source != null) {
                    uriImage = source.getString(ScreenGuardConstants.URI);
                }
                String backgroundColor = data.getString(ScreenGuardConstants.BACKGROUND_COLOR);
                double width = data.getDouble(ScreenGuardConstants.WIDTH);
                double height = data.getDouble(ScreenGuardConstants.HEIGHT);
                int alignment = data.getInt(ScreenGuardConstants.ALIGNMENT);
                int timeAfterResume = data.getInt(ScreenGuardConstants.TIME_AFTER_RESUME);
                intent.putExtra(ScreenGuardImageData.class.getName(), new ScreenGuardImageData(
                        backgroundColor,
                        uriImage,
                        width,
                        height,
                        alignment,
                        timeAfterResume
                ));
                if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.ALLOW_BACKPRESS) && mConfigs.getBoolean(ScreenGuardConstants.ALLOW_BACKPRESS)) {
                    intent.putExtra(ScreenGuardConstants.ALLOW_BACKPRESS, true);
                }


                intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
                currentActivity.startActivity(intent);
            }
        });
        logAction(ScreenGuardConstants.ACTION_ACTIVATE_IMAGE, true);
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
            String hexColor = data.getString(ScreenGuardConstants.BACKGROUND_COLOR);
            int timeAfterResume = data.getInt(ScreenGuardConstants.TIME_AFTER_RESUME);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                Intent intent = new Intent(
                        currentReactContext.getCurrentActivity(),
                        ScreenGuardColorActivity.class
                );
                intent.putExtra(ScreenGuardColorData.class.getName(),
                        new ScreenGuardColorData(
                        hexColor, timeAfterResume
                ));
                if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.ALLOW_BACKPRESS) && mConfigs.getBoolean(ScreenGuardConstants.ALLOW_BACKPRESS)) {
                    intent.putExtra(ScreenGuardConstants.ALLOW_BACKPRESS, true);
                }

                intent.setPackage(currentReactContext.getPackageName());

                intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);

                currentActivity.startActivity(intent);
            }
        });
        logAction(ScreenGuardConstants.ACTION_ACTIVATE_SHIELD, true);
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
            logAction(ScreenGuardConstants.ACTION_ACTIVATE_NO_EFFECT, true);
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
            throw new NullPointerException(ScreenGuardConstants.ERR_CURRENT_ACTIVITY_NULL);
        }

        if (Build.VERSION.SDK_INT >= 33) {
            if (currentActivity instanceof ScreenGuardColorActivity) {
                currentActivity.finish();
            }
        }  else {
            currentReactContext.sendBroadcast(
                    new Intent(ScreenGuardClassName.SCREENGUARD_COLOR_ACTIVITY_CLOSE));
        }
        logAction(ScreenGuardConstants.ACTION_DEACTIVATE, false);
    }

    private void logAction(String action, boolean isProtected) {
        if (mConfigs != null && mConfigs.hasKey(ScreenGuardConstants.TRACKING_LOG) && !mConfigs.getBoolean(ScreenGuardConstants.TRACKING_LOG)) {
            return;
        }
        
        try {
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(ScreenGuardConstants.PREFS_NAME, Context.MODE_PRIVATE);
            String logsStr = shardPref.getString(ScreenGuardConstants.PREF_LOGS, "[]");
            JSONArray logs = new JSONArray(logsStr);
            
            JSONObject logEntry = new JSONObject();
            logEntry.put(ScreenGuardConstants.TIMESTAMP, System.currentTimeMillis());
            logEntry.put(ScreenGuardConstants.ACTION, action);
            logEntry.put(ScreenGuardConstants.IS_PROTECTED, isProtected);
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
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(ScreenGuardConstants.PREFS_NAME, Context.MODE_PRIVATE);
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
                map.putBoolean(ScreenGuardConstants.IS_PROTECTED, log.getBoolean(ScreenGuardConstants.IS_PROTECTED));
                map.putString(ScreenGuardConstants.METHOD, log.getString(ScreenGuardConstants.METHOD));
                result.pushMap(map);
            }
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject(ScreenGuardConstants.ERR_GET_LOGS, e.getMessage());
        }
    }
}
