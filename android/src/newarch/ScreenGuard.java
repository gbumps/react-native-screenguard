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
        delegate.activateShield(data);
    }

    @Override
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData) {
        delegate.activateShieldWithBlurView(screenGuardBlurData);
    }

    @Override
    public void activateShieldWithImage(ReadableMap data) {
        delegate.activateShieldWithImage(data);
    }

    @Override
    public void activateShieldWithoutEffect() {
        delegate.activateShieldWithoutEffect();
    }

    @Override
    public void deactivateShield() {
        delegate.deactivateShield();
    }

    @Override
    public void registerScreenshotEventListener(boolean getScreenShotPath, Callback callback) {
        delegate.registerScreenShotEventListener(getScreenShotPath);
    }

    @Override
    public void registerScreenRecordingEventListener(Callback callback) {

    }
}