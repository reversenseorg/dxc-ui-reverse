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

import {NodeInternalType, NodeInternalTypeName} from "../NodeInternalType";
import {SearchRequestCondition, SearchRequestConditionOpts, ValidateOptions} from "./SearchRequestCondition";
import {MerlinPrimitive, MerlinType} from "./Merlin";
import {OperatingSystem} from "../OperatingSystem";
import {NodeType} from "../NodeType";
import {SearchOptions} from "./MerlinRule";
import {Nullable} from "../../base/Nullable";
import {MerlinSearchAPI} from "./MerlinSearchAPI";

const TAG_TOKEN = '@';
const SEP_TOKEN = ':';
const REL_TOKEN = '.';
const REGEXP_DELIMITER_TOKEN = '/';


export enum OperationType {
  SEARCH,
  AGGR,
  FILTER,
  SIZE,
  VALIDATE,
  TIME,
  UNION,
  INTERSECT,
  JOIN,
  INNERJOIN,
  TAINT_SRC,
  TAINT_SINK,
  TAINT_STEP,
  SELECT
}

export enum OperationRequirementType {
  NESTED_REQUEST="nested request",
  PATTERN="pattern",
  DIRECT_NUMBER="number",
  DIRECT_STRING="string",
  NONE="none",
  NODE="node"
}

export interface OperationDefinition {
  type: OperationType,
  id: string,
  label: string,
  req: OperationRequirementType
}
export const SupportedOperations:OperationDefinition[] = [
    { id:"search", req: OperationRequirementType.NODE, type: OperationType.SEARCH, label:"search"  },
    { id:"aggregate", req: OperationRequirementType.PATTERN, type: OperationType.AGGR, label:"aggregate"  },
    { id:"filter", req: OperationRequirementType.PATTERN, type: OperationType.FILTER, label:"filter"  },
    { id:"size", req: OperationRequirementType.NONE, type: OperationType.SIZE, label:"size"  },
    { id:"validate", req: OperationRequirementType.NODE, type: OperationType.VALIDATE, label:"validate"  },
    { id:"before", req: OperationRequirementType.DIRECT_NUMBER, type: OperationType.TIME, label:"before"  },
    { id:"after", req: OperationRequirementType.DIRECT_NUMBER, type: OperationType.TIME, label:"after"  },
    { id:"intersect", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.INTERSECT, label:"intersect"  },
    { id:"join", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.JOIN, label:"join"  },
    { id:"innerjoin", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.INNERJOIN, label:"innerjoin"  },
    { id:"source", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.TAINT_SRC, label:"source (taint)" },
    { id:"sink", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.TAINT_SINK, label:"sink (taint)" },
    { id:"step", req: OperationRequirementType.NESTED_REQUEST, type: OperationType.TAINT_STEP, label:"step (taint)" },
    { id:"select", req: OperationRequirementType.PATTERN, type: OperationType.SELECT, label:"select" }
];

export enum Comparison {
  LTE,
  GTE,
  LT,
  GT,
  EQ
}


export interface SearchOperationArgs {
  pattern: SearchRequestCondition[]
}

export interface ValidateOperationArgs {
  pattern: string,
  opts?: ValidateOptions
}

export interface WindowingOperationArgs {
  offset?: number,
  limit?: number
}

export interface NestedRequestOperationArgs {
  request: MerlinSearchRequest,
  cond?: any
}

export interface InnerjoinOperationArgs {
  on: any|string,
  cond?: SearchRequestCondition
}

// AggregationOption
export interface AggregationOperationArgs {
  on: string,
  opts?: AggregationOption,
  size?:number
}

export interface TaintOperationArgs {
  request: MerlinSearchRequest[]
}

export interface TimeOperationArgs {
  comparison: Comparison,
  field: string,
  date: number
}

export interface Operation {
  type: OperationType,
  args: SearchOperationArgs | InnerjoinOperationArgs | TimeOperationArgs | ValidateOperationArgs | WindowingOperationArgs | NestedRequestOperationArgs | AggregationOperationArgs | TaintOperationArgs | any ;
}

interface SearchRequestOptions {
  aggregation: boolean,
  cache: boolean,
  limit: number;
  offset: number;
  nestedOp:boolean;
}

export interface AggregationOption {
  alias: string,
  size?: number
}




export interface ValidationResult {
  success: boolean,
  force: number
}


/**
 * @class
 */
export class MerlinSearchRequest {

  TYPE = MerlinType.REQUEST;

  private _live = false;

  private _targetOs:OperatingSystem = OperatingSystem.ANDROID;
  private _type:NodeInternalType;
  private _oper:Operation[];
  private _aggs = 0;
  private _search = 0;

  private _evt:string[] = []

  private _options:SearchRequestOptions = {
    aggregation: false,
    cache: true,
    limit: -1,
    offset: 0,
    nestedOp: false
  };


  /**
   *
   * @param pSearchContext
   * @param pNodeType
   * @param pOper
   */
  constructor(pNodeType:NodeInternalType, pOper:Operation[] ) {
    this._type = pNodeType;
    this._oper = pOper;
  }

  /**
   * Livre request operate exclusively in memory
   */
  isLiveRequest():boolean {
    return this._live;
  }

