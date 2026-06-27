/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Injectable} from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import {filter, finalize, findIndex, from, mergeAll, Observable, skip, Subject, Subscription, windowCount} from 'rxjs';
import {map} from 'rxjs/operators';
import {UploadUID} from "../applications/upload/upload-form.component";
import {AuthService} from "../auth/ctrl/auth.service";
import {AuditService} from "../audit/ctrl/audit.service";
import { OutputService } from "../output/ctrl/output.service";
import {DxcApiService} from "../../base/DxcApiService";
import {Nullable} from "../../base/Nullable";
import {OrganizationUnit, OrganizationUnitUUID} from "../../models/orgs/OrganizationUnit";
import {Connection, ConnectionProtocol, ProtocolMapping} from "../../models/orgs/auth/Connection";
import {OutputMessage} from "../../cmp/OutputMessage";
import {BusinessPlan, BusinessPlanType} from "src/app/models/billing/BusinessPlan";
import {UserGroup, UserGroupUUID} from "../../models/user/UserGroup";
import {UserAccount, UserAccountUUID} from "../../models/user/UserAccount";
import {DxApiResponse} from "../../base/common/common";
import {OperatingSystem} from "../../models/OperatingSystem";
import {EngineNode, EngineNodeUUID} from "../../models/core/EngineNode";
import {ReversenseProduct, ReversenseProductUUID} from "src/app/models/billing/ReversenseProduct";
import {Role} from "../../models/user/Role";
import {Access} from "../../models/user/acl/Access";
import {Secret, SecretUUID} from "../../models/core/Secret";
import {ApplicationUnit, ApplicationUnitUUID} from "../../models/ApplicationUnit";
import {Device, DeviceUUID} from "../../models/Device";
import {Purchase} from "../../models/billing/Purchase";
import {AppPreview} from "../../models/AppPackage";
import AssuranceModel from "../../models/audit/common/AssuranceModel";
import {AuthModule} from "../../models/user/auth/AuthModule";
import {AuthModuleFactory} from "../../models/user/auth/AuthModuleFactory";
import {AccountService} from "../account/account.service";


const AUTH_ENFORCE = false;

export interface ConnectionProtocolType {
    name: string,
    value: ConnectionProtocol,
    label: string,
    icon: string[],
    disabled: boolean
}

export interface SsoOptions {
    clientId?: string;
    clientSecret?: string;
    discoverUri?: string;
}


/**
 * Represent the service to manage projects
 *
 * @class
 */
@Injectable({
    providedIn: 'root'
})
export class OrganizationService extends DxcApiService {



    /**
     * Active organization (in browser window)
     */
    currentOrg:Nullable<OrganizationUnit> = null;

    orgSwitch$: Subject<OrganizationUnit> = new Subject<OrganizationUnit>();
    newApp$: Subject<OrganizationUnit> = new Subject<OrganizationUnit>();

    private _protos: ConnectionProtocolType[] = [];

