import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    SimpleChanges
} from "@angular/core";
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TagService} from "../ctrl/tag.service";
import {Tag} from "../../../models/tags/Tag";
import {Nullable} from "../../../base/Nullable";
import {NgClass, NgIf, NgStyle} from "@angular/common";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";
/**
 *
 */
@Component({
    selector: 'dxc-tag-badge',
    template: `
        <span *ngIf="tag !=null" (contextmenu)="displayMenu($event)"  [ngbTooltip]="tag.descr!=null? tag.descr : null" [ngClass]="gutters? 'badge dxc-no-gutters dxc-meta dxc-text-std '+css:'badge dxc-gutters dxc-meta dxc-text-std '+css" [ngStyle]="_styles">
            <ng-container *ngIf="showUid===true; else auto">
                 {{ tag._uid }}
            </ng-container>
            <ng-template #auto>
                {{ label!=null ? label : tag._uid }}
            </ng-template>
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
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone:true,
    imports: [
        NgIf,
        NgbTooltip,
        NgClass,
        NgStyle
    ]
})
export class TagBadgeComponent implements AfterViewInit,OnChanges {

    @Input() tag:Tag|null = null;
    @Input() tagUUID:number = -1;
    @Input() tagID:Nullable<string> = null;

    @Input() editable = false;

    @Input() style:any = {};
    @Input() css:string = '';
    @Input() label:any = null;
    @Input() gutters:boolean = true;

    @Input() showUid = false



    gIcons:any = GLOBAL_ICONS;
    _styles:any = {
        backgroundColor: (this.tag?.styles!=null ? (this.tag.styles as any).bgColor || (this.tag.styles as any).backgroundColor : '#aeff86'),
        color: (this.tag?.styles!=null ? (this.tag.styles as any).color : '#2d8f02'),
        border: '1px solid '+ (this.tag?.styles!=null ? (this.tag.styles as any).color : '#2d8f02'),
        borderRadius: '0.5em',
        fontSize: '0.8em'
    };

    constructor( public tagSvc:TagService, private _changeDRef:ChangeDetectorRef) {

    }

    ngAfterViewInit() {
        if(this.tagUUID>-1){
            this.tag = this.tagSvc.getTagByUUID(this.tagUUID);

            if(this.tag ==null){
                console.log("[TAG BADGE] Tag not found for UUID : "+this.tagUUID);
                return;
            }

            this._styles = {
                backgroundColor:  '#aeff86',
                color: '#2d8f02',
                border: '1px solid #2d8f02',
                borderRadius: '0.5em',
                fontSize: '0.8em'
            };

            if(this.tag.styles!=null){
                for(let k in (this.tag.styles as any)){
                    if(k=="color"){
                        this._styles.border = '1px solid '+ this.tag.styles[k];
                    }
                    this._styles[k] = this.tag.styles[k as any];
                }
            }

            if(this.label==null && this.tag.label!=null) this.label = this.tag.label;
            this._changeDRef.detectChanges();
        }else if(this.tag!=null){
            this._styles = {
                backgroundColor:  '#aeff86',
                color: '#2d8f02',
                border: '1px solid #2d8f02',
                borderRadius: '0.5em',
                fontSize: '0.8em'
            };

            if(this.tag.styles!=null){
                for(let k in (this.tag.styles as any)){
                    if(k=="color"){
                        this._styles.border = '1px solid '+ this.tag.styles[k];
                    }
                    this._styles[k] = this.tag.styles[k as any];
                }
            }
        }
    }


    ngOnChanges(changes: SimpleChanges) {
        if(changes.hasOwnProperty('tag') && changes['tag'].currentValue!=null){
            const ntag = changes['tag'].currentValue;

            if(this.label==null && ntag.label!=null) this.label = ntag.label;
            if(ntag.styles!=null){
                this._styles = {
                    backgroundColor: ntag.styles?.bgColor || ntag.styles?.backgroundColor || '#aeff86',
                    color: ntag.styles?.color,
                    border: `1px solid ${ntag.styles?.color}`,
                    borderRadius: '0.5em',
                    fontSize: '0.8em'
                };
            }else{
                this._styles = {
                    backgroundColor:  '#aeff86',
                    color:  '#2d8f02',
                    border: '1px solid #2d8f02',
                    borderRadius: '0.5em',
                    fontSize: '0.8em'
                };
            }

        }
        if(changes.hasOwnProperty('tagID')){
            this.tag = this.tagSvc.getTagByName(changes['tagID'].currentValue);
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
        console.log("Display Tag menu ",pEvent, this.tag);
        if(this.editable && this.tag!=null){
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

