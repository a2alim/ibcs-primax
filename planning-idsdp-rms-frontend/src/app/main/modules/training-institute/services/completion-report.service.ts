import {Injectable} from '@angular/core';
import {CompletionReportModel} from "../models/completion-report.model";
import {environment} from "../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {PaginationResponse} from "../models/pagination-response.model";
import {CompletionReportResponseModel} from "../models/completion-report-response.model";

@Injectable({
    providedIn: 'root'
})
export class CompletionReportService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    save(completionReport: CompletionReportModel) {
        return this.http.post(this.baseTiEndPoint + 'completion-reports', completionReport);
    }

    update(completionReport: CompletionReportModel, completionReportId: number) {
        return this.http.put(this.baseTiEndPoint + 'completion-reports/' + completionReportId, completionReport);
    }

    getList(page: number, size: number) {
        return this.http.get<PaginationResponse<CompletionReportResponseModel[]>>(this.baseTiEndPoint + 'completion-reports?pageNo=' + page + '&pageSize=' + size);
    }

    
    getById(Id: number) {
        return this.http.get<CompletionReportResponseModel>(
            this.baseTiEndPoint + "completion-reports/" + Id);
    }

    getReport(completionReportId: number) {
        return this.http.get<CompletionReportModel>(this.baseTiEndPoint + 'completion-reports/' + completionReportId);
    }
}
