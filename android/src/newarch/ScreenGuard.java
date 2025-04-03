package com.screenguard;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.screenguard.NativeScreenGuardSpec;
import com.screenguard.ScreenGuardModule;

class ScreenGuard extends NativeScreenGuardSpec {
    private final ScreenGuardModule delegate;

    public ScreenGuard(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
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
    public void registerScreenshotEventListener(boolean getScreenShotPath) {
        delegate.registerScreenShotEventListener(getScreenShotPath);
    }

    @Override
    public void registerScreenRecordingEventListener(Callback callback) {

    }
}