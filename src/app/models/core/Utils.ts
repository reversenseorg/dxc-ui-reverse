




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

export interface SearchValueMatch {
    name: string;
    value: string;
}

const RE_REPLACE:RegExp = /[-\/\\^$*+?.()|[\]{}]/g;


const NO_FLAG = 0x0;
const FLAG_CR = 0x1;
const FLAG_WS = 0x2;
const FLAG_TB = 0x4;

const PATTERNS:any = {};





PATTERNS[FLAG_CR] = new RegExp("^[\n]*$");
PATTERNS[FLAG_WS] = new RegExp("^[\s]*$");
PATTERNS[FLAG_TB] = new RegExp("^[\t]*$");
PATTERNS[FLAG_CR | FLAG_WS] = new RegExp("^[\n\s]*$");
PATTERNS[FLAG_CR | FLAG_TB] = new RegExp("^[\n\t]*$");
PATTERNS[FLAG_WS | FLAG_TB] = new RegExp("^[\s\t]*$");
PATTERNS[FLAG_WS | FLAG_CR | FLAG_TB] = new RegExp("^[\s\t\n]*$");



export default class Utils {
    static ALPHA:string = 'abcdefghijklmnopqrstuvwxyz';
    static ALPHANUM:string =  'abcdefghijklmnopqrstuvwxyz0123456789';
    static FLAG_CR:number =  FLAG_CR;
    static FLAG_WS:number =  FLAG_WS;
    static FLAG_TB:number =  FLAG_TB;
    static NO_FLAG:number =  NO_FLAG;

    /**
     * To retrieve the value of an arbitrary field from an arbitrary object
     * and to return a default fixed value if the field not exists.
     *
     * Important : it work only is the requested field has not getter.
     *
     * @param {any} pRawObject The target object
     * @param {string} pFieldName The field name
     * @param {any} pDefault The default value is the field is empty
     * @return {any} The value of the field or the default value
     * @method
     * @static
     * @since 1.0
     */
    static getValue( pRawObject:any, pFieldName:string, pDefault:any):any {
        return (pRawObject!=null && pRawObject.hasOwnProperty(pFieldName)? pRawObject[pFieldName] : pDefault);
    }

    static b64_encode(src:string):string{
        return Buffer.from(src).toString('base64');
    }

    static b64_decode(src:string):string{
        return Buffer.from(src, 'base64').toString('ascii');
    }

    static decodeURI(uri:string):string{
        return decodeURIComponent(uri);
    }

    static encodeURI(uri:string):string{
        return encodeURIComponent(uri);
    }

    /**
     * To promisify setTimeout
     *
     * @param {number} pDuration
     * @return {Promise<any>}
     * @method
     * @since 1.0.0
     */
    static async asyncTimeout( pDuration:number):Promise<any> {
        return new Promise( resolve => setTimeout( resolve, pDuration));
    }

    /**
     * To remove empty characters from the begin and the end of a string
     *
     * @param str
     * @param pNoRmCrlf
     */
    static trim(str:string, pNoRmCrlf=false):string{
        //if(!(str instanceof String)) console.error("trim() : the argument must be a string");

        const wl = (pNoRmCrlf ? ["\t"," "] : ["\t"," ","\r","\n"]);

//        while(str[0]!=undefined && (str[0]=="\t"||str[0]==" "))
        while(str[0]!=undefined && (wl.indexOf(str[0])>-1))
                str=str.substr(1);

//        while(str[str.length]!=undefined && (str[str.length]=="\t"||str[str.length]==" "))
        while(str[str.length-1]!=undefined && (wl.indexOf(str[str.length-1])>-1))
            str=str.substr(0,str.length-1);

        return str;
    }

    // do  a deep copy of an object to a var
    static deepCopy(src:any,dst:any){
        for(let k in src){
            if(src[k] instanceof Object)
                Utils.deepCopy(src[k],dst[k]);
            else
                dst[k]=src[k];
        }
    }

    static count(list:any):number{
        let k=0;
        for(let j in list) k++;
        return k;
    }


    static time():number{
        return (new Date()).getTime();
    }

    static RegExpEscape(val:string):string{
        return val.replace(RE_REPLACE,'\\$&');
    }

    static escapeRE(data:string):string{
        // regexp replace ici
        while(data.indexOf(".")>-1){
            data = data.replace(".","<<>>");
        }
        while(data.indexOf("<<>>")>-1) {
            data = data.replace("<<>>","\\.");
        }
        return data;
    }

    static randString(size:number, charset:string):string{
        let s:string ="";

        while(s.length <= size){
            s += charset[Math.round(Math.random() * (charset.length-1))];
        }
        return s;
    }

    static isEmpty( pVar:any, pFlags:any=NO_FLAG):boolean{
        let f:boolean=false;

        if(Array.isArray(pVar)){
            if(pFlags != null)
                f = (pVar.length==0);
            else{
                f = true;
                for(let i=0; i<pVar.length; i++){
                    f = f && Utils.isEmpty( pVar[i], Utils.FLAG_WS | Utils.FLAG_CR);
                }
            }
            return f;
        }

        switch(typeof pVar){
            case 'string':
                f = true;
                if(pFlags == Utils.NO_FLAG)
                    f = f && (pVar.length==0);
                else{
                    f = f && PATTERNS[pFlags].test(pVar);
                }
                break;
            default: 
                f = false;
                break;
        }

        return f;
    }


