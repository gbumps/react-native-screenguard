package com.screenguardspec;

import android.util.Log;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableMap;

public class SGScreenshot extends NativeSGScreenshotSpec {
    private final ScreenGuardModule delegate;

    public SGScreenshot(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    @Override
    public void registerScreenshotEventListener(boolean getScreenshotPath) {
        try {
            delegate.registerScreenShotEventListener(getScreenshotPath);
        } catch (Exception e) {
            Log.e("ScreenGuard", "registerScreenshotEventListener error: " + e.getMessage());
        }
    }

    @Override
    public void removeScreenshotEventListener() {
		try {
			delegate.removeScreenShotEventListener();
		} catch (Exception e) {
			Log.e("ScreenGuard", "removeScreenshotEventListener error: " + e.getMessage());
		}

    }
}