  countAggregation():number {
    return this._aggs;
  }

  countSearch():number {
    return this._search;
  }

  isRule():boolean {
    return false;
  }

  /**
   *
   */
  getNode():NodeInternalType {
    return this._type;
  }

  addOperation( pOper:Operation):MerlinSearchRequest {
    this._oper.push(pOper);
    return this;
  }

  /**
   * To remove all operations
   *
   * @method
   */
  flushOperations():MerlinSearchRequest {
    this._oper = [];
    return this;
  }

  /**
   *
   *  dataFormat("dataSource@microsoft:aaa")
   *
   *  "field:pattern"
   *  "field@tag"
   *  "@tag"
   *
   * { pattern:"data.event_log.id:$1", elem:[1] }
   * @param {MerlinSearchAPI} pSearchContext Context
   * @param {string} pCond Condition string
   * @param {SearchOptions} pOptions Search options
   *
   */
  static parseCondition(pCond:string, pOptions:SearchOptions):SearchRequestCondition {
    const d = pCond.indexOf(':');
    const offsetTag = pCond.indexOf('@');
    let tagUID = null;
    const cond:SearchRequestCondition = new SearchRequestCondition({
      field: null,
      pattern: null,
      tag: null,
      regexp: false,
      raw: pCond,
      opts: pOptions,
      tagKey: null
    });

    if(d>-1){
      cond.field = pCond.substr(0,d);
      cond.pattern = pCond.substr(d+1);
    }else{
      cond.pattern = null;
      cond.field = (offsetTag>-1)? pCond.substr(0, offsetTag) : pCond;
      if((offsetTag > -1) && !pOptions.query_string ){
        cond.tagKey = pCond.substr(offsetTag+1);
      }
    }

    if(cond.pattern != null){
      if(/^\/.+\/[ig]*/i.test(cond.pattern)){
        cond.turnAsRegexp();
      }
    }

    return cond;
  }




  /**
   * To parse a pattern like [native:]*ssl*.
   *
   * Legacy pattern :
   * ----------
   * is.<modifier>
   * has.<tag>
   * <property_path>:<pattern>
   *
   * Legacy behavior :
   * -----------
   * Every patterns are processed are case-sensitive RegExp
   *
   * New operations :
   * ----------------
   * [<property_path>]@<tag_uid>
   * <property_path>:/<regexp>/
   * <property_path>:<non-regexp>
   *
   - wildcard : replace any char
   - case sensitive
   - add unicode
   * @param {*} dataModel
   * @param String pattern
   * @param Boolean caseSensitive
   * @param Boolean lazy If FALSE, verify if the field exists
   * @returns {SearchPattern} The parsed search pattern, ready to be used
   */
  static parseCondition2(pCond: string, pOptions:SearchOptions):SearchRequestCondition {


    if (pCond == undefined || pCond.length == 0) {
      throw new Error("Cannot parse search condition : condition is empty");
    }

    let pattern = pCond;
    let token: string | string[] = "name", lex: number = -1, isDeepSearch: boolean = false;
    let tag:Nullable<string> = null;
    let  fn: any = null, flags: string = "";

    const cond:SearchRequestCondition = new SearchRequestCondition({
      field: null,
      pattern: null,
      tag: null,
      regexp: false,
      raw: pCond,
      opts: pOptions,
      tagKey: null
    });


    const tagPosition = pattern.indexOf(TAG_TOKEN);
    const sepPosition = pattern.indexOf(SEP_TOKEN);

    if(tagPosition>-1){
      if(sepPosition > -1 && tagPosition > sepPosition){
        // '@' character is not a token but a part of pattern
        // case :    <property_path>:any_val_with_@_char
      }else{
        // '@' is the token of a tag
        tag = pattern.substring(tagPosition+1);
        if(tagPosition>0)
          token = pattern.substring(0,tagPosition);
        else
          token = "";
      }
    }

    if(tag==null){
      // parse pattern
      // "is"
      if(pattern.substring(0, 3) == "is.") {
        if ((lex = pattern.indexOf(SEP_TOKEN)) > -1) {
          token = pattern.substring(3, lex - 3);
          pattern = pattern.substr(lex + 1, pattern.length - lex - 1);
        } else {
          token = pattern.substr(3, pattern.length - 3);
          pattern = "";
        }

        cond.pattern = pattern;
        cond.field = token;

      } /*else if (pattern.substring(0, 4) == "has.") {
        //console.debug("Tag-based request detected");

        cond.pattern = null;
        cond.tagKey = pattern.substring(4);
      } */else {
            if ((lex = pattern.indexOf(SEP_TOKEN)) > -1) {
              cond.field = token = pattern.substring(0, lex);
              cond.pattern = pattern = pattern.substring(lex + 1);
            } else {
              // DEFAULT field must be parameterized, it depends of root node
              cond.field = token = "name";
              //pattern = pattern; //"";
            }
      }

    }else{
      cond.field = token;
      cond.tagKey = tag;
    }

    /*
    if ((lex = pattern.indexOf(SEP_TOKEN)) > -1) {
      token = pattern.substring(0, lex);
      pattern = pattern.substring(lex + 1);
    } else {
      token = "name";
    }*/

    // check if it is a deep search
    if (token.indexOf(REL_TOKEN) > -1) {
      //token = token.split(".");
      isDeepSearch = true;
      //console.debug("Deep search detected !");
    }


    // TODO : remove -non-lazy mode
    /*if (lazy === false && isDeepSearch === false && dataModel[token] === undefined) {
      Logger.info("[!] The property '" + token + "' not exists for these objects");
      return null;
    }*/

    const lastDeliminiter = pattern.lastIndexOf(REGEXP_DELIMITER_TOKEN);
    if(pattern.length>-1
        && pattern[0]==REGEXP_DELIMITER_TOKEN
        && (lastDeliminiter > 0)){

      //const reFlags = pattern.substring(lastDeliminiter+1);

      //const rx = new RegExp(pattern.substring(1,lastDeliminiter), reFlags);


      cond.regexp = true;
      cond.turnAsRegexp();
      //cond.pattern = rx;

    }else if(pattern.length > 0){
      // Logger.raw("Strict equal > ",pattern);
      fn = function (x:string) {
        return (pattern.localeCompare(x,"en", {sensitivity: 'case'})===0);
      };
      cond.pattern = pattern;
    }

    return cond;
  }




