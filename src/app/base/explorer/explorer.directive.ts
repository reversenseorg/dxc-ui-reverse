import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[explorerHost]',
})
export class ExplorerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
