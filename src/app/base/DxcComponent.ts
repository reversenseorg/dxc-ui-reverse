
export class DxcComponent {

  configure(pConfig:any=null) :void {
    if(pConfig != null){
      for(let i in pConfig)
        if(this.hasOwnProperty(i)) (this as IStringIndex<any>)[i] = pConfig[i];
    }
  }
}
