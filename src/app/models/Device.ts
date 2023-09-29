
import ModelSyscall from "./ModelSyscall";
import {IBridge} from "./IBridge";
import DeviceProfile from "./DeviceProfile";
import {Nullable} from "../base/Nullable";
import {IStringIndex} from "../base/IStringIndex";

export enum EDevType  {
    UNKNOW=0x0,
    USB= 0x1,
    EMU= 0x2,
    ADB= 0x3,
    SDB= 0x4
};
const DEV_NAME = ['unknow','usb','emu','adb','sdb'];


export enum EOsType  {
    ANDROID= 0x0,
    LINUX= 0x1,
    TIZEN= 0x2
};
const OS_NAME = ['android','linux','tizen'];


interface BridgeList {
    [p: string]: any
}


 /**
 * This class represents a device
 *
 * @class
 * @author Georges-B MICHEL
 */
export class Device
{
    /**
     * @field
     */
    type:Nullable<EOsType> = null;

    /**
     * Flag. TRUE if currently connected, else FALSE
     *
     * @field
     */
    connected:boolean = false;

    /**
     * Default bridge for this devices
     *
     * @field
     */
    bridge:any = null; // AdbWrapper

    /**
     * Flag. TRUE if this devices is default device for instrumentation
     * @field
     * @deprecated
     */
    selected:boolean = false;

    /**
     * @field
     * @deprecated
     */
    isEmulated:boolean = false;

    /**
     * Device internal UID
     * @field
     */
    uid:Nullable<string> = null;

    /**
     * Real device ID
     * @field
     */
    id:Nullable<string> =  null;

    /**
     * TRUE if debugging is authorized, else FALSE
     * @field
     */
    authorized:boolean = true;

    /**
     * Device model
     * @field
     */
    model:Nullable<string> = null;

    /**
     * Device product name
     * @field
     */
    product:Nullable<string> = null;

    // ??s
    device:Nullable<string> = null;

    /**
     * Transport ID
     *
     * @field
     * @deprecated
     */
    transportId:Nullable<string> = null;

    /**
     * USB qualifier.
     * Change when computer-side USB port change. It help to differentiate
     * several devices with same DeviceID
     *
     * @field
     */
    usbQualifier:Nullable<string> = null;

    /**
     * Device profile built by DeviceProfiler
     * @type {DeviceProfile}
     * @field
     */
    profile:Nullable<DeviceProfile> = null;

    /**
     * Device profile built by DeviceProfiler
     * @type {DeviceProfile}
     * @field
     */
    platform:any = null;

    /**
     * Hold frida configuration specfic to the device
     * @type {Object}
     * @field
     */
    frida:any;

    /**
     * Hold all bridges (adb+usb, adb+tcp, sdb+usb, ssh, jtag, ...) configured for this device
     *
     * @type {AdbWrapper[]}
     * @field
     */
    bridges:any = {};

    /**
     * Flag. TRUE is the device is enrolled, else FALSE
     * @field
     */
    enrolled:boolean = false;

    /**
     * Flag. TRUE is the device is offline, else FALSE
     * @field
     */
    offline:boolean = false;

    /**
     * ModelSyscall
     */
    syscalls:any = null;

    /**
     * To hold exec mode : root mode / user mode
     */
    rootMode:boolean = false;

    /**
     *
     * @param {*} config
     * @constructor
     */
    constructor(config:any=null){

        this.frida = {
            server: null
        }

        if(config !== null)
            for(let i in config) (this as IStringIndex<any>)[i] = config[i];
    }

    /**
     * To add a bridge to the device
     *
     * A bridge a way to send command or interact with the device.
     *
     * @param {AdbWrapper} pBridge
     * @method
     */
    addBridge( pBridge:IBridge, pOverride:boolean=false){
        if(this.bridges[ pBridge.shortname ] == null || pOverride){
            this.bridges[ pBridge.shortname ] = pBridge;
        }
    }

    getBridge( pName:string):IBridge{
        if(this.bridges[pName] == null)
            throw new Error(`[DEVICE] The device ${this.uid} not support bridge ${pName}`);

        return this.bridges[pName];
    }

    setDefaultBridge( pName:string){
        this.bridge = this.getBridge(pName);
        //this.setUID(this.bridge.deviceID);
    }

    getDefaultBridge():IBridge{
        return this.bridge;
    }


    setEnrolled( pStatus:boolean = true){
        this.enrolled = pStatus;

        return this;
    }

    isEnrolled():boolean{
        return this.enrolled;
    }

    getProfile():any{
        return this.profile;
    }

    /**
     * To get enrollment status
     *
     * @returns {Boolean} Enrollement status : TRUE if the device is enrolled and frida ready, else FALSE
     * @method
     */
    isFridaReady():boolean{
        return this.enrolled;
    }

    /**
     * To get device status : connected / disconnected
     *
     * @returns {Boolean} TRUE if the device is connected, else FALSE
     * @method
     */
    isConnected():boolean{
        let up:boolean = false;
        for(let i in this.bridges)
            up = up || this.bridges[i].up;
        //return (this.connected == true);
        return up;
    }

    /**
    * To get authorized status
    *
    * @returns {Boolean} TRUE if the device is authorized, else FALSE
    * @method
    */
    isAuthorized():boolean{
        return (this.authorized == true);
    }

