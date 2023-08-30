import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: 'phoneMobileNo'
})
export class PhoneNumberValidatorPipe implements PipeTransform {
    transform(value: any): any {
        console.log(value)
let reg = /^[0-9]{11}$/;
console.log(reg.test(value));

          let isValid: boolean = true;
          if (value.toString() === undefined) {
              isValid = false;
          } else if (value.toString() === '') {
              isValid = false;
          }else if(value.toString() === null)
          {
              isValid = false;
          }
        //   else if(value.toString().trim().length !== 11)
        //   {
        //       isValid = false;
        //   }
          else if(!reg.test(value)){
              isValid = false;
          }


          return isValid;


    }

    /* transform(value: number, exponent = 1): number {
         console.log(Math.pow(value, exponent));
         return Math.pow(value, exponent);
     }*/

}
