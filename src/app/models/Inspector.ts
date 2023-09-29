import HookSet from "./HookSet";
import {NodeInternalType} from "./NodeInternalType";
import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";

const TASK_CODE = {
    NO_RESULT: 0,
    SUCCESS: 1,
    DATA_UPDATE: 2
};

export enum INSPECTOR_TYPE {
    BOOT= 'BOOT',
    POST_APP_SCAN= 'POST_APP_SCAN',
    POST_PLATFORM_SCAN= 'POST_PLATFORM_SCAN',
    POST_DEV_SCAN= 'POST_DEV_SCAN',
    ON_DEMAND= 'ON_DEMAND',
};

interface ListenerList extends IStringIndex<StaticTask[]>{
    [eventType :string] :StaticTask[]
}

export class StaticTask
{

    task:any = null;
    condition:any = null;
    onDataUpdate:any = null;
    onNoResult:any = null;
    onSuccess:any = null;

    constructor(pConfig:any=null){
        if(pConfig!==null)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];
    }

    setCondition(fn:any){
        this.task = fn;
    }

    setTask(fn:any){
        this.condition = fn;
    }

    exec(ctx:any, event:any){
        if(this.condition != null && this.condition(ctx))
            this.task(ctx, event);
        else
            this.task(ctx, event);
    }
}



export class Inspector
{
    __:NodeInternalType = NodeInternalType.INSPECTOR;
    id:Nullable<string> = null;
    name:Nullable<string> = null;
    description:Nullable<string> = null;

    //context:DexcaliburProject = null;
    hookset: Nullable<HookSet> = null;
    staticTasks:StaticTask[] = [];
    running:boolean = false;
    listener:ListenerList = {};

    events:string[] = [];

    gui_available:boolean = false;

    frontController:any = null;
    preRegisteredTags:any = [];
    //db: any = null;

    /**
     * @type {String}
     * @field
     */
    color:any = null;

    installed:boolean = false;
    step:INSPECTOR_TYPE = INSPECTOR_TYPE.BOOT;

    constructor(config:any=null){
        if(config!=null){
            for(let i in config){
                switch(i){
                  case 'hooks':
                    this.hookset = new HookSet(config[i]);
                    break;
                  default:
                    (this as IStringIndex<any>)[i] = config[i];
                    break;
                }
            }
        }
        console.log('new inspector >',this);
    }


    /**
     * @return {boolean}
     * @method
     */
    isInstalled():boolean{
        return this.installed;
    }

    useGUI():void{
        this.gui_available = true;
    }


    getStartStep():INSPECTOR_TYPE{
        return this.step;
    }


    getID():Nullable<string>{
        return this.id;
    }

    getListerners():StaticTask[][] {
        return Object.values(this.listener);
    }

    /**
     *
     * @param {*} pStep
     * @method
     */
    isStartAt(pStep:INSPECTOR_TYPE):boolean{
        return (this.step === pStep)
    }

    /**
     * To restore from a save
     * @param {*} callback
     * @method
     */
    restore(callback=null):void{


    }

    getHooks():Nullable<HookSet> {
      return this.hookset;
    }

    /**
     * To save configuration
     * @method
     */
    save(){

    }
}
