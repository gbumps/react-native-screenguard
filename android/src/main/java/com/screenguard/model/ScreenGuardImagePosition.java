package com.screenguard.model;

import android.view.Gravity;

enum ScreenGuardImagePositionEnum {
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

public class ScreenGuardImagePosition {
        public static ScreenGuardImagePositionEnum getEnumFromNumber(int number) {
            return ScreenGuardImagePositionEnum.values()[number];
        }

        public static int getNumberIndexFromEnum(ScreenGuardImagePositionEnum target) {
            int index = 0;
            ScreenGuardImagePositionEnum[] values = ScreenGuardImagePositionEnum.values();
            for (int i = 0; i < values.length; i++) {
                if (values[i] == target) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        public static int getGravity(ScreenGuardImagePositionEnum en) {
            return en.getGravity();
        }
    }