

export enum DexcaliburConnectionType {
    LOCAL="local",
    REMOTE="remote"
}

export interface DexcaliburConnectionParamsList {
    [name:string] :DexcaliburConnectionParams
}

/**
 * Represents connection parameters required to establish
 * a connection with a remote Dexcalibur server
 *
 * @class
 * @author Georges-Bastien Michel <georges@reversense.com>
 * @since 1.0.0
 */
export class DexcaliburConnectionParams {

    type:DexcaliburConnectionType = DexcaliburConnectionType.REMOTE;

    protocol = "http";
    /**
     *
     */
    ipv4:string = null;
    ipv6:string = null;
    port:number = null;
    hostname:string = null;

    /**
     * Name for this configuration
     *
     * @field
     * @type string
     */
    name:string = null;

    /**
     * UID
     *
     * @field
     * @type string
     */
    uid:string = null;

    /**
     * Preferred authentication type
     *
     * @field
     * @type AuthType
     */
    authType:any = null; // AuthType.PASSWORD;


    /**
     *
     * @param pUID
     * @param pName
     * @param pIP
     * @param pPort
     * @constructor
     */
    constructor( pUID:string, pName:string, pIP:string, pPort:number) {
        this.uid = pUID;
        this.name = pName;

        if(pIP != null){
          if(pIP.indexOf('.')>-1 && pIP.indexOf(':')==-1)
            this.ipv4 = pIP;
          else if(pIP.indexOf(':')==-1)
            this.ipv6 = pIP;
          else
            this.hostname = pIP;
        }


        this.port = pPort;
    }

    /**
     * To get configuration name
     */
    getName():string {
        return  this.name;
    }

    getUID():string {
        return this.uid;
    }


    getIpAddress():string{
        if(this.ipv4 != null){
            return this.ipv4
        }
        else if(this.ipv4 != null){
            return this.ipv4
        }
        else{
            return null; //throw DexcaliburConnectionException.IP_NOT_DEFINED();
        }
    }

    getHostname():string {
        if(this.hostname != null){
            return this.hostname;
        }
        else{
            return null; //throw DexcaliburConnectionException.HOSTNAME_NOT_DEFINED();
        }
    }


    getPort():number{
        if(this.port != null){
            return this.port;
        }
        else{
            return null; //throw DexcaliburConnectionException.PORT_NOT_DEFINED();
        }
    }

    static fromPoorObject(pObj:any):DexcaliburConnectionParams {
        let o:DexcaliburConnectionParams = new DexcaliburConnectionParams(
            pObj.hasOwnProperty('uid')? pObj.uid : null,
            pObj.hasOwnProperty('name')? pObj.name : null,
            pObj.hasOwnProperty('ip')? pObj.ip : null,
            pObj.hasOwnProperty('port')? pObj.port : null,
        );

        o.hostname = pObj.hasOwnProperty('hostname')? pObj.hostname : null;
        o.authType = pObj.hasOwnProperty('authType')? pObj.authType : null;

        return o;
    }
}
