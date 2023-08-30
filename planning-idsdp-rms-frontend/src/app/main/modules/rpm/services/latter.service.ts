import { Injectable } from '@angular/core';

import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { ApiService } from "../../../core/services/api/api.service";


@Injectable(
    {
        providedIn: 'root'
    }
)
export class LatterService {

    baseRmsRpmApiEndPoint = environment.ibcs.rpmBackend;

    constructor(private apiService: ApiService,) {

    }


    saveData(data): Observable<any> {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/latter/save', data);
    }

    editData(letterId, data): Observable<any> {
        return this.apiService.update(this.baseRmsRpmApiEndPoint + 'api/latter/' + letterId + '/update', data);
    }

    getLetterById(id: string): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/latter/' + id);
    }

    getLetterDetailsById(id: string): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/latter/letter-details/' + id);
    }

    getLetterList(): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/latter');
    }

    getLetterList2(catId: number): Observable<any> {
        return this.apiService.get(this.baseRmsRpmApiEndPoint + 'api/latter/get-list/' + catId);
    }

    deleteLetter(id: string): Observable<any> {
        return this.apiService.delete(this.baseRmsRpmApiEndPoint + 'api/latter/', id);
    }

    saveEmailData(seminarEmailModel: any) {
        return this.apiService.post(this.baseRmsRpmApiEndPoint + 'api/seminar-email/create', seminarEmailModel);
    }
}
