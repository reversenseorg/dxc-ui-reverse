import { Directive, ViewContainerRef } from '@angular/core';

// @ts-ignore
@Directive({
  selector: '[terminalHost]',
})
export class TerminalDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