    /**
     * To disconnect "logically" a device.
     *
     * This flag is involved into connected device monitoring.
     *
     * @method
     */
    disconnect(){
        this.connected = false;
    }

    /**
     *
     * @param {*} pPath
     */
    setFridaServer( pPath:string){
        this.frida.server = pPath;
    }

    /**
     * @method
     */
    getFridaServerPath():string{
        return this.frida.server;
    }



    /**
     * To setup internal device UID
     *
     * Since several device can have the same DeviceID value,
     * UID is built by mixing several DeviceID with several data from `qualifier` array
     *
     *
     * @param {String} deviceID Value of DeviceID as returned by the device
     * @param {String[]} qualifier Additional data
     */
    setUID(deviceID:string, qualifier:any = null){
        this.uid = deviceID;
/*        for(let k in qualifier){
            this.uid += "/"+k+"/"+qualifier[k];
        }*/
    }


    /**
     * To get device UID
     *
     * TODO : fix typo
     *
     * <b>Warning : Device UID is the Dexcalibur internal UID.
     * It is not the DeviceID as returned by the device. </b>
     *
     * @returns {String} Internal device UID
     */
    getUID():Nullable<string>{
        return this.uid;
    }

    flagAsUnauthorized(){
        this.authorized = false;
    }

    setTransportId(id:string){
        this.transportId = id;
    }

    setUsbQualifier(id:string){
        this.usbQualifier = id;
        if(this.uid==null && this.id != null)
            this.setUID( this.id, {
                usb: id
            });
    }

    setModel(name:string){
        this.model = name;
    }

    setProduct(name:string){
        this.product = name;
    }

    setDevice(name:string){
        this.device = name;
    }

    exec(pCommand:string, pCallbacks:any):any{
        return this.bridge.shellWithEH(pCommand, pCallbacks);
    }

    execSync(pCommand:string):any{
        return this.bridge.shellWithEHsync(pCommand);
    }


    async privilegedExecSync(pCommand:string, pOtions:any=null):Promise<any>{
        if(pOtions == null)
            return await this.bridge.privilegedShell(pCommand);
        else
            return await this.bridge.privilegedShell(pCommand, pOtions);
    }

    getPlatform():any{
        return this.platform;
    }

    setPlatform( pPlatform:any){
        this.platform = pPlatform;
    }

    /**
     *
     * @param {Path|String} pRemotePath
     * @param {Path|String} pLocalPath
     */
    pull(pRemotePath:string, pLocalPath:string):string|Buffer{
        // remote binding
        return "";
    }

    /**
     * To pull a fil from a device and store it into temporary folder
     *
     * @param {String} pRemotePath
     * @method
     */
    pullTemp(pRemotePath:string):string{
        // remote binding
      return "";
    }

    /**
     * To push an executable binary
     *
     * @param {Path|String} pLocalPath
     * @param {Path|String} pRemotePath
     */
    pushBinary( pLocalPath:string, pRemotePath:string):string{
        // remote binding
        return "";
    }

    /**
     *
     * @param {*} pPkgIdentifier
     * @param {*} pLocalPath
     * @returns {Boolean} Return TRUE if file has been successfully downloaded, else FALSE
     * @throws {BridgeException}
     */
    pullPackage( pPkgIdentifier:string, pLocalPath:string):boolean{
        // remote binding
      return false;
    }



    /**
     *
     * @deprecated
     * @param {Object} data
     * @param {Object} callbacks
     * @param {IntentFilter} pIntentFilter An intance of the intent filter
     * @param {Boolean} force
     */
    sendIntent(data:any, callbacks:any=null, pIntentFilter:any=null, force:boolean=false):any{
        // remote binding
      return null;
    }



    /**
     * To unserialize a Device from JSON string
     *
     * @param {*} pJsonObject
     * @param {*} pOverride
     * @returns {String} JSON-serialized object
     * @method
     */
    /*
    static fromJsonObject(pBridgeSFactory:BridgeSuperFactory, pJsonObject:any, pOverride:any = {}):Device{
        let dev:any = new Device();
        for(let i in pJsonObject){
            switch(i){
                case 'type':
                    dev.type = OS_NAME.indexOf(pJsonObject[i]);
                    break;

                case 'bridges':
                    dev.bridges = {};
                    for( let j in pJsonObject.bridges){
                        // todo : replace AdbWrapeper by BridgeFactory
                        dev.bridges[j] = pBridgeSFactory.getFactory(j).fromJsonObject( pJsonObject.bridges[j]);
                    }
                    break;

                case 'profile':
                    dev[i] = ((pJsonObject[i] != null)? DeviceProfile.fromJsonObject(pJsonObject[i]) : null);
                    break;

                case 'platform':
                    dev[i] = ((pJsonObject[i] != null)? PlatformManager.getInstance().getPlatform(pJsonObject[i]) : null);
                    break;

                default:
                    dev[i] = pJsonObject[i];
                    break;
            }

        }

        dev = dev as Device;

        if(dev.bridge != null){
            dev.setDefaultBridge(dev.bridge);
        }

        for(let i in pOverride){
            dev[i] = pOverride[i];
        }

        return dev;
    }
*/



    getSyscallList():ModelSyscall[]{
        return this.syscalls;
    }
}
