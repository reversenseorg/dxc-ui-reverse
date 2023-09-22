import {HostListener, Injectable} from "@angular/core";
import {IKeyboardNavigable} from "./IKeyboardNavigable";



@Injectable({
  providedIn: 'root'
})
export class KeyboardNavigationService {

  _cmp:any = {};
  /**
   * Hold focus element which must handle keyboard event
   *
   *
   * @type {IKeyboardNavigable}
   * @field7
   */
  activeEl:IKeyboardNavigable = null;



  stack:IKeyboardNavigable[] = [];

  constructor() {}

  /**
   * To change active element.
   *
   * The active element, is the element handling event
   *
   * @param {IKeyboardNavigable} pElement
   * @method
   * @since 1.0.0
   */
  focus( pElement:IKeyboardNavigable):void{
    console.log("Focusing :",pElement);
    this.stack.push(pElement);
    this.activeEl = pElement;
  }


  /**
   * To change active element.
   *
   * The active element, is the element handling event
   *
   * @param {IKeyboardNavigable} pElement
   * @method
   * @since 1.0.0
   */
  focusout( pElement:IKeyboardNavigable = null):void{
    if(pElement==null) {
      this.stack.pop();
    }else{
      //this.stack = this.stack.filter( pEl => (pEl.uid == pElement.uid));
    }
  }

  /**
   * To dispatch event captured at top level to the active element
   *
   * @param {any} pEvent Event data
   * @param {string} pSource Event source (keydown, keypress, ...)
   * @return {void}
   * @method
   * @since 1.0.0
   */
  dispatch( pEvent:KeyboardEvent, pSource:string):void {
    if(this.stack.length>0){
      let activ:IKeyboardNavigable = this.stack[this.stack.length-1];
        //activ.onKeyboardEvent.next({ e:pEvent, src:pSource });
        activ.onKeyPress(pEvent);
    }
  }

  /**
   * To register the component as navigable with keyboard
   *
   * The component must implements IKeyboardNavigable interface.
   *
   * @param pComponent
   */
  register( pComponent:IKeyboardNavigable):void {
    if(this._cmp[pComponent.getCUID()] == null){
      this._cmp[pComponent.getCUID()] = pComponent;
    }
  }
}
