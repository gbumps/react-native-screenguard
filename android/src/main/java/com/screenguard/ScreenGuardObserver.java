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
    private Boolean getScreenShotPath;

    public ScreenGuardObserver(
            ReactApplicationContext context, 
            Handler handler, 
            ContentResolver contentResolver, 
            ScreenGuard.Listener listener,
            Boolean isGetScreenShotPath
    ) {
        super(handler);
        mContext = context;
        mContentResolver = contentResolver;
        mListener = listener;
        getScreenShotPath = isGetScreenShotPath;
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
        WritableMap map = Arguments.createMap();
        Activity currentActivity = mContext.getCurrentActivity();
        if (currentActivity != null && getScreenShotPath) {
            final View currentView =
                    currentActivity.getWindow().getDecorView().getRootView();
            Bitmap bitmap = ScreenGuardHelper.captureReactView(currentView);

            String url = ScreenGuardHelper.saveBitmapToFile(mContext, bitmap);

            if (url != null && !url.isEmpty()) {
                String fileType = url.substring(url.lastIndexOf(".") + 1);
                String name = url.substring(url.lastIndexOf("/") + 1);
                map.putString("type", fileType);
                map.putString("name", name);
            }
            map.putString("path", url);
        } else {
            map.putString("type", "");
            map.putString("name", "");
            map.putString("path", "");
        }
        new Handler(Looper.getMainLooper()).post(() -> mListener.onSnap(map));
    }
}
