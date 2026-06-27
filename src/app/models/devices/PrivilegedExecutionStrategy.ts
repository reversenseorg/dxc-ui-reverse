
/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {PrivilegedExecutionPhase} from "./PrivilegedExecutionPhase";



export enum StrategyTrigger {
    CMD_EXEC= 'cmd_exec',
    DEV_BOOT = 'dev_boot',
    DEV_LIST = 'dev_list',
    PROJ_START = 'proj_start'
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
    bridge:any;

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
    _trigger:StrategyTrigger = StrategyTrigger.CMD_EXEC;

    private _executed:boolean = false;

    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as any)[i] = pConfig[i];
        }
    }

    setBridge(pBridge:any):void {
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
        o._trigger = this._trigger;
        for(let i=0; i<this.phases.length; i++){
            o.phases[i] = this.phases[i].toJsonObject();
        }
        return o;
    }
}