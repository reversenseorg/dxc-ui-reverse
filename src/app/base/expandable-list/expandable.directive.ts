import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[expandedHost]',
  standalone: true
})
export class ExpandableDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
