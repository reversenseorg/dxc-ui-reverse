






import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TagService} from "../ctrl/tag.service";
import {Tag} from "../../../models/tags/Tag";
import {Nullable} from "../../../base/Nullable";
/**
 *
 */
@Component({
    selector: 'dxc-tag-badge',
    template: `
        <span (click)="displayMenu($event)"  [ngbTooltip]="tag.descr!=null? tag.descr : null" [ngClass]="gutters? 'badge dxc-no-gutters dxc-meta dxc-text-std '+css:'badge dxc-gutters dxc-meta dxc-text-std '+css" [ngStyle]="_styles">
            {{ tag._uid }}
        </span>
   `,
    styles: [`
        .interactive {
            cursor: pointer;
            &:hover {
              box-shadow: 0 0 8px #ddd;
            }
        }
   `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagBadgeComponent implements OnChanges {

    @Input() tag:Tag;
    @Input() editable = false;

    @Input() style:any = {};
    @Input() css:string = '';
    @Input() label:any = null;
    @Input() gutters:boolean = true;

    gIcons:any = GLOBAL_ICONS;
    _styles:any = {};
    constructor( public tagSvc:TagService, private _changeDRef:ChangeDetectorRef) {

    }

    ngOnChanges(changes: SimpleChanges) {
        if(changes.hasOwnProperty('tag')){
            const ntag = changes['tag'].currentValue;
            console.log(changes);
            this._styles = {
                backgroundColor: ntag.styles?.bgColor,
                color: ntag.styles?.color
            };
            console.log(this._styles);
        }
        if(changes.hasOwnProperty('editable')){
            const editable = changes['editable'].currentValue;
            if(editable && this.css.indexOf(' interactive')==-1){
                this.css += ' interactive';
            }
        }
        if(changes.hasOwnProperty('style')){
            this._styles = {
                ... this._styles,
                ... changes['style'].currentValue
            };
        }
        this._changeDRef.detectChanges();
    }

    displayMenu(pEvent:any){
        if(this.editable){
            this.tagSvc.onTagMenu$.next({
                tag: this.tag,
                evt: pEvent,
                editable: this.editable
            });
        }
    }

    showInfo(pEvent:any){

    }
}

