import vm from "node:vm";
import DexcaliburProject from "./DexcaliburProject";
import DexcaliburEngine from "./DexcaliburEngine";

export enum DXC_LIFECYCLE_EVENT {
  NEW_ENGINE,
  OPEN_PROJECT,
  NEW_PROJECT,
  CLOSE_PROJECT
}

export class DexcaliburPatch {

  private _code:string;
  version:string;
  time:string;
  desr:string;
  ev:DXC_LIFECYCLE_EVENT;

  constructor(pConfig:any) {
    for(let i in pConfig){
      this[i] = pConfig[i];
    }
  }

  static fromJsonObject( pConfig:any):DexcaliburPatch {
    return new DexcaliburPatch(pConfig);
  }
}

/**
 *
 */
export class DexcaliburUpdater {

  engine:DexcaliburEngine = null;

  patches:DexcaliburPatch[] = [];


  constructor(pEngine:DexcaliburEngine) {
    this.engine =   pEngine;
  }
}