  /**
   *
   * @param pSearchContext
   * @param pNodeType
   * @param pCondition
   * @param pOptions
   */
  static fromCondition( pNodeType:NodeInternalType, pCondition:string|any, pOptions:SearchOptions):MerlinSearchRequest {
    const req = new MerlinSearchRequest(pNodeType, [] );

    if((typeof pCondition)==="string"){
      if(pCondition.length>0){
        req.addOperation({
          type:OperationType.SEARCH, args:{
            pattern: [MerlinSearchRequest.parseCondition2(pCondition, pOptions)]
          }
        });
      }
    }else if(pCondition!=null){
      req.addOperation({
        type:OperationType.SEARCH, args:{
          pattern: MerlinSearchRequest.parseObjectCondition(pCondition, pOptions)
        }
      });
    }
    return req;
  }



  /**
   * To parse a complex object-based condition
   *
   * { name:"/test/", enclosingClass:{ name:"/Json/" } }
   *
   *
   * @param pConditions
   * @param pOptions
   */
  static parseObjectCondition(pConditions:any, pOptions:any):SearchRequestCondition[] {

    let cs:SearchRequestCondition[] = [];
    let c:SearchRequestCondition, test:any;

    // flatten tree
    function flatten(pObj:any, pPath = ""):SearchRequestCondition[]{
      let a:any;
      let local:SearchRequestCondition[] = [];
      let src:SearchRequestCondition;

      for(let ppt in pObj){
        a = pObj[ppt];
        if(typeof a==='object'){
          if(a!=null){
            local = local.concat(flatten(a, (pPath.length>0? pPath+".":"")+ppt));
          }else{
            // ignored because NULL value is not yet supported
          }
        }else{
          src = MerlinSearchRequest.parseConditionString(a, null, false);
          src.field = (pPath.length>0? pPath+".":"")+ppt;
          local.push(src);
        }
      }

      return local;
    }

    cs = flatten(pConditions);

    console.log(cs);

    return cs;
  }


  /**
   * To parse only the condition string in various context : string-based and object-based condition
   *
   * @param pPattern
   * @param pOptions
   * @param pWithField
   * @returns {SearchRequestCondition}
   * @method
   */
  static parseConditionString( pPattern:string, pOptions:any = null, pWithField = true):SearchRequestCondition {
    const cond = new SearchRequestCondition({
      field: null,
      pattern: null,
      obj: true,
      tag: null,
      regexp: false,
      raw: pPattern,
      opts: pOptions,
      tagKey: null
    });

    let tag:Nullable<string>=null, token:Nullable<string> = null, pattern = "";

    const tagPosition = pPattern.indexOf(TAG_TOKEN);
    const sepPosition = pPattern.indexOf(SEP_TOKEN);

    if(tagPosition>-1){
      if(sepPosition > -1 && tagPosition > sepPosition){
        // '@' character is not a token but a part of pattern
        // case :    <property_path>:any_val_with_@_char
      }else{
        // '@' is the token of a tag
        tag = pPattern.substring(tagPosition+1);
        if(tagPosition>0)
          token = pPattern.substring(0,tagPosition);
        else
          token = "";
      }
    }

    if(tag==null){
      if(!pWithField) {
        // { name: "/test/" }
        cond.field = null;
        cond.pattern = pattern = pPattern;
      }else if (sepPosition > -1) {
        // { name: ":/test/" }  OR  "name:/test/"
        cond.field = token = pPattern.substring(0, sepPosition);
        cond.pattern = pattern = pPattern.substring(sepPosition + 1);
      } else {
        // Never trigged by object-based condition
        // DEFAULT field must be parameterized, it depends of root node
        throw new Error("Invalid pattern : no field"); //MerlinSearchRequestException.INVALID_PATTERN_NO_FIELD(pPattern);
      }
    }else{
      cond.field = token;
      cond.tagKey = tag;
    }


    const lastDeliminiter = pattern.lastIndexOf(REGEXP_DELIMITER_TOKEN);
    if(pattern.length>-1
        && pattern[0]==REGEXP_DELIMITER_TOKEN
        && (lastDeliminiter > 0)){

      // detect regexp
      cond.regexp = true;
      try{
        cond.turnAsRegexp();
      }catch(e){
        cond.setError( { msg: (e !=null ? (e as any).msg : null) });
      }
    }else if(pattern.length > 0){
      cond.pattern = pattern;
    }

    return cond;
  }



