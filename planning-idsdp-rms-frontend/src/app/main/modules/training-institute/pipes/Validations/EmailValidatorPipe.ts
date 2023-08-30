import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: 'email'
})
export class EmailValidatorPipe implements PipeTransform {
    transform(value: any): any {
        console.log(value)
        let isValid: boolean = true;
        if (value === undefined) {
            isValid = false;
        } else if (value === '') {
            isValid = false;
        }else if(value === null)
        {
            isValid = false;
        }else if(!value.includes('@'))
        {
            isValid = false;
        }

        return isValid;
    }

}
