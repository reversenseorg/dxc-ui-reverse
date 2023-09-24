import {ErrorCode, MonitoredError} from "../../../dxc/error/MonitoredError";


export class UIException extends MonitoredError {

    static CODE = {
        CTRL_NOT_INITIALIZED: ErrorCode.UI + 301,
        APP_NOT_INITIALIZED: ErrorCode.UI + 301,
    }

    static APP_NOT_INITIALIZED = ()=>{
        return new UIException("The main stage is not initialized.",
            UIException.CODE.APP_NOT_INITIALIZED) };


    constructor( pMsg:string, pCode:number = -1, pExtra:any = null) {
        super('UI', pMsg, pCode, pExtra);
    }
}