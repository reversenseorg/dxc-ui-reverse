import {Device} from "../../models/Device";


export type DeviceBindedData<T extends any> = T & {
    dev: Device,
    _t?:string,
    _e?:any
    [ppt:string]:any
}
