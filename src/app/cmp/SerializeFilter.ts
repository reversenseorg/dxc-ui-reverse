import {Nullable} from "../base/Nullable";


export class SerializeSelector {
    field:string;
    cond:boolean = false;
    selectors:SerializeSelector[];
}



const TOKEN_RE = /^([a-zA-Z0-9_]+)(=>[a-zA-Z0-9_]+)*(<[a-zA-Z0-9_]+>)?(\[.*\])?$/;
const CLASS_RE = /^<([a-zA-Z0-9_]+)>$/;
const SUBF_RE = /^([a-zA-Z0-9_])=>([a-zA-Z0-9_]+)$/;

/**
 *  name,ret<TYPE>[field1:field2],..
 *
 *  name,absolute_size,size,children<ModelClass>[name:simpleName=>sname],children<ModelPackage>[name:sname],
 *
 */
export class SerializeFilter {

    query:any = {};
    fields:string[]


    constructor() {
    }

    prepare(pSelector:string): SerializeFilter {

        let rootFields:string[] = pSelector.split(',');

        rootFields.map( (pField) => {
            let m:Nullable<RegExpExecArray> = TOKEN_RE.exec(pField);
            if(m!=null){
                let t = null;
                if(m[1]==undefined) return;

                if(m[4]!=undefined){
                    t = m[4].substring(1,-1).split(':');
                }


                if(m[2]==undefined){
                    this.query[m[1]] = m[1];
                }else{
                    this.query[m[1]] = m[2].substr(2);
                }

                console.log(m);

            }
        });

        return this;
    }

    process( pObject:any):any {

    }

}
