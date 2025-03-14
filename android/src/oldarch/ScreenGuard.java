package com.screenguard;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.screenguard.ScreenGuardModuleImpl;

class ScreenGuardSpec extends ReactContextBaseJavaModule {
    private final ScreenGuardModuleImpl delegate;

    public ScreenGuardSpec(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModuleImpl(context);
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

    public void activateShield(String hexColor, int timeAfterResume) {
        delegate.activateShield(hexColor, timeAfterResume);
    }

    public void activateShieldWithoutEffect() {
        delegate.activateShieldWithoutEffect();
    }

    public void deactivateShield() {
        delegate.deactivateShield();
    }

}