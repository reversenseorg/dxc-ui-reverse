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

import {CodeLang, CustomCodeOptions} from "./InspectorFactory";
import {Nullable} from "../base/Nullable";

/**
 * Actionnable
 *
 * Represent a piece of editable Dexcalibur's code
 *
 * @class
 */
export class CustomCode {

    fn:Nullable<Function> = null;
    compiled:Nullable<string>  = null;
    source:Nullable<string>  = null;
    lang:CodeLang = "js";
    errors:Nullable<string>  = null;
    description:string = "";

    constructor(pOptions:CustomCodeOptions) {
        if(pOptions.fn!=null) this.fn = pOptions.fn;
        if(pOptions.compiled!=null) this.compiled = pOptions.compiled;
        if(pOptions.source!=null) this.source = pOptions.source;
        if(pOptions.lang!=null) this.lang = pOptions.lang;
        if(pOptions.errors!=null) this.errors = pOptions.errors;
        if(pOptions.description!=null) this.description = pOptions.description;
    }

    getSource():Nullable<string> {
        return this.source;
    }

    getLang():CodeLang {
        return this.lang;
    }

    getCompiled():Nullable<string> {
        return this.compiled;
    }

    /**
     * To compore to custome code instance
     *
     * @param {CustomCode} pCode
     */
    equal(pCode:CustomCode):boolean {
        let eq = true;
        eq = eq && (this.lang==pCode.lang);
        eq = eq && (this.description==pCode.description);
        eq = eq && (this.source===pCode.source);

        if(this.compiled!=null && pCode.compiled!=null){
            eq = eq && (this.compiled===pCode.compiled);
        }

        return eq;
    }

    /**
     * To compare this custom code instance with upcoming options
     *
     * @param {CustomCodeOptions} pCode
     */
    equalOptions(pOptions:CustomCodeOptions):boolean {
        let eq = true;
        eq = eq && (this.lang==pOptions.lang);
        eq = eq && (this.description==pOptions.description);
        eq = eq && (this.source===pOptions.source);

        return eq;
    }


    /**
     *
     */
    toJsonObject():any {
        return {
            fn: null,
            compiled: this.compiled,
            source: this.source,
            lang: this.lang,
            errors: this.errors,
            description: this.description
        };
    }
}