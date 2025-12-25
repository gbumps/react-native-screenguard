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

    private static final String PREFS_NAME = "com.screenguard.prefs";
    private static final String PREF_LOGS = "screenguard_logs";
    
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
            
            boolean enableCapture = data.hasKey("enableCapture") && data.getBoolean("enableCapture");
            boolean enableRecord = data.hasKey("enableRecord") && data.getBoolean("enableRecord");
            boolean getScreenshotPath = data.hasKey("getScreenshotPath") && data.getBoolean("getScreenshotPath");

            currentActivity.runOnUiThread(() -> {
                if (enableCapture || enableRecord) {
                    currentActivity.getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
                } else {
                    currentActivity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE);
                }
            });

            if (enableCapture) {
                registerScreenShotEventListener(getScreenshotPath);
            }

            if (enableRecord && Build.VERSION.SDK_INT >= 35) {
                registerScreenRecordingCallback();
            }
        }
        logAction("init", false);
    }

    private void registerScreenRecordingCallback() {
        if (Build.VERSION.SDK_INT >= 35) {
            Activity currentActivity = currentReactContext.getCurrentActivity();
            if (currentActivity != null) {
                currentActivity.getWindow().addScreenRecordingCallback(currentReactContext.getMainExecutor(), (state) -> {
                    boolean isRecording = state > 0;
                    WritableMap map = Arguments.createMap();
                    map.putBoolean("isRecording", isRecording);
                    currentReactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(ScreenGuardClassName.SCREEN_RECORDING_EVT, map);
                    
                    logAction(isRecording ? "recording_start" : "recording_stop", true);
                    
                    if (isRecording) {
                         currentActivity.runOnUiThread(() -> {
                             Toast.makeText(currentReactContext, "Screen recording is blocked", Toast.LENGTH_SHORT).show();
                         });
                    }
                });
            }
        }
    }

    public void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        int limitCount = mConfigs != null && mConfigs.hasKey("limitCaptureEvtCount") ? mConfigs.getInt("limitCaptureEvtCount") : 0;
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuardListener(
                    currentReactContext,
                    isCaptureScreenshotFile,
                    limitCount,
                    (url) -> {
                        currentReactContext.getJSModule(
                          DeviceEventManagerModule.RCTDeviceEventEmitter.class
                        ).emit(ScreenGuardClassName.SCREENSHOT_EVT, url);
                        
                        logAction("screenshot_taken", true);
                        
                        Activity currentActivity = currentReactContext.getCurrentActivity();
                        if (currentActivity != null) {
                             currentActivity.runOnUiThread(() -> {
                                 Toast.makeText(currentReactContext, "Screenshot is blocked", Toast.LENGTH_SHORT).show();
                             });
                        }
                        
                        if (mConfigs != null && mConfigs.hasKey("displayOverlay") && mConfigs.getBoolean("displayOverlay")) {
                             showOverlay();
                        }
                    }
            );
        }
        mScreenGuard.register();
    }

    private void showOverlay() {
        // Implementing overlay similar to iOS using ScreenGuardColorActivity
        Activity currentActivity = currentReactContext.getCurrentActivity();
        if (currentActivity != null && mConfigs != null) {
            Intent intent = new Intent(currentActivity, ScreenGuardColorActivity.class);
            // Default to color mode if no specific shield active
            ScreenGuardColorData data = new ScreenGuardColorData("#000000", mConfigs.hasKey("timeAfterResume") ? mConfigs.getInt("timeAfterResume") : 1000);
            intent.putExtra(ScreenGuardColorData.class.getName(), data);
            intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION | Intent.FLAG_ACTIVITY_NEW_TASK);
            currentActivity.startActivity(intent);
        }
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
        logAction("activate_blur", true);
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
        logAction("activate_image", true);
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
        logAction("activate_shield", true);
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
            logAction("activate_no_effect", true);
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
        logAction("deactivate", false);
    }

    private void logAction(String action, boolean isProtected) {
        if (mConfigs != null && mConfigs.hasKey("trackingLog") && !mConfigs.getBoolean("trackingLog")) {
            return;
        }
        
        try {
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String logsStr = shardPref.getString(PREF_LOGS, "[]");
            JSONArray logs = new JSONArray(logsStr);
            
            JSONObject logEntry = new JSONObject();
            logEntry.put("timestamp", System.currentTimeMillis());
            logEntry.put("action", action);
            logEntry.put("isProtected", isProtected);
            logEntry.put("method", ""); // Should ideally track method from mConfigs
            
            logs.put(logEntry);
            
            // Limit to last 1000 logs
            if (logs.length() > 1000) {
                JSONArray newLogs = new JSONArray();
                for (int i = logs.length() - 1000; i < logs.length(); i++) {
                    newLogs.put(logs.get(i));
                }
                logs = newLogs;
            }
            
            shardPref.edit().putString(PREF_LOGS, logs.toString()).apply();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void getScreenGuardLogs(double maxCount, Promise promise) {
        try {
            SharedPreferences shardPref = currentReactContext.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
            String logsStr = shardPref.getString(PREF_LOGS, "[]");
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
                map.putDouble("timestamp", log.getDouble("timestamp"));
                map.putString("action", log.getString("action"));
                map.putBoolean("isProtected", log.getBoolean("isProtected"));
                map.putString("method", log.getString("method"));
                result.pushMap(map);
            }
            promise.resolve(result);
        } catch (Exception e) {
            promise.reject("GET_LOGS_ERROR", e.getMessage());
        }
    }

}
