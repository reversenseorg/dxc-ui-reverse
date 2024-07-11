import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {Nullable} from "../../../base/Nullable";
import {OutputService} from "../../output/ctrl/output.service";
import {Tag} from "../../../models/tags/Tag";
import ModelMethod from "../../../models/ModelMethod";
import ModelClass from "../../../models/ModelClass";
import ModelField from "../../../models/ModelField";
import {IconModel, IconModelCollection} from "../../../base/icon/IconModel";
import {CODE_ICONS} from "../icons";
import {NgbTooltipConfig} from "@ng-bootstrap/ng-bootstrap";
import {NodeInternalType} from "../../../models/NodeInternalType";
import {INode, Node} from "../../../models/INode";
import {TagService} from "../../tag/ctrl/tag.service";
import {ModelFunction} from "../../../models/ModelFunction";
import ModelPackage from "../../../models/ModelPackage";
import {CodeControllerService} from "../ctrl/code-controller.service";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxc-node-alias',
    template: `
        <ng-container *ngIf="item.alias!=null; else noAlias">
            <span [ngClass]="aliasClass" [ngbTooltip]="getText()" >@{{ item.alias }}</span>
        </ng-container>
        <ng-template #noAlias>
            {{ getText() }}
        </ng-template>
    `,
    styleUrls: ['../explorer-code/explorer-code.component.scss'],
    providers: [NgbTooltipConfig],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeAliasComponent {

    @Input() item:any; //ModelMethod|ModelClass|ModelField|ModelFunction|ModelPackage;
    @Input() text:Nullable<string> = null;
    @Input() aliasClass = "text-warning";

    constructor() {

    }


    getText():string {
        console.log("getText() of ",this.item);
        if (this.text==null){
            switch (this.item.__){
                case NodeInternalType.METHOD:
                    this.text = this.item.__signature__;
                    break;
                case NodeInternalType.CLASS:
                    this.text = this.item.name;
                    break;
                case NodeInternalType.FUNC:
                    this.text = this.item.name;
                    break;
                case NodeInternalType.FIELD:
                    this.text = this.item.__signature__;
                    break;
                case NodeInternalType.PACKAGE:
                    this.text = this.item.name;
                    break;
            }
        }

        return this.text as string;
    }
}
