
// @ts-ignore
import {AbstractHook} from "./AbstractHook";
import {NodeInternalType} from "./NodeInternalType";
import ModelMethod from "./ModelMethod";


export default class JavaMethodHook extends AbstractHook {

    __:NodeInternalType = NodeInternalType.HOOK_JAVA;

    _t:NodeInternalType = NodeInternalType.METHOD;

    /**
     * Targeted method
     * @field
     * @
     */
    public _target:ModelMethod = null;

    public method:ModelMethod;



    constructor( pData:any = null) {
        super();

        if(pData !== null)
            for(const i in pData){
                this[i] = pData[i];
            }
    }

    /**
     * To check if the hook target the specified method
     *
     * @param {ModelMethod} pNode The target to verify
     * @return {boolean} Return TRUE if target specified node is targeted, else FALSE
     * @method
     * @since 1.0.0
     */
    isTarget(pNode: ModelMethod): boolean {
        return ( this._target.getUID() === pNode.getUID());
    }

    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    getTarget():ModelMethod {
        return this._target;
    }

    /**
     * @return {ModelMethod} Targeted method
     * @method
     * @since 1.0.0
     */
    setTarget(pTarget:ModelMethod) {
        this._target = pTarget;
        this.method = pTarget;
        this.name = pTarget.name;
    }
}
