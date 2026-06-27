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

import {IStringIndex} from "../../base/IStringIndex";


export enum AddressSize {
    BITS_128=128,   // floating register
    BITS_64=64,
    BITS_32=32,
    BITS_16=16,
    BITS_8=8
}

export enum AbiType {
    arm_v5='armv5',
    armeabi='armeabi',
    armeabi_v7a='armeabi-v7a',
    arm64_v8a='arm64-v8a',
    x86='x86',
    x86_64='x86_64',
    mips='mips',
    mips64='mips64',
}

export enum InstructionSet {
    ARMEABI='armeabi',
    THUMB2='Thumb-2',
    VFPV3='VFPv3-D16',
    AARCH64='AArch64',
    x86='x86',
    x86_64='x86_64',
    MIPS='mips',
    MIPS_64='mips64',
}


export class ABI {
    name:string ;

    altNames:string[];
    /**
     * Max address size supported
     */
    asize: AddressSize;
    instrSet:InstructionSet[] = [];
    weight = 0;

    constructor( pConfig:any) {
        for(const i in pConfig){
            (this as IStringIndex<any>)[i] = pConfig[i];
        }
    }


}


export class AbiManager {
    static ABI:any = {
        [AbiType.arm_v5]: new ABI({
            name:AbiType.arm_v5,
            asize: AddressSize.BITS_32,
            instrSet:[
                InstructionSet.ARMEABI] }),
        [AbiType.arm64_v8a]: new ABI({
            name:AbiType.arm64_v8a,
            asize: AddressSize.BITS_64,
            instrSet:[
                InstructionSet.AARCH64] }),
        [AbiType.armeabi_v7a]: new ABI({
            name:AbiType.armeabi_v7a,
            asize: AddressSize.BITS_32,
            weight:1,
            instrSet:[
                InstructionSet.ARMEABI,
                InstructionSet.THUMB2,
                InstructionSet.VFPV3]  }),
        [AbiType.armeabi]: new ABI({
            name:AbiType.armeabi,
            asize: AddressSize.BITS_32,
            weight:0 }),
        [AbiType.x86_64]: new ABI({
            name:AbiType.x86_64,
            asize: AddressSize.BITS_64,
            instrSet:[
                InstructionSet.x86_64] }),
        [AbiType.x86]: new ABI({
            name:AbiType.x86,
            asize: AddressSize.BITS_32,
            instrSet:[
                InstructionSet.x86] }),
        [AbiType.mips]: new ABI({
            name:AbiType.mips,
            asize: AddressSize.BITS_32,
            instrSet:[
                InstructionSet.MIPS] }),
        [AbiType.mips64]: new ABI({
            name:AbiType.mips64,
            asize: AddressSize.BITS_64,
            instrSet:[
                InstructionSet.MIPS_64] })
    }

    /**
     * To get a list of ABI instance from a single ABI name or a list of ABI name
     *
     * @param pAbi
     * @return
     */
    static from( pAbi:string | string[]): ABI[] {
        const abis = (!Array.isArray(pAbi)? [pAbi] : pAbi);
        const out:ABI[] = [];
        abis.map( (pAbiName:string)=>{
            if(AbiManager.ABI[pAbiName] != null){
                out.push( AbiManager.ABI[pAbiName] );
            }else {
                throw new Error("The ABI '"+pAbi+"' is not supported. Please, fill an issue.");
            }
        });
        return out;
    }
}
