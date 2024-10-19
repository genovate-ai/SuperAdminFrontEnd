import { Injectable } from "@angular/core";
import {
  AbstractControl,
  UntypedFormGroup,
  ValidatorFn,
  ValidationErrors,
} from "@angular/forms";
@Injectable({
  providedIn: "root",
})
export class FormValidatorsServiceService {
  constructor() {}
  emailDomain(control: AbstractControl): { [key: string]: any } | null {
    const email: string = control.value;
    const domain = email.substring(email.lastIndexOf("@") + 1);
    if (email === "" || domain.toLowerCase() === "pragimtech.com") {
      return null;
    } else {
      return { emailDomain: true };
    }
  }

  minimumAge(control: AbstractControl): { [key: string]: any } | null {
    var value = control.value;

    var today = new Date();

    var birthDate = new Date();
    birthDate.setDate(value.day);
    birthDate.setMonth(value.month);
    birthDate.setFullYear(value.year);

    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
    }

    if (age < 18) {
      return { minimumAge: true };
    }

    return null;
  }

  userNameValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value !== "" && !control.value.includes(".")) {
      return { invalidUserName: true };
    }
    return null;
  }

  emailValidator(control: AbstractControl): { [key: string]: any } | null {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(String(control.value).toLowerCase()) || control.value === '' || control.value === null) {
      return null;
    } else {
      return { 'invalidEmail': true }
    }
  }

  AgeMatch(age: string, exp: string){
    return (formGroup: UntypedFormGroup) => {
      var ageControl = formGroup.controls[age];
      var expControl = formGroup.controls[exp];
  
      if (expControl.errors && !expControl.errors.matching) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      
      const ageNum = Number(ageControl.value);
      const expNum = Number(expControl.value);
      if (ageNum < expNum) {
          expControl.setErrors({ matching: true });
      } else {
          expControl.setErrors(null);
      }
  }
  }


}
