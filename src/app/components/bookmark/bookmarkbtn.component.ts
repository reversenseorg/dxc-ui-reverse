import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {GLOBAL_ICONS} from "../../cmp/GLOBAL_ICONS";

@Component({
  selector: 'dxc-bookmark-btn',
  template: `
    <ng-container *ngIf="type=='nb'">
      <app-subnavbar-btn *ngIf="form=='btn'" [icon]="gIcons.BOOKMARK">
        Add bookmark
      </app-subnavbar-btn>
      <app-subnavbar-menu *ngIf="form=='menu'" [label]="'Mark'" [icon]="gIcons.BOOKMARK">
        <app-subnavbar-btn [icon]="gIcons.PLUS" (click)="addBm()">Custom</app-subnavbar-btn>
        <app-subnavbar-btn [separator]="true" (click)="addBm('integrity')">Obfuscation</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Hook detection')">Integrity check</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Hook detection')">Device Fingerprint</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Root detection')">Root detection</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Hook detection')">Hook detection</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Runtime integrity')">Runtime integrity</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Hook detection')">Remote attestation</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm('Secure wipe')">Secure wipe</app-subnavbar-btn>
        <app-subnavbar-btn [separator]="true" (click)="addBm()">PIN validation</app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm()">Enrollment </app-subnavbar-btn>
        <app-subnavbar-btn (click)="addBm()">Replenishment</app-subnavbar-btn>
        <app-subnavbar-btn [separator]="true" (click)="markData()">PIN</app-subnavbar-btn>
        <app-subnavbar-btn (click)="markData()">PAN</app-subnavbar-btn>
        <app-subnavbar-btn (click)="markData()">SUK / LUK</app-subnavbar-btn>
        <app-subnavbar-btn (click)="markData()">Masked PAN</app-subnavbar-btn>
        <app-subnavbar-btn (click)="markData()">Cryptogram</app-subnavbar-btn>
        <app-subnavbar-btn (click)="markData()">APDU</app-subnavbar-btn>
      </app-subnavbar-menu>
    </ng-container>
  `,
  styleUrls: ['./bookmarkbtn.component.scss'],
})
export class BookmarkButtonComponent implements OnInit {

  @Input() type:string = 'nb';
  @Input() form:string = 'btn';

  @Output() markAs:EventEmitter<any> = new EventEmitter<any>();

  gIcons:any = GLOBAL_ICONS;

  constructor() { }

  ngOnInit(): void {
  }

  addBm( pType:string = null) {

  }

  markData() {

  }
}
