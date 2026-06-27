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

import { Nullable } from "src/app/base/Nullable";
import { MerlinSearchRequest } from "../search/MerlinSearchRequest";
import { HookSessionUUID } from "src/app/components/hooks/ctrl/HookSession";
import { NodeInternalType } from "../NodeInternalType";
import {FuzzSessionUID, IFuzzGenerator, IFuzzResolver} from "./common";
import { UserAccountUUID } from "../user/UserAccount";
import { RuntimeEvent } from "../hook/RuntimeEvent";
import { INode } from "../INode";

export enum FuzzState {
    PAUSE,
    RUNNING,
    DONE,
    // resume after PAUSE
    RESUME
}


export type ProgramedAction = {
    //wait action
    //click UI action etc
    // adb actions
}



/**
 * Options to create a new instance
 */
export interface FuzzSessionOpts extends Record<string,any>{
    _uid?:string;
    message?:RuntimeEvent<any>[];
    owner?:Nullable<UserAccountUUID>;
    devUID?:string;
    history?:FuzzSessionStateChange[];
    termPoint?:MerlinSearchRequest;
}


export interface RuntimeEventFilter {
    fragUID?:string;
    hookUID?:string;
    tagUUIDs?:number[];
    tagNames?:string[];
}

export interface FuzzSessionStateChange {
    time: number,
    state: FuzzState
}

export enum TerminalPointType {
    HOOK='hook',
    HOST='host-event',
    SIDE='side-event',
    CRASH='app-crash',
}

/**
 * @class
 */
export default class FuzzSession implements INode
{

    __:NodeInternalType = NodeInternalType.FUZZ_SESS;

    _uid:FuzzSessionUID;

    /**
     * The owner of this session
     */
    owner:Nullable<UserAccountUUID> = null;

    /**
     * The stack containing the received message
     * @field
     */
    message:RuntimeEvent<any>[] = [];

    tags:number[] = [];

    linkedHookSession: HookSessionUUID;

    testCases:any[] = [];

    results: any[] = [];

    paused = false;

    generators: Record<string, IFuzzGenerator> = {};

    inputValuesQueue: any[]; //FuzzInputValueDict[];

    resolvers: Record<string, IFuzzResolver> = {};

    testCaseCounter: number = 0;

    history:FuzzSessionStateChange[] = [];

    termPoint:Nullable<MerlinSearchRequest> = null;

    termType:TerminalPointType = TerminalPointType.HOOK;
    /**
     *
     * @param {Nullable<FuzzSessionOpts>} pOptions Default NULL
     * @constructor
     */
    constructor(pOptions: FuzzSessionOpts = {}) {
        if(pOptions!=null){
            for (let i in pOptions){
                (this as any)[i] = pOptions[i];
            }
        }
    }



    getUID():FuzzSessionUID {
        return this._uid;
    }

    isPaused():boolean{
        return this.paused;
    }

    getTermType():TerminalPointType{
        return this.termType;
    }

    toJsonObject():any {
        return {
            _uid:this._uid,
            owner:this.owner,
            message:this.message,
            tags:this.tags,
            history:this.history,
            termPoint: this.termPoint!=null ? this.termPoint.toJsonObject() : null,
            testCaseCounter:this.testCaseCounter,
        }
    }

}