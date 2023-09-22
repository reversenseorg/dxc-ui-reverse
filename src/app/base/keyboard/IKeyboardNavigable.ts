

export interface IKeyboardNavigable {
  getCUID():number;
  onKeyPress( pEvent:KeyboardEvent):void;
}
