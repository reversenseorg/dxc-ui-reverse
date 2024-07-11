import {Nullable} from "../../../base/Nullable";
import {Subject} from "rxjs";


export enum DxcSelectionType {
  TEXT,
  NODE
}

export enum PasteLocationType {
  INPUT,
  TEXTAREA,
  SELECT,
  LIST,
  EDITOR
}

export interface DxcSelection {
  type:DxcSelectionType,
  el:any,
  short?:string,
  raw?:any
}

export interface PasteLocation {
  type:PasteLocationType,
  el:any,
  start?:number,
  end?:number
}

/**
 * Manage every selection, and act as primary step before copy/paste
 *
 * @class
 */
export class SelectionManager {

  /**
   * Last selection event (raw event)
   *
   * @private
   */
  private _latest:any = null;

  private _size:number;

  current:DxcSelection[] = [];

  onSelect$:Subject<any> = new Subject<any>();

  constructor( pMaxSize = 100){
    this._size = pMaxSize
  }

  /**
   * To flush current selection
   *
   * Often called internally before to make a new selection
   *
   * @return {Selection[]} All element selected
   * @method
   */
  flush():DxcSelection[] {
      const old = this.current;
      this.current = [];
      return old;
  }


  /**
   * To make a new selection, and select a node
   *
   * @param {any} pComponent
   * @method
   */
  select( pDomSelection:Selection){

    /*
    switch (pDomSelection.type){
      case "Caret":
        break;
      case "Range":
        break;
    }*/

    this._latest = pDomSelection;

    if(pDomSelection.anchorNode==null){
      return ;
    }

    switch (pDomSelection.anchorNode.nodeType){
      case Node.TEXT_NODE:
        this.selectText( pDomSelection.toString());
        break;
      case Node.ELEMENT_NODE:
        if(pDomSelection.anchorNode){

          switch (pDomSelection.anchorNode.nodeName) {
            case "ACE-EDITOR":
              this.selectNode( pDomSelection.anchorNode, (pDomSelection.anchorNode as any).env.editor.getSelectedText());
              break;
            case "APP-SUBNAVBAR-INPUT":
              //this.selectText(pDomSelection.toString());
              this.selectNode( pDomSelection.anchorNode.firstChild, pDomSelection.toString());
              break;
            default:
              const nestedInput = this.getPasteLocationFromFocus(true);
              if((nestedInput != null)&& (nestedInput.end!=null) && (nestedInput.start!=null) && (nestedInput.end > nestedInput.start)){
                this.selectText( nestedInput.el.value.substring(nestedInput.start,nestedInput.end));
              }else{
                this.selectNode( pDomSelection.anchorNode);
              }
              break;
          }
        }

        break;
    }
  }

  /**
   * To make a new selection, and select a node
   *
   * @param {any} pComponent
   * @method
   */
  selectNode( pComponent:any, pShortVal:string=""){

    this.flush();
    this.appendNode(pComponent,pShortVal);

    this.onSelect$.next(pComponent);

    //console.log("[SELECTION][NEW] node : ",pComponent,pShortVal);
  }

  /**
   * To make a new selection, and select raw text
   *
   * @param {any} pText
   * @method
   */
  selectText( pText:string){
    this.flush();
    this.appendText(pText);

    //console.log("[SELECTION][NEW] text : ",pText);
  }

  /**
   * To append a node to the current selection
   *
   * @param pComponent
   * @method
   */
  appendNode( pComponent:any, pShortVal:string){
    this.current.push({ type:DxcSelectionType.NODE, el:pComponent, short:pShortVal });
  }

  /**
   * To append a text to the current selection
   *
   * @param pText
   * @method
   */
  appendText( pText:string){
    this.current.push({ type:DxcSelectionType.TEXT, el:pText });
  }

  getSelection():DxcSelection[] {
    return this.current;
  }

  getNewest():DxcSelection {
    return this.current[this.current.length-1];
  }

  getOldest():DxcSelection {
    return this.current[0];
  }



  isTextLocation():boolean {
    const target:DxcSelection = this.getNewest();

    return (target.type == DxcSelectionType.NODE)
      || (target.el.nodeName.indexOf('INPUT')>-1)
      || (target.el.nodeName.indexOf('TEXTAREA')>-1);
  }

  /**
   * To get the element where the text must be paste
   *
   * If focused element is not an input field, it search it
   *
   * @method
   */
  getPasteLocationFromFocus( pIncludeDisabled = false):Nullable<PasteLocation>{
    const anchor = this._latest.anchorNode;
    let siblingEl:any = null;

    for( let i=0; i<anchor.childNodes.length; i++){

      siblingEl = anchor.childNodes[i];

      switch (siblingEl.nodeName) {
        case 'TEXTAREA':
          if(siblingEl.className=="ace_text-input"){
            return {
              type: PasteLocationType.EDITOR,
              el: siblingEl.parentNode,
              start: siblingEl.selectionStart,
              end: siblingEl.selectionEnd,
            };
          }
          else if(!siblingEl.disabled || pIncludeDisabled){
            return {
              type: PasteLocationType.TEXTAREA,
              el: siblingEl,
              start: siblingEl.selectionStart,
              end: siblingEl.selectionEnd,
            };
          }
          break;
        case 'INPUT':
          if(!siblingEl.disabled || pIncludeDisabled){
            return {
              type: PasteLocationType.INPUT,
              el: siblingEl,
              start: siblingEl.selectionStart,
              end: siblingEl.selectionEnd,
            };
          }
          break;
      }
    }

    return null;
  }
}
