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

import {
    AfterViewInit,
    ChangeDetectionStrategy, ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {CodeController} from "../ctrl/CodeController";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {ViewportComponent} from "../../../base/viewport/viewport.component";
import {CodeControllerService} from "../ctrl/code-controller.service";
import ModelClass from "../../../models/ModelClass";
import {CODE_ICONS} from "../icons";
import {HOOK_ICONS} from "../../hooks/icons";
import {OutputService} from "../../output/ctrl/output.service";
import ModelMethod from "../../../models/ModelMethod";
import {HookService} from "../../hooks/ctrl/hook.service";
import {ViewportSplittedComponent} from "../../../base/viewport-splitted/viewport-splitted.component";
import {AbstractHook} from "../../../models/AbstractHook";
import {Nullable} from "../../../base/Nullable";
import {ModelClassReference} from "../../../models/ModelReference";
import ModelField from "../../../models/ModelField";
import ModelCall from "../../../models/ModelCall";
import {IStringIndex} from "../../../base/IStringIndex";
import {INodeRef} from "../../../base/common/common"
import {NodeInternalType} from "../../../models/NodeInternalType";


@Component({
  selector: 'app-viewport-code-class',
  templateUrl: './viewport-code-class.component.html',
  styleUrls: ['./viewport-code.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportCodeClassComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() item: any;
  @Input() data: ModelClass;
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;

  @Input() direct = false;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;


  activeLeft:string =  "ct";
  activeWidth: number = 70;


    protected readonly ModelClassReference = ModelClassReference;

    childCls: ModelClass[] = [];

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

  loading = false;
  xref:ModelCall[] = [];

  constructor( private codeSvc:CodeControllerService,
               private outputSvc:OutputService,
               private hookSvc:HookService,
               private chref:ChangeDetectorRef) {

  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('data')){
      this.refresh((changes as any).data.currentValue.name)
    }
  }

  refresh(pName:string){
      this.codeSvc.getCompleteClass(pName).subscribe( (pClass:Nullable<ModelClass>)=>{

          console.log("CLASS: getCompleteClass : ",pClass);
          if(pClass!=null){
              this.data = pClass;
              this.showContents();
          }else{
              console.log("CLASS: Cannot restore complete class ",pName,pClass);
          }
      });
  }

  ngAfterViewInit() {


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
      this.loading = true;

      this.codeSvc.getChildClass(this.data).subscribe( (pCls:ModelClass[])=>{
          this.loading = false;
          this.childCls = pCls;
          this.chref.detectChanges();
      });
  }

  showContents(pWidth:number=-1):void{
    console.log(" showContents > ",this);
    this.activeLeft = 'ct';
    //this.activeWidth = pWidth;
  }

  showInstance(pWidth:number=-1):void{
    this.activeLeft = 'in';

    if(this.data==null || this.data.name==null) return;

    //this.activeWidth = pWidth;
      this.loading = true;
      this.codeSvc.getXref( NodeInternalType.CLASS, this.data.name, 'to').subscribe( (vX:ModelCall[])=>{
          this.xref = vX;
          this.loading = false;
          this.chref.detectChanges();
      });
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

  showOsAPI() {
    this.activeLeft = 'os';
  }


  getClassFields(pName:Nullable<string> = null):ModelField[] {
    const fields:ModelField[] = [];
    if(this.data!=null){
      for(let k in this.data.fields){
        fields.push((this.data.fields[k]));
      }
    }
    return fields;
  }

  getClassMethods(pName:Nullable<string> = null):ModelMethod[] {
    const obj:ModelMethod[] = [];
    if(this.data!=null){
      for(let k in this.data.methods){
        obj.push((this.data.methods[k]));
      }
    }
    return obj;
  }

  getMethodModifiers(mt: ModelMethod):IStringIndex<boolean> {
    return (mt as any).modifiers as IStringIndex<boolean> ;
  }

  showDiagram(pType: string) {
    this.activeLeft = 'uml';
    this.activeWidth = 100;
  }
}
