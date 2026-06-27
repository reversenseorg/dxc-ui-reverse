
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

import Threat, {ThreatOptions} from "./Threat";
import CodeConstraint from "./CodeConstraint";
import Constraint from "./Constraint";
import {NodeInternalType} from "../../NodeInternalType";
import {IStringIndex} from "../../../base/IStringIndex";
import {Nullable} from "../../../base/Nullable";


export interface CodeConstraintMap {
    [nodeType:number] :CodeConstraint[]
}

export interface CodeThreatOptions extends ThreatOptions {
    signature?:CodeConstraint[];

}

export default class CodeThreat extends Threat {

    override signature:CodeConstraint[] = [];

    private _cmap:CodeConstraintMap = {};

    constructor( pConfig:Nullable<CodeThreatOptions> = null) {
        super(pConfig);

        if(pConfig!=null) for(const i in pConfig) (this as IStringIndex<any>)[i]=pConfig[i];
    }

    override appendSignature(pConstraint:CodeConstraint):void {
        super.appendSignature(pConstraint);

        // update mapping
        if(this._cmap[pConstraint.node]==null){
            this._cmap[pConstraint.node] = [];
        }

        this._cmap[pConstraint.node].push(pConstraint);
    }

    listPerNodeType():CodeConstraintMap {
        return this._cmap;
    }

    listByNodeType(pNodeType:NodeInternalType):CodeConstraint[] {
        return this._cmap[pNodeType];
    }
}
