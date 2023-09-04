package com.screenguard.model;

import android.os.Parcel;
import android.os.Parcelable;

import androidx.annotation.NonNull;

import com.screenguard.enums.ScreenGuardActionEnum;
import com.screenguard.enums.ScreenGuardImagePositionEnum;

public class ScreenGuardImageData extends ScreenGuardData implements Parcelable {

    public double width;

    public double height;

    public String imageUrl;

    public ScreenGuardImagePositionEnum position;

    public int timeAfterSync;

    public ScreenGuardImageData(
            String backgroundColor,
            String imageUrl,
            double width,
            double height,
            int alignmentIndex,
            int timeAfterSync
    ) {
        this.width = width;
        this.height = height;
        this.backgroundColor = backgroundColor;
        this.imageUrl = imageUrl;
        this.position = ScreenGuardImagePosition.getEnumFromNumber(alignmentIndex);
        this.timeAfterSync = timeAfterSync;
        this.action = ScreenGuardActionEnum.image;
    }

    protected ScreenGuardImageData(Parcel in) {
        this.width = in.readDouble();
        this.height = in.readDouble();
        this.backgroundColor = in.readString();
        this.imageUrl = in.readString();
        this.position = ScreenGuardImagePosition.getEnumFromNumber(in.readInt());
        this.action = ScreenGuardActionEnum.image;
    }

    public static final Creator<ScreenGuardImageData> CREATOR = new Creator<ScreenGuardImageData>() {
        @Override
        public ScreenGuardImageData createFromParcel(Parcel in) {
            return new ScreenGuardImageData(in);
        }

        @Override
        public ScreenGuardImageData[] newArray(int size) {
            return new ScreenGuardImageData[size];
        }
    };

    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(@NonNull Parcel parcel, int i) {
        int pos = 0;
        for (int idx = 0; idx < ScreenGuardImagePositionEnum.values().length; idx++) {
            if (position == ScreenGuardImagePosition.getEnumFromNumber(idx)) {
                pos = idx;
                break;
            }
        }
        parcel.writeDouble(width);
        parcel.writeDouble(height);
        parcel.writeString(backgroundColor);
        parcel.writeString(imageUrl);
        parcel.writeInt(pos);
        parcel.writeInt(timeAfterSync);
    }
}
