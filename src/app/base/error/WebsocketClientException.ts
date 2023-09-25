import {ErrorCode, MonitoredError} from "../../../dxc/error/MonitoredError";


export class WebsocketClientException extends MonitoredError {

    static CODE = {
        SESSID_IS_NOT_DEFINED: ErrorCode.UI + 401,
    }

    static SESSID_IS_NOT_DEFINED = ()=>{
        return new WebsocketClientException("Session ID is null",
            WebsocketClientException.CODE.SESSID_IS_NOT_DEFINED) };



    constructor( pMsg:string, pCode:number = -1, pExtra:any = null) {
        super('WEBSOCKET CLIENT', pMsg, pCode, pExtra);
    }
}