  /*
  static newLiveRequest(pSearchContext:MerlinSearchAPI, pNodeType:NodeType):MerlinSearchRequest{
    const req = new MerlinSearchRequest(pSearchContext, pNodeType, [] );
    req._live = true;
    return req;
  }*/

  /**
   *
   * @param pPattern
   * @param pOptions
   */
  validate( pPattern:string, pOptions:ValidateOptions = {exists:true}):MerlinSearchRequest {
    this.addOperation({
      type:OperationType.VALIDATE, args:{
        pattern: pPattern,
        opts: pOptions
      }
    });
    return this;
  }


  /**
   * If NO cache, then the request ll be executed on DB server, and the cache ill not be refresh
   */
  nocache():MerlinSearchRequest {
    this._options.cache = false;
    return this;
  }

  search( pRequest:string, pOptions:SearchOptions = { not:false }):MerlinSearchRequest {
    this._oper.push({
        type: OperationType.SEARCH,
        args:{
            pattern: [
                MerlinSearchRequest.parseCondition2(pRequest,pOptions)
            ]
        } });
    this._search++;
    return this;
  }

    searchObj( pRequest:SearchRequestConditionOpts, pOptions:SearchOptions = { not:false }):MerlinSearchRequest {
        this._oper.push({
            type: OperationType.SEARCH,
            args:{
                pattern: [
                    //MerlinSearchRequest.parseCondition2(pRequest,pOptions)
                    new SearchRequestCondition({
                        field: pRequest.field,
                        pattern:  pRequest.pattern,
                        tag: pRequest.tag,
                        regexp: pRequest.regexp,
                        raw: pRequest.raw,
                        opts: pOptions,
                        tagKey: pRequest.tagKey
                    })
                ]
            } });
        this._search++;
        return this;
    }


  not( pRequest:string, pOptions:SearchOptions = { not:true }):MerlinSearchRequest {
     // force
    pOptions.not = true;
    this._oper.push({ type: OperationType.SEARCH, args:{ pattern: [MerlinSearchRequest.parseCondition2(pRequest,pOptions)] } });
    this._search++;
    return this;
  }


  after( pDate:string, pField:string = "@timestamp"):MerlinSearchRequest {
    const date = (pDate=="now")? (new Date()) : new Date(pDate);
    this._oper.push({ type: OperationType.TIME, args: { comparison:Comparison.GTE, field:pField, date:date.getTime() } });
    return this;
  }

  before( pDate:string, pField:string= "@timestamp"):MerlinSearchRequest {
    const date = (pDate=="now")? (new Date()) : new Date(pDate);
    this._oper.push({ type: OperationType.TIME, args: { comparison:Comparison.LTE, field:pField, date:date.getTime() } });
    return this;
  }

  filter( pRequest:string, pOptions:SearchOptions = { not:false }):MerlinSearchRequest{
    // force NOT to be false
    pOptions.not = false;
    this._oper.push({ type: OperationType.FILTER, args:{ pattern: [MerlinSearchRequest.parseCondition2(pRequest,pOptions)] } });
    return this;
  }

  /**
   * To perform request on data encapsulated into a bus event
   *
   * @param {string} pBusEventType Event type
   * @return {MerlinSearchRequest} The request instance
   * @method
   */
  on(pBusEventType:string):MerlinSearchRequest{
    this._evt.push(pBusEventType);
    return this;
  }

  /**
   *
   */
  hasAggregate(){
    if(this._options.nestedOp){
      let hasAggr = false;
      this._oper.map(x => {
        switch (x.type){
          case OperationType.UNION:
          case OperationType.INTERSECT:
          case OperationType.JOIN:
            hasAggr = hasAggr || ((x.args as NestedRequestOperationArgs).request as MerlinSearchRequest).hasAggregate();
            break;
        }
      });
      return hasAggr;
    }else{
      return (this._options.aggregation === true);
    }
  }

  select( pNodePpt:any, pOpts?:any):MerlinSearchRequest {
    //this._oper.push({ type: OperationType.FILTER, args: { on:pNodePpt, opts:pOpts } });
    this._oper.push({ type: OperationType.INNERJOIN, args: { on:pNodePpt, opts:pOpts } });
    return this;
  }

  aggregate( pOn:string, pAggOptions:AggregationOption):MerlinSearchRequest{
    this._options.aggregation = true;
    this._oper.push({ type: OperationType.AGGR, args: { on:pOn, opts:pAggOptions } });
    this._aggs++;
    return this;
  }


  union(pNestedRequest:MerlinSearchRequest):MerlinSearchRequest {
    this._options.nestedOp = true;
    this._oper.push({ type: OperationType.UNION, args: { request:pNestedRequest } });
    return this;
  }


  intersect(pNestedRequest:MerlinSearchRequest):MerlinSearchRequest {
    this._options.nestedOp = true;
    this._oper.push({ type: OperationType.INTERSECT, args: { request:pNestedRequest } });
    return this;
  }

