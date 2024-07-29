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