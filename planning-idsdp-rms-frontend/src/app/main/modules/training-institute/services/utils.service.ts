import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    constructor() {
    }

    public imageNameSpliter(fileName: string, splintedBy: string, index: number): string {

        let imageName: string;

        if (fileName.includes(splintedBy)) {
            const splitIdArray = fileName.split(splintedBy);
            imageName = splitIdArray[index];
        } else {
            imageName = fileName;
        }
        return imageName
    }

}
