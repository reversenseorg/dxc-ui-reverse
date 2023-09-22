import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MenuView} from "../../cmp/MenuView";
import {IconView} from "../../cmp/IconView";
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";
import {ContextMenuComponent} from "./context-menu.component";
import {IconModel} from "../icon/IconModel";

/**
 * Third column : shortcut
 */
@Component({
  selector: 'app-context-item',
  templateUrl: 'context-item.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextItemComponent implements OnInit {

  // @ts-ignore
  @Input() label: string = null;
  @Input() iconName: string = null;
  @Input() icon: IconModel = null;
  @Input() separator: boolean = false;
  @Input() disabled: boolean = false;

  @Output() itemclick: EventEmitter<any> = new EventEmitter<any>();

  parent: ContextMenuComponent = null;
  border: string = '';
  target: any = null;
  rendered:boolean = false;


  constructor() {

  }

  ngOnInit(): void {
    if(this.iconName != null){
      this.icon = GLOBAL_ICONS[this.iconName];

    }
  }


  onClick(pEvent:any):void {
      this.parent.hide(null);
      this.itemclick.emit(pEvent);
  }
}
