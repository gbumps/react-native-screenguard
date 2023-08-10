package com.screenguard;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.RootView;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Calendar;
import java.util.Objects;

@ReactModule(name = ScreenGuardModule.NAME)
public class ScreenGuardModule extends ReactContextBaseJavaModule {

    public static final String NAME = "ScreenGuard";

    private static final String PREFS_NAME = "MyPrefs";
    private static final String BITMAP_PATH_KEY = "bitmapPath";

    private static RootView rootView;
    private static Handler mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());

    private ReactApplicationContext currentReactContext;
    private ScreenGuard mScreenGuard;

    public ScreenGuardModule(ReactApplicationContext reactContext) {
      super(reactContext);
      currentReactContext = reactContext;
    }

    @Override
    @NonNull
    public String getName() {
      return NAME;
    }

    @ReactMethod
    public void listenEvent() {
        if (mScreenGuard == null) {
            mScreenGuard = new ScreenGuard(
                    currentReactContext,
                    (url) -> currentReactContext.getJSModule(
                            DeviceEventManagerModule.RCTDeviceEventEmitter.class
                    ).emit("onSnapper", url)
            );
        }
        mScreenGuard.register();
    }

    @ReactMethod
    public void removeEvent() {
        if (mScreenGuard != null) {
            mScreenGuard.unregister();
            mScreenGuard = null;
        }
    }

    @ReactMethod
    public void activateShield(String hexColor) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()
            ).getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE, 
                    WindowManager.LayoutParams.FLAG_SECURE
            ));
            Intent intent = new Intent(
                currentReactContext.getCurrentActivity(), 
                ScreenGuardColorActivity.class
            );
            intent.putExtra("background", hexColor);
            intent.putExtra("actionType", ScreenGuardActionEnum.color.toString());
            intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            Objects.requireNonNull(
                     currentReactContext.getCurrentActivity()).startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void activateShieldWithBlurView(double radius) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            final Activity activity = getCurrentActivity();
            if (activity == null) {
                return;
            }
            final View currentView =
                    getCurrentActivity().getWindow().getDecorView().getRootView();
            currentView.setDrawingCacheEnabled(true);
            Bitmap bitmap = captureReactView(currentView);
            String localPath = saveBitmapToFile(bitmap);
            Intent intent = new Intent(
                currentReactContext.getCurrentActivity(),
                    ScreenGuardColorActivity.class
                );
            intent.putExtra("radius", radius);
            intent.putExtra("imagePath", localPath);
            intent.putExtra("actionType", ScreenGuardActionEnum.blur.toString());
            Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()).startActivity(intent);
            if (mHandlerBlockScreenShot != null) {
                mHandlerBlockScreenShot.post(() ->
                        Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()
            ).getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE,
                    WindowManager.LayoutParams.FLAG_SECURE
            ));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @ReactMethod
    public void activateShieldWithImage(ReadableMap data) {
        try {
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
            Intent intent = new Intent(
                currentReactContext.getCurrentActivity(),
                ScreenGuardColorActivity.class
            );

            String uriImage = data.getString("uri");
            String backgroundColor = data.getString("background");
            double width = data.getDouble("width");
            double height = data.getDouble("height");
            int alignment = data.getInt("alignment");

            intent.setFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            intent.putExtra("uri", uriImage);
            intent.putExtra("background", backgroundColor);

            Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()).startActivity(intent);
            mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                    currentReactContext.getCurrentActivity()
            ).getWindow().setFlags(
                    WindowManager.LayoutParams.FLAG_SECURE,
                    WindowManager.LayoutParams.FLAG_SECURE
            ));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String saveBitmapToFile(Bitmap bitmap) {
        try {
            File imagePath = new File(getReactApplicationContext().getCacheDir(), "bitmap_images");
            if (!imagePath.exists()) {
                imagePath.mkdirs();
            }
            Calendar calendar = Calendar.getInstance();
            long time = calendar.getTimeInMillis();

            File imageFile = new File(imagePath, "bitmap_" + time + ".png");

            FileOutputStream fos = new FileOutputStream(imageFile);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, fos);
            fos.flush();
            fos.close();

            return imageFile.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @ReactMethod
    public void activateWithoutShield() {
        try {
            deactivateShield();
            if (mHandlerBlockScreenShot == null) {
                mHandlerBlockScreenShot = new Handler(Looper.getMainLooper());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @ReactMethod
    public void deactivateShield() {
        try {
            currentReactContext.sendBroadcast(
                    new Intent("com.screenguard.ScreenGuardColorActivity.close")
            );
            Handler handler = new Handler();
            Runnable delayedFunction = () -> {
                if (mHandlerBlockScreenShot != null) {
                    mHandlerBlockScreenShot.post(() -> Objects.requireNonNull(
                            currentReactContext.getCurrentActivity()
                    ).getWindow().clearFlags(WindowManager.LayoutParams.FLAG_SECURE));
                    mHandlerBlockScreenShot = null;
                }
            };
            handler.postDelayed(delayedFunction, 500);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private Bitmap captureReactView(View view) {
        Bitmap bitmap = Bitmap.createBitmap(view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);
        view.draw(canvas);
        return bitmap;
    }

    private Bitmap getBitmapFromView(View view) {
        view.setDrawingCacheEnabled(true);
        view.buildDrawingCache();
        Bitmap bitmap = Bitmap.createBitmap(view.getDrawingCache());
        view.setDrawingCacheEnabled(false);
        return bitmap;
    }
}
