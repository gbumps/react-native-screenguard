package com.screenguard;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

class ScreenGuard extends NativeScreenGuardSpec {
    private final ScreenGuardModule delegate;

    public ScreenGuard(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    @Override
    public void activateShield(ReadableMap data, Promise promise) {
        try {
            delegate.activateShield(data);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShield", e.getMessage());
        }
    }

    @Override
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData, Promise promise) {
        try {
            delegate.activateShieldWithBlurView(screenGuardBlurData);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithBlurView", e.getMessage());
        }
    }

    @Override
    public void activateShieldWithImage(ReadableMap data, Promise promise) {
        try {
            delegate.activateShieldWithImage(data);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithImage", e.getMessage());
        }
    }

    @Override
    public void activateShieldWithoutEffect(Promise promise) {
        try {
            delegate.activateShieldWithoutEffect();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithoutEffect", e.getMessage());
        }
    }

    @Override
    public void deactivateShield(Promise promise) {
        try {
            delegate.deactivateShield();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("deactivateShield", e.getMessage());
        }
    }

    @Override
    public void registerScreenshotEventListener(boolean getScreenShotPath) {
        try {
            delegate.registerScreenShotEventListener(getScreenShotPath);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void registerScreenRecordingEventListener(boolean getRecordingStatus) {
        Log.d("ScreenGuard", "registerScreenRecordingEventListener not supported yet on Android!");
    }
}