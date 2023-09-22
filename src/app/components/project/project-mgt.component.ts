import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";


@Component({
  selector: 'dxc-project-mgt',
  template: `
      Recents ...
  `,
  styleUrls: ['./project.component.scss']
})
export class ProjectMgtComponent implements OnInit {

  activeSplash:string = 'recents';

  constructor( private activeRoute:ActivatedRoute) {
    console.log('test', this.activeRoute);
  }

  ngOnInit() {
    console.log(this.activeRoute);
  }

}
