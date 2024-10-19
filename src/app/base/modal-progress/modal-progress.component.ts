import {
  AfterContentInit, ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {ModalBaseComponent} from "../modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {StageComponent} from "../../components/stage/stage.component";
import {Nullable} from "../Nullable";
import {IStringIndex} from "../IStringIndex";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


export enum ModalProgressStatus {
  NONE,
  ERROR,
  SUCCESS,
  NEW
}

export class ModalProgressEvent {

  status:ModalProgressStatus = ModalProgressStatus.NONE;

  title:string = "";

  progress:number = 0;

  msg:string = "";

  constructor( pConfig:any = {}) {
    for(let i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
  }
}



@Component({
  selector: 'app-modal-progress',
  templateUrl: './modal-progress.component.html',
  styleUrls: ['./modal-progress.component.scss','../../forms.scss'],
  providers: [NgbProgressbarConfig]
})
export class ModalProgressComponent implements OnInit {

  @Input() mainController: StageComponent;
  @Input() controller:any;
  @Input() closable:boolean = false;
  @Input() progress$:Observable<ModalProgressEvent> ;
  @Input() progressSrc:any = null;
  @Input() progress:number = 100;
  @Input() width:number = 200;
  @Input() animated:boolean = false;
  @Input() cancelable: boolean = false;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = null;

  @Input() message:Nullable<string> = null;

  @Input() cancel:any;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;


  constructor(private changeDetectorRef: ChangeDetectorRef,
              private config: NgbProgressbarConfig) {
    // customize default values of progress bars used by this component tree
    this.config.max = 100;
    this.config.striped = true;
    this.config.animated = true;
    //config.type = 'success';
    //config.height = '20px';
  }

  ngOnInit(): void {

    if(this.animated){
      this.config.animated = this.animated;
    }

    if(this.progress$ != null){
      this.progress$.subscribe( (pEvent:ModalProgressEvent)=>{
        //console.log(pEvent.progress=);
        if(pEvent.progress!=100){

          this.progress = 100;
        }
        this.progress = pEvent.progress;
        this.message = pEvent.msg;
      });

    }

    if(this.mainController==null){
      this.mainController = this.controller.app;
    }
  }

  show(){
    this.modal.show();
  }

  close(){
    this.modal.hide('close');
  }

  isVisible():boolean {
    return this.modal.isDisplayed();
  }

  /**
   *
   */
  resetError(pEvent:any):void{
    // if differs from enter (avoid conflict with submit on enter)
    if(pEvent.keyCode != 13){
      //this.error = null;
    }
  }

  /**
   * To initialize alias input when the modal is loaded
   *
   * TODO : param should be {ModelPackage|ModelClass|ModelField|ModelMethod} instead of event
   *
   * @param {any} pSubject
   * @method
   */
  onOpen(pSubject:any):void {

  }

  onCancel() {
    if( (this.cancel === null)
      || ((this.cancel != null) && ((this.cancel)(this)==true)) ){
        this.close()
    }
  }
}
