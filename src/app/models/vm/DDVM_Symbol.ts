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

import ModelMethod from "../ModelMethod";


/**
 * @class
 */
export default class DDVM_Symbol
{
    static SKIPPED:boolean = true;

    type:any = null;
    value:any = null;
    code:any = null;
    regs:any = [];
    symOffset:any = false;
    symVal:any = null;
    skipped:any = null;

    /**
     *
     * @constructor
     * @param pType
     * @param pValue
     * @param pCode
     * @param pSkipped
     */
    constructor(pType:any, pValue:any, pCode:any=null, pSkipped:boolean=false){
        this.type = pType;
        this.value = pValue;
        this.code = pCode;
        this.regs = [];
        this.symOffset = false;
        this.skipped = pSkipped;
    }

    /*
    print():string{
        if(this.value instanceof DDVM_ClassInstance){
            return `type:${DTYPE_STRING[this.type]}, value:(ClassInstance)${this.value.parent.name}, code:${this.code}`;
        }
        else if(this.value instanceof ModelClass){
            return `type:${DTYPE_STRING[this.type]}, value:${this.value.name}, code:${this.code}`;
        }
        else if(this.value instanceof DDVM_VirtualArray){
            return `type:${DTYPE_STRING[this.type]}, value:${this.value.print()}, code:${this.code}`;
        }
        else if(this.value != null){
            switch(this.type){
                case DTYPE.CLASS_REF:
                case DTYPE.FIELD_REF:
                    return `type:${DTYPE_STRING[this.type]}, value:${this.value.signature()}, code:${this.code}`;
                default:
                    return  `type:${DTYPE_STRING[this.type]}, value:${this.value}, code:${this.code}`;
            }

        }
        else{
            return `type:${DTYPE_STRING[this.type]}, value:NULL, code:${this.code}`;
        }
    }*/

    setSkipped():void{
        this.skipped = true;
    }

    isSkipped():boolean{
        return this.skipped;
    }

    setCode(pCode:number):void{
        this.code = pCode;
    }

    getCode():any{
        return this.code;
    }

    hasCode():boolean{
        return this.code != null;
    }

    getReferencedValue():any{
        return this.value;
    }

    /**
     * Alias of hasValue()
     *
     * @method
     * @returns {boolean} TRUE if concrete value of the symbol is known, else FALSE
     */
    hasConcrete():boolean {
        return this.hasValue();
    }

    hasValue():boolean{
        return (this.value !== null);
    }

    getValue():any{
        return this.value;
    }

    setValue(pValue:any):void{
        this.value = pValue;
    }

    isThis(pMethod:ModelMethod):boolean{
        return (pMethod instanceof ModelMethod)
            && pMethod.isStatic();
    }

    isConcreteArray():void{
        throw new Error('[DDVM] isConcreteArray(): Not implemented ');
    }
}