package com.screenguardspec;

import android.util.Log;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;

public class SGScreenRecord extends ReactContextBaseJavaModule {

    public static final String NAME = "SGScreenRecord";
    private final ScreenGuardModule delegate;

    @NonNull
    @Override
    public String getName() {
        return SGScreenRecord.NAME;
    }
    
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
