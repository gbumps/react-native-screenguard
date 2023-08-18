package com.screenguard.model;

enum ScreenGuardImagePositionEnum {
            TOP_LEFT,
            TOP_CENTER,
            TOP_RIGHT,
            CENTER_LEFT,
            CENTER,
            CENTER_RIGHT,
            BOTTOM_LEFT,
            BOTTOM_CENTER,
            BOTTOM_RIGHT
        }

public class ScreenGuardImagePosition {
        public static ScreenGuardImagePositionEnum getEnumFromNumber(int number) {
            return ScreenGuardImagePositionEnum.values()[number];
        }
    }