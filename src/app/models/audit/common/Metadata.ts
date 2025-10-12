

export enum MetadataTopic {
    DFLOW_STEP="step",
    IMPACT="impact",
    CRITICITY="criticity",
    GROUP='grp',
    CATEGORY='category',
    ADVISORY='recommandation',
    RECO="recommandation",
    COUNTRY='country',
    PURPOSE='sbom.purpose',
    WEBSITE='www',
    COMPANY='company',
    REVISION='rev',
    EXTRACT='ext',
    CTRL='ctrl',
    PREFERED_ABI='pabi'
}

export enum PiiCriticity {
    LOW,
    MEDIUM,
    SENSITIVE
}

export enum PiiGroup {
    ID='identity',
    CONTACT='contact',
    BANKING='banking',
    INSURANCE='insurance',
    MARKETING='mktg',
    ACTIVITY='acti',
    DEVICE='dev',
    LEGAL='legal',
    BIO='bio'
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