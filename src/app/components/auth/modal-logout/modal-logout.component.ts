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


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-logout',
  templateUrl: './modal-logout.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalLogoutComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() mainController: StageComponent;
  @Input() controller: AuthController;
  @Input() closable:boolean = true;

  @Input() projects:DexcaliburProject[] = [];


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

  gIcons:any = GLOBAL_ICONS;
  icons:any = AUTH_ICONS;
  conns:any = [];
  server:any = null;

  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private authSvc:AuthService,
              private outputSvc:OutputService,
              private kbSvc: KeyboardNavigationService ) {
    super();
  }

  ngOnInit(): void {
    // register the componant as navigable with keyboard
    this.kbSvc.register(this);

    this.authSvc.onAuthentication.subscribe( (pEvent:AuthenticationEvent)=>{
        switch (pEvent.type) {
          case AuthenticationEventType.LOGOUT_SUCCESS:
            this.close();
            break;
        }
    })

    this.authSvc.listConnectionsSettings().subscribe( conns => {
      console.log(conns);
      this.conns = conns;
    });
  }

  onKeyPress(pEvent: KeyboardEvent) {
    // TODO
  }

  requestAuth(pEvent:AuthenticationEvent):void {
    if(this.authSvc.isAuthenticated(pEvent.getConnName())==false){

    }else{
      this.outputSvc.print(new OutputMessage({
        msg: "You are already logged in '"+pEvent.getConnName()+"'"
      }))
    }
  }


  show(){
    this.modal.show();
  }

  doLogout():any {
    return null;
  }

  close():void {
    this.modal.hide('close');
  }

  showHelp() {

  }


  connIdentify( pIndex:number, pItem:any):string {
    return pItem.name;
  }

  isAuthenticated(pConnName: string) {
    if(this.server == null){
      return false;
    }else{
      return this.authSvc.isAuthenticated(pConnName);
    }
  }
}
