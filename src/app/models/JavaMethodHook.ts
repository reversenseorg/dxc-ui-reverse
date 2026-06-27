
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

// @ts-ignore
import {AbstractHook} from "./AbstractHook";
import {NodeInternalType} from "./NodeInternalType";
import ModelMethod from "./ModelMethod";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";


export default class JavaMethodHook extends AbstractHook {

    override __:NodeInternalType = NodeInternalType.HOOK_JAVA;

    override  _t:NodeInternalType = NodeInternalType.METHOD;

    /**
     * Targeted method
     * @field
     * @
     */
    public _target:Nullable<ModelMethod> = null;

    public method:ModelMethod;



    constructor( pData:any = null) {
        super();

        if(pData !== null)
            for(const i in pData){
                (this as IStringIndex<any>)[i] = pData[i];
            }
    }

    /**
     * To check if the hook target the specified method
     *
     * @param {ModelMethod} pNode The target to verify
     * @return {boolean} Return TRUE if target specified node is targeted, else FALSE
     * @method
     * @since 1.0.0
     */
    isTarget(pNode: ModelMethod): boolean {
        return (this._target!=null) && ( this._target.getUID() === pNode.getUID());
    }

    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    getTarget():Nullable<ModelMethod> {
        return this._target;
    }

    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    setTarget(pTarget:ModelMethod) {
        this._target = pTarget;
        this.method = pTarget;
        this.name = pTarget.name;
    }
}
