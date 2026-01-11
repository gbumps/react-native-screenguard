package com.screenguard;

import android.app.Activity;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.bumptech.glide.Glide;

import java.lang.ref.WeakReference;

import jp.wasabeef.blurry.Blurry;

public class ScreenGuardOverlay {

    public enum OverlayType {
        NONE,
        COLOR,
        BLUR,
        IMAGE
    }

    private static ScreenGuardOverlay instance;

    private WeakReference<Activity> activityRef;
    private FrameLayout overlayView;
    private ImageView imageView;
    private boolean isShowing = false;
    private Handler handler;

    private OverlayType pendingType = OverlayType.NONE;
    private String pendingColor = "#000000";
    private Bitmap pendingBlurBitmap = null;
    private int pendingBlurRadius = 15;
    private String pendingImageUrl = "";
    private double pendingImageWidth = 0;
    private double pendingImageHeight = 0;
    private int pendingImageAlignment = 4; // center
    private String pendingImageBgColor = "#000000";
    private int pendingTimeAfterResume = 1000;
    private boolean isActivated = false;

    private static final int COLOR_TRANS = 0x00000000;
    private static final int OVERLAY_VIEW_ID = View.generateViewId();

    private ScreenGuardOverlay() {
        handler = new Handler(Looper.getMainLooper());
    }

    public static synchronized ScreenGuardOverlay getInstance() {
        if (instance == null) {
            instance = new ScreenGuardOverlay();
        }
        return instance;
    }

    public void init(Activity activity) {
        this.activityRef = new WeakReference<>(activity);
    }

    public boolean isShowing() {
        return isShowing;
    }

    public boolean isActivated() {
        return isActivated;
    }

    private ViewGroup getDecorView(Activity activity) {
        return (ViewGroup) activity.getWindow().getDecorView();
    }

    private void createOverlayView(Activity activity) {
        ViewGroup decorView = getDecorView(activity);
        View existingOverlay = decorView.findViewById(OVERLAY_VIEW_ID);
        if (existingOverlay != null) {
            overlayView = (FrameLayout) existingOverlay;
            imageView = (ImageView) overlayView.getChildAt(0);
            return;
        }

        overlayView = new FrameLayout(activity);
        overlayView.setId(OVERLAY_VIEW_ID);

        overlayView.setClickable(false);
        overlayView.setFocusable(false);
        overlayView.setFocusableInTouchMode(false);

        FrameLayout.LayoutParams overlayParams = new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT);

