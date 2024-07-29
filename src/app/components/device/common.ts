import {Device} from "../../models/Device";


export type DeviceBindedData<T extends any> = T & {
    dev: Device,
    _t?:string,
    _e?:any
    [ppt:string]:any
}


export interface ProfilingOpts {
    rooted?:boolean;
}

export interface FridaInstallOpts {
    devicePath?:string;
    offline?:boolean;
    randomName?:boolean;
}

export interface EnrollmentOpts {
    frida?:FridaInstallOpts;
    profiling?:ProfilingOpts;
}