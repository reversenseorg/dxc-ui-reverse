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
import {NgbProgressbarConfig} from "@ng-bootstrap/ng-bootstrap";
import {ProjectService} from "../ctrl/project.service";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {IKeyboardNavigable} from "../../../base/keyboard/IKeyboardNavigable";
import {OutputService} from "../../output/ctrl/output.service";
import {OutputMessage} from "../../../cmp/OutputMessage";
import {ControllerService} from "../../../controller.service";
import {AppIcon} from "../../../models/AppIcon";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {IconModelCollection} from "../../../base/icon/IconModel";
import {Nullable} from "../../../base/Nullable";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}

@Component({
  selector: 'dxc-modal-open-project',
  templateUrl: './modal-open-project.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss'],
})
export class ModalOpenProjectComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() controller:any;
  @Input() closable = true;
  @Input() progress$:Observable<any> ;
  @Input() progressSrc:any = null;
  @Input() progress = 20;

  @Input() projects:DexcaliburProject[] = [];
  projectsCount = 0;

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

  gIcons:IconModelCollection = GLOBAL_ICONS;
  project:Nullable<DexcaliburProject> = null;
  item: any = null;
  selected: Nullable<DexcaliburProject> = null;
  focusEl = -1;



  onKeyboardEvent:Subject<any> = new Subject<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private projSvc:ProjectService,
              private outputSvc:OutputService,
              public kbSvc: KeyboardNavigationService ) {
    super();
  }

  ngOnInit(): void {
    this.refresh();

    this.kbSvc.register(this);


    this.projSvc.onRefreshAll.subscribe( (pProjects:DexcaliburProject[])=>{
      this.projects = pProjects;
      this.projectsCount = pProjects.length;

      if(this.projectsCount==0){
        this.selected = null;
      }
    });

    //this.onKeyboardEvent.subscribe( (pEvent) => { })
  }



  show():void{
    this.modal.show();
    //this.kbSvc.focus()
    console.log("[MODAL PROJECT OPEN] show()");
  }

  close():void{
    this.modal.hide('close');
  }

  selectProject(proj: DexcaliburProject, pIndex = -1):void {
      this.focusEl = pIndex;
      this.projSvc.getProjectInfo(proj).subscribe( (pEvent)=>{
        this.selected = pEvent;
        (this.selected as any).icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });
  }

  selectProjectByOffset(pOffset:number):void {
    if(this.projects.length>pOffset){
      this.focusEl = pOffset;
      this.projSvc.getProjectInfo(this.projects[pOffset]).subscribe( (pEvent)=>{
        this.selected = pEvent;
        (this.selected as any).icon = pEvent.icon==null ? new AppIcon({ localPath:"/assets/icons/dexcalibur_32.png" }) : pEvent.icon;
      });
    }
  }


  onKeyPress(pEvent: any):void {
    console.log("On key press catched by open project modal ",pEvent);

    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }

  /*
    @HostListener('window:keydown.arrowup', ['$event'])
    onPrevProject( pEvent: KeyboardEvent){
      console.log("Arrow UP", pEvent);
      if( (this.focusEl-1) > this.projects.length){
        this.selectProjectByOffset(this.focusEl-1);
      }
    }


    @HostListener('window:keydown.arrowdown', ['$event'])
    onNextProject( pEvent: KeyboardEvent){
      console.log("Arrow DOWN", pEvent);
      if( (this.focusEl+1) > this.projects.length){
        this.selectProjectByOffset(this.focusEl+1);
      }
    }
  */
  /**
   * To open the project selected, close modal, and send event
   */
  openProject():void {
    if(this.selected!=null){
      try{
        this.projSvc.openProject(this.selected).subscribe( (pResult)=>{
          if(pResult.success==true){
            this.close();
          }
        } );
      }catch(err:any){
        this.outputSvc.alert( new OutputMessage({ msg:err.message }));
      }

    }
  }

  /**
   * To remove selected project
   */
  removeProject(pProject:Nullable<DexcaliburProject> = null):void {
      let project:Nullable<DexcaliburProject>;
      try{
        project = (pProject==null ? this.selected : pProject);
        if(project==null){
          throw new Error("Cannot remove project");
        }
        this.projSvc.removeProject(project).subscribe( ()=>{
          this.refresh();
        });
      }catch(err:any){
        this.outputSvc.alert( new OutputMessage({ msg:err.message }));
      }

  }

  refresh():void {
    this.projSvc.listProjects().subscribe( (pEvent)=>{
      this.projects = pEvent;
      this.projectsCount = pEvent.length;
    });
  }
}
