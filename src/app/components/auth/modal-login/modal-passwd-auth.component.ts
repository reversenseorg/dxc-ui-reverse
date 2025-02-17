import {ChangeDetectorRef, Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {AUTH_ICONS} from "../icons";
import {AuthService} from "../ctrl/auth.service";
import {StageComponent} from "../../stage/stage.component";
import {AuthController} from "../ctrl/AuthController";
import {AuthenticationEvent, AuthenticationEventType} from "../AuthenticationEvent";
import {ModalAlertComponent} from "../../output/modal-alert/modal-alert.component";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {DexcaliburConnectionParams} from "../../../models/remote/DexcaliburConnectionParams";
import {Nullable} from "../../../base/Nullable";
import {UIException} from "../../../base/error/UIException";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-passwd-auth',
  templateUrl: './modal-passwd-auth.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalPasswdAuthComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() mainController: StageComponent;
  @Input() controller: AuthController;
  @Input() closable:boolean = true;

  @Input() projects:DexcaliburProject[] = [];

  authType:string = "local";
  firstLogin:boolean =true;
  projectsCount:number = 0;

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
  icons:any = AUTH_ICONS;

  username:Nullable<string> = null;
  passwd:Nullable<string> = null;
  server:Nullable<string> = null; //"local";
  conns:DexcaliburConnectionParams[] = [];

  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private authSvc:AuthService,
              private outputSvc:OutputService,
              private kbSvc: KeyboardNavigationService ) {
    super();
  }

  ngOnInit(): void {


    this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent)=>{
        switch (pEvent.type) {
          case AuthenticationEventType.AUTH_SUCCESS:
            if(this.firstLogin) this.firstLogin = false;
            this.close();
            break;
          case AuthenticationEventType.AUTH_NEW:
            this.show();
            break;
          case AuthenticationEventType.AUTH_REQUEST:
            this.requestAuth(pEvent);
            break;
        }
    })

    this.authSvc.listConnectionsSettings().subscribe( conns => {
      console.log(conns);
      this.conns = conns;
    });
  }

  requestAuth(pEvent:AuthenticationEvent):void {
    if(pEvent.getConnName()==null) throw UIException.AUTH_ERROR();
    if(this.authSvc.isAuthenticated(pEvent.getConnName() as string)==false){

    }else{
      this.outputSvc.print(new OutputMessage({
        msg: "You are already logged in '"+pEvent.getConnName()+"'"
      }))
    }
  }

  onKeyPress(pEvent: any) {

  }

  show(){
    this.modal.show();
  }

  /**
   * To open the project selected, close modal, and send event
   */
  doPasswordLogin() {
      try{
        this.authSvc.doPasswordAuthentication(this.server as string, this.username as string, this.passwd as string).subscribe( (pResult)=>{} );
      }catch(err:any){
        this.outputSvc.alert(OutputMessage.newError({ msg:err.message }));
      }
  }


  close():void {
    if(this.modal !=null) this.modal.hide('close');
  }

  showHelp() {

  }


  connIdentify( pIndex:number, pItem:any):string {
    return pItem.name;
  }

  warnOnClose():boolean {
    let self = this;
    if(this.firstLogin) {
      this.outputSvc.confirm(OutputMessage.newConfirm({
        msg: "If you continue without authentication, you could not be able to see protected data or to do collaborative work later."
      }, function (vSuccess: boolean, vModal: ModalAlertComponent) {
        console.log("on confirm : ", vSuccess);
        if (vSuccess) {
          vModal.close('close'); // confirm
          self.close();
        } else {
          vModal.close('close');
        }
      }));
    }else{
      self.close();
    }
    return true;
  }

  isAuthenticated(pConnName:Nullable<string>) {
    if(this.server == null || pConnName==null){
      return false;
    }else{
      return this.authSvc.isAuthenticated(pConnName);
    }
  }
}
