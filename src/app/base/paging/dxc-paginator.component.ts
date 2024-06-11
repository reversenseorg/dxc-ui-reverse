import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";




@Component({
  selector: 'dxc-paginator',
  templateUrl: './dxc-paginator.component.html',
  styleUrls: ['./dxc-paginator.component.scss','../../forms.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {

  /**
   * Count of rows currently displayed
   * @type {number}
   */
  @Input() rows: number = -1;
  @Input() startAt: number = 0;
  @Input() page:number = 0;
  @Input() totalRecords: number;
  @Input() dropdownRowsPerPage = false;
  @Input() pageSizes:number[] = [10,50,100];
  @Output() onPageChange:EventEmitter<any> = new EventEmitter();


  _style = null;
  _class = null;

  range = { offset:1, size:10 };

  gIcons:any = GLOBAL_ICONS;



  constructor(private changeDetectorRef: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    if(this.rows==-1){
      this.rows = this.pageSizes[0];
    }

    this.range = {
      offset: this.startAt,
      size: this.rows
    };

  }



  goTo(pDirection: "prev"|"next") {
    let range = {
      offset:0,
      size: this.rows
    };
    let page = this.page;

    if(pDirection === "prev"){
       page--;

       if(page<0)
         return;
       else
         range.offset = page*this.rows;
    }else{
       page++;
       range.offset = page*this.rows;

       if(range.offset>this.totalRecords){
         return;
       }

       const d = this.totalRecords - range.offset;
       if(d<this.rows){
         range.size = d;
       }
    }

    this.page = page;
    this.range = range;

    console.log("goTo > ",pDirection);
    this.onPageChange.emit(range);
    this.changeDetectorRef.detectChanges();
  }
}
