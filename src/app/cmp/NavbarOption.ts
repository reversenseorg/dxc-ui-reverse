import {IconView} from "./IconView";
import {Nullable} from "../base/Nullable";


export class NavbarOption {
  id:Nullable<string> = null;
  tip:Nullable<string> = null;
  label:Nullable<string> = null;
  icon: Nullable<IconView> = null;
  observer: any = null;
}
