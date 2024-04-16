package com.screenguard.enums;

import android.view.Gravity;

public enum ScreenGuardImagePositionEnum {
    TOP_LEFT(Gravity.TOP | Gravity.START),
    TOP_CENTER(Gravity.TOP | Gravity.CENTER_HORIZONTAL),
    TOP_RIGHT(Gravity.TOP | Gravity.END),
    CENTER_LEFT(Gravity.CENTER_VERTICAL | Gravity.START),
    CENTER(Gravity.CENTER),
    CENTER_RIGHT(Gravity.CENTER_VERTICAL | Gravity.END),
    BOTTOM_LEFT(Gravity.BOTTOM | Gravity.START),
    BOTTOM_CENTER(Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL),
    BOTTOM_RIGHT(Gravity.BOTTOM | Gravity.END);

    private final int gravity;

    ScreenGuardImagePositionEnum(int gravity) {
        this.gravity = gravity;
    }

    public int getGravity() {
        return gravity;
    }
}