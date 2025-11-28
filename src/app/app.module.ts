import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import * as ace from "ace-builds"

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ExplorerComponent } from './base/explorer/explorer.component';
import { ViewportComponent } from './base/viewport/viewport.component';


import { fas } from '@fortawesome/pro-solid-svg-icons';
import { fal, faPlus } from '@fortawesome/pro-light-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';
import {faPython, faJsSquare, faJava, faAndroid, faApple, faUsb, faLinux} from '@fortawesome/free-brands-svg-icons';

import { TerminalComponent } from './base/terminal/terminal.component';
import { ExplorerFileComponent } from './components/file/explorer-file/explorer-file.component';
import { ExplorerCodeComponent } from './components/code/explorer-code/explorer-code.component';
import {ExplorerDirective} from "./base/explorer/explorer.directive";
import { ExplorerHooksComponent } from './components/hooks/explorer-hooks/explorer-hooks.component';
import {HttpClientModule} from "@angular/common/http";
import {ExpandableDirective} from "./base/expandable-list/expandable.directive";
import { ViewportCodeComponent } from './components/code/viewport-code/viewport-code.component';
import { ViewportMainComponent } from './viewport-main/viewport-main.component';
import {ControllerService} from "./controller.service";
import {ViewportDirective} from "./base/viewport/viewport.directive";
import { TerminalWorkspaceComponent } from './components/workspace/terminal-workspace/terminal-workspace.component';
import {TerminalDirective} from "./base/terminal/terminal.directive";
import { TerminalExecComponent } from './components/workspace/terminal-exec/terminal-exec.component';
import {SettingsService} from "./components/settings/ctrl/settings.service";
import {TerminalHelperComponent} from "./components/helper/terminal-helper/terminal-helper.component";
import {ReactiveFormsModule} from "@angular/forms";
import { ViewportHookComponent } from './components/hooks/viewport-hooks/viewport-hook.component';
import {TerminalHookComponent} from "./components/hooks/terminal-hooks/terminal-hook.component";
import {ViewportHookJavaComponent} from "./components/hooks/viewport-hooks/viewport-hook-javahook.component";
import { ViewportInspectorComponent } from './components/inspector/viewport-inspector/viewport-inspector.component';
import {BreadcrumbComponent, BreadcrumbItemComponent} from './base/breadcrumb/breadcrumb.component';
import {NgTerminalModule} from "ng-terminal";
import { XtermComponent } from './base/xterm/xterm.component';
import { StatebarComponent } from './base/statebar/statebar.component';
import {CoreModule} from "./core/core.module";
import {DxcClientModule} from "./dxc-client/dxc-client.module";
import {SplashComponent} from "./components/project/splash.component";
import {StageComponent} from "./components/stage/stage.component";
import {DxcBaseModule} from "./base/dxc-base.module";
import {ExplorerDeviceComponent} from "./components/device/explorer-device/explorer-device.component";
import {ModalDmComponent} from "./components/device/modal-dm/modal-dm.component";
import {TerminalOutputComponent} from "./components/output/terminal-output/terminal-output.component";
import {ProjectMgtComponent} from "./components/project/project-mgt.component";
import {NewProjectComponent} from "./components/project/new-project.component";
import {OpenProjectComponent} from "./components/project/open-project.component";
import {ViewportSplashComponent} from "./components/project/viewport-project/viewport-splash.component";
import {ModalActiveProjectComponent} from "./components/project/modals/active-project.component";
import {ModalNewProjectComponent} from "./components/project/modal-new-project/modal-new-project.component";
import {ModalOpenProjectComponent} from "./components/project/modal-open-project/modal-open-project.component";
import {ViewportCodeFieldComponent} from "./components/code/viewport-code/viewport-code-field.component";
import {BookmarkButtonComponent} from "./components/bookmark/bookmarkbtn.component";
import {ViewportEditorComponent} from "./components/viewer/vp-editor/viewport-editor.component";
import {IntentPatternComponent} from "./components/topology/ctrl/IntentPattern.component";
import {ViewportNativeComponent} from "./components/native/vp-viewer/viewport-native.component";
import {ViewportNativeMainComponent} from "./components/native/vp-viewer/viewport-native-main.component";
import {DxcInputValidationDirective} from "./components/project/ctrl/project.directive";
import {ModalAlertComponent} from "./components/output/modal-alert/modal-alert.component";
import {ModalProjectSettingsComponent} from "./components/project/modal-project-settings/modal-project-settings.component";
import {ModalGlobalSettingsComponent} from "./components/settings/modal-gsettings/modal-gsettings.component";
import {ModalPasswdAuthComponent} from "./components/auth/modal-login/modal-passwd-auth.component";
import {ModalProjectAnalConfigComponent} from "./components/project/modal-project-anal-config/modal-project-anal-config.component";
import {ModalHookJavaNewComponent} from "./components/hooks/modal-hook-java-new/modal-hook-java-new.component";
import {ModalHookKeypointNewComponent} from "./components/hooks/modal-hook-keypoint-new/modal-hook-keypoint-new.component";
import {ModalSelectKpComponent} from "./components/hooks/modal-select-kp/modal-select-kp.component";
import {ModalInterruptorSettingsComponent} from "./components/hooks/modal-interruptor-settings/modal-interruptor-settings.component";
import {ModalNewFragmentComponent} from "./components/hooks/modal-new-fragment/modal-new-fragment.component";
import {ViewportHookScriptComponent} from "./components/hooks/viewport-hooks/viewport-hook-script.component";
import {ModalNewSettingComponent} from "./components/settings/modal-new-setting/modal-new-setting.component";
import {ViewportHookKpComponent} from "./components/hooks/viewport-hooks/viewport-hook-kp.component";
import {RefComponent} from "./base/ref/ref.component";
import {ViewportProjectDashboardComponent} from "./components/project/viewport-dashboard/viewport-dashboard.component";
import {ModalLogoutComponent} from "./components/auth/modal-logout/modal-logout.component";
import {ViewportPrivacyDashboardComponent} from "./components/privacy/viewport-privacy/viewport-privacy.component";
import {TargetOsListComponent} from "./components/device/target-list.component";
import {VirtualDeviceSettingsComponent} from "./components/device/virtual-device.component";
import {PlatformListComponent} from "./components/device/platform-list.component";
import {ButtonRefreshComponent} from "./base/button/btn-refresh.component";
import {DeviceListComponent} from "./components/device/device-list.component";
import {ViewportAuditComponent} from "./components/audit/viewport-audit/viewport-audit.component";
import {CodeEditorModule} from "./components/code-editor/code-editor.module";
import {MenuComponent} from "./base/menu/menu.component";
import {ModalSelectHookComponent} from "./components/hooks/modal-select-hook/modal-select-hook.component";
import { CommonModule} from "@angular/common";
import {ExplorerTagComponent} from "./components/tag/explorer-tag/explorer-tag.component";
import {TagBadgeComponent} from "./components/tag/tag-badge/tag-badge.component";
import {ModalTagEditorComponent} from "./components/tag/tag-editor/modal-tag-editor.component";
import {ModalTagInfoComponent} from "./components/tag/tag-info/modal-tag-info.component";
import {ProjectModule} from "./components/project/project.module";
import {TagListComponent} from "./components/tag/tag-list/tag-list.component";
import {XrefListComponent} from "./components/code/xref-list/xref-list.component";
import {XrefItemComponent} from "./components/code/xref-item/xref-item.component";
import {NodeAliasComponent} from "./components/code/node-alias/node-alias.component";
import {HookStatusComponent} from "./components/hooks/hook-status/hook-status.component";
import {HookFragItemComponent} from "./components/hooks/frag-item/frag-item.component";
import {ViewportEventsComponent} from "./components/events/viewport-events/viewport-events.component";
import {DeviceModule} from "./components/device/device.module";
import {
  OsApiProjectionListComponent
} from "./components/topology/osapi-projection-list/osapi-projection-list.component";
import {CodeEmulatorComponent} from "./components/code/emulator/emulator.component";
import {ViewportResolver} from "./base/ViewportResolver";
import {CodeModule} from "./components/code/code.module";
import {DxcDropdownComponent} from "./base/common/dropdown";
import {ModalBaseComponent} from "./base/modal-base/modal-base.component";
import {ModalProgressComponent} from "./base/modal-progress/modal-progress.component";
import {ViewportSplittedComponent} from "./base/viewport-splitted/viewport-splitted.component";
import {MetaComponent} from "./base/meta/meta.component";
import {IconComponent} from "./base/icon/icon.component";
import {AuditModule} from "./components/audit/audit.module";
import {SearchModule} from "./components/search/search.module";
import {ExplorerNavbarComponent} from "./base/explorer-navbar/explorer-navbar.component";
import {ProjectStatusComponent} from "./components/project/project-loaded.component";
import {TopologyModule} from "./components/topology/topo.module";
import {NativeModule} from "./components/native/native.module";
import {ViewportNativeFuncComponent} from "./components/native/vp-viewer/viewport-native-func.component";


