import {Component, Input, NgZone, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Observable} from "rxjs";


@Component({
  selector: 'dxc-status',
  template: `
        <ng-container *ngIf="waiting; then waitingScreen else statusScreen"></ng-container>
        <ng-template #waitingScreen>
          <fa-icon [icon]="['fas','circle-notch']" [spin]="true" class="waiting"></fa-icon>
        </ng-template>
        <ng-template #statusScreen>
          <fa-icon *ngIf="!status" [icon]="['fas','circle']" class="stopped"></fa-icon>
          <fa-icon *ngIf="status" [icon]="['fas','circle']" class="running"></fa-icon>
        </ng-template>
  `,
  styles: [`
    .running {
      color: greenyellow;
    }
    .stopped {
       color: red;
     }
    .waiting {
       color: white;
     }
  `]
})
export class StatusComponent implements OnInit {
  @Input() value:Observable<number>;

  waiting:boolean = true;
  status:number = 2;

  constructor(private ngZone: NgZone) {

  }

  ngOnInit() {
    this.value.subscribe( (pEvent) => {
        this.ngZone.run( () => {
          this.status = pEvent;
          this.waiting = false;
        });
    });
  }

  /*ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    if(changes.hasOwnProperty('value')){
      changes.value.currentValue.subscribe( pArgs => {

      });
    }
  }*/
}
