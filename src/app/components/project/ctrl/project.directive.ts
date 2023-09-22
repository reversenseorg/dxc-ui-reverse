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
