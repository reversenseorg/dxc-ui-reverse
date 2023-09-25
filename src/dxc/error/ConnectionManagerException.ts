import {ErrorCode, MonitoredError} from "./MonitoredError.js";

export class ConnectionManagerException extends MonitoredError {

    static CODE = {
      EMPTY_CONN_PARAMS: ErrorCode.CONN + 301,
      EMPTY_CREDS: ErrorCode.CONN + 302,
      AUTH_TYPE_UNSUPPORTED: ErrorCode.CONN + 303,
      MISSING_CONN_FILE: ErrorCode.CONN + 304,
      SAVE_FAILED_MISSING_PATH: ErrorCode.CONN + 305
    }
    static EMPTY_CONN_PARAMS = ()=>{
        return new ConnectionManagerException("The connection params are not provided.",
            ErrorCode.CONN + 301) };

    static EMPTY_CREDS = ()=>{
        return new ConnectionManagerException("The credentials are not provided",
            ErrorCode.CONN + 302) };

    static AUTH_TYPE_UNSUPPORTED = ()=>{
        return new ConnectionManagerException("This authentication type is not supported by remote server.",
            ErrorCode.CONN + 303) };


    static MISSING_CONN_FILE = ()=>{
      return new ConnectionManagerException("Missing connection profile file found.",
        ErrorCode.CONN + 304) };

  static SAVE_FAILED_MISSING_PATH = ()=>{
    return new ConnectionManagerException("Save failed, file path is missing.",
      ErrorCode.CONN + 305) };

    constructor( pMsg:string, pCode:number = -1, pExtra:any = null) {
        super('CONNECTION MGR', pMsg, pCode, pExtra);
    }
}
