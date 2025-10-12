import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import {IStringIndex} from "../../../base/IStringIndex";
import ModelStringValue from "../../../models/ModelStringValue";


@Component({
  selector: 'app-viewport-code-string',
  template:`
    <div class="container-fluid viewport-class">
      <div #metadata style="border-bottom:1px solid #777; padding: 10px">
        {{ data.value }}
      </div>
      
      <ng-container *ngFor="let t of data.tags">
        <dxc-tag-badge [tagUUID]="t" [editable]="true" [style]="{ 'backgroundColor':'#facd13', 'color':'black' }"></dxc-tag-badge>
      </ng-container>
      
      <app-viewport-splitted [controller]="controller" [parent]="this" [flex]="true" [leftWidth]="activeWidth" [type]="'1:2'">
        <ng-container nav-left>
          <app-subnavbar [type]="'navbar'"  [parent]="this">
            <ng-container main>
              <app-subnavbar-btn [active]="activeLeft=='occ'"  (click)="show('occ')">Occurences</app-subnavbar-btn>
            </ng-container>
          </app-subnavbar>
        </ng-container>
        <ng-container body-left>
          &nbsp;
          <div class="container-fluid view-outer dxc-list"  [class.dxc-hidden]="(activeLeft==null) || (activeLeft!='occ')">
            <ng-container *ngFor="let src of data.src">
              <div class="w-full">
                <dxc-node-token [full]="true" [ref]="src" [interactive]="true" [tags]="true"></dxc-node-token>
              </div>
            </ng-container>
          </div>
        </ng-container>
        <ng-container nav-right>
          <app-subnavbar [type]="'navbar'"  [parent]="this">
            <ng-container main></ng-container>
          </app-subnavbar>
        </ng-container>
        <ng-container body-right>&nbsp;</ng-container>
      </app-viewport-splitted>

    </div>

  `,
  styleUrls: ['./viewport-code.component.scss','../static.dxc.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewportCodeStringComponent implements AfterViewInit {

  @Input() item: any;
  @Input() data: ModelStringValue;
  @Input() controller: CodeController;
  @Input() parent: ViewportComponent;
  @Input() height: number;
  @Input() width: number;

  @Input() direct = false;
  @ViewChild(ViewportSplittedComponent) layout:ViewportSplittedComponent;
  @ViewChild('metadata',{ read:ElementRef, static:false}) metadataEl:ElementRef;

  activeLeft:string =  "occ";
  activeWidth: number = 70;

  id: number = -1;
  icons:any = CODE_ICONS;
  gIcons:any = GLOBAL_ICONS;
  hIcons:any = HOOK_ICONS;


  constructor( private codeSvc:CodeControllerService,
               private outputSvc:OutputService,
               private hookSvc:HookService) {

  }


  ngAfterViewInit() {


    console.log(this.layout);

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

  show(pPanel:string):void{
    this.activeLeft = pPanel;
    //this.activeWidth = pWidth;
  }

  showContents(pWidth:number=-1):void{
    console.log(" showContents > ",this);
    this.activeLeft = 'ct';
    //this.activeWidth = pWidth;
  }
}
