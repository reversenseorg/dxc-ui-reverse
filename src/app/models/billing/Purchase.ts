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

import {INodeRef, NodeInternalType} from "../NodeInternalType";
import {OrganizationUnitUUID} from "../orgs/OrganizationUnit";
import { ReversenseProductUUID} from "./ReversenseProduct";
import {BusinessPlanType} from "./BusinessPlan";
import {UserAccountUUID} from "../user/UserAccount";

export enum ProductType {
    SCAN=NodeInternalType.PROJECT,
    APP=NodeInternalType.APP_UNIT
}


export interface PurchaseOptions {
    date:number;
    plan: BusinessPlanType;
    org:OrganizationUnitUUID;
    issuer:UserAccountUUID;
    subject: INodeRef;
    transaction?: any;
    product:ReversenseProductUUID;
}


export class Purchase {

    date:number;

    org:OrganizationUnitUUID;

    plan: BusinessPlanType;

    issuer: UserAccountUUID;

    subject: INodeRef; //DexcaliburProjectUUID|ApplicationUnitUUID;

    product:ReversenseProductUUID;

    transaction:any = null;

    constructor(pOptions:PurchaseOptions) {
        this.date = pOptions.date;
        this.plan = pOptions.plan;
        this.org = pOptions.org;
        this.subject = pOptions.subject;
        this.product = pOptions.product;

        if(pOptions.transaction!=null) this.transaction = pOptions.transaction;
    }



    static newSubscription(pUser:UserAccountUUID, pOrganization:OrganizationUnitUUID, pProduct:ReversenseProductUUID, pSubject:INodeRef):Purchase {
        return new Purchase({
            date: (new Date()).getTime(),
            plan: BusinessPlanType.SUBSCRIPTION,
            issuer: pUser,
            org: pOrganization,
            product: pProduct,
            subject: pSubject
        })
    }


    static newScan(pUser:UserAccountUUID, pOrganization:OrganizationUnitUUID, pProduct:ReversenseProductUUID, pSubject:INodeRef):Purchase {
        return new Purchase({
            date: (new Date()).getTime(),
            plan: BusinessPlanType.SCAN,
            issuer: pUser,
            org: pOrganization,
            product: pProduct,
            subject: pSubject
        })
    }


    toJsonObject():any{
        const o = {
            date: this.date,
            plan: this.plan,
            org: this.org,
            subject: this.subject,
            issuer: this.issuer,
            transaction: this.transaction,
            product: this.product
        };

        return o;
    }

    isExpired() {
        return  ((new Date()).getTime()-this.date)>(365*24*3600*1000);
    }
}