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
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import {TopologyService} from "../ctrl/topology.service";
import AndroidComponent from "../../../models/android/AndroidComponent";
import {IntentDataCriteria} from "../../../models/android/Intent";
import {IntentFilter} from "../../../models/android/IntentFilter";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-send-intent',
  templateUrl: './modal-send-intent.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalSendIntentComponent  extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable:boolean = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 20;

  @Input() comp:AndroidComponent;
  @Input() filter:IntentFilter;
  @Input() criteria:IntentDataCriteria;

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
  item: any = null;
  focusEl: number = -1;


  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(private topoSvc:TopologyService) {

    super();
    // customize default values of progress bars used by this component tree
    //config.max = 100;
    //config.striped = false;
    //config.animated = true;
    //config.type = 'success';
    //config.height = '20px';
  }

  ngOnInit(): void {
    //this.refresh();
    /*this.progress$.subscribe( (pProgress:any)=>{
      console.log(pProgress);
      this.progress = pProgress.value;
      this.message = pProgress.msg;
    });*/

    this.onKeyboardEvent.subscribe( pEvent => {

    })
  }


  show(){
    this.modal.show();
    //this.kbSvc.focus()
  }

  close(){
    this.modal.hide('close');
  }

  sendIntent(pConfig: any, pIndex:number = -1):void {
      this.focusEl = pIndex;
      this.topoSvc.sendIntent(pConfig).subscribe( (pEvent)=>{
        //this.selected = pEvent;
        //this.selected.icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });
  }


  // TODO : remove
  @HostListener('document:keydown.escape')
  onEscape(){
    if(this.modal.isDisplayed()){
      this.close();
    }
  }

  onKeyPress(pEvent: any) {
    console.log("key press",pEvent);
  }

}
