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

import ModelClass from "./ModelClass";
import ModelBasicBlock from "./ModelBasicBlock";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {RenderedModelNode} from "../base/RenderedModelNode";

interface ITryCatchBoundary
{
    0: Nullable<ModelClass>,
    1: Nullable<string|ModelBasicBlock>,
    2: Nullable<string|ModelBasicBlock>,
    3: Nullable<string|ModelBasicBlock>
};


export default class ModelCatchStatement  extends RenderedModelNode
{
    __:NodeInternalType = NodeInternalType.CATCH_STMT;
    d:ITryCatchBoundary = { 0:null, 1:null, 2:null, 3:null };

    constructor(){
        super();
        this.d = {} as ITryCatchBoundary;
    }

    setException(pClass:ModelClass){
        this.d[0] = pClass;
    }

    getException():Nullable<ModelClass>{
        return this.d[0];
    }

    setTryStart(pLabel:string|ModelBasicBlock){
        this.d[1] = pLabel;
    }

    getTryStart():Nullable<string|ModelBasicBlock>{
        return this.d[1];
    }

    setTryEnd(pLabel:string|ModelBasicBlock){
        this.d[2] = pLabel;
    }

    getTryEnd():Nullable<string|ModelBasicBlock>{
        return this.d[2];
    }

    setTarget(pLabel:string|ModelBasicBlock){
        this.d[3] = pLabel;
    }

    getTarget():Nullable<string|ModelBasicBlock>{
        return this.d[3];
    }
}
