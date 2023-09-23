import {Component, ElementRef, Input, OnInit, ViewChild} from "@angular/core";

@Component({
    selector: 'dxc-menu',
    template: `
   
    `,
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    @Input() fixed:boolean = false;
    @Input() end:boolean = false;

    constructor() { }

    ngOnInit(): void {

    }

    switchColor(){

    }
}
