package com.screenguard;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

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
        return ScreenGuard.NAME;
    }

    @ReactMethod
    public void activateShieldWithBlurView(ReadableMap screenGuardBlurData, Promise promise) {
        try {
            delegate.activateShieldWithBlurView(screenGuardBlurData);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithBlurView", e.getMessage());
        }
    }

    @ReactMethod
    public void activateShieldWithImage(ReadableMap data, Promise promise) {
        try {
            delegate.activateShieldWithImage(data);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithImage", e.getMessage());
        }   
    }

    @ReactMethod
    public void activateShield(ReadableMap data, Promise promise) {
        try {
            delegate.activateShield(data);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShield", e.getMessage());
        }
    }

    @ReactMethod
    public void activateShieldWithoutEffect(Promise promise) {
        try {
            delegate.activateShieldWithoutEffect();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("activateShieldWithoutEffect", e.getMessage());
        }
    }

    @ReactMethod
    public void deactivateShield(Promise promise) {
        try {
            delegate.deactivateShield();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("deactivateShield", e.getMessage());
        }
    }

}