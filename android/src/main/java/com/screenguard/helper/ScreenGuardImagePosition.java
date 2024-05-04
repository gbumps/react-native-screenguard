package com.screenguard.helper;


import com.screenguard.enums.ScreenGuardImagePositionEnum;

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