  join(pNestedRequest:MerlinSearchRequest, pCondition:string[]):MerlinSearchRequest {
    this._options.nestedOp = true;
    this._oper.push({ type: OperationType.JOIN, args: { request:pNestedRequest, cond:pCondition } });
    return this;
  }

  /**
   *
   * @param pSize
   */
  limit(pSize:number):MerlinSearchRequest {
    this._options.limit = pSize;
    this._oper.push({ type: OperationType.SIZE, args: { limit:pSize } });
    return this;
  }

  offset(pOffset:number):MerlinSearchRequest {
    this._options.offset = pOffset;
    this._oper.push({ type: OperationType.SIZE, args: { offset:pOffset } });
    return this;
  }

  getOperations():Operation[] {
    return this._oper;
  }

  getLatestOperation():Operation {
    return this._oper.slice(-1)[0];
  }

  toSearchString():string {
    let s = "";
    switch (this._targetOs){
      case OperatingSystem.ANDROID:
        s += "android()";
        break;
      case OperatingSystem.TIZEN:
        s += "tizen()";
        break;
      case OperatingSystem.IOS:
        s += "ios()";
        break;
      case OperatingSystem.MACOS:
        s += "macos()";
        break;
    }

    return s+MerlinSearchRequest.stringify(this.getOperations(),this._type);
  }

  static load(){

  }


