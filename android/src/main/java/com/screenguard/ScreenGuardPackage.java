package com.screenguard;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.screenguard.helper.ScreenGuardClassName;

import java.util.HashMap;
import java.util.Map;

public class ScreenGuardPackage extends BaseReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext context) {
      return switch (name) {
          case ScreenGuardClassName.SCREENGUARD -> new com.screenguard.ScreenGuard(context);
          case ScreenGuardClassName.SG_SCREEN_SHOT -> new com.screenguard.SGScreenshot(context);
          case ScreenGuardClassName.SG_SCREEN_RECORD -> new com.screenguard.SGScreenRecord(context);
          default -> null;
      };
  }

  @NonNull
  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      moduleInfos.put(ScreenGuardClassName.SCREENGUARD, new ReactModuleInfo(
              ScreenGuardClassName.SCREENGUARD,
              ScreenGuardClassName.SCREENGUARD,
              false,  // canOverrideExistingModule
              false,  // needsEagerInit
              false,  // isCxxModule
              true    // isTurboModule
      ));
      moduleInfos.put(ScreenGuardClassName.SG_SCREEN_SHOT, new ReactModuleInfo(
              ScreenGuardClassName.SG_SCREEN_SHOT,
              ScreenGuardClassName.SG_SCREEN_SHOT,
              false,  // canOverrideExistingModule
              false,  // needsEagerInit
              false,  // isCxxModule
              true    // isTurboModule
      ));
      moduleInfos.put(ScreenGuardClassName.SG_SCREEN_RECORD, new ReactModuleInfo(
              ScreenGuardClassName.SG_SCREEN_RECORD,
              ScreenGuardClassName.SG_SCREEN_RECORD,
              false,  // canOverrideExistingModule
              false,  // needsEagerInit
              false,  // isCxxModule
              true    // isTurboModule
      ));
      return moduleInfos;
    };
  }
}
