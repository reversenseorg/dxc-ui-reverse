import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {SubExplorerComponent} from "../explorer/subexplorer.component";
import {ItemEvent} from "../expandable-list/expandable-item.component";
import {Nullable} from "../Nullable";

@Component({
  selector: 'app-explorer-navbar',
  templateUrl: './explorer-navbar.component.html',
  styleUrls: ['./explorer-navbar.component.scss']
})
export class ExplorerNavbarComponent implements OnInit, AfterViewInit {

  @Input() explorer:SubExplorerComponent<any>;
  @Input() id:Nullable<string> = null;

  @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("snavRef", {read: ElementRef}) snavRef: ElementRef;

  selectedItem:string = '';

  constructor() { }

  ngOnInit(): void {
    //this.explorer.parent.resizeSrc.subscribe(this.onPanelResize);
  }

  ngAfterViewInit():void {
    (this.explorer.view.nav as any).size.height = parseFloat(window.getComputedStyle(this.snavRef.nativeElement).height);
  }

  onItemSelect( pItem:any, pEvent:any):void{
    this.menuItemClick.emit({ item:pItem });
  }


  onPanelResize(pEvent:any):void {
    if(this.id == null) return;

    let el = document.getElementById(this.id);
    if(el!=null)
      el.style.width = pEvent.dim.width+'px';
  }
}
