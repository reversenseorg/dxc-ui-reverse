

export enum MerlinType {
    REQUEST,
    RULE
}

/**
 * @interface
 */
export interface MerlinPrimitive {
    TYPE: MerlinType

    execute?(pContext:any):Promise<any>;

    executeSync?(pContext:any):any;

    toJsonObject():any;

    toSearchString():string;

    hasBusSubscriber():boolean;

    getSubscribeList():string[];

    toBusSubscriber(pContext:any):any;
}
