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

import {INode} from "../INode";
import StatusMessage from "./StatusMessage";
import {UserAccount} from "../user/UserAccount";
import {Nullable} from "../../base/Nullable";

export interface WorkflowFollower {
    user: UserAccount;
    socket: any;
    opts?:any;
}


export interface WorkflowOptions extends Record<string, any>{
    uid?: string;
    _parent?: Nullable<INode>;
    followers?:WorkflowFollower[];
    msg?:StatusMessage[];
    activeStep?: number;
}



/**
 * Represent a workflow
 *
 * Workflow are attached to a subject, and help to follow progression
 * of an action on this subject
 *
 * @class
 */
export class Workflow {

    /**
     * Workflow uid
     * @field
     * @type {string}
     */
    uid:string = "";

    /**
     * Hold status
     * @field
     * @type {StatusMessage[]}
     */
    msgs: StatusMessage[] = [];

    /**
     * Step
     */
    activeStep:number = 0;

    /**
     *
     * @private
     */
    followers:WorkflowFollower[] = []

    /**
     * Max bound for progress of the current step
     * @private
     */
    _b:number =0;

    /**
     * Delta : New Max bound - Last Max bound
     * @private
     */
    _d:number =0;

    _t:number =0;

    /**
     * Active step
     * @private
     */
    _m:string = "";

    _parent:Nullable<INode> = null;

    constructor( pConfig:WorkflowOptions = {}) {

        for(let i in pConfig) (this as any)[i] = pConfig[i];
    }

    /**
     *
     * @param pStr
     * @param pProgressBound
     */
    setStep(pStepName:string, pProgressBound:number ){
        this._m = pStepName;
        if(this._b>0){
            this._d = pProgressBound - this._b;
            this._b = pProgressBound;
        }else{
            this._d = this._b = pProgressBound;
        }
    }

    computeStepUp(pEntries:number){
        this.activeStep = this._d / pEntries;
    }


    stepUp(pStep:number):void {
        this.activeStep += pStep;
    }

    getUID():string {
        return this.uid;
    }

    pushStatus(pMsg:StatusMessage):void {
        pMsg.msg = (this._m.length>0? this._m+' : ':'')+pMsg.msg;
        this.msgs.push(pMsg.addProgress(this.activeStep));
        this._t = pMsg.progress;
        //this.sendStatusToFollowers();
    }

    /**
     * Direct messages are not cached
     *
     * @param pMsg
     */
    pushDirectStatus(pMsg:string):void {
        const m:StatusMessage = StatusMessage.newDirect((this._m.length>0? this._m+' : ':'')+pMsg);
        if(this.activeStep>-1){
            this._t = m.progress = this._t + this.activeStep;
        }else{
            m.progress = this._t;
        }
        //this.sendStatusToFollowers(m.toJsonObject());
    }


    /**
     * To retrieve the list of status message
     */
    getStatus():StatusMessage[] {
        return this.msgs;
    }

    /**
     * To get the first message issued
     *
     * @returns {StatusMessage}
     * @method
     */
    getFirstStatus():Nullable<StatusMessage> {
        if(this.msgs.length>0)
            return this.msgs[0];
        else
            return null;
    }

    /**
     * To get the last message issued
     *
     * @returns {StatusMessage}
     * @method
     */
    getLastStatus():Nullable<StatusMessage> {
        if(this.msgs.length>0)
            return this.msgs[this.msgs.length-1];
        else
            return null;
    }



}