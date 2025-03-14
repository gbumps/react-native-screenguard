package com.screenguard;

import android.os.Build;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Promise;

class ScreenGuardSpec extends NativeScreenGuardSpec {
    private final RNShareImpl delegate;

    public ScreenGuardSpec(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModuleImpl(context);
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
}