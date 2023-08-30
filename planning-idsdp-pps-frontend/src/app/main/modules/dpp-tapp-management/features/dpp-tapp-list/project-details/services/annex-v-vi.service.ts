import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AnnexVVIUrlConstants} from '../constants/annex-vvi.url.constants';
import {AnnexVVI} from '../models/annex-v-vi.model';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AnnexVViService {

    constructor(private _http: HttpClient) {
    }

    saveAnnexVVI(annexVVI: AnnexVVI): Observable<any> {

        let jsonBody = {
            projectConceptUuid: annexVVI.projectConceptUuid,
        };
        const body = JSON.stringify(jsonBody);
        const formData = new FormData();
        formData.append('attachmentFile', annexVVI.currentFile);
        formData.append('annex-vvi', body);
        return this._http.post(AnnexVVIUrlConstants.CREATE_ANNEXVVI, formData).pipe(map((res: any) => {
            return res;
        }));
    }

    getAnnexV_VI(projectId) {
        return this._http.get(AnnexVVIUrlConstants.GET_ANNNEX_V_VI + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    updateAnnexVI(annexVVI: AnnexVVI, pcUuid: string): Observable<any> {
        let jsonBody = {
            projectConceptUuid: annexVVI.projectConceptUuid,
        };
        const body = JSON.stringify(jsonBody);
        const formData = new FormData();
        formData.append('attachmentFile', annexVVI.currentFile);
        formData.append('annex-vvi', body);
        return this._http.put(AnnexVVIUrlConstants.UPDATE_ANNEX_V_VI +'/'+pcUuid, formData).pipe(map((res: any) => {
            return res;
        }));
    }
}
