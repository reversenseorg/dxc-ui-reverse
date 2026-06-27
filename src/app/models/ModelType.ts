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

import { CONST } from "./CoreConst";
import {Savable, Stub, STUB_TYPE} from "./ModelSavable";
import {NodeInternalType} from "./NodeInternalType";
import {IStringIndex} from "../base/IStringIndex";
import {Nullable} from "../base/Nullable";


/**
 * Represent a primitive type
 * @class
 */
export class ModelBasicType extends Savable
{
    name:Nullable<string> = null;
    arr:boolean = false;
    _name:string = "";
    _hashcode:string = ""


    /**
     * To represent a primitive type
     * @param {string} raw_type - The raw name of the type as it can be found in Smali code
     * @param {boolean} isArray - Array flag should be TRUE if the type is an array, else FALSE
     * @constructor
     */
    constructor(raw_type:string|null=null, isArray:boolean=false){
        super(STUB_TYPE.BASIC_TYPE);

//        this.$ = STUB_TYPE.BASIC_TYPE;
        if(raw_type!==null){
            this.name = (CONST.TYPES as IStringIndex<any>)[raw_type];
            this._name = ((CONST.WORDS as IStringIndex<any>)[raw_type]!=undefined)? (CONST.WORDS as IStringIndex<any>)[raw_type] : "???";
            this._hashcode = raw_type;
        }
        this.arr = isArray;
    }

    override  import(pConfig: any): ModelBasicType {
        return super.import(pConfig);
    }

    hashcode():string{
        return this._hashcode
    }

    sprint():string{
        return "<"+this._name+">"+(this.arr?"[]":"");
    }

    /**
     * To check if the current type is Void
     * @returns {boolean} - Returns TRUE if the type is Void, else FALSE
     */
    isVoid():boolean{
        return this.name == CONST.WORDS.V; // CONST.TYPES.V
    }

    /**
     * To check if the current type is numeric (integer, long or short)
     * @returns {boolean} - Returns TRUE if the type is integer or long or short, else FALSE
     */
    isNumeric():boolean{
        if(this.name != null){
            return [CONST.WORDS.S, CONST.WORDS.I, CONST.WORDS.J].indexOf(this.name)>-1;
        }else{
            throw new Error('ModelType : cannot state if the value is a numeric or not');
        }

        //return [CONST.TYPES.S, CONST.TYPES.I, CONST.TYPES.J].indexOf(this.name)>-1;
        // return [CONST.TYPES.S, CONST.TYPES.I, CONST.TYPES.J].indexOf(this._hashcode)>-1;
    }

    /**
     * To check if the current type is an array
     * @returns {boolean} - Returns TRUE if the type is an array, else FALSE
     */
    isArray():boolean{
        return this.arr;
    }

    /**
     * To make the signature of the current type instance
     * It has one of these forms :
     *      - "<I>" if the current type is an Integer
     *      - "<I>[]"  if the current type is an array of Integer
     *
     * @returns {string} - Returns the signature of the type
     */
    signature():string{
        return "<"+this._name+">"+(this.arr?"[]":"");
    }


    /**
     * To make an instance of Object which not contain circular reference
     * and which are ready to be serialized.
     * @returns {Object} - Returns an Object instance representing the type
     */
    toJsonObject():any{
        let obj:any = {};
        obj.name = this._name;
        obj.arr = this.arr;
        obj.primitive = true;
        return obj;
    }
}



export class ModelObjectType extends Savable
{
    name:Nullable<string> = null;
    arr:boolean = false;
    _name:Nullable<string> = null;
    _hashcode:Nullable<string> = null;

    constructor(pFQCN:Nullable<string>=null, isArray:boolean=false) {
        super(STUB_TYPE.OBJ_TYPE);

        if(pFQCN!==null){
            this.name = pFQCN;
            this._name = pFQCN;
            this._hashcode = pFQCN;
        }
        this.arr = isArray;
        this.tags = [];
    }

    override import(pConfig: any): ModelObjectType {
        return super.import(pConfig);
    }

    override export():Stub{
        return super.export();
    }

    hashcode():Nullable<string>{
        return this._hashcode
    }

    sprint():string{
        return "<"+this._name+">"+(this.arr?"[]":"");
    }


    /**
     * To check if the current type is a Java String
     * @returns {boolean} - Returns TRUE if the type is a Java String, else FALSE
     */
    isString():boolean{
        return this.name == "java.lang.String";
    }

    /**
     * To make the signature of the current type instance
     * It has one of these forms :
     *      - "<I>" if the current type is an Integer
     *      - "<I>[]"  if the current type is an array of Integer
     *
     * @returns {string} - Returns the signature of the type
     */
    signature():string{
        return "<"+this.name+">"+(this.arr?"[]":"");
    }

    /**
     * To make an instance of Object which not contain circular reference
     * and which are ready to be serialized.
     * @returns {Object} - Returns an Object instance representing the type
     */
    toJsonObject(){
        let obj:any = {};
        obj.name = this.name;
        obj.arr = this.arr;
        obj.primitive = false;
        return obj;
    }

    isArray():boolean{
        return this.arr;
    }
}
