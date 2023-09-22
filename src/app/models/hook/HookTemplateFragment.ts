import { NodeInternalType } from "../NodeInternalType";
import HookStrategy from "./HookStrategy";


export default class HookTemplateFragment {

    __:NodeInternalType = NodeInternalType.HOOK_FRAGMENT;

     _uid:string = null;

     name:string = null;

     descr:string = null;

     _strategy: any = null;

     _descr:string = null;

     _tpl: string = null;

     _w = -1;

     _cache:string = null;

     _preproc = true;

     _keypoint:string = null;
    /**
     * Group of hook
     *
     * @param {*} config
     */
    constructor(pConfig:any=null){

        // this.requiresNode = [];
        if(pConfig!=null)
            for(let i in pConfig)
                this[i] = pConfig[i];


    }


    setUID(pUID:string){
      this._uid = pUID;
    }

    getUID():string {
      return this._uid;
    }

    set description(pDescr:string) {
        this._descr = pDescr;
    }

    get description():string {
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

    get template():string {
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

    getCodeTemplate():string {
        return this._tpl;
    }


    getGeneratedCode():string {
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
