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
import {BreadcrumbItemComponent} from "../breadcrumb/breadcrumb.component";

@Component({
  selector: 'dxc-input-text',
  template: `

  `,
  styleUrls: ['./breadcrumb.component.scss']
})
export class DxcInputTextComponent implements OnInit {

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
export class TextInputComponent implements OnInit, AfterContentInit {

  @ContentChildren(BreadcrumbItemComponent) items:QueryList<BreadcrumbItemComponent>;

  constructor() { }

  ngOnInit(): void {

  }

  ngAfterContentInit(): void {
    this.items.first.fixed = true;
    this.items.last.end = true;
  }

}
