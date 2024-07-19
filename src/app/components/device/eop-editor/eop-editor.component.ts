import {
    ChangeDetectorRef,
    Component,
    Input,
    OnInit
} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {PrivilegedExecutionStrategy} from "../../../models/devices/PrivilegedExecutionStrategy";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-device-eop-editor',
    templateUrl: './eop-editor.component.html',
    styles:[`
      div.project-card {
        
        background-color: var(--card-bg);
        color: var(--card-text);
        border: 1px solid var(--input-border);
        border-radius: var(--card-border-radius);
        
        .project-app {
          color: var(--card-text-high);
        }
        .project-name {
          font-size: 0.8rem;
          color: var(--text-100);
          text-decoration: underline;
        }
      }
      
    `]
})
export class EopEditorComponent implements OnInit {

    @Input() strategy:PrivilegedExecutionStrategy;
    @Input() height: number = 200;

    readonly gIcons = GLOBAL_ICONS;

    editingName: boolean =  false;

    constructor(private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }

    onPaste(ext: string, ext2: any) {

    }

    quitEditMode($event: any) {

    }

    saveName($event: any) {

    }
}
