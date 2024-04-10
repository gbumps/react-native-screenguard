package com.screenguard;

import android.app.Activity;
import android.content.ContentResolver;
import android.database.ContentObserver;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.screenguard.helper.ScreenGuardHelper;

public class ScreenGuardObserver extends ContentObserver {

    private ReactApplicationContext mContext;
    private ContentResolver mContentResolver;
    private final ScreenGuard.Listener mListener;

    public ScreenGuardObserver(
            ReactApplicationContext context, 
            Handler handler, 
            ContentResolver contentResolver, 
            ScreenGuard.Listener listener
    ) {
        super(handler);
        mContext = context;
        mContentResolver = contentResolver;
        mListener = listener;
    }

    @Override
    public boolean deliverSelfNotifications() {
        return super.deliverSelfNotifications();
    }

    @Override
    public void onChange(boolean selfChange) {
        super.onChange(selfChange);
    }

    @Override
    public void onChange(boolean selfChange, Uri uri) {
        super.onChange(selfChange, uri);
        Activity currentActivity = mContext.getCurrentActivity();
        if (currentActivity != null) {
            final View currentView =
                    currentActivity.getWindow().getDecorView().getRootView();
            Bitmap bitmap = ScreenGuardHelper.captureReactView(currentView);

            String url = ScreenGuardHelper.saveBitmapToFile(mContext, bitmap);
            WritableMap map = Arguments.createMap();

            if (url != null && !url.isEmpty()) {
                String fileType = url.substring(url.lastIndexOf(".") + 1);
                map.putString("type", fileType);
            }
            map.putString("path", uri.getPath());
            new Handler(Looper.getMainLooper()).post(() -> mListener.onSnap(url));
        }
    }
}
