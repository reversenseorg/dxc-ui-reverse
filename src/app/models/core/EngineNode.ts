
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

import {Subject} from "rxjs";
import {ScanOrder} from "../audit/common/ScanOrder.js";
import {UserAccount, UserAccountUUID} from "../user/UserAccount.js";
import {ProjectOrder, ProjectOrderUUID} from "../project/ProjectOrder.js";
import {DexcaliburProjectUUID} from "../DexcaliburProject.js";
import {Nullable} from "../common";
import {INode} from "../INode";
import {NodeInternalType} from "../NodeInternalType";
import {OrganizationUnitUUID} from "../orgs/OrganizationUnit";



export enum NodeState {
    UNKNOW="unknow",
    // nothing to do, ready
    IDLE="idle",
    // busy
    BUSY="busy",
    // stopped (crash or manual stop)
    STOPPED="stopped",
    // created but not started
    NEW="new",
    // created but not started
    QUEUED="queued",
    // starting but webhook never called
    STARTING="starting",
    // when the node is registered (and started) but not assigned to a project
    REGISTERED="registered"
}

export type ScanOrderUUID = string;

export enum NodePurpose {
    REVIEW='review',
    SCAN='scan',
    HOOK='hook',
    NEW_PRJ='newprj',
    ANY='any'
}

export enum ScanState {
    RUNNING = "running",
    WAITING = "waiting",
    IDLE = "idle",
    TERMINATED = "terminated",
    GENERATE_REPORT = "genreport",
    ABORTED = "aborted",
    CRASHED = "crashed",
    /**
     * That means Scan has been never started
     */
    NONE = "none"
}



export enum OperationType {
    NONE,
    USER_WEB_REQUEST,
    APP_WEB_REQUEST,
    SCAN_ORDER,
    NEW_PROJ,
    OPEN_PROJ
}

export interface Operation {
    type: OperationType,
    /**
     * User Account or App Account UUID
     */
    owner: string,
    /**
     * Time stamp
     */
    time: number,
    data: any;

    extra?:any;
}

export type EngineNodeUUID = string;

export type GenericOrderTicket = {
    owner: Nullable<UserAccountUUID>;
    created?: number;
    started?: number;
    terminated?:number;
}

export interface OrderTicket<T,O> extends GenericOrderTicket {
    type: T,
    order: O
}



export type Order = OrderTicket<OperationType.SCAN_ORDER, ScanOrderUUID>
    | OrderTicket<OperationType.NEW_PROJ|OperationType.OPEN_PROJ, ProjectOrderUUID>
    | OrderTicket<OperationType.USER_WEB_REQUEST|OperationType.APP_WEB_REQUEST, any>;


export type Order2 = {
    type:OperationType.SCAN_ORDER;
    order: ScanOrderUUID;
    owner: Nullable<UserAccountUUID>;
    created?: number;
    started?: number;
    terminated?:number;
} | {
    type:OperationType.NEW_PROJ|OperationType.OPEN_PROJ;
    order: ProjectOrderUUID;
    owner: Nullable<UserAccountUUID>;
    created?: number;
    started?: number;
    terminated?:number;
} | {
    type:OperationType.USER_WEB_REQUEST|OperationType.APP_WEB_REQUEST,
    owner: Nullable<UserAccountUUID>;
    created?: number;
    started?: number;
    terminated?:number;
};



/**
 * Represent a running instance of DexcaliburEngine.
 *
 * It is mainly used to hold metadata about remote instances
 * when engine mode is turned to MASTER/SLAVE, and treatments are distributed
 * over several instances.
 *
 *
 * @class
 */
export class EngineNode  {


    __ = NodeInternalType.ENGINE_NODE;

    /**
     * The UUID of the Engine instance.
     *
     * It is unique for master and all slave
     *
     * @readonly
     * @field
     */
    readonly UUID:EngineNodeUUID;


    /**
     * Linked project
     * @private
     */
     _projectUID:DexcaliburProjectUUID;

    /**
     * Aorganization unit
     * @private
     * @since 1.8.16
     */
    _orgUUID:Nullable<OrganizationUnitUUID> = null;

    /**
     * Buffer where STDOUT is written
     * @private
     */
     _outputBuffer:any[] = [];

    /**
     * Buffer where STDERR is written
     * @private
     */
     _errBuffer:any[] = [];


    /**
     * PID of the process associated to this node
     * @private
     */
     _pid:number = -1;


    purpose:NodePurpose = NodePurpose.ANY;

    state:NodeState = NodeState.UNKNOW;

    masterURI:Nullable<string> = null;

    httpPort:number = -1;

    httpsPort:number = -1;

    wsPort:number = -1;

    wssPort:number = -1;

    running:boolean = false;

    // errPipe:Nullable<string>;
    // outPipe:Nullable<string>;
    activeScanSession:Nullable<ScanOrder> = null;

    history:ScanOrder[] = [];

    waitingQueue: Order[] = [];

    /**
     * @deprecated
     */
    opeQueue: Operation[] = [];

    opeTerminated: Order[] = []; // Operation[]

    operation$: Subject<Nullable<Order>> = new Subject<Nullable<Order>>();

    parentUUID:EngineNodeUUID;

    activeOpe:Nullable<Order> = null;

    nodeOpts:Record<string, any> = {};

    tags:number[] = [];

    startedAt = -1;
    stoppedAt = -1;
    createdAt = -1;
    /**
     * Flag.
     * TRUE if the node is allowed to start on self registration of a slave
     * @field
     */
    selfReg = false;

    /**
     * Local
     * @private
     */
     _suspendQueue = false;


    /**
     *
     * @param {EngineNodeOptions} pOptions
     * @constructor
     */
    constructor(pOptions:any) {

        if(pOptions.UUID != null) this.UUID = pOptions.UUID;
        if(pOptions._projectUID != null) this._projectUID = pOptions._projectUID;
        if(pOptions._orgUUID != null) this._orgUUID = pOptions._orgUUID;
        if(pOptions._outputBuffer != null) this._outputBuffer = pOptions._outputBuffer;
        if(pOptions._errBuffer != null) this._errBuffer = pOptions._errBuffer;
        if(pOptions.pid != null) this._pid = pOptions.pid;
        if(pOptions.purpose != null) this.purpose = pOptions.purpose;
        if(pOptions.state != null) this.state = pOptions.state;
        if(pOptions.masterURI != null) this.masterURI = pOptions.masterURI;
        if(pOptions.httpPort != null) this.httpPort = pOptions.httpPort;
        if(pOptions.httpsPort != null) this.httpsPort = pOptions.httpsPort;
        if(pOptions.running != null) this.running = pOptions.running;
        if(pOptions.activeScanSession != null) this.activeScanSession = pOptions.activeScanSession;
        if(pOptions.history != null) this.history = pOptions.history;
        if(pOptions.waitingQueue != null) this.waitingQueue = pOptions.waitingQueue;
        if(pOptions.opeTerminated != null) this.opeTerminated = pOptions.opeTerminated;
        if(pOptions.operation$ != null) this.operation$ = pOptions.operation$;
        if(pOptions.parentUUID != null) this.parentUUID = pOptions.parentUUID;
        if(pOptions.nodeOpts != null) this.nodeOpts = pOptions.nodeOpts;
        if(pOptions.startedAt != null) this.startedAt = pOptions.startedAt;
        if(pOptions.stoppedAt != null) this.stoppedAt = pOptions.stoppedAt;
        if(pOptions.selfReg != null) this.selfReg = pOptions.selfReg;
        if(pOptions.createdAt != null) this.createdAt = pOptions.createdAt;
    }
}