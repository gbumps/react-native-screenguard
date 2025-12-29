package com.screenguard.helper;

public class ScreenGuardConstants {
    public static final String PREFS_NAME = "com.screenguard.prefs";
    public static final String PREF_LOGS = "screenguard_logs";

    // Config Keys
    public static final String ENABLE_CAPTURE = "enableCapture";
    public static final String ENABLE_RECORD = "enableRecord";
    public static final String GET_SCREENSHOT_PATH = "getScreenshotPath";
    public static final String LIMIT_CAPTURE_EVT_COUNT = "limitCaptureEvtCount";
    public static final String DISPLAY_SCREENGUARD_OVERLAY = "displayScreenGuardOverlay";
    public static final String TIME_AFTER_RESUME = "timeAfterResume";
    public static final String ALLOW_BACKPRESS = "allowBackpress";
    public static final String TRACKING_LOG = "trackingLog";
    public static final String RADIUS = "radius";
    public static final String SOURCE = "source";
    public static final String URI = "uri";
    public static final String WIDTH = "width";
    public static final String HEIGHT = "height";
    public static final String ALIGNMENT = "alignment";
    public static final String TOP = "top";
    public static final String LEFT = "left";
    public static final String BOTTOM = "bottom";
    public static final String RIGHT = "right";
    public static final String BACKGROUND_COLOR = "backgroundColor";

    // Event Payload Keys
    public static final String IS_RECORDING = "isRecording";
    public static final String IS_PROTECTED = "isProtected";
    public static final String METHOD = "method";
    public static final String ACTION = "action";
    public static final String TIMESTAMP = "timestamp";

    // Log Actions
    public static final String ACTION_INIT = "init";
    public static final String ACTION_RECORDING_START = "recording_start";
    public static final String ACTION_RECORDING_STOP = "recording_stop";
    public static final String ACTION_SCREENSHOT_TAKEN = "screenshot_taken";
    public static final String ACTION_ACTIVATE_BLUR = "activate_blur";
    public static final String ACTION_ACTIVATE_IMAGE = "activate_image";
    public static final String ACTION_ACTIVATE_SHIELD = "activate_shield";
    public static final String ACTION_ACTIVATE_NO_EFFECT = "activate_no_effect";
    public static final String ACTION_DEACTIVATE = "deactivate";

    // Messages
    public static final String MSG_RECORDING_BLOCKED = "Screen recording is blocked";
    public static final String MSG_SCREENSHOT_BLOCKED = "Screenshot is blocked";
    public static final String ERR_GET_LOGS = "GET_LOGS_ERROR";
    public static final String ERR_CURRENT_ACTIVITY_NULL = "Current Activity is null!";

    // File Data Keys
    public static final String TYPE = "type";
    public static final String NAME = "name";
    public static final String PATH = "path";
}
