
import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ComponentFactory, ComponentFactoryResolver,
  ContentChildren,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {ExpandableItemComponent} from "./expandable-item.component";
import {ExplorerItem} from "../../cmp/ExplorerItem";

export interface ExpandableItem<T> {
  cmp: ExpandableItemComponent<T>,
  item: T
}

@Component({
  selector: 'app-expandable-list',
  templateUrl: './expandable-list.component.html',
  styleUrls: ['./expandable-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableListComponent<T> implements OnInit, AfterViewInit {


  @Input() parentItem:any;
  //@Input() pool:T[];
  @Input() hasChildren:Function;
  @Input() renderItem:Function;
  //@Input() getChildren:Function;
  @Input() getIcon:Function;

  @ViewChild("expandListRef", {read: ElementRef}) expandListRef:ElementRef;
  @ContentChildren(ExpandableItemComponent) items: QueryList<ExpandableItemComponent<T>>

  constructor(
    private changeDetectorRef:ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {

  }

  ngAfterViewInit():void {
    this.changeDetectorRef.detach();
  }


  r = 0;
  checkRendering(){
    this.r++;
    return '';
  }

  onExpand( pItem:ExpandableItem<T>):void {
    alert("ExpandableList (global) onExpand");
  }

  onCollapse( pItem:ExpandableItem<T>):void {
    alert("ExpandableList (global) onCollapse");
  }

}
