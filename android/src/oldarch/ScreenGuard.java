package com.screenguard;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;

class ScreenGuard extends ReactContextBaseJavaModule {
    public static final String NAME = "ScreenGuard";
    private final ScreenGuardModule delegate;

    public ScreenGuard(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    @NonNull
    @Override
    public String getName() {
        return ScreenGuardModule.NAME;
    }

    @ReactMethod
    public void registerScreenshotEventListener(Boolean isCaptureScreenshotFile) {
        delegate.registerScreenShotEventListener(isCaptureScreenshotFile);
    }
    // public void addListener(String eventName);
    // public void removeListeners(int count) 
    @ReactMethod
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) {
        delegate.activateShieldWithBlurView(screenGuardBlurData);
    }

    @ReactMethod
    public void activateShieldWithImage(ReadableMap data) {
        delegate.activateShieldWithImage(data);
    }

    @ReactMethod
    public void activateShield(ReadableMap data) {
        delegate.activateShield(data);
    }

    @ReactMethod
    public void activateShieldWithoutEffect() {
        delegate.activateShieldWithoutEffect();
    }

    @ReactMethod
    public void deactivateShield() {
        delegate.deactivateShield();
    }

    @NonNull
    @Override
    public String getName() {
        return ScreenGuardModule.NAME;
    }
}