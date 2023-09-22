import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[expandedHost]',
})
export class ExpandableDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
