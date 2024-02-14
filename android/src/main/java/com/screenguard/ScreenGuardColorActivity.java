package com.screenguard;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.annotation.NonNull;

import com.bumptech.glide.Glide;
import com.facebook.react.ReactActivity;
import com.screenguard.enums.ScreenGuardActionEnum;
import com.screenguard.model.ScreenGuardBlurData;
import com.screenguard.model.ScreenGuardColorData;
import com.screenguard.model.ScreenGuardImageData;
import com.screenguard.model.ScreenGuardImagePosition;

import java.io.File;

import jp.wasabeef.blurry.Blurry;


public class ScreenGuardColorActivity extends ReactActivity  {

    public static final String SCREENGUARD_COLOR_ACTIVITY_CLOSE = 
            "com.screenguard.ScreenGuardColorActivity.close";

    private ScreenGuardBlurData screenGuardBlurData;

    private ScreenGuardColorData screenGuardColorData;

    private ScreenGuardImageData screenGuardImageData;

    private Bitmap blurredBitmap;

    private ScreenGuardActionEnum currentActionType;

    private static final int COLOR_TRANS = 0x00000004;

    private final BroadcastReceiver closeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            finish();
        }
    };

    @SuppressLint("UnspecifiedRegisterReceiverFlag")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_screen_guard_color);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
        getWindow().setStatusBarColor(Color.TRANSPARENT);

        Intent intent = getIntent();

        if (intent != null) {
            ScreenGuardBlurData dataBlur = intent.getParcelableExtra(ScreenGuardBlurData.class.getName());
            ScreenGuardImageData dataImage = intent.getParcelableExtra(ScreenGuardImageData.class.getName());
            ScreenGuardColorData dataColor = intent.getParcelableExtra(ScreenGuardColorData.class.getName());
            if (dataBlur != null) {
                screenGuardBlurData = dataBlur;
                currentActionType = ScreenGuardActionEnum.blur;
                blurredBitmap = getBitmapFromFile(screenGuardBlurData.bitmapPath);
            } else if (dataColor != null) {
                screenGuardColorData = dataColor;
                currentActionType = ScreenGuardActionEnum.color;
            } else if (dataImage != null) {
                screenGuardImageData = dataImage;
                currentActionType = ScreenGuardActionEnum.image;
            }
        }
        overridePendingTransition(0, 0);
        IntentFilter intentFilter = new IntentFilter(SCREENGUARD_COLOR_ACTIVITY_CLOSE);
        registerReceiver(closeReceiver, intentFilter);
    }


    @Override
    protected void onDestroy() {
        unregisterReceiver(closeReceiver);
        doResumeByAction();
        super.onDestroy();
    }

    @Override
    protected void onPause() {
        doCoverByAction();
        super.onPause();
    }

    @Override
    protected void onResume() {
        doResumeByAction();
        super.onResume();
    }

    @Override
    protected void onStart() {
        doResumeByAction();
        super.onStart();
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onPostResume() {
        super.onPostResume();
    }

    @Override
    public void onBackPressed() {
        doCoverByAction();
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    @Override
    protected void onStop() {
        doCoverByAction();
        super.onStop();
    }

    private Bitmap getBitmapFromFile(String filePath) {
        try {
            File imageFile = new File(filePath);
            if (imageFile.exists()) {
                return BitmapFactory.decodeFile(imageFile.getAbsolutePath());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private void doResumeByAction() {
        FrameLayout frameLayout = findViewById(R.id.frameLayout);
        ImageView imageView = findViewById(R.id.imageView);
        Handler handlerStopBlur = new Handler(Looper.getMainLooper());
        Runnable delayedFunction = () -> imageView.setImageBitmap(null);
        switch (currentActionType) {
            case blur:
                handlerStopBlur.postDelayed(delayedFunction, screenGuardBlurData.timeAfterSync);
                break;
            case image:
                handlerStopBlur.postDelayed(delayedFunction, screenGuardImageData.timeAfterSync);
                frameLayout.setBackgroundColor(COLOR_TRANS);
                break;
            case color:
                frameLayout.setBackgroundColor(COLOR_TRANS);
                break;
        }
    }

    private void doCoverByAction() {
        FrameLayout frameLayout = findViewById(R.id.frameLayout);
        switch (currentActionType) {
            case blur:
                ImageView imageView = findViewById(R.id.imageView);
                if (imageView != null) {
                    Blurry.with(this)
                            .radius(screenGuardBlurData.radius)
                            .sampling(2)
                            .async()
                            .from(blurredBitmap)
                            .into(imageView);
                }
                break;
            case color:
                frameLayout.setBackgroundColor(Color.parseColor(screenGuardColorData.backgroundColor));
                break;
            case image:
                frameLayout.setBackgroundColor(Color.parseColor(screenGuardImageData.backgroundColor));
                ImageView imgView = findViewById(R.id.imageView);
                FrameLayout.LayoutParams layoutParams = (FrameLayout.LayoutParams) imgView.getLayoutParams();
                layoutParams.gravity = ScreenGuardImagePosition.getGravity(screenGuardImageData.position);
                imgView.setLayoutParams(layoutParams);
                Glide.with(this)
                        .load(screenGuardImageData.imageUrl).override(
                                (int) Math.round(screenGuardImageData.width),
                                (int) Math.round(screenGuardImageData.height))
                        .into(imgView);
        }
    }
}