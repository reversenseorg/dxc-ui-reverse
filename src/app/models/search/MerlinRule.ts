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

import {MerlinSearchAPI} from "./MerlinSearchAPI.js";
import DexcaliburProject from "../DexcaliburProject.js";
import {MerlinSearchRequest, Operation, OperationType, TaintOperationArgs} from "./MerlinSearchRequest.js";
import {OperatingSystem} from "../OperatingSystem";
import {Nullable} from "../../base/Nullable";
import {MerlinPrimitive, MerlinType} from "./Merlin";

export enum MerlinRuleType {
    STATIC,
    DYNAMIC,
    TAINT,
    EMU,
    MIX,
    REVERSE_TAINT
}




export interface SearchOptions {
    query_string?:boolean;

    regexp?:boolean;

    range?:string[];

    not: boolean;

    copyTo?:any;

    strict?:boolean;
    nocase?:boolean;
}

export interface MerlinRuleOptions {
    type?:MerlinRuleType;
    emulate?:boolean;
    request?:MerlinSearchRequest;
    _sinks?:MerlinRule[];
    _sources?:MerlinRule[];
    _steps?:MerlinRule[];
}


/**
 * Represents a detection rule base on a single search request or on
 * a combination  of several search requests linked by one or more analysis
 * such as taint analysis
 *
 * @class
 */
export class MerlinRule extends MerlinSearchAPI {


    TYPE = MerlinType.RULE;

    type:MerlinRuleType = MerlinRuleType.STATIC;

    emulate = false;

    /**
     * The most basic rule contains a single search request, doing one
     * or more operations to search / filter but NOT taint analysis
     *
     * If the rule perform taint analysis between results of search requests from SOURCES
     * and results from SINK, this field is NULL
     *
     * @type {MerlinSearchRequest|null}
     */
    request:MerlinSearchRequest;


    private oper:Operation[] = [];

    protected _sinks:MerlinRule[] = [];
    protected _sources:MerlinRule[] = [];
    protected _steps:MerlinRule[] = [];

    // ???
    protected _subs:MerlinSearchRequest[] = [];

    /**
     * Event type to listen
     * @type {string[]}
     */
    private _evt:string[] = []


    constructor(pTargetOS:OperatingSystem, pOpts:MerlinRuleOptions) {
        super();

        if(pOpts.type!=null) this.type = pOpts.type;
        if(pOpts.emulate!=null) this.emulate = pOpts.emulate;
        if(pOpts.request!=null) this.request = pOpts.request;
        if(pOpts._sinks!=null) this._sinks = pOpts._sinks;
        if(pOpts._sources!=null) this._sources = pOpts._sources;
        if(pOpts._steps!=null) this._steps = pOpts._steps;


        this.targetOS = pTargetOS;
    }

    /*getRequestByNode(pRequestOpts:SerializedSearchRequest,pOpts:SearchOptions|null):Nullable<MerlinSearchRequest>{
        return null;
    }*/

    /**
     * To create a search string from a MerlinRule instance.
     * MerlinRule class has override class for each target OS,
     * So the implementation is subkject to change.
     */
    toSearchString(): string {
        let s = "";
        switch (this.targetOS){
            case OperatingSystem.ANDROID:
                s += "android()"+MerlinRule.stringify(this.getOperations(), "android()");
                break;
            case OperatingSystem.TIZEN:
                s += "tizen()"+MerlinRule.stringify(this.getOperations(), "tizen()");
                break;
            case OperatingSystem.IOS:
                s += "ios()"+MerlinRule.stringify(this.getOperations(), "ios()");
                break;
            case OperatingSystem.MACOS:
                s += "macos()"+MerlinRule.stringify(this.getOperations(), "macos()");
                break;
        }

        return s;
    }

