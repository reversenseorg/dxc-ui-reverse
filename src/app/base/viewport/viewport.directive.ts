import { Directive, ViewContainerRef } from '@angular/core';

// @ts-ignore
@Directive({
  selector: '[viewportHost]',
})
export class ViewportDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