    static parseIPv4( pAddress:string, pHasPortNumber:boolean=false):any{
        const IPv4 = '(?<a>25[0–5]|2[0–4][0–9]|1[0-9]{2}|[0-9]{1,2})\.(?<b>25[0–5]|2[0–4][0–9]|1[0-9]{2}|[0-9]{1,2})\.(?<c>25[0–5]|2[0–4][0–9]|1[0-9]{2}|[0-9]{1,2})\.(?<d>25[0–5]|2[0–4][0–9]|1[0-9]{2}|[0-9]{1,2})';
        const PORT ='(?<port>[0-9]{1,5})' ;

        if(pAddress == null) return { valid:false };

        let RE:RegExp = new RegExp(IPv4 + (pHasPortNumber? ':'+PORT:''));
        let res:RegExpExecArray|null = RE.exec(pAddress) ;

        if(res !== null && res.index==0 && pAddress==res[0]){

            if(res.groups==null) return false;

            if(parseInt(res.groups.port,10) > 65535) return false;

            return { valid:true, ip: `${res.groups.a}.${res.groups.b}.${res.groups.c}.${res.groups.d}`, port:res.groups.port };
        }else{
            return { valid:false };
        }
    }


    static ANSI = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;

    static stripAnsi( pText:string):string  {
        return (typeof pText === 'string' ? pText.replace(Utils.ANSI, '') : pText);
    }



    /**
     * To append a relative URI at the end of an existing one.
     *
     * It removes additional slashes.
     *
     * @param {string} pBasePath The URI base
     * @param {string} pRelPath The URI to append to existing
     * @return {string} Resulting URI
     * @method
     * @static
     */
    static concatAsURI( pPathParts:string[]):string {
        let path: string = "";
        const size = pPathParts.length-1;

        pPathParts.map( (vPath:string, vOffset:number)=>{
            const start=((vOffset>0 && vPath[0] === '/') ? 1 : 0);
            const last=vPath.length-1;

            if(vOffset==size || vPath[last] === '/'){
                path += vPath.substring(start)
            }else{
                path +=  vPath.substring(start)+"/";
            }
        });

        return path;
    }


    /**
     * To search a data by regexp inside an object at a configurable depth
     *
     * Return all matching values with access path as a string
     *
     * @param pObject
     * @param pAccessPath
     * @param pBlacklist
     * @param tab
     */
    static searchValue(pRegexp:RegExp, pObject: any, pAccessPath: string,
                       pBlacklist:string[], pMaxDepth:number, pMatches: SearchValueMatch[], pCurrDepth:number = 0):void {

        let basePath:string;

        if (typeof pObject === 'object'
            && (pMaxDepth==-1 || pCurrDepth <= pMaxDepth)) {

            basePath = ( pAccessPath != null ? pAccessPath+"." : "" );

            Object.keys(pObject).forEach((vKey) => {
                if (pBlacklist.indexOf(basePath + vKey) == -1)
                    Utils.searchValue(
                        pRegexp,
                        pObject[vKey],
                        basePath + vKey,
                        pBlacklist,
                        pMaxDepth,
                        pMatches,
                        pCurrDepth+1);
            });
        }
        else if (pRegexp.test(pObject)){
            pMatches.push({ name: pAccessPath, value: pObject });
        }
    }



    /**
     * To search a data by regexp inside an object at a configurable depth
     *
     * Return all matching values with access path as a string
     *
     * @param pObject
     * @param pAccessPath
     * @param pBlacklist
     * @param tab
     */
    static readValue(pObject: any, pAccessPath: string):any {


        const levels = pAccessPath.split('.');
        let node = pObject;

        for(let i=0; i<levels.length; i++){
            if((typeof (node) === 'object') && (node !== null) && (node !==undefined)){
                if(node.hasOwnProperty(levels[i])){
                    node = node[levels[i]];
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }

        return node;
    }

    static aggregateValue(pObject: any, pAccessPath: string):any {


        const levels = pAccessPath.split('.');
        let node = pObject;

        for(let i=0; i<levels.length; i++){
            if((typeof (node) === 'object') && (node !== null) && (node !==undefined)){
                if(node.hasOwnProperty(levels[i])){
                    node = node[levels[i]];
                }else{
                    return null;
                }
            }else{
                return null;
            }
        }

        return node;
    }


    /**
     * To search a data by regexp inside an object at a configurable depth
     *
     * Return all matching values with access path as a string
     *
     * @param pObject
     * @param pAccessPath
     * @param pBlacklist
     * @param tab
     */
    static walkOver(pObject: any, pCallback:any, pAccessPath: string,
                    pBlacklist:string[], pMaxDepth:number,  pCurrDepth:number = 0):any {

        let basePath:string;

        if (typeof pObject === 'object'
            && (pMaxDepth==-1 || pCurrDepth <= pMaxDepth)) {

            basePath = ( pAccessPath != null ? pAccessPath+"." : "" );

            Object.keys(pObject).forEach((vKey) => {
                if (pBlacklist.indexOf(basePath + vKey) == -1)
                    Utils.walkOver(
                        pObject[vKey],
                        pCallback,
                        basePath + vKey,
                        pBlacklist,
                        pMaxDepth,
                        pCurrDepth+1);
            });
        }
        else{
            pCallback.bind(pObject);
        }
    }

}

