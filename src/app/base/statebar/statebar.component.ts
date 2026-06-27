/*
 *
 *     Reversense platform / dxc-ui-reverse :  Reversense is an automated reverse engineering and analysis platform
 *     focused on security, privacy, quality, accessibility and safety assessment of software, including mobile app and firmware.
 *     Copyright (C) 2026  Reversense SAS
 *
 *     This program is free software: you can redistribute it and/or modify
 *     it under the terms of the GNU Affero General Public License as published
 *     by the Free Software Foundation, either version 3 of the License, or
 *     (at your option) any later version.
 *
 *     This program is distributed in the hope that it will be useful,
 *     but WITHOUT ANY WARRANTY; without even the implied warranty of
 *     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *     GNU Affero General Public License for more details.
 *
 *     You should have received a copy of the GNU Affero General Public License
 *     along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'dxc-statebar',
  templateUrl: './statebar.component.html',
  styleUrls: ['./statebar.component.scss'],
  styles: [`
    .dxc-statebar {
      line-height:20px;
      max-height:20px;
      background: #333;

      position: fixed;
      bottom:0px;
      min-width:100vw;
      color:white;
      font-size:0.8em;
    }
  `]
})
export class StatebarComponent implements OnInit, OnChanges {

  @Input() height:number = 20;
  @ViewChild('statebar',{ static:true, read:ElementRef}) bar:ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.hasOwnProperty('height')){
      this.bar.nativeElement.style.height = changes['height'].currentValue+'px';
      this.bar.nativeElement.style.maxHeight = changes['height'].currentValue+'px';
    }
  }

}
