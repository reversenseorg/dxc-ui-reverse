/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Injectable} from "@angular/core";
import {CodeController} from "./components/code/ctrl/CodeController";
import {IController} from "./base/controllers/IController.interface";
import {FileController} from "./components/file/ctrl/FileController";
import {HookController} from "./components/hooks/ctrl/HookController";
import {ExplorerCodeComponent} from "./components/code/explorer-code/explorer-code.component";
import {ViewportCodeComponent} from "./components/code/viewport-code/viewport-code.component";
import {ExplorerFileComponent} from "./components/file/explorer-file/explorer-file.component";
import {ExplorerHooksComponent} from "./components/hooks/explorer-hooks/explorer-hooks.component";
import {CodeControllerService} from "./components/code/ctrl/code-controller.service";
import {WorkspaceController} from "./components/workspace/ctrl/WorkspaceController";
import {TerminalWorkspaceComponent} from "./components/workspace/terminal-workspace/terminal-workspace.component";
import {TerminalExecComponent} from "./components/workspace/terminal-exec/terminal-exec.component";
import {HelperController} from "./components/helper/ctrl/HelperController";
import {TerminalHelperComponent} from "./components/helper/terminal-helper/terminal-helper.component";
import {HelperService} from "./components/helper/ctrl/HelperService";
import {HookService} from "./components/hooks/ctrl/hook.service";
import {ViewportHookComponent} from "./components/hooks/viewport-hooks/viewport-hook.component";
import {TerminalHookComponent} from "./components/hooks/terminal-hooks/terminal-hook.component";
import {InspectorController} from "./components/inspector/ctrl/InspectorController";
import {ViewportInspectorComponent} from "./components/inspector/viewport-inspector/viewport-inspector.component";
import {InspectorService} from "./components/inspector/ctrl/inspector.service";
import {WorkspaceService} from "./components/workspace/ctrl/workspace.service";
import {SplashController} from "./components/project/ctrl/SplashController";
import {ProjectService} from "./components/project/ctrl/project.service";
import {ViewportSplashComponent} from "./components/project/viewport-project/viewport-splash.component";
import {AppMenuService} from "./base/appmenu/app-menu.service";
import {DeviceManagerService} from "./components/device/ctrl/device-manager.service";
import {DeviceController} from "./components/device/ctrl/DeviceController";
import {ExplorerDeviceComponent} from "./components/device/explorer-device/explorer-device.component";
import {ModalDmComponent} from "./components/device/modal-dm/modal-dm.component";
import {TerminalOutputComponent} from "./components/output/terminal-output/terminal-output.component";
import {OutputController} from "./components/output/ctrl/OutputController";
import {OutputService} from "./components/output/ctrl/output.service";
import {SearchService} from "./components/search/ctrl/search.service";
import {SearchController} from "./components/search/ctrl/SearchController";
import {ModalSearchComponent} from "./components/search/modal-search/modal-search.component";
import {TerminalSearchComponent} from "./components/search/terminal-search/terminal-search.component";
import {FilesystemService} from "./components/file/ctrl/FilesystemService";
import {TopologyController} from "./components/topology/ctrl/TopologyController";
import {TopologyService} from "./components/topology/ctrl/topology.service";
import {ExplorerTopoComponent} from "./components/topology/explorer-topo/explorer-topo.component";
import {ViewerController} from "./components/viewer/ctrl/ViewerController";
import {ViewportEditorComponent} from "./components/viewer/vp-editor/viewport-editor.component";
import {ViewerService} from "./components/viewer/ctrl/viewer.service";
import {NativeService} from "./components/native/ctrl/native.service";
import {NativeController} from "./components/native/ctrl/NativeController";
import {ViewportNativeMainComponent} from "./components/native/vp-viewer/viewport-native-main.component";
import {DeobfuscationService} from "./components/deobfuscation/ctrl/deobfuscation.service";
import {DeobfuscationController} from "./components/deobfuscation/ctrl/DeobfuscationController";
import {TagController} from "./components/tag/ctrl/TagController";
import {TagService} from "./components/tag/ctrl/tag.service";
import {PlatformController} from "./components/platform/ctrl/PlatformController";
import {PlatformService} from "./components/platform/ctrl/platform.service";
import {StageComponent} from "./components/stage/stage.component";
import {TeamService} from "./components/team/ctrl/team.service";
import {AuthService} from "./components/auth/ctrl/auth.service";
import {AuthController} from "./components/auth/ctrl/AuthController";
import {TeamController} from "./components/team/ctrl/TeamController";
import {ViewportDeviceComponent} from "./components/device/viewport-device/viewport-device.component";
import {ViewportProjectDashboardComponent} from "./components/project/viewport-dashboard/viewport-dashboard.component";
import {ProjectController} from "./components/project/ctrl/ProjectController";
import {PrivacyController} from "./components/privacy/ctrl/PrivacyController";
import {PrivacyService} from "./components/privacy/ctrl/privacy.service";
import {AuditService} from "./components/audit/ctrl/audit.service";
import {AuditController} from "./components/audit/ctrl/AuditController";
import {ExplorerAuditComponent} from "./components/audit/explorer-audit/explorer-audit.component";
import {ViewportAuditComponent} from "./components/audit/viewport-audit/viewport-audit.component";
import {Nullable} from "./base/Nullable";
import {UIException} from "./base/error/UIException";
import {ViewportTopoActivityComponent} from "./components/topology/viewport-topo/viewport-topo-activity.component";
import {ViewportTopoReceiverComponent} from "./components/topology/viewport-topo/viewport-topo-receiver.component";
import {ViewportTopoProviderComponent} from "./components/topology/viewport-topo/viewport-topo-provider.component";
import {ViewportTopoServiceComponent} from "./components/topology/viewport-topo/viewport-topo-service.component";
import {ExplorerTagComponent} from "./components/tag/explorer-tag/explorer-tag.component";
import {ModalTagEditorComponent} from "./components/tag/tag-editor/modal-tag-editor.component";
import {ModalTagInfoComponent} from "./components/tag/tag-info/modal-tag-info.component";
import {TerminalAuditComponent} from "./components/audit/terminal-audit/terminal-audit.component";
import {RuntimeEventController} from "./components/events/ctrl/RuntimeEventController";
import {RuntimeEventsService} from "./components/events/ctrl/events.service";
import {ViewportEventsComponent} from "./components/events/viewport-events/viewport-events.component";
import {ModalSendIntentComponent} from "./components/topology/modal-intent/modal-send-intent.component";
import {ModalEditRuleComponent} from "./components/audit/modal-edit-rule/modal-edit-rule.component";
import {ViewportComponent} from "./base/viewport/viewport.component";
import {IViewportContainer} from "./base/viewport/IViewportContainer";
import {ViewportNativeFuncComponent} from "./components/native/vp-viewer/viewport-native-func.component";
import {FuzzerController} from "./components/fuzzer/ctrl/FuzzerController";
import {ViewportFuzzerComponent} from "./components/fuzzer/viewport-fuzzer/viewport-fuzzer.component";
import {FuzzerService} from "./components/fuzzer/ctrl/fuzzer.service";
import {ViewportTopoCmpComponent} from "./components/topology/viewport-topo/viewport-topo-cmp.component";


