

export interface IconModelCollection {
  [iconName:string] :IconModel
}

export enum ICON_TYPE {
  ICON = 'img',
  TEXT = 'txt'
}

export class IconModel {
  iconType: ICON_TYPE = ICON_TYPE.ICON;
  type: string = null;
  name: string = null;
  label: string = null;
  color1: string = null;
  color2: string = null;
  style: string = null;
  spin: boolean = false;

  src?:string = null;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) {
        if(this.hasOwnProperty(i))
          this[i] = pConfig[i];
      }
    }
  }
}
