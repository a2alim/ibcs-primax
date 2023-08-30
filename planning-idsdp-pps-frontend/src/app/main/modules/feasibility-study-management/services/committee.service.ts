import {Injectable} from '@angular/core';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../environments/environment';
import {map} from 'rxjs/operators';
import {CommitteeModel} from "../models/committee.model";
import {
    COMMITTEE_LIST_BY_FSP_MASTER_ID,
    COMMITTEE_MANAGEMENT,
    CREATE_COMMITTEE_WITH_MEMBER,
    UPDATE_COMMITTEE_WITH_MEMBER
} from "../constants/committee.constant";
import {Observable, Subject} from "rxjs";
import {IResponseBody} from "../../../core/models/response";

@Injectable({
    providedIn: 'root'
})
export class CommitteeService extends CrudRequestService<CommitteeModel> {

    private subject = new Subject<any>();

    constructor(private http: HttpClient) {
        super(http, COMMITTEE_MANAGEMENT);
    }

    feasibilitySummarySaveClickEvent() {
        this.subject.next();
    }

    // for get Feasibility study proposal summary Save Event
    getFeasibilitySummarySaveEvent(): Observable<any> {
        return this.subject.asObservable();
    }

    createCommitteeAndMemberWithAttachment(fspMasterId: number, commiteeModel: CommitteeModel, attachmentId: number): Observable<any> {
        commiteeModel.fspMasterId = fspMasterId;
        commiteeModel.attachmentId = attachmentId;
        const url: string = COMMITTEE_MANAGEMENT + CREATE_COMMITTEE_WITH_MEMBER;
        return this.http.post(url, commiteeModel).pipe(map((res: any) => {
            return res;
        }));
    }

    getIntroductionByFsrMasterId(fsrMasterId: number): any {
        const url: string = environment.ibcs.ppsFsBaseEndPoint + 'introduction/getIntroduction' + '/' + fsrMasterId;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }

    getCommitteeListByFspMasterId(fspMasterId: number, page?: number, size?: number): Observable<IResponseBody<CommitteeModel>> {
        const pageableRequestBodyDTO = {
            page: page,
            size: size,
        };
        return this.http.post<IResponseBody<CommitteeModel>>(this._BASE_URL + COMMITTEE_LIST_BY_FSP_MASTER_ID, {
            pageableRequestBodyDTO,
            fspMasterId: fspMasterId
        });
    }

    updateCommitteeWithMember(commiteeModel: CommitteeModel): Observable<any> {
        const url: string = COMMITTEE_MANAGEMENT + UPDATE_COMMITTEE_WITH_MEMBER;
        console.log(commiteeModel);
        console.log('-------------------');
        return this.http.put(url, commiteeModel).pipe(map((res: any) => {
            return res;
        }));
    }
}

