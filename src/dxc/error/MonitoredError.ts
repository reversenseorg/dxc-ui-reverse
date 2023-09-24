export enum ErrorCode {
    GLOBAL= 1000,
    CONN= 20000,
    UI=120000
}


export class MonitoredError extends Error {

    /**
     * Component name
     *
     * @field
     * @type string
     */
    cmp:string;
    code:number;
    extra:any;

    constructor( pCmp:string, pMsg:string, pCode:number = null, pExtra:any = null) {
        super(pMsg);
        this.cmp = pCmp;
        this.code = pCode;
        this.extra = pExtra;
    }

    getCode():number {
        return this.code;
    }


    getExtra():any {
        return this.extra;
    }

    toString():string {
        return `[${this.cmp}] [#${this.code!=null ? this.code : "<null>"} ${this.message}`;
    }

    /**
     *
     * @param pIncludeExtra
     */
    toObject(pIncludeExtra=false):any {
        return {
            cmp: this.cmp,
            code: this.code,
            msg: this.message,
            extra: pIncludeExtra ? this.extra : null
        }
    }
}
