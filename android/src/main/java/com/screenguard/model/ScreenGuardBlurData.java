package com.screenguard.model;

import android.os.Parcel;
import android.os.Parcelable;

import com.screenguard.enums.ScreenGuardActionEnum;

public class ScreenGuardBlurData extends ScreenGuardData implements Parcelable {

    public int radius;

    public String bitmapPath;

    public ScreenGuardBlurData(int radius, String bitmapPath, int timeAfterResume) {
        this.action = ScreenGuardActionEnum.blur;
        this.radius = radius;
        this.bitmapPath = bitmapPath;
        this.timeAfterResume = timeAfterResume;
    }

    protected ScreenGuardBlurData(Parcel in) {
        action = ScreenGuardActionEnum.blur;
        radius = in.readInt();
        bitmapPath = in.readString();
        timeAfterResume = in.readInt();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeInt(radius);
        dest.writeString(bitmapPath);
        dest.writeInt(timeAfterResume);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<ScreenGuardBlurData> CREATOR = new Creator<ScreenGuardBlurData>() {
        @Override
        public ScreenGuardBlurData createFromParcel(Parcel in) {
            return new ScreenGuardBlurData(in);
        }

        @Override
        public ScreenGuardBlurData[] newArray(int size) {
            return new ScreenGuardBlurData[size];
        }
    };

    public double getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public String getBitmapPath() {
        return bitmapPath;
    }

    public void setBitmapPath(String bitmapPath) {
        this.bitmapPath = bitmapPath;
    }

    public int getTimeAfterSync() {
        return timeAfterResume;
    }

    public void setTimeAfterSync(int timeAfterSync) {
        this.timeAfterResume = timeAfterResume;
    }
}
