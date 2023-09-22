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
import JavaMethodHook from "../../../models/JavaMethodHook";
import {AbstractHook} from "../../../models/AbstractHook";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gTargetHook:any = null;
//let gInstance:ModalNewFragmentComponent = null;

@Component({
  selector: 'dxc-modal-new-fragment',
  templateUrl: './modal-new-fragment.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalNewFragmentComponent extends AbstractKeyboardNavigable implements OnInit {

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
  @Input() title:string = null;
  @Input() message:Message = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  mode = "Add";

  gIcons:any = GLOBAL_ICONS;
  icons:any = HOOK_ICONS;
  item: any = null;
  hook:AbstractHook = null;
  observed: string = null;

  uid = '';
  pos = '';
  name = '';
  descr = '';
  weight = -1;

  _update = false;



  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private hookSvc:HookService) {
    super();

  }


  ngOnInit(): void {
    this.kbSvc.register(this);
    // gInstance = this;
  }

  init(){
    this.weight = -1;
    this.pos = "before";
    this.uid = '';
    this.pos = '';
    this.name = '';
    this.descr = '';
    this.weight = -1;
    this._update = false;
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

    console.log("SHOW ADD FRAG", pOptions)
    this.init();

    if(pOptions.hook != null){
      this._update = true;
      gTargetHook = pOptions.hook;
      this.hook = pOptions.hook;
      this.pos = pOptions.pos;
      this.uid = pOptions.frag._uid;
      this.weight = pOptions.frag.weight;
      if(this.weight == null) this.weight = -1;
      this.name = pOptions.frag.name;
      this.descr = pOptions.frag.descr;
      this.mode = "Edit";
    }else{
      this._update = false;
      gTargetHook = pOptions;
      this.mode = "Add";
      this.hook = pOptions;
      this.pos = 'before';
    }

    this.modal.show();
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
  confirm():void {
    const opts = {
      pos:this.pos,
      weight:this.weight,
      name:this.name,
      descr: this.descr
    };

    console.log("CONFORIM ...",this);
    if(this._update){
      this.hookSvc.editHookFragment( gTargetHook, this.uid, opts).subscribe( data => {
        console.log("[HOOK FRAGMENT] edit : ", gTargetHook, this.uid, opts);
        this.close();
      });
    }else{
      this.hookSvc.addHookFragment( gTargetHook, opts).subscribe( data => {
        console.log("[HOOK FRAGMENT] new : ", gTargetHook, opts);
        this.close();
      });
    }


  }
}