        imageView = new ImageView(activity);
        imageView.setLayoutParams(new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT));
        imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);

        imageView.setClickable(false);
        imageView.setFocusable(false);

        overlayView.addView(imageView);
        overlayView.setBackgroundColor(COLOR_TRANS);
        overlayView.setVisibility(View.GONE);

        decorView.addView(overlayView, overlayParams);
    }

    public void prepareColor(Activity activity, String hexColor, int timeAfterResume) {
        android.util.Log.d("ScreenGuard", "prepareColor called, color=" + hexColor + ", time=" + timeAfterResume);
        this.activityRef = new WeakReference<>(activity);
        this.pendingType = OverlayType.COLOR;
        this.pendingColor = hexColor;
        this.pendingTimeAfterResume = timeAfterResume;
        this.isActivated = true;
        android.util.Log.d("ScreenGuard", "prepareColor: isActivated set to " + this.isActivated);

        activity.runOnUiThread(() -> {
            createOverlayView(activity);
            overlayView.setVisibility(View.GONE);
        });
    }

    public void prepareBlur(Activity activity, Bitmap bitmap, int radius, int timeAfterResume) {
        this.activityRef = new WeakReference<>(activity);
        this.pendingType = OverlayType.BLUR;
        this.pendingBlurBitmap = bitmap;
        this.pendingBlurRadius = radius;
        this.pendingTimeAfterResume = timeAfterResume;
        this.isActivated = true;

        activity.runOnUiThread(() -> {
            createOverlayView(activity);
            overlayView.setVisibility(View.GONE);
        });
    }

    public void prepareImage(Activity activity, String imageUrl, double width, double height,
            int alignment, String backgroundColor, int timeAfterResume) {
        this.activityRef = new WeakReference<>(activity);
        this.pendingType = OverlayType.IMAGE;
        this.pendingImageUrl = imageUrl;
        this.pendingImageWidth = width;
        this.pendingImageHeight = height;
        this.pendingImageAlignment = alignment;
        this.pendingImageBgColor = backgroundColor;
        this.pendingTimeAfterResume = timeAfterResume;
        this.isActivated = true;

        activity.runOnUiThread(() -> {
            createOverlayView(activity);
            overlayView.setVisibility(View.GONE);
        });
    }

    public void showPendingOverlay() {
        android.util.Log.d("ScreenGuard",
                "showPendingOverlay called, isActivated=" + isActivated + ", pendingType=" + pendingType);
        if (!isActivated || pendingType == OverlayType.NONE)
            return;

        Activity activity = activityRef != null ? activityRef.get() : null;
        android.util.Log.d("ScreenGuard", "showPendingOverlay activity=" + (activity != null ? "valid" : "null"));
        if (activity == null || activity.isFinishing())
            return;

        activity.runOnUiThread(() -> {
            try {
                createOverlayView(activity);

                switch (pendingType) {
                    case COLOR:
                        overlayView.setBackgroundColor(Color.parseColor(pendingColor));
                        imageView.setImageBitmap(null);
                        imageView.setVisibility(View.GONE);
                        break;

                    case BLUR:
                        overlayView.setBackgroundColor(COLOR_TRANS);
                        imageView.setVisibility(View.VISIBLE);
                        if (pendingBlurBitmap != null) {
                            Blurry.with(activity)
                                    .radius(pendingBlurRadius)
                                    .sampling(2)
                                    .async()
                                    .from(pendingBlurBitmap)
                                    .into(imageView);
                        }
                        break;

                    case IMAGE:
                        overlayView.setBackgroundColor(Color.parseColor(pendingImageBgColor));
                        imageView.setVisibility(View.VISIBLE);
                        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                                (int) Math.round(pendingImageWidth),
                                (int) Math.round(pendingImageHeight));
                        params.gravity = pendingImageAlignment;
                        imageView.setLayoutParams(params);
                        imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
                        Glide.with(activity)
                                .load(pendingImageUrl)
                                .override((int) Math.round(pendingImageWidth), (int) Math.round(pendingImageHeight))
                                .fitCenter()
                                .into(imageView);
                        break;
                }

                overlayView.setVisibility(View.VISIBLE);
                isShowing = true;
                scheduleHide(pendingTimeAfterResume);
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public void showColorPermanent(String hexColor) {
        Activity activity = activityRef != null ? activityRef.get() : null;
        if (activity == null || activity.isFinishing())
            return;

        activity.runOnUiThread(() -> {
            try {
                createOverlayView(activity);
                overlayView.setBackgroundColor(Color.parseColor(hexColor));
                imageView.setImageBitmap(null);
                imageView.setVisibility(View.GONE);
                overlayView.setVisibility(View.VISIBLE);
                isShowing = true;
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    private void scheduleHide(int delayMs) {
        handler.removeCallbacksAndMessages(null);
        handler.postDelayed(this::clearOverlayContent, delayMs);
    }

    private void clearOverlayContent() {
        Activity activity = activityRef != null ? activityRef.get() : null;
        if (activity == null)
            return;

        activity.runOnUiThread(() -> {
            try {
                if (overlayView != null) {
                    overlayView.setBackgroundColor(COLOR_TRANS);
                    overlayView.setVisibility(View.GONE);
                }
                if (imageView != null) {
                    imageView.setImageBitmap(null);
                }
                isShowing = false;
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public void hide() {
        Activity activity = activityRef != null ? activityRef.get() : null;
        if (activity == null)
            return;

        activity.runOnUiThread(() -> {
            try {
                handler.removeCallbacksAndMessages(null);

                if (overlayView != null) {
                    ViewGroup decorView = getDecorView(activity);
                    decorView.removeView(overlayView);
                    overlayView = null;
                    imageView = null;
                    isShowing = false;
                }

                isActivated = false;
                pendingType = OverlayType.NONE;
            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    public void cleanup() {
        Activity activity = activityRef != null ? activityRef.get() : null;
        if (activity != null) {
            activity.runOnUiThread(() -> {
                try {
                    handler.removeCallbacksAndMessages(null);
                    if (overlayView != null) {
                        ViewGroup decorView = getDecorView(activity);
                        decorView.removeView(overlayView);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        }
        overlayView = null;
        imageView = null;
        activityRef = null;
        isShowing = false;
        isActivated = false;
        pendingType = OverlayType.NONE;
        pendingBlurBitmap = null;
    }
}
