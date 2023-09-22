import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'dxc-statebar',
  templateUrl: './statebar.component.html',
  styleUrls: ['./statebar.component.scss'],
  styles: [`
    .dxc-statebar {
      line-height:20px;
      max-height:20px;
      background: #333;

      position: fixed;
      bottom:0px;
      min-width:100vw;
      color:white;
      font-size:0.8em;
    }
  `]
})
export class StatebarComponent implements OnInit, OnChanges {

  @Input() height:number = 20;
  @ViewChild('statebar',{ static:true, read:ElementRef}) bar:ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('height')){
      this.bar.nativeElement.style.height = changes.height.currentValue+'px';
      this.bar.nativeElement.style.maxHeight = changes.height.currentValue+'px';
    }
  }

}
