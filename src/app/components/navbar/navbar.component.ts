import {AfterContentInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{

  public isMenuCollapsed = true;
  public extended:string = "";

  @Input() public parent:any = null;
  @ViewChild("mainNavbar") navbarEl: ElementRef;

  router:Router;

  constructor( route: ActivatedRoute,
               router: Router) {
      this.router = router;
  }


  onExtendMenu(pEvent:any):void {
    this.extended = pEvent.target.id;
  }

  newProject():void {
    //if(this.router)
    //this.router.navigate(['/project-new']);
    this.parent.showModal('new-project');
  }

}
