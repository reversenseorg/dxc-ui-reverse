
import {SearchOptions} from "./MerlinSearchAPI.js";
import {Tag} from "../tags/Tag";
import {Nullable} from "../../base/Nullable";

const REGEXP_DELIMITER_TOKEN = '/';

export interface ValidateOptions {
  range?: any[],
  interval?: any[],
  regexp?: RegExp,
  exists?: boolean,

  strict?: boolean
}

export interface SearchRequestConditionOpts extends Record<string,any>{
    depth?:Nullable<number>;
    tag?: Nullable<Tag>;
    tagKey?: Nullable<string>;
    pattern?: Nullable<string>;
    field?: Nullable<string>;
    raw?:Nullable<string>;
    regexp?:Nullable<boolean>;
    opts?:SearchOptions;
}


/**
 * Represent a condition from a search request
 *
 * @class
 */
export class SearchRequestCondition {

  static WILDCARD = '*';

  depth = 3;
  tag: Nullable<Tag> = null;
  tagKey: string|null = null;
  pattern: string|null = null;
  field: string|null = null;
  raw = "";
  regexp:boolean = false;

  opts:SearchOptions = { not:false };

  private _re:RegExp|null = null;
  error: any = {}

  constructor(pConfig:SearchRequestConditionOpts) {
    for(let i in pConfig){
      if(this.hasOwnProperty(i)){
        (this as Record<string,any>)[i] = pConfig[i];
      }
    }

    if(this.regexp===true && this.pattern!=null){
      this._re = new RegExp(this.pattern);
    }
  }

  hasPattern():boolean {
    return (this.pattern != null);
  }


  setError(pOptions:any):void {
    this.error = pOptions;
  }

  turnAsRegexp(pSkipClean = false):void{
    if(this.pattern==null){
      this._re = new RegExp("//");
      return;
    }

    this.regexp = true;
    let p:Nullable<string> = this.pattern;
    if(!pSkipClean){

      const lastDeliminiter = p.lastIndexOf(REGEXP_DELIMITER_TOKEN);
      if(p.length>-1
          && p[0]==REGEXP_DELIMITER_TOKEN
          && (lastDeliminiter > 0)){

        const reFlags = p.substring(lastDeliminiter+1);
        this.pattern = this.pattern.substring(1,lastDeliminiter)
        this._re = new RegExp(p.substring(1,lastDeliminiter), reFlags);
        return;
      }
    }

    this._re = new RegExp(p);
  }

  isQueryString():boolean {
    return (this.opts.hasOwnProperty('query_string') && (this.opts.query_string===true));
  }

  isRegExp():boolean {
    return (this.opts.hasOwnProperty('regexp') && (this.opts.regexp===true));
  }

  isStrict():boolean {
    return (this.opts.strict!=null) && this.opts.strict;
  }

  isRange():boolean {
    return  (this.opts.range!=null) && (this.opts.range.length>0);
  }

  isNotMatch():boolean {
    return this.opts.not;
  }

  getRaw():string {
    return this.raw;
  }

  getRange():string[] {
    return this.opts.range as string[];
  }

}
