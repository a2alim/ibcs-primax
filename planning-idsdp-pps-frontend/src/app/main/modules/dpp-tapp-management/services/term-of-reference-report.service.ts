import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {environment} from '../../../../../environments/environment';
import {Observable} from 'rxjs';
import {IResponseBody} from '../../../core/models/response';
import {EcnecMeetingModel} from "../models/ecnec-meeting.model";
import {ECNEC, GET_ACTIVE_LIST, GET_ALL} from "../constants/ecnec-meeting.constant";
import {
    FIND_BY_PCUUID_AND_REPORT_INDEX,
    TERM_OF_REFERENCE_REPORT
} from "../constants/term-of-reference-report.constant";
import {ITermOfReferenceReportModel} from "../models/term-of-reference-report.model";
import {FIND_BY_PCUUID} from "../constants/assign-ecnec-meeting.constant";
import {map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class TermOfReferenceReportService extends CrudRequestService<ITermOfReferenceReportModel> {


    constructor(private http: HttpClient) {
        super(http, TERM_OF_REFERENCE_REPORT);
    }

    findByPcUuidAndReportIndex(pcUuid, reportIndex){
        const url: string = this._BASE_URL + FIND_BY_PCUUID_AND_REPORT_INDEX + pcUuid + '/' + reportIndex;
        return this.http.get(url).pipe(map((res: any) => {
            return res;
        }));
    }
}
