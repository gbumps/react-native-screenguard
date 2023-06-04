package com.screenguard;

import android.content.ContentResolver;
import android.content.Context;
import android.database.ContentObserver;
import android.os.Handler;
import android.os.HandlerThread;
import android.provider.MediaStore;

public class ScreenGuard {

    private final HandlerThread mHandlerThread;
    private final Handler mHandler;
    private final ContentResolver mContentResolver;
    private final ContentObserver mContentObserver;

    public ScreenGuard(Context context, Listener listener) {
        mHandlerThread = new HandlerThread("ScreenGuard");
        mHandlerThread.start();
        mHandler = new Handler(mHandlerThread.getLooper());
        mContentResolver = context.getContentResolver();
        mContentObserver = new ScreenGuardObserver(context, mHandler, mContentResolver, listener);
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
        void onSnap(String url);
    }
}