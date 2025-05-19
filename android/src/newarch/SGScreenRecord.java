package com.screenguard;

import com.facebook.react.bridge.ReactApplicationContext;
import com.screenguard.ScreenGuardModule;

public class SGScreenRecord extends NativeSGScreenRecordSpec {
    private final ScreenGuardModule delegate;

    public SGScreenRecord(ReactApplicationContext context) {
        super(context);
        delegate = new ScreenGuardModule(context);
    }

    @Override
    public void registerScreenRecordingEventListener(boolean getScreenRecordStatus) {
        //Will be implemented in future release!
    }

    @Override
    public void removeScreenRecordingEventListener() {
        //Will be implemented in future release!
    }

    @Override
    public void addListener(String eventName) {

    }

    @Override
    public void removeListeners(double count) {

    }
}
