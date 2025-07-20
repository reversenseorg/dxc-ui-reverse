

export enum MetadataTopic {
    DFLOW_STEP="step",
    IMPACT="impact",
    CRITICITY="criticity"
}


export enum MetadataType {
    TEXT,
    ANY,
    URI,
    PARAM
}


export enum DataOperation {
    SOURCING,
    PROCESSING,
    STORING,
    SHARING,
    ENCRYPTING,
    DECRYPTING,
    HASHING
}

export interface Metadata {
    key:string|MetadataTopic;
    type:MetadataType;
    value:any|DataOperation;
}