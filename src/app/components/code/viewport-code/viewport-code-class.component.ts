import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {CodeItem} from "../explorer-code/CodeItem";
import {CodeController} from "../ctrl/CodeController";
import {ViewportTab} from "../../../cmp/ViewportTab";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportView} from "../../../cmp/ViewportView";
import {IViewportContainer} from "../../../base/viewport/IViewportContainer";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import {NavbarSimpleView} from "../../../cmp/NavbarSimpleView";
import {MenuItem, MenuView} from "../../../cmp/MenuView";
import ModelClass from "../../../models/ModelClass";
import {CODE_ICONS} from "../icons";
import {HOOK_ICONS} from "../../hooks/icons";
import {OutputService} from "../../output/ctrl/output.service";
import ModelMethod from "../../../models/ModelMethod";
import {HookService} from "../../hooks/ctrl/hook.service";
import Hook from "../../../models/Hook";
import * as ace from "ace-builds";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {AbstractHook} from "../../../models/AbstractHook";
import {Nullable} from "../../../base/Nullable";
import {ModelClassReference} from "../../../models/ModelReference";


@Component({
  selector: 'app-viewport-code-class',
  templateUrl: './viewport-code-class.component.html',
  styleUrls: ['./viewport-code.component.scss']
})
export class ViewportCodeClassComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() item: any;
  @Input() data: ModelClass;
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;

  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;


  activeLeft:string =  "";
  activeWidth: number = 70;

/*
  topNav: NavbarSimpleView = new NavbarSimpleView({
    style: 'vp-navbar',
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS['JAVA'],
        label: "Implemented By"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['FIND'],
        label: "Instances"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['HOOKS'],
        label: "Permissions",
      })
    ]
  });

  leftNav: NavbarSimpleView =  new NavbarSimpleView({
    menu: new MenuView({
      label: "Filter",
      items: [
        new MenuItem({
          id: 'app',
          icon: GLOBAL_ICONS['WINDOW'],
          label: "Application"
        }),
        new MenuItem({
          id: 'api',
          icon: GLOBAL_ICONS['ANDROID'],
          label: "Android"
        })
      ]
    })
  });

  rightNav: NavbarSimpleView = new NavbarSimpleView({
    entries: [
      new MenuItem({
        icon: GLOBAL_ICONS['HOOKS'],
        label: "Hook logs"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['LIBS'],
        label: "VM Out"
      }),
      new MenuItem({
        icon: GLOBAL_ICONS['ANDROID'],
        label: "adb logs"
      })
    ]
  });
*/
  id: number = -1;
  icons:any = CODE_ICONS;
  gIcons:any = GLOBAL_ICONS;
  hIcons:any = HOOK_ICONS;


  constructor( private codeSvc:CodeControllerService,
               private outputSvc:OutputService,
               private hookSvc:HookService) {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('data')){
      this.codeSvc.getCompleteClass((changes as any).data.currentValue.name).subscribe( (pClass:Nullable<ModelClass>)=>{
        if(pClass!=null){
          this.data = pClass;
          this.showContents();
        }
      })
    }
  }

  ngAfterViewInit() {
    // listener for splitted layout resize
    this.layout.onLayoutResize.subscribe( (vSizes:any) => {

    });

    // init layout
    this.layout.resize({
      width: this.width,
      height: this.height-this.metadataEl.nativeElement.offsetHeight-30
    });

    // listener for parent resize
    this.parent.resize$.subscribe( (pSize:any)=>{
      this.layout.resize({
        width: pSize.width,
        height: pSize.height-this.metadataEl.nativeElement.offsetHeight-30
      });
    });
  }

  configure( pData:any):void {
    this.data = pData;
    console.log(this.data);
  }

  onClose(): boolean {
    this.controller.close(this,'vp');
    return true;
  }

  showModel(pWidth:number=-1):void{
    this.activeLeft = 'md';
    //this.activeWidth = pWidth;
  }

  showContents(pWidth:number=-1):void{
    console.log(this);
    this.activeLeft = 'ct';
    //this.activeWidth = pWidth;
  }

  showInstance(pWidth:number=-1):void{
    this.activeLeft = 'in';
    //this.activeWidth = pWidth;
  }

  showIO(pWidth:number=-1):void{
    this.activeLeft = 'io';
    //this.activeWidth = pWidth;
  }

  showPerm(pWidth:number=-1):void{
    this.activeLeft = 'pm';
    //this.activeWidth = pWidth;
  }


  setProbe(pMeth: ModelMethod) {
    if(pMeth.probing){
      // ..
      this.hookSvc.probe(pMeth).subscribe( (pHook:Nullable<AbstractHook>)=>{
        pMeth.probing = true;
      });
    }else{
      this.hookSvc.probe(pMeth).subscribe( (pHook:Nullable<AbstractHook>)=>{
        pMeth.probing = true;
      });
    }
  }

  disableProbe(mt: ModelMethod) {
    // toodo
  }

  showAndroidAPI() {
    this.codeSvc.xrefAndroidApi(this.data as ModelClass).subscribe( (pXref:any)=>{
      console.log(pXref);
    });
  }

  protected readonly ModelClassReference = ModelClassReference;
}
