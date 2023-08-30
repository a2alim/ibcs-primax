import {Pipe, PipeTransform} from '@angular/core';
import {toTitleCase} from "codelyzer/util/utils";

@Pipe({
  name: 'customCapitalize'
})
export class CustomCapitalizePipe implements PipeTransform {

  transform(value: any, arg1: any): any {
    let data = toTitleCase(value);
console.log(arg1);

    data.replace("Of", "of");
    data.replace("Nid", "NID");

    data = data.replace("Of", "of")

    return data;
  }

}
