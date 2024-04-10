package com.screenguard.helper;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;

import java.io.File;
import java.io.FileOutputStream;
import java.util.Calendar;

public class ScreenGuardHelper {
    public static String saveBitmapToFile(ReactApplicationContext context, Bitmap bitmap) {
        try {
            File imagePath = new File(
                    context.getCacheDir(), "save_bitmap_images");
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

    public static Bitmap captureReactView(View view) {
        Bitmap bitmap = Bitmap.createBitmap(
                view.getWidth(), view.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        view.draw(canvas);
        return bitmap;
    }

}
