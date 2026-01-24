#import "ScreenGuardConstants.h"

// Config Keys
NSString *const kSGConfigEnableCapture = @"enableCapture";
NSString *const kSGConfigEnableRecord = @"enableRecord";
NSString *const kSGConfigEnableMultitask = @"enableContentMultitask";
NSString *const kSGConfigDisplayScreenGuardOverlay = @"displayScreenGuardOverlay";
NSString *const kSGConfigTimeAfterResume = @"timeAfterResume";
NSString *const kSGConfigGetScreenshotPath = @"getScreenshotPath";
NSString *const kSGConfigLimitCaptureEvtCount = @"limitCaptureEvtCount";
NSString *const kSGConfigTrackingLog = @"trackingLog";

// Log Actions
NSString *const kSGActionInit = @"init";
NSString *const kSGActionStateChange = @"state_change";
NSString *const kSGActionScreenshotTaken = @"screenshot_taken";
NSString *const kSGActionRecordingStart = @"recording_start";
NSString *const kSGActionRecordingStop = @"recording_stop";
NSString *const kSGActionRemoveShield = @"remove_shield";

// Events
NSString *const kSGEventScreenGuard = @"onScreenGuardEvt";
NSString *const kSGEventScreenshot = @"onScreenShotCaptured";
NSString *const kSGEventScreenRecording = @"onScreenRecordingCaptured";

// Defaults
NSString *const kSGMethodBlur = @"blur";
NSString *const kSGMethodImage = @"image";
NSString *const kSGMethodColor = @"color";

// User Defaults
NSString *const kSGUserDefaultsConfig = @"com.screenguard";
NSString *const kSGUserDefaultsLogs = @"com.screenguard.logs";

// Errors & Promises
NSString *const kSGErrorDomain = @"ScreenGuard";
NSString *const kSGErrorActivateShield = @"activateShield";
NSString *const kSGErrorActivateShieldBlur = @"activateShieldWithBlurView";
NSString *const kSGErrorActivateShieldImage = @"activateShieldWithImage";
NSString *const kSGErrorDeactivateShield = @"deactivateShield";
NSString *const kSGErrorActivateShieldNoEffect = @"activateShieldWithoutEffect";
NSString *const kSGErrorInvalidParams = @"SG_ERROR_INVALID_PARAMS";
NSString *const kSGErrorNotInitialized = @"SG_ERROR_NOT_INITIALIZED";
