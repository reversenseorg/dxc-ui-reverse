
export class EngineSettings {

  heapSize:number ;

  constructor(pConfig:any) {
    for(let i in pConfig) this[i] = pConfig[i];
  }

}
