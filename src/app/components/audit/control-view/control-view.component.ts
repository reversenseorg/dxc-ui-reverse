import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {GLOBAL_ICONS} from "../../../cmp/GLOBAL_ICONS";
import {TOPO_ICONS} from "../../topology/icons";
import {OutputService} from "../../output/ctrl/output.service";
import {AuditController} from '../ctrl/AuditController';
import {AuditService} from "../ctrl/audit.service";
import {UIException} from "../../../base/error/UIException";
import Control from "../../../models/audit/common/Control";
import {DomSanitizer} from "@angular/platform-browser";
import {Metadata, MetadataType} from "../../../models/audit/common/Metadata";


@Component({
  selector: 'dxe-audit-control-view',
  templateUrl: './control-view.component.html',
  styleUrls: ['../audit.scss','../../../forms.scss',"../../../../../node_modules/flag-icons/css/flag-icons.min.css" ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlViewComponent implements AfterViewInit {


  @Input() ctrl: Control;
  @Input() controller: AuditController;
  @Input() level:number = 0;
  @Input() offset: number;
  @Input() numType: string = "num";
  @Input() showID: boolean = false;
  @Input() parentNum: string = "";


  gIcons:any = GLOBAL_ICONS;
  tIcons:any = TOPO_ICONS;


  constructor(
    private auditService: AuditService,
    private outputSvc:OutputService,
    private domSanitizer:DomSanitizer,
    private _changeRef:ChangeDetectorRef) {

  }

  /**
   * To init component
   */
  ngAfterViewInit(): void {

    if(this.controller.app==null){
      throw UIException.APP_NOT_INITIALIZED;
    }
    //this.searchCtrl = this.controller.app.getController('ctrl:search');
  }

  getOffset():string {
    switch (this.numType){
      case "num":
        return this.offset+"";
      case "alpha":
        // 0x41 = A, 0x5A = Z
        let offset = this.offset;
        let num = this.offset % (0x5A-0x41);
        let n = String.fromCharCode(0x41+this.offset);
        if(num == offset){
          return n;
        }

        // todoo
        return "XX"+n;

        // (this.offset-num)/(0x5A-0x41)

        break;
      default:
        return this.offset+"";
    }
  }

  calcPadding() {
    return ((this.level)*1.1)+"em";
  }


  hasProfiles():boolean {
    for(let k in (this.ctrl as any)._meta){
      if(k.startsWith("profile.")) return  true;
    }
    return false;
  }

  getProfileTags():any[] {
    const profiles:any[] = [];
    for(let k in (this.ctrl as any)._meta){
      if(k.startsWith("profile.")) profiles.push(((this.ctrl as any)._meta[k]));
    }
    return profiles;
  }

  hasExtraMeta():boolean {
    return ((this.ctrl as any).metadata !=null);
  }

  getExtraMeta():any {
    return (this.ctrl as any).metadata;
  }

  getExtraLinks():Metadata[] {
    const links:Metadata[] = [];
    for(let l=0 ;l<this.ctrl.metadata.length; l++){
      if(this.ctrl.metadata[l].type==MetadataType.URI){
        links.push(this.ctrl.metadata[l]);
      }
    }
    return links;
  }


  /**
   * To get canonicalized offset (A.1, A.A, 1.A, ....) according to format for
   * local offset and parent one.
   *
   * @returns {string} Canonical ID
   */
  getCanonicalOffset():string {
    if(this.parentNum.length>0){
      return this.parentNum+"."+this.getOffset();
    }else{
      return this.getOffset();
    }
  }

  calcStyles(pWhere:string):any{
    switch (pWhere){
      case 'title':
        return {
          fontSize: 2*((1+(0.5*this.level))/(this.level+1))+"em",
          fontWeight: 'bold',
        //  paddingLeft: this.level+"em"
        };
        break;
      case 'tag':
        let tagStyle:any = {
          fontSize: 2*((1+(0.5*this.level))/(this.level+1))+"em",
          fontWeight: 'bold',
          textAlign:'center'
        };
        this.ctrl.metadata.map(x => {
          if(x.key.startsWith("styles.")){
            const ppt = x.key.substring(7);
            switch (ppt){
              case "bgColor":
                tagStyle.backgroundColor = x.value;
                break;
              case "":
              case undefined:
              case null: break;
              default:
                tagStyle[ppt] = x.value;
                break;
            }
          }
        });
        return tagStyle
        break;
      case 'subtitle':
        return {
          fontSize: 1*(1/(this.level+1))+"em",
        //  paddingLeft: this.level+"em"
        };
        break;
      default:
        return {};
    }
  }

  getProfileStyle(pName:string) {
    let style = 'dxc-black';
    switch (pName){
      case "profile.MASVSv2":
        style = 'dxc-black-neg';
        break;
      case "profile.MASVSv1":
        style = 'dxc-black-neg';
        break;
    }

    return style;
  }
}
