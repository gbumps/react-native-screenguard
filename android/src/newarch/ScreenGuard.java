package com.screenguard;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.screenguard.NativeScreenGuardSpec;

class ScreenGuardSpec extends NativeScreenGuardSpec {
    private final ScreenGuardModuleImpl delegate;

    public ScreenGuardSpec(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModuleImpl(context);
    }

    @Override
    public void activateShield(ReadableMap data) {

    }

    public void registerScreenShotEventListener(Boolean isCaptureScreenshotFile) {
        delegate.registerScreenShotEventListener(isCaptureScreenshotFile);
    }

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

    @Override
    public void registerScreenshotEventListener(boolean getScreenShotPath, Callback callback) {

    }

    @Override
    public void registerScreenRecordingEventListener(Callback callback) {

    }
}