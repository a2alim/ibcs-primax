import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {ModeOfFinanceModel} from '../models/mode-of-finance.model';
import {
    GET_MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID,
    MODE_OF_FINANCE,
    MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID
} from '../constants/mode-of-finance.constant';
import {Observable, Subject} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';

@Injectable({
    providedIn: 'root'
})
export class ModeOfFinanceService extends CrudRequestService<ModeOfFinanceModel> {

    private subject = new Subject<any>();

    constructor(private http: HttpClient) {
        super(http, MODE_OF_FINANCE);
    }

    projectSummarySaveClickEvent(){
        this.subject.next();
    }

    // for get ProjectSummary Save Event
    getProjectSummarySaveEvent():Observable<any>{
        return this.subject.asObservable();
    }

    // for get ModeOfFinanceList By ProjectSummary
    getModeOfFinanceListByProjectSummary(projectConceptMasterId: number, page?: number, size?: number): Observable<IResponseBody<ModeOfFinanceModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<ModeOfFinanceModel>>(this._BASE_URL + MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID, {
            pageableRequestBodyDTO,
            projectConceptMasterId: projectConceptMasterId
        });
    }

    // for get ModeOfFinanceList By ProjectSummary
    getModeOfFinanceListByProjectSummaryId(projectConceptMasterId: number): Observable<ModeOfFinanceModel[]> {
        return this.http.get<ModeOfFinanceModel[]>(this._BASE_URL + GET_MODE_OF_FINANCE_LIST_BY_PROJECT_SUMMARY_ID + "/" + projectConceptMasterId);
    }

}
