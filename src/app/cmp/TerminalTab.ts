import {IconView} from "./IconView";


export class TerminalTab {

  uid:string = null;
  offset:number = -1;
  label:string = "";
  icon:IconView = null;
  color:string = '';
  closable:boolean = false;

  constructor(pConfig:any=null) {
    if(pConfig != null){
      for(let i in pConfig) if(this.hasOwnProperty(i)) this[i] = pConfig[i];
    }
  }
}
