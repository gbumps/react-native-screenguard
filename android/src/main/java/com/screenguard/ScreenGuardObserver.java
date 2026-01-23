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
import com.screenguard.helper.ScreenGuardConstants;
import com.screenguard.helper.ScreenGuardHelper;

public class ScreenGuardObserver extends ContentObserver {

    private ReactApplicationContext mContext;
    private ContentResolver mContentResolver;
    private final ScreenGuardListener.Listener mListener;
    private Boolean getScreenShotPath;
    private int mLimitCount = 0;
    private int mCurrentCount = 0;
    private long mRegistrationTime = 0;
    private static final long INITIAL_IGNORE_DURATION_MS = 500;

    public ScreenGuardObserver(
            ReactApplicationContext context,
            Handler handler,
            ContentResolver contentResolver,
            ScreenGuardListener.Listener listener,
            Boolean isGetScreenShotPath,
            int limitCount) {
        super(handler);
        mContext = context;
        mContentResolver = contentResolver;
        mListener = listener;
        getScreenShotPath = isGetScreenShotPath;
        mLimitCount = limitCount;
    }

    public void setRegistrationTime() {
        mRegistrationTime = System.currentTimeMillis();
        mCurrentCount = 0;
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

        if (mRegistrationTime > 0 && System.currentTimeMillis() - mRegistrationTime < INITIAL_IGNORE_DURATION_MS) {
            return;
        }

        mCurrentCount++;
        if (mLimitCount > 0 && mCurrentCount < mLimitCount) {
            return;
        }
        mCurrentCount = 0;

        WritableMap map = Arguments.createMap();
        Activity currentActivity = mContext.getCurrentActivity();
        if (currentActivity != null && getScreenShotPath) {
            final View currentView = currentActivity.getWindow().getDecorView().getRootView();
            Bitmap bitmap = ScreenGuardHelper.captureReactView(currentView);

            String url = ScreenGuardHelper.saveBitmapToFile(mContext, bitmap);

            if (url != null && !url.isEmpty()) {
                String fileType = url.substring(url.lastIndexOf(".") + 1);
                String name = url.substring(url.lastIndexOf("/") + 1);
                map.putString(ScreenGuardConstants.TYPE, fileType);
                map.putString(ScreenGuardConstants.NAME, name);
            }
            map.putString(ScreenGuardConstants.PATH, url);
        } else {
            map.putString(ScreenGuardConstants.TYPE, "");
            map.putString(ScreenGuardConstants.NAME, "");
            map.putString(ScreenGuardConstants.PATH, "");
        }
        new Handler(Looper.getMainLooper()).post(() -> mListener.onSnap(map));
    }
}
