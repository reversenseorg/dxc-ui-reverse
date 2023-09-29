
import {IconModel} from "../base/icon/IconModel";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export class NavbarTab {

  uid:Nullable<string> = null;
  offset:number = -1;
  label:string = "";
  icon:Nullable<IconModel> = null;
  iconColor:string = '';
  color:string = '';
  closable: boolean = true;
  selected:boolean = false;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig)
        (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }


}
