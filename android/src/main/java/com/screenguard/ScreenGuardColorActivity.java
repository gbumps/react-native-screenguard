package com.screenguard;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;

public class ScreenGuardColorActivity extends ReactActivity {

    private String backgroundColor = "#000000";


    private static final int COLOR_TRANS = 0x00000004;

    private final BroadcastReceiver closeReceiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            finish();
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        supportRequestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.activity_screen_guard_color);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE);
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE);
        getWindow().getDecorView().setBackgroundColor(COLOR_TRANS);
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

        getWindow().setStatusBarColor(Color.TRANSPARENT);

        Intent intent = getIntent();

        if (intent != null) {
            String colorHex = intent.getStringExtra("background");
            if (colorHex != null && !colorHex.isEmpty()) {
                backgroundColor = colorHex;
            }
        }
        IntentFilter intentFilter = new IntentFilter("com.screenguard.ScreenGuardColorActivity.close");
        registerReceiver(closeReceiver, intentFilter);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        unregisterReceiver(closeReceiver);
    }

    @Override
    protected void onPause() {
        getWindow().getDecorView().setBackgroundColor(Color.parseColor(backgroundColor));
        super.onPause();
    }

    @Override
    protected void onResume() {
        getWindow().getDecorView().setBackgroundColor(COLOR_TRANS);
        super.onResume();
    }

    @Override
    protected void onStart() {
        getWindow().getDecorView().setBackgroundColor(COLOR_TRANS);
        super.onStart();
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent(Intent.ACTION_MAIN);
        intent.addCategory(Intent.CATEGORY_HOME);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
    }

    @Override
    protected void onStop() {
        getWindow().getDecorView().setBackgroundColor(Color.parseColor(backgroundColor));
        super.onStop();
    }
}