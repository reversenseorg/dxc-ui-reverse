import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {Message} from "../../../cmp/Error";
import {ModalBaseComponent} from "../../../base/modal-base/modal-base.component";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {OutputService} from "../../output/ctrl/output.service";
import {AbstractKeyboardNavigable} from "../../../base/keyboard/AbstractKeyboardNavigable";
import {KeyboardNavigationService} from "../../../base/keyboard/keyboard-navigation.service";
import {Nullable} from "../../../base/Nullable";
import {Tag} from "../../../models/tags/Tag";
import {TagService} from "../ctrl/tag.service";
import TagCategory from "../../../models/ModelTagCategory";


interface EventSources {
  drag: Observable<any>,
  drop: Observable<any>
}


let gInstance:Nullable<ModalTagInfoComponent> = null;


@Component({
  selector: 'dxc-tag-info',
  templateUrl: './modal-tag-info.component.html',
  styleUrls: ['../../../modal.scss','../../../forms.scss']
})
export class ModalTagInfoComponent extends AbstractKeyboardNavigable implements OnInit {

  @Input() tag:Nullable<Tag> = null;
  @Input() controller:any;

  /**
   * Modal title
   *
   * Let empty to remove header
   *
   * @field
   * @type {string}
   */
  @Input() title:Nullable<string> = "Tag Editor";

  @Input() message:Nullable<Message> = null;

  @ViewChild(ModalBaseComponent) modal:ModalBaseComponent;

  gIcons:any = GLOBAL_ICONS;

  item: any = null;

  private onStart:any = null;

  _:number = -1;
  name:string = "";
  catName: Nullable<string> = "";
  category: TagCategory;
  descr: any = "";
  txtColor: any = "";
  bgColor: any = "";
  label: any = "";

  description: any;

  constructor( private changeDetectorRef: ChangeDetectorRef,
               private _tagSvc:TagService,
               private outputSvc:OutputService,
               private kbSvc:KeyboardNavigationService) {
    super();
  }

  ngOnInit(): void {
    this.kbSvc.register(this);
    gInstance = this;
  }


  onKeyPress(pEvent: any) {
    switch(pEvent.code){
      case "Escape":
        this.modal.hide('close');
        break;
    }
  }


  onOpen( pEvent:any){
    const tag = pEvent.target.options;
    console.log("TAG EDITOR : ",tag);
    this.description = tag.descr;
  }

  close(){
    this.modal.hide('close');
  }
}
