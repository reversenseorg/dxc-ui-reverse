import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef, Input,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'dxc-breadcrumb-item',
  template: `
    <div [ngClass]="fixed==true? 'dxc-static':'dxc-item'">
      <div class="dxc-item-label"><ng-content></ng-content></div>
      <div class="dxc-item-arrow">
        <ng-container *ngIf="fixed || end; then arrowBlock else arrowTxt"></ng-container>
        <ng-template #arrowBlock>
          <fa-icon [icon]="['fas','caret-right']" class="dxc-item-arrow" #arrow></fa-icon>
        </ng-template>
        <ng-template #arrowTxt>
          &gt;
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbItemComponent implements OnInit {

  @Input() label:string;
  @Input() fixed:boolean = false;
  @Input() end:boolean = false;
  @ViewChild('arrow', {read: ElementRef, static:false}) arrow:ElementRef;

  constructor() { }

  ngOnInit(): void {

  }

  switchColor(){

  }
}


@Component({
  selector: 'dxc-breadcrumb',
  template: `
    <div class="dxc-breadcrumbs">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, AfterContentInit {

  @ContentChildren(BreadcrumbItemComponent) items:QueryList<BreadcrumbItemComponent>;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.items.first.fixed = true;
    this.items.last.end = true;
  }

}
