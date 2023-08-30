import {Injectable} from '@angular/core';

import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {ApiService} from "../../../core/services/api/api.service";


@Injectable(
    {
        providedIn: 'root'
    }
)
export class AwardLatterService {

    baseTiApiEndPoint = environment.ibcs.tiBackend;

    constructor(private apiService: ApiService,) {

    }


    saveData(data): Observable<any> {
        return this.apiService.post(this.baseTiApiEndPoint + 'award-letter', data);
    }

    editData(letterId, data): Observable<any> {
        return this.apiService.update(this.baseTiApiEndPoint + 'award-letter/' + letterId , data);
    }

    getLetterById(id: string): Observable<any> {
        return this.apiService.get(this.baseTiApiEndPoint + 'award-letter/' + id);
    }

    getLetterList(page: number, size: number): Observable<any> {
        return this.apiService.get(this.baseTiApiEndPoint + 'award-letter?page='+page+'&size='+size);
    }

    deleteLetter(id: string): Observable<any> {
        return this.apiService.delete(this.baseTiApiEndPoint + 'award-letter/', id);
    }

    saveEmailData(seminarEmailModel: any) {
        return this.apiService.post(this.baseTiApiEndPoint + 'api/seminar-email/create', seminarEmailModel);
    }

    checkProposalIsExist(fiscalYearID,proposalId): Observable<any> {
        return this.apiService.get(this.baseTiApiEndPoint + 'award-letter/'+fiscalYearID+'/'+proposalId);
    }
}
