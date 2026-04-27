
/**
 * Constant values describing a stub type.
 */
import {INode} from "./INode";
import {NodeInternalType} from "./NodeInternalType";
import {Tag} from "./tags/Tag";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";
import {RenderedModelNode, RenderingOptions} from "../base/RenderedModelNode";

export enum STUB_TYPE {
    METHOD= 0x1,
    FIELD= 0x2,
    ANNOTATION= 0x3,
    INSTR= 0x4,
    MISSING= 0x5,
    CLASS= 0x6,
    OBJ_TYPE= 0x7,
    BASIC_TYPE= 0x8,
    VALUE_CONST= 0x9,
    STRING_VALUE= 0xa,
    CIRCULAR= 0xb,
    VARIABLE= 0xc,
    CALL= 0xd,
    NATIVE_FUNC= 0xe,
    SYSCALL= 0xf,
    TAG
}



export class Stub
{
    __type__:number = -1;

    constructor(type:number, data:any, exclude:any=null){
        this.__type__ = type;
        if(exclude==null) exclude=[];

        for(const i in data){
            if(exclude.indexOf(i)==-1)
                (this as IStringIndex<any>)[i]=data[i]
        }

    }

}

/**
 *
 */
export class Savable  extends RenderedModelNode implements INode, IStringIndex<any>
{
  _uid:Nullable<any>;
  __:NodeInternalType;
  $:STUB_TYPE;
  tags:number[] = []

  constructor(pType:STUB_TYPE, pUi?:RenderingOptions) {
      super(pUi);
      this.$ = pType;
  }

  export( pStubType:Nullable<STUB_TYPE>=null, pExclude:string[]= []):Stub{
    return new Stub(
      (pStubType!=null ? pStubType : this.$),
      this,
      pExclude
    )
  }

  import( pConfig:any):any{
    for(const i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];

    return this;
  }


  addTag(vTag:Tag){
    const uuid = vTag.getUUID();
    if(this.tags.indexOf(uuid)==-1)
      this.tags.push(uuid);
  }

  hasTag(vTag:Tag):boolean{
    const uuid = vTag.getUUID()
    for(let i=0; i<this.tags.length; i++){
      if(this.tags[i]===uuid){
        return true;
      }
    }
    return false;
  }

  getTags():number[]{
    return this.tags;
  }

  getUID(): Nullable<any> {
    return this._uid;
  }
}
