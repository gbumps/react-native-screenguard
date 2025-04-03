package com.screenguard;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.screenguard.ScreenGuardModuleImpl;

class ScreenGuard extends ReactContextBaseJavaModule {
    private final ScreenGuardModule delegate;

    public ScreenGuard(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    public void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        delegate.registerScreenShotEventListener(isCaptureScreenshotFile);
    }
    // public void addListener(String eventName);
    // public void removeListeners(int count) 
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) {
        delegate.activateShieldWithBlurView(screenGuardBlurData);
    }
    public void activateShieldWithImage(ReadableMap data) {
        delegate.activateShieldWithImage(data);
    }

    public void activateShield(ReadableMap data) {
        delegate.activateShield(data);
    }

    public void activateShieldWithoutEffect() {
        delegate.activateShieldWithoutEffect();
    }

    public void deactivateShield() {
        delegate.deactivateShield();
    }

}