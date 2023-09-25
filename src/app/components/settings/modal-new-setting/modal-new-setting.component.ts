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
import {SettingsService} from "../ctrl/settings.service";
import {StageComponent} from "../../stage/stage.component";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gInstance:Nullable<ModalNewSettingComponent> = null;

@Component({
  selector: 'dxc-modal-new-setting',
  templateUrl: './modal-new-setting.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalNewSettingComponent extends AbstractKeyboardNavigable implements OnInit {

  static DEFAULT_CAT = "ext";

  @Input() mainController: StageComponent;
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
  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;
  item: any = null;

  name = "";
  value = "";
  category:string = ModalNewSettingComponent.DEFAULT_CAT;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService,
               private settSvc:SettingsService) {
    super();

  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    gInstance = this;
    this.reset();
  }

  reset(){
    this.name = "";
    this.value = "";
    this.category = ModalNewSettingComponent.DEFAULT_CAT;
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
    console.log('NEW SETTINGS MODAL !');
    if(gInstance!=null){
      gInstance.category = (pOptions.hasOwnProperty('category')? pOptions.category : ModalNewSettingComponent.DEFAULT_CAT);
    }
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
   * To ask to server to create a new setting for the specified category and name
   *
   * @method
   */
  save():void {
    this.settSvc.addSetting( this.category, this.name, this.value).subscribe( pSuccess => {
      // close modal
      if(pSuccess) this.close();
    })
  }
}