    /**
     *
     * @param {OutputService} outputSvc
     * @param {HttpClient} _http
     * @constructor
     */
    constructor( private authSvc:AuthService,
                 private auditSvc:AuditService,
                 private _accService: AccountService,
                 private outputSvc:OutputService,
                 _http:HttpClient) {
        super(
            {
                org: {
                    list: { method: 'GET', url:'/organization/ou/list', format:'json', auth:AUTH_ENFORCE, puid:false },
                    create: { method: 'POST', url:'/organization/ou/create', format:'json', auth:AUTH_ENFORCE, puid:false},
                    info: { method: 'GET', url:'/organization/ou/org/:uid', format:'json', auth:AUTH_ENFORCE, puid:false },
                    edit: { method: 'PUT', url:'/organization/ou/org/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    delete: { method: 'DELETE', url:'/organization/ou/org/:uid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    rerollokc: { method: 'POST', url:'/organization/ou/org/:uid/okc/reroll', format:'json', auth:AUTH_ENFORCE, puid:false},
                    removeDev: { method: 'DELETE', url:'/organization/ou/org/:oid/device/:dev', format:'json', auth:AUTH_ENFORCE},
                    attach: { method: 'POST', url:'/organization/ou/org/:oid/dev/attach', format:'json', auth:AUTH_ENFORCE},
                    detach: { method: 'POST', url:'/organization/ou/org/:oid/dev/detach', format:'json', auth:AUTH_ENFORCE},
                    settings: { method: 'POST', url:'/organization/ou/org/:oid/settings', format:'json', auth:AUTH_ENFORCE}
                },
                app: {
                    list: { method: 'GET', url:'/organization/ou/org/:oid/au/list', format:'json', auth:AUTH_ENFORCE, puid:false },
                    create: { method: 'POST', url:'/organization/ou/org/:oid/au/create', format:'json', auth:AUTH_ENFORCE, puid:false},
                    edit: { method: 'PUT', url:'/organization/ou/org/:oid/au/app/:aid', format:'json', auth:AUTH_ENFORCE, puid:false },
                    delete: { method: 'DELETE', url:'/organization/ou/org/:oid/au/app/:aid', format:'json', auth:AUTH_ENFORCE, puid:false },
                    removeDev: { method: 'DELETE', url:'/organization/ou/org/:oid/au/app/:aid/device/:dev', format:'json', auth:AUTH_ENFORCE},
                    attach: { method: 'POST', url:'/organization/ou/app/:aid/dev/attach', format:'json', auth:AUTH_ENFORCE},
                    detach: { method: 'POST', url:'/organization/ou/app/:aid/dev/detach', format:'json', auth:AUTH_ENFORCE},
                    find: { method: 'GET', url:'/organization/ou/app/:aid/info', format:'json', auth:AUTH_ENFORCE},
                    licenseStatus: { method: 'GET', url:'/organization/ou/app/:aid/license/activated', format:'json', auth:AUTH_ENFORCE},
                    licenseActivate: { method: 'POST', url:'/organization/ou/app/:aid/license/activate', format:'json', auth:AUTH_ENFORCE},
                    updateAttr: { method: 'PUT', url:'/organization/ou/app/:aid/attr/:attr', format:'json', auth:AUTH_ENFORCE, puid:false },
                    readAttr:  { method: 'GET', url:'/organization/ou/app/:aid/attr/:attr', format:'json', auth:AUTH_ENFORCE, puid:false },
                    preview_upl:  { method: 'POST', url:'/organization/ou/org/:oid/upload/:uplid/preview', format:'json', auth:AUTH_ENFORCE, puid:false },
                },
                conn: {
                    list: { method: 'GET', url:'/organization/ou/org/:oid/conn/list', format:'json', auth:AUTH_ENFORCE, puid:false },
                    create: { method: 'POST', url:'/organization/ou/org/:oid/conn/create', format:'json', auth:AUTH_ENFORCE, puid:false},
                    proto_list: { method: 'GET', url:'/organization/ou/org/:oid/conn/protos', format:'json', auth:AUTH_ENFORCE, puid:false},
                    proto: { method: 'GET', url:'/organization/ou/org/:oid/conn/proto/:proto', format:'json', auth:AUTH_ENFORCE, puid:false},
                    edit: { method: 'PUT', url:'/organization/ou/org/:oid/conn/cid/:cid', format:'json', auth:AUTH_ENFORCE, puid:false },
                    delete: { method: 'DELETE', url:'/organization/ou/org/:oid/conn/cid/:cid', format:'json', auth:AUTH_ENFORCE, puid:false }
                },
                secrets: {
                    list: { method: 'GET', url:'/organization/ou/org/:oid/secrets/list', format:'json', auth:AUTH_ENFORCE, puid:false },
                    create: { method: 'POST', url:'/organization/ou/org/:oid/secrets/create', format:'json', auth:AUTH_ENFORCE, puid:false},
                    delete: { method: 'DELETE', url:'/organization/ou/org/:oid/secret/:sid', format:'json', auth:AUTH_ENFORCE, puid:false }
                },
                members:{
                    list: { method: 'GET', url:'/organization/ou/org/:uid/members/list', format:'json', auth:false },
                    create: { method: 'POST', url:'/organization/ou/org/:oid/members/create', format:'json', auth:false },
                    update: { method: 'PUT', url:'/organization/ou/org/:oid/member/:uid', format:'json', auth:false },
                    assign: { method: 'PUT', url:'/organization/ou/org/:oid/member/:uid/roles', format:'json', auth:false },
                    chpwd: { method: 'PUT', url:'/organization/ou/org/:oid/member/:uid/pwd', format:'json', auth:false },
                    drop: { method: 'DELETE', url:'/organization/ou/org/:oid/member/:uid', format:'json', auth:false },
                    unlock: { method: 'POST', url:'/organization/ou/org/:oid/member/:uid/unlock', format:'json', auth:false },
                    lock: { method: 'POST', url:'/organization/ou/org/:oid/member/:uid/lock', format:'json', auth:false },
                    activate: { method: 'POST', url:'/organization/ou/org/:oid/member/:uid/activate', format:'json', auth:false },
                    unlockMail: { method: 'POST', url:'/organization/ou/org/:oid/member/:uid/send_unlock', format:'json', auth:false },
                    activationMail: { method: 'POST', url:'/organization/ou/org/:oid/member/:uid/send_activate', format:'json', auth:false },
                    invite: { method: 'POST', url:'/organization/ou/org/:uid/members/invite', format:'json', auth:AUTH_ENFORCE }
                },
                usergroup:{
                    create: { method: 'POST', url:'/organization/ou/org/:uid/usergroups', format:'json', auth:AUTH_ENFORCE },
                    update: { method: 'PUT', url:'/organization/ou/org/:uid/usergroup/:grp', format:'json', auth:AUTH_ENFORCE },
                    drop: { method: 'DELETE', url:'/organization/ou/org/:uid/usergroup/:grp', format:'json', auth:AUTH_ENFORCE },
                    list: { method: 'GET', url:'/organization/ou/org/:uid/usergroups', format:'json', auth:AUTH_ENFORCE },
                    roles: { method: 'GET', url:'/organization/ou/org/:uid/usergroup/:grp/roles', format:'json', auth:AUTH_ENFORCE },
                    members: { method: 'GET', url:'/organization/ou/org/:uid/usergroup/:grp/members', format:'json', auth:AUTH_ENFORCE },
                    mbs_update: { method: 'PUT', url:'/organization/ou/org/:uid/usergroup/:grp/members', format:'json', auth:AUTH_ENFORCE }
                },
                sso: {
                    test: { method: 'POST', url:'/organization/sso/conf/test', format:'json', auth:AUTH_ENFORCE, puid:false },
                    save: { method: 'POST', url:'/organization/sso/conf/update', format:'json', auth:AUTH_ENFORCE, puid:false},
                },
                roles:{
                    list: { method: 'GET', url:'/organization/ou/org/:uid/roles', format:'json', auth:AUTH_ENFORCE, puid:false},
                },
                runner:{
                    list: { method: 'GET', url:'/organization/ou/org/:uid/runners', format:'json', auth:AUTH_ENFORCE, puid:false},
                    stop: { method: 'POST', url:'/organization/ou/org/:uid/runner/:node/stop', format:'json', auth:AUTH_ENFORCE, puid:false}
                },
                mkp:{
                    list: { method: 'GET', url:'/mkp/list/:oid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    owned: { method: 'GET', url:'/mkp/owned/:oid', format:'json', auth:AUTH_ENFORCE, puid:false},
                    buy: { method: 'POST', url:'/mkp/buy', format:'json', auth:AUTH_ENFORCE, puid:false}
                },
                authmod: {
                    list: { method: 'GET', url:'/organization/auth/module', format:'json', auth:AUTH_ENFORCE, puid:false },
                    save: { method: 'POST', url:'/organization/auth/module', format:'json', auth:AUTH_ENFORCE, puid:false},
                    edit: { method: 'PUT', url:'/organization/auth/module', format:'json', auth:AUTH_ENFORCE, puid:false},
                    test: { method: 'POST', url:'/organization/auth/test/conn', format:'json', auth:AUTH_ENFORCE, puid:false},
                }
            },_http, outputSvc
        );

        this.orgSwitch$.subscribe((vOrg:OrganizationUnit)=>{
            this._saveCurrentOrg(vOrg);
        });
    }

    storeSwitchOrgUnit(pOrgUnit:OrganizationUnit){
        localStorage.setItem('org.current', pOrgUnit.getUID());
    }

    /**
     * To restore the org unit from :
     * - local storage
     * - favorite org from user preferences
     * - the list organization associated to user
     *
     */
    restoreOrgUnit():Observable<OrganizationUnit[]>{

        // check first favorite from user accounbt
        /*let prefOUID = this._accService.getCurrentUser().subscribe((vAccount: Nullable<UserAccount>) => {
            if(vAccount!=null){
                this.loggedUser = vAccount;
            }
        })*/
        let prefOUID = null;
        // if null, try to restore from local storage
        if(prefOUID==null){
            prefOUID = localStorage.getItem('org.current');
        }

        if(prefOUID!=null){
            return this.getOrganization(prefOUID).pipe(
                filter(vO => (vO!=null)),
                //windowCount(1),
                //map(win => win.pipe(skip(1))), // skip first of every 3 clicks
                //mergeAll()
            ) as any;

        }else{
            return this.listOrgUnit().pipe(map((vO, vI)=>{
                return [vO[0]];
            })) as any;
        }
    }

    listOrgUnit():Observable<OrganizationUnit[]>{
        return this._process(
            this.endpoints['org']['list']
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const orgs:OrganizationUnit[] = [];
                    pEl.data.map( (data:any) => {

                        const o = new OrganizationUnit(data);

                        if(pEl.data.businessPlan!=null){
                            o.businessPlan = BusinessPlan.fromJsonObject(data.businessPlan);
                        }


                        orgs.push(o);
                    });
                    return orgs;
                }else{
                    return [];
                }
            })
        );
    }

    setActiveOrg(pOrgUnit:OrganizationUnit):void {
        this.currentOrg = pOrgUnit;
        this.orgSwitch$.next(this.currentOrg);
    }

    createOrgUnit(pOrgUnit:OrganizationUnit):Observable<Nullable<OrganizationUnit>>{
        return this._process(
            this.endpoints['org']['create'],
            pOrgUnit.toJsonObject()
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){

                    const o = new OrganizationUnit(pEl.data);
                    if(pEl.data.businessPlan!=null) {
                        o.businessPlan = BusinessPlan.fromJsonObject(pEl.data.businessPlan);
                    }
                    return o;
                }else{
                    this.outputSvc.alert( OutputMessage.newError({
                        msg: pEl.msg
                    }));
                    return null;
                }
            })
        );
    }

    updateOrgUnit(pOrgUnit:OrganizationUnit):Observable<boolean>{
        return this._process(
            this.endpoints['org']['update'],
            pOrgUnit.toJsonObject()
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    deleteOrgUnit(pOrgUnit:OrganizationUnit):Observable<boolean>{
        return this._process(
            this.endpoints['org']['delete'],
            { uid: pOrgUnit.getUID() }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    rerollOKC(pOrgUnit:OrganizationUnit):Observable<boolean>{
        return this._process(
            this.endpoints['org']['rerollokc'],
            { uid: pOrgUnit.getUID() }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }


    listAppUnit(pOrgUUID:OrganizationUnitUUID):Observable<ApplicationUnit[]>{
        return this._process(
            this.endpoints['app']['list'],{
                oid: pOrgUUID
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const apps:ApplicationUnit[] = [];
                    if(pEl.data!=null){
                        pEl.data.map( (data:any) => {
                            apps.push(new ApplicationUnit(data));
                        });
                    }
                    return apps;
                }else{
                    return [];
                }
            })
        );
    }

    /**
     * To list only activated app unit
     *
     * @param pOrg
     */
    listActivatedAppUnit(pOrg:OrganizationUnit):Observable<ApplicationUnit[]>{
        return this.listAppUnit(pOrg.getUID()).pipe(
            map((vApps:ApplicationUnit[]) => {
                let bp = pOrg.getBusinessPlan();

                if(bp==null) return [];

                return vApps; /*.filter((kApp)=>{
                    return (bp.hasSubscriptionFor(kApp.getUID()));
                });*/
            })
        )
    }

    /**
     *
     * @param pOrg
     */
    countAppUnit(pOrg:OrganizationUnit):Observable<number>{
        return this.listAppUnit(pOrg.getUID()).pipe(
            map((vApps:ApplicationUnit[]) => {
                return vApps.length;
            })
        );
    }

    createAppUnit(pOrg:OrganizationUnit, pUnit:any):Observable<Nullable<ApplicationUnit>>{
        return this._process(
            this.endpoints['app']['create'],{
                oid: pOrg.getUID(),
                ... pUnit.toJsonObject(),
                members: pUnit.getMembersUUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return new ApplicationUnit(pEl.data);
                }else{
                    return null;
                }
            })
        );
    }

    updateAppUnit(pOrg:OrganizationUnit, pUnit:ApplicationUnit):Observable<boolean>{
        return this._process(
            this.endpoints['app']['update'],
            {
                aid: pUnit.getUID(),
                oid: pOrg.getUID(),
                ... pUnit.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    deleteAppUnit(pOrg:OrganizationUnit, pUnit:ApplicationUnit):Observable<DxApiResponse<any>>{
        return this._process(
            this.endpoints['app']['delete'],
            {
                aid: pUnit.getUID(),
                oid: pOrg.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl;
            })
        );
    }

    getProducts(pOrgUnit: OrganizationUnit):Observable<AssuranceModel[]> {
        // todo
        return this.auditSvc.getModels(pOrgUnit.getUID());
    }

    saveSsoSettings(pOrg:OrganizationUnit, pSsoOptions:SsoOptions):Observable<boolean> {
        return this._process(
            this.endpoints['sso']['save'],
            {
                org: pOrg.getUID(),
                ...pSsoOptions
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success;
            })
        );
    }

    createAuthModule(pOrg:OrganizationUnit, pAuthModule:AuthModule, pEdit = false):Observable<boolean> {
        return this._process(
            this.endpoints['authmod']['save'],
            {
                orgUnit: pOrg.getUID(),
                module: pAuthModule.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data.created){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Authentication module create successfully"
                    }));
                    return true;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Authentication module cannot be created",
                        data: "-"
                    }));
                    return false;
                }
            })
        );
    }

    testSsoConfig(pSsoOptions: SsoOptions):Observable<boolean> {
        return this._process(
            this.endpoints['sso']['test'],
            pSsoOptions
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Connection to identity server successful"
                    }));
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Connection failed",
                        data: pEl.data.conn.msg
                    }));
                }
                return pEl.success;
            })
        );
    }

    testAuthModuleConnection(pOrg:OrganizationUnit, pAuthModule:AuthModule):Observable<boolean> {
        return this._process(
            this.endpoints['authmod']['test'],
            {
                orgUnit: pOrg.getUID(),
                module: pAuthModule.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Connection to identity server successful"
                    }));
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Connection failed",
                        data: "-"
                    }));
                }
                return pEl.data.connected;
            })
        );
    }

    refreshAuthModules(pOrgUnit: OrganizationUnit) {
        return this._process(
            this.endpoints['authmod']['list'],
            { org: pOrgUnit.getUID() },
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const authm:AuthModule[] = [];
                    pEl.data.map( (data:any) => {
                        try{
                            authm.push(AuthModuleFactory.from(data));
                        }catch(e){
                            this.outputSvc.alert(OutputMessage.newError({
                                msg: "Authentication module cannot be retrieved",
                                data: (e as any).message
                            }));
                        }
                    })
                    return authm
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Auth modules cannot be retrieved"
                    }));
                    return [];
                }
            })
        );
    }

    createUserGroup(pOrg:OrganizationUnit, pUserGroup:UserGroup):Observable<{ success:boolean, msg:string }> {
        return this._process(
            this.endpoints['usergroup']['create'],
            {
                uid: pOrg.getUID(),
                ...pUserGroup.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data.created){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "User group created successfully"
                    }));
                    return { success:true, msg: (pEl.msg!=null?pEl.msg:"") };
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "User group cannot be created",
                        data: "-"
                    }));
                    return { success:false, msg: (pEl.msg!=null?pEl.msg:"") };
                }
            })
        );
    }

    updateUserGroup(pOrg:OrganizationUnit, pUserGroup:UserGroup):Observable<{ success:boolean, msg:string }> {
        return this._process(
            this.endpoints['usergroup']['update'],
            {
                uid: pOrg.getUID(),
                grp: pUserGroup.getUID(),
                data: pUserGroup.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                return { success:pEl.success, msg: (pEl.msg!=null?pEl.msg:"") };
            })
        );
    }

    dropUserGroup(pOrg:OrganizationUnit, pUserGroup:UserGroup):Observable<boolean> {
        return this._process(
            this.endpoints['usergroup']['drop'],
            {
                uid: pOrg.getUID(),
                grp: pUserGroup.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "User group removed successfully"
                    }));
                    return true;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "User group cannot be removed",
                        data: "-"
                    }));
                    return false;
                }
            })
        );
    }


    listUserGroups(pOrg:OrganizationUnit):Observable<UserGroup[]> {
        return this._process(
            this.endpoints['usergroup']['list'],
            {
                uid: pOrg.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    const data:UserGroup[] = [];
                    pEl.data.map((x:any) => data.push(new UserGroup(x)));
                    return data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "User groups cannot be retrieved"
                    }));
                    return [];
                }
            })
        );
    }

    listMembers(pOrg:OrganizationUnit):Observable<UserAccount[]> {
        return this._process(
            this.endpoints['members']['list'],
            {
                uid: pOrg.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    const accs:UserAccount[] = [];
                    pEl.data.map((x:any) => accs.push(new UserAccount(x)));
                    return accs;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Members cannot be retrieved"
                    }));
                    return [];
                }
            })
        );
    }

    listRoles(pOrgUnit:OrganizationUnit|OrganizationUnitUUID):Observable<Role[]> {
        return this._process(
            this.endpoints['roles']['list'],
            {
                uid: (typeof pOrgUnit==="string" ? pOrgUnit : pOrgUnit.getUID())
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    const roles:Role[] = [];
                    pEl.data.map((x:any) =>{
                        const role = new Role({
                            ...x,
                            permissions: x.permissions.map((perm:any) => {
                                return new Access(perm._t,perm._n,perm._d);
                            })
                        });

                        roles.push(role);
                    });
                    return roles;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Roles cannot be retrieved"
                    }));
                    return [];
                }
            })
        );
    }

    getGroupRoles(pOrgUnit: OrganizationUnit, pGroup: UserGroup) {
        return this._process(
            this.endpoints['usergroup']['roles'],
            {
                uid: pOrgUnit.getUID(),
                grp: pGroup.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    const roles:Role[] = [];
                    pEl.data.map((x:any) =>{
                        const role = new Role({
                            ...x
                        });

                        roles.push(role);
                    });
                    return roles;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Roles cannot be retrieved from group"
                    }));
                    return [];
                }
            })
        );
    }

    getGroupMembers(pOrgUnit: OrganizationUnit, pGroup: UserGroup) {
        return this._process(
            this.endpoints['usergroup']['members'],
            {
                uid: pOrgUnit.getUID(),
                grp: pGroup.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    const data:UserAccount[] = [];
                    pEl.data.map((x:any) =>{

                        data.push(new UserAccount({
                            ...x
                        }));
                    });
                    return data;
                }else{
                    return [];
                }
            })
        );
    }

    inviteUsers(pOrgUnit: OrganizationUnit, pEmails: string[], pGroup: Nullable<UserGroup>):Observable<boolean> {
        console.log("inviteUsers>",pOrgUnit.getUID(),pEmails,pGroup);

        return this._process(
            this.endpoints['members']['invite'],
            {
                uid: pOrgUnit.getUID(),
                emails: pEmails,
                grp: (pGroup!=null ? pGroup.getUID(): null)
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success && pEl.data){
                    return pEl.data.sent;
                }else{
                    return false;
                }
            })
        );
    }

    newAppUnit() {
        if(this.currentOrg!=null){
            this.newApp$.next(this.currentOrg);
        }else{
            this.outputSvc.alert(OutputMessage.newError({
                msg: "Cannot create a new application unit, please select an organization first"
            }));
        }
    }

    listConnection(pOrg: OrganizationUnitUUID):Observable<Connection[]>   {
        return this._process(
            this.endpoints['conn']['list'],{
                oid: pOrg
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const apps:Connection[] = [];
                    if(pEl.data!=null){
                        pEl.data.map( (data:any) => {
                            const conn = new Connection(data);
                            apps.push(conn);
                        });
                    }
                    return apps;
                }else{
                    return [];
                }
            })
        );
    }


    createConnection(pOrg: OrganizationUnit, pConn:Connection):Observable<DxApiResponse<any>>   {
        return this._process(
            this.endpoints['conn']['create'],{
                oid: pOrg.getUID(),
                ... pConn.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                return {
                    success: pEl.success,
                    msg: (!pEl.success ? pEl.msg : null)
                }
            })
        );
    }

    updateConnection(pOrg: OrganizationUnit, pConn:Connection):Observable<DxApiResponse<any>>   {
        return this._process(
            this.endpoints['conn']['edit'],{
                oid: pOrg.getUID(),
                cid: pConn.getUID(),
                ... pConn.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                return {
                    success: pEl.success,
                    msg: (!pEl.success ? pEl.msg : null)
                }
            })
        );
    }

    listOrgSecret(pOrg: OrganizationUnit):Observable<Secret[]> {
        return this._process(
            this.endpoints['secrets']['list'],{
                oid: pOrg.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const apps:Secret[] = [];
                    if(pEl.data!=null){
                        pEl.data.map( (data:any) => {
                            apps.push(new Secret(data));
                        });
                    }
                    return apps;
                }else{
                    return [];
                }
            })
        );
    }

    getOrganization(pUUID: OrganizationUnitUUID):Observable<Nullable<OrganizationUnit>>{
        return this._process(
            this.endpoints['org']['info'],{
                uid: pUUID
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const o = new OrganizationUnit(pEl.data);

                    if(pEl.data.businessPlan!=null)
                        o.businessPlan = BusinessPlan.fromJsonObject(pEl.data.businessPlan);

                    return o;
                }else{
                    return null;
                }
            })
        );
    }

    createOrgSecret(pOrg: OrganizationUnit, pSecret:Secret, pSecValue:string):Observable<Nullable<Secret>>   {
        return this._process(
            this.endpoints['secrets']['create'],{
                oid: pOrg.getUID(),
                ... pSecret.toJsonObject(),
                data: pSecValue
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return new Secret(pEl.data);
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: pEl.data
                    }));
                    return null;
                }
            })
        );
    }

    removeSecret(pOrg: OrganizationUnit, pSecretUUID:SecretUUID):Observable<boolean>   {
        return this._process(
            this.endpoints['secrets']['delete'],{
                oid: pOrg.getUID(),
                sid: pSecretUUID
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: pEl.data
                    }));
                }
            })
        );
    }

    listConnectionProtocols():Observable<ConnectionProtocolType[]> {
        if(this._protos!=null && this._protos.length>0){
            return from([this._protos]);
        }

        return this._process(
            this.endpoints['conn']['proto_list'],{
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return (this._protos = pEl.data as ConnectionProtocolType[]);
                }else{
                    return [];
                }
            })
        );
    }

        /*
        return [
            { name:"HTTP", value:ConnectionProtocol.HTTP, disabled:false, label:"Anonymous HTTP", icon:["fas","webhook"] },
            { name:"HTTP_BASIC", value:ConnectionProtocol.HTTP_BASIC, disabled:false, label:"HTTP Basic authentication", icon:["fas","lock"] },
            { name:"HTTP_REALM", value:ConnectionProtocol.HTTP_REALM, disabled:false, label:"HTTP Bearer authentication", icon:["fas","lock"] },
            { name:"DOCKER", value:ConnectionProtocol.DOCKER, disabled:true, label:"Docker Registry", icon:["fab","docker"] },
            { name:"FTP", value:ConnectionProtocol.FTP, label:"FTP / SFTP / FTPS", disabled:true, icon:["fas","download"] },
            { name:"SSH", value:ConnectionProtocol.SSH, label:"SSH", disabled:false, icon:["fas","train-tunnel"] },
            { name:"PLAYSTORE", value:ConnectionProtocol.PLAYSTORE, disabled:false, label:"Google PlayStore", icon:["fab","google-play"] },
            { name:"APPSTORE", value:ConnectionProtocol.APPSTORE, disabled:true, label:"Apple AppStore", icon:["fab","app-store-ios"] },
        ]*/


    getProtectionProtocolMapping(pOrg:OrganizationUnit, pProto:ConnectionProtocol):Observable<ProtocolMapping> {
        return this._process(
            this.endpoints['conn']['proto'],{
                oid: pOrg.getUID(),
                proto: pProto
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: pEl.data
                    }));
                }
            })
        );
    }

    removeConnection(pOrg: OrganizationUnit, pConnection: Connection):Observable<boolean> {
        return this._process(
            this.endpoints['conn']['delete'],{
                oid: pOrg.getUID(),
                cid: pConnection.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Connection has been deleted successfully"
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Connection cannot be removed : "+pEl.data
                    }));
                }
            })
        );

    }




    removeDeviceFromAppUnit(pDevice:Device, pOrgUnit: OrganizationUnit, pAppUnit: ApplicationUnit):Observable<boolean> {
        return this._process(
            this.endpoints['app']['removeDev'],{
                oid: pOrgUnit.getUID(),
                aid: pAppUnit.getUID(),
                dev: pDevice.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Device has been removed successfully from application unit"
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Device cannot be removed from application unit : "+pEl.data
                    }));
                }
            })
        );
    }

    deleteDeviceFromOrgUnit(pDevice:Device, pOrgUnit: OrganizationUnit):Observable<boolean> {
        return this._process(
            this.endpoints['app']['removeDev'],{
                oid: pOrgUnit.getUID(),
                dev: pDevice.getUID()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Device has been removed successfully from organization unit"
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Device cannot be removed from organization unit : "+pEl.data
                    }));
                }
            })
        );
    }

    attachDevice(pDevice: Device, pOrgUnit: OrganizationUnit,
                 pAppUnit: Nullable<ApplicationUnit> = null) {

        let ep = this.endpoints['org']['attach'];
         if(pAppUnit!=null){
            ep = this.endpoints['app']['attach'];
        }

        return this._process(
            ep,{
                dev: pDevice.getUID(),
                oid: pOrgUnit.getUID(),
                aid: pAppUnit!=null ? pAppUnit.getUID() : null
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Device has been attached successfully"
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Device cannot be attached : "+pEl.data
                    }));
                }
            })
        );
    }

    detachDevice(pDevice: Device, pOrgUnit: OrganizationUnit,
                 pAppUnit: Nullable<ApplicationUnit> = null) {

        let ep = this.endpoints['org']['detach'];
        if(pAppUnit!=null){
            ep = this.endpoints['app']['detach'];
        }

        return this._process(
            ep,{
                dev: pDevice.getUID(),
                oid: pOrgUnit.getUID(),
                aid: pAppUnit!=null ? pAppUnit.getUID() : null
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Device has been detached successfully"
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Device cannot be detached : "+pEl.data
                    }));
                }
            })
        );
    }

    /**
     * To assign one or more device to an application unit
     *
     *
     * @param {DeviceUUID[]} pDevices
     * @param {ApplicationUnit} pAppUnit
     */
    assignDevices(pDevices: DeviceUUID[], pAppUnit: ApplicationUnit, pRollback = false):Observable<boolean> {

        return this._process(
            this.endpoints['app'][(pRollback?'detach':'attach')],{
                aid: pAppUnit.getUID(),
                dev: pDevices
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    this.outputSvc.alert(OutputMessage.newSuccess({
                        msg: "Devices have been "+(pRollback?'deassigned':'assigned')+" successfully to application : "+pAppUnit.name
                    }));
                    return pEl.data;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: "Devices cannot be "+(pRollback?'deassigned from':'assigned to')+" to application : "+pEl.data
                    }));
                    return false;
                }
            })
        );
    }

    getPurchaseByApp( pAppUnit:ApplicationUnit ):Observable<
                                                    DxApiResponse<{
                                                        purchases:Purchase[],
                                                        products:Record<ReversenseProductUUID,ReversenseProduct> }
                                                    >
                                                > {
        return this._process(
            this.endpoints['app']['licenseStatus'],{
                aid: pAppUnit.getUID()
            }
        ).pipe(
            map((pEl:any)=>{

                const res:{ purchases:Purchase[], products:Record<ReversenseProductUUID,ReversenseProduct> } = { purchases:[], products:{} };

                if(pEl.success){
                    pEl.data.products.map((x:any) => {
                        res.products[x.code] = new ReversenseProduct(x);
                    });
                    pEl.data.purchases.map((x:any) => {
                        res.purchases.push(new Purchase(x));
                    });
                }

                return {
                    success: pEl.success,
                    msg: (!pEl.success ? pEl.msg : null),
                    data: res
                };
            })
        );
    }

    activateLicense( pProduct:ReversenseProductUUID, pPlan:BusinessPlanType,
                     pAppUnit:ApplicationUnit ):Observable<DxApiResponse<boolean>> {
        return this._processApiRequest<boolean>(
            this.endpoints['app']['licenseActivate'],{
                aid: pAppUnit.getUID(),
                pid: pProduct,
                plan: pPlan
            }
        );
    }

    /**
     * To save the selected organization to local storage
     *
     * @param pOrg
     * @private
     */
    private _saveCurrentOrg(pOrg: OrganizationUnit) {
        this.currentOrg = pOrg;
        localStorage.setItem('org.current', pOrg.getUID());
    }

    /**
     * To get an application by its uid
     *
     * @param pApp
     */
    getApplication(pApp: ApplicationUnitUUID):Observable<Nullable<ApplicationUnit>> {
        return this._process(
            this.endpoints['app']['find'],{
                aid: pApp
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return new ApplicationUnit(pEl.data);
                }else{
                    return null;
                }
            })
        );

    }

    updateUser(pUUID: OrganizationUnitUUID, pUser: UserAccount, pCreate = false):Observable<{success: boolean, msg?:string}> {
        return this._process(
            this.endpoints['members'][(pCreate?'create':'update')],{
                oid: pUUID,
                ...pUser.toJsonObject()
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return {success: true}; //new UserAccount(pEl.data);
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: `User cannot be ${(pCreate?'created':'updated')} !`
                    }));
                    return {success: false, msg:pEl.msg};
                }
            })
        );
    }

    dropUser(pOUID: OrganizationUnitUUID, pUUID: UserAccountUUID):Observable<boolean> {
        return this._process(
            this.endpoints['members']['drop'],{
                oid: pOUID,
                uid: pUUID
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return true;
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: `User cannot be deleted. See error of please contact support team`
                    }));
                    return false;
                }
            })
        );
    }

    sendUnlock(pUUID: OrganizationUnitUUID, pUser: UserAccountUUID):Observable<boolean> {
        return this._process(
            this.endpoints['members']['unlockMail'],{
                oid: pUUID,
                uid: pUser
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    return true; //new UserAccount(pEl.data);
                }else{
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: `Cannot sent unlock mail. Please contact support team.`
                    }));
                    return false;
                }
            })
        );
    }


    sendActivation(pUUID: OrganizationUnitUUID, pUser: UserAccountUUID):Observable<boolean> {
        return this._process(
            this.endpoints['members']['activationMail'],{
                oid: pUUID,
                uid: pUser
            }
        ).pipe(
            map((pEl:any)=>{
                if(!pEl.success){
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: `Cannot sent activation mail. Please contact support team.`
                    }));
                    return false;
                }

                return true;
            })
        );
    }

    setAccState(pUUID: OrganizationUnitUUID, pUser: UserAccountUUID, pState:'lock'|'unlock'|'activate'):Observable<boolean> {

        return this._process(
            this.endpoints['members'][pState],{
                oid: pUUID,
                uid: pUser
            }
        ).pipe(
            map((pEl:any)=>{
                if(!pEl.success){
                    this.outputSvc.alert(OutputMessage.newError({
                        msg: `Cannot change user account : ${pState}. Please contact support team.`
                    }));
                }
                return  pEl.success;
            })
        );
    }


    assignRoles(pOUID: OrganizationUnitUUID, pUUID: UserAccountUUID, pRoles: Role[], pGlobal = false):Observable<boolean> {
        return this._process(
            this.endpoints['members']['assign'],{
                oid: pOUID,
                uid: pUUID,
                roles: pRoles,
                global: pGlobal
            }
        ).pipe(
            map((pEl:any)=>{
                return  pEl.success;
            })
        );
    }

    changeUserPasswd(pOUID: OrganizationUnitUUID, pUUID: UserAccountUUID,
                     pCurrPwd: string, pNewPwd: string,
                     pSelf = true):Observable<{  success:boolean, msg:string }> {
        return this._process(
            this.endpoints['members']['chpwd'],{
                oid: pOUID,
                uid: pUUID,
                current: pCurrPwd,
                newpwd: pNewPwd,
                self: (pSelf? 1: 0)
            }
        ).pipe(
            map((pEl:any)=>{
                return  {success: pEl.success, msg: (pEl.success==false? pEl.msg : "")};
            })
        );
    }

    updateSettings(pOrgUnit: OrganizationUnit):Observable<{  success:boolean, msg:string }> {
        return this._process(
            this.endpoints['org']['settings'],{
                oid: pOrgUnit.getUID(),
                settings: pOrgUnit.settings
            }
        ).pipe(
            map((pEl:any)=>{
                return  {success: pEl.success, msg: (pEl.success==false? pEl.msg : "")};
            })
        );
    }

    updateAppMembersGrp(pOrgUnit: OrganizationUnitUUID,
                        pApp:ApplicationUnitUUID,
                        pGroups: UserGroup[]):Observable<{  success:boolean, msg:string }> {
        return this._process(
            this.endpoints['app']['updateAppGrps'],{
                oid: pOrgUnit,
                aid: pApp,
                groups: pGroups.map(x => x.getUID())
            }
        ).pipe(
            map((pEl:any)=>{
                return  {success: pEl.success, msg: (pEl.success==false? pEl.msg : "")};
            })
        );
    }

    updateAppAttr(  pApp:ApplicationUnitUUID,
                    pAttr:string,
                    pValues: (UserAccountUUID|UserGroupUUID)[]):Observable<{  success:boolean, msg:string }> {
        return this._process(
            this.endpoints['app']['updateAttr'],{
                attr: pAttr,
                aid: pApp,
                values: pValues
            }
        ).pipe(
            map((pEl:any)=>{
                return  {success: pEl.success, msg: (pEl.success==false? pEl.msg : "")};
            })
        );
    }

    updateGroupMembers(pOrg:OrganizationUnitUUID,
                       pGrp:UserGroupUUID,
                       pMembers:UserAccountUUID[]):Observable<DxApiResponse<any>> {
        return this._process(
            this.endpoints['usergroup']['mbs_update'],
            {
                uid: pOrg,
                grp: pGrp,
                users: pMembers
            }
        ).pipe(
            map((pEl:any)=>{
                return { success:pEl.success, msg: (pEl.msg!=null?pEl.msg:"") };
            })
        );
    }

    getAppAttr(  pApp:ApplicationUnitUUID,
                    pAttr:string):Observable<(UserAccountUUID|UserGroupUUID)[]> {

        return this._process(
            this.endpoints['app']['readAttr'],{
                attr: pAttr,
                aid: pApp
            }
        ).pipe(
            map((pEl:any)=>{
                return pEl.success? pEl.data._v : [];
            })
        );
    }

    getRunners(pOrg: OrganizationUnitUUID):Observable<EngineNode[]> {
        return this._process(
            this.endpoints['runner']['list'],{
                uid: pOrg
            }
        ).pipe(
            map((pEl:any)=>{
                let ret:EngineNode[] = [];
                if(pEl.success){
                    ret = pEl.data.map((x:any) => new EngineNode(x)) ;
                }
                return ret;
            })
        );
    }

    stopNode(pOrg: OrganizationUnitUUID, pNode:EngineNodeUUID):Observable<{ success:boolean, msg:string }> {
        return this._process(
            this.endpoints['runner']['stop'],{
                uid: pOrg,
                node: pNode
            }
        ).pipe(
            map((pEl:any)=>{
                return { success:pEl.success, msg: (pEl.msg!=null?pEl.msg:"") };
            })
        );
    }

    mkpGetProducts(pOrg: OrganizationUnitUUID, pOwned = false):Observable<DxApiResponse<ReversenseProduct[]>> {
        return this._process(
            this.endpoints['mkp'][(pOwned?'owned':'list')],{
                oid: pOrg
            }
        ).pipe(
            map((pEl:any)=>{
                if(pEl.success){
                    const prods:ReversenseProduct[] = [];
                    pEl.data.map((x:any) => {
                        x.owned = pOwned;
                        prods.push(new ReversenseProduct(x));
                    });
                    return { success:true, data: prods };
                }else{
                    return { success:false, msg: (pEl.msg!=null?pEl.msg:"") };
                }
            })
        );
    }

    mkpBuy(pOrg: OrganizationUnitUUID, pProductID:string, pPlan:BusinessPlanType, pQtt:number):Observable<DxApiResponse<void>> {
        return this._process(
            this.endpoints['mkp']['buy'],{
                oid: pOrg,
                pid: pProductID,
                plan: pPlan,
                qtity:pQtt
            }
        ).pipe(
            map((pEl:any)=>{
                return { success:pEl.success, msg: (pEl.msg!=null?pEl.msg:"") };
            })
        );
    }

    revokeLicense(pPurchase: any) {

    }

    getUploadPreview(pOrg:OrganizationUnitUUID, pOs:OperatingSystem, pUploadUID: UploadUID):Observable<DxApiResponse<AppPreview>> {
        return this._processApiRequest<AppPreview>(
            this.endpoints['app']['preview_upl'],{
                oid: pOrg,
                uplid: pUploadUID,
                os: pOs
            },(vData)=>{
                const o = vData.info;
                const ic:any = Object.values(o.icons)[0];
                if(ic!=null){
                    o.icons = `data:image/${["png","jpg","webp"][ic.format]};base64,${ic.data}`;
                }else{
                    o.icons = null;
                }
                return o;
            }
        );
    }
}

