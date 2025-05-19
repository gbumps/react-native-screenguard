package com.screenguard;

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
    
    public SGScreenRecord(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    @ReactMethod
    public void registerScreenRecordEventListener(boolean getScreenshotPath) {
        //Will be implemented in future release!
    }

    @ReactMethod
    public void removeScreenRecordEventListener() {
        //Will be implemented in future release!
    }


    @ReactMethod
    public void addListener() {

    }


    @ReactMethod
    public void removeListeners() {

    }

}
