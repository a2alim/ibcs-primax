import {Injectable} from '@angular/core';
import {environment} from '../../../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class FiscalYearService {

    rpmBackend = environment.ibcs.rpmBackend;


    constructor(private apiService: HttpClient) {

    }


    getAllActiveFiscalYear(): any {
        const api = this.rpmBackend+'api/fyw-sector-sub-sector/final-copy/fiscal-year/all';
        return this.apiService.get(api);
    }


}
