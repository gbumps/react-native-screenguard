package com.screenguard;

import android.content.ContentResolver;
import android.content.Context;
import android.database.ContentObserver;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;

public class ScreenGuardObserver extends ContentObserver {
    private Context mContext;
    private ContentResolver mContentResolver;
    private final ScreenGuard.Listener mListener;

    public ScreenGuardObserver(Context context, Handler handler, ContentResolver contentResolver, ScreenGuard.Listener listener) {
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
        String url = uri.toString();
        new Handler(Looper.getMainLooper()).post(() -> mListener.onSnap(url));
    }

}
