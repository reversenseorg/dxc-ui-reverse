
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

// CIA
// TAMPER


import Constraint, {ConstraintOptions, ConstraintType} from "./Constraint.js";
import {NodeInternalType} from "../../NodeInternalType.js";
import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";


export interface CodeConstraintOptions extends ConstraintOptions {
    impl?:any;

    node?:NodeInternalType;

    pattern?:string;
}

export default class CodeConstraint extends Constraint {


    impl:any;

    node:NodeInternalType;

    pattern:string;

    constructor( pNode:NodeInternalType, pConfig:Nullable<CodeConstraintOptions> = null) {
        super(ConstraintType.CODE, pConfig);

        this.node = pNode;
        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    verify( pNode:any):void {
        // todo
        if(this.impl!=null){

        }
    }
}