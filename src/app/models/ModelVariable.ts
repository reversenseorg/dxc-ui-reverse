import {NodeType} from "./NodeType";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";


export enum ModelVariableType {
  VAR,
  REG
}

interface ModelVariableReference {
  reg?:string;
  base?:string;
  offset?:string;
}

/**
 * Represents a local/global variable or argument of a function
 *
 * @class
 */
export class ModelVariable {

  __:NodeInternalType = NodeInternalType.VAR;
  _t:NodeType = NodeType.VAR;
  __t:ModelVariableType = ModelVariableType.VAR;
  n:string = "";
  type:string = "";
  refs:Nullable<ModelVariableReference> = null;

  getName():string{
    return this.n;
  }

  getType():string{
    return this.type;
  }

  getRef():Nullable<ModelVariableReference>{
    return this.refs;
  }
}
