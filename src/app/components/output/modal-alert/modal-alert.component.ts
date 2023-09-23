import {
  ChangeDetectorRef,
  Component, EventEmitter,
  Input,
  OnInit, Output,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {StageComponent} from "../../stage/stage.component";
import {OutputService} from "../ctrl/output.service";
import {OutputMessage, OutputMessageType} from "../../../cmp/OutputMessage";
import {ProjectService} from "../../project/ctrl/project.service";
import {IConfigurableModal} from "../../../base/modal-base/IConfigurableModal";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {HelperService} from "../../helper/ctrl/HelperService";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

export interface AlertControl {
  label: string,
  class?: string,
  handler: any
}

export interface AlertOptions {
  controls?: AlertControl[],
  title?: string,
  helpDocID?:string
}

export interface AlertMessage {
   msg: OutputMessage,
   opts: AlertOptions
}

@Component({
  selector: 'dxc-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss','../../../forms.scss']
})
export class ModalAlertComponent extends AbstractKeyboardNavigable implements OnInit, IConfigurableModal {

  static DEFAULT_TITLE = "Notification";

  @Input() mainController: StageComponent;
  @Input() controller:any;
  @Input() closable:boolean = true;
  @Input() width:number = 500;
  @Input() animated:boolean = false;
  @Input() cancelable: boolean = false;

  @Input() onConfirm:Function = null;
  @Input() msg:OutputMessage;
  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:string = ModalAlertComponent.DEFAULT_TITLE;

  @Input() message:string = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  controls: AlertControl[] = [];

  helpDocID:string = null;

  @Output() confirm: EventEmitter<any>;

  constructor(private outputSvc:OutputService,
              private kbSvc:KeyboardNavigationService,
              private helperSvc:HelperService,
              private projSvc:ProjectService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);

    if(this.confirmMode){
      this.confirm = new EventEmitter<any>();
    }
    this.msg = new OutputMessage({msg:""});

    if(this.mainController==null){
      this.mainController = this.controller.app;
    }

    this.outputSvc.alert$.subscribe( (pMsg:AlertMessage)=>{
      this.msg = pMsg.msg;
      this.resetOptions();
      this.setupOptions(pMsg.opts);

      this.confirmMode = this.msg.isConfirm();
      if(this.confirmMode = this.msg.isConfirm()){
        this.onConfirm =  this.msg.getCallback();
      }


      this.modal.show({ message:this.msg.msg});
    });

    this.projSvc.onProjectReady.subscribe( (pStatus)=>{
      if(this.isVisible())
        this.close();
    });
  }

  /**
   * To reset the alert box custom options from previous message
   * Currently, only the modal title and additional buttons can be added
   *
   * @method
   * @since 1.0.0
   */
  resetOptions(){
    this.title = ModalAlertComponent.DEFAULT_TITLE;
    this.controls = [];
  }

  /**
   * To configure the modal with custom options.
   *
   * Supported options :
   * - title
   * - controls (additionnal buttons)
   *
   * @method
   * @since 1.0.0
   */
  setupOptions( pOptions:AlertOptions){
    if(pOptions.title != null)
      this.title = pOptions.title;

    if(pOptions.controls != null){
      this.controls = pOptions.controls;
    }

    if(pOptions.helpDocID != null){
      this.helpDocID = pOptions.helpDocID;
    }
  }

  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  reset(){
    this.confirmMode = false;
    this.onConfirm = null;
    this.message = null;
  }

  configure( pOptions: any = null) {
    if(pOptions!=null){
      console.log("[modal-alert] Configure with ",pOptions);
      for(let i in pOptions) (this as IStringIndex<any>)[i] = pOptions[i];
    }
  }
/*
  show( pOptions:any = null){
    console.log("Pass into ModalAlert show ",pOptions);
    if(pOptions!=null){
      for(let i in pOptions) (this as IStringIndex<any>)[i] = pOptions[i];
    }
    console.log(pOptions);
    this.modal.show();
  }*/
  @Input() confirmMode: boolean = false;

  close( pKey:string = 'close'){
    // prevent modal closing on escape
    this.resetOptions();
    this.modal.hide(pKey);
  }

  cancel(){
    // prevent modal closing on escape
    if(this.onConfirm != null){
      this.onConfirm(false, this)
    }
    this.reset();
    //this.modal.hide('cancel');
  }

  next(){
    // prevent modal closing on escape
    //this.modal.hide('next');
    if(this.onConfirm != null){
      this.onConfirm(true, this)
    }
    this.reset();
  }

  isVisible():boolean {
    return this.modal.isDisplayed();
  }

  applyContextStyle():string {
    let c:string = "";
    switch (this.msg.getType()) {
      case OutputMessageType.INFO:
        c = "dxc-info";
        break;
      case OutputMessageType.CONFIRM:
      case OutputMessageType.WARNING:
        c = "dxc-warning";
        break;
      case OutputMessageType.ERROR:
        c = "dxc-danger";
        break;
      case OutputMessageType.SUCCESS:
        c = "dxc-success";
        break;
    }

    return c;
  }

  /**
   * To call the handler attached to the control (btn, ..)
   *
   * If the handler return TRUE, the modal is closed/hidden. Else the modal keep in foregrounf.
   *
   *
   * @param pControl
   * @param $event
   */
  callControlHandler(pControl: AlertControl, $event: MouseEvent) {
    if(pControl.handler != null){
      if(pControl.handler.call($event)){
        this.close();
      }
    }
  }

  showHelp() {
    this.helperSvc.openDoc(this.helpDocID);
  }
}
