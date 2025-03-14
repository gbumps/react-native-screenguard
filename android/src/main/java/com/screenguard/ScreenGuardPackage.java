package com.screenguard;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.TurboReactPackage;

import java.util.Collections;
import java.util.List;

public class ScreenGuardPackage extends TurboReactPackage {

  @Nullable
  @Override
  public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext context) {
    if (name.equals(ScreenGuardModule.NAME)) {
        return new ScreenGuardModule(context);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
        moduleInfos.put(RateAppModule.NAME, new ReactModuleInfo(
                ScreenGuardModule.NAME,
                ScreenGuardModule.NAME,
                false,  // canOverrideExistingModule
                false,  // needsEagerInit
                false,  // isCxxModule
                true    // isTurboModule
        ));
        return moduleInfos;
      }
    }
  }
}
