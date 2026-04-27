import {NodeInternalType} from "./NodeInternalType";
import {RenderedModelNode} from "../base/RenderedModelNode";

/**
 * Represents a section into a file
 *
 * @class
 * @since 1.0.0
 */
export default class ModelFileSection  extends RenderedModelNode
{


    __:NodeInternalType = NodeInternalType.FILE_SECTION;
    o:number = -1;
    t:string = "";

    constructor(pOffset:number, pType:string) {
        super();
        this.o = pOffset;
        this.t = pType;
    }

    getOffset():number {
        return  this.o;
    }

    getType():string {
        return this.t;
    }
}
