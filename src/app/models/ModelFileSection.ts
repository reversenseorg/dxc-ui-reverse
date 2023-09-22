import {NodeInternalType} from "./NodeInternalType";

/**
 * Represents a section into a file
 *
 * @class
 * @since 1.0.0
 */
export default class ModelFileSection {


    __:NodeInternalType = NodeInternalType.FILE_SECTION;
    o:number = -1;
    t:string = "";

    constructor(pOffset:number, pType:string) {
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
