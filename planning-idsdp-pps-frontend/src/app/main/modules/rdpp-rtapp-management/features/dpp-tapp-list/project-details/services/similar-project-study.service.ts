import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SimilarProjectStudyUrlConstant} from '../constants/similar-project-study.url.constants';
import {SimilarProjectStudy} from '../models/similar-project-study.model';
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class SimilarProjectStudyService {

    constructor(private _http: HttpClient) {
    }

    saveSimilarProjectStudy(similarProjectStudy: SimilarProjectStudy): Observable<any> {
        console.log(similarProjectStudy);
        return this._http.post(SimilarProjectStudyUrlConstant.CREATE_SIMILAR_PROJECT_STUDY, similarProjectStudy).pipe(map((res: any) => {
            return res;
        }));
    }

    getSimilarProjectStudy(projectId) {
        return this._http.get(SimilarProjectStudyUrlConstant.GET_SIMILAR_PROJECT_STUDY + '/' + projectId).pipe(map((res: any) => {
            return res;
        }));
    }

    udpateSimilarProjectStudy(model, projectId) {
        return this._http.put(SimilarProjectStudyUrlConstant.UPDATE_SIMILAR_PROJECT_STUDY + '/' + projectId, model).pipe(map((res: any) => {
            return res;
        }));
    }

    getMajorItem(majorItem) {
        return this._http.get(SimilarProjectStudyUrlConstant.GET_MAJOR_ITEM + '/' + majorItem).pipe(map((res: any) => {
            return res;
        }));
    }
}
