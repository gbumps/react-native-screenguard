package com.screenguard.model;

import com.screenguard.enums.ScreenGuardActionEnum;

abstract class ScreenGuardData {
    public String backgroundColor;
    public int timeAfterResume;
    public ScreenGuardActionEnum action;
}

