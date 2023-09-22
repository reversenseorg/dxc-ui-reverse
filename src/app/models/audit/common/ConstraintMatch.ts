import Constraint, {ConstraintType} from "./Constraint.js";

export class ConstraintMatch<T> {

    constraint:Constraint;

    el:T;

    subject:any;

    match:any;

    constructor(pConstraint:Constraint, pMatch:any, pSubject:any, pElement:T) {
        this.constraint = pConstraint;
        this.match = pMatch;
        this.subject = pSubject;
        this.el = pElement;
    }

    getType():ConstraintType {
        return this.constraint.type;
    }
}