import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'nid_number'
})
export class NidValidatorPipe implements PipeTransform {
    transform(value: any): any {

        console.log(value)
        let isValid: boolean = false;
        if (value === null) {
            isValid = true;
        }

        // if (value !== null) {
        //     if (value.toString().length === 11) {
        //         isValid = true;
        //     } else if (value.toString().length === 17) {
        //         isValid = true;
        //     }
        // }

        if (value !== null) {
            if (value.toString().length === 10) {
                isValid = true;
            } else if (value.toString().length === 13) {
                isValid = true;
            } else if (value.toString().length === 17) {
                isValid = true;
            }
        }

        return isValid;
    }

}
