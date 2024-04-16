package com.screenguard;

import android.content.ContentResolver;
import android.database.ContentObserver;
import android.os.Handler;
import android.os.HandlerThread;
import android.provider.MediaStore;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

public class ScreenGuard {

    private final HandlerThread mHandlerThread;
    private final Handler mHandler;
    private final ContentResolver mContentResolver;
    private final ContentObserver mContentObserver;

    public ScreenGuard(ReactApplicationContext context, Boolean getScreenShot, Listener listener) {
        mHandlerThread = new HandlerThread("ScreenGuard");
        mHandlerThread.start();
        mHandler = new Handler(mHandlerThread.getLooper());
        mContentResolver = context.getContentResolver();
        mContentObserver = new ScreenGuardObserver(
                context, mHandler, mContentResolver, listener, getScreenShot);
    }

    public void register() {
        mContentResolver.unregisterContentObserver(mContentObserver);
        mContentResolver.registerContentObserver(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                true,
                mContentObserver
        );
    }

    public void unregister() {
        mContentResolver.unregisterContentObserver(mContentObserver);
    }

    public interface Listener {
        void onSnap(WritableMap map);
    }
}