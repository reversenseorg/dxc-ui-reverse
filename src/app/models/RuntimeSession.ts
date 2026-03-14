import {UserAccountUUID} from "./user/UserAccount";
import DexcaliburProject, {DexcaliburProjectUUID} from "./DexcaliburProject";
import {DeviceUUID} from "./Device";
import {NodeInternalType} from "./NodeInternalType";
import {HookSessionUUID} from "../components/hooks/ctrl/HookSession";
import {Nullable} from "../base/Nullable";
import HookSession from "./hook/HookSession";


export type RuntimeSessionUUID = string;

export interface RuntimeSessionOpts extends Record<string,any>{
    uuid?:RuntimeSessionUUID;
    owner?:UserAccountUUID;
    project?:DexcaliburProjectUUID;
    device?:DeviceUUID;
}

export class RuntimeSession {

    __ = NodeInternalType.RUNTIME_SESS;

    uuid:Nullable<RuntimeSessionUUID>;
    hksess:HookSessionUUID[] = [];
    owner:Nullable<UserAccountUUID> = null;
    project:Nullable<DexcaliburProjectUUID> = null;
    device:Nullable<DeviceUUID> = null;
    tools:any[] = [];
    tags:number[] = [];

    _ctx:Nullable<DexcaliburProject> = null;

    _sess:Record<HookSessionUUID , HookSession> = {};

    constructor(pOpts:RuntimeSessionOpts){
        if(pOpts!=null){
            for (let i in pOpts){
                (this as any)[i] = pOpts[i];
            }
        }
    }

    getUID(): Nullable<RuntimeSessionUUID> {
        return this.uuid;
    }

    addHookSess(pSess:HookSession):any{
        const u = pSess.getUID();
        if(u==null) return;

        this._sess[u] = pSess;
    }

    subscribe(pHkSess:HookSessionUUID, pListener:any):any{
        if(this._sess[pHkSess]==null) return;

        //this._sess[pHkSess].;
    }

    unsubscribe(pHkSess:HookSessionUUID):void{
        //this._subs
    }

    toJsonObject(pOption?: any): any {
        return {
            uuid: this.uuid,
            hksess: this.hksess,
            owner: this.owner,
            project: this.project,
            device: this.device,
            tools: this.tools,
            tags: this.tags
        }
    }
}