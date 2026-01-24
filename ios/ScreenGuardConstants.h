#import <Foundation/Foundation.h>

// Config Keys
extern NSString *const kSGConfigEnableCapture;
extern NSString *const kSGConfigEnableRecord;
extern NSString *const kSGConfigEnableMultitask;
extern NSString *const kSGConfigDisplayScreenGuardOverlay;
extern NSString *const kSGConfigTimeAfterResume;
extern NSString *const kSGConfigGetScreenshotPath;
extern NSString *const kSGConfigLimitCaptureEvtCount;
extern NSString *const kSGConfigTrackingLog;

// Log Actions
extern NSString *const kSGActionInit;
extern NSString *const kSGActionStateChange;
extern NSString *const kSGActionScreenshotTaken;
extern NSString *const kSGActionRecordingStart;
extern NSString *const kSGActionRecordingStop;
extern NSString *const kSGActionRemoveShield;

// Events
extern NSString *const kSGEventScreenGuard;
extern NSString *const kSGEventScreenshot;
extern NSString *const kSGEventScreenRecording;

// Defaults
extern NSString *const kSGMethodBlur;
extern NSString *const kSGMethodImage;
extern NSString *const kSGMethodColor;

// User Defaults
extern NSString *const kSGUserDefaultsConfig;
extern NSString *const kSGUserDefaultsLogs;

// Errors & Promises
extern NSString *const kSGErrorDomain;
extern NSString *const kSGErrorActivateShield;
extern NSString *const kSGErrorActivateShieldBlur;
extern NSString *const kSGErrorActivateShieldImage;
extern NSString *const kSGErrorDeactivateShield;
extern NSString *const kSGErrorActivateShieldNoEffect;
extern NSString *const kSGErrorInvalidParams;
extern NSString *const kSGErrorNotInitialized;
