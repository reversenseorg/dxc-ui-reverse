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
import {AppMenuService} from "./core/components/appmenu/appmenu.service";
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
import {ViewportController} from "./base/viewport/ViewportController";
import {ViewerController} from "./components/viewer/ctrl/ViewerController";
import {ViewportEditorComponent} from "./components/viewer/vp-editor/viewport-editor.component";
import {ViewerService} from "./components/viewer/ctrl/viewer.service";
import {ViewportTopoComponent} from "./components/topology/viewport-topo/viewport-topo.component";
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


interface StageSet {
  [name:string] :StageComponent;
}


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class ControllerService {

  helper: Nullable<HelperController> = null;
  private _s:StageSet = {};

  constructor(
    private appmenuService:AppMenuService,
    private codeCtrlService: CodeControllerService,
    private hookService: HookService,
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
    private pltfSvc: PlatformService,
    private deobfSvc: DeobfuscationService,
    private authSvc: AuthService,
    private auditSvc: AuditService,

    private privSvc: PrivacyService,
    private teamSvc: TeamService) {

    this.appmenuService.render();
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

  getControllers(): IController[] {

    this.helper = new HelperController({
      service: this.helperService,
      terminalCmp: {
        main: TerminalHelperComponent,
      }
    });

    return [
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
          main: ViewportTopoComponent
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
          main: ViewportNativeMainComponent
        },
      }),
      new TagController({
        service: this.tagSvc
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
      })
    ];
  }
}
