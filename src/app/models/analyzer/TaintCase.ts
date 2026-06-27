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

import {DexcaliburProjectUUID} from "../DexcaliburProject";
import ModelInstruction from "../ModelInstruction";
import {ModelFunction} from "../ModelFunction";
import ModelMethod from "../ModelMethod";
import ModelField from "../ModelField";
import ModelClass from "../ModelClass";
import {Nullable} from "../../base/Nullable";
import {UserAccountUUID} from "../user/UserAccount";


export interface TaintStep {
    location: ModelInstruction;
    source: ModelFunction|ModelMethod|ModelField|ModelClass;
}


export interface TaintSink extends TaintStep {
}

export interface TaintSource extends TaintStep {
}

export interface  TaintCaseOpts {
    ctx: DexcaliburProjectUUID,
    source: TaintSource,
    name: string,
    description?: Nullable<string>,
    sinks?: Nullable<TaintSink[]>,
    propagators?: Nullable<TaintStep[]>,
    conds?: Nullable<TaintStep[]>,
    author?:Nullable<UserAccountUUID>,
}

export class TaintCase {

    ctx:DexcaliburProjectUUID;

    name: string;
    description: string;
    author: UserAccountUUID;

    source: TaintSource;
    sinks: TaintSink[] = [];
    propagators: TaintStep[] = [];
    conds: TaintStep[] = [];

    constructor(pOptions:TaintCaseOpts) {
        this.ctx = pOptions.ctx;
        this.source = pOptions.source;
        if(pOptions.sinks!=null) this.sinks = pOptions.sinks;
        if(pOptions.propagators!=null)  this.propagators = pOptions.propagators;
        if(pOptions.conds!=null)  this.conds = pOptions.conds;
    }

}