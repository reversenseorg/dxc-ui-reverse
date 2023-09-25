import {ErrorCode, MonitoredError} from "../../../dxc/error/MonitoredError";


export class UIException extends MonitoredError {

    static CODE = {
        CTRL_NOT_INITIALIZED: ErrorCode.UI + 301,
        APP_NOT_INITIALIZED: ErrorCode.UI + 302,
        CONTROLLER_NOT_READY: ErrorCode.UI + 303,
        WEBSOCKET_CHANNEL_IS_NOT_READY: ErrorCode.UI + 304,
        CTX_MENU_NOT_READY: ErrorCode.UI + 305,
        PROJECT_IS_NOT_READY: ErrorCode.UI + 306,
        DEVICE_IS_NOT_SELECTED: ErrorCode.UI + 307,
        SOMETHING_IS_WRONG_WITH_REQUEST: ErrorCode.UI + 308,
        AUTH_ERROR: ErrorCode.UI + 309,
        MODAL_IS_NOT_READY: ErrorCode.UI + 310,
    }


    static MODAL_IS_NOT_READY = (pModal="-",)=>{
        return new UIException("Modal is not ready : "+pModal,
            UIException.CODE.MODAL_IS_NOT_READY) };

    static AUTH_ERROR = (pCmp="-",)=>{
        return new UIException("Authentication eeror : "+pCmp,
            UIException.CODE.AUTH_ERROR) };

    static APP_NOT_INITIALIZED = (pCmp="-",pOpe="-")=>{
        return new UIException("The main stage is not initialized.[cmp="+pCmp+"][ope="+pOpe+"]",
            UIException.CODE.APP_NOT_INITIALIZED) };

    static CONTROLLER_NOT_READY = (pCtrl:string)=>{
        return new UIException("The controller ["+pCtrl+"] is not ready",
            UIException.CODE.CONTROLLER_NOT_READY) };

    static WEBSOCKET_CHANNEL_IS_NOT_READY = (pCmp:string,pOpe:string)=>{
        return new UIException("Operation ["+pOpe+"] cannot be performed. The websocket channel is not ready in comp  ["+pCmp+"]",
            UIException.CODE.WEBSOCKET_CHANNEL_IS_NOT_READY) };

    static CTX_MENU_NOT_READY = (pCmp:string,pOpe:string)=>{
        return new UIException("Operation ["+pOpe+"] cannot be performed. The conntextual menu is not ready in ["+pCmp+"]",
            UIException.CODE.CTX_MENU_NOT_READY) };

    static PROJECT_IS_NOT_READY = (pCmp:string,pOpe:string)=>{
        return new UIException("Operation ["+pOpe+"] cannot be performed. The project is not ready in ["+pCmp+"]",
            UIException.CODE.CTX_MENU_NOT_READY) };

    static DEVICE_IS_NOT_SELECTED = (pCmp:string,pOpe:string)=>{
        return new UIException("Operation ["+pCmp+" > "+pOpe+"] cannot be performed. A device must be specified or selected by a click",
            UIException.CODE.DEVICE_IS_NOT_SELECTED) };


    static SOMETHING_IS_WRONG_WITH_REQUEST = (pCause = "")=>{
        return new UIException("The search request cannot be built. "+pCause,
            UIException.CODE.SOMETHING_IS_WRONG_WITH_REQUEST) };







    constructor( pMsg:string, pCode:number = -1, pExtra:any = null) {
        super('UI', pMsg, pCode, pExtra);
    }
}