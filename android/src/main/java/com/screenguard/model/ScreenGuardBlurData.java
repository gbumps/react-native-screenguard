package com.screenguard.model;

import android.os.Parcel;
import android.os.Parcelable;

public class ScreenGuardBlurData extends ScreenGuardData implements Parcelable {

    public double radius;

    public String bitmapPath;

    public int timeAfterSync;

    public ScreenGuardBlurData(double radius, String bitmapPath, int timeAfterSync) {
        this.action = ScreenGuardActionEnum.blur;
        this.radius = radius;
        this.bitmapPath = bitmapPath;
        this.timeAfterSync = timeAfterSync;
    }

    protected ScreenGuardBlurData(Parcel in) {
        action = ScreenGuardActionEnum.blur;
        radius = in.readDouble();
        bitmapPath = in.readString();
        timeAfterSync = in.readInt();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeDouble(radius);
        dest.writeString(bitmapPath);
        dest.writeInt(timeAfterSync);
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

    public void setRadius(double radius) {
        this.radius = radius;
    }

    public String getBitmapPath() {
        return bitmapPath;
    }

    public void setBitmapPath(String bitmapPath) {
        this.bitmapPath = bitmapPath;
    }

    public int getTimeAfterSync() {
        return timeAfterSync;
    }

    public void setTimeAfterSync(int timeAfterSync) {
        this.timeAfterSync = timeAfterSync;
    }
}
