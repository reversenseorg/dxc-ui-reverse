import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {IconModel} from "./IconModel";

export enum ICON_TYPE {
  ICON = 'img',
  TEXT = 'txt'
};

// [ngStyle]="{ '--fa-primary-color':color1, '--fa-secondary-color':color2 }"
/**
 *
 */
@Component({
  selector: 'dxc-icon',
  template: `
      <ng-container *ngIf="iconType=='img';  then icon else text"></ng-container>
      <ng-template #icon>
        <fa-icon *ngIf="type=='fad'" [icon]="[type,name]" [spin]="spin" [ngClass]="color1" [fixedWidth]="fw" ></fa-icon>
        <fa-icon *ngIf="type=='fas' || type=='fal' || type=='fal' || type=='fab'" [icon]="[type,name]" [spin]="spin" [ngClass]="color1" [fixedWidth]="fw" ></fa-icon>
        <img *ngIf="type=='svg'" [src]="src" [ngClass]="color1" [ngStyle]="style"/>
      </ng-template>
      <ng-template #text>
        <span [ngStyle]="style" [ngClass]="color1"><ng-content select="[before]"></ng-content>{{ label }}<ng-content select="[after]"></ng-content></span>
      </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent implements OnInit, OnChanges {
  @Input() iconType: ICON_TYPE = ICON_TYPE.ICON;

  /**
   * Fixed Width
   * @type string
   */
  @Input() fw:boolean = false;

  /**
   * Icon source such as 'fas','fab',...
   * TODO : add support for others source (not only Font Awesome)
   * @type string
   */
  @Input() type:string = null;

  /**
   * Icon name
   * @type string
   */
  @Input() name:string = null;

  /**
   * Icon primary color (class name)
   * @type string
   */
  @Input() color1:string = null;

  /**
   * Icon secondary color (class name)
   * @type string
   */
  @Input() color2:string = null;

  /**
   *
   * @type string
   */
  @Input() style:any = null;


  /**
   * Icon name
   * @type string
   */
  @Input() label:string = null;

  @Input() model: IconModel = null;

  @Input() spin: boolean = false;

  @Input() src: string = "";

  constructor() {

  }

  ngOnInit() {
  }

  ngOnChanges(pChanges: SimpleChanges) {
      if (pChanges.hasOwnProperty('model')) {
          this.configure(pChanges.model.currentValue);
      }
      if (pChanges.hasOwnProperty('color1')) {
        this.color1 = pChanges.color1.currentValue;
      }
  }

  configure(pConfig:any=null) :void {
    if(pConfig != null){
      for(let i in pConfig)
        if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }


  }
}