    static  stringify(pOperations:Operation[], pSuffix = ""):string {
        let s = "";
        let type:any;
        let taintNodes = ""
        pOperations.map((vOpe)=>{
            switch (vOpe.type){
                case OperationType.TAINT_SRC:

                    taintNodes = "";
                    (vOpe.args as TaintOperationArgs).request.map(x => {

                        type = x.getNode();
                        if(typeof type!=="string"){
                            type = MerlinSearchAPI.getMethodFromNodeType((type as any).getType());
                        }

                        taintNodes += `${pSuffix+MerlinSearchRequest.stringify(x.getOperations(), type)},`;
                    })

                    if(taintNodes.endsWith(',')){
                        taintNodes = taintNodes.substring(0,taintNodes.length-1);
                    }

                    s += `.sources([${taintNodes}])`;
                    break;
                case OperationType.TAINT_SINK:


                    taintNodes = "";
                    (vOpe.args as TaintOperationArgs).request.map(x => {

                        type = x.getNode();
                        if(typeof type!=="string"){
                            type = MerlinSearchAPI.getMethodFromNodeType((type as any).getType());
                        }

                        taintNodes += `${pSuffix+MerlinSearchRequest.stringify(x.getOperations(), type)},`;
                    })

                    if(taintNodes.endsWith(',')){
                        taintNodes = taintNodes.substring(0,taintNodes.length-1);
                    }

                    s += `.sink([${taintNodes}])`;
                    break;
                case OperationType.TAINT_STEP:


                    taintNodes = "";
                    (vOpe.args as TaintOperationArgs).request.map(x => {

                        type = x.getNode();
                        if(typeof type!=="string"){
                            type = MerlinSearchAPI.getMethodFromNodeType((type as any).getType());
                        }

                        taintNodes += `${pSuffix+MerlinSearchRequest.stringify(x.getOperations(), type)},`;
                    })

                    if(taintNodes.endsWith(',')){
                        taintNodes = taintNodes.substring(0,taintNodes.length-1);
                    }

                    s += `.step([${taintNodes}])`;

                    break;
            }
        });
        return s;
    }

    /**
     * To get "operation-based" representtation of the rule
     *
     * This representation is useful to stringify the request.
     *
     * @return {Operation[]}
     * @method
     */
    getOperations():Operation[] {
        if(this.request!=null){
            return this.request.getOperations();
        }

        const ops:Operation[] = [];
        if(this._sources.length>0){
        }
        return ops;
    }

    /**
     * To perform request on data encapsulated into a bus event
     *
     * @param {string} pBusEventType Event type
     * @return {MerlinSearchRequest} The request instance
     * @method
     */
    on(pBusEventType:string):MerlinRule{
        this._evt.push(pBusEventType);
        return this;
    }

    /**
     *
     * @param pRules
     */
    sources( pRules:MerlinRule):MerlinRule {
        this.type = MerlinRuleType.TAINT;
        this._sources.push(pRules);
        this.oper.push({
            type: OperationType.TAINT_SRC,
            args: {
                request: pRules.getRequest()
            }
        });
        return this;
    }

    /**
     * Top/Down taint analysis
     * @param pRules
     */
    sink( pRules:MerlinRule):MerlinRule {
        this.type = MerlinRuleType.TAINT;
        this._sinks.push(pRules);
        this.oper.push({
            type: OperationType.TAINT_SINK,
            args: {
                request: pRules.getRequest()

            }
        });
        return this;
    }

    /**
     * Bottom/Up taint analysis
     */
    reverseSink():MerlinRule {
        this.type = MerlinRuleType.REVERSE_TAINT;
        return this;
    }

    steps( pRules:MerlinRule):MerlinRule {
        this._steps.push(pRules);
        this.oper.push({
            type: OperationType.TAINT_SINK,
            args: {
                request: pRules.getRequest()
            }
        });

        return this;
    }

    allowEmulator():MerlinRule {
        this.emulate = true;
        return this;
    }

    hook():MerlinRule {
        this.type = MerlinRuleType.DYNAMIC;
        return this;
    }

    getRequest():MerlinSearchRequest {
        return this.request;
    }


    /**
     * To prepare a rule to be serialized
     *
     * @return {any} Poor JS object
     * @method
     */
    override toJsonObject():any {

        let o = super.toJsonObject();



        const v:any = {
            o,
            TYPE: this.TYPE,
            type: this.type,
            emulate: this.emulate,
           // request: this.request.toJsonObject(),

            //oper: this.oper,
            _sinks: this._sinks.map(x => x.toJsonObject()),
            _sources: this._sources.map(x => x.toJsonObject()),
            _steps: this._steps.map(x => x.toJsonObject()),
            _subs: this._subs.map(x => x.toJsonObject()),
            _evt: this._evt
        };

        if(this.request!=null){
            v.request = this.request.toJsonObject();
        }

        return v;
    }

}

const none = new MerlinRule(OperatingSystem.TIZEN, {});