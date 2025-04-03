package com.screenguard;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class ScreenGuardPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext context) {
    if (name.equals(ScreenGuardModule.NAME)) {
        return new com.screenguard.ScreenGuard(context);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return () -> {
      Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
      moduleInfos.put(ScreenGuardModule.NAME, new ReactModuleInfo(
              ScreenGuardModule.NAME,
              ScreenGuardModule.NAME,
              false,  // canOverrideExistingModule
              false,  // needsEagerInit
              false,  // isCxxModule
              true    // isTurboModule
      ));
      return moduleInfos;
    };
  }
}
