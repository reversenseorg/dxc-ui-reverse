import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ProjectService} from "../ctrl/project.service";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import DexcaliburProject from "../../../models/DexcaliburProject";
import {Nullable} from "../../../base/Nullable";

let ctr = 0;


export interface TargetApp {
    method: "upload"|"store"|"download";

}





@Component({
    selector: 'dxs-project-card',
    templateUrl: './project-card.component.html',
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
export class ProjectCardComponent implements OnInit {

    @Input() project:DexcaliburProject;
    @Input() height: number = 200;


    readonly gIcons = GLOBAL_ICONS;

    constructor(private changeRef:ChangeDetectorRef) {

    }

    ngOnInit() {

    }

}
