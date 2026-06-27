

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

export enum MetadataTopic {
    DFLOW_STEP="step",
    IMPACT="impact",
    CRITICITY="criticity",
    GROUP='grp',
    CATEGORY='category',
    ADVISORY='recommandation',
    RECO="recommandation",
    COUNTRY='country',
    PURPOSE='sbom.purpose',
    WEBSITE='www',
    COMPANY='company',
    REVISION='rev',
    EXTRACT='ext',
    CTRL='ctrl',
    PREFERED_ABI='pabi'
}

export enum PiiCriticity {
    LOW,
    MEDIUM,
    SENSITIVE
}

export enum PiiGroup {
    ID='identity',
    CONTACT='contact',
    BANKING='banking',
    INSURANCE='insurance',
    MARKETING='mktg',
    ACTIVITY='acti',
    DEVICE='dev',
    LEGAL='legal',
    BIO='bio'
}


export enum MetadataType {
    TEXT,
    ANY,
    URI,
    PARAM
}


export enum DataOperation {
    SOURCING,
    PROCESSING,
    STORING,
    SHARING,
    ENCRYPTING,
    DECRYPTING,
    HASHING
}

export interface Metadata {
    key:string|MetadataTopic;
    type:MetadataType;
    value:any|DataOperation;
}