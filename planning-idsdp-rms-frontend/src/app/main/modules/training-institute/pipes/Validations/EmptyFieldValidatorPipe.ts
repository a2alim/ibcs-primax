import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: 'required'
})
export class EmptyFieldValidatorPipe implements PipeTransform {
    transform(value: any): any {

        let isValid: boolean = true;
        if (value === undefined) {
            isValid = false;
        } else if (value === '') {
            isValid = false;
        }else if(value === null)
        {
            isValid = false;
        }

        return isValid;
    }

}
