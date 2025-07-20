import {NodeInternalType} from "../../models/NodeInternalType";

export interface IDxRefreshable {
    dxRefresh(...opts:any[]):void;
}


export interface DxApiResponse<T> {
    success:boolean;
    msg?:string;
    data?:T;
}


export interface INodeRef {
    __:NodeInternalType;
    _uid:any;
}