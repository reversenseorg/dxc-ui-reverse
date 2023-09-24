import KeyPoint from "./KeyPoint";
import HookTemplateFragment from "./hook/HookTemplateFragment";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";



export enum HOOK_FRAGMENT_POS {
    BEFORE = 'before',
    AFTER = 'after',
    REPLACE = 'replace',
}

export const UID_POS_MAPPING = {
    [HOOK_FRAGMENT_POS.BEFORE]: "bef",
    [HOOK_FRAGMENT_POS.AFTER]: "aft",
    [HOOK_FRAGMENT_POS.REPLACE]: "repl",
};

/**
 * The abstraction for all Java and Native hook
 */
export class AbstractHook {

    public name:Nullable<string>;

    public __:NodeInternalType;

     _t:Nullable<NodeInternalType> = null;

     _uid:Nullable<string> = null;

    //protected _hookset:HookSet = null;

    /**
     * Key Point from where the hook is loaded or unload
     * @protected
     */
     _kp:Nullable<KeyPoint> = null;

     _loadkp:Nullable<KeyPoint> = null;

     _unloadkp:Nullable<KeyPoint> = null;


      script:string;

    /**
     * Hold hook fragment called after target method call
     * @protected
     */
      _after:HookTemplateFragment[] = [];

    /**
     * Hold hook fragment called before target method call
     * @protected
     */
      _before:HookTemplateFragment[] = [];

    /**
     * Hold hook fragment called instead of target method call
     * @protected
     */
      _replace:HookTemplateFragment[] = [];


    /**
     * Hold the ID of variable shared with previous executions
     * @protected
     */
      _varID:Nullable<string> = null;

      _enabled = true;

      _code:Nullable<string> = null;

      _vars:IStringIndex<any> = {};

     customName:Nullable<string> = null;

     color:Nullable<string> = null;

     _time:number = -1;
    /**
     *
     */
     parentID:Nullable<string> = null;

     edited = false;

     id?:string;


     constructor(pConfig:any = null) {
       if(pConfig != null){
         for(const i in pConfig) (this as IStringIndex<any>)[i] = pConfig[i];
       }
     }

    setGUID( pGUID:string){
        this._uid = pGUID;
    }

    getGUID():Nullable<string>{
       if(this._uid != null){
         return this._uid;
       }
       return this.id;
    }


    getVariable(pID:string):Nullable<string>{
        return this._vars[pID];
    }

    setVariableID(pID:string){
        this._varID = pID;
    }

    getVariableID():Nullable<string> {
        return this._varID;
    }

    getLoadKeyPoint():Nullable<KeyPoint> {
        return this._loadkp;
    }

    getUnloadKeyPoint():Nullable<KeyPoint> {
        return this._unloadkp;
    }


    setLoadKeyPoint(pKP:KeyPoint) {
        this._loadkp = pKP;
    }

    setUnloadKeyPoint(pKP:KeyPoint) {
        this._unloadkp = pKP;
    }

    getKeyPoint():Nullable<KeyPoint> {
        return this._kp;
    }

    setKeyPoint(pKP:KeyPoint) {
        this._kp = pKP;
    }

    hasKeyPointFor( pType:string){
        if(pType === 'load'){
            return (this._loadkp != null);
        }
        else if(pType === 'unload'){
            return (this._unloadkp != null);
        }
        else{
            return false;
        }
    }



    enable( pBool = true){
        this._enabled = pBool;
    }

    getGeneratedCode():Nullable<string> {
        return this._code;
    }

    getLastModified():number {
        return this._time;
    }


    /**
     * To get a fragment from this hook by its UID
     *
     * @param {string} pFragmentUID Fragment UID
     * @return {HookTemplateFragment} Hook template fragment
     * @method
     */
    getFragment( pFragmentUID:string ):Nullable<HookTemplateFragment>  {
        let frag:Nullable<HookTemplateFragment> = null;
        const pos = ["_before","_after","_replace"];
        let fl:number;

        for(let k=0; k<pos.length; k++){
            fl = (this as IStringIndex<any>)[pos[k]].length ;
            for(let i = 0; i<fl; i++){
                if((this as IStringIndex<any>)[pos[k]][i].getUID()===pFragmentUID){
                    frag = (this as IStringIndex<any>)[pos[k]][i];
                    break;
                }
            }
            if(frag != null) break;
        }

        return frag;
    }

    private _hasFragments( pArr:HookTemplateFragment[]){
        return (pArr.length > 0);
    }

    hasReplaceFragments():boolean {
        return this._hasFragments(this._replace);
    }

    hasBeforeFragments():boolean {
        return this._hasFragments(this._before);
    }

    hasAfterFragments():boolean {
        return this._hasFragments(this._after);
    }

    getBefore():HookTemplateFragment[] {
        return this._before;
    }

    getAfter():HookTemplateFragment[] {
        return this._after;
    }

    getReplace():HookTemplateFragment[] {
        return this._replace;
    }

    setBefore(pFrags:HookTemplateFragment[]) {
      this._before = pFrags;
    }

    setAfter(pFrags:HookTemplateFragment[]) {
      this._after = pFrags;
    }

    setReplace(pFrags:HookTemplateFragment[]) {
      this._replace = pFrags;
    }

    /**
     * To get all fragment template for the given location
     *
     * @param {string} pLocation Location name
     * @return {HookTemplateFragment[]} The list of HookTemplateFragment for the specified location
     * @method
     */
    getFragmentsByLocation( pLocation:string):HookTemplateFragment[] {
        if(pLocation === "before"){
            return this._before;
        }
        else if(pLocation === "after"){
            return this._after;
        }
        else if(pLocation === "replace"){
            return this._replace;
        }
        else{
            throw new Error("Invalid fragment location");
        }
    }

    isEnable():boolean {
        return this._enabled;
    }

    isTargetNodeType( pNodeType:NodeInternalType){
        return (this._t === pNodeType);
    }
}