  /**
   * To stringify a list of operations
   *
   * @param pOperations
   */
  static stringify( pOperations:Operation[], pNodeType:NodeInternalType|string|any=null):string{
    let s = "";

    if(pOperations==null || !Array.isArray(pOperations)) return "";

    let nodeType:any = null;

    if(pNodeType!=null){
      if(typeof (pNodeType)==="string"){
        nodeType = pNodeType;
      }else{
        nodeType = MerlinSearchAPI.getMethodFromNodeType(pNodeType);
      }
    }



    /*

  query_string?:boolean;

  regexp?:boolean;

  not: boolean;

  copyTo?:any;
     */
    pOperations.map((x:Operation,i:number)=>{
      switch (x.type){
        case OperationType.SEARCH:
          let o = ", {";
          const sArgs:SearchOperationArgs = x.args as SearchOperationArgs;

          if(sArgs.pattern !=null){
            if(sArgs.pattern[0].opts!=null){
              if(sArgs.pattern[0].opts.query_string) o += ` query_string: ${JSON.stringify(sArgs.pattern[0].opts.query_string)},`;
              if(sArgs.pattern[0].opts.not) o += ` not: ${JSON.stringify(sArgs.pattern[0].opts.not)},`;
              if(sArgs.pattern[0].opts.regexp) o += ` regexp: "${sArgs.pattern[0].opts.regexp}",`;
              if(sArgs.pattern[0].opts.range) o += ` range: [${JSON.stringify(sArgs.pattern[0].opts.range)}],`;
              if(sArgs.pattern[0].opts.copyTo) o += ` copyTo: ${JSON.stringify(sArgs.pattern[0].opts.copyTo)},`;
              if(sArgs.pattern[0].opts.strict) o += ` strict: ${JSON.stringify(sArgs.pattern[0].opts.strict)},`;
            }

            if(o.length>3){
              o =  o.substring(0,o.length-1)+ "}";
            } else{
              o= "";
            }
          }else{
            o = "";
          }

          if(nodeType==null)
            s += ".search";
          else
            s += `.${nodeType}`;


          if(sArgs.pattern[0].field!=null){
            s += `("${sArgs.pattern[0].field}:${sArgs.pattern[0].raw}"${o})`;
          }else{
            s += `("${sArgs.pattern[0].raw}"${o})`;
          }
          break;
        case OperationType.FILTER:
          let f = "";
          const fArgs:SearchOperationArgs = x.args as SearchOperationArgs;

          if(fArgs.pattern!=null){
            if(fArgs.pattern[0].opts!=null){
              f = ", {";
              if(fArgs.pattern[0].opts.query_string) f += ` query_string: ${JSON.stringify(fArgs.pattern[0].opts.query_string)},`;
              if(fArgs.pattern[0].opts.not) f += ` not: ${JSON.stringify(fArgs.pattern[0].opts.not)},`;
              if(fArgs.pattern[0].opts.regexp) f += ` regexp: "${fArgs.pattern[0].opts.regexp}",`;
              if(fArgs.pattern[0].opts.range) f += ` range: [${JSON.stringify(fArgs.pattern[0].opts.range)}],`;
              if(fArgs.pattern[0].opts.copyTo) f += ` copyTo: ${JSON.stringify(fArgs.pattern[0].opts.exists)},`;
              if(fArgs.pattern[0].opts.strict) f += ` strict: ${JSON.stringify(fArgs.pattern[0].opts.strict)},`;


              if(f.length>3){
                f =  f.substring(0,f.length-1)+ "}";
              } else{
                f= "";
              }
            }else{
              f = "";
            }

            s += `.filter("${fArgs.pattern[0].raw}"${f})`;
          }


          break;
        case OperationType.INNERJOIN:
          let nn = ", {";
          const nnArgs:InnerjoinOperationArgs = x.args as InnerjoinOperationArgs;

          if(x.args!=null){
            if(nnArgs.cond!=null){
              if(nnArgs.cond.opts!=null){
                if(nnArgs.cond.opts.query_string) nn += ` query_string: ${JSON.stringify(nnArgs.cond.opts.query_string)},`;
                if(nnArgs.cond.opts.not) nn += ` not: ${JSON.stringify(nnArgs.cond.opts.not)},`;
                if(nnArgs.cond.opts.regexp) nn += ` regexp: "${nnArgs.cond.opts.regexp}",`;
                if(nnArgs.cond.opts.range) nn += ` range: [${JSON.stringify(nnArgs.cond.opts.range)}],`;
                if(nnArgs.cond.opts.copyTo) nn += ` copyTo: ${JSON.stringify(nnArgs.cond.opts.copyTo)},`;
                if(nnArgs.cond.opts.strict) nn += ` strict: ${JSON.stringify(nnArgs.cond.opts.strict)},`;
              }


              if(nn.length>3){
                nn =  nn.substring(0,nn.length-1)+ "}";
              } else{
                nn= "";
              }

            }else{
              nn = "";
            }

            if(nnArgs.on != null){
              if(typeof nnArgs.on=="string"){
                s += `.select("${nnArgs.on}"${nn})`;
              }else{
                s += `.select("${nnArgs.on.getName()}"${nn})`;
              }

            }
          }else{
            console.error(x,this);
          }





          break;
        case OperationType.VALIDATE:
          let opts = ", {";
          const vArgs:ValidateOperationArgs = x.args as ValidateOperationArgs;
          if(vArgs.opts!=null){
            if(vArgs.opts.range) opts += ` range: ${JSON.stringify(vArgs.opts.range)},`;
            if(vArgs.opts.interval) opts += ` interval: ${JSON.stringify(vArgs.opts.interval)},`;
            if(vArgs.opts.regexp){
              let pat:string = (vArgs.opts.regexp as RegExp).toString();
              if(pat[0]=='/'&& pat[pat.length-1]=='/'){
                pat = pat.substring(1, pat.length-1);
              }


              opts += ` regexp: "${pat}",`;
            }
            if(vArgs.opts.exists) opts += ` exists: ${JSON.stringify(vArgs.opts.exists)},`;
          }

          if(opts.length>1) opts =  opts.substring(0,opts.length-1);
          opts += "}";
          s += `.validate("${vArgs.pattern}"${opts})`;
          break;
        case OperationType.SIZE:
          const wArgs:WindowingOperationArgs = x.args as WindowingOperationArgs;
          if(wArgs.offset!=null){
            s += `.offset(${wArgs.offset})`;
          }
          else if(wArgs.limit!=null){
            s += `.limit(${wArgs.limit})`;
          }
          break;
        case OperationType.TIME:
          const tArgs:TimeOperationArgs = x.args as TimeOperationArgs;
          if(tArgs.comparison == Comparison.GTE){
            s += `.after("${tArgs.date}", "${tArgs.field}")`;
          }else{
            s += `.before("${tArgs.date}", "${tArgs.field}")`;
          }
          break;
        case OperationType.AGGR:
          const aArgs:AggregationOperationArgs = x.args as AggregationOperationArgs;
          if(aArgs.opts==null){
            s += `.aggregate("${aArgs.on}", { ${aArgs.size? "size:"+aArgs.size : "" })`;
          }else{
            s += `.aggregate("${aArgs.on}", { alias:${aArgs.opts.alias} ${aArgs.size? ",size:"+aArgs.size : "" })`;
          }
          break;
        case OperationType.UNION:
          const uArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          s += `.union(${uArgs.request.toSearchString()})`;
          break;
        case OperationType.INTERSECT:
          const iArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          if(iArgs!= null && iArgs.request!=null){
            s += `.intersect(${iArgs.request.toSearchString()})`;
          }else{
            console.error(this,iArgs);
            s += ".intersect(UNDEFINED)";
          }

          // s += `.intersect("${iArgs.on}", { alias:${x.args.opts.alias} ${x.args.size? ",size:"+x.args.size : "" })`;
          break;
        case OperationType.JOIN:
          const jArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          if(jArgs!=null && jArgs.request!=null){
            s += `.join(${jArgs.request.toSearchString()}, ${JSON.stringify(jArgs.cond)})`;
          }else{
            console.error(this,jArgs);
            s += ".join(UNDEFINED)";
          }

          //s += `.join( "${x.args.on}", { alias:${x.args.opts.alias} ${x.args.size? ",size:"+x.args.size : "" })`;
          break;
      }
    })
    return s;
  }


