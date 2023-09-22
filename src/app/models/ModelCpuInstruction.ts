import { CONST } from "./CoreConst";
import ModelBasicBlock from "./ModelBasicBlock";
import ModelMethod from "./ModelMethod";
import {Savable, STUB_TYPE} from "./ModelSavable";
import {ModelRegisterReference} from "./ModelReference";
import {NodeType} from "./NodeType";
import {ModelFunction} from "./ModelFunction";
import {NodeInternalType} from "./NodeInternalType";


export enum ModelInstructionType {
    CJMP    ='cjmp',
    JMP     ='jmp',
    LOAD    ='load',
    ADD     ='add',
    STORE   ='store',
    MOV     ='mov',
    CALL    ='call',
    SHL     ='shl',
    SHR     ='shr',
    PUSH    ='pish',
    NULL    ='null',
    CMP     ='cmp',
    UCALL   ='ucall'
}


/**
 * Represents an instruction from the Application bytecode
 * @param {Object} config Optional, an object wich can be used in order to initialize the instance
 * @constructor
 */
export default class ModelCpuInstruction
{

    __:NodeInternalType = NodeInternalType.INSTR_CPU;
    _t:NodeType = NodeType.INSTR_CPU;
    offset:number
    ptr:number = null;
    refptr:boolean = false;
    func:ModelFunction = null;
    fcn_addr?:number;
    fcn_last?:number;
    sz:number;
    bytes:string;
    type:string;
    opcode:string;
    disasm:string;
    reloc:boolean = false;

    jump?:number;
    fail?:number;

    flags?:any[];

    constructor(pConfig:any=null) {

        if(pConfig!==undefined)
            for(let i in pConfig)
                this[i]=pConfig[i];
    }


    toJsonObject():any{
        let o:any = {};
        for(let i in this){
            if((typeof this[i]=='object') && (this[i].hasOwnProperty('toJsonObject'))){
                o[i] = (this[i] as any).toJsonObject();
            }else{
                o[i] = this[i];
            }
        }
        return o;
    };
}
