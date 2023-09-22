import { HOOK_FRAGMENT_POS } from "../AbstractHook";
import KeyPoint from "../KeyPoint";
import { NodeInternalType } from "../NodeInternalType";
import HookStrategySelector from "./HookStrategySelector";
import HookTemplateFragment from "./HookTemplateFragment";

export const DEFAULT_PRIORITY = -1;

/**
 * Represents the object which search a pattern into the application graphs and generate
 * corresponding instrumentation.
 *
 * By default, such HookStrategy are executed when the application has been analyzed,
 * however if it is attached to a particular event, it can be trigged earlier or later.
 *
 * A hook strategy search a group of nodes to hook, and it generate fragments of hook code
 * inserted before/intead-of/after selected codes.
 *
 * Finally the hook manager will merge all fragments according to conditions (key point, shared code, requirements, ...)
 * and generate final script for each node.
 *
 * @class
 */
export default class HookStrategy {


    __:NodeInternalType = NodeInternalType.HOOK_STRATEGY;

    _uid:string = null;
    name:string = null;
    descr:string = null;

    /**
     * A boolean to turn ON/OFF auto-emit of event for each hook trigged
     *
     * @type {boolean}
     * @field
     */
    autoEmit = false;

    /**
     * The name of the event emitted
     *
     * @type {string}
     * @field
     */
    emitEvent:string = null;

    preprocessor: string = null;
    /**
     * Search Engine request
     * @private
     */
    search:HookStrategySelector = null;

    /**
     * @deprecated
     */
    //hooks:AbstractHook[] = []

    weight = DEFAULT_PRIORITY;

    before:HookTemplateFragment = null;
    after:HookTemplateFragment = null;
    replace:HookTemplateFragment = null;

    on:string = null;

    onMatch:any = null;

    loadOn:string = null;
    unloadOn:string = null;

    load_kp:KeyPoint = null;
    unload_kp:KeyPoint = null;

    key_point:KeyPoint = null;

    passed = 0;


    /**
     * Group of hook
     *
     * @param {*} config
     * @constructor
     *
     */
    constructor(pConfig:any=null){

        this.passed = 0;

        // this.requiresNode = [];
        if(pConfig!=null)
            for(const i in pConfig)
                this[i] = pConfig[i];


    }

    /**
     * To create a hook strategy from raw object
     *
     * @param {any} pConfig
     * @return {HookStrategy}  A fresh HookStrategy instance
     * @method
     * @static
     */
    static from(pConfig:any):HookStrategy {
        const o:HookStrategy = new HookStrategy(pConfig);

        if(pConfig.preprocessor != null){
            o.updatePreprocessorSrc(pConfig.preprocessor);
        }

        if(o.search != null){
            o.search = HookStrategySelector.from(o.search);
        }

        if(pConfig.before != null){
            o.before = new HookTemplateFragment();
            o.before.setStrategy(o);
            o.before.template = pConfig.before;
        }

        if(pConfig.after != null){
            o.after = new HookTemplateFragment();
            o.after.setStrategy(o);
            o.after.template = pConfig.after;
        }

        if(pConfig.replace != null){
            o.replace = new HookTemplateFragment();
            o.replace.setStrategy(o);
            o.replace.template = pConfig.replace;
        }

        return o;
    }

    /**
     * To get strategy UID
     *
     * @return {string} Object UID
     * @method
     */
    getUID():string {
        return this._uid;
    }



    getName():string {
        return this.name;
    }

    setName(pName:string) {
        this.name = pName;
    }

    hasLoadKeyPoint():boolean {
        return (this.load_kp != null) || (this.loadOn != null);
    }

    hasUnloadKeyPoint():boolean {
        return (this.unload_kp != null) || (this.unloadOn != null);
    }

    setUnloadKeyPoint( pKeyPoint:KeyPoint):void {
        this.unload_kp = pKeyPoint;
    }

    setLoadKeyPoint( pKeyPoint:KeyPoint):void {
        this.load_kp = pKeyPoint;
    }

    setSearchEngineRequest(pRequest:string) {
        this.search.setRequest(pRequest);
    }

    getSearchEngineRequest():string {
        return this.search.getRequest();
    }

    triggerOn(pEventName:string):void {
        this.on = pEventName;
    }

    updatePreprocessorSrc( pSource:string):void {
        this.preprocessor = pSource;
        this.onMatch = new Function('pCtx', 'pEvent', this.preprocessor);
    }

    setPreprocessorFn( pFunc:any):void {
        this.preprocessor = null;
        this.onMatch = pFunc;
    }


    /**
     * NOT USED
     *
     * @param pSource
     */
    static newPreprocessorFn( pSource: string):any {
        return (new Function('pCtx', 'pEvent', pSource)) ;
    }

    /**
     * To export to json
     */
    toJsonObject():any{
        const o:any = {};
        for(const i in this){
            switch(i){
                case 'after':
                case 'before':
                case 'replace':
                    // HookTemplateFragment
                    o[i] = (this[i] !== null ? (this[i] as any).toJsonObject() : null);
                    break;
                case 'load_kp':
                case 'unload_kp':
                case 'key_point':
                    // KeyPoint
                    o[i] = (this[i] !== null ? (this[i] as any).getUID() : null);
                    break;
                case 'search':
                    o.search = (this.search !== null ? this.search.toJsonObject() : null);
                    break;
                default:
                    o[i] = this[i];
                    break;
            }
        }
        return o;
    }
}