// AoT requires an exported function for factories
/*export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}*/


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    // base component
    AppComponent,
    StageComponent,


    NavbarComponent,
    ExplorerComponent,
    ViewportComponent,
    TerminalComponent,
    ExplorerFileComponent,

    MenuComponent,

    RefComponent,

    // project module component
    SplashComponent,
    ProjectMgtComponent,
    NewProjectComponent,
    OpenProjectComponent,
    ViewportSplashComponent,
    ViewportProjectDashboardComponent,
    ModalActiveProjectComponent,
    ModalNewProjectComponent,
    ModalOpenProjectComponent,
    ModalProjectSettingsComponent,
    ModalProjectAnalConfigComponent,
    ModalLogoutComponent,

    CodeEmulatorComponent,


    ExplorerDirective,
    ViewportDirective,

    ViewportMainComponent,

    TerminalWorkspaceComponent,
    TerminalOutputComponent,
    TerminalDirective,
    TerminalExecComponent,
    TerminalHelperComponent,

    ExplorerHooksComponent,
    ViewportHookComponent,
    ViewportHookJavaComponent,
    ViewportHookScriptComponent,
    ViewportHookKpComponent,
    TerminalHookComponent,
    ModalHookJavaNewComponent,
    ModalHookKeypointNewComponent,
    ModalSelectKpComponent,
    ModalInterruptorSettingsComponent,
    ModalNewFragmentComponent,
    ModalSelectHookComponent,

    ViewportInspectorComponent,

    BreadcrumbComponent,
    BreadcrumbItemComponent,
    ButtonRefreshComponent,
    XtermComponent,
    StatebarComponent,

    // Device
    ExplorerDeviceComponent,
    TargetOsListComponent,
    PlatformListComponent,
    DeviceListComponent,
    VirtualDeviceSettingsComponent,
    ModalDmComponent,

    IntentPatternComponent,

    ViewportNativeMainComponent,
      ViewportNativeFuncComponent,
    ViewportNativeComponent,

    BookmarkButtonComponent,

    ViewportEditorComponent,
    DxcInputValidationDirective,

    // generic alert
    ModalAlertComponent,

    // global settings
    ModalGlobalSettingsComponent,
    ModalNewSettingComponent,

    ModalPasswdAuthComponent,

    // privacy
    ViewportPrivacyDashboardComponent,

    // audit
    ViewportAuditComponent,

    ExplorerTagComponent,
    ModalTagEditorComponent,
    ModalTagInfoComponent,
    TagListComponent,

    XrefListComponent,
    XrefItemComponent,

    HookStatusComponent,
    HookFragItemComponent,

    ViewportEventsComponent,

  ],
    imports: [
        DxcBaseModule,
        AppRoutingModule,
        CommonModule,
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        FontAwesomeModule,
        NgbModule,
        CodeEditorModule,
        ReactiveFormsModule,
        NgTerminalModule,
        DxcClientModule,


        ProjectModule,
        DeviceModule,
        CodeModule,
        AuditModule,
        SearchModule,
        TopologyModule,

        DxcDropdownComponent,

        //AssuranceModelInfoCardComponent,

        ModalBaseComponent,
        ModalProgressComponent,
        //ProjectManagementModule

        ViewportSplittedComponent,

        MetaComponent,
        IconComponent,
        TagBadgeComponent,
        ExplorerNavbarComponent,
        NodeAliasComponent,
        ProjectStatusComponent,

        ExpandableDirective,
        NativeModule,
    ],
  providers: [
    ControllerService,
    SettingsService,
    ViewportResolver
  ],
    exports: [
        NavbarComponent,
        DxcInputValidationDirective,
        ViewportNativeComponent,
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor( library:FaIconLibrary) {
    library.addIconPacks(fas, fad, fal);
    library.addIcons(
      // Brands
      faPython as any, faJava as any, faJsSquare as any, faAndroid as any, faApple as any, faUsb as any, faLinux as any,
      // Light
      faPlus
    );


    //console.log(ace.config.get('basePath'));
    console.log('Setting basePath ...',ace.config);
    //ace.config.set('basePath','//localhost:4200/assets/ace');
    ace.config.set('basePath','assets/ace');
    /*console.log('Setting modePath ...');
    ace.config.set('modePath','');
    console.log('Setting themePath ...');
    ace.config.set('themePath','');
    console.log('Init ...');*/
  }

}
