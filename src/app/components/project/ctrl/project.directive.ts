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

import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";
import {Directive, Input, OnDestroy} from "@angular/core";
import {ProjectService} from "./project.service";
import {Subscription} from "rxjs";
import {map, tap} from "rxjs/operators";



// @ts-ignore
@Directive({
  selector: '[dxcInputValidation]',
  providers: [{provide: NG_VALIDATORS, useExisting: DxcInputValidationDirective, multi: true}]
})
export class DxcInputValidationDirective implements Validator, OnDestroy {
  // @ts-ignore
  @Input('dxcToken') ppt: string;

  private validation: Subscription;

  constructor( private projSvc:ProjectService) {}

  validate(pControl: AbstractControl): ValidationErrors | null {

    if(pControl.value==null|| pControl.value.length==0)
      return null;

    this.validation = this.projSvc
      .validate(pControl.value, this.ppt)
      .pipe(
        map( pRes => {
          if(pRes.valid!==null){

            console.log(pRes);
            this.resetValidationErrors(pControl)
            if(pRes.valid==false){
              pControl.setErrors({ 'incorrect':true, 'dxcType':pRes.err[0]});
            }
          }
        })
      )
      .subscribe();
    return null;

  }

  resetValidationErrors(pControl:AbstractControl){
    pControl.setErrors(null);
  }

  ngOnDestroy() {
    if(this.validation != null){
      this.validation.unsubscribe();
    }
  }
}
