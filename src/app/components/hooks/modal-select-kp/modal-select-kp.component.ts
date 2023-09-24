import {
  AfterContentInit, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {HOOK_TARGET_TYPE, HookService} from "../ctrl/hook.service";
import {HOOK_ICONS} from "../icons";
import {OutputMessage} from "../../../cmp/OutputMessage";
import Hook from "../../../models/Hook";
import KeyPoint from "../../../models/KeyPoint";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gTargetHook:any = null;
let gInstance:ModalSelectKpComponent = null;

@Component({
  selector: 'dxc-modal-select-kp',
  templateUrl: './modal-select-kp.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalSelectKpComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable:boolean = true;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;
  @Input() message:Message = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;
  icons:any = HOOK_ICONS;
  item: any = null;
  hook:any = null;
  observed:Nullable<string> = null;
  currentKP:KeyPoint = null;
  selectedKP:KeyPoint = null;
  kpList:KeyPoint[] = [];
  moment = "load";

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private hookSvc:HookService) {
    super();

  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    gInstance = this;

    this.hookSvc.onKeyPointListChange.subscribe( (kp:KeyPoint[])=>{
      if(kp !== null && Array.isArray(kp)){
        gInstance.kpList = kp;
      }else{
        gInstance.kpList = [];
      }
    });
    this.refresh();
  }

  refresh(){
    this.hookSvc.listKeyPoints(true).subscribe( (kp:KeyPoint[]) => {
      /*if(kp !== null && Array.isArray(kp)){
        gInstance.kpList = kp;
      }else{
        gInstance.kpList = [];
      }*/
    });
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  /**
   * Callback for 'beforeShow' modal
   *
   * @method
   */
  show( pOptions:any){
    if(gInstance.kpList == null || gInstance.kpList.length == 0){
      gInstance.refresh();
    }
    gTargetHook = pOptions;
    this.moment = gTargetHook._kt;
    console.log('SELECT KP MODAL !',pOptions,this.moment);
  }

  /**
   * Callback for 'afterClose' modal event
   *
   * @method
   */
  close(){
    this.modal.hide('close');
  }


  /**
   * Callback for 'beforeClose' modal event
   *
   * @method
   */
  beforeModalClose(){
    console.log("Prevent escape closing ...");
    return false;
  }

  /**
   * To ask to server to attach target hook to the selected key point
   *
   * @method
   */
  validateKP():void {
    this.hookSvc.attachHookTo( gTargetHook.id, this.selectedKP, this.moment).subscribe( data => {
      // close modal
      this.close();
    })
  }
}