  /**
   * To stringify a list of operations
   *
   * @param pOperations
   */
  static stringify2( pOperations:Operation[], pNodeType:Nullable<NodeInternalType|string>=null):string{
    let s = "";

    if(pOperations==null || !Array.isArray(pOperations)) return "";

    let nodeType:Nullable<string> = null;

    if(pNodeType!=null){
      if(typeof (pNodeType)==="string"){
        nodeType = pNodeType;
      }else{
        nodeType = MerlinSearchAPI.getMethodFromNodeType(pNodeType);
      }
    }



    /*

  query_string?:boolean;

  regexp?:boolean;

  not: boolean;

  copyTo?:any;
     */
    pOperations.map((x:Operation,i:number)=>{
      switch (x.type){
        case OperationType.SEARCH:
          let o = ", {";
          const sArgs:SearchOperationArgs = x.args as SearchOperationArgs;

          if(sArgs.pattern !=null){
            if(sArgs.pattern[0].opts!=null){
              if(sArgs.pattern[0].opts.query_string) o += ` query_string: ${JSON.stringify(sArgs.pattern[0].opts.query_string)},`;
              if(sArgs.pattern[0].opts.not) o += ` not: ${JSON.stringify(sArgs.pattern[0].opts.not)},`;
              if(sArgs.pattern[0].opts.regexp) o += ` regexp: "${sArgs.pattern[0].opts.regexp}",`;
              if(sArgs.pattern[0].opts.range) o += ` range: [${JSON.stringify(sArgs.pattern[0].opts.range)}],`;
              if(sArgs.pattern[0].opts.copyTo) o += ` copyTo: ${JSON.stringify(sArgs.pattern[0].opts.copyTo)},`;
              if(sArgs.pattern[0].opts.strict) o += ` strict: ${JSON.stringify(sArgs.pattern[0].opts.strict)},`;
            }

            if(s.length>1) o =  o.substring(0,o.length-1);
            o += "}";
          }else{
            o = "";
          }

          if(nodeType==null)
            s += `.search("${sArgs.pattern[0].raw}"${o})`;
          else
            s += `.${nodeType}("${sArgs.pattern[0].raw}"${o})`;

          break;
        case OperationType.FILTER:
          let f = "";
          const fArgs:SearchOperationArgs = x.args as SearchOperationArgs;

          if(fArgs.pattern!=null){
            if(fArgs.pattern[0].opts!=null){
              f = ", {";
              if(fArgs.pattern[0].opts.query_string) f += ` query_string: ${JSON.stringify(fArgs.pattern[0].opts.query_string)},`;
              if(fArgs.pattern[0].opts.not) f += ` not: ${JSON.stringify(fArgs.pattern[0].opts.not)},`;
              if(fArgs.pattern[0].opts.regexp) f += ` regexp: "${fArgs.pattern[0].opts.regexp}",`;
              if(fArgs.pattern[0].opts.range) f += ` range: [${JSON.stringify(fArgs.pattern[0].opts.range)}],`;
              if(fArgs.pattern[0].opts.copyTo) f += ` copyTo: ${JSON.stringify(fArgs.pattern[0].opts.exists)},`;
              if(fArgs.pattern[0].opts.strict) f += ` strict: ${JSON.stringify(fArgs.pattern[0].opts.strict)},`;
              if(f.length>3) f =  f.substring(0,f.length-1);
              f += "}";
            }else{
              f = "";
            }

            s += `.filter("${fArgs.pattern[0].raw}"${f})`;
          }


          break;
        case OperationType.INNERJOIN:
          let nn = ", {";
          const nnArgs:InnerjoinOperationArgs = x.args as InnerjoinOperationArgs;

          if(x.args!=null){
            if(nnArgs.cond!=null){
              if(nnArgs.cond.opts!=null){
                if(nnArgs.cond.opts.query_string) nn += ` query_string: ${JSON.stringify(nnArgs.cond.opts.query_string)},`;
                if(nnArgs.cond.opts.not) nn += ` not: ${JSON.stringify(nnArgs.cond.opts.not)},`;
                if(nnArgs.cond.opts.regexp) nn += ` regexp: "${nnArgs.cond.opts.regexp}",`;
                if(nnArgs.cond.opts.range) nn += ` range: [${JSON.stringify(nnArgs.cond.opts.range)}],`;
                if(nnArgs.cond.opts.copyTo) nn += ` copyTo: ${JSON.stringify(nnArgs.cond.opts.exists)},`;
                if(nnArgs.cond.opts.strict) nn += ` strict: ${JSON.stringify(nnArgs.cond.opts.strict)},`;
              }

              if(nn.length>1) nn =  nn.substring(0,nn.length-1);
              nn += "}";

            }else{
              nn = "";
            }

            if(nnArgs.on != null){
              if(typeof nnArgs.on=="string"){
                s += `.select("${nnArgs.on}"${nn})`;
              }else{
                s += `.select("${nnArgs.on.getName()}"${nn})`;
              }

            }
          }else{
            console.error(x,this);
          }





          break;
        case OperationType.VALIDATE:
          let opts = ", {";
          const vArgs:ValidateOperationArgs = x.args as ValidateOperationArgs;
          if(vArgs.opts!=null){
            if(vArgs.opts.range) opts += ` range: ${JSON.stringify(vArgs.opts.range)},`;
            if(vArgs.opts.interval) opts += ` interval: ${JSON.stringify(vArgs.opts.interval)},`;
            if(vArgs.opts.regexp){
              let pat:string = (vArgs.opts.regexp as RegExp).toString();
              if(pat[0]=='/'&& pat[pat.length-1]=='/'){
                pat = pat.substring(1, pat.length-1);
              }


              opts += ` regexp: "${pat}",`;
            }
            if(vArgs.opts.exists) opts += ` exists: ${JSON.stringify(vArgs.opts.exists)},`;
          }

          if(opts.length>1) opts =  opts.substring(0,opts.length-1);
          opts += "}";
          s += `.validate("${vArgs.pattern}"${opts})`;
          break;
        case OperationType.SIZE:
          const wArgs:WindowingOperationArgs = x.args as WindowingOperationArgs;
          if(wArgs.offset!=null){
            s += `.offset(${wArgs.offset})`;
          }
          else if(wArgs.limit!=null){
            s += `.limit(${wArgs.limit})`;
          }
          break;
        case OperationType.TIME:
          const tArgs:TimeOperationArgs = x.args as TimeOperationArgs;
          if(tArgs.comparison == Comparison.GTE){
            s += `.after("${tArgs.date}", "${tArgs.field}")`;
          }else{
            s += `.before("${tArgs.date}", "${tArgs.field}")`;
          }
          break;
        case OperationType.AGGR:
          const aArgs:AggregationOperationArgs = x.args as AggregationOperationArgs;
          if(aArgs.opts==null){
            s += `.aggregate("${aArgs.on}", { ${aArgs.size? "size:"+aArgs.size : "" })`;
          }else{
            s += `.aggregate("${aArgs.on}", { alias:${aArgs.opts.alias} ${aArgs.size? ",size:"+aArgs.size : "" })`;
          }
          break;
        case OperationType.UNION:
          const uArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          s += `.union(${uArgs.request.toSearchString()})`;
          break;
        case OperationType.INTERSECT:
          const iArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          if(iArgs!= null && iArgs.request!=null){
            s += `.intersect(${iArgs.request.toSearchString()})`;
          }else{
            console.error(this,iArgs);
            s += ".intersect(UNDEFINED)";
          }

          // s += `.intersect("${iArgs.on}", { alias:${x.args.opts.alias} ${x.args.size? ",size:"+x.args.size : "" })`;
          break;
        case OperationType.JOIN:
          const jArgs:NestedRequestOperationArgs = x.args as NestedRequestOperationArgs;
          if(jArgs!=null && jArgs.request!=null){
            s += `.join(${jArgs.request.toSearchString()}, ${JSON.stringify(jArgs.cond)})`;
          }else{
            console.error(this,jArgs);
            s += ".join(UNDEFINED)";
          }

          //s += `.join( "${x.args.on}", { alias:${x.args.opts.alias} ${x.args.size? ",size:"+x.args.size : "" })`;
          break;
      }
    })
    return s;
  }

