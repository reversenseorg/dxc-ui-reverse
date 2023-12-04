import {
  AfterContentInit,
  Component, ContentChildren,
  ElementRef, EventEmitter,
  HostListener,
  Input,
  OnInit, Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import {Nullable} from "../Nullable";

// add ng-content
/*
@Component({
  selector: 'dxc-grid-cell',
  template: `
    <div [ngClass]="'col-'+uwidth+(cellid==0 ? ' border-0':'')" class="dxc-grid-cell pl-1" (click)="changeState()">
       <input *ngIf="editState" type="text" class="form-input dxc-cell-input" style="width:800px" [name]="name" [(ngModel)]="data" (keyup.enter)="onEnter($event)"/>
       <span *ngIf="!editState" >{{ data }}</span>
    </div>
  `,
  styleUrls: ['../../grid.scss','../../forms.scss']
})*/
export class GridCellComponent implements OnInit {

  uid:string;
  @Input() editable: boolean = false;
  @Input() opts: any = null;
  @Input() data: any = null;
  @Input() name:string = "";
  @Input() rowid: number = -1;
  @Input() cellid: number = -1;

  @Input() width: number = -1;
  @Input() height: number = 5 * 15;
  @Input() uwidth: number = 1;

  @Output() edit: EventEmitter<any> = new EventEmitter();

  editState: boolean;


  constructor() {

  }


  ngOnInit(): void {
    this.uid = this.rowid + ':' + this.cellid;
    this.editState = false;
  }

  getUID(): string {
    return this.uid;
  }

  changeState( pClick:boolean = true): void {
    if ( this.editable ){
      // editable cell can be turned into input text with a single click
      if(!this.editState){
        this.editState = true;
      }
      else if ( !pClick){
        this.editState = false;
      }
    }
  }

  onEnter(pEvent: any) {
    pEvent.stopPropagation();
    this.editState = false;
    this.edit.emit({ name: this.name, value: this.data });
  }
}

/*
@Component({
  selector: 'dxc-grid-col',
  template: `
    <div class="dxc-grid-col">{{ label }}</div>
  `,
  styleUrls: ['../../grid.scss']
})*/
export class GridColComponent implements OnInit {

  uid:string;
  @Input() offset: number;
  @Input() label: string;
  @Input() field: string;

  @Input() sortable: boolean = false;

  @Input() colid: number = -1;

  @Input() width: number = -1;
  @Input() height: number = 5 * 15;

  @Output() sort: EventEmitter<string> = new EventEmitter<string>();



  constructor() {

  }

  ngOnInit(): void {

  }


  @HostListener('document:click',['$event'])
  onClick(pEvent:any):void{
    if(this.sortable){
      this.sort.emit(this.field);
    }
  }
}

/*
@Component({
  selector: 'dxc-grid-row',
  template: `
    <div class="row no-gutters dxc-grid-row" [style.height]="height">
      <ng-content></ng-content>
      <!-- <dxc-grid-cell *ngFor="let d of data; let i = index; trackBy: cellIdentify" [data]="d" [cellid]="i" [rowid]="rowid"></dxc-grid-cell> -->
    </div>
  `,
  styleUrls: ['../../grid.scss']
})*/
export class GridRowComponent implements OnInit {

  @Input() colsize: number[] = [];

  @Input() name:Nullable<string> = null;
  @Input() data: any = null;

  @Input() rowid: number;
  @Input() width: number = 160;
  @Input() height: number = 15;

  //@ViewChild('menu', {read: ElementRef}) menuEl:ElementRef;
  @ContentChildren(GridCellComponent) cells:QueryList<GridCellComponent>;


  constructor() {

  }

  ngOnInit(): void {

  }

  cellIdentify( pIndex:number, pItem:any):string {
    return pItem.getUID();
  }

  getRowID():number {
    return this.rowid;
  }


  @HostListener('document:click',['$event'])
  onClick(pEvent:any):void{

  }
}



/*
@Component({
  selector: 'dxc-grid',
  template: `
    <div class="row no-gutters dxc-grid">
      <ng-container *ngIf="header==true">
        <div class="dxc-grid-row" [style.height]="height">
          <dxc-grid-cell *ngFor="let d of data; let i = index; trackBy: cellIdentify" [data]="d" [cellid]="i" [rowid]="rowid"></dxc-grid-cell>
        </div>
      </ng-container>
      <dxc-grid-row *ngFor="let d of data; let i = index; trackBy: rowIdentify" [data]="data" [rowid]="i"></dxc-grid-row>
    </div>

  `,
  styleUrls: ['../../grid.scss']
})*/
export class GridComponent implements OnInit {

  @Input() size: number = -1;
  @Input() name:Nullable<string> = null;
  @Input() data: any = null;
  @Input() header: boolean = false;

  @Input() width: number = 160;
  @Input() height: number = 5 * 15;

  //@ViewChild('menu', {read: ElementRef}) menuEl:ElementRef;

  @ContentChildren(GridRowComponent) rows:QueryList<GridRowComponent>;
  @ContentChildren(GridColComponent) cols:QueryList<GridColComponent>;


  constructor() {

  }

  ngOnInit(): void {

  }


  getRows():QueryList<GridRowComponent> {
    return this.rows;
  }

  getCols():QueryList<GridColComponent> {
    return this.cols;
  }

  rowIdentify( pIndex:number, pItem:any):string {
    return pItem.getUID();
  }
}
