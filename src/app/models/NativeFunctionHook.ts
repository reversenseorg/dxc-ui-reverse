import {ModelFunction} from "./ModelFunction";
import {AbstractHook} from "./AbstractHook";
import {NodeInternalType} from "./NodeInternalType";

export enum HookTargetType {
    STATIC_OFFSET,
    DYNAMIC_OFFSET,
    EXPORTED_SYMBOL,
    IMPORTED_SYMBOL,
    LOCAL_SYMBOL,
    POINTER,
    RAW
}

export default class NativeFunctionHook extends AbstractHook {


    __:NodeInternalType = NodeInternalType.HOOK_NATIVE;

     _t:NodeInternalType = NodeInternalType.FUNC;

    /**
     * Targeted method
     * @field
     * @
     */
     _target:any  = null;

     _targetType: HookTargetType = HookTargetType.STATIC_OFFSET;

     _tpl:any = null;

    _weight = 0;


    constructor( pData:any = null) {
        super();

        if(pData != null)
            for(const i in pData){
                this[i] = pData[i];
            }
    }

    isTargetExportedSymbol(){
        return (this._targetType==HookTargetType.EXPORTED_SYMBOL);
    }

    isTargetImportedSymbol(){
        return (this._targetType==HookTargetType.IMPORTED_SYMBOL);
    }

    isTargetStaticOffset(){
        return (this._targetType==HookTargetType.STATIC_OFFSET);
    }

    isTargetDynOffset(){
        return (this._targetType==HookTargetType.DYNAMIC_OFFSET);
    }

    isTargetLocalSymbol(){
        return (this._targetType==HookTargetType.LOCAL_SYMBOL);
    }

    isTargetByPointer(){
        return (this._targetType==HookTargetType.POINTER);
    }

    isRawTarget(){
        return (this._targetType==HookTargetType.RAW);
    }

    /**
     * To check if the hook target the specified method
     *
     * @param {ModelMethod} pNode The target to verify
     * @return {boolean} Return TRUE if target specified node is targeted, else FALSE
     * @method
     * @since 1.0.0
     */
    isTarget(pNode: ModelFunction): boolean {
        return ( this._target.getUID() === pNode.getUID());
    }

    setTarget( pNode:ModelFunction) {
        this._target = pNode;
    }
    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    getTarget():any {
        return this._target;
    }

}