  /**
   * A phase is a set of combinable operation.
   * Two phases cannot be merged, all the entries matching the first phase must be found before to enter into next phase
   * Some DBMS can handle multiplse phase into the same request
   *
   * @method
   */
  getPhases():Operation[][] {
    let phases:Operation[][] = [];
    let currPhase:Operation[] = [];
    let op:Operation;
    for(let i=0; i<this._oper.length; i++){
      op = this._oper[i];
      switch (op.type){
        case OperationType.SEARCH:
        case OperationType.TIME:
        case OperationType.FILTER:
        case OperationType.VALIDATE:
          currPhase.push(this._oper[i]);
          break;
        case OperationType.UNION:
        case OperationType.INTERSECT:
        case OperationType.INNERJOIN:
        case OperationType.JOIN:
        case OperationType.AGGR:
        case OperationType.SIZE:
          phases.push(currPhase);
          phases.push([this._oper[i]]);
          currPhase = [];
          break;
      }
    }
    if(currPhase.length > 0){
      phases.push(currPhase);
    }
    return phases;
  }




  /**
   *
   */
  toJsonObject():any {

    let _type:any = "";
    if(typeof (this._type)==="string"){
      _type  = this._type; //NodeInternalTypeName[this._type];
    }
    else if(typeof (this._type)==="object"){

      _type = this._type; //(this._type as any).getType();
    }
    else{
      console.log("MerlinSearchRequest.toJsonObject _type ! : "+(typeof (this._type))+","+this._type);
      _type = this._type;
    }

      let o:any = {
        TYPE: this.TYPE,
        _live: this._live,
        _type: _type,
        _search: this._search,
        _aggs: this._aggs,
        _options: this._options,
        _evt: this._evt,
        _oper: this.getOperations(),
        __stringified: ""
      };

    this.getOperations().map((vOpe,vIdx) => {
      switch (vOpe.type){
       /* case OperationType.INNERJOIN:
          break;
        case OperationType.TAINT_SRC:
        case OperationType.TAINT_SINK:
          break;*/
        default:
          o._oper[vIdx] = vOpe;
          break;
      }
    });

      o.__stringified = "";// MerlinSearchRequest.stringify(this.getOperations(), o._type);
      return o;
  }


  static fromJsonObject(pObject:any):MerlinSearchRequest {
    const r = new MerlinSearchRequest(pObject._type, pObject._oper)
    r._live = pObject._live;
    r._aggs = pObject._aggs;
    r._options = pObject._options;
    r._evt = pObject._evt;
    r._search = pObject._search;
    return r;
  }

  static getFirstOperationsDef():OperationDefinition[] {
    return SupportedOperations.filter(o => {
        return ([
            OperationType.SEARCH,
            OperationType.AGGR,
            OperationType.TAINT_SRC
        ].indexOf(o.type)>-1)
    })
  }
}
