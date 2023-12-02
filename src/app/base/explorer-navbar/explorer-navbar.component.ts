import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input, OnChanges,
  OnInit,
  Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {SubExplorerComponent} from "../explorer/subexplorer.component";
import {Nullable} from "../Nullable";

@Component({
  selector: 'app-explorer-navbar',
  templateUrl: './explorer-navbar.component.html',
  styleUrls: ['./explorer-navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExplorerNavbarComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() explorer:SubExplorerComponent<any>;
  @Input() id:Nullable<string> = null;

  @Output() menuItemClick: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("snavRef", {read: ElementRef}) snavRef: ElementRef;

  selectedItem:string = '';

  constructor(
      private changeDetectionRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //this.explorer.parent.resizeSrc.subscribe(this.onPanelResize);
  }

  ngOnChanges(pChanges: SimpleChanges) {
    if(pChanges.explorer!=null){
      this.changeDetectionRef.detectChanges();
    }
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
