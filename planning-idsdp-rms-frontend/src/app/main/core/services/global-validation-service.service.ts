import { Injectable } from '@angular/core';
import { ValidatorFn, FormControl, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GlobalValidationServiceService {

  constructor() { }

  trimValidator(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      
      //console.log('control.value', control.value);
      
      if (control.value == '' || control.value == null ) {
        return {
          'customError': { value: fieldName + ' is required!' }
        };
      }

      if (/^\s/.test(control.value)) {
        return {
          'customError': { value: 'Remove first whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }

      if (/ +$/.test(control.value)) {
        return {
          'customError': { value: 'Remove last whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }

    };
  }

  checkNumbers(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      if (/[0-9]/.test(control.value)) {
        return {
          'customError': { value: 'Remove the number from ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  checkSpecialChar(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      let pattern = /[!@#$%^&*~()_+\-=\[\]{};':"\\|,.<>\/?]+/;
      if (pattern.test(control.value)) {
        return {
          'customError': { value: 'Remove the special character from ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  NameSpecialChar(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      let pattern = /[!@#$%^&*~()_+\-=\[\]{};':"\\|,<>\/?]+/;
      if (pattern.test(control.value)) {
        return {
          'customError': { value: 'Remove the special character from ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  SpaceValidator(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {

      if (/^\s/.test(control.value)) {
        return {
          'customError': { value: 'Remove first whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }

      if (/ +$/.test(control.value)) {
        return {
          'customError': { value: 'Remove last whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }

    };
  }

  checkString(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      let pattern = /[a-zA-Z ]/;
      if (pattern.test(control.value)) {
        return {
          'customError': { value: 'Remove the letters from ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  deviceNumber(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      let pattern = /^[a-zA-Z0-9_ ,-]*$/;
      if (!pattern.test(control.value)) {
        return {
          'customErrorDevice': { value: 'Only(_,-) special characters can be used with ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  whiteSpace(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {

      if (/^\s/.test(control.value)) {
        return {
          'customError': { value: 'Remove first whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }
      if (/ +$/.test(control.value)) {
        return {
          'customError': { value: 'Remove last whitespace from ' + fieldName.toLowerCase() + " field!" }
        };
      }
    };
  }

  graterThan50(fieldName: any): ValidatorFn {
    return (control: FormControl): { [key: string]: any } | null => {
      console.log(control.value);

      if (!control.value || control.value == '' || control.value == 0) {
        return {
          'customError': { value: fieldName + ' is required!' }
        };
      }
      if (control.value > 50) {
        return {
          'customError': { value: fieldName.toLowerCase() + ' not grater Than 50!' }
        }
      };
    }
  };

  maxNumberX(compaireNum, searchValue: string): void {  
    if (Number(searchValue) > Number(searchValue))
      {            
        // return {
        //   'customError': { value: fieldName.toLowerCase() + ' not grater Than 50!' }
        // }
      }
    }


    maxNumber(compaireNum:number, fieldName: any): ValidatorFn {
      return (control: FormControl): { [key: string]: any } | null => {
        if (Number(control.value) > compaireNum) {
          return {
            'customError': { value: fieldName + ' not grater than of '+ compaireNum +'!' }
          }
        };
      }
    };

}
