import {IBridge} from "./Bridge.js";
import {PrivilegedExecutionPhase} from "./PrivilegedExecutionPhase";



export enum StrategyTrigger {
    CMD_EXEC,
    DEV_LIST
}

/**
 * Represent a named set of command/action to perform to be able to execute
 * command with root privilege on the target device
 *
 * @class
 */
export class PrivilegedExecutionStrategy {

    /**
     * Set name
     * @type {string}
     * @field
     */
    name:string;

    /**
     * The bridge to use
     * @type {IBridge}
     * @field
     */
    bridge:IBridge;

    /**
     * A list of steps to execute prior to be able run a command as root
     * @type {PrivilegedExecutionPhase[]}
     * @field
     */
    phases:PrivilegedExecutionPhase[] = [];

    /**
     * @type {StrategyTrigger} Default value is `StrategyTrigger.CMD_EXEC`
     * @field
     * @private
     */
    private _trigger:StrategyTrigger = StrategyTrigger.CMD_EXEC;

    private _executed:boolean = false;

    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as any)[i] = pConfig[i];
        }
    }

    setBridge(pBridge:IBridge):void {
        this.bridge = pBridge;
    }


    /**
     * To check if the strategy has been already executed
     */
    hasRun():boolean {
        return this._executed;
    }

    /**
     * To check if the currrent strategy must be executed for
     * specified event
     *
     * @param {StrategyTrigger} pEvent
     * @method
     */
    mustRun(pEvent:StrategyTrigger):boolean {
        return (this._trigger===pEvent);
    }

    addPhase( pPhase:PrivilegedExecutionPhase):void {
        this.phases.push(pPhase);
    }

    toJsonObject():any{
        let o:any  = {};
        o.name = this.name;
        o.phases = [];
        for(let i=0; i<this.phases.length; i++){
            o.phases[i] = this.phases[i].toJsonObject();
        }
        CoreDebug.checkJsonSerialize(o, "PrivilegedExecutionStrategy");
        return o;
    }
}