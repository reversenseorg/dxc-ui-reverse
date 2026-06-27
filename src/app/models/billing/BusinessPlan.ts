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

import { OrganizationUnitUUID} from "../orgs/OrganizationUnit";
import { Purchase} from "./Purchase";
import {ReversenseProductUUID} from "./ReversenseProduct";
import {ApplicationUnitUUID} from "../ApplicationUnit";


export enum BusinessPlanType {
    SUBSCRIPTION= 'sub',
    SCAN='scan'
}


export interface BusinessPlanOptions {
    plan: BusinessPlanType,
    org: OrganizationUnitUUID,
    counter?: number,
    wallet?: Purchase[],
    signature?: any,
    thresholds?: ResourceThresholds,
    freeScanQty?: number,
    freeSubscriptionQty?: number
    credits?:Record<ReversenseProductUUID, Record<BusinessPlanType, number>>;
    mkpPurchases?: MarketplacePurchase[];
}
export interface ResourceThresholds {
    concurrentNodes: number
}


export interface MarketplacePurchase {
    date: number;
    product: ReversenseProductUUID;
    qtity: number;
    type: BusinessPlanType;
}
/**
 *
 */
export class BusinessPlan {

    plan:BusinessPlanType;

    org:OrganizationUnitUUID;

    /**
     * Number of product :
     * The product type depends on BusinessPlanType
     * - AppUnit counter for BusinessPlanType.SUBSCRIPTION
     * - DexcaliburProject for BusinessPlanType.
     */
    counter:number = 0;

    /**
     * Internal purchases
     */
    wallet:Purchase[] = [];

    credits:Record<ReversenseProductUUID, Record<BusinessPlanType, number>> = {};

    /**
     * Marketplace purchases
     */
    mkpPurchases:MarketplacePurchase[] = [];

    freeSubscriptionQty = 10;

    freeScanQty = 5;

    signature:any;

    thresholds:ResourceThresholds = {
        concurrentNodes: 3
    };


    /**
     *
     * @param pOptions
     */
    constructor(pOptions:BusinessPlanOptions) {
        this.org = pOptions.org;
        this.plan = pOptions.plan;

        if(pOptions.counter !=null) this.counter = pOptions.counter;
        if(pOptions.wallet !=null) this.wallet = pOptions.wallet;
        if(pOptions.signature !=null) this.signature = pOptions.signature;
        if(pOptions.thresholds !=null) this.thresholds = pOptions.thresholds;
        if(pOptions.freeScanQty !=null) this.freeScanQty = pOptions.freeScanQty;
        if(pOptions.freeSubscriptionQty !=null) this.freeSubscriptionQty = pOptions.freeSubscriptionQty;
        if(pOptions.credits !=null) this.credits = pOptions.credits;
        if(pOptions.mkpPurchases !=null) this.mkpPurchases = pOptions.mkpPurchases;
    }

    /**
     *
     */
    toJsonObject():any {
        const o =  {
            plan: this.plan,
            org: this.org,
            counter: this.counter,
            wallet: [] as any[],
            signature: this.signature,
            thresholds: this.thresholds,
            freeScanQty: this.freeScanQty,
            freeSubscriptionQty: this.freeSubscriptionQty
        };

        this.wallet.map(x => {
            o.wallet.push(x.toJsonObject());
        })

        return o;
    }



    static fromJsonObject(pObj:any):BusinessPlan {
        const bp = new BusinessPlan(pObj);

        bp.wallet = [];

        if(Array.isArray(pObj.wallet)){
            pObj.wallet.map((x:any) => {
                bp.wallet.push(new Purchase(x));
            })
        }

        return bp;
    }

    getActivatedProductByApp(pAppUnit: ApplicationUnitUUID) {
        //this.cre
    }
}