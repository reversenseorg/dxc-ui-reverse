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

export enum PrivilegedExecutionType {
    BINARY='b',
    COMMAND='c',
    WRAPPER_MODE='w',
    INTENT='i',
    HOST_COMMAND='h',
    BRIDGE_COMMAND="bc"
}

export class PrivilegedExecutionPhase {

    name:string;
    type:PrivilegedExecutionType = PrivilegedExecutionType.BINARY;

    bridgeCmd = '';
    devBin = '';
    devBinArgs:string[] = [];
    /**
     * Host-side binary to execute
     * @field
     */
    hostBin = '';
    /**
     * Arguments for host-side binary
     * @field
     */
    hostBinArgs:string[] = [];

    priv:boolean;

    constructor(pConfig:any) {
        for(const i in pConfig){
            (this as any)[i] = pConfig[i];
        }
    }

    setPrivileged(pBool:boolean):void {
        this.priv =  pBool;
    }

    isPrivileged():boolean {
        return this.priv;
    }

    isHostSide():boolean {
        return (this.type===PrivilegedExecutionType.HOST_COMMAND);
    }

    setBridgeCommand( pCommand:string):void {
        this.bridgeCmd = pCommand;
    }

    setBinary( pBinary:string, pArgs:string[] = []):void {
        this.devBin = pBinary;
        this.devBinArgs = pArgs;
    }

    setHostBinary( pBinary:string, pArgs:string[] = []):void {
        this.hostBin = pBinary;
        this.hostBinArgs = pArgs;
    }


    addBinaryArg( pArg:string):void {
        this.devBinArgs.push( pArg);
    }

    isCommand():boolean {
        return (this.type===PrivilegedExecutionType.COMMAND || this.type===PrivilegedExecutionType.HOST_COMMAND);
    }

    wrapCommandString( pCommand = ""):string {
        return `${this.bridgeCmd} ${this.devBin} ${this.devBinArgs.join(' ')} ${pCommand}`;
    }

    wrapCommandArr( pCommandParts:string[] = []):string[] {
        let cmd:string[]=[];

        if(this.bridgeCmd!=null && this.bridgeCmd!='')
            cmd.push(this.bridgeCmd);
        if(this.devBin!=null && this.devBin!='')
            cmd.push(this.devBin);
        if(this.devBinArgs!=null && this.devBinArgs.length>0)
            cmd = cmd.concat(this.devBinArgs);

        return cmd.concat(pCommandParts);
    }


    toJsonObject():any{
        let o:any  = {};
        o.name = this.name;
        o.type = this.type;
        o.bridgeCmd = this.bridgeCmd;
        o.devBin = this.devBin;
        o.devBinArgs = this.devBinArgs;
        o.priv = this.priv;
        return o;
    }
}