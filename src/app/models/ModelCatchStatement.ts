import ModelClass from "./ModelClass";
import ModelBasicBlock from "./ModelBasicBlock";
import {NodeInternalType} from "./NodeInternalType";
import {Nullable} from "../base/Nullable";
import {RenderedModelNode} from "../base/RenderedModelNode";

interface ITryCatchBoundary
{
    0: Nullable<ModelClass>,
    1: Nullable<string|ModelBasicBlock>,
    2: Nullable<string|ModelBasicBlock>,
    3: Nullable<string|ModelBasicBlock>
};


export default class ModelCatchStatement  extends RenderedModelNode
{
    __:NodeInternalType = NodeInternalType.CATCH_STMT;
    d:ITryCatchBoundary = { 0:null, 1:null, 2:null, 3:null };

    constructor(){
        super();
        this.d = {} as ITryCatchBoundary;
    }

    setException(pClass:ModelClass){
        this.d[0] = pClass;
    }

    getException():Nullable<ModelClass>{
        return this.d[0];
    }

    setTryStart(pLabel:string|ModelBasicBlock){
        this.d[1] = pLabel;
    }

    getTryStart():Nullable<string|ModelBasicBlock>{
        return this.d[1];
    }

    setTryEnd(pLabel:string|ModelBasicBlock){
        this.d[2] = pLabel;
    }

    getTryEnd():Nullable<string|ModelBasicBlock>{
        return this.d[2];
    }

    setTarget(pLabel:string|ModelBasicBlock){
        this.d[3] = pLabel;
    }

    getTarget():Nullable<string|ModelBasicBlock>{
        return this.d[3];
    }
}
