import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { SpeakerEvaluationModel } from 'app/main/modules/training-institute/models/speaker-evaluation.model';
import { PaginationResponse } from "../models/pagination-response.model";
import { SpeakerEvaluationReportModel } from 'app/main/modules/training-institute/models/speaker-evaluation-report.model';

@Injectable({
    providedIn: 'root'
})
export class SpeakerEvaluationService {

    baseTiEndPoint = environment.ibcs.tiBackend;

    constructor(private http: HttpClient) {
    }

    addSpeakerEvaluation(speakerEvaluationModel: SpeakerEvaluationModel) {
        return this.http.post(this.baseTiEndPoint + "speaker-evaluation", speakerEvaluationModel);
    }

    getSpeakerEvaluationReports(size: number, page: number) {
        return this.http.get<PaginationResponse<SpeakerEvaluationReportModel[]>>(this.baseTiEndPoint + "speaker-evaluation?pageNo=" + page + "&pageSize=" + size);
    }

    createEvaluation(data: any): any {
        return this.http.post(this.baseTiEndPoint + "ti-speaker-evaluation/save-evaluation", data);
    }

    gridList(data: any) : any{
        return this.http.post(this.baseTiEndPoint + "ti-speaker-evaluation/grid-list", data);
    }
}
