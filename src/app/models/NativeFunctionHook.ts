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

import {ModelFunction} from "./ModelFunction";
import {AbstractHook} from "./AbstractHook";
import {NodeInternalType} from "./NodeInternalType";
import {IStringIndex} from "../base/IStringIndex";

export enum HookTargetType {
    STATIC_OFFSET,
    DYNAMIC_OFFSET,
    EXPORTED_SYMBOL,
    IMPORTED_SYMBOL,
    LOCAL_SYMBOL,
    POINTER,
    RAW
}

export default class NativeFunctionHook extends AbstractHook {


    override __:NodeInternalType = NodeInternalType.HOOK_NATIVE;

     override _t:NodeInternalType = NodeInternalType.FUNC;

    /**
     * Targeted method
     * @field
     * @
     */
     _target:any  = null;

     _targetType: HookTargetType = HookTargetType.STATIC_OFFSET;

     _tpl:any = null;

    _weight = 0;


    constructor( pData:any = null) {
        super();

        if(pData != null)
            for(const i in pData){
                (this as IStringIndex<any>)[i] = pData[i];
            }
    }

    isTargetExportedSymbol(){
        return (this._targetType==HookTargetType.EXPORTED_SYMBOL);
    }

    isTargetImportedSymbol(){
        return (this._targetType==HookTargetType.IMPORTED_SYMBOL);
    }

    isTargetStaticOffset(){
        return (this._targetType==HookTargetType.STATIC_OFFSET);
    }

    isTargetDynOffset(){
        return (this._targetType==HookTargetType.DYNAMIC_OFFSET);
    }

    isTargetLocalSymbol(){
        return (this._targetType==HookTargetType.LOCAL_SYMBOL);
    }

    isTargetByPointer(){
        return (this._targetType==HookTargetType.POINTER);
    }

    isRawTarget(){
        return (this._targetType==HookTargetType.RAW);
    }

    /**
     * To check if the hook target the specified method
     *
     * @param {ModelMethod} pNode The target to verify
     * @return {boolean} Return TRUE if target specified node is targeted, else FALSE
     * @method
     * @since 1.0.0
     */
    isTarget(pNode: ModelFunction): boolean {
        return ( this._target.getUID() === pNode.getUID());
    }

    setTarget( pNode:ModelFunction) {
        this._target = pNode;
    }
    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    getTarget():any {
        return this._target;
    }

}
