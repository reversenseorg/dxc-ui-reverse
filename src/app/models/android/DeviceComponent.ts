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

import {Nullable} from "../../base/Nullable";
import {IStringIndex} from "../../base/IStringIndex";

const ANDROID_PREFIX = "android:";

class XmlSerializable
{
    androidPrefixed:string[] = [];

    /**
     * To serialize to XML
     * @returns {String} The activity data ready to be writen into an XML file
     * @function
     */
    toXmlObject():any {
        let o: any = {}
        o.$ = {};
        for (let i in this) {
            if (this.androidPrefixed.indexOf(i) > -1)
                o.$[ANDROID_PREFIX + i] = this[i];
            else
                o.$[i] = this[i];
        }

        return o;
    }
}

export class AndroidGlTexture extends XmlSerializable
{
    name:Nullable<string> = null;

    constructor(){
        super();
    }
}

export class AndroidFeature extends XmlSerializable
{
    name:Nullable<string> = null;
    require:Nullable<string> = null;
    glEsVersion:Nullable<string> = null;

    constructor(){
        super();
    }
}



export class AndroidInstrumentation extends XmlSerializable
{

    /*static MODEL = {
        functionalTest:["true" , "false"],
        handleProfiling:["true" , "false"],
        icon:"drawable resource",
        label:"string resource",
        name:"string",
        targetPackage:"string",
        targetProcesses:"string"
    }*/


    functionalTest:Nullable<string> =null;
    handleProfiling:Nullable<string> =null;
    icon:Nullable<string> =null;
    label:Nullable<string> =null;
    name:Nullable<string> =null;
    targetPackage:Nullable<string> =null;
    targetProcesses:Nullable<string> =null;

    constructor(){
        super();
    }
}


export class AndroidSupportedScreen extends XmlSerializable
{
    /*static MODEL = {
        resizeable:["true" | "false"],
        smallScreens:["true" | "false"],
        normalScreens:["true" | "false"],
        largeScreens:["true" | "false"],
        xlargeScreens:["true" | "false"],
        anyDensity:["true" | "false"],
        requiresSmallestWidthDp:"integer",
        compatibleWidthLimitDp:"integer",
        largestWidthLimitDp:"integer"
    }*/

    resizeable:Nullable<string> =null;
    smallScreens:Nullable<string> =null;
    normalScreens:Nullable<string> =null;
    largeScreens:Nullable<string> =null;
    xlargeScreens:Nullable<string> =null;
    anyDensity:Nullable<string> =null;
    requiresSmallestWidthDp:Nullable<string> =null;
    compatibleWidthLimitDp:Nullable<string> =null;
    largestWidthLimitDp:Nullable<string> =null;

    constructor(){
        super();
    }
}



export class AndroidScreen extends XmlSerializable
{

    screenSize:Nullable<string> = null;
    screenDensity:Nullable<string> = null;

    constructor(pConfig:any=null){
        super();
        if(pConfig!==null)
            for(let i in pConfig)
                (this as IStringIndex<any>)[i] = pConfig[i];
    }
}



export class AndroidConfiguration extends XmlSerializable
{
    /*static MODEL = {
        reqFiveWayNav:["true" | "false"],
        reqHardKeyboard:["true" | "false"],
        reqKeyboardType:["undefined" | "nokeys" | "qwerty" | "twelvekey"],
        reqNavigation:["undefined" | "nonav" | "dpad" | "trackball" | "wheel"],
        reqTouchScreen:["undefined" | "notouch" | "stylus" | "finger"]
    }*/

    reqFiveWayNav:Nullable<string> =null;
    reqHardKeyboard:Nullable<string> =null;
    reqKeyboardType:Nullable<string> =null;
    reqNavigation:Nullable<string> =null;
    reqTouchScreen:Nullable<string> =null;

    constructor(){
        super();
    }

}