interface StageSet {
  [name:string] :StageComponent;
}


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  vp:ViewportComponent;
  /**
   * Keeo a ref to active viewport container
   */
  activeCtn:Nullable<IViewportContainer> = null;

  helper: Nullable<HelperController> = null;

  all:IController[] = [];
  private _s:StageSet = {};

  constructor(
    private appmenuService:AppMenuService,
    private codeCtrlService: CodeControllerService,
    private hookService: HookService,
    private eventsSvc:RuntimeEventsService,
    private inspectorSvc: InspectorService,
    private wsSvc: WorkspaceService,
    private helperService: HelperService,
    private projectService: ProjectService,
    private dmService: DeviceManagerService,
    private outSvc: OutputService,
    private searchSvc: SearchService,
    private fsSvc:FilesystemService,
    private topoSvc:TopologyService,
    private viewerSvc: ViewerService,
    private nativeSvc: NativeService,
    private tagSvc: TagService,
    private fuzzSvc: FuzzerService,
    private pltfSvc: PlatformService,
    private deobfSvc: DeobfuscationService,
    private authSvc: AuthService,
    private auditSvc: AuditService,
    private privSvc: PrivacyService,
    private teamSvc: TeamService) {


    console.log("Before menu rendered");
    this.appmenuService.render();
    console.log("Menu rendered");
  }


  setActiveTab(pVp:Nullable<IViewportContainer>):void {
    this.activeCtn = pVp;
  }

  getActiveTab():Nullable<IViewportContainer> {
    return this.activeCtn ;
  }

  setViewport(pVp:ViewportComponent):void {
    this.vp = pVp;
  }

  getViewport():ViewportComponent {
    return this.vp;
  }

  addStage(pName:string, pApp:StageComponent):void {
    this._s[pName] = pApp;
  }

  getStage(pName:string):StageComponent {
    return this._s[pName];
  }

  getHelper(): HelperController {
    if(this.helper==null){
      throw UIException.CONTROLLER_NOT_READY("helper");
    }
    return this.helper;
  }


  getController<T>(pName:string):Nullable<T> {
      return this.all.find(x=>{
          return x.name == pName;
      }) as Nullable<T>;
  }
  /**
   *
   */
  hookBeforeControllersInit():void {

  }

  /**
   * Hook after
   * @param pControllers
   */
  hookAfterControllersInit(pControllers:IController[]):void {
      this.all = pControllers;
      this.appmenuService.render();
  }


  /**
   * !! IMPORTANT !!
   * ----------------
   * This is the place where every controller/service/app menus are initialized
   *
   *
   * @return {IController[]} All controllers
   * @method
   */
  getControllers(): IController[] {

    this.helper = new HelperController({
      service: this.helperService,
      terminalCmp: {
        main: TerminalHelperComponent,
      }
    });

    this.hookBeforeControllersInit();

    const ctrls = [
      new OutputController({
        service: this.outSvc,
        terminalCmp: {
          main: TerminalOutputComponent,
        }
      }),
      new WorkspaceController({
        service: this.wsSvc,
        terminalCmp: {
          term: TerminalWorkspaceComponent,
          exec: TerminalExecComponent
        }
      }),
      this.helper,
      new CodeController({
        service: this.codeCtrlService,
        explorerCmp: {
          main: ExplorerCodeComponent
        },
        viewCmp: {
          main: ViewportCodeComponent
        },
        modalCmp: {
//          rename: RenameModalCodeComponent
        }
      }),
      new FileController({
        service: this.fsSvc,
        explorerCmp: {
          main: ExplorerFileComponent
        }
      }),
      new InspectorController({
        service: this.inspectorSvc,
        viewCmp: {
          main: ViewportInspectorComponent
        }
      }),
      new HookController({
        service: this.hookService,
        explorerCmp: {
          main: ExplorerHooksComponent
        },
        viewCmp: {
          main: ViewportHookComponent
        },
        terminalCmp: {
          main: TerminalHookComponent
        }
      }),
      new RuntimeEventController({
        service: this.eventsSvc,
        viewCmp: {
          main: ViewportEventsComponent
        }
      }),
      new DeviceController({
        service: this.dmService,
        viewCmp: {
          main: ViewportDeviceComponent
        },
        explorerCmp: {
          main: ExplorerDeviceComponent
        }
      }),
      new SplashController({
        service: this.projectService,
        viewCmp: {
          main: ViewportSplashComponent
        }
      }),
      new ProjectController({
        service: this.projectService,
        viewCmp: {
          main: ViewportProjectDashboardComponent
        }
      }),
      new SearchController({
        service: this.searchSvc,
        terminalCmp: {
          main: TerminalSearchComponent
        },
        modalCmp: {
          search: ModalSearchComponent
        }
      }),
      new TopologyController({
        service: this.topoSvc,
        explorerCmp: {
          main: ExplorerTopoComponent
        },
        viewCmp: {
          //main: ViewportTopoComponent,
          //activity: ViewportTopoActivityComponent,
          //service: ViewportTopoServiceComponent,
          //provider: ViewportTopoProviderComponent,
          //receiver: ViewportTopoReceiverComponent,
            cmp: ViewportTopoCmpComponent,
        },
        modalCmp: {
          "send-intent": ModalSendIntentComponent
        }
      }),
      new ViewerController({
        service: this.viewerSvc,
        viewCmp: {
          main: ViewportEditorComponent
        },
      }),
      new NativeController({
        service: this.nativeSvc,
        viewCmp: {
          main: ViewportNativeMainComponent,
          func: ViewportNativeFuncComponent,
        },
      }),
      new PlatformController({
        service: this.pltfSvc
      }),
      new DeobfuscationController({
        service: this.deobfSvc
      }),
      new AuthController({
        service: this.authSvc
      }),
      new TeamController({
        service: this.teamSvc
      }),
      new PrivacyController({
        service: this.privSvc
      }),
      new AuditController({
        service: this.auditSvc,
        explorerCmp: {
          main: ExplorerAuditComponent
        },
        viewCmp: {
          main: ViewportAuditComponent
        },
        terminalCmp: {
          main: TerminalAuditComponent
        },
        modalCmp: {
          rule: ModalEditRuleComponent
        }
      }),
      new TagController({
        service: this.tagSvc,
        explorerCmp: {
          main: ExplorerTagComponent
        },
        modalCmp: {
          edit: ModalTagEditorComponent,
          info: ModalTagInfoComponent
        }
      }),
        new FuzzerController({
            service: this.fuzzSvc,
            viewCmp: {
                main: ViewportFuzzerComponent
            }
        }),
    ];

    this.hookAfterControllersInit(ctrls);

    return ctrls;
  }

  isActiveViewport(pUID:number):boolean{
    console.log(this.activeCtn!=null,this.activeCtn?.id,pUID);
    return (this.activeCtn!=null) && (this.activeCtn.id==pUID);
  }
}
