import {Nullable} from "../base/Nullable";
import {IconModel} from "../base/icon/IconModel";


export class NavbarOption {
  id:Nullable<string> = null;
  tip:Nullable<string> = null;
  label:Nullable<string> = null;
  icon: Nullable<IconModel> = null;
  observer: any = null;
}
