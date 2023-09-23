import { NodeInternalType } from "../NodeInternalType";
import HookStrategy from "./HookStrategy";
import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";


export default class HookTemplateFragment {

    __:NodeInternalType = NodeInternalType.HOOK_FRAGMENT;

     _uid:Nullable<string> = null;

     name:Nullable<string> = null;

     descr:Nullable<string> = null;

     _strategy: any = null;

     _descr:Nullable<string> = null;

     _tpl: Nullable<string> = null;

     _w = -1;

     _cache:Nullable<string> = null;

     _preproc = true;

     _keypoint:Nullable<string> = null;
    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:any=null){

        // this.requiresNode = [];
        if(pConfig!=null)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];


    }


    setUID(pUID:string){
      this._uid = pUID;
    }

    getUID():Nullable<string> {
      return this._uid;
    }

    set description(pDescr:string) {
        this._descr = pDescr;
    }

    get description():Nullable<string> {
        return this._descr
    }


    set weight(pWeight:number) {
      if(pWeight===null){
        this._w = -1;
      }else
        this._w = pWeight;
    }

    get weight():number {
        return this._w
    }


    set template(pTpl:string) {
        this._tpl = pTpl;
    }

    get template():Nullable<string> {
        return this._tpl
    }

    get strategy():any {
        return this._strategy
    }

    setStrategy(pStrategy:HookStrategy){
      this._strategy = pStrategy;
    }


    isPreProcessed():boolean {
        return this._preproc;
    }

    enablePreproc( pBool = true){
        this._preproc = pBool;
    }

    getStrategy():any {
        return this._strategy;
    }

    setCodeTemplate(pTpl:string):void {
        this._tpl = pTpl;
    }

    getCodeTemplate():Nullable<string> {
        return this._tpl;
    }


    getGeneratedCode():Nullable<string> {
      return this._cache;
    }

    static fromJsonObject(pObject:any){
      const o:HookTemplateFragment = new HookTemplateFragment();

      if(pObject._uid != null){
        o._uid = pObject._uid;
      }
      o.name = pObject.name;
      o.description = pObject.descr;
      o._w = pObject.weight;
      if(o._w==null) o._w = -1;

      o.template = pObject.tpl;
      o._cache = pObject._cache;
      o._preproc = pObject._preproc;

      return o;
    }
}
