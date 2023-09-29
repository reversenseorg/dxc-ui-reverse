import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  EventEmitter,
  ComponentFactory,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  TemplateRef,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ExplorerItem} from "../../cmp/ExplorerItem";
import {ExplorerDirective} from "../explorer/explorer.directive";
import {ExpandableDirective} from "./expandable.directive";
import {ExpandableProvider} from "./expandable-provider";
import {IStringIndex} from "../IStringIndex";


enum ITEM_STATE {
  EXPANDED,
  COLLAPSED
}


export interface ItemEvent<T> {
  ref: ElementRef,
  item: T
}


// @ts-ignore
@Component({
  selector: 'app-expandable-item',
  template: `
    <ng-template #expItemTpl let-itemCtx="cfg">
      <li class="dxc-text-75 exp-item" [ngClass]="{'hidden': hidden }" [style.padding-left]="itemCtx.depth+'em'" (keydown.arrowDown)="goNext($event, itemCtx.item, itemRef)"  (dblclick)="onArrowClick($event, itemCtx.item, itemRef)" (keyup.arrowLeft)="doCollapse($event, itemCtx.item, itemRef)" (keyup.arrowRight)="doExpand($event, itemCtx.item, itemRef)" (keyup.enter)="onArrowClick($event, itemCtx.item, itemRef)" (click)="onFocus($event, itemCtx.item, itemRef)"  #itemRef>

        <fa-icon *ngIf="e" [icon]="['fad','caret-right']" class="dxc-text-75 caret" (click)="onArrowClick($event, itemCtx.item, itemRef)"></fa-icon>
        <!-- <ng-content select="[content-root]"></ng-content> -->
        <ng-container *ngTemplateOutlet="itemCtx.tpl ; context: {item: itemCtx.item}"></ng-container>
      </li>
      <ng-template expandedHost></ng-template>
    </ng-template>

    <ng-container *ngTemplateOutlet="expItemTpl; context: { cfg: {item: this.item, depth:this.depth, tpl:this.itemTpl } }"></ng-container>
    <!-- expandable <ng-template expandedHost></ng-template>-->
  `,
  styleUrls: ['./expandable-list.component.scss'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableItemComponent<T> implements OnInit, AfterViewInit {

  hidden = false;
  state: ITEM_STATE = ITEM_STATE.COLLAPSED;
  @Input() depth = 1;
  children: ComponentRef<any>[] = [];

  @Input() hasChildren:any;

  @Input() itemTpl:TemplateRef<any>;
  @Input() itemType:any; //string;
  @Input() itemTypeName:string; //string;
  @Input() item:any; // ModelPackage | ModelClass

  @Input() provider:any; //ExpandableProvider;
  //@Input() expandable:boolean;
  @Input() expandableFn:Function = (()=>{});

  @Output() expand:EventEmitter<ItemEvent<T>> = new EventEmitter<ItemEvent<T>>();
  @Output() collapse:EventEmitter<ItemEvent<T>> = new EventEmitter<ItemEvent<T>>();
  @Output() itemFocus:EventEmitter<any> = new EventEmitter<T>();
  @Output() contextmenu_click:EventEmitter<any> = new EventEmitter<T>();

  @ViewChild("itemRef", {read: ElementRef}) itemRef:ElementRef;
  @ViewChild("expItemTpl", {read: TemplateRef}) expItemTpl:TemplateRef<any>;

  @ViewChild(FaIconComponent) arrowIcon:FaIconComponent;
  @ViewChild(ExpandableDirective, {static: false}) expandedHost: ExpandableDirective;


  // TRUE if expendable
  /**
   * An arbitrary function to check if an item can be expanded or not
   * @type {(()=>boolean)|boolean}
   */
  e = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {
    this.e = this.expandableFn(this.item);
    // detach from change detector
    // this.changeDetectorRef.detach();
  }

  ngAfterViewInit() {
    // detach from change detector
    this.changeDetection$disable();
  }

  changeDetection$enable() {
    //this.changeDetectorRef.reattach();
  }

  changeDetection$disable() {
    //this.changeDetectorRef.detach();
  }


  /**
   * To render arrow icon according to item state (collapsed or expanded)
   *
   * @method
   * @private
   */
  private renderArrow():void {
    if(this.state == ITEM_STATE.EXPANDED)
      this.arrowIcon.rotate = 90;
    else{
      this.arrowIcon.rotate = 270;
    }

    this.arrowIcon.render();
  }

  /**
   * To filter displayed children according to an arbitrary condition
   *
   * TODO : Infinite scroll : update frame size and load more item
   *
   * @param {()=>boolean} pCondition
   */
  filterChildren( pCondition:any):void {
    const filt:IStringIndex<((val:any)=>boolean)> = {};

    for(const p in pCondition){
      if(Array.isArray(pCondition[p])){
        filt[p] = (x)=>{ return (pCondition[p].indexOf(x) > -1);}
      }else{
        filt[p] = (x)=>{ return (pCondition[p] === x);}
      }
    }


    this.children.map( (vChild:any) => {
      let success = true;

      for(const ppt in filt){
        //console.log(vChild,vChild.instance.item.hasOwnProperty(ppt),(filt[ppt])(vChild.instance.item[ppt]));
        success = success && vChild.instance.item.hasOwnProperty(ppt);
        if(!success) break;
        success = success && (filt[ppt])(vChild.instance.item[ppt]);
        if(!success) break;
      }

      if(!success){
        vChild.instance.hide();
      }else{
        vChild.instance.show();
      }
    });
  }

  /**
   * To hide an item
   *
   * It doesn't destroy it
   *
   * @method
   */
  hide(){
    this.hidden = true;
  }

  /**
   * To show an item
   *
   * @method
   */
  show(){
    this.hidden = false;
  }

  /**
   * To dynamically render children by creating new components instance
   * and inject it into DOM
   *
   * TODO : add infinite scroll
   *
   * @param pChildren
   * @method
   */
  renderChildren( pChildren:any = null ):void {

    console.log("Rendering children of ",this.item);

    const children:any = (pChildren!=null)? pChildren : this.provider.itemGetChildren(this.item); //this.item.children;
    const viewContainerRef:ViewContainerRef = this.expandedHost.viewContainerRef;
    viewContainerRef.clear();

    const itemFactory:ComponentFactory<ExpandableItemComponent<any>> = this.componentFactoryResolver.resolveComponentFactory(ExpandableItemComponent);
    let itemCmp:ComponentRef<ExpandableItemComponent<T>>;

    if(this.e){ this.renderArrow(); }


    let t = 0, t2:number[] = [], t3 =0, c:any = null;
    t=(new Date()).getTime()

    for(let i=0; i<children.length; i++){

      c = children[i];
      if(c==null) continue;

      //t2.push((new Date()).getTime());
      itemCmp = viewContainerRef.createComponent( itemFactory);

      itemCmp.instance.item = c;
      itemCmp.instance.itemTpl = this.itemTpl;
      itemCmp.instance.itemType = (this.itemTypeName!=null ? c[this.itemTypeName] : c._t); // TODO : make _t dynamic

      if(this.expandableFn!=null){
        itemCmp.instance.expandableFn = this.expandableFn;
        itemCmp.instance.e = this.expandableFn(c);
      }


      if(itemCmp.instance.e)
        itemCmp.instance.depth = this.depth+1;
      else
        itemCmp.instance.depth = this.depth+2;

      // true; //(itemCmp.instance.item.hasOwnProperty('size'))&& (itemCmp.instance.item.size > 0);
      itemCmp.instance.provider = this.provider;
      itemCmp.instance.itemFocus = this.itemFocus;
      itemCmp.instance.expand = this.expand;
      itemCmp.instance.collapse = this.collapse;

      // [PERF] If ChangeDetectionStrategy.OnPush enabled on parents
      //itemCmp.changeDetectorRef.detectChanges();


      itemCmp.instance.changeDetection$enable();

      this.children.push(itemCmp);
      //t2.push((new Date()).getTime()-t2.pop());
    }

    console.log('render list items (after)>', (new Date()).getTime()-t, 'ms');
    //t2.map((vT:any) => {3 += vT; });
    console.log('create item avg>',  t3 /*t3/t2.length*/, 'ms');

    if((this.provider as any).changeDetectorRef!=null){
      (this.provider as any).changeDetectorRef.markForCheck();
    }
  }

  /**
   * Internal listener trigged ultimately when the user dblclick on expanded item, or press
   * some keys
   *
   * @param {ItemEvent<T>} pItemEv
   * @method
   */
  onExpand( pItemEv:ItemEvent<T>):void{

    console.log("onExpand", this, pItemEv, this.provider.itemHasChildren(this.item));
    let t = 0, c:any = null;
    t=(new Date()).getTime()

    this.changeDetection$enable();

    if(this.expandableFn(this.item)){

//      if(this.item.children == null){
      if(this.provider.itemHasChildren(this.item)){
        this.provider.expand( this.item, this.itemType ).subscribe( (pData:any) => {
          //this.item.children = pData;
          //console.log(this.item.children);
          this.renderChildren();//this.item.children); // pData
        });
      }
      //else if(this.item.children.length==1 && this.item.children[0]._t=="wait"){
      else if(this.provider.itemHasLazyChildren(this.item)){
        this.renderChildren();
        this.provider.expand( this.item, this.itemType ).subscribe( (pData:any) => {
          //this.item.children = pData;
          this.renderChildren();//this.item.children); //pData
        });
      }else{
        this.renderChildren();
      }

    }else{
      this.provider.open( this.item);
    }

    this.changeDetection$disable();
//    console.log('after expand>', (new Date()).getTime()-t, 'ms');
  }

  /**
   * Internal listener trigged ultimately when the user dblclick on expanded item, or press
   * some keys
   *
   * It destroys children components (including hidden components if filtering is applied)
   * and update arrow icon.
   *
   * @param {ItemEvent<T>} pItemEv
   * @method
   */
  onCollapse( pItemEv:ItemEvent<T>):void {
    this.children.map( (vEl:ComponentRef<any>) => {
      vEl.destroy();
    });
    if(this.e) {
      this.renderArrow();
    }
  }

  /**
   * To handle dblclick event on item.
   *
   * It acts as internal intermediate listener and switch between "onExpand" and "onCollapse"
   * according to item status (collapsed or expanded)
   *
   * @param {MouseEvent} pEvent
   * @param {any} pItem
   * @param {HTMLLIElement} pRef
   * @method
   */
  onArrowClick( pEvent:any, pItem:any, pRef:any):void{

    if(this.state == ITEM_STATE.COLLAPSED) {
      this.state = ITEM_STATE.EXPANDED;
      this.onExpand({ item:pItem, ref:pRef });
    }else {
      this.state = ITEM_STATE.COLLAPSED;
      this.onCollapse({ item:pItem, ref:pRef });
    }
  }

  /**
   * To handle keyboard events triggering item collapse.
   *
   *
   * @param {MouseEvent} pEvent
   * @param {any} pItem
   * @param {HTMLLIElement} pRef
   * @method
   */
  doExpand( pEvent:any, pItem:any, pRef:any):void{
    console.log("Do expand");
    if(this.state == ITEM_STATE.COLLAPSED) {
      this.state = ITEM_STATE.EXPANDED;
      this.onExpand({item: pItem, ref: pRef});
    }
  }

  /**
   * To handle keyboard events triggering item expand.
   *
   *
   * @param {MouseEvent} pEvent
   * @param {any} pItem
   * @param {HTMLLIElement} pRef
   * @method
   */
  doCollapse( pEvent:any, pItem:any, pRef:any):void{
    console.log("Do collapse");
    if(this.state == ITEM_STATE.EXPANDED) {
      this.state = ITEM_STATE.COLLAPSED;
      this.onCollapse({ item:pItem, ref:pRef });
    }
  }


  goNext( pEvent:any, pItem:any, pRef:any):void{
    // si expanded, le prochain est l'enfant sinon c'est le frere
  }

  /**
   * To handle focus event
   *
   * It can be used when the user perform a copy to clipboard, in such case
   * the focused item must be copied.
   *
   * @param {MouseEvent} pEvent
   * @param {T} pItem
   * @param {HTMLLIElement} pRef
   * @method
   */
  onFocus( pEvent:any, pItem:any, pRef:any):void {
    this.itemFocus.emit({ item:pItem,  el:pRef });
  }
}
