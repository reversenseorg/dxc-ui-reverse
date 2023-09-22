
export interface IBridge
{
  shortname:string;

  up:boolean;

  ip:string;

  port:number;
/*
  clone():IBridge;

  isConnected():boolean;

  isReady():boolean;

  isNetworkTransport():boolean;

  isUsbTransport():boolean;

  connect( pIpAddress:string, pPortNumber:number, pDeviceID?:string):Promise<boolean>

  kill():Promise<any>;

  performProfiling():DeviceProfile;

  listDevices():Promise<Device[]>;

  listPackages(pOptions?:any):AppPackage[];

  pull(remote_path:string, local_path:string):string|Buffer;

  push(local_path:string, remote_path:string):string|Buffer;

  setTransport(transport_type:string);

  shellWithEH(command:string, callbacks:any):_child_process_.ChildProcess;

  shellWithEHsync(command:string):string|Buffer;

  shellAsync(command:string, deviceID?:string):Promise<any>;

  detachedShell( pCommand:string|string[], pArgs:string):Promise<boolean>;

  privilegedShell(command:string, pOptions?:any):Promise<boolean|string|Buffer>;

  shell(command:string):string|Buffer;

  getPackagePath(packageIdentifier:string):string;

  getDeviceID():string;

  toJsonObject(pExcludeList:any):any;*/
}
