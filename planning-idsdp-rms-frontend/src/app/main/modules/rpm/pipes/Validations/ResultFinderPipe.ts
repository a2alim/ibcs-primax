import {Pipe, PipeTransform} from "@angular/core";


@Pipe({
    name: 'resultName'
})
export class ResultFinderPipe implements PipeTransform {
    resultList: { id: number, name: string }[] = [
        {id: 1, name: "First Division/Class"},
        {id: 2, name: "Second Division/Class"},
        {id: 3, name: "Third Division/Class"},
        {id: 4, name: "Grade"},
    ];

    transform(value: any): any {
        const result: { id: number; name: string }[]= this.resultList.filter(res=>res.id ===  +value)
        return result[0].name;
    }

}
