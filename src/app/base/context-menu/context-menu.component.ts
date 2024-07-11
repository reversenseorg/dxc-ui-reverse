import {
  AfterContentInit,
  Component, ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import {MenuView} from "../../cmp/MenuView";
import {ContextItemComponent} from "./context-item.component";
import {Nullable} from "../Nullable";


export interface ContextMenuList {
  [name: string] :ContextMenuComponent
}


export interface ContextMenuEvent {
  event: Event;
  type:string;
  obj:any;
}

export interface ContextMenuState {
  menu?: ContextMenuComponent,
  subject: any,
  extra?: any
}


/**
 *
 * The CSS class 'dxc-ctxm-active' is added to the element which has been clicked
 * before to open context menu, and remove when the menu is closed.
 * This class can help to select element
 *
 */
@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit, AfterContentInit {

  @Input() name:Nullable<string> = null;

  @Input() width: number = 160;

  @Input() menu: Nullable<MenuView> = null;
  @ViewChild('menu', {read: ElementRef}) menuEl:ElementRef;
  @ContentChildren(ContextItemComponent) itemList:QueryList<ContextItemComponent>;

  subject:any = null;
  rendered:boolean = false;
  event:any = null;
  extra:any = null;

  constructor() {

  }

  ngAfterContentInit() {
    this.injectTarget();
  }

  ngOnInit(): void {

  }

  injectTarget(){

    let children:ContextItemComponent[] = this.itemList.toArray();


    children.map( (vItem:ContextItemComponent) => {
    //  console.log(vItem, this);
      vItem.target = this.subject;
      vItem.parent = this;
    })
  }

  show( pEvent:any, pObject:any, pExtra:any = null ):void{
    this.rendered = true;
    this.subject = pObject;
    this.event = pEvent;
    this.extra = pExtra;

    const path = this.event.composedPath ? this.event.composedPath() : this.event.path;
    if(path){
      path[0].classList.add('dxc-ctxm-active');
      console.log(path[0]);
    }else{
      console.error("Event path cannot be retrieved : ",this.event);
    }



    this.menuEl.nativeElement.style.display = 'block';
    this.menuEl.nativeElement.style.top = ((pEvent.clientY - pEvent.target.offsetHeight - 5))+'px';
    this.menuEl.nativeElement.style.left = pEvent.pageX+'px';
    this.menuEl.nativeElement.style.width = this.width+'px';
  }

  hide(pObject:any) :void {
    this.rendered = false;
    this.menuEl.nativeElement.style.display = 'none';

    const path = this.event.composedPath ? this.event.composedPath() : this.event.path;
    if(path && path[0]!=null){
      path[0].classList.remove('dxc-ctxm-active');
    }else{
      if(this.event.originalTarget.className.indexOf("dxc-ctxm-active")>-1){
        this.event.originalTarget.classList.remove('dxc-ctxm-active');
      }else{
        console.error("Event path cannot be retrieved : ",this.event);
      }

    }

  }

  @HostListener('document:click',['$event'])
  onClick(pEvent:any):void{
    if(this.rendered===false) return;

    if(pEvent.target.closest("div.context-menu")===null){
      this.hide(null);
    }
  }
}
